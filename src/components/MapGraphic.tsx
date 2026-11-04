export default function MapGraphic() {
  // Имитация карты России плотным растром точек
  const dots = [];
  // Приблизительный контур
  const shape = (x: number, y: number) => {
    // Простая математическая функция для имитации контура РФ
    return (y > 20 && y < 80 && x > 10 && x < 140 && !(x < 40 && y > 60)) || 
           (y >= 80 && y < 120 && x > 30 && x < 130);
  };

  for (let x = 0; x < 150; x += 3) {
    for (let y = 0; y < 140; y += 3) {
      if (shape(x, y) && Math.random() > 0.2) {
         // Разная плотность для "активных" регионов
        const isActive = Math.random() > 0.5;
        const r = isActive ? 1.8 : 1;
        const fill = isActive ? "#000000" : "#666666";
        dots.push(<circle key={`${x}-${y}`} cx={x * 2.5 + 20} cy={y * 1.8 + 20} r={r} fill={fill} />);
      }
    }
  }

  return (
    <svg viewBox="0 0 420 280" className="w-full max-w-2xl mx-auto" xmlns="http://www.w3.org/2000/svg">
      {dots}
    </svg>
  );
}
