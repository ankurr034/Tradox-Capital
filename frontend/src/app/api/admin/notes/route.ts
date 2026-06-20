import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, prisma } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { clientId, content } = await req.json();

    if (!clientId || !content) {
      return NextResponse.json({ error: "Client ID and content are required" }, { status: 400 });
    }

    const note = await prisma.note.create({
      data: {
        clientProfileId: clientId,
        content,
        authorId: (session.user as any).id,
      }
    });

    return NextResponse.json({ success: true, note }, { status: 201 });
  } catch (error) {
    console.error("Create note error:", error);
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}
