'use client';

import { useState } from 'react';
import { useAdminInstitutes } from '@/hooks/useAdminInstitutes';
import StatusBadge from '@/components/admin/StatusBadge';
import Link from 'next/link';
import { clsx } from 'clsx';
import { 
  IconSearch, 
  IconFilter, 
  IconArrowUpRight, 
  IconTrash, 
  IconCircleMinus,
  IconEye
} from '@/components/icons';

export default function InstitutesListPage() {
  const { institutes, isLoading, suspendInstitute, deleteInstitute } = useAdminInstitutes();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortConfig, setSortConfig] = useState('Newest');

  const filtered = institutes.filter(inst => {
    const matchesSearch = inst.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inst.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All' || inst.payment_status === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    if (sortConfig === 'Newest') return new Date(b.created_at) - new Date(a.created_at);
    if (sortConfig === 'Oldest') return new Date(a.created_at) - new Date(b.created_at);
    if (sortConfig === 'A-Z') return a.name.localeCompare(b.name);
    if (sortConfig === 'Revenue') return (b.amount || 0) - (a.amount || 0);
    return 0;
  });

  const handleSuspend = async (id, name) => {
    if (confirm(`Are you sure you want to SUSPEND "${name}"? This will disable all associated accounts.`)) {
      await suspendInstitute(id);
    }
  };

  const handleDelete = async (id, name) => {
    const entry = prompt(`Type "${name}" to confirm COMPLETE deletion of this institute and all its users:`);
    if (entry === name) {
      await deleteInstitute(id);
    } else if (entry !== null) {
      alert("Name mismatch. Deletion cancelled.");
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Search + Filter Bar */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-[#c8dfc8] shadow-sm">
        <div className="flex-1 relative">
          <IconSearch className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#4a7a5a] opacity-50" />
          <input 
            type="text" 
            placeholder="Search by name or city..."
            className="w-full pl-12 pr-6 py-4 bg-[#f7f9f4] border border-[#c8dfc8] rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-[#2d6a4f]/5 focus:border-[#2d6a4f] transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-1 min-w-[140px]">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a] ml-1">Status</span>
            <select 
              className="bg-[#f0f5ef] border-0 rounded-xl px-4 py-3 text-xs font-bold text-[#1a4a2e] focus:ring-0 cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option>All</option>
              <option>Active</option>
              <option>Trial</option>
              <option>Overdue</option>
              <option>Suspended</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 min-w-[140px]">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a] ml-1">Sort By</span>
            <select 
              className="bg-[#f0f5ef] border-0 rounded-xl px-4 py-3 text-xs font-bold text-[#1a4a2e] focus:ring-0 cursor-pointer"
              value={sortConfig}
              onChange={(e) => setSortConfig(e.target.value)}
            >
              <option>Newest</option>
              <option>Oldest</option>
              <option>A-Z</option>
              <option>Revenue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Institutes Table Card */}
      <div className="bg-white rounded-[32px] border border-[#c8dfc8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f0f5ef] text-[10px] font-black uppercase tracking-widest text-[#4a7a5a]">
                <th className="p-6">#</th>
                <th className="p-6">Institute</th>
                <th className="p-6">City</th>
                <th className="p-6">Plan</th>
                <th className="p-6">Users</th>
                <th className="p-6 text-right">Revenue</th>
                <th className="p-6 text-center">Status</th>
                <th className="p-6">Expires</th>
                <th className="p-6 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="9" className="p-20 text-center text-sm font-bold text-[#4a7a5a]">
                    Loading institutes...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-20 text-center text-sm font-bold text-[#4a7a5a]">
                    No institutes found.
                  </td>
                </tr>
              ) : (
                filtered.map((inst, idx) => {
                  const daysLeft = Math.ceil((new Date(inst.expires_at) - new Date()) / 86400000);
                  const isExpiringSoon = daysLeft <= 7 && daysLeft >= 0;
                  const isExpired = daysLeft < 0;

                  return (
                    <tr key={inst.id} className="border-b border-[#f0f5ef] last:border-0 hover:bg-[#f7f9f4] transition-colors group">
                      <td className="p-6 text-xs font-black text-[#4a7a5a] opacity-30">{idx + 1}</td>
                      <td className="p-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#1a4a2e] group-hover:text-[#2d6a4f] transition-colors">{inst.name}</span>
                          <span className="text-[10px] text-[#4a7a5a]">{inst.owner_name}</span>
                        </div>
                      </td>
                      <td className="p-6 text-xs font-bold text-[#2d5a3d]">{inst.city}</td>
                      <td className="p-6"><StatusBadge status={inst.plan} /></td>
                      <td className="p-6 text-[10px] font-black text-[#4a7a5a]">
                        <span className="text-[#1a4a2e]">{inst.userCount}</span> / {inst.student_limit}
                      </td>
                      <td className="p-6 text-right font-black text-sm text-[#2d6a4f]">₹{(inst.amount || 0).toLocaleString()}</td>
                      <td className="p-6 text-center"><StatusBadge status={inst.payment_status} /></td>
                      <td className="p-6">
                        <div className="flex flex-col">
                          <span className={clsx(
                            "text-[10px] font-black uppercase tracking-wider",
                            isExpired ? "text-[#c0392b]" : isExpiringSoon ? "text-[#d4850a]" : "text-[#4a7a5a]"
                          )}>
                            {isExpired ? `${Math.abs(daysLeft)} days ago` : `in ${daysLeft} days`}
                          </span>
                          <span className="text-[9px] font-bold opacity-30 mt-1">{new Date(inst.expires_at).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            href={`/admin/institutes/${inst.id}`}
                            className="p-3 bg-[#e8f5e9] text-[#2d6a4f] rounded-xl hover:bg-[#2d6a4f] hover:text-white transition-all"
                            title="View Details"
                          >
                            <IconEye className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => handleSuspend(inst.id, inst.name)}
                            className="p-3 bg-[#f1efe8] text-[#5f5e5a] rounded-xl hover:bg-[#5f5e5a] hover:text-white transition-all"
                            title="Suspend"
                          >
                            <IconCircleMinus className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(inst.id, inst.name)}
                            className="p-3 bg-[#fde8e8] text-[#c0392b] rounded-xl hover:bg-[#c0392b] hover:text-white transition-all"
                            title="Delete"
                          >
                            <IconTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
