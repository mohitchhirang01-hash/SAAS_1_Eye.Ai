'use client';

import { useParams, useRouter } from 'next/navigation';
import { useStudentDetail } from '@/hooks/useStudentDetail';
import { useCoachStudents } from '@/hooks/useCoachStudents';
import { useAlerts } from '@/hooks/useAlerts';
import SubjectCard from '@/components/SubjectCard';
import SetTargetInput from '@/components/coach/SetTargetInput';
import StatusBadge from '@/components/coach/StatusBadge';
import AlertComposer from '@/components/coach/AlertComposer';
import { 
  IconArrow, 
  IconCalendar, 
  IconBook, 
  IconTrend, 
  IconWarning,
  IconLoader 
} from '@/components/icons';
import { Bar, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, LinearScale, BarElement, LineElement, 
  PointElement, Title, Tooltip, Legend, Filler 
} from 'chart.js';
import { clsx } from 'clsx';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, 
  PointElement, Title, Tooltip, Legend, Filler
);

export default function StudentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { student, isLoading } = useStudentDetail(id);
  const { setTarget } = useCoachStudents();
  const { sendAlert } = useAlerts();

  if (isLoading || !student) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <IconLoader size={40} color="var(--accent)" animated={true} />
        <p className="text-[var(--muted2)] font-black uppercase tracking-[0.3em] text-[10px]">Deconstructing performance data...</p>
      </div>
    );
  }

  // Bar Chart Data
  const barData = {
    labels: student.weeklyHours.map(d => d.date),
    datasets: [
      { label: 'Math', data: student.weeklyHours.map(d => d.math), backgroundColor: '#fbbf24', borderRadius: 6 },
      { label: 'Phys', data: student.weeklyHours.map(d => d.phys), backgroundColor: '#0ea5e9', borderRadius: 6 },
      { label: 'Chem', data: student.weeklyHours.map(d => d.chem), backgroundColor: '#e11d48', borderRadius: 6 }
    ]
  };

  return (
    <div className="flex flex-col gap-12 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-[var(--card)] p-8 border border-[var(--border)] rounded-[2.5rem] shadow-sm">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => router.back()}
            className="w-14 h-14 bg-[var(--card2)] border border-[var(--border)] rounded-2xl flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/30 hover:bg-[var(--accent-bg)] transition-all shadow-sm active:scale-95 group"
          >
            <IconArrow size={24} color="var(--muted)" className="group-hover:-translate-x-1 transition-transform rotate-180" />
          </button>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-4">
              <h2 className="text-4xl font-countryside text-[var(--text)] leading-none">{student.name}</h2>
              <StatusBadge status={student.status || 'idle'} />
            </div>
            <p className="text-[10px] font-black text-[var(--muted2)] uppercase tracking-[0.3em] leading-none mt-2">
              {student.email} • Joined {new Date(student.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="w-full md:w-80">
          <SetTargetInput 
            currentTarget={student.target_score} 
            studentId={student.id} 
            onSave={setTarget} 
          />
        </div>
      </div>

      {/* Stats Cards & Rings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SubjectCard 
          subject="math" 
          done={student.subjectBreakdown.math.done} 
          total={student.subjectBreakdown.math.total} 
          pct={student.subjectBreakdown.math.pct}
        />
        <SubjectCard 
          subject="phys" 
          done={student.subjectBreakdown.phys.done} 
          total={student.subjectBreakdown.phys.total} 
          pct={student.subjectBreakdown.phys.pct}
        />
        <SubjectCard 
          subject="chem" 
          done={student.subjectBreakdown.chem.done} 
          total={student.subjectBreakdown.chem.total} 
          pct={student.subjectBreakdown.chem.pct}
        />
      </div>

      {/* Analytics Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Weekly Hours Bar Chart */}
        <div className="bg-[var(--card)] p-10 border border-[var(--border)] rounded-[2.5rem] flex flex-col gap-8 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--accent-bg)] to-transparent pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity duration-700" />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center shadow-sm">
              <IconCalendar size={24} color="#2563eb" animated={true} />
            </div>
            <div>
              <h3 className="font-countryside text-2xl text-[var(--text)]">Weekly Burn Rate</h3>
              <p className="text-[10px] font-black text-[var(--muted2)] uppercase tracking-widest mt-0.5">Subject Engagement (Last 7 Days)</p>
            </div>
          </div>
          <div className="h-[320px]">
            <Bar 
              data={barData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                scales: { 
                  y: { grid: { color: 'rgba(0,0,0,0.03)' }, ticks: { color: 'rgba(0,0,0,0.3)', font: { size: 10, weight: 'bold' } } },
                  x: { grid: { display: false }, ticks: { color: 'rgba(0,0,0,0.3)', font: { size: 10, weight: 'bold' } } }
                },
                plugins: { legend: { display: false } }
              }} 
            />
          </div>
        </div>

        {/* Syllabus Coverage Pills */}
        <div className="bg-[var(--card)] p-10 border border-[var(--border)] rounded-[2.5rem] flex flex-col gap-8 shadow-sm group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-center shadow-sm">
              <IconBook size={24} color="#ea580c" animated={false} />
            </div>
            <div>
              <h3 className="font-countryside text-2xl text-[var(--text)]">Syllabus Intelligence</h3>
              <p className="text-[10px] font-black text-[var(--muted2)] uppercase tracking-widest mt-0.5">Topic-by-topic granular status</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-8 max-h-[320px] overflow-y-auto pr-4 custom-scrollbar">
            {['math', 'phys', 'chem'].map(sub => (
              <div key={sub} className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                  <span className="text-[10px] font-black uppercase tracking-[.3em] text-[var(--muted)]">
                    {sub} Curriculum
                  </span>
                  <span className="text-[9px] font-black text-[var(--muted2)] uppercase">Active Nodes</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {student.subjectBreakdown[sub].weakTopics.map(t => (
                    <span key={t.id} className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest border border-red-100 shadow-xs flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                      {t.n}
                    </span>
                  ))}
                  {student.subjectBreakdown[sub].revTopics.map(t => (
                    <span key={t.id} className="px-3 py-1.5 rounded-xl bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest border border-orange-100 shadow-xs flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                      {t.n}
                    </span>
                  ))}
                  {/* Summary of others */}
                  <span className="px-3 py-1.5 rounded-xl bg-[var(--card2)] text-[var(--muted2)] text-[9px] font-black uppercase tracking-widest border border-[var(--border)] shadow-xs">
                    +{student.subjectBreakdown[sub].done - student.subjectBreakdown[sub].weakTopics.length - student.subjectBreakdown[sub].revTopics.length} Proficient Nodes
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alert Composer Section */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] shadow-sm p-2 overflow-hidden bg-gradient-to-br from-red-500/[0.02] to-transparent">
        <AlertComposer 
          studentId={student.id} 
          studentName={student.name} 
          onSent={sendAlert} 
        />
      </div>
    </div>
  );
}
