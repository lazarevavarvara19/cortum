import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function transliterate(text) {
  const map = {
    'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p',
    'р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'ts','ч':'ch','ш':'sh','щ':'sch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya',
    'А':'A','Б':'B','В':'V','Г':'G','Д':'D','Е':'E','Ё':'Yo','Ж':'Zh','З':'Z','И':'I','Й':'Y','К':'K','Л':'L','М':'M','Н':'N','О':'O','П':'P',
    'Р':'R','С':'S','Т':'T','У':'U','Ф':'F','Х':'H','Ц':'Ts','Ч':'Ch','Ш':'Sh','Щ':'Sch','Ъ':'','Ы':'Y','Ь':'','Э':'E','Ю':'Yu','Я':'Ya'
  };
  return text.split('').map(c => map[c] || c).join('')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .substring(0, 80);
}

async function main() {
  const news = await prisma.news.findMany();
  for (const n of news) {
    const newSlug = transliterate(n.title || '');
    if (n.slug !== newSlug) {
      await prisma.news.update({
        where: { id: n.id },
        data: { slug: newSlug },
      });
      console.log(`Обновлён slug: "${n.slug}" → "${newSlug}"`);
    }
  }
  console.log('✅ Все slug транслитерированы');
  await prisma.$disconnect();
}
main();
