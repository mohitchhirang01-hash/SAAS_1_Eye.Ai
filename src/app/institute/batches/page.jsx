'use client';

import { useState } from 'react';
import { useInstituteBatches } from '@/hooks/useInstituteBatches';
import { useInstituteTeachers } from '@/hooks/useInstituteTeachers';
import BatchCard from '@/components/institute/BatchCard';
import { IconPlus, IconLoader, IconBook, IconCheck } from '@/components/icons';
import { clsx } from 'clsx';

export default function BatchesListPage() {
  const { batches, isLoading: loadingBatches, createBatch } = useInstituteBatches();
  const { teachers } = useInstituteTeachers();
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newBatch, setNewBatch] = useState({
    name: '',
    subject: 'All',
    teacherId: '',
    schedule: ''
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    const res = await createBatch(newBatch.name, newBatch.subject, newBatch.teacherId, newBatch.schedule);
    setCreating(false);
    if (res.success) {
      setShowModal(false);
      setNewBatch({ name: '', subject: 'All', teacherId: '', schedule: '' });
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
         <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">Batches</h1>
            <span className="text-sm font-bold text-[#4a7a5a]">{batches.length} active batches across all subjects</span>
         </div>
         <button 
           onClick={() => setShowModal(true)}
           className="px-8 py-4 bg-[#2d6a4f] text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-xl shadow-[#2d6a4f]/20 hover:scale-105 transition-all"
         >
           <IconPlus className="w-4 h-4" />
           Create New Batch
         </button>
      </div>

      {loadingBatches ? (
        <div className="grid grid-cols-3 gap-8 animate-pulse">
           {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-white rounded-[40px]"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-8">
           {batches.map(batch => (
             <BatchCard key={batch.id} batch={batch} />
           ))}
        </div>
      )}

      {/* Create Batch Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#1a4a2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
           <div className="bg-white rounded-[40px] border border-[#c8dfc8] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="p-10 flex flex-col gap-8">
                 <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">Create New Batch</h3>
                    <button onClick={() => setShowModal(false)} className="text-[#4a7a5a] hover:text-[#c0392b] transition-colors font-black">CLOSE</button>
                 </div>

                 <form onSubmit={handleCreate} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a]">Batch Name</label>
                       <input 
                         required
                         type="text" 
                         className="px-6 py-4 bg-[#f7f9f4] border border-[#c8dfc8] rounded-xl text-sm focus:outline-none focus:border-[#2d6a4f]"
                         value={newBatch.name}
                         onChange={(e) => setNewBatch({...newBatch, name: e.target.value})}
                         placeholder="e.g. Droppers Alpha"
                       />
                    </div>

                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a]">Subject Focus</label>
                       <select 
                         className="px-6 py-4 bg-[#f7f9f4] border border-[#c8dfc8] rounded-xl text-sm font-bold focus:outline-none"
                         value={newBatch.subject}
                         onChange={(e) => setNewBatch({...newBatch, subject: e.target.value})}
                       >
                          <option>All</option>
                          <option>Mathematics</option>
                          <option>Physics</option>
                          <option>Chemistry</option>
                       </select>
                    </div>

                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a]">Assign Teacher</label>
                       <select 
                         className="px-6 py-4 bg-[#f7f9f4] border border-[#c8dfc8] rounded-xl text-sm font-bold focus:outline-none"
                         value={newBatch.teacherId}
                         onChange={(e) => setNewBatch({...newBatch, teacherId: e.target.value})}
                       >
                          <option value="">Unassigned</option>
                          {teachers.map(t => (
                            <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                          ))}
                       </select>
                    </div>

                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a]">Schedule</label>
                       <input 
                         type="text" 
                         className="px-6 py-4 bg-[#f7f9f4] border border-[#c8dfc8] rounded-xl text-sm focus:outline-none focus:border-[#2d6a4f]"
                         value={newBatch.schedule}
                         onChange={(e) => setNewBatch({...newBatch, schedule: e.target.value})}
                         placeholder="e.g. Mon Wed Fri 4-6 PM"
                       />
                    </div>

                    <button 
                      type="submit"
                      disabled={creating}
                      className="mt-4 py-5 bg-[#2d6a4f] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#2d6a4f]/20 hover:bg-[#1a4a2e] transition-all flex items-center justify-center gap-3"
                    >
                      {creating ? <IconLoader className="w-5 h-5 animate-spin" /> : <><IconCheck className="w-4 h-4"/> Create Batch</>}
                    </button>
                 </form>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
