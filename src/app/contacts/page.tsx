import React from 'react';

export default function ContactsPage() {
  return (
    <main className="max-w-[1360px] mx-auto px-4 py-12 bg-white text-[#111] min-h-[70vh]">
      <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 border-b-2 border-[#111] pb-6">
        Контакты
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mt-12">
        
        {/* Левая колонка с текстом */}
        <div className="md:col-span-7 lg:col-span-8">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-8 max-w-2xl">
            Мы всегда открыты к диалогу и новым идеям.
          </h2>
          
          <div className="prose prose-lg max-w-none text-[#111]">
            <p className="text-xl leading-relaxed mb-6 font-medium">
              Напишите нам по любым вопросам. Мы оперативно отвечаем на все обращения.
            </p>
            
            <ul className="space-y-4 text-lg">
              <li className="flex items-start gap-3">
                <span className="font-bold text-2xl leading-none">&rarr;</span>
                <span><strong>Сотрудничество:</strong> предложения по партнерству, рекламе и совместным проектам.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-2xl leading-none">&rarr;</span>
                <span><strong>Ошибки:</strong> если вы нашли неточность в данных или тексте, сообщите нам — мы исправим.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-2xl leading-none">&rarr;</span>
                <span><strong>Предложить статью:</strong> у вас есть интересная тема или готовый материал для публикации?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-2xl leading-none">&rarr;</span>
                <span><strong>Стать корреспондентом:</strong> мы ищем талантливых авторов и аналитиков в регионах.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Правая колонка с контактом */}
        <div className="md:col-span-5 lg:col-span-4">
          <div className="border border-[#111] p-8 bg-[#F5F5F3]">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">
              Электронная почта
            </h3>
            <a 
              href="mailto:cortumrussia@gmail.com" 
              className="text-2xl md:text-3xl font-black break-all hover:text-gray-600 transition underline decoration-2 underline-offset-4"
            >
              cortumrussia@gmail.com
            </a>
            <p className="text-sm text-gray-600 mt-6 leading-relaxed">
              Это единственный официальный адрес для связи с редакцией CORTUM. Пожалуйста, указывайте тему письма, чтобы мы могли быстрее вам ответить.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
