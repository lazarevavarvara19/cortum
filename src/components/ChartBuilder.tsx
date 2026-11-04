'use client';
import { useState } from 'react';

export default function ChartBuilder({ onInsert }: { onInsert: (markdown: string) => void }) {
  const [type, setType] = useState('line');
  const [labels, setLabels] = useState('');
  const [pieValues, setPieValues] = useState(''); // для круговой
  const [datasets, setDatasets] = useState([{ label: '', data: '' }]);
  const [showModal, setShowModal] = useState(false);

  const addDataset = () => {
    setDatasets([...datasets, { label: '', data: '' }]);
  };

  const updateDataset = (index: number, field: 'label' | 'data', value: string) => {
    const newDatasets = [...datasets];
    newDatasets[index][field] = value;
    setDatasets(newDatasets);
  };

  const removeDataset = (index: number) => {
    setDatasets(datasets.filter((_, i) => i !== index));
  };

  const generateMarkdown = () => {
    let json;
    if (type === 'pie') {
      const labelArray = labels.split(',').map(s => s.trim());
      const valueArray = pieValues.split(',').map(s => parseFloat(s.trim()) || 0);
      json = JSON.stringify({
        labels: labelArray,
        datasets: [{ label: '', data: valueArray }],
      });
    } else {
      const labelArray = labels.split(',').map(s => s.trim());
      const dsArray = datasets.map(ds => ({
        label: ds.label,
        data: ds.data.split(',').map(s => parseFloat(s.trim()) || 0),
      }));
      json = JSON.stringify({ labels: labelArray, datasets: dsArray });
    }
    return `[chart:${type}|${json}]`;
  };

  const handleInsert = () => {
    try {
      const md = generateMarkdown();
      onInsert(md);
      setShowModal(false);
    } catch {
      alert('Проверьте правильность данных');
    }
  };

  return (
    <div className="inline">
      <button type="button" onClick={() => setShowModal(true)}
        className="bg-cortum-accent text-white px-3 py-1 rounded text-sm hover:bg-purple-700">
        + Добавить график
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Конструктор диаграмм</h3>
            <div className="mb-4">
              <label className="block text-sm">Тип</label>
              <select value={type} onChange={e => setType(e.target.value)} className="border p-1 w-full">
                <option value="line">Линейный</option>
                <option value="bar">Столбчатая</option>
                <option value="pie">Круговая</option>
              </select>
            </div>

            {type === 'pie' ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm">Названия секторов (через запятую)</label>
                  <input
                    type="text"
                    value={labels}
                    onChange={e => setLabels(e.target.value)}
                    placeholder="Колбоса, Молоко, Хлеб"
                    className="border p-1 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm">Значения (через запятую, в том же порядке)</label>
                  <input
                    type="text"
                    value={pieValues}
                    onChange={e => setPieValues(e.target.value)}
                    placeholder="10, 50, 40"
                    className="border p-1 w-full"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm">Подписи оси X (через запятую)</label>
                  <input
                    type="text"
                    value={labels}
                    onChange={e => setLabels(e.target.value)}
                    placeholder="Янв,Фев,Март"
                    className="border p-1 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm mb-1">Ряды данных</label>
                  {datasets.map((ds, idx) => (
                    <div key={idx} className="flex gap-2 items-end mb-2">
                      <input
                        type="text"
                        placeholder="Название"
                        value={ds.label}
                        onChange={e => updateDataset(idx, 'label', e.target.value)}
                        className="border p-1 flex-1"
                      />
                      <input
                        type="text"
                        placeholder="10,20,30"
                        value={ds.data}
                        onChange={e => updateDataset(idx, 'data', e.target.value)}
                        className="border p-1 flex-2"
                      />
                      <button type="button" onClick={() => removeDataset(idx)} className="text-red-500">✕</button>
                    </div>
                  ))}
                  <button type="button" onClick={addDataset} className="text-blue-600 text-sm">+ Добавить ряд</button>
                </div>
              </>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Отмена</button>
              <button onClick={handleInsert} className="bg-cortum-accent text-white px-4 py-2 rounded">Вставить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
