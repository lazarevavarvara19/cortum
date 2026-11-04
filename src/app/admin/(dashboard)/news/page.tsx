'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type NewsItem = {
  id: string;
  title: string;
  category: { name: string };
  createdAt: string;
};

export default function AdminNewsList() {
  const router = useRouter();
  const [news, setNews] = useState<NewsItem[]>([]);

  const fetchNews = () => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => setNews(data));
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить новость?')) return;
    await fetch(`/api/news/${id}`, { method: 'DELETE' });
    fetchNews(); // обновить список
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Новости</h2>
        <Link href="/admin/news/new" className="bg-cortum-accent text-white px-4 py-2 rounded">
          + Создать
        </Link>
      </div>
      <table className="w-full bg-white shadow">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="p-2">Заголовок</th>
            <th className="p-2">Категория</th>
            <th className="p-2">Дата</th>
            <th className="p-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {news.map((n) => (
            <tr key={n.id} className="border-t">
              <td className="p-2">{n.title}</td>
              <td className="p-2">{n.category.name}</td>
              <td className="p-2">{new Date(n.createdAt).toLocaleDateString()}</td>
              <td className="p-2 flex gap-2">
                <Link href={`/admin/news/${n.id}/edit`} className="text-blue-600">Ред.</Link>
                <button onClick={() => handleDelete(n.id)} className="text-red-600">Удал.</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
