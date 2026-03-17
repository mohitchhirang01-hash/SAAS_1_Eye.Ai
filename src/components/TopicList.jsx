'use client';

import { clsx } from "clsx";
import { 
  IconCheck, 
  IconWarning, 
  IconClock 
} from '@/components/icons';

export default function TopicList({ topics, subject, done, tags, onToggleDone, onToggleTag }) {
  const configs = {
    math: { color: 'var(--math)', bg: 'rgba(217, 119, 6, 0.1)', border: '#d97706' },
    phys: { color: 'var(--phys)', bg: 'rgba(8, 145, 178, 0.1)', border: '#0891b2' },
    chem: { color: 'var(--chem)', bg: 'rgba(219, 39, 119, 0.1)', border: '#db2777' }
  };

  const config = configs[subject];

  return (
    <div className="flex flex-col gap-2">
      {topics.map((t) => {
        const isDone = done.has(t.id);
        const tag = tags[t.id];

        return (
          <div 
            key={t.id}
            onClick={() => onToggleDone(t.id)}
            className={clsx(
              "flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group",
              isDone 
                ? "bg-[var(--accent-bg)] border-[var(--border)]" 
                : "bg-[var(--card)] border-[var(--border)] hover:bg-[var(--card2)] hover:border-[var(--border2)]"
            )}
          >
            <div className={clsx(
              "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
              isDone 
                ? "bg-[var(--accent)] border-[var(--accent)]" 
                : "border-[var(--border2)] group-hover:border-[var(--accent)]"
            )}
            style={{ backgroundColor: isDone ? config.color : '', borderColor: isDone ? config.color : '' }}
            >
              {isDone && <IconCheck size={14} color="white" animated={false} />}
            </div>
            
            <span className={clsx(
              "flex-1 text-base font-bold",
              isDone ? "text-[var(--muted)] line-through" : "text-[var(--text2)]"
            )}>
              {t.n}
            </span>

            <div className="flex gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); onToggleTag(t.id, 'weak'); }}
                className={clsx(
                  "p-2 rounded-lg border transition-all",
                  tag === 'weak' 
                    ? "bg-[var(--danger)]/10 border-[var(--danger)] text-[var(--danger)]" 
                    : "border-[var(--border)] text-[var(--muted2)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/5"
                )}
                style={tag === 'weak' ? { backgroundColor: 'rgba(219,39,119,.1)', borderColor: '#db2777', color: '#db2777' } : {}}
              >
                <IconWarning size={14} animated={false} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onToggleTag(t.id, 'revision'); }}
                className={clsx(
                  "p-2 rounded-lg border transition-all",
                  tag === 'revision' 
                    ? "bg-[var(--warning)]/10 border-[var(--warning)] text-[var(--warning)]" 
                    : "border-[var(--border)] text-[var(--muted2)] hover:text-[var(--warning)] hover:bg-[var(--warning)]/5"
                )}
                style={tag === 'revision' ? { backgroundColor: 'rgba(217,119,6,.1)', borderColor: '#d97706', color: '#d97706' } : {}}
              >
                <IconClock size={14} animated={false} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
