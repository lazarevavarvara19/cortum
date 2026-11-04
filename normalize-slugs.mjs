import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const news = await prisma.news.findMany();
  for (const n of news) {
    const normalized = n.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-zа-я0-9-]/g, '')
      .substring(0, 80);
    if (n.slug !== normalized) {
      await prisma.news.update({
        where: { id: n.id },
        data: { slug: normalized },
      });
      console.log(`Обновлён slug: "${n.slug}" → "${normalized}"`);
    }
  }
  console.log('✅ Все slug нормализованы');
  await prisma.$disconnect();
}
main();
