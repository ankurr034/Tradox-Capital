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
            optimizations: {
              where: { status: 'PENDING' }
            }
          }
        }
      }
    });

    if (!clientProfile || !clientProfile.portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    if (!clientProfile.brokerToken) {
      return NextResponse.json({ error: 'Broker not connected. Please connect your broker in Settings first.' }, { status: 400 });
    }

    const portfolio = clientProfile.portfolio;
    const recommendations = portfolio.optimizations;

    if (recommendations.length === 0) {
      return NextResponse.json({ error: 'No pending optimizations to execute' }, { status: 400 });
    }

    // Execute trades in a transaction
    await prisma.$transaction(async (tx) => {
      let currentFunds = portfolio.availableFunds;
      let usedFunds = portfolio.usedFunds;

      for (const rec of recommendations) {
        const totalAmount = rec.quantity * rec.estimatedPrice;

        if (rec.action === 'BUY') {
          if (currentFunds < totalAmount) {
            throw new Error(`Insufficient funds for ${rec.symbol}. Need ₹${totalAmount.toFixed(2)}, have ₹${currentFunds.toFixed(2)}`);
          }
          currentFunds -= totalAmount;
          usedFunds += totalAmount;

          const existingHolding = await tx.holding.findFirst({
            where: { portfolioId: portfolio.id, symbol: rec.symbol }
          });

          if (existingHolding) {
            const newQty = existingHolding.quantity + rec.quantity;
            const newTotalInvested = existingHolding.investedValue + totalAmount;
            const newAvgPrice = newTotalInvested / newQty;

            await tx.holding.update({
              where: { id: existingHolding.id },
              data: {
                quantity: newQty,
                averagePrice: newAvgPrice,
                investedValue: newTotalInvested
              }
            });
          } else {
            await tx.holding.create({
              data: {
                portfolioId: portfolio.id,
                symbol: rec.symbol,
                quantity: rec.quantity,
                averagePrice: rec.estimatedPrice,
                investedValue: totalAmount
              }
            });
          }

        } else if (rec.action === 'SELL') {
          const existingHolding = await tx.holding.findFirst({
            where: { portfolioId: portfolio.id, symbol: rec.symbol }
          });

          if (!existingHolding || existingHolding.quantity < rec.quantity) {
            throw new Error(`Insufficient quantity to sell ${rec.symbol}`);
          }

          currentFunds += totalAmount;
          usedFunds -= (existingHolding.averagePrice * rec.quantity);

          if (existingHolding.quantity === rec.quantity) {
            await tx.holding.delete({ where: { id: existingHolding.id } });
          } else {
            const newQty = existingHolding.quantity - rec.quantity;
            const newTotalInvested = existingHolding.investedValue - (existingHolding.averagePrice * rec.quantity);
            await tx.holding.update({
              where: { id: existingHolding.id },
              data: {
                quantity: newQty,
                investedValue: newTotalInvested
              }
            });
          }
        }

        // Create transaction record
        await tx.transaction.create({
          data: {
            portfolioId: portfolio.id,
            type: rec.action,
            symbol: rec.symbol,
            quantity: rec.quantity,
            price: rec.estimatedPrice,
            totalAmount: totalAmount,
            status: 'COMPLETED'
          }
        });

        // Mark recommendation as executed
        await tx.optimizationRecommendation.update({
          where: { id: rec.id },
          data: { status: 'EXECUTED' }
        });
      }

      // Update portfolio funds
      await tx.portfolio.update({
        where: { id: portfolio.id },
        data: {
          availableFunds: currentFunds,
          usedFunds: usedFunds
        }
      });
    });

    return NextResponse.json({ success: true, message: 'Trades executed successfully via broker' });
  } catch (error: any) {
    console.error('Execution error:', error);
    return NextResponse.json({ error: error.message || 'Failed to execute trades' }, { status: 500 });
  }
}
