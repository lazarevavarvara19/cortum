import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAdminNotification(subscriberEmail: string, categories: string[]) {
  const categoryList = categories.length > 0 ? categories.join(', ') : 'все';
  await resend.emails.send({
    from: 'CORTUM <onboarding@resend.dev>',   // можно заменить на свой верифицированный домен
    to: 'v12961089@gmail.com',
    subject: 'Новый подписчик на CORTUM',
    html: `<p>На сайте CORTUM новый подписчик:</p>
           <p>Email: <b>${subscriberEmail}</b></p>
           <p>Категории: ${categoryList}</p>`,
  });
}
