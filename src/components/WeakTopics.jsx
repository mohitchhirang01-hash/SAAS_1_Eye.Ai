'use client';

import { useProgressContext } from "@/app/Providers";
import { SYL } from "@/lib/syllabus";

import { IconWarning } from "@/components/icons";

export default function WeakTopics() {
  const { S } = useProgressContext();
  
  const weakTopicIds = Object.entries(S.tags)
    .filter(([_, tag]) => tag === 'weak')
    .map(([id, _]) => id);

  const allTopics = [...SYL.math, ...SYL.phys, ...SYL.chem];
  const weakTopics = weakTopicIds.map(id => allTopics.find(t => t.id === id)).filter(Boolean);

  const displayList = weakTopics.slice(0, 5);
  const remaining = weakTopics.length - 5;

  return (
    <div className="bg-[var(--card)] p-6 h-full flex flex-col border border-[var(--chem)]/20 shadow-sm rounded-2xl">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--chem)] mb-6 flex items-center gap-2">
        <IconWarning size={15} color="var(--chem)" animated={true} />
        Focus Areas (Weak Topics)
      </h3>
      {weakTopics.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-[var(--accent)] text-sm font-bold italic">
          None flagged! Standard optimization achieved.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {displayList.map(topic => (
            <div key={topic.id} className="flex items-center gap-3 p-4 bg-[var(--card2)] rounded-xl border border-[var(--border)] text-xs font-bold text-[var(--text2)] hover:border-[var(--chem)]/30 transition-all">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--chem)]/40" />
              {topic.n}
            </div>
          ))}
          {remaining > 0 && (
            <div className="text-center text-[10px] font-black text-[var(--muted)] uppercase tracking-widest mt-4">
              + {remaining} more items
            </div>
          )}
        </div>
      )}
    </div>
  );
}
