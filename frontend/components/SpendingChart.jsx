'use client';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SpendingChart({ data }) {
  const labels = data.map(item => item.category);
  const values = data.map(item => item.amount);
  const backgroundColors = ['#4CAF50', '#2C3E50', '#E74C3C', '#27AE60', '#3498DB', '#F59E0B'];

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: backgroundColors,
        borderWidth: 1,
        cutout: '65%' // 👈 taille du trou au centre (plus élevé = plus fin)
      }
    ]
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#2C3E50',
          font: { size: 12 }
        }
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow border max-w-md h-[300px] mx-auto">
      <h2 className="text-md font-semibold text-[#2C3E50] text-center mb-2">Répartition des dépenses</h2>
      <div className="h-[220px]">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
}
