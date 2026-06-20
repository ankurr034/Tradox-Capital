import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, prisma } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: (session.user as any).id },
      include: {
        portfolio: {
          include: { transactions: { orderBy: { timestamp: "desc" } } }
        }
      }
    });

    if (!clientProfile || !clientProfile.portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    const transactions = clientProfile.portfolio.transactions;

    // Generate CSV
    const header = ["Date", "Type", "Symbol", "Quantity", "Price", "Total Value"];
    const rows = transactions.map(tx => {
      const date = new Date(tx.timestamp).toISOString();
      return [
        date,
        tx.type,
        tx.symbol,
        (tx.quantity ?? 0).toString(),
        tx.price?.toString() || "0",
        (tx.totalAmount ?? 0).toString()
      ].join(",");
    });

    const csvContent = [header.join(","), ...rows].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="transactions_${clientProfile.id}.csv"`,
      },
    });
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
