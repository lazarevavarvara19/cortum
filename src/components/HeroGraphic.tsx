export default function HeroGraphic() {
  // Генерируем точки для эффекта 3D-столбцов из точек
  const dots = [];
  const cols = 35;
  const rows = 25;
  
  for (let c = 0; c < cols; c++) {
    // Высота столбца растет слева направо с шумом
    const colHeight = Math.max(2, Math.floor((c / cols) * rows + Math.sin(c * 0.5) * 4));
    for (let r = 0; r < colHeight; r++) {
      // Пропускаем некоторые точки для текстуры
      if (Math.random() > 0.8) continue;
      
      const cx = c * 10 + 5;
      const cy = 250 - r * 10;
      // Размер точки зависит от положения (градиент)
      const rSize = (1.5 + (c / cols) * 2.5) * (1 - (r / rows) * 0.5);
      
      dots.push(<circle key={`${c}-${r}`} cx={cx} cy={cy} r={rSize} fill="#000000" />);
    }
  }

  return (
    <svg viewBox="0 0 360 260" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
      {dots}
    </svg>
  );
}
