/* FIXED: Centralized user session management (Problem 12) */
'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = getSupabaseClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setRole(session.user.user_metadata?.role);
      }
      setIsLoading(false);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null);
        setRole(session?.user?.user_metadata?.role ?? null);
      }
    );
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return (
    <UserContext.Provider value={{ user, role, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
