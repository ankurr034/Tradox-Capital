import { NextResponse } from 'next/server';
import { prisma } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const symbol = searchParams.get('symbol');
    const index = searchParams.get('index');
    
    let where: any = {};
    if (category) where.category = category;
    if (symbol) where.relatedSymbol = symbol;
    if (index) where.relatedIndex = index;

    const articles = await prisma.article.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: 20
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Fetch news error:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
