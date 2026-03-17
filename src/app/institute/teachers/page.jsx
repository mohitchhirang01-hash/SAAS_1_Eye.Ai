'use client';

import { useInstituteTeachers } from '@/hooks/useInstituteTeachers';
import StatusBadge from '@/components/admin/StatusBadge';
import { IconLoader, IconUsers } from '@/components/icons';
import Link from 'next/link';

export default function TeachersListPage() {
  const { teachers, isLoading, removeTeacher } = useInstituteTeachers();

  return (
    <div className="flex flex-col gap-8 pb-20">
      <div className="flex items-center justify-between">
         <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">Teachers</h1>
            <p className="text-sm font-bold text-[#4a7a5a]">Manage your institute's faculty and their assignments.</p>
         </div>
         <div className="flex items-center gap-4 px-6 py-4 bg-white border border-[#c8dfc8] rounded-[32px] shadow-sm">
            <IconUsers className="w-5 h-5 text-[#2d6a4f]" />
            <span className="text-sm font-black text-[#1a4a2e]">{teachers.length} Active Teachers</span>
         </div>
      </div>

      <div className="bg-white rounded-[40px] border border-[#c8dfc8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f0f5ef] text-[10px] font-black uppercase tracking-widest text-[#4a7a5a]">
                <th className="p-6">Teacher Name</th>
                <th className="p-6">Email Address</th>
                <th className="p-6">Assigned Batches</th>
                <th className="p-6 text-center">Total Students</th>
                <th className="p-6">Last Active</th>
                <th className="p-6 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                   <td colSpan="6" className="p-20 text-center text-sm font-bold text-[#4a7a5a]">
                      <div className="flex items-center justify-center gap-3">
                         <IconLoader className="w-5 h-5 animate-spin" />
                         Fetching faculty data...
                      </div>
                   </td>
                </tr>
              ) : teachers.length === 0 ? (
                <tr>
                   <td colSpan="6" className="p-20 text-center text-sm font-bold text-[#4a7a5a] italic opacity-50">
                      No teachers assigned to this institute yet.
                   </td>
                </tr>
              ) : (
                teachers.map((t) => (
                  <tr key={t.id} className="border-b border-[#f0f5ef] last:border-0 hover:bg-[#f7f9f4] transition-colors group">
                    <td className="p-6">
                       <span className="font-bold text-sm text-[#1a4a2e] group-hover:text-[#2d6a4f] transition-colors">{t.name}</span>
                    </td>
                    <td className="p-6 text-xs text-[#4a7a5a] font-bold">{t.email}</td>
                    <td className="p-6">
                       <div className="flex flex-wrap gap-2">
                          {t.batches.length > 0 ? t.batches.map((b, i) => (
                            <span key={i} className="px-2 py-1 bg-[#e8f5e9] text-[#2d6a4f] text-[9px] font-black rounded-lg uppercase tracking-tighter">
                               {b}
                            </span>
                          )) : <span className="text-[9px] text-[#c0392b] font-black uppercase">Unassigned</span>}
                       </div>
                    </td>
                    <td className="p-6 text-center text-sm font-black text-[#1a4a2e]">{t.studentCount}</td>
                    <td className="p-6 text-xs font-bold text-[#4a7a5a]">{t.lastActive}</td>
                    <td className="p-6 text-right">
                       <div className="flex items-center justify-end gap-4">
                          <Link href={`/institute/teachers/${t.id}`} className="text-[10px] font-black uppercase text-[#2d6a4f] hover:underline">View</Link>
                          <button onClick={() => confirm(`Disconnect ${t.name}?`) && removeTeacher(t.id)} className="text-[10px] font-black uppercase text-[#c0392b] hover:underline">Remove</button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
