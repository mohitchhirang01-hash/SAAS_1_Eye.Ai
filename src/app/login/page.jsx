'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import { 
  IconTarget, 
  IconUser, 
  IconLock, 
  IconArrow,
  IconLoader
} from '@/components/icons';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (authError) throw authError;

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile) {
        throw new Error('Unauthorized Access: Profile missing.');
      }

      // Sync role into auth user_metadata so the middleware JWT has the correct role.
      // Without this, middleware defaults to 'student' for all users.
      await supabase.auth.updateUser({ data: { role: profile.role } });

      const redirectMap = {
        admin: '/admin/dashboard',
        coach: '/coach/dashboard',
        institute: '/institute/dashboard',
        student: '/student/dashboard'
      };

      router.push(redirectMap[profile.role] || '/student/dashboard');
      router.refresh();
    } catch (err) {
      setError(err.message || 'Authentication failed');
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg)] relative overflow-hidden">
      {/* Dynamic Background Elements - Noise/Orbs Removed */}
      
        {/* FIXED: Removed entrance animation for faster feel (Cleanup) */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--accent-bg)] border border-[var(--border)] rounded-2xl mb-6 shadow-sm">
            <IconTarget size={32} color="var(--accent)" animated={true} />
          </div>
          <h1 className="font-countryside text-6xl text-[var(--text)] mb-3 tracking-tight">JEE Sprint</h1>
          <div className="flex items-center justify-center gap-2">
             <div className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--border)]" />
             <p className="text-[var(--muted)] text-[10px] font-black uppercase tracking-[0.4em]">Unified Elite Portal</p>
             <div className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--border)]" />
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[var(--card)] p-10 border-[1.5px] border-[var(--border)] rounded-2xl shadow-[0_4px_24px_rgba(26,74,46,.10)] relative group overflow-hidden">
          
          {error && (
            <div className="relative z-10 bg-[var(--danger)]/10 border border-[var(--danger)]/20 text-[var(--danger)] text-[11px] font-bold p-4 rounded-2xl mb-8 text-center animate-shake leading-relaxed shadow-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="relative z-10 flex flex-col gap-6">
            <div className="space-y-2.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.3em]">Credentials</label>
                <div className="h-1 w-1 rounded-full bg-[var(--danger)]" />
              </div>
              <div className="relative group/input">
                <IconUser size={18} color="var(--muted)" className="absolute left-5 top-1/2 -translate-y-1/2" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-premium pl-14 pr-6 py-6"
                  placeholder="name@institute.com"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.3em]">Access Key</label>
                <div className="h-1 w-1 rounded-full bg-[var(--danger)]" />
              </div>
              <div className="relative group/input">
                <IconLock size={18} color="var(--muted)" className="absolute left-5 top-1/2 -translate-y-1/2" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-premium pl-14 pr-6 py-6"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="mt-6 w-full relative group/btn"
            >
              <div className="relative bg-[var(--accent)] hover:bg-[var(--accent-h)] text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-[0_4px_16px_rgba(45,106,79,.25)] hover:shadow-[0_6px_20px_rgba(45,106,79,.35)]">
                {loading ? (
                  <>
                    <IconLoader size={20} color="white" animated={true} />
                    <span>Synchronizing...</span>
                  </>
                ) : (
                  <>
                    <IconArrow size={20} color="#fff" />
                    <span>Access Dashboard</span>
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-[var(--border)] text-center relative z-10">
            <p className="text-[var(--muted2)] text-[9px] font-black uppercase tracking-[0.3em] leading-loose">
              <span className="text-[var(--muted2)]">Secure Node:</span> 128-bit Encryption<br/>
              Authorized Institutional Access Only
            </p>
          </div>
        </div>

        {/* FIXED: Removed animations for faster login experience (Cleanup) */}
        {/* Footer Credit */}
        <div className="mt-8 text-center">
           <p className="text-[10px] font-black text-[var(--muted2)] uppercase tracking-[0.6em]">Powered by Advanced Agentic Intelligence</p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: var(--text);
          -webkit-box-shadow: 0 0 0px 1000px var(--bg) inset;
          transition: background-color 500s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
}
