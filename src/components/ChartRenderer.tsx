'use client';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
};

export default function ChartRenderer({ type, data }: { type: string; data: ChartData }) {
  // Преобразуем формат [{label: "Янв", data1: 10}] для Recharts
  const chartData = data.labels.map((label, i) => {
    const point: any = { name: label };
    data.datasets.forEach((ds, dsIdx) => {
      point[ds.label] = ds.data[i] ?? 0;
    });
    return point;
  });

  const colors = ['#FF8C00', '#0B0F14', '#6B7280', '#3B82F6', '#10B981', '#EF4444'];

  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {data.datasets.map((ds, idx) => (
            <Line key={ds.label} type="monotone" dataKey={ds.label} stroke={colors[idx % colors.length]} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {data.datasets.map((ds, idx) => (
            <Bar key={ds.label} dataKey={ds.label} fill={colors[idx % colors.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'pie') {
    // Для круговой диаграммы объединим все dataset'ы в один ряд
    const pieData = data.labels.map((label, i) => ({
      name: label,
      value: data.datasets[0]?.data[i] ?? 0,
    }));
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
            {pieData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return <div className="text-red-500">Неизвестный тип графика: {type}</div>;
}
