'use client';

import { useState, useEffect } from 'react';
import { useCoachStudents } from '@/hooks/useCoachStudents';
import { createClient } from '@/lib/supabase-client';
import BatchHeatmap from '@/components/coach/BatchHeatmap';
import FocusTopicsList from '@/components/coach/FocusTopicsList';
import { 
  IconTrend, 
  IconWarning, 
  IconChart, 
  IconArrow,
  IconLoader,
  IconX 
} from '@/components/icons';
import { clsx } from 'clsx';

export default function BatchAnalyticsPage() {
  const { students, isLoading: studentsLoading } = useCoachStudents();
  const [focusTopics, setFocusTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flagModal, setFlagModal] = useState(null); // { topicId, topicName, subject }
  const [flagNote, setFlagNote] = useState('');
  const supabase = createClient();

  const fetchFocusTopics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('batch_focus')
        .select('*')
        .eq('coach_id', user.id);
      if (!error) setFocusTopics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFocusTopics();
  }, [supabase]);

  const handleFlagTopic = async () => {
    if (!flagModal) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('batch_focus')
        .insert({
          coach_id: user.id,
          topic_id: flagModal.id,
          topic_name: flagModal.n,
          subject: flagModal.s || 'Math',
          note: flagNote
        });
      if (error) throw error;
      setFlagModal(null);
      setFlagNote('');
      fetchFocusTopics();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemoveFocus = async (id) => {
    try {
      await supabase.from('batch_focus').delete().eq('id', id);
      fetchFocusTopics();
    } catch (err) {
      console.error(err);
    }
  };

  if (studentsLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <IconLoader size={40} color="var(--accent)" animated={true} />
        <p className="text-[var(--muted2)] font-black uppercase tracking-[0.3em] text-[10px]">Processing Batch Analytics...</p>
      </div>
    );
  }

  // Analytics
  const totalWeakTopics = focusTopics.length;
  // Calculate most struggling subject based on all student's weak tags
  const weakCounts = { math: 0, phys: 0, chem: 0 };
  students.forEach(s => {
    Object.keys(s.progress.tags).forEach(tid => {
      if (s.progress.tags[tid] === 'weak') {
         if (tid.startsWith('m')) weakCounts.math++;
         else if (tid.startsWith('p')) weakCounts.phys++;
         else if (tid.startsWith('c')) weakCounts.chem++;
      }
    });
  });
  const mostStruggling = Object.keys(weakCounts).reduce((a, b) => weakCounts[a] > weakCounts[b] ? a : b);

  return (
    <div className="flex flex-col gap-10">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--card)] p-6 flex items-center gap-6 border border-[var(--border)] rounded-2xl shadow-sm">
          <div className="w-12 h-12 bg-[var(--chem)]/10 rounded-xl flex items-center justify-center">
            <IconTrend size={24} color="var(--chem)" animated={true} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-[var(--text)]">{totalWeakTopics}</span>
            <span className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest">Global Focus Topics</span>
          </div>
        </div>
        <div className="bg-[var(--card)] p-6 flex items-center gap-6 border border-[var(--border)] rounded-2xl shadow-sm">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <IconWarning size={24} color="#ea580c" animated={true} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-[var(--text)] uppercase">{mostStruggling}</span>
            <span className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest">Most Struggling Area</span>
          </div>
        </div>
        <div className="bg-[var(--card)] p-6 flex items-center gap-6 border border-[var(--border)] rounded-2xl shadow-sm">
          <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-xl flex items-center justify-center">
            <IconChart size={24} color="var(--accent)" animated={true} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-[var(--text)]">
              {Math.round((students.filter(s => s.computed.lastActiveDate).length / students.length) * 100)}%
            </span>
            <span className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest">Recent Activity</span>
          </div>
        </div>
      </div>

      {/* Struggle Map */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-countryside text-[var(--text)]">Topic Struggle Heatmap</h2>
          <p className="text-[10px] font-black text-[var(--muted2)] uppercase tracking-widest max-w-xs text-right">
            Darker red indicates more students flagged the topic as 'Weak'
          </p>
        </div>
        <div className="bg-[var(--card)] p-10 border border-[var(--border)] rounded-3xl shadow-sm">
          <BatchHeatmap students={students} onFlagTopic={setFlagModal} />
        </div>
      </div>

      {/* Focus Topics List */}
      <div className="flex flex-col gap-6">
        <h2 className="text-3xl font-countryside text-[var(--text)]">Live Coach Focus</h2>
        <FocusTopicsList focusTopics={focusTopics} onRemove={handleRemoveFocus} />
      </div>

      {/* Flag Modal */}
      {flagModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[var(--text)]/10 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setFlagModal(null)} />
          <div className="relative bg-[var(--card)] w-full max-w-md p-8 animate-in zoom-in duration-300 border border-[var(--border)] rounded-3xl shadow-2xl">
            <button onClick={() => setFlagModal(null)} className="absolute right-6 top-6 text-[var(--muted2)] hover:text-[var(--text)] transition-colors">
              <IconX size={24} color="var(--muted2)" />
            </button>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Flag for Batch Focus</span>
                <h3 className="text-3xl font-black text-[var(--text)] leading-tight">{flagModal.n}</h3>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest ml-1">Administering Note</label>
                <textarea 
                  value={flagNote}
                  onChange={(e) => setFlagNote(e.target.value)}
                  placeholder="Tell students what to prioritize for this topic..."
                  className="input-premium px-5 py-5 h-44"
                />
              </div>
              <button 
                onClick={handleFlagTopic}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4.5 rounded-2xl transition-all shadow-lg shadow-orange-600/20 flex items-center justify-center gap-3 active:scale-95"
              >
                <IconArrow size={20} color="white" />
                Push to Student Dashboards
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
