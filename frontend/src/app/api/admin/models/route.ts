import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const models = await prisma.modelPortfolio.findMany({
      include: { allocations: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(models);
  } catch (error) {
    console.error("Fetch model portfolios error:", error);
    return NextResponse.json({ error: "Failed to fetch model portfolios" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, riskLevel, allocations } = await req.json();

    if (!name || !riskLevel || !allocations || !Array.isArray(allocations)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const model = await prisma.modelPortfolio.create({
      data: {
        name,
        description,
        riskLevel,
        allocations: {
          create: allocations.map((a: any) => ({
            symbol: a.symbol,
            targetPercentage: parseFloat(a.targetPercentage)
          }))
        }
      },
      include: { allocations: true }
    });

    return NextResponse.json(model);
  } catch (error) {
    console.error("Create model portfolio error:", error);
    return NextResponse.json({ error: "Failed to create model portfolio" }, { status: 500 });
  }
}
