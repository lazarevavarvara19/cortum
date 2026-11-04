import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rating = await prisma.rating.findUnique({
    where: { id },
    include: { company: true },
  });
  if (!rating) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({
    ...rating,
    data: typeof rating.data === 'string' ? JSON.parse(rating.data) : rating.data,
  });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    let dataArray = body.data;
    if (typeof dataArray === 'string') dataArray = JSON.parse(dataArray);
    if (!Array.isArray(dataArray)) dataArray = [];
    const dataString = JSON.stringify(dataArray);

    const updated = await prisma.rating.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        methodology: body.methodology,
        sources: body.sources,
        type: body.type,
        data: dataString,
        imageUrl: body.imageUrl,
        companyId: body.companyId || null,
      },
    });
    return NextResponse.json({ ...updated, data: dataArray });
  } catch (error: any) {
    console.error('Ошибка обновления рейтинга:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.rating.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
