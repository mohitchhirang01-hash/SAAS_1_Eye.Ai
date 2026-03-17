/* FIXED: Added DashboardSkeleton for better perceived performance (Problem 8) */
'use client';

import { useEffect, useRef } from 'react';
import { useAdminInstitutes } from '@/hooks/useAdminInstitutes';
import { useAdminPayments } from '@/hooks/useAdminPayments';
import StatusBadge from '@/components/admin/StatusBadge';
import Link from 'next/link';
import Chart from 'chart.js/auto';
import { clsx } from 'clsx';
import { DashboardSkeleton } from '@/components/Skeleton';
import { 
  IconUsers, 
  IconCheck, 
  IconClock, 
  IconAlertCircle, 
  IconCreditCard
} from '@/components/icons';

export default function AdminDashboardPage() {
  const { institutes, stats, isLoading: instLoading } = useAdminInstitutes();
  const { payments, revenueStats, overdueInstitutes, isLoading: payLoading } = useAdminPayments();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current && !payLoading) {
      if (chartInstance.current) chartInstance.current.destroy();
      
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'], // Mock labels for now
          datasets: [{
            label: 'Monthly Revenue',
            data: [12000, 19000, 15000, 25000, 22000, revenueStats.monthlyRevenue],
            backgroundColor: '#2d6a4f',
            borderRadius: 8,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { grid: { color: 'rgba(0,0,0,0.06)' }, border: { display: false } },
            x: { grid: { display: false }, border: { display: false } }
          }
        }
      });
    }
  }, [payLoading, revenueStats.monthlyRevenue]);

  if (instLoading || payLoading) return <DashboardSkeleton />;

  const statChips = [
    { label: 'Total Institutes', value: stats.total, icon: IconUsers, color: 'text-[#2d6a4f]' },
    { label: 'Active', value: stats.active, icon: IconCheck, color: 'text-[#2d6a4f]' },
    { label: 'On Trial', value: stats.trial, icon: IconClock, color: 'text-[#d4850a]' },
    { label: 'Overdue', value: stats.overdue, icon: IconAlertCircle, color: 'text-[#c0392b]' },
    { label: 'Monthly Revenue', value: `₹${revenueStats.monthlyRevenue.toLocaleString()}`, icon: IconCreditCard, color: 'text-[#2d6a4f]' },
  ];

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Platform Stats Row */}
      <div className="grid grid-cols-5 gap-4">
        {statChips.map((chip, idx) => {
          const Icon = chip.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-[#c8dfc8] shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a]">{chip.label}</span>
                <Icon className={clsx("w-4 h-4", chip.color)} />
              </div>
              <span className={clsx("text-3xl font-black font-['Syne',sans-serif]", chip.color)}>
                {chip.value}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Revenue Overview */}
        <div className="col-span-8 bg-white p-8 rounded-[32px] border border-[#c8dfc8] shadow-sm flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black font-['Syne',sans-serif] text-[#1a4a2e]">Revenue Overview</h3>
            <div className="flex gap-10">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a]">This Month</span>
                <span className="text-3xl font-black font-['Syne',sans-serif] text-[#2d6a4f]">₹{revenueStats.monthlyRevenue.toLocaleString()}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a]">Lifetime Total</span>
                <span className="text-3xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">₹{revenueStats.totalLifetime.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="h-64 relative">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        {/* Upcoming Renewals */}
        <div className="col-span-4 bg-white p-8 rounded-[32px] border border-[#c8dfc8] shadow-sm flex flex-col gap-6">
          <h3 className="text-lg font-black font-['Syne',sans-serif] text-[#1a4a2e]">Upcoming Renewals</h3>
          <div className="flex flex-col gap-4">
            {overdueInstitutes.length > 0 ? (
              overdueInstitutes.map((inst, idx) => (
                <div key={idx} className="p-4 bg-[#f7f9f4] rounded-2xl flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-[#1a4a2e]">{inst.name}</span>
                    <span className="text-[10px] text-[#c0392b] font-bold">Expires: {new Date(inst.expires_at).toLocaleDateString()}</span>
                  </div>
                  <button className="px-4 py-2 bg-white border border-[#c8dfc8] rounded-xl text-[10px] font-black text-[#2d6a4f] hover:bg-[#e8f5e9] transition-colors">
                    LOG PAYMENT
                  </button>
                </div>
              ))
            ) : (
              <span className="text-sm font-bold text-[#2d6a4f] py-10 text-center">No renewals due soon</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Recent Institutes */}
        <div className="col-span-12 bg-white p-8 rounded-[32px] border border-[#c8dfc8] shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black font-['Syne',sans-serif] text-[#1a4a2e]">Recent Institutes</h3>
            <Link href="/admin/institutes" className="text-xs font-black text-[#2d6a4f] hover:underline uppercase tracking-widest">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f0f5ef] text-[10px] font-black uppercase tracking-widest text-[#4a7a5a]">
                  <th className="p-4 rounded-l-xl">Name</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 rounded-r-xl">Expires</th>
                </tr>
              </thead>
              <tbody>
                {institutes.slice(0, 8).map((inst, idx) => (
                  <tr key={idx} className="border-b border-[#f0f5ef] last:border-0 hover:bg-[#f7f9f4] transition-colors">
                    <td className="p-4 font-bold text-sm text-[#1a4a2e]">{inst.name}</td>
                    <td className="p-4 text-xs text-[#2d5a3d]">{inst.city}</td>
                    <td className="p-4"><StatusBadge status={inst.plan} /></td>
                    <td className="p-4"><StatusBadge status={inst.payment_status} /></td>
                    <td className="p-4 text-[10px] font-bold text-[#4a7a5a]">{new Date(inst.expires_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
