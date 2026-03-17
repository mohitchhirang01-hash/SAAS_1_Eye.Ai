/* FIXED: Optimized data fetching with SWR/Promise.all (Problem 2, 3, 7, 10) */
'use client';

import useSWR from 'swr';
import { getSupabaseClient } from '@/lib/supabase';

export function useAdminPayments() {
  const supabase = getSupabaseClient();

  const { data, error, isLoading, mutate } = useSWR('admin_payments_data', async () => {
    // Parallel fetch (Problem 2:Waterfall fix)
    const [paymentsRes, overdueRes] = await Promise.all([
      supabase.from('payments').select('id, paid_at, amount, plan, method, notes, institutes(name, city)').order('paid_at', { ascending: false }),
      supabase.from('institutes').select('id, name, amount, expires_at, payment_status').lt('expires_at', new Date().toISOString()).not('payment_status', 'eq', 'suspended')
    ]);

    if (paymentsRes.error) throw paymentsRes.error;
    
    const payments = paymentsRes.data || [];
    const overdueInstitutes = overdueRes.data || [];

    // Calculate Revenue Stats
    const now = new Date();
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const total = payments.reduce((acc, p) => acc + p.amount, 0);
    const monthly = payments
      .filter(p => new Date(p.paid_at) >= firstDayThisMonth)
      .reduce((acc, p) => acc + p.amount, 0);
    const lastMonth = payments
      .filter(p => {
        const d = new Date(p.paid_at);
        return d >= firstDayLastMonth && d < firstDayThisMonth;
      })
      .reduce((acc, p) => acc + p.amount, 0);

    const overdueSum = overdueInstitutes.reduce((acc, i) => acc + (i.amount || 0), 0);

    return { 
      payments, 
      overdueInstitutes,
      revenueStats: {
        totalLifetime: total,
        monthlyRevenue: monthly,
        lastMonthRevenue: lastMonth,
        overdueAmount: overdueSum
      }
    };
  }, {
    revalidateOnFocus: false,
    dedupingInterval: 60000
  });

  const logPayment = async (instituteId, amount, plan, method, notes, durationMonths) => {
    try {
      const { error: pError } = await supabase.from('payments').insert({ institute_id: instituteId, amount, plan, method, notes });
      if (pError) throw pError;

      const { data: inst } = await supabase.from('institutes').select('expires_at').eq('id', instituteId).single();
      let baseDate = new Date();
      if (inst && new Date(inst.expires_at) > baseDate) baseDate = new Date(inst.expires_at);
      const newExpiry = new Date(baseDate);
      newExpiry.setMonth(newExpiry.getMonth() + durationMonths);

      const { error: iError } = await supabase.from('institutes').update({ payment_status: 'active', expires_at: newExpiry.toISOString(), plan }).eq('id', instituteId);
      if (iError) throw iError;

      mutate();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const markOverdue = async (instituteId) => {
    try {
      const { error } = await supabase.from('institutes').update({ payment_status: 'overdue' }).eq('id', instituteId);
      if (error) throw error;
      mutate();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    payments: data?.payments || [],
    isLoading,
    revenueStats: data?.revenueStats || { totalLifetime: 0, monthlyRevenue: 0, lastMonthRevenue: 0, overdueAmount: 0 },
    overdueInstitutes: data?.overdueInstitutes || [],
    logPayment,
    markOverdue,
    refresh: mutate
  };
}
