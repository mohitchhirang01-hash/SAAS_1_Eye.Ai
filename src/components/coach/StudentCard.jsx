'use client';

import { 
  IconFlame, 
  IconBell, 
  IconArrow 
} from '@/components/icons';
import StatusBadge from './StatusBadge';
import ScoreSparkline from './ScoreSparkline';
import Link from 'next/link';
import { clsx } from 'clsx';

export default function StudentCard({ student, onAlert }) {
  const getScoreColor = (score) => {
    if (score >= 240) return 'text-[var(--accent)]';
    if (score >= 180) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-[var(--card)] p-7 flex flex-col gap-6 md:hidden border border-[var(--border)] rounded-3xl shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xl font-black text-[var(--text)] leading-tight">{student.name}</span>
          <span className="text-[10px] font-black text-[var(--muted2)] uppercase tracking-wider">{student.email}</span>
        </div>
        <StatusBadge status={student.computed.status} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 border-y border-[var(--border)] py-6">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest">Streak</span>
          <div className="flex items-center gap-1.5 font-black text-orange-600">
            <IconFlame size={16} color="#ea580c" animated={true} />
            <span className="text-sm">{student.computed.streak} days</span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest">Last Score</span>
          <div className="flex items-baseline gap-1">
            <span className={clsx("font-black text-2xl tracking-tighter", getScoreColor(student.computed.lastScore))}>
              {student.computed.lastScore || '—'}
            </span>
            <span className="text-[10px] font-black text-[var(--muted2)]">/300</span>
          </div>
        </div>
      </div>

      {/* Coverage Section */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest">Coverage</span>
          <span className="text-sm font-black text-[var(--phys)]">{student.computed.coverage}%</span>
        </div>
        <div className="h-2 bg-[var(--card2)] rounded-full overflow-hidden border border-[var(--border)] shadow-inner">
          <div className="h-full bg-[var(--phys)] transition-all duration-1000 shadow-[0_0_8px_rgba(8,145,178,0.2)]" style={{ width: `${student.computed.coverage}%` }} />
        </div>
      </div>

      {/* Performance Trend */}
      <div className="flex flex-col gap-3">
        <span className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest">Performance Trend</span>
        <div className="bg-[var(--card2)] rounded-2xl p-4 flex justify-center border border-[var(--border)] shadow-inner">
          <ScoreSparkline scores={student.progress.mocks.slice(-5).map(m => m.total)} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => onAlert(student)}
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-[var(--card2)] hover:bg-[var(--accent-bg)] border border-[var(--border)] rounded-2xl text-[var(--muted)] hover:text-[var(--accent)] font-black text-[10px] uppercase tracking-widest transition-all shadow-sm active:scale-95"
        >
          <IconBell size={16} color="var(--muted)" hasUnread={true} animated={true} />
          Alert
        </button>
        <Link
          href={`/coach/student/${student.id}`}
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-[var(--accent)] hover:bg-[var(--accent-h)] rounded-2xl text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-[var(--accent)]/20 active:scale-95"
        >
          Analysis
          <IconArrow size={16} color="white" animated={true} />
        </Link>
      </div>
    </div>
  );
}
