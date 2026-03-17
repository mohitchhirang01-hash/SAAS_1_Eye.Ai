'use client';

import { useProgressContext } from "@/app/Providers";
import { IconClock } from "@/components/icons";

export default function HourSliders() {
  const { S, updateHours } = useProgressContext();
  const today = new Date().toISOString().split('T')[0];
  const th = S.hours[today] || { math: 0, phys: 0, chem: 0 };

  const sliders = [
    { id: 'math', label: 'Mathematics', color: 'var(--math)' },
    { id: 'phys', label: 'Physics', color: 'var(--phys)' },
    { id: 'chem', label: 'Chemistry', color: 'var(--chem)' }
  ];

  return (
    <div className="bg-[var(--card)] p-6 border border-[var(--border)] rounded-2xl shadow-sm">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text)] mb-6 flex items-center gap-2">
        <IconClock size={16} color="var(--text)" animated={true} />
        Attempted Questions Today
      </h3>
      <div className="flex flex-col gap-5">
        {sliders.map((s) => (
          <div key={s.id} className="flex items-center gap-6 p-4 bg-[var(--card2)] rounded-2xl border border-[var(--border)] group hover:border-[var(--border2)] transition-all">
            <span className="text-xs font-black uppercase tracking-widest w-28 shrink-0" style={{ color: s.color }}>{s.label}</span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              step="1" 
              value={th[s.id] || 0}
              onChange={(e) => updateHours(s.id, parseInt(e.target.value))}
              className="flex-1 h-1.5 bg-black/5 rounded-lg appearance-none cursor-pointer"
              style={{ accentColor: s.color }}
            />
            <span className="text-base font-black min-w-[32px] text-right" style={{ color: s.color }}>
              {th[s.id] || 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
