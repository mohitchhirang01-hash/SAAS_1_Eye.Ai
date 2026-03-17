'use client';

import { clsx } from 'clsx';

export default function SubjectCoverageBar({ label, coverage, studentsWithWeak, colorClass }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-[#1a4a2e] uppercase tracking-widest">{label}</span>
        <div className="flex items-center gap-2">
           <span className="text-xs font-black text-[#1a4a2e]">{coverage}% Avg</span>
           <span className="text-[10px] text-[#4a7a5a] opacity-50 font-bold">18/24 topics</span>
        </div>
      </div>
      <div className="h-3 w-full bg-[#f0f5ef] rounded-full overflow-hidden">
        <div 
          className={clsx("h-full rounded-full", colorClass)} 
          style={{ width: `${coverage}%` }}
        />
      </div>
      <span className="text-[10px] font-bold text-[#c0392b]">
        {studentsWithWeak} students have weak topics in {label}
      </span>
    </div>
  );
}
