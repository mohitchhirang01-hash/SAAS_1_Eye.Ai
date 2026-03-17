'use client';

import { useState, useEffect } from 'react';
import { 
  IconTarget, 
  IconCheck, 
  IconArrow,
  IconLoader
} from '@/components/icons';
import { clsx } from 'clsx';

export default function SetTargetInput({ currentTarget, studentId, onSave }) {
  const [val, setVal] = useState(currentTarget || 200);
  const [state, setState] = useState('idle'); // idle, loading, saved

  useEffect(() => {
    setVal(currentTarget);
  }, [currentTarget]);

  const handleSave = async () => {
    if (val === currentTarget) return;
    setState('loading');
    const res = await onSave(studentId, parseInt(val));
    if (res.success) {
      setState('saved');
      setTimeout(() => setState('idle'), 2000);
    } else {
      setState('idle');
      alert('Failed to update target: ' + res.error);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest ml-1">Target Score Strategy (JEE)</label>
      <div className="flex items-center gap-3">
        <div className="relative flex-1 group">
          <IconTarget size={16} color="var(--muted2)" className="absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[var(--accent)] transition-colors" />
          <input 
            type="number" 
            min="0" 
            max="300"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="input-premium pl-11 pr-4 py-5"
          />
        </div>
        <button 
          onClick={handleSave}
          disabled={state === 'loading' || val === currentTarget}
          className={clsx(
            "p-4 px-5 rounded-2xl transition-all flex items-center justify-center overflow-hidden h-[60px] shadow-lg active:scale-95 disabled:opacity-30 disabled:shadow-none",
            state === 'saved' ? "bg-[var(--accent)] text-white shadow-[var(--accent)]/20" : 
            val === currentTarget ? "bg-[var(--card2)] text-[var(--muted2)] border border-[var(--border)]" : "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20"
          )}
        >
          {state === 'loading' ? <IconLoader size={20} color="var(--accent)" animated={true} /> : 
           state === 'saved' ? <IconCheck size={20} color="white" animated={true} /> : 
           <IconArrow size={24} color="white" animated={false} />}
        </button>
      </div>
    </div>
  );
}
