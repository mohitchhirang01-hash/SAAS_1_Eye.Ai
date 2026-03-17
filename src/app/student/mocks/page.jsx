'use client';

import { useProgressContext } from '@/app/Providers';
import MockForm from '@/components/MockForm';
import MockChart from '@/components/MockChart';
import MockHistory from '@/components/MockHistory';
import { 
  IconPlus, 
  IconChart, 
  IconTrophy, 
  IconTrend 
} from '@/components/icons';

export default function MockTestsPage() {
  const { S, addMock, deleteMock } = useProgressContext();
  const M = S.mocks;

  const stats = [
    { 
      label: 'Tests Taken', 
      value: M.length, 
      icon: <IconPlus size={18} color="var(--phys)" />,
      color: 'text-accent-cyan',
      sub: M.length === 1 ? 'Attempted' : 'Total Attempted'
    },
    { 
      label: 'Average Score', 
      value: M.length > 0 ? Math.round(M.reduce((a, x) => a + x.total, 0) / M.length) : '–', 
      icon: <IconChart size={18} color="var(--accent)" />,
      color: 'text-accent-green',
      sub: '/ 300 scale'
    },
    { 
      label: 'Best Score', 
      value: M.length > 0 ? Math.max(...M.map(x => x.total)) : '–', 
      icon: <IconTrophy size={18} color="var(--warning)" animated={M.length > 0} />,
      color: 'text-accent-amber',
      sub: 'Personal Best'
    },
    { 
      label: 'Last Test', 
      value: M.length > 0 ? M[M.length - 1].total : '–', 
      icon: <IconTrend size={18} color="var(--text)" animated={M.length > 0} />,
      color: 'text-[var(--text)]',
      sub: 'Most recent'
    }
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-[var(--card)] p-6 border border-[var(--border)] rounded-2xl flex flex-col items-center justify-center text-center shadow-sm">
            <div className="mb-3">{s.icon}</div>
            <div className={`text-3xl font-black mb-1 ${s.color}`}>{s.value}</div>
            <div className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest">{s.label}</div>
            <div className="text-[8px] font-black text-[var(--muted2)] uppercase tracking-[0.2em] mt-2">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8">
        <div className="flex flex-col gap-8">
          <MockForm onSubmit={addMock} />
          {M.length > 0 && <MockChart mocks={M} />}
        </div>
      </div>

      <MockHistory mocks={M} onDelete={deleteMock} />
    </div>
  );
}
