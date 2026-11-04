import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MarketBar from '@/components/MarketBar';

export const metadata = {
  title: 'CORTUM — независимая финансовая аналитика',
  description: 'Аналитическая платформа: новости, рейтинги, данные для инвесторов',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="font-sans bg-white text-cortum-black">
        <Header />
        <MarketBar />
        <main className="max-w-content mx-auto px-4 py-6 min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
