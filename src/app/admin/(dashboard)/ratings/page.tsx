'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Rating = { id: string; title: string; type: string; company?: { name: string } };

export default function AdminRatings() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const fetchRatings = () => {
    fetch('/api/ratings')
      .then(res => res.json())
      .then(data => setRatings(data));
  };
  useEffect(() => { fetchRatings(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить рейтинг?')) return;
    await fetch(`/api/ratings/${id}`, { method: 'DELETE' });
    fetchRatings();
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Рейтинги</h2>
        <Link href="/admin/ratings/new" className="bg-cortum-accent text-white px-4 py-2 rounded">+ Добавить</Link>
      </div>
      <table className="w-full bg-white shadow">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="p-2">Заголовок</th>
            <th className="p-2">Тип</th>
            <th className="p-2">Компания</th>
            <th className="p-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {ratings.map(r => (
            <tr key={r.id} className="border-t">
              <td className="p-2">{r.title}</td>
              <td className="p-2">{r.type}</td>
              <td className="p-2">{r.company?.name || '—'}</td>
              <td className="p-2 flex gap-2">
                <Link href={`/admin/ratings/${r.id}/edit`} className="text-blue-600">Ред.</Link>
                <button onClick={() => handleDelete(r.id)} className="text-red-600">Удал.</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
