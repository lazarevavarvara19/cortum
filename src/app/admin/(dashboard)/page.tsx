import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const newsCount = await prisma.news.count();
  const publishedCount = await prisma.news.count({ where: { published: true } });
  const subscribersCount = await prisma.emailSubscription.count({ where: { isActive: true } });
  const categoriesCount = await prisma.category.count();

  return (
    <div>
      <h2 className="text-4xl font-black uppercase tracking-tighter mb-8 border-b-2 border-[#111] pb-4">Дашборд</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 border border-[#111]">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Всего новостей</p>
          <p className="text-5xl font-black">{newsCount}</p>
        </div>
        <div className="bg-white p-6 border border-[#111]">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Опубликовано</p>
          <p className="text-5xl font-black">{publishedCount}</p>
        </div>
        <div className="bg-white p-6 border border-[#111]">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Подписчиков</p>
          <p className="text-5xl font-black">{subscribersCount}</p>
        </div>
        <div className="bg-white p-6 border border-[#111]">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Категорий</p>
          <p className="text-5xl font-black">{categoriesCount}</p>
        </div>
      </div>
    </div>
  );
}
