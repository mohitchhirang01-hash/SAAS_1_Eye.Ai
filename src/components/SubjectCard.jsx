import { useState, useEffect } from 'react';
import { 
  IconSigma, 
  IconAtom, 
  IconFlask 
} from '@/components/icons';

export default function SubjectCard({ subject, cov }) {
  const configs = {
    math: { label: 'Mathematics', icon: IconSigma, color: 'math', ring: 'var(--math)', border: 'rgba(217, 119, 6, 0.3)' },
    phys: { label: 'Physics', icon: IconAtom, color: 'phys', ring: 'var(--phys)', border: 'rgba(8, 145, 178, 0.3)' },
    chem: { label: 'Chemistry', icon: IconFlask, color: 'chem', ring: 'var(--chem)', border: 'rgba(219, 39, 119, 0.3)' }
  };

  const config = configs[subject];
  const Icon = config.icon;
  const [offset, setOffset] = useState(138.2);

  useEffect(() => {
    const C = 138.2;
    setOffset(C - (cov.pct / 100) * C);
  }, [cov.pct]);

  return (
    <div 
      className="bg-[var(--card)] p-6 min-h-[140px] border rounded-2xl shadow-sm relative group overflow-hidden transition-all hover:border-[var(--border2)]"
      style={{ borderColor: config.border }}
    >
      {/* Background Glow Effect */}
      <div 
        className="absolute inset-0 opacity-[0.04] transition-opacity group-hover:opacity-[0.08]" 
        style={{ backgroundColor: config.ring }}
      />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Icon size={16} color={config.ring} animated={subject === 'phys'} />
            <div className="text-sm font-black uppercase tracking-widest" style={{ color: config.ring }}>{config.label}</div>
          </div>
          <div className="text-5xl font-black leading-none" style={{ color: config.ring }}>
            {cov.pct}%
          </div>
          <div className="text-[10px] text-[var(--muted)] mt-2 font-black uppercase tracking-widest">
            {cov.done} / {cov.total} Topics
          </div>
        </div>
        <div className="relative inline-flex items-center justify-center">
          <svg width="64" height="64" className="rotate-[-90deg]">
            <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth="5" className="text-black/5" />
            <circle 
              cx="32" cy="32" r="22" 
              fill="none" 
              stroke={config.ring} 
              strokeWidth="5" 
              strokeDasharray="138.2" 
              style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 1s ease-out' }} 
              strokeLinecap="round" 
            />
          </svg>
          <div className="absolute text-[10px] font-black" style={{ color: config.ring }}>{cov.pct}%</div>
        </div>
      </div>
      <div className="h-1.5 bg-black/[0.08] rounded-full overflow-hidden relative z-10">
        <div 
          className="h-full transition-all duration-1000 ease-out rounded-full" 
          style={{ width: `${cov.pct}%`, backgroundColor: config.ring }} 
        />
      </div>
    </div>
  );
}
