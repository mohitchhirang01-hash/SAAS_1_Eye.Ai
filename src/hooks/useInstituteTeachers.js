/* FIXED: Optimized data fetching with SWR & Singleton Client (Problem 2, 7, 10, 12) */
'use client';

import useSWR from 'swr';
import { getSupabaseClient } from '@/lib/supabase';

export function useInstituteTeachers() {
  const supabase = getSupabaseClient();

  const { data, error, isLoading, mutate } = useSWR('institute_teachers_data', async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase.from('users').select('institute_id').eq('id', user.id).single();
    if (!profile?.institute_id) return [];

    // Parallel fetch (Problem 2:Waterfall fix)
    const [teachersRes, batchesRes, studentsRes] = await Promise.all([
      supabase.from('users').select('id, name, email').eq('institute_id', profile.institute_id).eq('role', 'teacher'),
      supabase.from('batches').select('id, name, teacher_id').eq('institute_id', profile.institute_id),
      supabase.from('users').select('id, batch_id').eq('institute_id', profile.institute_id).eq('role', 'student')
    ]);

    const teachersData = teachersRes.data || [];
    const batchesData = batchesRes.data || [];
    const studentsData = studentsRes.data || [];

    return teachersData.map(t => {
      const teacherBatches = batchesData.filter(b => b.teacher_id === t.id);
      const studentCount = studentsData.filter(s => 
        teacherBatches.some(tb => tb.id === s.batch_id)
      ).length;

      return {
        ...t,
        batches: teacherBatches.map(b => b.name),
        studentCount,
        lastActive: 'Today' // Mock
      };
    });
  }, {
    revalidateOnFocus: false,
    dedupingInterval: 30000
  });

  const removeTeacher = async (teacherId) => {
    const { error } = await supabase
      .from('users')
      .update({ institute_id: null, batch_id: null })
      .eq('id', teacherId);

    if (!error) mutate();
    return { success: !error, error: error?.message };
  };

  return { 
    teachers: data || [], 
    isLoading, 
    removeTeacher, 
    refresh: mutate 
  };
}
