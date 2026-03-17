'use client';

import { useState } from 'react';
import { 
  IconX, 
  IconUser, 
  IconCheck, 
  IconWarning,
  IconLoader 
} from '@/components/icons';

export default function CreateStudentModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', target_score: 220 });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await onSubmit(formData.name, formData.email, formData.password);
    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData({ name: '', email: '', password: '', target_score: 220 });
        onClose();
      }, 2000);
    } else {
      alert(res.error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div 
        className="absolute inset-0 bg-[var(--text)]/10 backdrop-blur-xl animate-in fade-in duration-500" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-xl bg-[var(--card)] border border-[var(--border)] rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--accent)] via-blue-500 to-[var(--accent)]" />
        
        <div className="p-10 flex flex-col gap-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-[var(--accent-bg)] rounded-2xl flex items-center justify-center border border-[var(--accent)]/10 shadow-sm">
                <IconUser size={28} color="var(--accent)" animated={true} />
              </div>
              <div className="flex flex-col">
                <h2 className="text-3xl font-countryside text-[var(--text)] leading-none">Onboard Student</h2>
                <p className="text-[10px] font-black text-[var(--muted2)] uppercase tracking-[0.3em] mt-2">Create new academic profile</p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 bg-[var(--card2)] hover:bg-red-50 text-[var(--muted2)] hover:text-red-600 rounded-xl transition-all border border-[var(--border)] hover:border-red-100 shadow-sm">
              <IconX size={20} color="var(--muted2)" />
            </button>
          </div>

          {success ? (
            <div className="py-20 flex flex-col items-center justify-center gap-6 animate-in zoom-in-90">
              <div className="w-24 h-24 bg-[var(--accent-bg)] rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                <IconCheck size={48} color="var(--accent)" animated={true} />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-countryside text-[var(--text)]">Registration Successful</h3>
                <p className="text-[10px] font-black text-[var(--muted2)] uppercase tracking-widest mt-1">Directing to dashboard...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div className="grid grid-cols-1 gap-6">
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest ml-1">Full Identity</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Aryan Sharma"
                    className="input-premium px-6 py-6"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest ml-1">Communication Channel</label>
                  <input 
                    required
                    type="email" 
                    placeholder="aryan@gmail.com"
                    className="input-premium px-6 py-6"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest ml-1">Access Key (Password)</label>
                  <input 
                    required
                    type="password" 
                    placeholder="••••••••"
                    className="input-premium px-6 py-6"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest">Base Target Score (JEE)</label>
                    <span className="text-[10px] font-black text-[var(--accent)] uppercase">{formData.target_score} PTS</span>
                  </div>
                  <input 
                    type="range" 
                    min="150" 
                    max="300"
                    step="5"
                    className="w-full accent-[var(--accent)] cursor-pointer"
                    value={formData.target_score}
                    onChange={e => setFormData({ ...formData, target_score: parseInt(e.target.value) })}
                  />
                  <div className="flex justify-between px-1 text-[9px] font-black text-[var(--muted2)] uppercase">
                    <span>150</span>
                    <span>225</span>
                    <span>300</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[var(--accent)] hover:bg-[var(--accent-h)] text-white font-black py-5 rounded-2xl flex items-center justify-center gap-4 transition-all shadow-lg shadow-[var(--accent)]/20 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <IconLoader size={20} color="white" animated={true} />
                      <span className="text-[10px] uppercase tracking-[.3em]">Deploying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <IconUser size={20} color="white" animated={false} />
                      <span className="text-[10px] uppercase tracking-[.3em]">Finalize Onboarding</span>
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-2 text-[9px] font-black text-[var(--muted2)] uppercase tracking-widest">
                  <IconWarning size={14} color="var(--muted2)" animated={false} /> Secure Academic Instance
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
