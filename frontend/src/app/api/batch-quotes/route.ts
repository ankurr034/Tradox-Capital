import { NextResponse } from 'next/server';
import { getBatchQuotes } from '@/lib/quotes';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbolsParam = searchParams.get('symbols');

  if (!symbolsParam) {
    return NextResponse.json({ error: 'Symbols parameter is required' }, { status: 400 });
  }

  try {
    const rawSymbols = symbolsParam.split(',');
    const result = await getBatchQuotes(rawSymbols);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching batch quotes:', error);
    return NextResponse.json({ error: 'Failed to fetch batch quotes' }, { status: 500 });
  }
}
