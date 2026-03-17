/* FIXED: Optimized data fetching with SWR & Singleton Client (Problem 7, 10, 12) */
'use client';

import useSWR from 'swr';
import { getSupabaseClient } from '@/lib/supabase';

export function useInstituteAnnouncements() {
  const supabase = getSupabaseClient();

  const { data, error, isLoading, mutate } = useSWR('institute_announcements_data', async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase.from('users').select('institute_id').eq('id', user.id).single();
    if (!profile?.institute_id) return [];

    const { data: announcementsData, error } = await supabase
      .from('announcements')
      .select('id, title, message, target, created_at')
      .eq('institute_id', profile.institute_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return announcementsData || [];
  }, {
    revalidateOnFocus: false,
    dedupingInterval: 30000
  });

  const createAnnouncement = async (title, message, target) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from('users').select('institute_id').eq('id', user.id).single();

    const { data: resData, error } = await supabase
      .from('announcements')
      .insert([{
        title,
        message,
        target,
        institute_id: profile.institute_id
      }])
      .select();

    if (!error) mutate();
    return { success: !error, error: error?.message, data: resData?.[0] };
  };

  const deleteAnnouncement = async (id) => {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);

    if (!error) mutate();
    return { success: !error, error: error?.message };
  };

  return { 
    announcements: data || [], 
    isLoading, 
    createAnnouncement, 
    deleteAnnouncement, 
    refresh: mutate 
  };
}
