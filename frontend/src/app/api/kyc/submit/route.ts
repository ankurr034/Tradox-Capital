import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, prisma } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== "CLIENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pan, phone, address } = await req.json();

    if (!pan || !phone || !address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Find the client profile
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: (session.user as any).id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Client profile not found" }, { status: 404 });
    }

    // Check if a PAN is already used by someone else
    const existingPan = await prisma.clientProfile.findUnique({
      where: { pan: pan.toUpperCase() },
    });

    if (existingPan && existingPan.id !== profile.id) {
      return NextResponse.json({ error: "PAN is already registered to another account" }, { status: 400 });
    }

    // Update profile to UNDER_REVIEW
    await prisma.clientProfile.update({
      where: { id: profile.id },
      data: {
        pan: pan.toUpperCase(),
        phone,
        address,
        kycStatus: "UNDER_REVIEW",
      },
    });

    return NextResponse.json({ success: true, message: "KYC submitted successfully" });
  } catch (error) {
    console.error("KYC Submit Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
