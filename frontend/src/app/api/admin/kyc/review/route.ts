import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, prisma } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only allow ADMIN or MANAGER to review KYC
    if (!session || !session.user || !['ADMIN', 'MANAGER'].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { profileId, action } = await req.json();

    if (!profileId || !['APPROVE', 'REJECT'].includes(action)) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

    await prisma.clientProfile.update({
      where: { id: profileId },
      data: {
        kycStatus: newStatus,
      },
    });

    return NextResponse.json({ success: true, message: `KYC ${newStatus}` });
  } catch (error) {
    console.error("KYC Review Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
