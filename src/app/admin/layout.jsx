'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { clsx } from 'clsx';
import { 
  IconTrophy, 
  IconUsers, 
  IconPlus, 
  IconCreditCard, 
  IconLayoutDashboard,
  IconLogout,
  IconClock
} from '@/components/icons';

const supabase = createClient();

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const checkAdmin = async () => {
      // Fast path: use cached profile to avoid a DB round-trip on every tab switch
      const cached = sessionStorage.getItem('admin_profile');
      if (cached) {
        setAdmin(JSON.parse(cached));
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        router.push(profile?.role === 'teacher' ? '/coach/dashboard' : '/student/dashboard');
        return;
      }
      sessionStorage.setItem('admin_profile', JSON.stringify(profile));
      setAdmin(profile);
    };

    checkAdmin();

    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, [router]);

  const navLinks = [
    { href: '/admin/dashboard', label: 'Overview', icon: IconLayoutDashboard },
    { href: '/admin/institutes', label: 'Institutes', icon: IconUsers },
    { href: '/admin/create', label: '+ New Institute', icon: IconPlus },
    { href: '/admin/payments', label: 'Payments', icon: IconCreditCard },
  ];

  if (!admin) return null;

  const pageTitle = navLinks.find(link => pathname.startsWith(link.href))?.label || 'Admin Panel';

  return (
    <div className="flex min-h-screen bg-[#f7f9f4] font-['DM_Sans',sans-serif] text-[#2d5a3d]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-[#c8dfc8] flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <div className="flex flex-col gap-1 mb-8">
            <h1 className="text-3xl font-black font-['Syne',sans-serif] text-[#2d6a4f] tracking-tight">JEE Sprint</h1>
            <span className="text-[10px] font-black text-[#2d6a4f] bg-[#e8f5e9] px-3 py-1 rounded-full uppercase tracking-widest w-fit">
              Admin Panel
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
                    'flex items-center gap-3 px-5 py-4 rounded-xl transition-all font-bold text-sm',
                    isActive 
                      ? 'bg-[#e8f5e9] text-[#2d6a4f] border-l-4 border-[#2d6a4f]' 
                      : 'hover:bg-[#f0f5ef] text-[#4a7a5a]'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-[#f0f5ef]">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-black text-[#1a4a2e]">{admin.name}</span>
              <span className="text-[10px] text-[#4a7a5a] opacity-70 truncate">{admin.email}</span>
            </div>
            <button 
              onClick={async () => {
                sessionStorage.removeItem('admin_profile');
                await supabase.auth.signOut();
                router.push('/login');
              }}
              className="flex items-center gap-2 text-xs font-bold text-[#c0392b] hover:opacity-80 transition-opacity"
            >
              <IconLogout className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-10 gap-8 overflow-y-auto">
        <header className="flex items-center justify-between">
          <h2 className="text-2xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">{pageTitle}</h2>
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
