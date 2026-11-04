import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AnalyticsPage() {
  const items = await prisma.analytics.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="max-w-[1360px] mx-auto px-4 py-8 bg-white text-[#111]">
      <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-8 border-b-2 border-[#111] pb-4">Аналитика</h1>
      
      {items.length === 0 ? (
        <p className="text-gray-500 py-12 text-lg">Пока нет аналитических материалов.</p>
      ) : (
        <div className="flex flex-col border-t border-[#111]">
          {items.map((item) => (
            <div key={item.id} className="border-b border-[#D5D5D5] py-10 flex flex-col md:flex-row gap-8 group">
              
              {/* Левая колонка: мета-данные */}
              <div className="md:w-1/4 flex flex-col flex-shrink-0">
                <span className="text-xs font-bold uppercase tracking-widest text-[#111] mb-2 border-b-2 border-[#111] self-start pb-1">Исследование</span>
                <span className="text-sm text-gray-500 font-medium mt-2">{new Date(item.createdAt).toLocaleDateString('ru-RU')}</span>
              </div>
              
              {/* Правая колонка: контент и картинка */}
              <div className="md:w-3/4 flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <Link href={`/analytics/${item.slug}`}>
                    <h2 className="text-3xl md:text-5xl font-black leading-[1.05] tracking-tighter mb-4 group-hover:text-gray-600 transition">
                      {item.title}
                    </h2>
                  </Link>
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium line-clamp-3">
                    {item.summary}
                  </p>
                  <div className="mt-6">
                    <Link href={`/analytics/${item.slug}`} className="text-sm font-bold uppercase tracking-widest border-b-2 border-[#111] pb-1 hover:text-gray-600 transition">
                      Читать материал
                    </Link>
                  </div>
                </div>
                
                {item.imageUrl && (
                  <div className="md:w-72 flex-shrink-0">
                    <div className="w-full aspect-[4/3] bg-[#F5F5F3] relative overflow-hidden border border-[#D5D5D5]">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </main>
  );
}
