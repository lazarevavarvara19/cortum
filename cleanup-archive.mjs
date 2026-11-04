import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const archiveSlugs = ['companies', 'ratings', 'analytics'];
  // Находим категорию macro (или создаём)
  let macroCategory = await prisma.category.findUnique({ where: { slug: 'macro' } });
  if (!macroCategory) {
    macroCategory = await prisma.category.create({ data: { slug: 'macro', name: 'Макро' } });
  }

  for (const slug of archiveSlugs) {
    const cat = await prisma.category.findUnique({ where: { slug } });
    if (cat) {
      // Обновляем все новости, привязанные к этой категории
      await prisma.news.updateMany({
        where: { categoryId: cat.id },
        data: { categoryId: macroCategory.id },
      });
      // Удаляем категорию
      await prisma.category.delete({ where: { slug } });
      console.log(`Категория ${slug} удалена, новости перенесены в macro`);
    } else {
      console.log(`Категория ${slug} не найдена`);
    }
  }
  console.log('Очистка завершена');
  await prisma.$disconnect();
}
main();
