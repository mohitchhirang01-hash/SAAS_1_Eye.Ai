'use client';

import { useState } from 'react';
import { 
  IconArrow, 
  IconX, 
  IconWarning, 
  IconArrowRight,
  IconLoader 
} from '@/components/icons';
import { SYL } from '@/lib/syllabus';
import { clsx } from 'clsx';

export default function AlertComposer({ studentId = null, studentName = null, onClose, onSent }) {
  const [message, setMessage] = useState('');
  const [topicFlag, setTopicFlag] = useState('');
  const [loading, setLoading] = useState(false);

  // Flatten all topics for the dropdown
  const allTopics = [
    ...SYL.math.map(t => ({ ...t, s: 'Math' })),
    ...SYL.phys.map(t => ({ ...t, s: 'Phys' })),
    ...SYL.chem.map(t => ({ ...t, s: 'Chem' }))
  ];

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    const res = await onSent(studentId, message.trim(), topicFlag || null);
    setLoading(false);
    if (res.success) {
      setMessage('');
      setTopicFlag('');
      if (onClose) onClose();
    } else {
      alert('Error sending alert: ' + res.error);
    }
  };

  return (
    <div className={clsx("flex flex-col gap-8", !onClose && "bg-[var(--card)] p-8 border border-[var(--border)] rounded-[2rem] shadow-sm")}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center shadow-sm border border-red-100">
            <IconArrow size={24} color="var(--danger)" animated={true} />
          </div>
          <div>
            <h3 className="font-countryside text-2xl text-[var(--text)] leading-tight">
              {studentName ? `Message for ${studentName}` : 'Global Announcement'}
            </h3>
            <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em] leading-none mt-1">
              {studentId ? 'Targeted Individual Notification' : 'Broadcast to entire Batch'}
            </p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-[var(--muted2)] hover:text-[var(--text)] transition-colors" title="Close Composer">
            <IconX size={24} color="var(--muted2)" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {/* Message Input */}
        <div className="flex flex-col gap-3">
          <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest ml-1">Admin Message</label>
          <div className="relative">
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 500))}
              rows={5}
              placeholder="e.g. Focus on rotational mechanics today. mocks look weak there."
              className="input-premium px-6 py-6 h-48"
            />
            <span className="absolute bottom-5 right-6 text-[10px] font-black text-[var(--muted2)] bg-[var(--card)] px-2 py-1 rounded-md border border-[var(--border)] shadow-xs">
              {message.length}/500
            </span>
          </div>
        </div>

        {/* Topic Flag (Optional) */}
        <div className="flex flex-col gap-3">
          <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest ml-1 flex items-center gap-1.5">
            <IconWarning size={16} color="#ea580c" animated={true} /> Tag Subject Focus (Optional)
          </label>
          <div className="relative group">
            <select 
              value={topicFlag}
              onChange={(e) => setTopicFlag(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-2xl px-6 py-4.5 text-[var(--text)] text-sm font-black uppercase tracking-widest outline-none focus:border-[var(--accent)] transition-all appearance-none cursor-pointer shadow-sm"
            >
              <option value="" className="bg-white">None — Pure Announcement</option>
              {allTopics.map(t => (
                <option key={t.id} value={t.n} className="bg-white">
                  {t.s.toUpperCase()} • {t.n.toUpperCase()}
                </option>
              ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--muted2)] group-hover:text-[var(--text)] transition-colors">
              <IconArrowRight size={20} color="var(--muted2)" className="rotate-90" />
            </div>
          </div>
        </div>

        <button
          onClick={handleSend}
          disabled={loading || !message.trim()}
          className="mt-2 bg-red-600 hover:bg-red-700 text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-4 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 active:scale-[0.98]"
        >
          {loading ? (
            <>
              <IconLoader size={20} color="white" animated={true} />
              <span className="text-[10px] uppercase tracking-[.3em]">Processing Broadcast...</span>
            </>
          ) : (
            <>
              <IconArrow size={20} color="white" animated={!loading} />
              <span className="text-[10px] uppercase tracking-[.3em]">
                {studentId ? 'Push Personal Alert' : 'Blast Batch Notification'}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
