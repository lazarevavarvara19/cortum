import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await prisma.company.findUnique({
    where: { id },
    include: { ratings: { orderBy: { createdAt: 'desc' } } },
  });
  if (!company) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(company);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await req.json();
  const numFields = ['revenue', 'ebitda', 'netIncome', 'totalDebt', 'marketCap'];
  for (const f of numFields) {
    if (data[f] !== undefined) data[f] = parseFloat(data[f]) || null;
  }
  const updated = await prisma.company.update({
    where: { id },
    data,
    include: { ratings: true },
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.company.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
