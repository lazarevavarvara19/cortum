import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const where: any = {};
  if (type) where.type = type;
  const ratings = await prisma.rating.findMany({
    where,
    include: { company: true },
    orderBy: { createdAt: 'desc' },
  });
  const result = ratings.map(r => ({
    ...r,
    data: typeof r.data === 'string' ? JSON.parse(r.data) : r.data,
  }));
  return NextResponse.json(result);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let dataArray = body.data;
    if (typeof dataArray === 'string') {
      dataArray = JSON.parse(dataArray);
    }
    if (!Array.isArray(dataArray)) dataArray = [];
    const dataString = JSON.stringify(dataArray);

    const rating = await prisma.rating.create({
      data: {
        title: body.title,
        description: body.description || '',
        methodology: body.methodology || '',
        sources: body.sources || '',
        type: body.type || 'Прочее',
        data: dataString,
        imageUrl: body.imageUrl || null,
        companyId: body.companyId || null,
      },
    });

    return NextResponse.json({ ...rating, data: dataArray }, { status: 201 });
  } catch (error: any) {
    console.error('Ошибка создания рейтинга:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании', details: error.message },
      { status: 500 }
    );
  }
}
