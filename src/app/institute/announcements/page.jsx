'use client';

import AnnouncementComposer from '@/components/institute/AnnouncementComposer';
import AnnouncementList from '@/components/institute/AnnouncementList';
import { useInstituteAnnouncements } from '@/hooks/useInstituteAnnouncements';

export default function AnnouncementsPage() {
  const { refresh } = useInstituteAnnouncements();

  return (
    <div className="grid grid-cols-12 gap-10 pb-20">
      <div className="col-span-12 flex flex-col gap-2">
         <h1 className="text-3xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">Announcements</h1>
         <p className="text-sm font-bold text-[#4a7a5a]">Broadcast important updates to your teachers and students.</p>
      </div>

      <div className="col-span-5 flex flex-col gap-6">
         <AnnouncementComposer onSuccess={refresh} />
      </div>

      <div className="col-span-7 bg-white p-10 rounded-[40px] border border-[#c8dfc8] shadow-sm flex flex-col gap-8">
         <h3 className="text-xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">Sent Announcements</h3>
         <AnnouncementList />
      </div>
    </div>
  );
}
