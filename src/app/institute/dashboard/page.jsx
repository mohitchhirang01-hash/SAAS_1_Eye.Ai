/* FIXED: Added DashboardSkeleton for better perceived performance (Problem 8) */
'use client';

import { useInstituteData } from '@/hooks/useInstituteData';
import { useInstituteBatches } from '@/hooks/useInstituteBatches';
import InstituteStatsRow from '@/components/institute/InstituteStatsRow';
import BatchCard from '@/components/institute/BatchCard';
import AnnouncementList from '@/components/institute/AnnouncementList';
import { DashboardSkeleton } from '@/components/Skeleton';
import { clsx } from 'clsx';
import Link from 'next/link';
import { IconBell, IconPlus } from '@/components/icons';
import StatusBadge from '@/components/admin/StatusBadge';

export default function InstituteDashboardPage() {
  const { stats, allUsers, isLoading: dataLoading } = useInstituteData();
  const { batches, isLoading: batchLoading } = useInstituteBatches();

  if (dataLoading || batchLoading) return <DashboardSkeleton />;

  const topStudents = allUsers
    .filter(u => u.role === 'student')
    .sort((a,b) => (b.coverage || 0) - (a.coverage || 0))
    .slice(0, 8);

  return (
    <div className="flex flex-col gap-10 pb-20">
      {/* SECTION 1: Stats */}
      <InstituteStatsRow stats={stats} />

      {/* SECTION 2: Batch Performance */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
           <h3 className="text-xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">Batch Performance</h3>
           <Link href="/institute/batches" className="text-xs font-black text-[#2d6a4f] hover:underline uppercase tracking-widest">
             Manage All Batches
           </Link>
        </div>
        <div className="grid grid-cols-3 gap-8">
           {batches.slice(0, 3).map(batch => (
             <BatchCard key={batch.id} batch={batch} />
           ))}
        </div>
      </div>

      {/* SECTION 3: Two Column Row */}
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Top Performing Students */}
        <div className="col-span-8 bg-white p-10 rounded-[40px] border border-[#c8dfc8] shadow-sm flex flex-col gap-8">
           <div className="flex items-center justify-between">
             <h3 className="text-xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">Top Performing Students</h3>
             <Link href="/institute/students" className="text-xs font-black text-[#2d6a4f] hover:underline transition-all">
               View All
             </Link>
           </div>
           
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-[#f0f5ef] text-[10px] font-black uppercase tracking-widest text-[#4a7a5a]">
                   <th className="p-4 rounded-l-xl">Student Name</th>
                   <th className="p-4">Batch</th>
                   <th className="p-4">Coverage</th>
                   <th className="p-4">Last Score</th>
                   <th className="p-4">Streak</th>
                   <th className="p-4 rounded-r-xl">Status</th>
                 </tr>
               </thead>
               <tbody>
                  {topStudents.map((std, i) => (
                    <tr key={std.id} className="border-b border-[#f0f5ef] last:border-0 hover:bg-[#f7f9f4] transition-colors group">
                       <td className="p-4">
                          <span className="font-bold text-sm text-[#1a4a2e] group-hover:text-[#2d6a4f] transition-colors">{std.name}</span>
                       </td>
                       <td className="p-4 text-xs font-bold text-[#4a7a5a]">
                          {batches.find(b => b.id === std.batch_id)?.name || 'Unassigned'}
                       </td>
                       <td className="p-4">
                          <div className="flex items-center gap-2">
                             <div className="w-16 h-1.5 bg-[#f0f5ef] rounded-full overflow-hidden">
                                <div className="h-full bg-[#2d6a4f] rounded-full" style={{ width: `${std.coverage || 45}%` }}></div>
                             </div>
                             <span className="text-[10px] font-black text-[#1a4a2e]">{std.coverage || 45}%</span>
                          </div>
                       </td>
                       <td className="p-4 font-black text-xs text-[#2d6a4f]">212/300</td>
                       <td className="p-4">
                          <span className="px-2 py-1 bg-[#faeeda] text-[#854f0b] text-[10px] font-black rounded-lg">12🔥</span>
                       </td>
                       <td className="p-4">
                          <StatusBadge status="active" />
                       </td>
                    </tr>
                  ))}
               </tbody>
             </table>
           </div>
        </div>

        {/* Announcements Preview */}
        <div className="col-span-4 flex flex-col gap-6">
           <div className="bg-[#1a4a2e] p-8 rounded-[40px] text-white flex flex-col gap-6 shadow-xl shadow-[#1a4a2e]/20 relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                 <h3 className="text-xl font-black font-['Syne',sans-serif]">Recent Announcements</h3>
                 <IconBell className="w-6 h-6 opacity-40 shrink-0" />
              </div>
              <AnnouncementList limit={3} />
              <Link href="/institute/announcements" className="px-5 py-4 bg-white/10 hover:bg-white text-white hover:text-[#1a4a2e] rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-center relative z-10 border border-white/20">
                 Manage Announcements
              </Link>
              {/* Abstract pattern bg */}
              <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
           </div>

           <div className="bg-white p-8 rounded-[40px] border border-[#c8dfc8] shadow-sm flex flex-col gap-6">
              <h4 className="font-black font-['Syne',sans-serif] text-[#1a4a2e]">New Announcement</h4>
              <p className="text-xs text-[#4a7a5a]">Broadcast a message to your faculty and students instantly.</p>
              <button onClick={() => window.location.href='/institute/announcements'} className="flex items-center justify-center gap-2 py-4 bg-[#e8f5e9] text-[#2d6a4f] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#2d6a4f] hover:text-white transition-all">
                Create Now
                <IconPlus className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>

      {/* SECTION 4: Subject Weakness Heatmap-style cards */}
      <div className="grid grid-cols-3 gap-8">
         {['Mathematics', 'Physics', 'Chemistry'].map((sub, i) => (
           <div key={i} className={clsx(
             "bg-white p-8 rounded-[40px] border-4 flex flex-col gap-6 shadow-sm",
             sub === 'Mathematics' ? "border-[#faeeda]" : sub === 'Physics' ? "border-[#e0f2fe]" : "border-[#fce7f3]"
           )}>
              <span className={clsx(
                "text-[10px] font-black uppercase tracking-widest",
                sub === 'Mathematics' ? "text-[#d97706]" : sub === 'Physics' ? "text-[#0891b2]" : "text-[#db2777]"
              )}>{sub} Weakness</span>
              
              <div className="flex flex-col gap-2">
                 <span className="text-2xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">12 Students</span>
                 <span className="text-[10px] font-bold text-[#4a7a5a]">flagged weak topics in this subject</span>
              </div>

              <div className="flex flex-col gap-3">
                 <span className="text-[9px] font-black uppercase tracking-widest text-[#4a7a5a] opacity-50">Top Weak Topics:</span>
                 <div className="flex flex-wrap gap-2">
                    {['Topic A', 'Topic B', 'Topic C'].map((t, idx) => (
                      <span key={idx} className="px-3 py-1 bg-[#f7f9f4] border border-[#c8dfc8] text-[9px] font-bold text-[#1a4a2e] rounded-lg">
                        {t}
                      </span>
                    ))}
                 </div>
              </div>

              <div className="mt-auto pt-6 border-t border-[#f0f5ef] flex items-center justify-between">
                 <span className="text-xs font-black text-[#1a4a2e]">62% Average</span>
                 <span className="text-[10px] font-bold text-[#4a7a5a]">15/18 topics covered</span>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}
