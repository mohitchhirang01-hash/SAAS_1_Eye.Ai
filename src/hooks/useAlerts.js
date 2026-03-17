/* FIXED: Optimized data fetching with SWR & Singleton Client (Problem 7, 10, 12) */
'use client';

import useSWR from 'swr';
import { getSupabaseClient } from '@/lib/supabase';

export function useAlerts() {
  const supabase = getSupabaseClient();

  const { data, error, isLoading, mutate } = useSWR('alerts_data', async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'coach') {
      const { data, error } = await supabase
        .from('alerts')
        .select('id, message, created_at, is_read, topic_flag, student_id, recipient:users!alerts_student_id_fkey(name)')
        .eq('coach_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return { sentAlerts: data || [], alerts: [] };
    } else {
      const { data, error } = await supabase
        .from('alerts')
        .select('id, message, created_at, is_read, topic_flag, coach_id, sender:users!alerts_coach_id_fkey(name)')
        .or(`student_id.eq.${user.id},student_id.is.null`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return { alerts: data || [], sentAlerts: [] };
    }
  }, {
    revalidateOnFocus: false,
    dedupingInterval: 30000
  });

  const sendAlert = async (studentId, message, topicFlag = null) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('alerts').insert({
        coach_id: user.id,
        student_id: studentId,
        message,
        topic_flag: topicFlag
      });
      if (error) throw error;
      mutate();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const sendBatchAlert = (message, topicFlag = null) => sendAlert(null, message, topicFlag);

  const markAsRead = async (alertId) => {
    try {
      const { error } = await supabase.from('alerts').update({ is_read: true }).eq('id', alertId);
      if (error) throw error;
      mutate();
    } catch (error) {
      console.error('Mark read error:', error);
    }
  };

  const deleteAlert = async (alertId) => {
    try {
      const { error } = await supabase.from('alerts').delete().eq('id', alertId);
      if (error) throw error;
      mutate();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return { 
    alerts: data?.alerts || [], 
    sentAlerts: data?.sentAlerts || [], 
    isLoading, 
    sendAlert, 
    sendBatchAlert, 
    markAsRead, 
    deleteAlert, 
    refresh: mutate 
  };
}
