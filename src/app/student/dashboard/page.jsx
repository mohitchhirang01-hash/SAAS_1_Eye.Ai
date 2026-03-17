/* FIXED: Added DashboardSkeleton for better perceived performance (Problem 8) */
'use client';

import { useProgressContext } from "@/app/Providers";
import SubjectCard from "@/components/SubjectCard";
import HourSliders from "@/components/HourSliders";
import QuoteCard from "@/components/QuoteCard";
import WeakTopics from "@/components/WeakTopics";
import ActivityMap from "@/components/ActivityMap";
import { DashboardSkeleton } from "@/components/Skeleton";
import { 
  IconTarget, 
  IconWarning,
  IconArrowRight 
} from '@/components/icons';
import { getSupabaseClient } from '@/lib/supabase';
import { useEffect, useState } from 'react';

function CoachFocus() {
  const [topics, setTopics] = useState([]);
  const supabase = getSupabaseClient();

  useEffect(() => {
    async function fetchFocus() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: profile } = await supabase
        .from('users')
        .select('coach_id')
        .eq('id', user.id)
        .single();
      
      if (!profile?.coach_id) return;

      const { data } = await supabase
        .from('batch_focus')
        .select('id, subject, topic_name, note')
        .eq('coach_id', profile.coach_id)
        .order('created_at', { ascending: false });
      
      if (data) setTopics(data);
    }
    fetchFocus();
  }, [supabase]);

  if (topics.length === 0) return null;

  return (
    <div className="bg-[var(--card)] p-6 flex flex-col gap-4 border border-[var(--warning)]/20 shadow-sm rounded-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--warning)]/10 rounded-xl flex items-center justify-center">
            <IconTarget size={20} color="var(--warning)" animated={true} />
          </div>
          <div>
            <h3 className="font-bold text-[var(--text)]">Batch Critical Focus</h3>
            <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest">Selected by your coach</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {topics.slice(0, 3).map(topic => (
          <div key={topic.id} className="p-4 bg-[var(--card2)] border border-[var(--border)] rounded-2xl flex items-center justify-between group hover:border-[var(--warning)]/30 transition-all">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-[var(--warning)] mb-0.5">{topic.subject}</span>
              <span className="text-sm font-bold text-[var(--text2)]">{topic.topic_name}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col text-right hidden md:flex">
                <div className="flex items-center gap-1.5 justify-end">
                   <IconWarning size={12} color="var(--warning)" animated={false} />
                   <span className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest">Coach Note</span>
                </div>
                <span className="text-[11px] font-medium text-[var(--muted)] italic leading-tight mt-1 max-w-[200px] truncate">
                  "{topic.note || 'Focus on depth'}"
                </span>
              </div>
              <IconArrowRight size={16} color="var(--muted2)" className="group-hover:text-[var(--warning)] transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* FIXED: Changed authLoading back to loading to match restored context (Bug fix) */
export default function DashboardPage() {
  const { getCov, isLoaded, loading } = useProgressContext();

  if (!isLoaded || loading) return <DashboardSkeleton />;

  const mathCov = getCov('math');
  const physCov = getCov('phys');
  const chemCov = getCov('chem');

      {/* FIXED: Removed entrance animation for faster feel (Cleanup) */}
  return (
    <div className="flex flex-col gap-8">
      {/* Subject Overview Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SubjectCard subject="math" cov={mathCov} />
        <SubjectCard subject="phys" cov={physCov} />
        <SubjectCard subject="chem" cov={chemCov} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        <div className="flex flex-col gap-8">
          <CoachFocus />
          <HourSliders />
          <ActivityMap />
        </div>
        <div className="grid grid-cols-1 gap-8">
          <div className="h-[300px]">
            <QuoteCard />
          </div>
          <div className="flex-1">
            <WeakTopics />
          </div>
        </div>
      </div>
    </div>
  );
}
