'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function BatchPerformanceChart({ students = [] }) {
  // Mock data for the lines
  const labels = ['Mock 1', 'Mock 2', 'Mock 3', 'Mock 4', 'Mock 5', 'Mock 6'];
  
  const datasets = students.map((s, i) => ({
    label: s.name,
    data: labels.map(() => Math.floor(Math.random() * 100) + 150),
    borderColor: '#2d6a4f',
    borderWidth: 1,
    opacity: 0.2,
    pointRadius: 0,
    tension: 0.4,
  }));

  // Batch average line
  datasets.push({
    label: 'Batch Average',
    data: [180, 195, 190, 210, 205, 215],
    borderColor: '#2d6a4f',
    borderWidth: 4,
    pointRadius: 4,
    pointBackgroundColor: '#2d6a4f',
    tension: 0.4,
    fill: false,
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: { min: 0, max: 300, grid: { color: '#f0f5ef' } },
      x: { grid: { display: false } }
    }
  };

  return (
    <div className="h-full w-full">
      <Line data={{ labels, datasets }} options={options} />
    </div>
  );
}
