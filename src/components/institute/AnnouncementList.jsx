'use client';

import { useInstituteAnnouncements } from '@/hooks/useInstituteAnnouncements';
import { IconBell, IconTrash } from '@/components/icons';
import { clsx } from 'clsx';

export default function AnnouncementList({ limit = null }) {
  const { announcements, deleteAnnouncement, isLoading } = useInstituteAnnouncements();

  if (isLoading) return <div className="space-y-4 animate-pulse">
    {[1,2,3].map(i => <div key={i} className="h-24 bg-[#f0f5ef] rounded-[32px]"></div>)}
  </div>;

  const displayList = limit ? announcements.slice(0, limit) : announcements;

  if (displayList.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 text-center text-[#4a7a5a] opacity-50 italic">
       <IconBell className="w-10 h-10 mb-4" />
       <span className="text-sm font-bold">No announcements yet.</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {displayList.map((ann) => (
        <div key={ann.id} className="p-6 bg-[#f7f9f4] rounded-[32px] border border-[#c8dfc8] flex flex-col gap-3 group">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <h4 className="font-black font-['Syne',sans-serif] text-[#1a4a2e]">{ann.title}</h4>
              <div className="flex items-center gap-3">
                 <span className={clsx(
                   "text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter",
                   ann.target === 'all' ? "bg-[#e8f5e9] text-[#2d6a4f]" : "bg-[#faeeda] text-[#854f0b]"
                 )}>
                   {ann.target}
                 </span>
                 <span className="text-[9px] font-bold text-[#4a7a5a] opacity-50">
                    {new Date(ann.created_at).toLocaleDateString()}
                 </span>
              </div>
            </div>
            <button 
              onClick={() => confirm('Delete announcement?') && deleteAnnouncement(ann.id)}
              className="p-2 opacity-0 group-hover:opacity-100 text-[#c0392b] hover:bg-[#fde8e8] rounded-lg transition-all"
            >
              <IconTrash className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-[#4a7a5a] leading-relaxed line-clamp-2">
            {ann.message}
          </p>
        </div>
      ))}
    </div>
  );
}
