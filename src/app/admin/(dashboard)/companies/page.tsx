'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Company = { id: string; ticker: string; name: string; sector: string; ratingScore?: number; ratingGrade?: string };

export default function AdminCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);

  const fetchCompanies = () => {
    fetch('/api/companies')
      .then(res => res.json())
      .then(data => setCompanies(data));
  };

  useEffect(() => { fetchCompanies(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить компанию?')) return;
    await fetch(`/api/companies/${id}`, { method: 'DELETE' });
    fetchCompanies();
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Компании</h2>
        <Link href="/admin/companies/new" className="bg-cortum-accent text-white px-4 py-2 rounded">+ Добавить</Link>
      </div>
      <table className="w-full bg-white shadow">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="p-2">Тикер</th>
            <th className="p-2">Название</th>
            <th className="p-2">Сектор</th>
            <th className="p-2">Рейтинг</th>
            <th className="p-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-2">{c.ticker}</td>
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.sector}</td>
              <td className="p-2">{c.ratingScore != null ? `${c.ratingScore} (${c.ratingGrade})` : '—'}</td>
              <td className="p-2 flex gap-2">
                <Link href={`/admin/companies/${c.id}/edit`} className="text-blue-600">Ред.</Link>
                <button onClick={() => handleDelete(c.id)} className="text-red-600">Удал.</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
