'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ChartBuilder from '@/components/ChartBuilder';

export default function EditAnalytics() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState({
    title: '', slug: '', summary: '', body: '', imageUrl: '',
    published: false, featured: false,
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  useEffect(() => {
    fetch(`/api/analytics/${id}`)
      .then(res => res.json())
      .then((data: any) => {
        setForm({
          title: data.title, slug: data.slug, summary: data.summary,
          body: data.body, imageUrl: data.imageUrl || '',
          published: data.published, featured: data.featured,
        });
        if (data.imageUrl) setUploadedUrl(data.imageUrl);
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
      setUploadedUrl(data.url);
    }
    setUploading(false);
  };

  const insertImageToBody = () => {
    if (uploadedUrl) setForm({ ...form, body: form.body + `\n![изображение](${uploadedUrl})\n` });
  };

  const handleChartInsert = (chartMd: string) => {
    setForm({ ...form, body: form.body + '\n' + chartMd + '\n' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/analytics/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    router.push('/admin/analytics');
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Редактирование</h2>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <input placeholder="Заголовок" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border p-2" required />
        <input placeholder="Slug" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="w-full border p-2" required />
        <textarea placeholder="Краткое описание" value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} className="w-full border p-2" rows={3} />
        <textarea placeholder="Тело (Markdown)" value={form.body} onChange={e => setForm({...form, body: e.target.value})} className="w-full border p-2" rows={12} required />
        <div className="flex gap-2">
          <ChartBuilder onInsert={handleChartInsert} />
        </div>
        <div>
          <label className="block text-sm">Изображение</label>
          <input type="file" onChange={handleImageUpload} />
          {uploading && <span className="text-gray-500"> Загрузка...</span>}
          {uploadedUrl && (
            <div className="mt-2">
              <img src={uploadedUrl} alt="preview" className="max-h-32 rounded" />
              <button type="button" onClick={insertImageToBody} className="text-blue-600 text-sm underline">Вставить в текст</button>
            </div>
          )}
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.published} onChange={e => setForm({...form, published: e.target.checked})} />
            Опубликовать
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} />
            На главную
          </label>
        </div>
        <button type="submit" className="bg-cortum-accent text-white px-4 py-2 rounded">Сохранить</button>
      </form>
    </div>
  );
}
