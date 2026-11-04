import { prisma } from '@/lib/prisma';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default async function RatingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rating = await prisma.rating.findUnique({
    where: { id },
    include: { company: true },
  });
  if (!rating) return <div className="p-8">Рейтинг не найден</div>;

  const data = typeof rating.data === 'string' ? JSON.parse(rating.data) : rating.data;
  const showCover = rating.imageUrl && !(rating.description || '').includes(rating.imageUrl);

  return (
    <article className="max-w-prose mx-auto">
      <h1 className="text-3xl font-bold">{rating.title}</h1>
      <div className="text-cortum-gray mt-2 mb-6">{new Date(rating.createdAt).toLocaleDateString('ru-RU')} · {rating.type}</div>

      {showCover && (
        <img src={rating.imageUrl} alt={rating.title} className="w-full max-h-96 object-cover rounded mb-6" />
      )}

      {rating.description && (
        <div className="prose prose-lg max-w-none mb-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{rating.description}</ReactMarkdown>
        </div>
      )}

      {rating.methodology && (
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h2 className="text-xl font-bold mb-2">Методология</h2>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{rating.methodology}</ReactMarkdown>
          </div>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Позиции</h2>
          {data.map((item: any, idx: number) => (
            <div key={idx} className="border p-4 rounded mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{item.label}</h3>
                  {item.value && <span className="text-cortum-accent font-bold">{item.value}</span>}
                </div>
                {item.image && (
                  <img src={item.image} alt={item.label} className="w-16 h-16 object-cover rounded ml-4" />
                )}
              </div>
              {item.description && (
                <div className="mt-2 text-sm text-gray-600 prose prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.description}</ReactMarkdown>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {rating.sources && (
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h2 className="text-xl font-bold mb-2">Источники</h2>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{rating.sources}</ReactMarkdown>
          </div>
        </div>
      )}

      {rating.company && (
        <div className="text-sm text-cortum-gray mt-8">
          Связанная компания: {rating.company.name} ({rating.company.ticker})
        </div>
      )}
    </article>
  );
}
