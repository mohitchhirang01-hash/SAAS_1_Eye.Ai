'use client';

import { useState } from 'react';
import { useAdminPayments } from '@/hooks/useAdminPayments';
import StatusBadge from '@/components/admin/StatusBadge';
import { 
  IconSearch, 
  IconFilter, 
  IconCreditCard, 
  IconAlertCircle, 
  IconArrowRight,
  IconDownload,
  IconTrash
} from '@/components/icons';
import { clsx } from 'clsx';

export default function PaymentsHistoryPage() {
  const { payments, revenueStats, overdueInstitutes, isLoading, logPayment } = useAdminPayments();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMonth, setFilterMonth] = useState('All');

  const filtered = payments.filter(pay => {
    const matchesSearch = pay.institutes?.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterMonth === 'All') return matchesSearch;
    const payMonth = new Date(pay.paid_at).toLocaleString('default', { month: 'long' });
    return matchesSearch && payMonth === filterMonth;
  });

  const revenueChips = [
    { label: 'This Month', value: `₹${revenueStats.monthlyRevenue.toLocaleString()}`, color: 'text-[#2d6a4f]' },
    { label: 'Last Month', value: `₹${revenueStats.lastMonthRevenue.toLocaleString()}`, color: 'text-[#1a4a2e]' },
    { label: 'Total Lifetime', value: `₹${revenueStats.totalLifetime.toLocaleString()}`, color: 'text-[#1a4a2e]' },
    { label: 'Overdue Amount', value: `₹${revenueStats.overdueAmount.toLocaleString()}`, color: 'text-[#c0392b]' },
  ];

  return (
    <div className="flex flex-col gap-10 pb-20">
      {/* Revenue Stats Row */}
      <div className="grid grid-cols-4 gap-6">
        {revenueChips.map((chip, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[32px] border border-[#c8dfc8] shadow-sm flex flex-col gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a]">{chip.label}</span>
            <span className={clsx("text-3xl font-black font-['Syne',sans-serif]", chip.color)}>{chip.value}</span>
          </div>
        ))}
      </div>

      {/* Overdue Alert Section */}
      {overdueInstitutes.length > 0 && (
        <div className="bg-[#fde8e8] border border-[#c0392b]/20 p-8 rounded-[40px] flex flex-col gap-6">
          <div className="flex items-center gap-3 text-[#c0392b]">
            <IconAlertCircle className="w-5 h-5" />
            <h3 className="text-xl font-black font-['Syne',sans-serif]">Overdue Institutes</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {overdueInstitutes.map((inst, idx) => {
              const overdueDays = Math.ceil((new Date() - new Date(inst.expires_at)) / 86400000);
              return (
                <div key={idx} className="bg-white p-5 rounded-2xl flex items-center justify-between border border-[#c0392b]/10">
                  <div className="flex flex-col">
                    <span className="font-bold text-[#1a4a2e]">{inst.name}</span>
                    <span className="text-[10px] font-bold text-[#c0392b] uppercase tracking-widest">{overdueDays} days overdue • ₹{inst.amount.toLocaleString()} due</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-[#f7f9f4] rounded-xl text-[10px] font-black text-[#4a7a5a] hover:bg-[#e8f5e9] transition-colors">REMIND</button>
                    <button className="px-4 py-2 bg-[#2d6a4f] text-white rounded-xl text-[10px] font-black hover:bg-[#1a4a2e] transition-colors">MARK PAID</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Table Section */}
      <div className="bg-white rounded-[40px] border border-[#c8dfc8] shadow-sm overflow-hidden flex flex-col">
        <div className="p-8 border-b border-[#f0f5ef] flex items-center justify-between gap-6">
          <div className="flex-1 relative">
            <IconSearch className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#4a7a5a] opacity-40" />
            <input 
              type="text" 
              placeholder="Search by institute name..."
              className="w-full pl-12 pr-6 py-4 bg-[#f7f9f4] border border-[#c8dfc8] rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-[#2d6a4f]/5 focus:border-[#2d6a4f] transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <select 
              className="bg-[#f0f5ef] border-0 rounded-2xl px-6 py-4 text-xs font-black text-[#1a4a2e] focus:ring-0 cursor-pointer uppercase tracking-widest"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
            >
              <option>All Months</option>
              <option>January</option>
              <option>February</option>
              <option>March</option>
              {/* Add more as needed */}
            </select>
            <button className="flex items-center gap-2 px-8 py-4 bg-white border border-[#c8dfc8] rounded-2xl text-[10px] font-black text-[#2d6a4f] uppercase tracking-widest hover:bg-[#e8f5e9] transition-all">
              <IconDownload className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f0f5ef] text-[10px] font-black uppercase tracking-widest text-[#4a7a5a]">
                <th className="p-8">Date</th>
                <th className="p-8">Institute</th>
                <th className="p-8">City</th>
                <th className="p-8">Plan</th>
                <th className="p-8 text-right">Amount</th>
                <th className="p-8">Method</th>
                <th className="p-8 rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="7" className="p-20 text-center font-bold text-[#4a7a5a]">Loading payments...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" className="p-20 text-center font-bold text-[#4a7a5a]">No payments found.</td></tr>
              ) : (
                filtered.map((pay, idx) => (
                  <tr key={pay.id} className="border-b border-[#f0f5ef] last:border-0 hover:bg-[#f7f9f4] transition-colors group">
                    <td className="p-8 text-xs font-bold text-[#4a7a5a]">{new Date(pay.paid_at).toLocaleDateString()}</td>
                    <td className="p-8">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1a4a2e]">{pay.institutes?.name}</span>
                        <span className="text-[10px] text-[#4a7a5a] font-bold">{pay.notes || 'No notes'}</span>
                      </div>
                    </td>
                    <td className="p-8 text-xs font-bold text-[#2d5a3d]">{pay.institutes?.city}</td>
                    <td className="p-8"><StatusBadge status={pay.plan} /></td>
                    <td className="p-8 text-right font-black text-[#2d6a4f]">₹{pay.amount.toLocaleString()}</td>
                    <td className="p-8 text-[10px] font-black uppercase tracking-widest text-[#4a7a5a]">{pay.method}</td>
                    <td className="p-8">
                      <button className="p-3 bg-[#fde8e8] text-[#c0392b] rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-[#c0392b] hover:text-white">
                        <IconTrash className="w-4 h-4" />
                      </button>
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
