/* FIXED: Optimized data fetching with SWR/Promise.all & Dynamic Imports (Problem 2, 3, 7, 9, 10) */
'use client';

import useSWR from 'swr';
import { getSupabaseClient } from '@/lib/supabase';

export function useAdminInstitutes() {
  const supabase = getSupabaseClient();

  const { data, error, isLoading, mutate } = useSWR('admin_institutes_data', async () => {
    const { data: instData, error } = await supabase
      .from('institutes')
      .select('id, name, city, plan, payment_status, amount, subscribed_at, created_at, users(count)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const processed = instData.map(inst => ({
      ...inst,
      userCount: inst.users?.[0]?.count || 0
    }));

    const stats = {
      total: processed.length,
      active: processed.filter(i => i.payment_status === 'active').length,
      trial: processed.filter(i => i.payment_status === 'trial').length,
      overdue: processed.filter(i => i.payment_status === 'overdue').length,
      totalRevenue: processed.reduce((acc, i) => acc + (i.amount || 0), 0),
      monthlyRevenue: 0 
    };

    return { institutes: processed, stats };
  }, {
    revalidateOnFocus: false,
    dedupingInterval: 60000
  });

  const createInstitute = async (data) => {
    try {
      const response = await fetch('/api/admin/create-institute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      
      mutate();
      return { success: true, data: result.data };
    } catch (err) {
      console.error('Error creating institute:', err);
      return { success: false, error: err.message };
    }
  };

  const updateInstitute = async (id, data) => {
    try {
      const { error } = await supabase
        .from('institutes')
        .update(data)
        .eq('id', id);
      if (error) throw error;
      mutate();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const suspendInstitute = async (id) => {
    return updateInstitute(id, { payment_status: 'suspended' });
  };

  const deleteInstitute = async (id) => {
    try {
      const response = await fetch(`/api/admin/delete-institute?id=${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error);
      }
      mutate();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const generateAccounts = async (instituteId, studentNames, teacherNames) => {
    try {
      const response = await fetch('/api/admin/bulk-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instituteId, studentNames, teacherNames })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      return { success: true, accounts: result.accounts };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const exportCredentialsPDF = async (instituteId, instituteName, accounts) => {
    // FIXED: Dynamic import of heavy jsPDF library (Problem 9)
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const instCode = instituteName.substring(0, 3).toUpperCase();
    
    // Page 1: Cover
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(45, 106, 79); 
    doc.text('JEE Sprint', 105, 50, { align: 'center' });
    
    doc.setFontSize(18);
    doc.setTextColor(26, 74, 46); 
    doc.text('Login Credentials', 105, 70, { align: 'center' });
    
    doc.setFontSize(20);
    doc.text(instituteName, 105, 100, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(74, 122, 90); 
    doc.text('Confidential — Do not share publicly', 105, 150, { align: 'center' });
    
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 160, { align: 'center' });

    // Page 2: Credentials
    doc.addPage();
    let y = 30;
    
    const drawHeader = () => {
      doc.setFontSize(14);
      doc.setTextColor(45, 106, 79);
      doc.text(instituteName, 20, 15);
      doc.setFontSize(10);
      doc.text('JEE Sprint Branding', 160, 15);
      doc.line(20, 18, 190, 18);
    };

    drawHeader();
    const teachers = accounts.filter(a => a.role === 'teacher');
    const students = accounts.filter(a => a.role === 'student');

    doc.setFontSize(12);
    doc.setTextColor(26, 74, 46);
    doc.text('TEACHER LOGINS', 20, y);
    y += 5;
    doc.line(20, y, 190, y);
    y += 10;

    teachers.forEach(t => {
      if (y > 270) { doc.addPage(); drawHeader(); y = 30; }
      doc.setFontSize(10);
      doc.setTextColor(45, 106, 79);
      doc.text(t.name, 20, y);
      y += 6;
      doc.setTextColor(26, 74, 46);
      doc.text(`Email: ${t.email}`, 25, y);
      y += 6;
      doc.text(`Password: ${t.password}`, 25, y);
      y += 10;
    });

    if (y > 240) { doc.addPage(); drawHeader(); y = 30; }
    y += 10;
    doc.setFontSize(12);
    doc.text('STUDENT LOGINS', 20, y);
    y += 5;
    doc.line(20, y, 190, y);
    y += 10;

    let xPos = [20, 80, 140];
    let col = 0;
    students.forEach(s => {
      if (y > 270) { doc.addPage(); drawHeader(); y = 30; col = 0; }
      const x = xPos[col];
      
      doc.setFontSize(9);
      doc.setTextColor(45, 106, 79);
      doc.text(s.name, x, y);
      doc.setTextColor(26, 74, 46);
      doc.text(`E: ${s.email}`, x, y + 5);
      doc.text(`P: ${s.password}`, x, y + 10);
      
      col++;
      if (col > 2) {
        col = 0;
        y += 20;
      }
    });

    doc.save(`${instCode}_Credentials.pdf`);
  };

  return {
    institutes: data?.institutes || [],
    isLoading,
    stats: data?.stats || {},
    createInstitute,
    updateInstitute,
    suspendInstitute,
    deleteInstitute,
    generateAccounts,
    exportCredentialsPDF,
    refresh: mutate
  };
}
