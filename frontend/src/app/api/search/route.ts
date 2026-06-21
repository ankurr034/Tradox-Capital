import { NextResponse } from 'next/server';
import allIndicesData from '@/data/all_indices.json';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new (YahooFinance as any)();

// Pre-compute a unique list of all stocks across all indices
const allStocksMap = new Map<string, any>();

Object.values(allIndicesData.constituents).forEach((constituents: any) => {
  constituents.forEach((stock: any) => {
    if (!allStocksMap.has(stock.symbol)) {
      allStocksMap.set(stock.symbol, stock);
    }
  });
});

const allStocks = Array.from(allStocksMap.values());

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  const lowerQuery = query.toLowerCase();

  try {
    // 1. Fuzzy match local data
    const matches = allStocks.filter(stock => 
      stock.symbol.toLowerCase().includes(lowerQuery) || 
      stock.company.toLowerCase().includes(lowerQuery) ||
      stock.sector.toLowerCase().includes(lowerQuery)
    );

    matches.sort((a, b) => {
      const aExact = a.symbol.toLowerCase() === lowerQuery;
      const bExact = b.symbol.toLowerCase() === lowerQuery;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return 0;
    });

    let topMatches = matches.slice(0, 5); 
    
    // 2. Fetch live prices for local matches
    if (topMatches.length > 0) {
      const yfSymbols = topMatches.map(m => m.symbol + '.NS');
      const quotes = await yahooFinance.quote(yfSymbols).catch(() => []); 
      
      topMatches = topMatches.map(match => {
        const quote = quotes.find((q: any) => q.symbol === match.symbol + '.NS');
        return {
          ...match,
          price: quote?.regularMarketPrice || null,
          change: quote?.regularMarketChange || null,
          changePercent: quote?.regularMarketChangePercent || null
        };
      });
    }

    // 3. Search Yahoo Finance directly for mutual funds and global stocks
    try {
      const searchResults = await yahooFinance.search(query, { newsCount: 0, quotesCount: 5 });
      const yfMatches = searchResults.quotes.map((q: any) => ({
        symbol: q.symbol,
        company: q.shortname || q.longname || q.symbol,
        sector: q.quoteType === 'MUTUALFUND' ? 'Mutual Fund' : (q.quoteType || 'Equity'),
        price: null, // Will be fetched on demand by the client
        change: null,
        changePercent: null,
        isYF: true
      }));

      // Merge and deduplicate
      const existingSymbols = new Set(topMatches.map(m => m.symbol));
      for (const yfm of yfMatches) {
        if (!existingSymbols.has(yfm.symbol)) {
          topMatches.push(yfm as any);
        }
      }
    } catch (e) {
      console.error('YF search failed', e);
    }

    return NextResponse.json(topMatches.slice(0, 8));

    return NextResponse.json([]);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
