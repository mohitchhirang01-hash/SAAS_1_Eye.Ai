/* FIXED: Optimized session handling & Singleton Client (Problem 7, 12) */
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useProgress } from '@/hooks/useProgress';
import { getSupabaseClient } from '@/lib/supabase';

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseClient();

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Fetch profile with selective SELECT (Problem 10)
        const { data: profile } = await supabase
          .from('users')
          .select('id, name, email, role, batch_id, coach_id, institute_id')
          .eq('id', session.user.id)
          .single();
        setUser(profile || session.user);
      }
      setLoading(false);
    }
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase.from('users').select('id, name, email, role, batch_id, coach_id, institute_id').eq('id', session.user.id).single()
          .then(({ data }) => setUser(data || session.user));
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const progress = useProgress(user?.id);
  
/* FIXED: Restored original property names to prevent breakage (Bug fix) */
  return (
    <ProgressContext.Provider value={{ ...progress, user, loading }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgressContext() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgressContext must be used within ProgressProvider');
  return context;
}
