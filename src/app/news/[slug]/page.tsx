import { prisma } from '@/lib/prisma';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ChartRenderer from '@/components/ChartRenderer';

export default async function NewsDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const news = await prisma.news.findUnique({
    where: { slug: decodedSlug },
    include: { category: true },
  });

  if (!news) {
    return (
      <div className="p-8">
        <p className="text-red-600">Отладка: slug (декодированный) = {decodedSlug}</p>
        <p>Новость не найдена в базе.</p>
      </div>
    );
  }

  const showCover = news.imageUrl && !news.body.includes(news.imageUrl);

  // Парсер, который корректно обрабатывает вложенные массивы
  function extractCharts(text: string) {
    const charts: { type: string; data: any }[] = [];
    let cleanText = text;
    const startMarker = '[chart:';
    let searchFrom = 0;
    while ((searchFrom = cleanText.indexOf(startMarker, searchFrom)) !== -1) {
      const typeEnd = cleanText.indexOf('|', searchFrom);
      if (typeEnd === -1) break;
      const type = cleanText.substring(searchFrom + startMarker.length, typeEnd);
      // Найдём позицию открывающей фигурной скобки JSON
      const jsonStart = cleanText.indexOf('{', typeEnd);
      if (jsonStart === -1) break;
      // Ищем соответствующую закрывающую скобку с учётом вложенности
      let depth = 0;
      let jsonEnd = -1;
      for (let i = jsonStart; i < cleanText.length; i++) {
        const ch = cleanText[i];
        if (ch === '{') depth++;
        else if (ch === '}') {
          depth--;
          if (depth === 0) {
            jsonEnd = i;
            break;
          }
        }
      }
      if (jsonEnd === -1) break;
      const jsonStr = cleanText.substring(jsonStart, jsonEnd + 1);
      // Теперь ищем закрывающую квадратную скобку после jsonEnd
      const closingBracket = cleanText.indexOf(']', jsonEnd);
      if (closingBracket === -1) break;
      try {
        const data = JSON.parse(jsonStr);
        charts.push({ type, data });
      } catch (e) {
        console.warn('Ошибка JSON:', jsonStr);
        charts.push({ type, data: null });
      }
      // Вырезаем весь блок [chart:тип|{...}]
      cleanText = cleanText.substring(0, searchFrom) + cleanText.substring(closingBracket + 1);
      searchFrom = 0; // начинаем поиск заново в обновлённой строке
    }
    return { cleanText, charts };
  }

  const { cleanText, charts } = extractCharts(news.body);

  return (
    <article className="max-w-prose mx-auto">
      <span className="text-cortum-accent">{news.category.name}</span>
      <h1 className="text-3xl font-bold mt-2">{news.title}</h1>
      <div className="text-cortum-gray mt-2 mb-6">{new Date(news.createdAt).toLocaleDateString('ru-RU')}</div>
      {showCover && (
        <img src={news.imageUrl} alt={news.title} className="w-full max-h-96 object-cover rounded mb-6" />
      )}
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleanText}</ReactMarkdown>
      </div>
      {charts.map((chart, idx) => (
        <div key={idx} className="my-6">
          {chart.data ? (
            <ChartRenderer type={chart.type} data={chart.data} />
          ) : (
            <div className="text-red-500 text-sm">⚠️ Не удалось построить график (неверные данные)</div>
          )}
        </div>
      ))}
    </article>
  );
}
