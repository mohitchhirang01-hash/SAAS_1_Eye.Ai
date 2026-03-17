'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useInstituteBatches } from '@/hooks/useInstituteBatches';
import { useInstituteData } from '@/hooks/useInstituteData';
import { createClient } from '@/lib/supabase-client';
import StatusBadge from '@/components/admin/StatusBadge';
import BatchPerformanceChart from '@/components/institute/BatchPerformanceChart';
import SubjectCoverageBar from '@/components/institute/SubjectCoverageBar';
import ResultReportExport from '@/components/institute/ResultReportExport';
import { 
  IconArrowLeft, 
  IconEdit, 
  IconUsers, 
  IconClock, 
  IconCheck, 
  IconTrophy,
  IconFlame
} from '@/components/icons';
import { clsx } from 'clsx';

const supabase = createClient();

export default function BatchDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { updateBatch } = useInstituteBatches();
  const [batch, setBatch] = useState(null);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: batchData } = await supabase
        .from('batches')
        .select('*, teacher:users!batches_teacher_id_fkey(name, email)')
        .eq('id', id)
        .single();
      
      const { data: studentData } = await supabase
        .from('users')
        .select('*')
        .eq('batch_id', id)
        .eq('role', 'student');

      setBatch(batchData);
      setStudents(studentData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  if (isLoading || !batch) return <div className="p-20 text-center font-black text-[#4a7a5a]">Loading batch intelligence...</div>;

  const stats = [
    { label: 'Total Students', value: students.length, icon: IconUsers, color: 'text-[#2d6a4f]' },
    { label: 'Active Today', value: Math.floor(students.length * 0.7), icon: IconClock, color: 'text-[#d4850a]' },
    { label: 'Avg Coverage', value: '42%', icon: IconCheck, color: 'text-[#0891b2]' },
    { label: 'Avg Mock Score', value: '185', icon: IconTrophy, color: 'text-[#d97706]' },
    { label: 'Best Score', value: '286', icon: IconTrophy, color: 'text-[#2d6a4f]' },
    { label: 'Streak Leader', value: '28🔥', icon: IconFlame, color: 'text-[#db2777]' },
  ];

  return (
    <div className="flex flex-col gap-10 pb-20">
      {/* SECTION 1: Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-4">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-black text-[#4a7a5a] uppercase tracking-widest hover:text-[#2d6a4f] transition-colors">
            <IconArrowLeft className="w-4 h-4" />
            Back to batches
          </button>
          <div className="flex items-center gap-6">
            <h1 className="text-4xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">{batch.name}</h1>
            <div className="flex items-center gap-3">
               <span className="px-5 py-2 bg-[#f0f5ef] text-[#2d5a3d] text-[10px] font-black uppercase tracking-widest rounded-xl">
                 {batch.subject}
               </span>
               <ResultReportExport batch={batch} students={students} />
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm font-bold text-[#4a7a5a]">
            <span>Teacher: {batch.teacher?.name || 'Unassigned'}</span>
            <span className="opacity-30">|</span>
            <span>Schedule: {batch.schedule || 'Not set'}</span>
          </div>
        </div>
        <button className="flex items-center gap-2 px-6 py-4 bg-white border border-[#c8dfc8] rounded-2xl text-[10px] font-black text-[#1a4a2e] hover:bg-[#f0f5ef] transition-colors shadow-sm">
          <IconEdit className="w-4 h-4" />
          EDIT BATCH
        </button>
      </div>

      {/* SECTION 2: Stats Chips */}
      <div className="grid grid-cols-6 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-[32px] border border-[#c8dfc8] shadow-sm flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#4a7a5a] opacity-50">{stat.label}</span>
                <Icon className={clsx("w-3.5 h-3.5", stat.color)} />
              </div>
              <span className={clsx("text-xl font-black font-['Syne',sans-serif]", stat.color)}>{stat.value}</span>
            </div>
          );
        })}
      </div>

      {/* SECTION 3: Chart & Coverage */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 bg-white p-10 rounded-[40px] border border-[#c8dfc8] shadow-sm flex flex-col gap-8">
          <div className="flex items-center justify-between">
             <h3 className="text-xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">Mock Test History</h3>
             <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
               <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#2d6a4f] rounded-full"></div> Batch Avg</div>
               <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#2d6a4f] opacity-20 rounded-full"></div> Students</div>
             </div>
          </div>
          <div className="h-80 w-full">
            <BatchPerformanceChart students={students} />
          </div>
        </div>

        <div className="col-span-4 bg-white p-10 rounded-[40px] border border-[#c8dfc8] shadow-sm flex flex-col gap-10">
           <h3 className="text-xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">Subject Coverage</h3>
           <div className="flex flex-col gap-8">
              <SubjectCoverageBar label="Mathematics" coverage={45} studentsWithWeak={8} colorClass="bg-[#d97706]" />
              <SubjectCoverageBar label="Physics" coverage={38} studentsWithWeak={12} colorClass="bg-[#0891b2]" />
              <SubjectCoverageBar label="Chemistry" coverage={52} studentsWithWeak={5} colorClass="bg-[#db2777]" />
           </div>
        </div>
      </div>

      {/* SECTION 4: Students List */}
      <div className="bg-white p-10 rounded-[40px] border border-[#c8dfc8] shadow-sm flex flex-col gap-8">
        <h3 className="text-xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">Students in this Batch</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f0f5ef] text-[10px] font-black uppercase tracking-widest text-[#4a7a5a]">
                <th className="p-6">Student Name</th>
                <th className="p-6">Current Streak</th>
                <th className="p-6">Syllabus %</th>
                <th className="p-6">Latest Score</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((std) => (
                <tr key={std.id} className="border-b border-[#f0f5ef] last:border-0 hover:bg-[#f7f9f4] transition-colors">
                  <td className="p-6 font-bold text-sm text-[#1a4a2e]">{std.name}</td>
                  <td className="p-6">
                    <span className="px-3 py-1 bg-[#faeeda] text-[#854f0b] text-[10px] font-black rounded-full">
                      {Math.ceil(Math.random() * 15)}🔥
                    </span>
                  </td>
                  <td className="p-6">
                     <div className="flex items-center gap-3">
                        <div className="w-20 h-1.5 bg-[#f0f5ef] rounded-full overflow-hidden">
                           <div className="h-full bg-[#2d6a4f]" style={{ width: `${std.coverage || 40}%` }}></div>
                        </div>
                        <span className="text-[10px] font-black text-[#1a4a2e]">{std.coverage || 40}%</span>
                     </div>
                  </td>
                  <td className="p-6 font-black text-sm text-[#2d6a4f]">218/300</td>
                  <td className="p-6"><StatusBadge status="active" /></td>
                  <td className="p-6 text-right">
                    <button onClick={() => router.push(`/institute/students/${std.id}`)} className="text-[10px] font-black uppercase text-[#2d6a4f] hover:underline">View Profile</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
