'use client';

import { useState } from 'react';
import { useProgressContext } from "@/app/Providers";
import { SYL } from "@/lib/syllabus";
import { clsx } from 'clsx';
import TopicList from '@/components/TopicList';
import { 
  IconCheck, 
  IconWarning, 
  IconSigma, 
  IconAtom, 
  IconFlask,
  IconClock
} from '@/components/icons';

export default function SyllabusPage() {
  const [activeSub, setActiveSub] = useState('math');
  const { S, updateDone, updateTag, getCov } = useProgressContext();

  const subjects = [
    { id: 'math', name: 'Mathematics', icon: IconSigma, ring: 'var(--math)' },
    { id: 'phys', name: 'Physics', icon: IconAtom, ring: 'var(--phys)' },
    { id: 'chem', name: 'Chemistry', icon: IconFlask, ring: 'var(--chem)' }
  ];

  const currentCov = getCov(activeSub);
  const activeConfig = subjects.find(s => s.id === activeSub);

  return (
    <div className="flex flex-col gap-8">
      {/* Subject Switchers */}
      <div className="flex gap-4 p-1.5 bg-[var(--card2)] rounded-2xl border border-[var(--border)]">
        {subjects.map((sub) => {
          const Icon = sub.icon;
          return (
            <button
              key={sub.id}
              onClick={() => setActiveSub(sub.id)}
              className={clsx(
                "flex-1 py-4 px-6 rounded-xl font-black transition-all text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3",
                activeSub === sub.id 
                  ? "bg-[var(--card)] border-[var(--border2)] text-[var(--text)] shadow-sm border" 
                  : "bg-transparent text-[var(--muted)] hover:text-[var(--text2)] hover:bg-[var(--card)]/50 border border-transparent"
              )}
            >
              <Icon size={16} color={activeSub === sub.id ? sub.ring : "var(--muted2)"} animated={false} />
              <span>{sub.name}</span>
            </button>
          );
        })}
      </div>

      {/* Progress Header */}
      <div className="bg-[var(--card)] p-8 border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden relative group">
        <div 
          className="absolute inset-0 opacity-[0.03] transition-opacity group-hover:opacity-[0.06]" 
          style={{ backgroundColor: activeConfig.ring }}
        />
        <div className="relative z-10">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="text-[var(--muted)] text-[10px] font-black uppercase tracking-[0.2em] mb-2 font-black">Detailed Progress</div>
              <h2 className="text-4xl font-black text-[var(--text)]">{currentCov.done} <span className="text-[var(--muted2)]">/ {currentCov.total}</span></h2>
            </div>
            <div className="text-5xl font-black" style={{ color: activeConfig.ring }}>{currentCov.pct}%</div>
          </div>
          <div className="h-3 bg-black/[0.08] rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-1000 ease-out shadow-sm" 
              style={{ width: `${currentCov.pct}%`, backgroundColor: activeConfig.ring }}
            />
          </div>
          <div className="flex gap-6 mt-8">
            <LegendItem label="Topic Done" icon={<IconCheck size={12} color="var(--accent)" animated={false} />} />
            <LegendItem label="Weak Area" icon={<IconWarning size={12} color="var(--chem)" animated={false} />} />
            <LegendItem label="For Revision" icon={<IconClock size={12} color="var(--math)" animated={false} />} />
          </div>
        </div>
      </div>

      {/* FIXED: Removed entrance animation for faster feel (Cleanup) */}
      {/* Topic List */}
      <div>
        <TopicList 
          subject={activeSub}
          topics={SYL[activeSub]}
          done={S.done}
          tags={S.tags}
          onToggleDone={updateDone}
          onToggleTag={updateTag}
        />
      </div>
    </div>
  );
}

function LegendItem({ label, icon }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest">{label}</span>
    </div>
  );
}
