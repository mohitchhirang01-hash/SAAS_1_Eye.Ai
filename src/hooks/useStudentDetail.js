/* FIXED: Optimized data fetching with SWR/Promise.all (Problem 2, 3, 7, 10) */
'use client';

import useSWR from 'swr';
import { getSupabaseClient } from '@/lib/supabase';
import { SYL, TOT } from '@/lib/syllabus';
import { subDays, format } from 'date-fns';

export function useStudentDetail(studentId) {
  const supabase = getSupabaseClient();

  const { data, error, isLoading, mutate } = useSWR(studentId ? `student_detail_${studentId}` : null, async () => {
    // Parallel fetch (Problem 2:Waterfall fix)
    const [profileRes, progressRes] = await Promise.all([
      supabase.from('users').select('id, name, email, target_score, created_at, role, batch_id').eq('id', studentId).single(),
      supabase.from('user_data_v2').select('payload').eq('id', studentId).single()
    ]);

    if (profileRes.error) throw profileRes.error;
    
    const profile = profileRes.data;
    const payload = progressRes.data?.payload || {};

    const doneSet = new Set(payload.done || []);
    const tags = payload.tags || {};
    const hours = payload.hours || {};
    const mocks = payload.mocks || [];

    const getSubjectStats = (subject) => {
      const topics = SYL[subject];
      const done = topics.filter(t => doneSet.has(t.id));
      const weak = topics.filter(t => tags[t.id] === 'weak');
      const rev = topics.filter(t => tags[t.id] === 'revision');
      return {
        done: done.length,
        total: TOT[subject],
        pct: Math.round((done.length / TOT[subject]) * 100),
        weakTopics: weak,
        revTopics: rev
      };
    };

    const subjectBreakdown = {
      math: getSubjectStats('math'),
      phys: getSubjectStats('phys'),
      chem: getSubjectStats('chem')
    };

    const weeklyHours = Array.from({ length: 7 }, (_, i) => {
      const date = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
      const h = hours[date] || { math: 0, phys: 0, chem: 0 };
      return {
        date: format(subDays(new Date(), 6 - i), 'MMM dd'),
        ...h
      };
    });

    return {
      ...profile,
      progress: {
        done: Array.from(doneSet),
        tags,
        hours,
        mocks
      },
      subjectBreakdown,
      weeklyHours,
      scoreHistory: mocks
    };
  }, {
    revalidateOnFocus: false,
    dedupingInterval: 30000
  });

  return { 
    student: data, 
    isLoading, 
    refresh: mutate 
  };
}
