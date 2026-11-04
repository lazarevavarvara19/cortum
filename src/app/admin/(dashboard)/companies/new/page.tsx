'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateCompany() {
  const router = useRouter();
  const [form, setForm] = useState({
    ticker: '',
    name: '',
    sector: '',
    description: '',
    revenue: '',
    ebitda: '',
    netIncome: '',
    totalDebt: '',
    marketCap: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form };
    await fetch('/api/companies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    router.push('/admin/companies');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Добавить компанию</h2>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Тикер" value={form.ticker} onChange={e => setForm({...form, ticker: e.target.value})} className="w-full border p-2" required />
          <input placeholder="Название" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border p-2" required />
        </div>
        <input placeholder="Сектор" value={form.sector} onChange={e => setForm({...form, sector: e.target.value})} className="w-full border p-2" required />
        <textarea placeholder="Описание" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border p-2" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm">Выручка, млн</label>
            <input type="number" step="any" value={form.revenue} onChange={e => setForm({...form, revenue: e.target.value})} className="w-full border p-2" />
          </div>
          <div>
            <label className="text-sm">EBITDA, млн</label>
            <input type="number" step="any" value={form.ebitda} onChange={e => setForm({...form, ebitda: e.target.value})} className="w-full border p-2" />
          </div>
          <div>
            <label className="text-sm">Чистая прибыль, млн</label>
            <input type="number" step="any" value={form.netIncome} onChange={e => setForm({...form, netIncome: e.target.value})} className="w-full border p-2" />
          </div>
          <div>
            <label className="text-sm">Общий долг, млн</label>
            <input type="number" step="any" value={form.totalDebt} onChange={e => setForm({...form, totalDebt: e.target.value})} className="w-full border p-2" />
          </div>
          <div>
            <label className="text-sm">Капитализация, млн</label>
            <input type="number" step="any" value={form.marketCap} onChange={e => setForm({...form, marketCap: e.target.value})} className="w-full border p-2" />
          </div>
        </div>
        <button type="submit" className="bg-cortum-accent text-white px-4 py-2 rounded">Создать</button>
      </form>
    </div>
  );
}
