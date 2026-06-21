import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new (YahooFinance as any)();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbolParam = searchParams.get('symbol');

  if (!symbolParam) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    // Convert TradingView symbol (e.g., NSE:RELIANCE) to Yahoo Finance symbol (e.g., RELIANCE.NS)
    let yfSymbol = symbolParam;
    
    if (symbolParam.startsWith('NSE:')) {
      yfSymbol = symbolParam.replace('NSE:', '') + '.NS';
    } else if (symbolParam.startsWith('BSE:')) {
      yfSymbol = symbolParam.replace('BSE:', '') + '.BO';
    } else if (!symbolParam.includes('.')) {
      // Default to .NS if no exchange prefix and no dot is present for Indian stocks
      yfSymbol = symbolParam + '.NS';
    }

    const quote = await yahooFinance.quote(yfSymbol);

    return NextResponse.json({
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
      volume: quote.regularMarketVolume,
      dayHigh: quote.regularMarketDayHigh,
      dayLow: quote.regularMarketDayLow,
      marketCap: quote.marketCap,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
      trailingPE: quote.trailingPE,
      bookValue: quote.bookValue,
    });
  } catch (error) {
    console.error('Error fetching quote:', error);
    return NextResponse.json({ error: 'Failed to fetch live quote' }, { status: 500 });
  }
}
