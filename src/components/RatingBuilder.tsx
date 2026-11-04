'use client';
import { useState } from 'react';

type Position = {
  label: string;
  value: string;
  description?: string;
  image?: string;
};

export default function RatingBuilder({ value, onChange }: { value: string; onChange: (json: string) => void }) {
  const [positions, setPositions] = useState<Position[]>(() => {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const updatePositions = (newPositions: Position[]) => {
    setPositions(newPositions);
    onChange(JSON.stringify(newPositions));
  };

  const addPosition = () => {
    updatePositions([...positions, { label: '', value: '', description: '', image: '' }]);
  };

  const removePosition = (index: number) => {
    updatePositions(positions.filter((_, i) => i !== index));
  };

  const updatePosition = (index: number, field: keyof Position, val: string) => {
    const updated = [...positions];
    updated[index] = { ...updated[index], [field]: val };
    updatePositions(updated);
  };

  const handleImageUpload = async (index: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.url) {
      updatePosition(index, 'image', data.url);
    }
  };

  return (
    <div>
      {positions.map((pos, idx) => (
        <div key={idx} className="border p-3 mb-3 rounded bg-gray-50">
          <div className="flex gap-2 items-end mb-2">
            <input
              type="text"
              placeholder="Название"
              value={pos.label}
              onChange={(e) => updatePosition(idx, 'label', e.target.value)}
              className="border p-1 flex-1"
            />
            <input
              type="text"
              placeholder="Значение"
              value={pos.value}
              onChange={(e) => updatePosition(idx, 'value', e.target.value)}
              className="border p-1 w-24"
            />
            <button type="button" onClick={() => removePosition(idx)} className="text-red-500">✕</button>
          </div>
          <textarea
            placeholder="Описание (Markdown)"
            value={pos.description || ''}
            onChange={(e) => updatePosition(idx, 'description', e.target.value)}
            className="w-full border p-1 text-sm mb-2"
            rows={2}
          />
          <div className="flex items-center gap-2">
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(idx, file);
              }}
              className="text-xs"
            />
            {pos.image && (
              <img src={pos.image} alt="preview" className="h-8 w-auto rounded" />
            )}
          </div>
        </div>
      ))}
      <button type="button" onClick={addPosition} className="text-blue-600 text-sm">
        + Добавить позицию
      </button>
    </div>
  );
}
