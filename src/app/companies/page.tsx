'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';

type Company = {
  id: string;
  ticker: string;
  name: string;
  sector: string;
  description?: string;
  dataYear?: number;
  revenue?: number;
  ebitda?: number;
  netIncome?: number;
  totalDebt?: number;
  marketCap?: number;
  ratings: { score: number; grade: string }[];
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [finFilters, setFinFilters] = useState({
    revenueMin: '', revenueMax: '',
    ebitdaMin: '', ebitdaMax: '',
    netIncomeMin: '', netIncomeMax: '',
    marketCapMin: '', marketCapMax: '',
  });

  useEffect(() => {
    fetch('/api/companies')
      .then(res => res.json())
      .then(data => setCompanies(data));
  }, []);

  const sectors = useMemo(() => {
    const sec = new Set(companies.map(c => c.sector));
    return Array.from(sec).sort();
  }, [companies]);

  const filtered = useMemo(() => {
    return companies.filter(c => {
      const matchSearch = search.trim() === '' ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.ticker.toLowerCase().includes(search.toLowerCase());
      const matchSector = sectorFilter === '' || c.sector === sectorFilter;
      const matchRevenue = (!finFilters.revenueMin || (c.revenue ?? 0) >= parseFloat(finFilters.revenueMin)) &&
                           (!finFilters.revenueMax || (c.revenue ?? 0) <= parseFloat(finFilters.revenueMax));
      const matchEbitda = (!finFilters.ebitdaMin || (c.ebitda ?? 0) >= parseFloat(finFilters.ebitdaMin)) &&
                          (!finFilters.ebitdaMax || (c.ebitda ?? 0) <= parseFloat(finFilters.ebitdaMax));
      const matchNetIncome = (!finFilters.netIncomeMin || (c.netIncome ?? 0) >= parseFloat(finFilters.netIncomeMin)) &&
                             (!finFilters.netIncomeMax || (c.netIncome ?? 0) <= parseFloat(finFilters.netIncomeMax));
      const matchMarketCap = (!finFilters.marketCapMin || (c.marketCap ?? 0) >= parseFloat(finFilters.marketCapMin)) &&
                             (!finFilters.marketCapMax || (c.marketCap ?? 0) <= parseFloat(finFilters.marketCapMax));
      return matchSearch && matchSector && matchRevenue && matchEbitda && matchNetIncome && matchMarketCap;
    });
  }, [companies, search, sectorFilter, finFilters]);

  return (
    <main className="max-w-[1360px] mx-auto px-4 py-8 bg-white text-[#111] min-h-screen">
      <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-8 border-b-2 border-[#111] pb-4">Компании</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Поиск по названию или тикеру..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-[#111] p-3 flex-1 text-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <select
          value={sectorFilter}
          onChange={e => setSectorFilter(e.target.value)}
          className="border border-[#111] p-3 text-lg focus:outline-none md:w-64"
        >
          <option value="">Все сектора</option>
          {sectors.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <button
        onClick={() => setFiltersOpen(!filtersOpen)}
        className="text-sm font-bold uppercase tracking-widest text-[#111] underline decoration-2 underline-offset-4 mb-6"
      >
        {filtersOpen ? 'Скрыть расширенные фильтры' : 'Показать расширенные фильтры'}
      </button>
      
      {filtersOpen && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 p-6 bg-[#F5F5F3] border border-[#111]">
          <div>
            <label className="text-xs font-bold uppercase text-gray-600 mb-1 block">Выручка, млн (от)</label>
            <input type="number" value={finFilters.revenueMin} onChange={e => setFinFilters({...finFilters, revenueMin: e.target.value})} className="w-full border border-[#111] p-2" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-600 mb-1 block">Выручка, млн (до)</label>
            <input type="number" value={finFilters.revenueMax} onChange={e => setFinFilters({...finFilters, revenueMax: e.target.value})} className="w-full border border-[#111] p-2" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-600 mb-1 block">EBITDA, млн (от)</label>
            <input type="number" value={finFilters.ebitdaMin} onChange={e => setFinFilters({...finFilters, ebitdaMin: e.target.value})} className="w-full border border-[#111] p-2" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-600 mb-1 block">EBITDA, млн (до)</label>
            <input type="number" value={finFilters.ebitdaMax} onChange={e => setFinFilters({...finFilters, ebitdaMax: e.target.value})} className="w-full border border-[#111] p-2" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-600 mb-1 block">Прибыль, млн (от)</label>
            <input type="number" value={finFilters.netIncomeMin} onChange={e => setFinFilters({...finFilters, netIncomeMin: e.target.value})} className="w-full border border-[#111] p-2" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-600 mb-1 block">Прибыль, млн (до)</label>
            <input type="number" value={finFilters.netIncomeMax} onChange={e => setFinFilters({...finFilters, netIncomeMax: e.target.value})} className="w-full border border-[#111] p-2" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-600 mb-1 block">Капитализация (от)</label>
            <input type="number" value={finFilters.marketCapMin} onChange={e => setFinFilters({...finFilters, marketCapMin: e.target.value})} className="w-full border border-[#111] p-2" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-600 mb-1 block">Капитализация (до)</label>
            <input type="number" value={finFilters.marketCapMax} onChange={e => setFinFilters({...finFilters, marketCapMax: e.target.value})} className="w-full border border-[#111] p-2" />
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-gray-500 py-12 text-xl font-medium">Компании не найдены.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(c => {
            const lastRating = c.ratings?.[0];
            return (
              <Link key={c.id} href={`/companies/${c.ticker}`} className="border border-[#D5D5D5] hover:border-[#111] p-6 transition bg-white flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-black leading-tight group-hover:text-gray-600 transition">{c.name}</h3>
                    <span className="text-sm font-mono bg-[#F5F5F3] border border-[#111] px-2 py-1">{c.ticker}</span>
                  </div>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-4">{c.sector}</p>
                  {c.description && <p className="text-sm text-gray-700 leading-relaxed line-clamp-2 mb-6">{c.description}</p>}
                  
                  <div className="grid grid-cols-2 gap-y-2 text-sm border-t border-[#D5D5D5] pt-4 mb-4">
                    {c.revenue != null && (
                      <div>
                        <span className="text-gray-500 text-xs block">Выручка</span>
                        <span className="font-bold">{c.revenue.toLocaleString()} млн</span>
                      </div>
                    )}
                    {c.ebitda != null && (
                      <div>
                        <span className="text-gray-500 text-xs block">EBITDA</span>
                        <span className="font-bold">{c.ebitda.toLocaleString()} млн</span>
                      </div>
                    )}
                    {c.netIncome != null && (
                      <div>
                        <span className="text-gray-500 text-xs block">Прибыль</span>
                        <span className="font-bold">{c.netIncome.toLocaleString()} млн</span>
                      </div>
                    )}
                    {c.marketCap != null && (
                      <div>
                        <span className="text-gray-500 text-xs block">Капитализация</span>
                        <span className="font-bold">{c.marketCap.toLocaleString()} млн</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-[#111] pt-4 flex justify-between items-end">
                  {lastRating ? (
                    <div>
                      <span className="text-xs text-gray-500 block mb-1">Рейтинг</span>
                      <span className="text-xl font-bold">{lastRating.score} / 100 <span className="text-gray-500">({lastRating.grade})</span></span>
                    </div>
                  ) : <div />}
                  {c.dataYear && (
                    <span className="text-xs text-gray-500 font-medium">Данные за {c.dataYear} г.</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
