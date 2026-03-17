'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { useInstituteBatches } from '@/hooks/useInstituteBatches';
import StatusBadge from '@/components/admin/StatusBadge';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  IconArrowLeft, 
  IconFlame, 
  IconTrophy, 
  IconCalendar,
  IconClock
} from '@/components/icons';
import { clsx } from 'clsx';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const supabase = createClient();

export default function StudentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { batches } = useInstituteBatches();
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudent = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase.from('users').select('*').eq('id', id).single();
      setStudent(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  if (isLoading || !student) return <div className="p-20 text-center font-black text-[#4a7a5a]">Analyzing student data...</div>;

  const batchName = batches.find(b => b.id === student.batch_id)?.name || 'Unassigned';

  const barData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      { label: 'Math', data: [2, 3, 1, 4, 2, 5, 3], backgroundColor: '#d97706' },
      { label: 'Physics', data: [1, 2, 4, 1, 3, 2, 4], backgroundColor: '#0891b2' },
      { label: 'Chemistry', data: [3, 1, 2, 2, 4, 3, 1], backgroundColor: '#db2777' },
    ]
  };

  return (
    <div className="flex flex-col gap-10 pb-20">
      {/* Header */}
      <div className="flex items-start justify-between">
         <div className="flex flex-col gap-4">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-black text-[#4a7a5a] uppercase tracking-widest hover:text-[#2d6a4f] transition-colors">
              <IconArrowLeft className="w-4 h-4" />
              Back to students
            </button>
            <div className="flex items-center gap-6">
              <h1 className="text-4xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">{student.name}</h1>
              <StatusBadge status={student.status || 'active'} />
            </div>
            <div className="flex items-center gap-6 text-sm font-bold text-[#4a7a5a]">
              <span className="px-3 py-1 bg-[#f0f5ef] text-[#2d5a3d] rounded-lg text-[10px] font-black uppercase">{batchName}</span>
              <span className="opacity-30">|</span>
              <span>Joined {new Date(student.created_at).toLocaleDateString()}</span>
            </div>
         </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-6">
         {[
           { label: 'Current Streak', value: '14 Days', icon: IconFlame, color: 'text-[#d97706]', bg: 'bg-[#fef3c7]' },
           { label: 'Avg Accuracy', value: '82%', icon: IconTrophy, color: 'text-[#2d6a4f]', bg: 'bg-[#e8f5e9]' },
           { label: 'Tests Taken', value: '24', icon: IconCalendar, color: 'text-[#0891b2]', bg: 'bg-[#e0f2fe]' },
           { label: 'Study Hours', value: '142h', icon: IconClock, color: 'text-[#db2777]', bg: 'bg-[#fce7f3]' },
         ].map((s, idx) => {
           const Icon = s.icon;
           return (
             <div key={idx} className="bg-white p-8 rounded-[40px] border border-[#c8dfc8] shadow-sm flex flex-col gap-2">
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a] opacity-50">{s.label}</span>
                   <div className={clsx("p-2 rounded-xl", s.bg)}><Icon className={clsx("w-4 h-4", s.color)} /></div>
                </div>
                <span className={clsx("text-2xl font-black font-['Syne',sans-serif]", s.color)}>{s.value}</span>
             </div>
           );
         })}
      </div>

      {/* Weekly Activity & Coverage Rings */}
      <div className="grid grid-cols-12 gap-8">
         <div className="col-span-8 bg-white p-10 rounded-[40px] border border-[#c8dfc8] shadow-sm flex flex-col gap-8">
            <h3 className="text-xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">Weekly Study Hours</h3>
            <div className="h-64">
               <Bar data={barData} options={{ 
                 responsive: true, 
                 maintainAspectRatio: false,
                 scales: { y: { stacked: true }, x: { stacked: true } },
                 plugins: { legend: { display: false } }
               }} />
            </div>
         </div>

         <div className="col-span-4 bg-white p-10 rounded-[40px] border border-[#c8dfc8] shadow-sm flex flex-col gap-8">
            <h3 className="text-xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">Subject Score</h3>
            <div className="flex flex-col gap-6">
               {[
                 { label: 'Mathematics', value: '84/100', color: '#d97706' },
                 { label: 'Physics', value: '72/100', color: '#0891b2' },
                 { label: 'Chemistry', value: '91/100', color: '#db2777' },
               ].map((sub, i) => (
                 <div key={i} className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#1a4a2e]">{sub.label}</span>
                    <span className="text-xs font-black" style={{ color: sub.color }}>{sub.value}</span>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Topic Grid */}
      <div className="bg-white p-10 rounded-[40px] border border-[#c8dfc8] shadow-sm flex flex-col gap-8">
         <h3 className="text-xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">Syllabus Progress Heatmap</h3>
         <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 54 }).map((_, i) => (
              <div 
                key={i} 
                className={clsx(
                  "h-10 rounded-lg flex items-center justify-center text-[9px] font-black border transition-all hover:scale-110",
                  i % 3 === 0 ? "bg-[#e8f5e9] border-[#c8dfc8] text-[#2d6a4f]" : 
                  i % 7 === 0 ? "bg-[#fde8e8] border-[#f8b4b4] text-[#c0392b]" :
                  "bg-[#f0f5ef] border-[#c8dfc8] text-[#4a7a5a] opacity-50"
                )}
              >
                {i + 1}
              </div>
            ))}
         </div>
         <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-widest text-[#4a7a5a]">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#e8f5e9] border border-[#c8dfc8] rounded-sm"></div> COMPLETED</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#fde8e8] border border-[#f8b4b4] rounded-sm"></div> WEAK TOPIC</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#f0f5ef] border border-[#c8dfc8] rounded-sm"></div> NOT STARTED</div>
         </div>
      </div>
    </div>
  );
}
