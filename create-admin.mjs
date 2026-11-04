import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const hash = bcrypt.hashSync('admin123', 10);
await prisma.user.upsert({
  where: { email: 'admin@cortum.ru' },
  update: {},
  create: { email: 'admin@cortum.ru', passwordHash: hash, role: 'admin' },
});
console.log('✅ Пользователь admin создан');
await prisma.$disconnect();
