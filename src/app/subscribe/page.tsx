import SubscribeForm from '@/components/SubscribeForm';

export default function SubscribePage() {
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-4">Подписка на рассылку</h1>
      <p className="text-cortum-gray mb-6">Выберите интересующие категории и получайте дайджесты CORTUM.</p>
      <SubscribeForm />
    </div>
  );
}
