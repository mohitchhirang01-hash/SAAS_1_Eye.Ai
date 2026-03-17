'use client';

import { IconTrash, IconTarget } from '@/components/icons';

export default function MockHistory({ mocks, onDelete }) {
  if (mocks.length === 0) {
    return (
      <div className="bg-[var(--card)] p-12 text-center border border-[var(--border)] rounded-2xl">
        <div className="text-[var(--muted2)] text-sm font-bold italic">No tests recorded yet. Start by entering your scores above!</div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconTarget size={16} color="var(--muted)" animated={false} />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">Test History</h3>
        </div>
        <span className="text-[10px] font-black px-3 py-1 bg-[var(--card2)] border border-[var(--border)] rounded-full text-[var(--muted)] uppercase tracking-widest">{mocks.length} tests</span>
      </div>
      <div className="divide-y divide-[var(--border)]">
        {[...mocks].reverse().map((m, ri) => {
          const originalIndex = mocks.length - 1 - ri;
          return (
            <div key={ri} className="p-5 flex items-center gap-6 hover:bg-[var(--card2)] transition-colors group">
              <span className="text-xs font-black text-[var(--muted2)] w-8">#{originalIndex + 1}</span>
              <div className="flex-1 grid grid-cols-4 gap-4">
                <MockStat value={m.math} label="Math" color="text-[var(--math)]" />
                <MockStat value={m.phys} label="Phys" color="text-[var(--phys)]" />
                <MockStat value={m.chem} label="Chem" color="text-[var(--chem)]" />
                <div className="text-right">
                  <div className="text-lg font-black text-[var(--accent)] leading-none">{m.total}<span className="text-[10px] text-[var(--muted2)] ml-1">/300</span></div>
                  <div className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest mt-1">{Math.round(m.total/3*100)/100}%</div>
                </div>
              </div>
              <button 
                onClick={() => onDelete(originalIndex)}
                className="p-2 opacity-0 group-hover:opacity-100 text-[var(--muted2)] hover:text-[var(--danger)] transition-all"
              >
                <IconTrash size={16} color="var(--muted2)" className="group-hover:text-[var(--danger)] transition-colors" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MockStat({ value, label, color }) {
  return (
    <div className="text-center md:text-left">
      <div className={`text-base font-black ${color}`}>{value}</div>
      <div className="text-[9px] font-black text-[var(--muted2)] uppercase tracking-widest">{label}</div>
    </div>
  );
}
