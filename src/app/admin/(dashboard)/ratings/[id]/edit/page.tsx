'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import RatingBuilder from '@/components/RatingBuilder';

export default function EditRating() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState({
    title: '',
    description: '',
    methodology: '',
    sources: '',
    type: 'Компании',
    companyId: '',
    data: '[]',
    imageUrl: '',
  });
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/companies')
      .then(res => res.json())
      .then(data => setCompanies(data));
    fetch(`/api/ratings/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          title: data.title || '',
          description: data.description || '',
          methodology: data.methodology || '',
          sources: data.sources || '',
          type: data.type || 'Компании',
          companyId: data.companyId || '',
          data: typeof data.data === 'string' ? data.data : JSON.stringify(data.data || [], null, 2),
          imageUrl: data.imageUrl || '',
        });
        setLoading(false);
      });
  }, [id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.url) {
      setForm({ ...form, imageUrl: data.url });
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form };
    if (!payload.companyId) delete payload.companyId;
    try {
      JSON.parse(form.data);
    } catch {
      alert('Некорректный JSON');
      return;
    }
    const res = await fetch(`/api/ratings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      router.push('/admin/ratings');
    } else {
      const err = await res.json();
      alert('Ошибка: ' + (err.error || 'неизвестно'));
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Редактировать рейтинг</h2>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <input placeholder="Заголовок" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border p-2" required />
        <textarea placeholder="Описание (Markdown)" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border p-2" rows={4} />
        <div className="grid grid-cols-2 gap-4">
          <textarea placeholder="Методология (Markdown)" value={form.methodology} onChange={e => setForm({...form, methodology: e.target.value})} className="w-full border p-2" rows={4} />
          <textarea placeholder="Источники (Markdown)" value={form.sources} onChange={e => setForm({...form, sources: e.target.value})} className="w-full border p-2" rows={4} />
        </div>
        <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full border p-2">
          <option value="Компании">Компании</option>
          <option value="Брокеры">Брокеры</option>
          <option value="Облигации">Облигации</option>
          <option value="Макроэкономика">Макроэкономика</option>
          <option value="Прочее">Прочее</option>
        </select>
        <select value={form.companyId} onChange={e => setForm({...form, companyId: e.target.value})} className="w-full border p-2">
          <option value="">— Без компании —</option>
          {companies.map((c: any) => (
            <option key={c.id} value={c.id}>{c.name} ({c.ticker})</option>
          ))}
        </select>
        <div>
          <label className="text-sm">Обложка</label>
          <input type="file" onChange={handleImageUpload} />
          {uploading && <span className="text-gray-500"> Загрузка...</span>}
          {form.imageUrl && <img src={form.imageUrl} alt="preview" className="mt-2 max-h-32 rounded" />}
        </div>
        <div>
          <label className="text-sm mb-1 block">Позиции рейтинга</label>
          <RatingBuilder value={form.data} onChange={(json) => setForm({ ...form, data: json })} />
        </div>
        <button type="submit" className="bg-cortum-accent text-white px-4 py-2 rounded">Сохранить</button>
      </form>
    </div>
  );
}
