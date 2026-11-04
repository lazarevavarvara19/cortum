import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const items = [
  { symbol: 'IMOEX', name: 'Индекс Мосбиржи', value: 3245.12, change: 0.42 },
  { symbol: 'USD/RUB', name: 'Доллар США', value: 89.75, change: -0.15 },
  { symbol: 'EUR/RUB', name: 'Евро', value: 98.30, change: 0.08 },
  { symbol: 'Brent', name: 'Нефть Brent', value: 72.40, change: 0.83 },
  { symbol: 'GOLD', name: 'Золото', value: 2650.5, change: 0.25 },
];

for (const item of items) {
  await prisma.marketData.upsert({
    where: { symbol: item.symbol },
    update: { value: item.value, change: item.change },
    create: item,
  });
}
console.log('✅ MarketData обновлены');
await prisma.$disconnect();
