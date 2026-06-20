import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.clientProfile.findUnique({
      where: { userId: (session.user as any).id },
      select: {
        id: true,
        kycStatus: true,
        brokerName: true,
        brokerAccountId: true,
        brokerToken: true
      }
    });

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
