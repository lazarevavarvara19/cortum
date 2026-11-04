const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const data = JSON.parse(fs.readFileSync('companies.json', 'utf8'));

async function main() {
  let count = 0;
  for (const c of data) {
    await prisma.company.upsert({
      where: { ticker: c.ticker },
      update: c,
      create: c,
    });
    count++;
  }
  console.log(`✅ Успешно импортировано ${count} компаний!`);
  await prisma.$disconnect();
}

main().catch(e => {
  console.error('Ошибка импорта:', e);
  process.exit(1);
});
