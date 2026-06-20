import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: (session.user as any).id },
      include: {
        portfolio: {
          include: {
            holdings: true,
            modelPortfolio: {
              include: { allocations: true }
            }
          }
        }
      }
    });

    if (!clientProfile || !clientProfile.portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    const portfolio = clientProfile.portfolio;

    if (!portfolio.modelPortfolio) {
      return NextResponse.json({ error: 'No model portfolio assigned. Ask an admin to assign one.' }, { status: 400 });
    }

    // Step 1: Calculate Total Portfolio Value (available funds + value of all holdings)
    // For simplicity, we'll use averagePrice for holding value in this mock instead of live price.
    // In a real app, you'd fetch live prices here.
    let totalValue = portfolio.availableFunds;
    portfolio.holdings.forEach(h => {
      totalValue += h.quantity * h.averagePrice;
    });

    // Step 2: Compare target allocations with actual holdings
    const recommendations: any[] = [];
    
    // Clear old pending optimizations
    await prisma.optimizationRecommendation.deleteMany({
      where: { portfolioId: portfolio.id, status: 'PENDING' }
    });

    // Calculate needed buy/sells for each allocation
    for (const alloc of portfolio.modelPortfolio.allocations) {
      const targetValue = (alloc.targetPercentage / 100) * totalValue;
      const holding = portfolio.holdings.find(h => h.symbol === alloc.symbol);
      const currentQuantity = holding ? holding.quantity : 0;
      const currentPrice = holding ? holding.averagePrice : 100; // Mock current price if we don't hold it
      const currentValue = currentQuantity * currentPrice;

      const difference = targetValue - currentValue;
      // If difference is significant enough (e.g. > Rs. 500)
      if (Math.abs(difference) > 500) {
        const action = difference > 0 ? 'BUY' : 'SELL';
        const qtyToTrade = Math.abs(difference) / currentPrice;
        
        recommendations.push({
          portfolioId: portfolio.id,
          action,
          symbol: alloc.symbol,
          quantity: qtyToTrade,
          estimatedPrice: currentPrice,
          reason: `Rebalance to model target of ${alloc.targetPercentage}%`
        });
      }
    }

    // Step 3: Identify holdings not in the model portfolio (to sell entirely)
    for (const holding of portfolio.holdings) {
      const inModel = portfolio.modelPortfolio.allocations.find(a => a.symbol === holding.symbol);
      if (!inModel && holding.quantity > 0) {
        recommendations.push({
          portfolioId: portfolio.id,
          action: 'SELL',
          symbol: holding.symbol,
          quantity: holding.quantity,
          estimatedPrice: holding.averagePrice,
          reason: 'Asset not in assigned model portfolio'
        });
      }
    }

    // Save recommendations
    if (recommendations.length > 0) {
      await prisma.optimizationRecommendation.createMany({
        data: recommendations
      });
    }

    const savedRecs = await prisma.optimizationRecommendation.findMany({
      where: { portfolioId: portfolio.id, status: 'PENDING' }
    });

    return NextResponse.json({ recommendations: savedRecs, totalValue });
  } catch (error) {
    console.error('Portfolio optimization error:', error);
    return NextResponse.json({ error: 'Failed to optimize portfolio' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: (session.user as any).id },
      include: {
        portfolio: {
          include: {
            optimizations: {
              where: { status: 'PENDING' }
            }
          }
        }
      }
    });

    return NextResponse.json(clientProfile?.portfolio?.optimizations || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}
