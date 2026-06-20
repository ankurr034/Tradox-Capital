import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, password, phone, pan } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User, Profile, and Portfolio in one transaction
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "CLIENT",
        clientProfile: {
          create: {
            phone: phone || undefined,
            pan: pan || undefined,
            kycStatus: "APPROVED",
            portfolio: {
              create: {
                availableFunds: 10000000, // ₹1 Cr starting balance
                usedFunds: 0
              }
            }
          }
        }
      },
      include: {
        clientProfile: {
          include: { portfolio: true }
        }
      }
    });

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error: any) {
    console.error("Add client error:", error);
    return NextResponse.json({ error: "Failed to add client" }, { status: 500 });
  }
}
