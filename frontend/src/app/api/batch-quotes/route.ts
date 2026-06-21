import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new (YahooFinance as any)();

// In-memory cache to prevent Yahoo Finance rate limits
const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL_MS = 5000; // 5 seconds cache

// Chunk array helper
const chunkArray = <T>(array: T[], size: number) => {
  const chunked = [];
  let index = 0;
  while (index < array.length) {
    chunked.push(array.slice(index, size + index));
    index += size;
  }
  return chunked;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbolsParam = searchParams.get('symbols');

  if (!symbolsParam) {
    return NextResponse.json({ error: 'Symbols parameter is required' }, { status: 400 });
  }

  try {
    const rawSymbols = symbolsParam.split(',');
    
    const result: Record<string, any> = {};
    const symbolsToFetch: { raw: string, yf: string }[] = [];

    // Check cache first
    const now = Date.now();
    for (const sym of rawSymbols) {
      const cached = cache.get(sym);
      if (cached && (now - cached.timestamp < CACHE_TTL_MS)) {
        result[sym] = cached.data;
      } else {
        let yfSym = sym;
        if (sym.startsWith('NSE:')) yfSym = sym.replace('NSE:', '') + '.NS';
        else if (sym.startsWith('BSE:')) yfSym = sym.replace('BSE:', '') + '.BO';
        else if (!sym.includes('.')) yfSym = sym + '.NS';
        
        symbolsToFetch.push({ raw: sym, yf: yfSym });
      }
    }

    // Fetch missing symbols in chunks to avoid URL limits/timeouts
    if (symbolsToFetch.length > 0) {
      const chunks = chunkArray(symbolsToFetch, 50);
      
      for (const chunk of chunks) {
        const yfSymbols = chunk.map(c => c.yf);
        try {
          const quotes = await yahooFinance.quote(yfSymbols);
          
          for (let i = 0; i < quotes.length; i++) {
            const q = quotes[i];
            const rawSymObj = chunk.find(c => c.yf === q.symbol) || chunk[i];
            const rawSym = rawSymObj.raw;
            
            const data = {
              price: q.regularMarketPrice || 0,
              change: q.regularMarketChange || 0,
              changePercent: q.regularMarketChangePercent || 0,
              prevClose: q.regularMarketPreviousClose || 0,
              dayHigh: q.regularMarketDayHigh || 0,
              dayLow: q.regularMarketDayLow || 0,
              volume: q.regularMarketVolume || 0,
              marketCap: q.marketCap || 0,
              fiftyTwoHigh: q.fiftyTwoWeekHigh || 0,
              fiftyTwoLow: q.fiftyTwoWeekLow || 0
            };
            
            result[rawSym] = data;
            
            // Update cache
            cache.set(rawSym, { data, timestamp: now });
          }
        } catch (chunkErr) {
          console.error('Error fetching chunk:', chunkErr);
          // Continue with next chunk even if one fails
        }
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching batch quotes:', error);
    return NextResponse.json({ error: 'Failed to fetch batch quotes' }, { status: 500 });
  }
}
