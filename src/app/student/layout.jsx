'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProgressProvider, useProgressContext } from '@/app/Providers';
import { useAlerts } from '@/hooks/useAlerts';
import { createClient } from '@/lib/supabase-client';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { clsx } from 'clsx';
import { 
  IconChart, 
  IconBook, 
  IconTarget, 
  IconLogout, 
  IconBell, 
  IconCalendar, 
  IconFlame, 
  IconClock 
} from '@/components/icons';

function NotificationBell() {
  const { alerts, markAsRead } = useAlerts();
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = alerts?.filter(a => !a.is_read).length || 0;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-[var(--card)] hover:bg-[var(--card2)] border border-[var(--border)] rounded-xl transition-all group shadow-sm"
      >
        <IconBell size={20} color="var(--muted)" hasUnread={unreadCount > 0} animated={true} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-4 w-80 bg-[var(--card)] border border-[var(--border2)] p-2 z-50 animate-popIn shadow-[0_8px_40px_rgba(26,74,46,.15)] rounded-2xl">
            <div className="px-4 py-3 border-b border-[var(--border)] mb-2 flex justify-between items-center">
              <span className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest">Master Coach Alerts</span>
              {unreadCount > 0 && <span className="text-[9px] bg-[var(--danger)]/10 text-[var(--danger)] px-2 py-0.5 rounded-full font-black uppercase">{unreadCount} New</span>}
            </div>
            <div className="flex flex-col gap-1 max-h-[350px] overflow-y-auto custom-scrollbar">
              {alerts?.length === 0 ? (
                <div className="py-12 px-8 text-center flex flex-col gap-3">
                  <div className="w-10 h-10 bg-[var(--bg)] rounded-full flex items-center justify-center mx-auto">
                    <IconBell size={20} color="var(--muted2)" animated={false} />
                  </div>
                  <p className="text-[10px] font-bold text-[var(--muted2)] uppercase tracking-[0.2em] leading-loose">No active notifications</p>
                </div>
              ) : (
                alerts.map(a => (
                  <div 
                    key={a.id} 
                    className={clsx(
                      "p-4 rounded-xl flex flex-col gap-1 transition-all cursor-pointer",
                      a.is_read ? "opacity-40" : "bg-[var(--card2)] border border-[var(--border)] hover:border-[var(--border2)]"
                    )}
                    onClick={() => {
                      if (!a.is_read) markAsRead(a.id);
                      setIsOpen(false);
                    }}
                  >
                    <p className="text-xs text-[var(--text2)] font-medium leading-relaxed">{a.message}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--border)]">
                      <span className="text-[9px] font-black uppercase text-[var(--accent)]">{a.sender?.name || 'Coach'}</span>
                      <span className="text-[9px] font-bold text-[var(--muted2)]">{formatDistanceToNow(parseISO(a.created_at))} ago</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StudentHeader() {
  const { getDL, getStreak, getCov, user } = useProgressContext();
  const router = useRouter();
  const supabase = createClient();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    document.cookie = "student_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/login');
    router.refresh();
  };

  const dl = getDL();
  const streak = getStreak();
  const mc = getCov('math');
  const pc = getCov('phys');
  const cc = getCov('chem');
  const avgCov = Math.round((mc.pct + pc.pct + cc.pct) / 3);

  return (
    <div className="flex flex-col gap-6 mb-8 pt-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <h1 className="font-countryside text-4xl text-[var(--text)] mb-1">
            Hello, <span id="user-display-name">{user?.name || 'Student'}</span>
          </h1>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <button 
              onClick={handleLogout}
              className="p-2.5 bg-[var(--card)] border border-[var(--border)] rounded-xl hover:bg-[var(--danger)]/10 hover:border-[var(--danger)]/30 text-[var(--muted2)] hover:text-[var(--danger)] transition-all group shadow-sm flex items-center justify-center"
              title="Logout"
            >
              <IconLogout size={18} color="var(--muted2)" className="group-hover:text-[var(--danger)] transition-colors" />
            </button>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <StatChip value={dl} label="Days left" icon={<IconCalendar size={14} color="var(--warning)" />} />
          <StatChip value={`${streak}d`} label="Streak" icon={<IconFlame size={14} animated={true} />} />
          <StatChip value={`${avgCov}%`} label="Coverage" icon={<IconChart size={14} color="var(--accent)" />} />
        </div>
      </div>
    </div>
  );
}

function StatChip({ value, label, icon }) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl px-5 py-3 min-w-[110px] shadow-sm flex flex-col items-center">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <div className="text-xl font-black text-[var(--text)] leading-none">{value}</div>
      </div>
      <div className="text-[9px] text-[var(--muted)] uppercase font-black tracking-widest">{label}</div>
    </div>
  );
}

function Navigation() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Overview', path: '/student/dashboard', icon: IconChart },
    { name: 'Syllabus', path: '/student/syllabus', icon: IconBook },
    { name: 'Mock Tests', path: '/student/mocks', icon: IconTarget },
  ];

  return (
    <div className="flex gap-4 mb-8 bg-[var(--card2)] p-1.5 rounded-2xl border border-[var(--border)]">
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;
        return (
          <Link
            key={tab.path}
            href={tab.path}
            className={clsx(
              "flex-1 flex items-center justify-center gap-3 py-4 rounded-xl border transition-all duration-200 font-bold text-lg",
              isActive 
                ? "bg-[var(--card)] border-[var(--border2)] text-[var(--text)] shadow-sm" 
                : "border-transparent text-[var(--muted)] hover:text-[var(--text2)] hover:bg-[var(--card)]/50"
            )}
          >
            <tab.icon size={20} color={isActive ? "var(--accent)" : "var(--muted2)"} animated={isActive} />
            <span className="text-sm font-black uppercase tracking-widest">{tab.name}</span>
          </Link>
        );
      })}
    </div>
  );
}

export default function StudentLayout({ children }) {
  return (
    <ProgressProvider>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <StudentHeader />
        <Navigation />
        {/* FIXED: Removed entrance animation for faster feel (Cleanup) */}
        <main>
          {children}
        </main>
      </div>
    </ProgressProvider>
  );
}
