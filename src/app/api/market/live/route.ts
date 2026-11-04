import { NextResponse } from 'next/server';

let cache: any = null;
let lastFetch = 0;
const CACHE_TTL = 5 * 60 * 1000;

// Для золота запоминаем предыдущую цену в памяти
let prevGoldPrice: number | null = null;

// Источник валют: fawazahmed0 (CDN, без ключа, 200+ валют)
async function fetchCurrencies() {
  // Запрашиваем сразу обе базы: USD и EUR
  const [usdRes, eurRes] = await Promise.all([
    fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json', { cache: 'no-store' }),
    fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json', { cache: 'no-store' }),
  ]);

  if (!usdRes.ok || !eurRes.ok) throw new Error('Currency API error');

  const usdData = await usdRes.json();
  const eurData = await eurRes.json();

  // В JSON структура: { "usd": { "rub": 92.5, ... } }
  const usdRub = usdData.usd?.rub;
  const eurRub = eurData.eur?.rub;

  if (typeof usdRub !== 'number' || typeof eurRub !== 'number') {
    throw new Error('RUB rate not found in response');
  }

  return [
    { symbol: 'USD/RUB', name: 'Доллар', value: usdRub, change: 0 },
    { symbol: 'EUR/RUB', name: 'Евро', value: eurRub, change: 0 },
  ];
}

async function fetchGold() {
  const res = await fetch('https://api.gold-api.com/price/XAU', { cache: 'no-store' });
  const data = await res.json();
  const price = data.price;
  let change = 0;
  
  if (prevGoldPrice !== null) {
    change = price - prevGoldPrice;
  }
  prevGoldPrice = price;
  
  return {
    symbol: 'GOLD',
    name: 'Золото (XAU/USD)',
    value: price,
    change: change,
  };
}

async function fetchBrent() {
  const res = await fetch('https://fred.stlouisfed.org/graph/fredgraph.csv?id=DCOILBRENTEU', {
    cache: 'no-store',
    headers: { 'User-Agent': 'curl/7.81' },
  });
  const text = await res.text();
  const lines = text.trim().split('\n');
  const lastLine = lines[lines.length - 1];
  const prevLine = lines[lines.length - 2];
  const last = parseFloat(lastLine.split(',')[1]);
  const prev = parseFloat(prevLine.split(',')[1]);
  
  return {
    symbol: 'BRENT',
    name: 'Нефть Brent',
    value: last,
    change: last - prev,
  };
}

export async function GET() {
  const now = Date.now();
  if (cache && now - lastFetch < CACHE_TTL) {
    return NextResponse.json(cache);
  }

  const items: any[] = [];

  // 1. Валюты (fawazahmed0)
  try {
    items.push(...(await fetchCurrencies()));
  } catch (err) {
    console.error('Currency error:', err);
    items.push(
      { symbol: 'USD/RUB', name: 'Доллар', value: 0, change: 0 },
      { symbol: 'EUR/RUB', name: 'Евро', value: 0, change: 0 }
    );
  }

  // 2. Золото
  try {
    items.push(await fetchGold());
  } catch (err) {
    console.error('Gold error:', err);
    items.push({ symbol: 'GOLD', name: 'Золото', value: 0, change: 0 });
  }

  // 3. Нефть
  try {
    items.push(await fetchBrent());
  } catch (err) {
    console.error('Brent error:', err);
    items.push({ symbol: 'BRENT', name: 'Нефть Brent', value: 0, change: 0 });
  }

  cache = items;
  lastFetch = now;
  return NextResponse.json(items);
}
