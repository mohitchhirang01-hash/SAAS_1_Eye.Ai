'use client';

import { clsx } from 'clsx';

export default function InstituteStatsRow({ stats }) {
  const chips = [
    { label: 'Total Teachers', value: stats.totalTeachers, color: 'text-[#2d6a4f]', bg: 'bg-[#e8f5e9]' },
    { label: 'Total Students', value: stats.totalStudents, color: 'text-[#2d6a4f]', bg: 'bg-[#e8f5e9]' },
    { label: 'Total Batches', value: stats.totalBatches, color: 'text-[#d4850a]', bg: 'bg-[#faeeda]' },
    { label: 'Active Today', value: stats.activeToday, color: 'text-[#2d6a4f]', bg: 'bg-[#e8f5e9]' },
    { label: 'Avg Coverage', value: `${stats.avgCoverage}%`, color: 'text-[#0891b2]', bg: 'bg-[#e0f2fe]' },
    { label: 'Avg Mock Score', value: stats.avgMockScore, color: 'text-[#d97706]', bg: 'bg-[#fef3c7]' },
  ];

  return (
    <div className="grid grid-cols-6 gap-4">
      {chips.map((chip, idx) => (
        <div key={idx} className="bg-white p-6 rounded-[32px] border border-[#c8dfc8] shadow-sm flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a] opacity-70">{chip.label}</span>
          <span className={clsx("text-2xl font-black font-['Syne',sans-serif]", chip.color)}>
            {chip.value}
          </span>
        </div>
      ))}
    </div>
  );
}
