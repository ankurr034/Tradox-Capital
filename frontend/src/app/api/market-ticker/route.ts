import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new (YahooFinance as any)();

export const dynamic = 'force-dynamic';

// Live market ticker — Yahoo Finance real-time data (migrated from the Express backend)
const TICKER_SYMBOLS = [
  { symbol: '^NSEI', label: 'NIFTY 50' },
  { symbol: '^BSESN', label: 'SENSEX' },
  { symbol: '^NSEBANK', label: 'Nifty Bank' },
  { symbol: 'USDINR=X', label: 'USD / INR' },
  { symbol: 'GC=F', label: 'Gold (USD)' },
  { symbol: 'RELIANCE.NS', label: 'Reliance' },
  { symbol: 'TCS.NS', label: 'TCS' },
  { symbol: 'HDFCBANK.NS', label: 'HDFC Bank' },
  { symbol: 'INFY.NS', label: 'Infosys' },
];

// In-memory cache to avoid hammering Yahoo on every poll
let tickerCache: { data: any[] | null; ts: number } = { data: null, ts: 0 };
const CACHE_TTL_MS = 30_000; // 30 seconds

export async function GET() {
  const now = Date.now();
  if (tickerCache.data && now - tickerCache.ts < CACHE_TTL_MS) {
    return NextResponse.json({
      success: true,
      count: tickerCache.data.length,
      updatedAt: new Date(tickerCache.ts).toISOString(),
      data: tickerCache.data,
    });
  }

  try {
    const symbols = TICKER_SYMBOLS.map((s) => s.symbol);
    const quotes = await yahooFinance.quote(symbols);
    const arr = Array.isArray(quotes) ? quotes : [quotes];

    const data = TICKER_SYMBOLS.map((t) => {
      const q = arr.find((x: any) => x?.symbol === t.symbol);
      if (!q || q.regularMarketPrice == null) return null;
      const price = q.regularMarketPrice;
      const change = q.regularMarketChange ?? 0;
      const pct = q.regularMarketChangePercent ?? 0;
      return {
        name: t.label,
        symbol: t.symbol,
        price,
        change,
        pct,
        isUp: change >= 0,
        currency: q.currency || 'INR',
        marketState: q.marketState || 'UNKNOWN',
      };
    }).filter(Boolean);

    if (data.length > 0) {
      tickerCache = { data, ts: now };
    }

    return NextResponse.json({
      success: true,
      count: data.length,
      updatedAt: new Date().toISOString(),
      data,
    });
  } catch (err: any) {
    console.error('[market-ticker] Endpoint error:', err?.message);
    // Serve last good cache if available
    if (tickerCache.data) {
      return NextResponse.json({
        success: true,
        count: tickerCache.data.length,
        updatedAt: new Date(tickerCache.ts).toISOString(),
        data: tickerCache.data,
      });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to fetch live market data' },
      { status: 500 }
    );
  }
}
