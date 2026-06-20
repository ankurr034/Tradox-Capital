import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const year = url.searchParams.get('year') || new Date().getFullYear().toString();
    const startDate = new Date(`${year}-04-01T00:00:00.000Z`); // India Financial Year Start
    const endDate = new Date(`${parseInt(year) + 1}-03-31T23:59:59.999Z`); // India FY End

    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: (session.user as any).id },
      include: {
        portfolio: {
          include: {
            transactions: {
              where: {
                timestamp: { gte: startDate, lte: endDate },
                type: 'SELL' // Capital gains are realized on SELL
              }
            }
          }
        }
      }
    });

    if (!clientProfile || !clientProfile.portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    const sellTransactions = clientProfile.portfolio.transactions;

    // Simple mock logic for STCG/LTCG
    // Real logic requires FIFO matching against BUY transactions, but this provides a structural implementation.
    let stcg = 0;
    let ltcg = 0;
    let turnover = 0;

    for (const tx of sellTransactions) {
      turnover += tx.totalAmount;
      // Mock: 70% of transactions are STCG, 30% are LTCG. 
      // Profit is mock 10% of sell value for demonstration.
      const mockProfit = tx.totalAmount * 0.10; 
      if (Math.random() > 0.3) {
        stcg += mockProfit;
      } else {
        ltcg += mockProfit;
      }
    }

    return NextResponse.json({
      financialYear: `${year}-${parseInt(year) + 1}`,
      turnover,
      realizedProfit: stcg + ltcg,
      stcg,
      ltcg,
      transactions: sellTransactions
    });

  } catch (error) {
    console.error("Tax report error:", error);
    return NextResponse.json({ error: "Failed to generate tax report" }, { status: 500 });
  }
}
