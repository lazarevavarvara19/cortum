import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email, categories } = await req.json();
  if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

  // Сохраняем или обновляем подписчика
  const sub = await prisma.emailSubscription.upsert({
    where: { email },
    update: { isActive: true },
    create: { email, unsubscribeToken: crypto.randomUUID() },
  });

  // Обновляем категории подписки
  if (categories && Array.isArray(categories)) {
    await prisma.subscriptionCategory.deleteMany({ where: { subscriptionId: sub.id } });
    await prisma.subscriptionCategory.createMany({
      data: categories.map((catId: string) => ({
        subscriptionId: sub.id,
        categoryId: catId,
      })),
    });
  }

  // Получаем названия выбранных категорий для письма
  let catNames: string[] = [];
  if (categories && categories.length > 0) {
    const cats = await prisma.category.findMany({
      where: { id: { in: categories } },
      select: { name: true },
    });
    catNames = cats.map(c => c.name);
  }

  // 1) Уведомление администратору (вам)
  try {
    await resend.emails.send({
      from: 'CORTUM <onboarding@resend.dev>',
      to: 'v12961089@gmail.com',
      subject: '🟣 Новый подписчик CORTUM',
      html: `
        <h2>Новый подписчик</h2>
        <p><b>Email:</b> ${email}</p>
        <p><b>Категории:</b> ${catNames.length > 0 ? catNames.join(', ') : 'все'}</p>
        <p><b>Дата:</b> ${new Date().toLocaleString('ru-RU')}</p>
      `,
    });
  } catch (err) {
    console.error('Не удалось отправить уведомление администратору:', err);
  }

  // 2) Приветственное письмо подписчику (уходит только если вы верифицируете домен;
  //    на бесплатном Resend без домена письма можно отправлять только на свой адрес)
  try {
    await resend.emails.send({
      from: 'CORTUM <onboarding@resend.dev>',
      to: email,
      subject: 'Вы подписаны на CORTUM',
      html: `
        <h2>Спасибо за подписку!</h2>
        <p>Вы успешно подписались на рассылку CORTUM.</p>
        <p><b>Выбранные категории:</b> ${catNames.length > 0 ? catNames.join(', ') : 'все'}</p>
        <p>Мы будем присылать вам новости и аналитику по выбранным темам.</p>
        <hr>
        <p style="font-size:12px;color:#6B7280">CORTUM — независимое аналитическое агентство</p>
      `,
    });
  } catch (err) {
    console.error('Не удалось отправить письмо подписчику:', err);
  }

  return NextResponse.json({ success: true });
}
