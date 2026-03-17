import { useState } from 'react';
import { IconTarget } from '@/components/icons';

export default function MockForm({ onSubmit }) {
  const [scores, setScores] = useState({ math: '', phys: '', chem: '' });

  const total = (parseInt(scores.math) || 0) + (parseInt(scores.phys) || 0) + (parseInt(scores.chem) || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!scores.math && !scores.phys && !scores.chem) return;
    onSubmit({
      date: new Date().toISOString().split('T')[0],
      math: parseInt(scores.math) || 0,
      phys: parseInt(scores.phys) || 0,
      chem: parseInt(scores.chem) || 0,
      total
    });
    setScores({ math: '', phys: '', chem: '' });
  };

  return (
    <div className="bg-[var(--card)] p-6 border border-[var(--border)] rounded-2xl shadow-sm">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)] mb-6 flex items-center gap-2">
        <IconTarget size={16} color="var(--accent)" animated={true} />
        Log Mock Test Score
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { id: 'math', label: 'Math', color: 'math', bg: 'rgba(217,119,6,.06)', border: 'rgba(217,119,6,.2)' },
            { id: 'phys', label: 'Physics', color: 'phys', bg: 'rgba(8,145,178,.06)', border: 'rgba(8,145,178,.2)' },
            { id: 'chem', label: 'Chem', color: 'chem', bg: 'rgba(219,39,119,.06)', border: 'rgba(219,39,119,.2)' }
          ].map(s => (
            <div key={s.id} className="rounded-2xl p-4 border text-center" style={{ backgroundColor: s.bg, borderColor: s.border }}>
              <label className="block text-[10px] font-black uppercase mb-3 tracking-widest" style={{ color: `var(--${s.color})` }}>{s.label}</label>
              <input 
                type="number" 
                min="0" max="100" 
                placeholder="0"
                value={scores[s.id]}
                onChange={(e) => setScores(prev => ({ ...prev, [s.id]: e.target.value }))}
                className="input-premium px-2 py-4 text-center text-2xl"
                style={{ color: `var(--${s.color})`, borderColor: `var(--${s.color})` }}
              />
              <div className="text-[10px] font-black opacity-30 mt-2" style={{ color: `var(--${s.color})` }}>/ 100</div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between gap-4 p-6 bg-[var(--accent-bg)] rounded-2xl border border-[var(--accent)]/20">
          <div className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest">
            Total Score: <span className="text-3xl text-[var(--accent)] ml-2">{total}</span>
            <span className="text-[var(--muted2)] ml-1">/ 300</span>
          </div>
          <button 
            type="submit"
            className="bg-[var(--accent)] hover:bg-[var(--accent-h)] text-white font-black py-4 px-10 rounded-xl transition-all shadow-[0_4px_16px_rgba(45,106,79,.25)] active:scale-95"
          >
            Save Result
          </button>
        </div>
      </form>
    </div>
  );
}
