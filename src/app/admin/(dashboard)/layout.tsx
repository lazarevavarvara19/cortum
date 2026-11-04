import Link from 'next/link';
import Logo from '@/components/Logo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F5F5F3] font-sans text-[#111]">
      {/* Сайдбар */}
      <aside className="w-64 bg-[#111] text-white p-6 flex flex-col fixed h-full z-50">
        <div className="mb-10">
          <Link href="/">
            <Logo className="h-8 w-auto" inverted />
          </Link>
          <div className="text-[10px] uppercase tracking-widest text-gray-400 mt-2">Панель управления</div>
        </div>
        
        <nav className="flex flex-col space-y-1">
          <Link href="/admin/news" className="px-3 py-2 text-sm uppercase tracking-wider font-semibold hover:bg-gray-800 transition">Новости</Link>
          <Link href="/admin/analytics" className="px-3 py-2 text-sm uppercase tracking-wider font-semibold hover:bg-gray-800 transition">Аналитика</Link>
          <Link href="/admin/companies" className="px-3 py-2 text-sm uppercase tracking-wider font-semibold hover:bg-gray-800 transition">Компании</Link>
          <Link href="/admin/ratings" className="px-3 py-2 text-sm uppercase tracking-wider font-semibold hover:bg-gray-800 transition">Рейтинги</Link>
          <Link href="/admin" className="px-3 py-2 text-sm uppercase tracking-wider font-semibold hover:bg-gray-800 transition border-t border-gray-800 mt-4 pt-4">Дашборд</Link>
        </nav>
      </aside>

      {/* Основной контент */}
      <main className="flex-1 ml-64 p-8">
        <div className="admin-content max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
