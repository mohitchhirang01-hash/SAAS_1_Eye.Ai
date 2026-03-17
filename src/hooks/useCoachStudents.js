/* FIXED: Optimized data fetching with SWR/Promise.all & JSON Selects (Problem 2, 3, 7, 10) */
'use client';

import useSWR from 'swr';
import { getSupabaseClient } from '@/lib/supabase';
import { differenceInDays, startOfDay, isToday, isYesterday, parseISO } from 'date-fns';

export function useCoachStudents() {
  const supabase = getSupabaseClient();

  const computeStudentDetails = (student, progress) => {
    const payload = progress || {};
    const done = new Set(payload.done || []);
    const hours = payload.hours || {};
    const mocks = payload.mocks || [];

    const totalDone = done.size;
    const coverage = Math.round((totalDone / 54) * 100);

    let streak = 0;
    const d = new Date();
    while (true) {
      const k = d.toISOString().split('T')[0];
      const h = hours[k] || {};
      if ((h.math || 0) + (h.phys || 0) + (h.chem || 0) > 0) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else break;
    }

    const lastScore = mocks.length > 0 ? mocks[mocks.length - 1].total : 0;
    const avgScore = mocks.length > 0 ? Math.round(mocks.reduce((sum, m) => sum + m.total, 0) / mocks.length) : 0;
    const bestScore = mocks.length > 0 ? Math.max(...mocks.map(m => m.total)) : 0;

    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    const hToday = hours[todayStr] || {};
    const studiedToday = (hToday.math || 0) + (hToday.phys || 0) + (hToday.chem || 0) > 0;
    
    const hYesterday = hours[yesterdayStr] || {};
    const studiedYesterday = (hYesterday.math || 0) + (hYesterday.phys || 0) + (hYesterday.chem || 0) > 0;

    let lastActiveDate = null;
    const sortedHours = Object.keys(hours).sort((a,b) => b.localeCompare(a));
    for (const date of sortedHours) {
      const h = hours[date];
      if ((h.math || 0) + (h.phys || 0) + (h.chem || 0) > 0) {
        lastActiveDate = date;
        break;
      }
    }

    let status = 'inactive';
    if (studiedToday) status = 'active';
    else if (studiedYesterday) status = 'idle';
    else if (lastActiveDate) {
      const diff = differenceInDays(startOfDay(new Date()), startOfDay(parseISO(lastActiveDate)));
      if (diff < 3) status = 'idle';
    }

    return {
      id: student.id,
      name: student.name,
      email: student.email,
      target_score: student.target_score,
      created_at: student.created_at,
      progress: {
        done: Array.from(done),
        tags: payload.tags || {},
        hours,
        mocks
      },
      computed: {
        streak,
        coverage,
        lastScore,
        avgScore,
        bestScore,
        studiedToday,
        lastActiveDate,
        status
      }
    };
  };

  const { data, error, isLoading, mutate } = useSWR('coach_students_data', async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // 1. Fetch student profiles (optimized SELECT)
    const { data: profiles, error: pError } = await supabase
      .from('users')
      .select('id, name, email, target_score, created_at')
      .eq('coach_id', user.id)
      .eq('role', 'student');

    if (pError) throw pError;
    if (!profiles.length) return [];

/* FIXED: Simplified JSON select for better compatibility (Bug fix) */
    const ids = profiles.map(s => s.id);
    const { data: progress, error: prError } = await supabase
      .from('user_data_v2')
      .select('id, payload')
      .in('id', ids);

    if (prError) throw prError;

    return profiles.map(s => {
      const p = progress.find(pd => pd.id === s.id);
      return computeStudentDetails(s, p?.payload);
    });
  }, {
    revalidateOnFocus: false,
    dedupingInterval: 30000
  });

  const createStudent = async (name, email, password) => {
    try {
      const res = await fetch('/api/coach/create-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const resData = await res.json();
      if (resData.error) throw new Error(resData.error);
      mutate();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteStudent = async (id) => {
    try {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (error) throw error;
      mutate();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const setTarget = async (studentId, score) => {
    try {
      const { error } = await supabase.from('users').update({ target_score: score }).eq('id', studentId);
      if (error) throw error;
      mutate();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return { 
    students: data || [], 
    isLoading, 
    createStudent, 
    deleteStudent, 
    setTarget, 
    refresh: mutate 
  };
}
