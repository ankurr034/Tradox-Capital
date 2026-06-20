import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { brokerName, accountId } = await req.json();

    if (!brokerName || !accountId) {
      return NextResponse.json({ error: 'Broker name and Account ID are required' }, { status: 400 });
    }

    // Mock OAuth Token Generation
    const mockToken = `brk_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;

    // Save to ClientProfile
    await prisma.clientProfile.update({
      where: { userId: (session.user as any).id },
      data: {
        brokerName,
        brokerAccountId: accountId,
        brokerToken: mockToken
      }
    });

    return NextResponse.json({ success: true, brokerName, token: mockToken });
  } catch (error) {
    console.error('Broker connection error:', error);
    return NextResponse.json({ error: 'Failed to connect broker' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.clientProfile.update({
      where: { userId: (session.user as any).id },
      data: {
        brokerName: null,
        brokerAccountId: null,
        brokerToken: null
      }
    });

    return NextResponse.json({ success: true, message: 'Broker disconnected successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to disconnect broker' }, { status: 500 });
  }
}
