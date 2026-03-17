'use client';

import { clsx } from 'clsx';
import Link from 'next/link';
import { IconUsers, IconBook, IconArrowRight } from '@/components/icons';

export default function BatchCard({ batch }) {
  const getCoverageColor = (perc) => {
    if (perc < 40) return 'bg-[#c0392b]';
    if (perc < 70) return 'bg-[#d4850a]';
    return 'bg-[#2d6a4f]';
  };

  const getScoreColor = (score) => {
    if (score < 120) return 'text-[#c0392b]';
    if (score < 200) return 'text-[#d4850a]';
    return 'text-[#2d6a4f]';
  };

  return (
    <div className="bg-white p-8 rounded-[40px] border border-[#c8dfc8] shadow-sm flex flex-col gap-6 hover:translate-y-[-4px] transition-all group">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-black font-['Syne',sans-serif] text-[#1a4a2e] group-hover:text-[#2d6a4f] transition-colors">{batch.name}</h3>
          <span className="text-xs font-bold text-[#4a7a5a]">{batch.teacher?.name || 'Unassigned'}</span>
        </div>
        <span className="px-3 py-1 bg-[#f0f5ef] text-[#2d5a3d] text-[10px] font-black uppercase tracking-widest rounded-full">
          {batch.subject}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 border-y border-[#f0f5ef] py-4">
        <div className="flex flex-col">
          <span className="text-[9px] font-black uppercase tracking-widest text-[#4a7a5a] opacity-50">Students</span>
          <div className="flex items-center gap-1.5 font-black text-[#1a4a2e]">
             <IconUsers className="w-3.5 h-3.5" />
             <span className="text-sm">{batch.studentCount}</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-black uppercase tracking-widest text-[#4a7a5a] opacity-50">Avg Mock Score</span>
          <span className={clsx("text-sm font-black", getScoreColor(batch.avgScore))}>
            {batch.avgScore}/300
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
            <span className="text-[#4a7a5a]">Syllabus Coverage</span>
            <span className="text-[#1a4a2e]">{batch.avgCoverage}%</span>
        </div>
        <div className="h-2 w-full bg-[#f0f5ef] rounded-full overflow-hidden">
            <div 
              className={clsx("h-full rounded-full transition-all", getCoverageColor(batch.avgCoverage))} 
              style={{ width: `${batch.avgCoverage}%` }}
            ></div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
         {batch.weakTopics?.map((topic, i) => (
           <span key={i} className="px-3 py-1 bg-[#fde8e8] text-[#c0392b] text-[9px] font-black uppercase tracking-tighter rounded-full">
             {topic}
           </span>
         ))}
      </div>

      <Link 
        href={`/institute/batches/${batch.id}`}
        className="mt-2 flex items-center justify-center gap-2 py-4 bg-[#f0f5ef] text-[#2d6a4f] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#2d6a4f] hover:text-white transition-all group/btn"
      >
        View Batch Detail
        <IconArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
