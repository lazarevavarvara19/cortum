import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function RatingsPage() {
  const ratings = await prisma.rating.findMany({
    include: { company: true },
    orderBy: { createdAt: 'desc' },
  });

  const grouped: Record<string, typeof ratings> = {};
  ratings.forEach(r => {
    const type = r.type || 'Прочее';
    if (!grouped[type]) grouped[type] = [];
    const parsed = typeof r.data === 'string' ? JSON.parse(r.data) : r.data;
    grouped[type].push({ ...r, data: Array.isArray(parsed) ? parsed : [] });
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Рейтинги</h1>
      {Object.entries(grouped).map(([type, items]) => (
        <div key={type} className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">{type}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {items.map(r => (
              <div key={r.id} className="border p-4 rounded hover:shadow-md transition">
                {r.imageUrl && (
                  <img src={r.imageUrl} alt={r.title} className="w-full h-40 object-cover rounded mb-3" />
                )}
                <Link href={`/ratings/${r.id}`} className="text-xl font-bold hover:text-cortum-accent">
                  {r.title}
                </Link>
                {r.description && <p className="text-cortum-gray mt-1">{r.description.slice(0, 100)}</p>}
                {r.company && <div className="text-sm text-cortum-gray mt-1">Компания: {r.company.name} ({r.company.ticker})</div>}
                <div className="mt-2 text-sm">
                  {r.data && r.data.slice(0, 3).map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between border-b py-1">
                      <span>{item.label}</span>
                      <span className="font-semibold">{item.value}</span>
                    </div>
                  ))}
                  {r.data && r.data.length > 3 && <div className="text-gray-400">...и ещё {r.data.length - 3}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
