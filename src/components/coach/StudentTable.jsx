'use client';

import { useState } from 'react';
import { 
  IconFlame, 
  IconBell, 
  IconArrow, 
  IconSearch, 
  IconSort 
} from '@/components/icons';
import StatusBadge from './StatusBadge';
import ScoreSparkline from './ScoreSparkline';
import Link from 'next/link';
import { clsx } from 'clsx';

export default function StudentTable({ students, onAlertStudent }) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('coverage');
  const [sortOrder, setSortOrder] = useState('desc');

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    let A = a.computed[sortKey] ?? a[sortKey];
    let B = b.computed[sortKey] ?? b[sortKey];
    if (sortOrder === 'desc') return B > A ? 1 : -1;
    return A > B ? 1 : -1;
  });

  const toggleSort = (key) => {
    if (sortKey === key) setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 240) return 'text-accent-green';
    if (score >= 180) return 'text-accent-amber';
    return 'text-accent-pink';
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Search */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-countryside text-[var(--text)]">Your Batch</h2>
        <div className="relative group">
          <IconSearch size={16} color="var(--muted2)" className="absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[var(--accent)] transition-colors" />
          <input 
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-premium pl-12 pr-6 py-5 text-sm uppercase tracking-widest"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-sm overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--card2)]/50">
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)]">#</th>
              <th className="px-6 py-5">
                <button onClick={() => toggleSort('name')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.3em] text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                  Name                  <IconSort size={12} color="var(--muted)" />
                </button>
              </th>
              <th className="px-6 py-5">
                <button onClick={() => toggleSort('streak')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.3em] text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                  Streak                  <IconSort size={12} color="var(--muted)" />
                </button>
              </th>
              <th className="px-6 py-5">
                <button onClick={() => toggleSort('coverage')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.3em] text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                  Coverage                  <IconSort size={12} color="var(--muted)" />
                </button>
              </th>
              <th className="px-6 py-5">
                <button onClick={() => toggleSort('lastScore')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.3em] text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                  Last Score <IconSort size={12} color="var(--muted)" />
                </button>
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[.3em] text-[var(--muted)]">Trend</th>
              <th className="px-6 py-5">
                <button onClick={() => toggleSort('target_score')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.3em] text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                  Target <IconSort size={12} color="var(--muted)" />
                </button>
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[.3em] text-[var(--muted)] text-center">Status</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[.3em] text-[var(--muted)] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filtered.map((s, idx) => (
              <tr key={s.id} className="hover:bg-[var(--card2)] transition-colors group">
                <td className="px-6 py-6 text-xs font-black text-[var(--muted2)]">{idx + 1}</td>
                <td className="px-6 py-6">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-black text-sm text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">{s.name}</span>
                    <span className="text-[10px] font-black text-[var(--muted2)] uppercase tracking-wider">{s.email}</span>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-2 font-black text-orange-600">
                    <IconFlame size={16} color="#ea580c" animated={true} />
                    <span className="text-sm">{s.computed.streak}</span>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="flex flex-col gap-2 w-36">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest leading-none">
                      <span className="text-[var(--muted)]">{s.progress.done.length}/54</span>
                      <span className="text-[var(--accent)]">{s.computed.coverage}%</span>
                    </div>
                    <div className="h-1.5 bg-[var(--card2)] rounded-full overflow-hidden border border-[var(--border)] shadow-inner">
                      <div className="h-full bg-[var(--phys)] transition-all duration-1000 shadow-[0_0_8px_rgba(8,145,178,0.3)]" style={{ width: `${s.computed.coverage}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <span className={clsx("font-black text-xl", getScoreColor(s.computed.lastScore))}>
                    {s.computed.lastScore || '—'}
                  </span>
                  <span className="text-[10px] text-[var(--muted2)] font-black ml-1">/300</span>
                </td>
                <td className="px-6 py-6">
                  <div className="w-24">
                    <ScoreSparkline scores={s.progress.mocks.slice(-5).map(m => m.total)} />
                  </div>
                </td>
                <td className="px-6 py-6 text-center font-black text-[var(--text)]/40 text-sm tracking-widest">{s.target_score}</td>
                <td className="px-6 py-6 text-center">
                  <StatusBadge status={s.computed.status} />
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center justify-end gap-3 text-right">
                    <button 
                      onClick={() => onAlertStudent(s)}
                      className="p-3 bg-[var(--card2)] hover:bg-[var(--accent-bg)] border border-[var(--border)] hover:border-[var(--accent)]/30 rounded-xl text-[var(--muted)] hover:text-[var(--accent)] transition-all shadow-sm group/btn"
                      title="Send Alert"
                    >
                      <IconBell size={16} color="var(--muted)" hasUnread={true} animated={true} className="group-hover/btn:scale-110 transition-transform" />
                    </button>
                    <Link 
                      href={`/coach/student/${s.id}`}
                      className="p-3 bg-[var(--accent)] hover:bg-[var(--accent-h)] border border-[var(--accent)]/10 rounded-xl text-white transition-all shadow-md active:scale-95 group/btn"
                      title="View Analysis"
                    >
                      <IconArrow size={16} color="white" animated={true} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="9" className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <IconSearch size={40} color="var(--border)" animated={false} />
                    <p className="text-[var(--muted2)] text-[10px] font-black uppercase tracking-[0.4em]">No student profiles found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
