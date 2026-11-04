import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const cats = [
  { slug: 'macro', name: 'Макро', description: 'Макроэкономика' },
  { slug: 'markets', name: 'Рынки', description: 'Фондовые и валютные рынки' },
  { slug: 'companies', name: 'Компании', description: 'Анализ компаний' },
  { slug: 'bonds', name: 'Облигации', description: 'Долговой рынок' },
  { slug: 'ratings', name: 'Рейтинги', description: 'Скоринг и рейтинги' },
  { slug: 'analytics', name: 'Аналитика', description: 'Глубокие исследования' },
];

for (const cat of cats) {
  await prisma.category.upsert({
    where: { slug: cat.slug },
    update: {},
    create: cat,
  });
}
console.log('✅ Категории созданы');
await prisma.$disconnect();
