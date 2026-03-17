'use client';

import { clsx } from 'clsx';

export default function StatusBadge({ status, type = 'status' }) {
  const styles = {
    // Payment Statuses
    active: 'bg-[#e8f5e9] text-[#2d6a4f]',
    trial: 'bg-[#e6f1fb] text-[#185fa5]',
    overdue: 'bg-[#fde8e8] text-[#c0392b]',
    suspended: 'bg-[#f1efe8] text-[#5f5e5a]',
    
    // Plans
    starter: 'bg-[#f1efe8] text-[#5f5e5a]',
    growth: 'bg-[#faeeda] text-[#854f0b]',
    institute: 'bg-[#e8f5e9] text-[#2d6a4f]',

    // Roles
    admin: 'bg-[#ede9fe] text-[#5b21b6]',
    teacher: 'bg-[#e0f2fe] text-[#0369a1]',
    student: 'bg-[#fef3c7] text-[#92400e]'
  };

  const labels = {
    active: 'Active',
    trial: 'On Trial',
    overdue: 'Overdue',
    suspended: 'Suspended',
    starter: 'Starter',
    growth: 'Growth',
    institute: 'Institute',
    admin: 'Super Admin',
    teacher: 'Teacher',
    student: 'Student'
  };

  return (
    <span className={clsx(
      'px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider',
      styles[status] || 'bg-gray-100 text-gray-600'
    )}>
      {labels[status] || status}
    </span>
  );
}
