import { prisma } from '@/lib/prisma';

export default async function CompanyDetail({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const company = await prisma.company.findUnique({
    where: { ticker },
    include: { ratings: { orderBy: { createdAt: 'desc' } } },
  });
  if (!company) return <div className="p-8">Компания не найдена</div>;

  const latestRating = company.ratings[0];

  return (
    <div>
      <h1 className="text-3xl font-bold">{company.name} ({company.ticker})</h1>
      <p className="text-cortum-gray">{company.sector}</p>
      {company.description && <p className="mt-2">{company.description}</p>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-cortum-gray">Выручка, млн</div>
          <div className="text-lg font-semibold">{company.revenue?.toLocaleString() ?? '—'}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-cortum-gray">EBITDA, млн</div>
          <div className="text-lg font-semibold">{company.ebitda?.toLocaleString() ?? '—'}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-cortum-gray">Чистая прибыль, млн</div>
          <div className="text-lg font-semibold">{company.netIncome?.toLocaleString() ?? '—'}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-cortum-gray">Долг, млн</div>
          <div className="text-lg font-semibold">{company.totalDebt?.toLocaleString() ?? '—'}</div>
        </div>
      </div>
      {latestRating && (
        <div className="mt-6 p-4 bg-gray-50 rounded">
          <h3 className="text-xl font-semibold">Рейтинг: {latestRating.score} / 100 <span className="text-cortum-accent">({latestRating.grade})</span></h3>
          {latestRating.title && <p className="text-sm text-cortum-gray">{latestRating.title}</p>}
        </div>
      )}
      <h2 className="text-xl font-bold mt-8 mb-2">Все рейтинги</h2>
      {company.ratings.length === 0 ? (
        <p className="text-cortum-gray">Нет рейтингов</p>
      ) : (
        <ul className="space-y-2">
          {company.ratings.map(r => (
            <li key={r.id} className="border p-3 rounded">
              <div className="font-semibold">{r.title || 'Без названия'}</div>
              <div className="text-sm text-cortum-gray">{r.type} | {new Date(r.createdAt).toLocaleDateString('ru-RU')}</div>
              {r.data && Array.isArray(r.data) && (
                <div className="mt-2 text-sm">
                  {r.data.map((item: any, idx: number) => (
                    <div key={idx}>{item.label}: {item.value}</div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
