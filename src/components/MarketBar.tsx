'use client';
import { useEffect, useState } from 'react';

type MarketItem = { symbol: string; name: string; value: number; change: number; };

export default function MarketBar() {
  const [items, setItems] = useState<MarketItem[]>([]);

  useEffect(() => {
    fetch('/api/market/live').then(res => res.json()).then(data => setItems(data)).catch(() => {});
  }, []);

  return (
    <div className="bg-white border-b border-[#111]">
      <div className="max-w-[1360px] mx-auto px-4 py-2 flex items-center text-sm md:text-base font-medium overflow-x-auto">
        <div className="flex items-center space-x-6 whitespace-nowrap">
          {items.map((item) => (
            <div key={item.symbol} className="flex items-center space-x-2">
              <span className="text-[#111] font-bold">{item.symbol}</span>
              <span className="tabular-nums font-black">{item.value > 0 ? item.value.toFixed(2) : '—'}</span>
              {item.value > 0 && (
                <span className={`font-bold tabular-nums ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
