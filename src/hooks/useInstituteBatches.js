/* FIXED: Optimized data fetching with SWR & Singleton Client (Problem 7, 10, 12) */
'use client';

import useSWR from 'swr';
import { getSupabaseClient } from '@/lib/supabase';

export function useInstituteBatches() {
  const supabase = getSupabaseClient();

  const { data, error, isLoading, mutate } = useSWR('institute_batches_data', async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('users')
      .select('institute_id')
      .eq('id', user.id)
      .single();

    if (!profile?.institute_id) return [];

    const { data: batchesData, error } = await supabase
      .from('batches')
      .select('id, name, subject, schedule, teacher_id, teacher:users!batches_teacher_id_fkey(name, email)')
      .eq('institute_id', profile.institute_id);

    if (error) throw error;

    return batchesData.map(b => ({
      ...b,
      studentCount: 12, // Mock 
      avgCoverage: 45, // Mock
      avgScore: 190, // Mock
      activeToday: 8, // Mock
      weakTopics: ['Calculus', 'Organic Chemistry'] // Mock
    }));
  }, {
    revalidateOnFocus: false,
    dedupingInterval: 30000
  });

  const createBatch = async (name, subject, teacherId, schedule) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from('users').select('institute_id').eq('id', user.id).single();
    
    const { data: resData, error } = await supabase
      .from('batches')
      .insert([{
        name,
        subject,
        teacher_id: teacherId || null,
        schedule,
        institute_id: profile.institute_id
      }])
      .select();

    if (!error) mutate();
    return { success: !error, error: error?.message, data: resData?.[0] };
  };

  const updateBatch = async (id, payload) => {
    const { error } = await supabase
      .from('batches')
      .update(payload)
      .eq('id', id);

    if (!error) mutate();
    return { success: !error, error: error?.message };
  };

  const deleteBatch = async (id) => {
    const { error } = await supabase
      .from('batches')
      .delete()
      .eq('id', id);

    if (!error) mutate();
    return { success: !error, error: error?.message };
  };

  const assignTeacher = async (batchId, teacherId) => {
    return updateBatch(batchId, { teacher_id: teacherId });
  };

  const assignStudent = async (studentId, batchId) => {
    const { error } = await supabase
      .from('users')
      .update({ batch_id: batchId })
      .eq('id', studentId);

    if (!error) mutate();
    return { success: !error, error: error?.message };
  };

  return { 
    batches: data || [], 
    isLoading, 
    createBatch, 
    updateBatch, 
    deleteBatch, 
    assignTeacher, 
    assignStudent,
    refresh: mutate 
  };
}
