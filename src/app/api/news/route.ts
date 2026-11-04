import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

function transliterate(text) {
  const map = {
    'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p',
    'р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'ts','ч':'ch','ш':'sh','щ':'sch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya',
    'А':'A','Б':'B','В':'V','Г':'G','Д':'D','Е':'E','Ё':'Yo','Ж':'Zh','З':'Z','И':'I','Й':'Y','К':'K','Л':'L','М':'M','Н':'N','О':'O','П':'P',
    'Р':'R','С':'S','Т':'T','У':'U','Ф':'F','Х':'H','Ц':'Ts','Ч':'Ch','Ш':'Sh','Щ':'Sch','Ъ':'','Ы':'Y','Ь':'','Э':'E','Ю':'Yu','Я':'Ya'
  };
  return text.split('').map(c => map[c] || c).join('')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .substring(0, 80);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const where: any = { published: true };
  if (category) where.category = { slug: category };
  const news = await prisma.news.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(news);
}

export async function POST(req: Request) {
  const data = await req.json();
  if (!data.slug || data.slug.trim() === '') {
    data.slug = transliterate(data.title || '');
  }
  const news = await prisma.news.create({ data });
  return NextResponse.json(news, { status: 201 });
}
