import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const news = await prisma.news.findMany();
  for (const n of news) {
    if (!n.slug || n.slug.trim() === '') {
      const slug = n.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-zа-я0-9-]/g, '')
        .substring(0, 80);
      await prisma.news.update({
        where: { id: n.id },
        data: { slug },
      });
      console.log(`Исправлен slug для "${n.title}" → ${slug}`);
    }
  }
  console.log('✅ Все slug заполнены');
  await prisma.$disconnect();
}
main();
