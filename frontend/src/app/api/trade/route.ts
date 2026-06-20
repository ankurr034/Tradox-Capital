import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if ((session.user as any).role === 'ADMIN') {
      return NextResponse.json({ error: 'Admins cannot execute trades. Please log in as a Client.' }, { status: 403 });
    }

    const { symbol, action, quantity, price, orderType = "MARKET", targetPrice, triggerPrice } = await req.json();

    if (!symbol || !action || !quantity || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const qty = parseFloat(quantity);
    const orderPrice = parseFloat(price);
    const totalAmount = qty * orderPrice;

    // Find the client's portfolio
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: (session.user as any).id },
      include: { portfolio: true }
    });

    if (!clientProfile || !clientProfile.portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    const portfolioId = clientProfile.portfolio.id;
    const isMarketOrder = orderType === "MARKET";

    if (action.toUpperCase() === 'BUY') {
      // Check funds
      if (clientProfile.portfolio.availableFunds < totalAmount) {
        return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 });
      }

      await prisma.$transaction(async (tx) => {
        if (isMarketOrder) {
          // Execute BUY immediately
          await tx.portfolio.update({
            where: { id: portfolioId },
            data: {
              availableFunds: { decrement: totalAmount },
              usedFunds: { increment: totalAmount },
            }
          });

          // Add/Update Holding
          const existingHolding = await tx.holding.findUnique({
            where: { portfolioId_symbol: { portfolioId, symbol } }
          });

          if (existingHolding) {
            const newQty = existingHolding.quantity + qty;
            const newInvestedValue = existingHolding.investedValue + totalAmount;
            const newAvgPrice = newInvestedValue / newQty;

            await tx.holding.update({
              where: { id: existingHolding.id },
              data: { quantity: newQty, investedValue: newInvestedValue, averagePrice: newAvgPrice }
            });
          } else {
            await tx.holding.create({
              data: { portfolioId, symbol, quantity: qty, averagePrice: orderPrice, investedValue: totalAmount, assetType: "STOCK" }
            });
          }

          // Log Transaction
          await tx.transaction.create({
            data: { portfolioId, type: "BUY", symbol, quantity: qty, price: orderPrice, totalAmount }
          });
        }

        // Record Order
        await tx.order.create({
          data: {
            portfolioId,
            type: "BUY",
            orderType,
            symbol,
            quantity: qty,
            targetPrice: targetPrice ? parseFloat(targetPrice) : null,
            triggerPrice: triggerPrice ? parseFloat(triggerPrice) : null,
            status: isMarketOrder ? "EXECUTED" : "PENDING"
          }
        });
      });

      return NextResponse.json({ success: true, message: isMarketOrder ? `Successfully bought ${qty} ${symbol}` : `${orderType} Order placed for ${qty} ${symbol}` });
    
    } else if (action.toUpperCase() === 'SELL') {
      // Check holdings
      const existingHolding = await prisma.holding.findUnique({
        where: { portfolioId_symbol: { portfolioId, symbol } }
      });

      if (!existingHolding || existingHolding.quantity < qty) {
        return NextResponse.json({ error: 'Insufficient shares to sell' }, { status: 400 });
      }

      await prisma.$transaction(async (tx) => {
        if (isMarketOrder) {
          // Execute SELL immediately
          await tx.portfolio.update({
            where: { id: portfolioId },
            data: { availableFunds: { increment: totalAmount } }
          });

          // Reduce/Remove Holding
          if (existingHolding.quantity === qty) {
            await tx.holding.delete({ where: { id: existingHolding.id } });
          } else {
            const newQty = existingHolding.quantity - qty;
            const portionSold = existingHolding.averagePrice * qty;
            const newInvestedValue = Math.max(0, existingHolding.investedValue - portionSold);
            await tx.holding.update({
              where: { id: existingHolding.id },
              data: { quantity: newQty, investedValue: newInvestedValue }
            });
          }

          // Log Transaction
          await tx.transaction.create({
            data: { portfolioId, type: "SELL", symbol, quantity: qty, price: orderPrice, totalAmount }
          });
        }

        // Record Order
        await tx.order.create({
          data: {
            portfolioId,
            type: "SELL",
            orderType,
            symbol,
            quantity: qty,
            targetPrice: targetPrice ? parseFloat(targetPrice) : null,
            triggerPrice: triggerPrice ? parseFloat(triggerPrice) : null,
            status: isMarketOrder ? "EXECUTED" : "PENDING"
          }
        });
      });

      return NextResponse.json({ success: true, message: isMarketOrder ? `Successfully sold ${qty} ${symbol}` : `${orderType} Order placed for ${qty} ${symbol}` });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Trade API Error:', error);
    return NextResponse.json({ error: 'Failed to execute trade' }, { status: 500 });
  }
}
