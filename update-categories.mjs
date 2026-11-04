import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Переименовываем старые категории, если они есть, на более подходящие
  const renames = [
    { slug: 'companies', newName: 'Компании (архив)' },
    { slug: 'ratings', newName: 'Рейтинги (архив)' },
    { slug: 'analytics', newName: 'Аналитика (архив)' },
  ];
  for (const r of renames) {
    await prisma.category.updateMany({
      where: { slug: r.slug },
      data: { name: r.newName },
    });
  }
  // Добавляем/обновляем новые категории
  const newCategories = [
    { slug: 'world', name: 'Мир' },
    { slug: 'regions', name: 'Регионы' },
    { slug: 'commodities', name: 'Сырьё' },
    { slug: 'currencies', name: 'Валюты' },
    { slug: 'crypto', name: 'Крипто' },
  ];
  for (const cat of newCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: cat,
    });
  }
  console.log('Категории обновлены (старые переименованы, новые добавлены)');
  await prisma.$disconnect();
}
main();
