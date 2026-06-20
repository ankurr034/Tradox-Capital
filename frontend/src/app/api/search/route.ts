import { NextResponse } from 'next/server';
import allIndicesData from '@/data/all_indices.json';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

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

    // Prioritize exact symbol matches first
    matches.sort((a, b) => {
      const aExact = a.symbol.toLowerCase() === lowerQuery;
      const bExact = b.symbol.toLowerCase() === lowerQuery;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return 0;
    });

    const topMatches = matches.slice(0, 8); // Return max 8 results for speed
    
    // 2. Fetch live prices for these matches
    if (topMatches.length > 0) {
      const yfSymbols = topMatches.map(m => m.symbol + '.NS');
      const quotes = await yahooFinance.quote(yfSymbols).catch(() => []); // Fail silently if YF rate limits
      
      const enrichedMatches = topMatches.map(match => {
        const quote = quotes.find((q: any) => q.symbol === match.symbol + '.NS');
        return {
          ...match,
          price: quote?.regularMarketPrice || null,
          change: quote?.regularMarketChange || null,
          changePercent: quote?.regularMarketChangePercent || null
        };
      });
      
      return NextResponse.json(enrichedMatches);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
