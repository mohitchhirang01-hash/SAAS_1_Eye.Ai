'use client';

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
import { Line } from 'react-chartjs-2';
import { IconTrend } from '@/components/icons';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function MockChart({ mocks }) {
  if (mocks.length === 0) return null;

  const data = {
    labels: mocks.map((_, i) => `#${i + 1}`),
    datasets: [
      {
        label: 'Total',
        data: mocks.map(m => m.total),
        borderColor: '#2d6a4f',
        backgroundColor: '#2d6a4f',
        tension: 0.3,
        borderWidth: 4,
        pointRadius: 6,
        pointBackgroundColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Math',
        data: mocks.map(m => m.math),
        borderColor: '#d97706',
        backgroundColor: '#d97706',
        tension: 0.3,
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 3,
      },
      {
        label: 'Physics',
        data: mocks.map(m => m.phys),
        borderColor: '#0891b2',
        backgroundColor: '#0891b2',
        tension: 0.3,
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 3,
      },
      {
        label: 'Chemistry',
        data: mocks.map(m => m.chem),
        borderColor: '#db2777',
        backgroundColor: '#db2777',
        tension: 0.3,
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1a4a2e',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        min: 0,
        max: 300,
        grid: {
          color: 'rgba(0, 0, 0, 0.06)',
        },
        ticks: {
          color: '#6a9a7a',
          font: { size: 10, weight: 'bold' }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6a9a7a',
          font: { size: 10, weight: 'bold' }
        }
      }
    }
  };

  return (
    <div className="bg-[var(--card)] p-8 border border-[var(--border)] rounded-2xl shadow-sm h-[350px]">
      <div className="flex items-center gap-2 mb-8">
        <IconTrend size={16} color="var(--text2)" animated={true} />
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">Score Progression</h3>
      </div>
      <div className="h-[220px]">
        <Line data={data} options={options} />
      </div>
      <div className="flex justify-center gap-6 mt-8">
        {[
          { label: 'Total', color: 'bg-[var(--accent)]' },
          { label: 'Math', color: 'bg-[var(--math)]' },
          { label: 'Phys', color: 'bg-[var(--phys)]' },
          { label: 'Chem', color: 'bg-[var(--chem)]' }
        ].map(l => (
          <div key={l.label} className="flex items-center gap-2">
            <div className={`w-3 h-1 rounded-full ${l.color}`} />
            <span className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
