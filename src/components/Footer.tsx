import SubscribeForm from './SubscribeForm';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 mt-16">
      <div className="max-w-[1360px] mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Логотип */}
        <div className="md:col-span-4">
          <Logo className="h-8 w-auto mb-4" inverted />
          <p className="text-sm text-gray-300">
            Независимое аналитическое агентство
          </p>
        </div>

        {/* Разделы */}
        <div className="md:col-span-3">
          <h4 className="text-white font-medium text-lg mb-4">Разделы</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="/news" className="hover:text-white transition">Новости</a></li>
            <li><a href="/analytics" className="hover:text-white transition">Аналитика</a></li>
            <li><a href="/ratings" className="hover:text-white transition">Рейтинги</a></li>
            <li><a href="/companies" className="hover:text-white transition">Компании</a></li>
            <li><a href="/contacts" className="hover:text-white transition">Контакты</a></li>
          </ul>
        </div>

        {/* Подписка */}
        <div className="md:col-span-5">
          <h4 className="text-white font-medium text-lg mb-4">Подписка</h4>
          <SubscribeForm />
        </div>

      </div>
      
      <div className="max-w-[1360px] mx-auto px-4 mt-12 pt-6 border-t border-gray-800 text-sm text-gray-400 text-center">
        © 2026 CORTUM. Все права защищены.
      </div>
    </footer>
  );
}
