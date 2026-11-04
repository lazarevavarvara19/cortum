import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import HeroGraphic from '@/components/HeroGraphic';

export default async function Home() {
  const heroNews = await prisma.news.findFirst({
    where: { published: true, featured: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  }) || await prisma.news.findFirst({
    where: { published: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  const shortNews = await prisma.news.findMany({
    where: { published: true, id: { not: heroNews?.id } },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
    take: 4,
  });

  const latestAnalytics = await prisma.analytics.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });

  const latestRatings = await prisma.rating.findMany({
    orderBy: { createdAt: 'desc' },
    take: 1,
  });

  // Функция очистки текста от картинок и форматирования Markdown
  function cleanMarkdown(text: string) {
    if (!text) return '';
    return text
      .replace(/!\[.*?\]\(.*?\)/g, '') // Удаляем картинки
      .replace(/\[.*?\]\(.*?\)/g, '')  // Удаляем ссылки
      .replace(/[#*`_]/g, '')          // Удаляем символы форматирования
      .replace(/\s+/g, ' ')            // Убираем лишние пробелы и переносы
      .trim();
  }

  return (
    <main className="max-w-[1360px] mx-auto px-4 py-8 bg-white text-[#111]">
      
      {/* БЛОК: ГЛАВНАЯ ТЕМА */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-0">
        
        {/* Левая колонка (Текст) */}
        <div className="lg:col-span-5 lg:pr-8 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 inline-block border-b-2 border-[#111] pb-1">Главная тема</h2>
            <Link href={`/news/${heroNews?.slug || '#'}`}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[0.95] tracking-tighter mb-6 hover:text-gray-600 transition">
                {heroNews?.title || 'Регионы ускоряют инвестиции'}
              </h1>
            </Link>
            <p className="text-xl md:text-2xl font-medium leading-snug mb-8">
              {heroNews?.summary || 'Капитальные вложения в субъекты РФ выросли на 12,4%: лидеры, драйверы и новые точки роста'}
            </p>
            <div className="relative pl-6 mb-8">
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#111]"></div>
              <p className="text-base text-gray-800 leading-relaxed mb-4">
                {/* Применяем очистку текста, чтобы убрать код картинки */}
                {cleanMarkdown(heroNews?.body || '').slice(0, 160) || 'Инвестиционная активность в регионах сохраняет высокий темп...'}...
              </p>
              <Link href={`/news/${heroNews?.slug || '#'}`} className="font-bold text-lg hover:underline">
                &rarr; Читать полностью
              </Link>
            </div>
          </div>
        </div>

        {/* Центральная колонка (Halftone картинка новости) */}
        <div className="hidden lg:flex lg:col-span-4 border-l border-r border-[#111] relative min-h-[400px]">
          {heroNews?.imageUrl ? (
            <div className="w-full h-full relative overflow-hidden bg-[#F5F5F3]">
              <img 
                src={heroNews.imageUrl} 
                alt={heroNews.title} 
                className="w-full h-full object-cover grayscale contrast-150" 
              />
              <div 
                className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-70"
                style={{
                  backgroundImage: `radial-gradient(#111 1.5px, transparent 1.5px)`,
                  backgroundSize: '5px 5px'
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full p-8">
              <HeroGraphic />
            </div>
          )}
        </div>

        {/* Правая колонка (Коротко) */}
        <div className="lg:col-span-3 lg:pl-8 flex flex-col">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-6 inline-block border-b-2 border-[#111] pb-1 self-start">Коротко</h2>
          <div className="flex flex-col space-y-5">
            {shortNews.map((news) => (
              <div key={news.id} className="border-b border-[#D5D5D5] pb-4 last:border-0">
                <Link href={`/news/${news.slug}`}>
                  <h3 className="text-lg font-bold leading-tight mb-1 hover:text-gray-600 transition">
                    {news.title}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{news.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr className="border-t-2 border-[#111] my-10" />

      {/* БЛОК: СВЕЖАЯ АНАЛИТИКА И РЕЙТИНГИ */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 lg:border-r border-[#111] lg:pr-12">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-6 inline-block border-b-2 border-[#111] pb-1">Последняя аналитика</h2>
          <div className="flex flex-col gap-6">
            {latestAnalytics.map((item) => (
              <div key={item.id} className="border-b border-[#D5D5D5] pb-6 last:border-0">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <Link href={`/analytics/${item.slug}`}>
                      <h3 className="text-2xl font-black tracking-tight mb-2 hover:text-gray-600 transition">{item.title}</h3>
                    </Link>
                    <p className="text-gray-700 leading-relaxed line-clamp-2">{item.summary}</p>
                  </div>
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt="" className="w-32 h-24 object-cover border border-[#D5D5D5]" />
                  )}
                </div>
              </div>
            ))}
            {latestAnalytics.length === 0 && <p className="text-gray-500">Пока нет опубликованной аналитики.</p>}
          </div>
        </div>

        <div className="lg:col-span-4">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-6 inline-block border-b-2 border-[#111] pb-1">Свежий рейтинг</h2>
          <div className="flex flex-col gap-4">
            {latestRatings.map(rating => (
              <div key={rating.id} className="border border-[#111] p-4 hover:bg-gray-50 transition">
                <Link href={`/ratings/${rating.id}`}>
                  <h3 className="text-xl font-bold mb-1 hover:underline">{rating.title}</h3>
                </Link>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{rating.type}</span>
                <p className="text-sm mt-2 line-clamp-3">{rating.description}</p>
              </div>
            ))}
            {latestRatings.length === 0 && <p className="text-gray-500">Пока нет рейтингов.</p>}
          </div>
        </div>
      </div>
    </main>
  );
}
