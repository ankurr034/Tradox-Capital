import { NextResponse } from 'next/server';
import { prisma } from '@/lib/auth';

// In a real application, this would be a CRON job or long-running background worker
export async function GET(req: Request) {
  // Derive the app's own origin from the incoming request so this works in any
  // deployment environment (no hardcoded localhost).
  const base = new URL(req.url).origin;
  try {
    const pendingOrders = await prisma.order.findMany({
      where: { status: 'PENDING' }
    });

    if (pendingOrders.length === 0) {
      return NextResponse.json({ message: "No pending orders to execute" });
    }

    let executedCount = 0;

    for (const order of pendingOrders) {
      // Fetch live price mock (Assume it hits target for demonstration if it's within a range)
      // In a real app, this compares against live tick data
      const res = await fetch(`${base}/api/quote?symbol=${encodeURIComponent(order.symbol)}`);
      if (!res.ok) continue;
      const quote = await res.json();
      const currentPrice = quote.price;

      let shouldExecute = false;

      if (order.orderType === 'LIMIT' && order.targetPrice) {
        shouldExecute = order.type === 'BUY' ? currentPrice <= order.targetPrice : currentPrice >= order.targetPrice;
      } else if ((order.orderType === 'STOP_LOSS' || order.orderType === 'GTT') && order.triggerPrice) {
        shouldExecute = order.type === 'BUY' ? currentPrice >= order.triggerPrice : currentPrice <= order.triggerPrice;
      }

      if (shouldExecute) {
        await prisma.$transaction(async (tx) => {
          if (order.type === 'BUY') {
            const totalAmount = order.quantity * currentPrice;
            
            // Check funds again
            const portfolio = await tx.portfolio.findUnique({ where: { id: order.portfolioId } });
            if (!portfolio || portfolio.availableFunds < totalAmount) {
              await tx.order.update({ where: { id: order.id }, data: { status: 'FAILED' } });
              return;
            }

            await tx.portfolio.update({
              where: { id: order.portfolioId },
              data: { availableFunds: { decrement: totalAmount }, usedFunds: { increment: totalAmount } }
            });

            const existingHolding = await tx.holding.findUnique({
              where: { portfolioId_symbol: { portfolioId: order.portfolioId, symbol: order.symbol } }
            });

            if (existingHolding) {
              const newQty = existingHolding.quantity + order.quantity;
              const newInvestedValue = existingHolding.investedValue + totalAmount;
              await tx.holding.update({
                where: { id: existingHolding.id },
                data: { quantity: newQty, investedValue: newInvestedValue, averagePrice: newInvestedValue / newQty }
              });
            } else {
              await tx.holding.create({
                data: { portfolioId: order.portfolioId, symbol: order.symbol, quantity: order.quantity, averagePrice: currentPrice, investedValue: totalAmount, assetType: "STOCK" }
              });
            }

            await tx.transaction.create({
              data: { portfolioId: order.portfolioId, type: "BUY", symbol: order.symbol, quantity: order.quantity, price: currentPrice, totalAmount }
            });

          } else {
            // SELL
            const totalAmount = order.quantity * currentPrice;
            
            const existingHolding = await tx.holding.findUnique({
              where: { portfolioId_symbol: { portfolioId: order.portfolioId, symbol: order.symbol } }
            });

            if (!existingHolding || existingHolding.quantity < order.quantity) {
              await tx.order.update({ where: { id: order.id }, data: { status: 'FAILED' } });
              return;
            }

            await tx.portfolio.update({
              where: { id: order.portfolioId },
              data: { availableFunds: { increment: totalAmount } }
            });

            if (existingHolding.quantity === order.quantity) {
              await tx.holding.delete({ where: { id: existingHolding.id } });
            } else {
              const portionSold = existingHolding.averagePrice * order.quantity;
              await tx.holding.update({
                where: { id: existingHolding.id },
                data: { quantity: existingHolding.quantity - order.quantity, investedValue: Math.max(0, existingHolding.investedValue - portionSold) }
              });
            }

            await tx.transaction.create({
              data: { portfolioId: order.portfolioId, type: "SELL", symbol: order.symbol, quantity: order.quantity, price: currentPrice, totalAmount }
            });
          }

          // Mark executed
          await tx.order.update({ where: { id: order.id }, data: { status: 'EXECUTED' } });

          // Mock Notification trigger
          // Wait, we need to find user id for portfolio
          const p = await tx.portfolio.findUnique({ where: { id: order.portfolioId }, include: { clientProfile: true } });
          if (p && p.clientProfile) {
            await tx.notification.create({
              data: {
                userId: p.clientProfile.userId,
                title: "Order Executed",
                message: `Your ${order.orderType} ${order.type} order for ${order.quantity} ${order.symbol} has been executed at ₹${currentPrice}.`,
                type: "TRADE"
              }
            });
          }

          executedCount++;
        });
      }
    }

    return NextResponse.json({ message: `Executed ${executedCount} pending orders out of ${pendingOrders.length}` });

  } catch (error) {
    console.error("Order execution cron failed", error);
    return NextResponse.json({ error: "Failed to process orders" }, { status: 500 });
  }
}
