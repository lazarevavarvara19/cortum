'use client';
import { useState, useEffect } from 'react';

type Category = { id: string; slug: string; name: string };

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(data => setCategories(data)).catch(() => {});
  }, []);

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, categories: selected }),
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
        setSelected([]);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return <div className="text-green-500 font-medium">Спасибо! Вы подписаны.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="Ваш email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 bg-[#222] text-white border border-gray-600 focus:outline-none focus:border-white flex-1"
          required
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-white text-black px-6 py-2 font-medium hover:bg-gray-200 transition"
        >
          {status === 'loading' ? '...' : 'Подписаться'}
        </button>
      </div>
      
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-4 text-sm mt-2">
          {categories.map(cat => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white">
              <div className={`w-4 h-4 border border-gray-500 flex items-center justify-center ${selected.includes(cat.id) ? 'bg-white' : ''}`}>
                {selected.includes(cat.id) && <span className="text-black text-[10px]">✔</span>}
              </div>
              <input
                type="checkbox"
                checked={selected.includes(cat.id)}
                onChange={() => toggle(cat.id)}
                className="hidden"
              />
              {cat.name}
            </label>
          ))}
        </div>
      )}
      {status === 'error' && <p className="text-red-500 text-sm">Ошибка. Попробуйте позже.</p>}
    </form>
  );
}
