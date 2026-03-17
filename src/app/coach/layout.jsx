'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  IconUser, 
  IconChart, 
  IconBell, 
  IconLogout, 
  IconDashboard,
  IconLoader 
} from '@/components/icons';
import { clsx } from 'clsx';
import { ProgressProvider } from '@/app/Providers';

export default function CoachLayout({ children }) {
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    async function checkCoach() {
      // Fast path: use cached profile to avoid a DB round-trip on every tab switch
      const cached = sessionStorage.getItem('coach_profile');
      if (cached) {
        setCoach(JSON.parse(cached));
        setLoading(false);
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

      if (!profile || profile.role !== 'coach') {
        router.push('/student/dashboard');
        return;
      }

      sessionStorage.setItem('coach_profile', JSON.stringify(profile));
      setCoach(profile);
      setLoading(false);
    }
    checkCoach();
  }, [supabase, router]);

  const handleLogout = async () => {
    sessionStorage.removeItem('coach_profile');
    await supabase.auth.signOut();
    document.cookie = "student_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--bg)]">
        <IconLoader size={40} color="var(--accent)" animated={true} />
        <p className="text-[var(--muted)] text-xl font-countryside animate-pulse">Initializing Command Center</p>
      </div>
    );
  }

  const navItems = [
    { label: 'Students', icon: IconUser, href: '/coach/dashboard' },
    { label: 'Analytics', icon: IconChart, href: '/coach/batch' },
    { label: 'Alerts', icon: IconBell, href: '/coach/alerts', badge: unreadCount }
  ];

  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--text)] selection:bg-[var(--accent)] selection:text-white">
      {/* Sidebar */}
      <aside className="w-72 border-r border-[var(--border)] flex flex-col fixed inset-y-0 bg-[var(--card)] z-50 shadow-xl">
        <div className="p-8">
          <h1 className="font-countryside text-4xl text-[var(--accent)] mb-1">JEE Sprint</h1>
          <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.3em]">Coach Excellence</p>
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center justify-between px-4 py-4 rounded-2xl transition-all group relative overflow-hidden",
                  isActive ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20" : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card2)]"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon 
                    size={20} 
                    color={isActive ? "white" : "var(--muted)"} 
                    animated={isActive}
                    {...(item.label === 'Alerts' ? { hasUnread: item.badge > 0 } : {})}
                  />
                  <span className="font-black text-xs uppercase tracking-widest">{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="bg-[var(--danger)] text-white text-[10px] font-black px-1.5 py-0.5 rounded-md">
                    {item.badge}
                  </span>
                )}
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full ml-1" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-[var(--border)]">
          <div className="bg-[var(--card2)] p-4 border border-[var(--border)] rounded-2xl flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[var(--accent)]/10 rounded-xl flex items-center justify-center font-black text-[var(--accent)]">
              {coach.name?.[0]}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-black text-[var(--text)] truncate">{coach.name}</span>
              <span className="text-[10px] text-[var(--muted)] font-black uppercase tracking-widest">Master Coach</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-[var(--border)] text-[var(--muted)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/5 hover:border-[var(--danger)]/20 transition-all font-black text-[10px] uppercase tracking-widest"
          >
            <IconLogout size={18} color="var(--muted2)" className="group-hover:text-[var(--danger)] transition-colors" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72">
        <header className="h-20 border-b border-[var(--border)] flex items-center justify-between px-10 sticky top-0 bg-[var(--bg)]/80 backdrop-blur-xl z-40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center border border-[var(--accent)]/20">
              <IconDashboard size={18} color="var(--accent)" animated={false} />
            </div>
            <h2 className="text-xl font-countryside text-[var(--text)]">Dashboard Overview</h2>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black text-[var(--muted2)] uppercase tracking-[.2em]">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </header>

        <div className="p-10">
          <ProgressProvider>
            {children}
          </ProgressProvider>
        </div>
      </main>
</div>
  );
}
