'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { useInstituteData } from '@/hooks/useInstituteData';
import { clsx } from 'clsx';
import { 
  IconLayoutDashboard, 
  IconUsers, 
  IconPlus, 
  IconCreditCard, 
  IconBell,
  IconLogout,
  IconClock,
  IconBook,
  IconArrowRight
} from '@/components/icons';

const supabase = createClient();

export default function InstituteLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { institute, stats, isLoading } = useInstituteData();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const navLinks = [
    { href: '/institute/dashboard', label: 'Overview', icon: IconLayoutDashboard },
    { href: '/institute/batches', label: 'Batches', icon: IconBook },
    { href: '/institute/teachers', label: 'Teachers', icon: IconUsers },
    { href: '/institute/students', label: 'All Students', icon: IconUsers },
    { href: '/institute/announcements', label: 'Announcements', icon: IconBell },
    { href: '/institute/settings', label: 'Settings', icon: IconPlus }, // Using Plus as placeholder for settings icon if missing
  ];

  if (isLoading) return (
    <div className="min-h-screen bg-[#f7f9f4] flex items-center justify-center font-['Syne',sans-serif]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#2d6a4f] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-[#2d6a4f] font-black uppercase tracking-widest text-xs">Authenticating Institute...</span>
      </div>
    </div>
  );

  const pageTitle = navLinks.find(link => pathname.startsWith(link.href))?.label || 'Institute Dashboard';

  const daysUntilExpiry = institute?.expires_at 
    ? Math.ceil((new Date(institute.expires_at) - new Date()) / (1000 * 60 * 60 * 24))
    : 0;
  const isExpiringSoon = daysUntilExpiry <= 7;

  return (
    <div className="flex min-h-screen bg-[#f7f9f4] font-['DM_Sans',sans-serif] text-[#2d5a3d]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-[#c8dfc8] flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <div className="flex flex-col gap-1 mb-10">
            <h1 className="text-3xl font-black font-['Syne',sans-serif] text-[#1a4a2e] tracking-tight">JEE Sprint</h1>
            <span className="text-[10px] font-black text-[#4a7a5a] opacity-70 truncate uppercase tracking-widest leading-none">
              {institute?.name}
            </span>
          </div>

          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'flex items-center gap-3 px-5 py-4 rounded-xl transition-all font-bold text-sm border-l-[3px]',
                    isActive 
                      ? 'bg-[#e8f5e9] text-[#2d6a4f] border-[#2d6a4f]' 
                      : 'hover:bg-[#f0f5ef] text-[#4a7a5a] border-transparent'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-[#f0f5ef] flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col">
              <span className="text-xs font-black text-[#1a4a2e]">{institute?.owner_name}</span>
              <span className="text-[10px] text-[#4a7a5a] opacity-70">Institute Head</span>
            </div>
            <div className="flex flex-col gap-2">
               <span className={clsx(
                 "text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter w-fit",
                 institute?.plan === 'institute' ? "bg-[#e8f5e9] text-[#2d6a4f]" : "bg-[#faeeda] text-[#854f0b]"
               )}>
                 {institute?.plan} Plan
               </span>
               <span className={clsx(
                 "text-[9px] font-bold ml-1",
                 isExpiringSoon ? "text-[#c0392b]" : "text-[#4a7a5a] opacity-60"
               )}>
                 Renews in {daysUntilExpiry} days
               </span>
            </div>
          </div>

          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/login');
            }}
            className="flex items-center gap-2 text-xs font-bold text-[#c0392b] hover:opacity-80 transition-opacity"
          >
            <IconLogout className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-10 gap-8 overflow-y-auto">
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">{pageTitle}</h2>
            <span className="text-xs font-bold text-[#4a7a5a]">{institute?.name}</span>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 bg-white border border-[#c8dfc8] rounded-2xl shadow-sm text-sm font-bold">
            <IconClock className="w-4 h-4 text-[#2d6a4f]" />
            <span>{currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
            <span className="opacity-30">|</span>
            <span>{currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
