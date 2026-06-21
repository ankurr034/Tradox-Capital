import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
import { GoogleGenerativeAI } from '@google/generative-ai';

const yahooFinance = new (YahooFinance as any)();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function GET(req: Request, { params }: { params: Promise<{ symbol: string }> }) {
  try {
    const { symbol } = await params;
    
    // Parse symbol for Yahoo Finance format (e.g., NSE:RELIANCE -> RELIANCE.NS)
    let yfSymbol = decodeURIComponent(symbol);
    if (yfSymbol.startsWith('NSE:')) yfSymbol = yfSymbol.replace('NSE:', '') + '.NS';
    else if (yfSymbol.startsWith('BSE:')) yfSymbol = yfSymbol.replace('BSE:', '') + '.BO';
    else if (!yfSymbol.includes('.')) yfSymbol = yfSymbol + '.NS'; // default to NSE

    // Fetch data in parallel
    const [quote, summary, searchResult] = await Promise.all([
      yahooFinance.quote(yfSymbol).catch(() => null),
      yahooFinance.quoteSummary(yfSymbol, {
        modules: ['financialData', 'defaultKeyStatistics', 'assetProfile', 'incomeStatementHistory', 'balanceSheetHistory']
      }).catch(() => null),
      yahooFinance.search(yfSymbol, { newsCount: 10 }).catch(() => null)
    ]);

    if (!quote || !summary) {
      return NextResponse.json({ error: "Failed to fetch market data from Yahoo Finance" }, { status: 404 });
    }

    const { financialData, defaultKeyStatistics, assetProfile, incomeStatementHistory, balanceSheetHistory } = summary;

    // Parse Historical Financials for Charts
    const financialHistory = (incomeStatementHistory?.incomeStatementHistory || []).map((stmt: any) => ({
      date: stmt.endDate ? new Date(stmt.endDate).getFullYear() : 'Unknown',
      revenue: stmt.totalRevenue || 0,
      netIncome: stmt.netIncome || 0,
      grossProfit: stmt.grossProfit || 0
    })).reverse();

    // Build fundamentals object
    const fundamentals = {
      symbol: quote.symbol,
      companyOverview: assetProfile?.longBusinessSummary || 'No overview available.',
      peRatio: quote.trailingPE || defaultKeyStatistics?.trailingPE || 0,
      pbRatio: defaultKeyStatistics?.priceToBook || 0,
      roe: (financialData?.returnOnEquity || 0) * 100,
      roce: (financialData?.returnOnAssets || 0) * 100, // proxy
      debtToEquity: financialData?.debtToEquity || 0,
      revenueGrowth: (financialData?.revenueGrowth || 0) * 100,
      profitGrowth: (financialData?.earningsGrowth || 0) * 100,
      marketCap: quote.marketCap || 0,
      dividendYield: (quote.trailingAnnualDividendYield || 0) * 100,
      eps: quote.epsTrailingTwelveMonths || 0,
      bookValue: defaultKeyStatistics?.bookValue || 0,
      financialHistory
    };

    // Format news
    const news = (searchResult?.news || []).map((n: any) => ({
      title: n.title,
      summary: n.publisher,
      url: n.link,
      source: n.publisher,
      publishedAt: n.providerPublishTime ? new Date(n.providerPublishTime * 1000).toISOString() : new Date().toISOString(),
      impact: 'NEUTRAL' // Default for now
    }));

    // Generate AI Analysis via Gemini
    let aiAnalysis = null;
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are a professional Wall Street financial analyst. Analyze the following data for ${quote.symbol} (${quote.longName}):
      
      P/E: ${fundamentals.peRatio}
      P/B: ${fundamentals.pbRatio}
      ROE: ${fundamentals.roe}%
      Debt to Equity: ${fundamentals.debtToEquity}
      Revenue Growth: ${fundamentals.revenueGrowth}%
      
      Provide a JSON response ONLY, with no markdown formatting. The JSON must exactly match this structure:
      {
        "analystConsensus": "BUY" | "SELL" | "HOLD" | "STRONG BUY" | "STRONG SELL",
        "riskScore": (integer 0-100),
        "growthScore": (integer 0-100),
        "investmentThesis": "Brief paragraph",
        "bullishFactors": "2-3 bullet points",
        "bearishFactors": "2-3 bullet points",
        "targetPrice": (float based on current price ${quote.regularMarketPrice}),
        "confidence": (integer 0-100)
      }`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      aiAnalysis = JSON.parse(text);
    } catch (aiError) {
      console.error("AI Generation failed:", aiError);
      aiAnalysis = {
        analystConsensus: "HOLD",
        riskScore: 50,
        growthScore: 50,
        investmentThesis: "AI analysis currently unavailable.",
        bullishFactors: "-",
        bearishFactors: "-",
        targetPrice: quote.regularMarketPrice,
        confidence: 0
      };
    }

    return NextResponse.json({ fundamentals, aiAnalysis, news });
  } catch (error) {
    console.error("Research API error:", error);
    return NextResponse.json({ error: "Failed to fetch research data" }, { status: 500 });
  }
}
