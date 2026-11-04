import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const data = await prisma.marketData.findMany({
    orderBy: { symbol: 'asc' },
  });
  return NextResponse.json(data);
}
