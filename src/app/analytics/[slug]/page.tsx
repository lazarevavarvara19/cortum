import { prisma } from '@/lib/prisma';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default async function AnalyticsDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const item = await prisma.analytics.findUnique({
    where: { slug: decodedSlug },
  });

  if (!item) return <div className="p-8 text-center text-xl max-w-[1360px] mx-auto">Материал не найден</div>;

  const showCover = item.imageUrl && !item.body.includes(item.imageUrl);

  return (
    <main className="max-w-[1360px] mx-auto px-4 py-12 bg-white text-[#111]">
      <article className="max-w-4xl mx-auto">
        
        {/* Шапка статьи */}
        <header className="mb-10 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#111] mb-4 inline-block border-b-2 border-[#111] pb-1">
            Аналитика
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tighter mb-6">
            {item.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-medium leading-snug max-w-3xl mx-auto">
            {item.summary}
          </p>
          <div className="mt-8 text-sm text-gray-500 font-bold uppercase tracking-widest">
            {new Date(item.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </header>

        {/* Обложка */}
        {showCover && (
          <div className="w-full mb-12 border-y-2 border-[#111] py-2">
            <img src={item.imageUrl} alt={item.title} className="w-full max-h-[600px] object-cover" />
          </div>
        )}

        {/* Текст статьи (Markdown) */}
        <div className="prose prose-lg md:prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-[#111] prose-p:text-[#111] prose-p:leading-relaxed prose-a:text-[#111] prose-a:underline prose-a:decoration-2 prose-a:underline-offset-4 hover:prose-a:text-gray-600 prose-blockquote:border-l-4 prose-blockquote:border-[#111] prose-blockquote:font-medium prose-blockquote:italic prose-blockquote:text-gray-700 prose-img:border prose-img:border-[#D5D5D5]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.body}</ReactMarkdown>
        </div>

        {/* Подвал статьи */}
        <div className="mt-16 pt-8 border-t-2 border-[#111] text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500">
            © CORTUM. Независимое аналитическое агентство.
          </p>
        </div>

      </article>
    </main>
  );
}
