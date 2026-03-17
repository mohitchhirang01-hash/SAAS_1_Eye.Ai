'use client';

import { 
  IconTrash, 
  IconWarning, 
  IconCalendar, 
  IconInfo 
} from '@/components/icons';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { clsx } from 'clsx';

export default function FocusTopicsList({ focusTopics, onRemove }) {
  const getSubjectColor = (s) => ({
    math: 'text-[var(--math)] border-[var(--math)]/30 bg-[var(--math)]/10',
    phys: 'text-[var(--phys)] border-[var(--phys)]/30 bg-[var(--phys)]/10',
    chem: 'text-[var(--chem)] border-[var(--chem)]/30 bg-[var(--chem)]/10'
  }[s.toLowerCase()]);

  if (focusTopics.length === 0) {
    return (
      <div className="bg-[var(--card)] p-16 border border-dashed border-[var(--border)] rounded-3xl flex flex-col items-center justify-center gap-5 text-center shadow-inner">
        <div className="w-16 h-16 bg-[var(--card2)] border border-[var(--border)] rounded-2xl flex items-center justify-center rotate-3 shadow-sm">
          <IconInfo size={32} color="var(--muted2)" animated={false} />
        </div>
        <div>
          <p className="text-[var(--text)] font-black uppercase tracking-widest text-sm mb-2">No Active Focus Topics</p>
          <p className="text-[10px] text-[var(--muted2)] uppercase font-black tracking-[.2em]">Flag topics from the struggle map above to sync with students</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {focusTopics.map((topic) => (
        <div key={topic.id} className="bg-[var(--card)] p-7 group flex flex-col gap-6 border border-[var(--border)] rounded-3xl hover:border-[var(--accent)] transition-all shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-3">
              <div className={clsx(
                "px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest w-fit shadow-xs",
                getSubjectColor(topic.subject)
              )}>
                {topic.subject}
              </div>
              <h4 className="text-[var(--text)] text-xl font-black tracking-tight leading-tight">{topic.topic_name}</h4>
            </div>
            <button 
              onClick={() => onRemove(topic.id)}
              className="p-2.5 text-[var(--muted2)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/5 rounded-xl transition-all border border-transparent hover:border-[var(--danger)]/20 shadow-sm"
              title="Remove target"
            >
              <IconTrash size={20} color="var(--muted2)" className="group-hover:text-[var(--danger)] transition-colors" />
            </button>
          </div>

          <div className="bg-[var(--card2)] p-6 rounded-2xl border border-[var(--border)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
            <div className="flex items-center gap-2 mb-3">
              <IconWarning size={16} color="#ea580c" animated={true} />
              <span className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[.3em]">Coach's Note</span>
            </div>
            <p className="text-sm text-[var(--text2)] font-semibold italic leading-relaxed">
              "{topic.note || 'No specific note added. Focus on conceptual clarity and mock coverage for this topic.'}"
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
            <div className="flex items-center gap-2 text-[var(--muted2)]">
              <IconCalendar size={14} color="var(--muted2)" animated={false} />
              <span className="text-[10px] font-black uppercase tracking-widest">Added {formatDistanceToNow(parseISO(topic.created_at))} ago</span>
            </div>
            <div className="h-2 w-2 rounded-full bg-orange-600 animate-pulse shadow-[0_0_10px_rgba(234,88,12,0.4)]" />
          </div>
        </div>
      ))}
    </div>
  );
}
