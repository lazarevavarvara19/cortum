import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function NewsList({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const where = category
    ? { published: true, category: { slug: category } }
    : { published: true };
    
  const news = await prisma.news.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });
  
  const categories = await prisma.category.findMany();

  return (
    <main className="max-w-[1360px] mx-auto px-4 py-8 bg-white text-[#111]">
      <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-8 border-b-2 border-[#111] pb-4">Новости</h1>
      
      {/* Категории */}
      <div className="flex flex-wrap gap-x-8 gap-y-4 mb-10 text-sm font-bold uppercase tracking-widest">
        <Link href="/news" className={`hover:underline ${!category ? 'text-[#111] border-b-2 border-[#111] pb-1' : 'text-gray-400'}`}>
          Все
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/news?category=${cat.slug}`}
            className={`hover:underline ${category === cat.slug ? 'text-[#111] border-b-2 border-[#111] pb-1' : 'text-gray-400'}`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Строгий редакционный список */}
      <div className="flex flex-col border-t border-[#111]">
        {news.map((n) => (
          <div key={n.id} className="border-b border-[#D5D5D5] py-8 flex flex-col md:flex-row gap-6 group">
            
            {/* Левая колонка: мета */}
            <div className="md:w-1/4 flex flex-col flex-shrink-0">
              <span className="text-xs font-bold uppercase tracking-widest text-[#111] mb-2">{n.category.name}</span>
              <span className="text-sm text-gray-500 font-medium">{new Date(n.createdAt).toLocaleDateString('ru-RU')}</span>
            </div>
            
            {/* Правая колонка: контент */}
            <div className="md:w-3/4 flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <Link href={`/news/${n.slug}`}>
                  <h2 className="text-3xl md:text-4xl font-bold leading-[1.1] tracking-tight mb-3 group-hover:text-gray-600 transition">
                    {n.title}
                  </h2>
                </Link>
                <p className="text-lg text-gray-700 leading-relaxed line-clamp-2">{n.summary}</p>
              </div>
              
              {/* Изображение */}
              {n.imageUrl && (
                <div className="md:w-64 flex-shrink-0">
                  <div className="w-full aspect-[4/3] bg-cortum-surface relative overflow-hidden border border-[#D5D5D5]">
                    <img src={n.imageUrl} alt={n.title} className="w-full h-full object-cover  group-hover:scale-105 transition duration-500" />
                  </div>
                </div>
              )}
            </div>

          </div>
        ))}
        
        {news.length === 0 && (
          <p className="text-gray-500 py-12 text-lg">В этой категории пока нет новостей.</p>
        )}
      </div>
    </main>
  );
}
