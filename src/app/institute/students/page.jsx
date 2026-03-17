'use client';

import { useState } from 'react';
import { useInstituteData } from '@/hooks/useInstituteData';
import { useInstituteBatches } from '@/hooks/useInstituteBatches';
import StatusBadge from '@/components/admin/StatusBadge';
import { IconSearch, IconFilter, IconLoader, IconEye } from '@/components/icons';
import { clsx } from 'clsx';
import Link from 'next/link';

export default function StudentsListPage() {
  const { allUsers, isLoading } = useInstituteData();
  const { batches } = useInstituteBatches();
  const [search, setSearch] = useState('');
  const [batchFilter, setBatchFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const students = allUsers.filter(u => u.role === 'student');

  const filtered = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesBatch = batchFilter === 'All' || s.batch_id === batchFilter;
    const matchesStatus = statusFilter === 'All' || (s.status || 'active') === statusFilter.toLowerCase();
    return matchesSearch && matchesBatch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-8 pb-20">
      <div className="flex items-center justify-between">
         <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">All Students</h1>
            <p className="text-sm font-bold text-[#4a7a5a]">Track academics and streaks for every student in your institute.</p>
         </div>
         <div className="px-6 py-3 bg-white border border-[#c8dfc8] rounded-full text-xs font-black text-[#2d6a4f] shadow-sm">
            {filtered.length} Students Listed
         </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-[#c8dfc8] shadow-sm">
         <div className="flex-1 relative">
            <IconSearch className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#4a7a5a] opacity-40" />
            <input 
              type="text" 
              className="w-full pl-12 pr-6 py-3.5 bg-[#f7f9f4] border border-[#c8dfc8] rounded-xl text-sm focus:outline-none focus:border-[#2d6a4f]"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <select 
           className="bg-[#f0f5ef] border-0 rounded-xl px-5 py-3.5 text-xs font-black text-[#1a4a2e] focus:ring-0 cursor-pointer min-w-[150px]"
           value={batchFilter}
           onChange={(e) => setBatchFilter(e.target.value)}
         >
            <option value="All">All Batches</option>
            {batches.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
         </select>
         <select 
           className="bg-[#f0f5ef] border-0 rounded-xl px-5 py-3.5 text-xs font-black text-[#1a4a2e] focus:ring-0 cursor-pointer min-w-[150px]"
           value={statusFilter}
           onChange={(e) => setStatusFilter(e.target.value)}
         >
            <option>All Status</option>
            <option>Active</option>
            <option>Idle</option>
            <option>Inactive</option>
         </select>
      </div>

      <div className="bg-white rounded-[40px] border border-[#c8dfc8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f0f5ef] text-[10px] font-black uppercase tracking-widest text-[#4a7a5a]">
                <th className="p-6">#</th>
                <th className="p-6">Student Name</th>
                <th className="p-6">Batch</th>
                <th className="p-6 text-center">Streak</th>
                <th className="p-6">Coverage</th>
                <th className="p-6">Last Score</th>
                <th className="p-6 text-center">Status</th>
                <th className="p-6 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="8" className="p-20 text-center font-bold text-[#4a7a5a]">Loading student database...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="8" className="p-20 text-center font-bold text-[#4a7a5a] opacity-50 italic">No matching students.</td></tr>
              ) : (
                filtered.map((s, idx) => (
                  <tr key={s.id} className="border-b border-[#f0f5ef] last:border-0 hover:bg-[#f7f9f4] transition-colors group">
                    <td className="p-6 text-[10px] font-black opacity-30">{idx + 1}</td>
                    <td className="p-6">
                       <span className="font-bold text-sm text-[#1a4a2e] group-hover:text-[#2d6a4f] transition-colors">{s.name}</span>
                    </td>
                    <td className="p-6 text-xs font-bold text-[#4a7a5a]">
                       {batches.find(b => b.id === s.batch_id)?.name || 'Unassigned'}
                    </td>
                    <td className="p-6 text-center">
                       <span className="px-2 py-1 bg-[#faeeda] text-[#854f0b] text-[10px] font-black rounded-lg">14🔥</span>
                    </td>
                    <td className="p-6">
                       <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-[#f0f5ef] rounded-full overflow-hidden">
                             <div className="h-full bg-[#2d6a4f]" style={{ width: `${s.coverage || 42}%` }}></div>
                          </div>
                          <span className="text-[10px] font-black text-[#1a4a2e]">{s.coverage || 42}%</span>
                       </div>
                    </td>
                    <td className="p-6 font-black text-xs text-[#d97706]">192/300</td>
                    <td className="p-6 text-center"><StatusBadge status={s.status || 'active'} /></td>
                    <td className="p-6 text-right">
                       <Link 
                         href={`/institute/students/${s.id}`}
                         className="p-3 bg-[#e8f5e9] text-[#2d6a4f] rounded-xl hover:bg-[#2d6a4f] hover:text-white transition-all inline-block"
                       >
                         <IconEye className="w-4 h-4" />
                       </Link>
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
