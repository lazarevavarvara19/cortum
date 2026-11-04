'use client';
import Link from 'next/link';
import { useState } from 'react';
import Logo from './Logo';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white relative z-50">
      <div className="max-w-[1360px] mx-auto px-4 pt-6 pb-4 border-b border-[#111]">
        <div className="flex justify-between items-center">
          
          <div className="flex items-center gap-6">
            <Link href="/">
              <Logo className="h-14 md:h-16 w-auto" />
            </Link>
            <div className="hidden lg:flex items-center border-l border-[#111] pl-6">
              <p className="text-xs font-bold leading-tight text-[#111] uppercase tracking-widest">
                аналитическое<br/>медиа<br/>о развитии<br/>регионов
              </p>
            </div>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/news" className="text-[#111] text-lg font-semibold uppercase tracking-wide hover:underline decoration-2 underline-offset-4">Новости</Link>
            <Link href="/analytics" className="text-[#111] text-lg font-semibold uppercase tracking-wide hover:underline decoration-2 underline-offset-4">Аналитика</Link>
            <Link href="/ratings" className="text-[#111] text-lg font-semibold uppercase tracking-wide hover:underline decoration-2 underline-offset-4">Рейтинги</Link>
            <Link href="/companies" className="text-[#111] text-lg font-semibold uppercase tracking-wide hover:underline decoration-2 underline-offset-4">Компании</Link>
            <Link href="/contacts" className="text-[#111] text-lg font-semibold uppercase tracking-wide hover:underline decoration-2 underline-offset-4">Контакты</Link>
          </nav>

          <button className="md:hidden text-[#111] text-3xl" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-b border-[#111] px-4 py-4 space-y-4 absolute w-full left-0 shadow-lg">
          <Link href="/news" className="block text-[#111] text-lg font-semibold uppercase" onClick={() => setMenuOpen(false)}>Новости</Link>
          <Link href="/analytics" className="block text-[#111] text-lg font-semibold uppercase" onClick={() => setMenuOpen(false)}>Аналитика</Link>
          <Link href="/ratings" className="block text-[#111] text-lg font-semibold uppercase" onClick={() => setMenuOpen(false)}>Рейтинги</Link>
          <Link href="/companies" className="block text-[#111] text-lg font-semibold uppercase" onClick={() => setMenuOpen(false)}>Компании</Link>
          <Link href="/contacts" className="block text-[#111] text-lg font-semibold uppercase" onClick={() => setMenuOpen(false)}>Контакты</Link>
        </div>
      )}
    </header>
  );
}
