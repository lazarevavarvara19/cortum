import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const companies = await prisma.company.findMany({
    orderBy: { ticker: 'asc' },
    include: { ratings: { orderBy: { createdAt: 'desc' }, take: 1 } },
  });
  return NextResponse.json(companies);
}

export async function POST(req: Request) {
  const data = await req.json();
  // Преобразуем строки в числа, если пришли
  const numFields = ['revenue', 'ebitda', 'netIncome', 'totalDebt', 'marketCap'];
  for (const f of numFields) {
    if (data[f] !== undefined) data[f] = parseFloat(data[f]) || null;
  }
  const company = await prisma.company.create({ data });
  return NextResponse.json(company, { status: 201 });
}
