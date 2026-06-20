import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, prisma } from "@/lib/auth";

// PUT: Update Profile or Adjust Funds
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    if (body.action === 'adjustFunds') {
      const { amount } = body;
      const amountFloat = parseFloat(amount);
      if (isNaN(amountFloat)) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });

      const client = await prisma.clientProfile.findUnique({ where: { id }, include: { portfolio: true } });
      if (!client || !client.portfolio) return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });

      // Add or subtract funds
      const newAvailable = Math.max(0, client.portfolio.availableFunds + amountFloat);

      await prisma.portfolio.update({
        where: { id: client.portfolio.id },
        data: { availableFunds: newAvailable }
      });

      // Log transaction
      await prisma.transaction.create({
        data: {
          portfolioId: client.portfolio.id,
          type: amountFloat >= 0 ? "DEPOSIT" : "WITHDRAWAL",
          symbol: "CASH",
          quantity: 1,
          price: Math.abs(amountFloat),
          totalAmount: Math.abs(amountFloat)
        }
      });

      return NextResponse.json({ success: true });
    } else if (body.action === 'updateProfile') {
      const { phone, pan, kycStatus } = body;
      await prisma.clientProfile.update({
        where: { id },
        data: { phone, pan, kycStatus }
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin client update error:", error);
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 });
  }
}

// DELETE: Remove Client entirely
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    
    // Find the client to get their userId
    const client = await prisma.clientProfile.findUnique({
      where: { id },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Because of cascade deletes on the Prisma schema, 
    // deleting the User should delete the ClientProfile, Portfolio, Holdings, Transactions, and Notes.
    await prisma.user.delete({
      where: { id: client.userId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin client delete error:", error);
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 });
  }
}
