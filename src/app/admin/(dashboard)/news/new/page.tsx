'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChartBuilder from '@/components/ChartBuilder';

type Category = { id: string; slug: string; name: string };

export default function CreateNews() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    summary: '',
    body: '',
    categoryId: '',
    imageUrl: '',
    published: false,
    featured: false,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-zа-я0-9-]/g, '')
      .substring(0, 80);
    setForm({ ...form, title, slug });
  };

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
    if (uploadedUrl) {
      setForm({ ...form, body: form.body + `\n![изображение](${uploadedUrl})\n` });
    }
  };

  const handleChartInsert = (chartMarkdown: string) => {
    setForm({ ...form, body: form.body + '\n' + chartMarkdown + '\n' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    router.push('/admin/news');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Новая новость</h2>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm text-cortum-gray">Заголовок</label>
          <input
            placeholder="Заголовок"
            value={form.title}
            onChange={e => handleTitleChange(e.target.value)}
            className="w-full border p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-cortum-gray">Slug</label>
          <input
            placeholder="kakaya-to-statya"
            value={form.slug}
            onChange={e => setForm({...form, slug: e.target.value})}
            className="w-full border p-2"
            required
          />
        </div>
        <textarea placeholder="Краткое описание" value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} className="w-full border p-2" rows={3} />
        <div>
          <label className="block text-sm text-cortum-gray">Тело (Markdown)</label>
          <textarea
            placeholder="Текст..."
            value={form.body}
            onChange={e => setForm({...form, body: e.target.value})}
            className="w-full border p-2 font-mono text-sm"
            rows={12}
            required
          />
          <div className="flex gap-2 mt-2">
            <ChartBuilder onInsert={handleChartInsert} />
          </div>
        </div>
        <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})} className="w-full border p-2" required>
          <option value="">Выберите категорию</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <div>
          <label className="block text-sm text-cortum-gray mb-1">Изображение</label>
          <input type="file" onChange={handleImageUpload} className="text-sm" />
          {uploading && <span className="text-gray-500"> Загрузка...</span>}
          {uploadedUrl && (
            <div className="mt-2">
              <img src={uploadedUrl} alt="preview" className="max-h-32 rounded" />
              <button type="button" onClick={insertImageToBody} className="text-blue-600 underline text-sm mt-1">
                Вставить в текст
              </button>
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
            На главную (featured)
          </label>
        </div>
        <button type="submit" className="bg-cortum-accent text-white px-4 py-2 rounded">Создать</button>
      </form>
    </div>
  );
}
