import { NextResponse } from 'next/server';
import { prisma } from '@/lib/auth';

export async function GET() {
  try {
    // Fetch all public portfolios
    const publicPortfolios = await prisma.portfolio.findMany({
      where: { isPublic: true },
      include: {
        clientProfile: {
          include: { user: true }
        },
        holdings: true,
      }
    });

    // Calculate mock returns for leaderboard ranking
    const leaderboard = publicPortfolios.map(p => {
      let invested = 0;
      let currentVal = 0;
      
      p.holdings.forEach(h => {
        invested += h.investedValue;
        // Mock current price as average + some random variance between -10% to +30% 
        // to make the leaderboard look dynamic and interesting.
        const mockCurrent = h.averagePrice * (1 + (Math.random() * 0.4 - 0.1));
        currentVal += (mockCurrent * h.quantity);
      });

      const pnl = currentVal - invested;
      const returnPercent = invested > 0 ? (pnl / invested) * 100 : 0;

      return {
        id: p.id,
        traderName: p.clientProfile.user.name,
        returnPercent,
        topHolding: p.holdings.length > 0 ? p.holdings.sort((a,b) => b.investedValue - a.investedValue)[0].symbol : 'CASH',
        followersCount: Math.floor(Math.random() * 500) + 10 // Mock followers since we haven't implemented full follow logic
      };
    });

    // Sort by highest return
    leaderboard.sort((a, b) => b.returnPercent - a.returnPercent);

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
