'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type AnalItem = { id: string; title: string; createdAt: string };

export default function AdminAnalyticsList() {
  const [items, setItems] = useState<AnalItem[]>([]);

  const fetchItems = () => {
    fetch('/api/analytics?published=false')
      .then(res => res.json())
      .then(data => setItems(data));
  };

  useEffect(() => { fetchItems(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить?')) return;
    await fetch(`/api/analytics/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Аналитика</h2>
        <Link href="/admin/analytics/new" className="bg-cortum-accent text-white px-4 py-2 rounded">
          + Создать
        </Link>
      </div>
      <table className="w-full bg-white shadow">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="p-2">Заголовок</th>
            <th className="p-2">Дата</th>
            <th className="p-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-2">{item.title}</td>
              <td className="p-2">{new Date(item.createdAt).toLocaleDateString()}</td>
              <td className="p-2 flex gap-2">
                <Link href={`/admin/analytics/${item.id}/edit`} className="text-blue-600">Ред.</Link>
                <button onClick={() => handleDelete(item.id)} className="text-red-600">Удал.</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
