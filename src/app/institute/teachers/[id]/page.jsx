'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import BatchCard from '@/components/institute/BatchCard';
import StatusBadge from '@/components/admin/StatusBadge';
import { IconArrowLeft, IconUser, IconUsers, IconClock, IconCalendar } from '@/components/icons';

const supabase = createClient();

export default function TeacherDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [teacher, setTeacher] = useState(null);
  const [batches, setBatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: tData } = await supabase.from('users').select('*').eq('id', id).single();
      const { data: bData } = await supabase.from('batches').select(`*`).eq('teacher_id', id);
      
      setTeacher(tData);
      // For detailed batch rendering in the detail page, we need to enhance them
      const enhancedBatches = bData.map(b => ({
         ...b,
         teacher: { name: tData.name },
         studentCount: 12, // Mock for individual student count
         avgCoverage: 45,
         avgScore: 210,
         weakTopics: ['Calculus']
      }));
      setBatches(enhancedBatches);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading || !teacher) return <div className="p-20 text-center font-black text-[#4a7a5a]">Loading teacher profile...</div>;

  return (
    <div className="flex flex-col gap-10 pb-20">
      {/* Header */}
      <div className="flex items-start justify-between">
         <div className="flex flex-col gap-4">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-black text-[#4a7a5a] uppercase tracking-widest hover:text-[#2d6a4f] transition-colors">
              <IconArrowLeft className="w-4 h-4" />
              Back to teachers
            </button>
            <div className="flex items-center gap-6">
              <h1 className="text-4xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">{teacher.name}</h1>
              <span className="px-4 py-2 bg-[#e0f2fe] text-[#0369a1] text-[10px] font-black uppercase tracking-widest rounded-xl">Faculty</span>
            </div>
            <div className="flex items-center gap-6 text-sm font-bold text-[#4a7a5a]">
              <span>{teacher.email}</span>
              <span className="opacity-30">|</span>
              <span>Joined {new Date(teacher.created_at).toLocaleDateString()}</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
         <div className="bg-white p-8 rounded-[40px] border border-[#c8dfc8] shadow-sm flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a] opacity-50">Assigned Batches</span>
            <span className="text-3xl font-black font-['Syne',sans-serif] text-[#2d6a4f]">{batches.length}</span>
         </div>
         <div className="bg-white p-8 rounded-[40px] border border-[#c8dfc8] shadow-sm flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a] opacity-50">Total Students</span>
            <span className="text-3xl font-black font-['Syne',sans-serif] text-[#2d6a4f]">{batches.reduce((acc, b) => acc + b.studentCount, 0)}</span>
         </div>
         <div className="bg-white p-8 rounded-[40px] border border-[#c8dfc8] shadow-sm flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a] opacity-50">Avg Batch Performance</span>
            <span className="text-3xl font-black font-['Syne',sans-serif] text-[#d97706]">212</span>
         </div>
      </div>

      <div className="flex flex-col gap-6">
         <h3 className="text-xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">Their Batches</h3>
         <div className="grid grid-cols-3 gap-8">
            {batches.map(b => (
              <BatchCard key={b.id} batch={b} />
            ))}
         </div>
      </div>
    </div>
  );
}
