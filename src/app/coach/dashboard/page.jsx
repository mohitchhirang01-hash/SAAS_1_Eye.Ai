/* FIXED: Added DashboardSkeleton for better perceived performance (Problem 8) */
'use client';

import { useState } from 'react';
import { useCoachStudents } from '@/hooks/useCoachStudents';
import { useAlerts } from '@/hooks/useAlerts';
import StudentTable from '@/components/coach/StudentTable';
import StudentCard from '@/components/coach/StudentCard';
import CreateStudentModal from '@/components/coach/CreateStudentModal';
import AlertComposer from '@/components/coach/AlertComposer';
import { DashboardSkeleton } from '@/components/Skeleton';
import { clsx } from 'clsx';
import { 
  IconUser, 
  IconFlame, 
  IconChart, 
  IconTrophy, 
  IconPlus,
  IconSearch
} from '@/components/icons';

export default function CoachDashboardPage() {
  const { students, isLoading, createStudent } = useCoachStudents();
  const { sendAlert } = useAlerts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentForAlert, setSelectedStudentForAlert] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (isLoading) return <DashboardSkeleton />;

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeTodayCount = students.filter(s => s.computed.studiedToday).length;
  const avgLastScore = students.length > 0 ? Math.round(students.reduce((sum, s) => sum + s.computed.lastScore, 0) / students.length) : 0;
  const topScorer = students.length > 0 ? [...students].sort((a,b) => b.computed.coverage - a.computed.coverage)[0].name : '—';

  const stats = [
    { label: 'Total Batch', value: students.length, icon: IconUser, color: 'var(--phys)', bg: 'bg-[var(--phys)]/10', ring: 'border-[var(--phys)]/20' },
    { label: 'Active Today', value: activeTodayCount, icon: IconFlame, color: 'var(--accent)', bg: 'bg-[var(--accent)]/10', ring: 'border-[var(--accent)]/20' },
    { label: 'Mean Score', value: `${avgLastScore}/300`, icon: IconChart, color: 'var(--math)', bg: 'bg-[var(--math)]/10', ring: 'border-[var(--math)]/20' },
    { label: 'Top Coverage', value: topScorer, icon: IconTrophy, color: 'var(--chem)', bg: 'bg-[var(--chem)]/10', ring: 'border-[var(--chem)]/20' }
  ];

  {/* FIXED: Removed entrance animation for faster feel (Cleanup) */}
  return (
    <div className="flex flex-col gap-12">
      {/* Header & Welcome */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-5xl font-countryside text-[var(--text)] tracking-tight">Batch Command</h1>
          <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.4em]">Real-time Performance Intelligence</p>
        </div>
        
        {/* Quick Actions Search */}
        <div className="relative group max-w-sm w-full">
           <IconSearch size={16} color="var(--muted2)" className="absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[var(--accent)] transition-colors" />
           <input 
             type="text"
             placeholder="Search student profile..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="input-premium pl-12 pr-6 py-5 text-sm"
           />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className={clsx(
              "bg-[var(--card)] p-6 flex items-center gap-6 group hover:border-[var(--border2)] transition-all cursor-default relative overflow-hidden border rounded-2xl shadow-sm",
              stat.ring
            )}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-black/[0.01] to-transparent pointer-events-none" />
            <div className={clsx("relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner", stat.bg)}>
              <stat.icon size={28} color={stat.color} animated={true} />
            </div>
            <div className="relative z-10 flex flex-col">
              <span className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em] mb-1">{stat.label}</span>
              <span className="text-2xl font-black text-[var(--text)] tracking-tight group-hover:text-[var(--accent)] transition-colors">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Section */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
              <h2 className="text-lg font-black uppercase tracking-[0.3em] text-[var(--text)]/80">Batch Register</h2>
           </div>
           <span className="text-[10px] font-black text-[var(--muted2)] uppercase tracking-widest">{filteredStudents.length} Students Indexed</span>
        </div>

        <div className="md:hidden flex flex-col gap-4">
           {filteredStudents.length === 0 ? (
             <div className="bg-[var(--card)] p-12 text-center text-[var(--muted2)] text-xs font-black uppercase tracking-widest border border-dashed border-[var(--border)] rounded-2xl">No profiles matched your search</div>
           ) : (
             filteredStudents.map(s => (
               <StudentCard key={s.id} student={s} onAlert={setSelectedStudentForAlert} />
             ))
           )}
        </div>
        
        <div className="hidden md:block">
          <StudentTable 
            students={filteredStudents} 
            onAlertStudent={setSelectedStudentForAlert} 
          />
          {filteredStudents.length === 0 && (
            <div className="bg-[var(--card)] p-20 text-center flex flex-col items-center gap-4 border-dashed border-[var(--border)] rounded-3xl border-2">
               <IconUser size={48} color="var(--border)" animated={false} />
               <p className="text-[var(--muted2)] text-xs font-black uppercase tracking-widest">No student profiles found matching your query</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals & Overlays */}
      <CreateStudentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={createStudent}
      />

      {selectedStudentForAlert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[var(--text)]/10 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setSelectedStudentForAlert(null)} />
          <div className="relative w-full max-w-lg animate-in zoom-in duration-300">
            <div className="bg-[var(--card)] p-1 rounded-3xl shadow-2xl overflow-hidden">
              <AlertComposer 
                studentId={selectedStudentForAlert.id}
                studentName={selectedStudentForAlert.name}
                onClose={() => setSelectedStudentForAlert(null)}
                onSent={sendAlert}
              />
            </div>
          </div>
        </div>
      )}

      {/* Premium Floating Action Button */}
      <div className="fixed bottom-10 right-10 z-50 group">
        <div className="absolute inset-[-4px] bg-[var(--accent)] mix-blend-multiply opacity-5 blur-xl group-hover:opacity-20 transition-opacity rounded-full" />
        <button 
          onClick={() => setIsModalOpen(true)}
          className="relative w-16 h-16 bg-[var(--accent)] hover:bg-[var(--accent-h)] text-white rounded-full flex items-center justify-center shadow-[0_12px_30px_rgba(45,106,79,0.3)] transition-all duration-500 hover:scale-110 active:scale-95"
          title="Admit New Student"
        >
          <IconPlus size={32} color="white" animated={true} />
          
          {/* Tooltip */}
          <div className="absolute right-full mr-6 top-1/2 -translate-y-1/2 bg-[var(--text)] text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl opacity-0 translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all shadow-2xl">
            Admit Student
          </div>
        </button>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
