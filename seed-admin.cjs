const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
async function main() {
  const email = 'admin@cortum.ru';
  const password = 'admin123';
  const hash = bcrypt.hashSync(password, 10);
  
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash: hash },
    create: { email, passwordHash: hash, role: 'admin' },
  });
  
  console.log('✅ Пользователь admin@cortum.ru успешно создан. Пароль: admin123');
  await prisma.$disconnect();
}
main();
