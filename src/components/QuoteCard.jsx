'use client';

import { QUOTES } from "@/lib/syllabus";

export default function QuoteCard() {
  const dayOfMonth = new Date().getDate();
  const quote = QUOTES[dayOfMonth % QUOTES.length];

  return (
    <div className="bg-[var(--accent-bg)] border border-[var(--accent)]/20 shadow-sm p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group h-full rounded-2xl">
      <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity text-[var(--accent)]">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v3c0 1.25.75 2 2 2h3c0 4-4 6-4 6M15 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v3c0 1.25.75 2 2 2h3c0 4-4 6-4 6"/></svg>
      </div>
      <div className="text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.3em] mb-4">Today's Mantra</div>
      <p className="text-xl font-black text-[var(--text2)] italic relative z-10 leading-relaxed uppercase tracking-tight">
        "{quote}"
      </p>
      <div className="mt-6 w-12 h-1 bg-[var(--accent)]/30 rounded-full" />
    </div>
  );
}
