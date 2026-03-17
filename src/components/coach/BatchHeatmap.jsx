'use client';

import { SYL } from '@/lib/syllabus';
import { clsx } from 'clsx';
import { IconWarning } from '@/components/icons';

export default function BatchHeatmap({ students, onFlagTopic }) {
  const subjects = [
    { key: 'math', label: 'Mathematics' },
    { key: 'phys', label: 'Physics' },
    { key: 'chem', label: 'Chemistry' }
  ];

  const getWeakCount = (topicId) => {
    return students.filter(s => s.progress.tags[topicId] === 'weak').length;
  };

  const getIntensity = (count) => {
    if (count === 0) return 'bg-[var(--card2)] text-[var(--muted2)] border-[var(--border)]';
    if (count <= 2) return 'bg-red-50 text-red-600 border-red-100 uppercase tracking-widest';
    if (count <= 4) return 'bg-red-100 text-red-700 border-red-200 uppercase tracking-widest shadow-sm';
    return 'bg-red-600 text-white border-red-700 animate-pulse uppercase tracking-widest shadow-md';
  };

  return (
    <div className="flex flex-col gap-10">
      {subjects.map(sub => (
        <div key={sub.key} className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <h3 className={clsx("text-lg font-countryside", sub.key === 'math' ? 'text-[var(--math)]' : sub.key === 'phys' ? 'text-[var(--phys)]' : 'text-[var(--chem)]')}>
              {sub.label}
            </h3>
            <span className="text-[10px] font-black text-[var(--muted2)] uppercase tracking-[.3em]">
              Batch Struggle Map
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {SYL[sub.key].map(topic => {
              const count = getWeakCount(topic.id);
              const intensity = getIntensity(count);
              
              return (
                <button 
                  key={topic.id}
                  onClick={() => onFlagTopic(topic)}
                  className={clsx(
                    "p-4 rounded-2xl border text-left flex flex-col gap-3 transition-all hover:scale-[1.03] group relative overflow-hidden",
                    intensity
                  )}
                >
                  <span className="text-[10px] font-black leading-tight flex-1 pr-4">{topic.n}</span>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black opacity-60">{count}/{students.length} <span className="hidden sm:inline">Weak</span></span>
                    <IconWarning size={12} color="currentColor" animated={false} className={clsx("group-hover:scale-125 transition-transform", count > 0 ? "opacity-100" : "opacity-0")} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-[var(--border)]">
        <span className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest">Intensity Guide:</span>
        <div className="flex items-center gap-6">
          {[
            { l: 'Optimal', c: 'bg-[var(--card2)] border-[var(--border)]' },
            { l: 'Concern', c: 'bg-red-50 border-red-100' },
            { l: 'Critical', c: 'bg-red-100 border-red-200' },
            { l: 'Emergency', c: 'bg-red-600 border-red-700' }
          ].map(i => (
            <div key={i.l} className="flex items-center gap-2">
              <div className={clsx("w-3.5 h-3.5 rounded-md border", i.c)} />
              <span className="text-[10px] font-black text-[var(--muted2)] uppercase">{i.l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
