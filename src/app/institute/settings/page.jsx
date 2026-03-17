'use client';

import { useState } from 'react';
import { useInstituteData } from '@/hooks/useInstituteData';
import { createClient } from '@/lib/supabase-client';
import { IconShield, IconCreditCard, IconKey, IconCheck, IconLoader } from '@/components/icons';
import { clsx } from 'clsx';

const supabase = createClient();

export default function SettingsPage() {
  const { institute, isLoading } = useInstituteData();
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passForm, setPassForm] = useState({ current: '', next: '', confirm: '' });

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passForm.next !== passForm.confirm) {
      alert("Passwords don't match!");
      return;
    }
    setPasswordLoading(true);
    const { error } = await supabase.auth.updateUser({ password: passForm.next });
    setPasswordLoading(false);
    if (error) alert(error.message);
    else {
      alert("Password updated successfully!");
      setPassForm({ current: '', next: '', confirm: '' });
    }
  };

  if (isLoading || !institute) return <div className="p-20 text-center font-black animate-pulse">Loading settings...</div>;

  return (
    <div className="flex flex-col gap-10 pb-20 max-w-4xl">
       {/* Institute Info */}
       <div className="bg-white p-10 rounded-[40px] border border-[#c8dfc8] shadow-sm flex flex-col gap-8">
          <div className="flex items-center gap-3">
             <IconShield className="w-5 h-5 text-[#2d6a4f]" />
             <h3 className="text-xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">Institute Profile</h3>
          </div>
          <div className="grid grid-cols-2 gap-8">
             {[
               { label: 'Institute Name', value: institute.name },
               { label: 'Head of Institute', value: institute.owner_name },
               { label: 'Owner Email', value: institute.email || 'N/A' },
               { label: 'City', value: institute.city || 'N/A' },
               { label: 'Subscribed Since', value: new Date(institute.created_at).toLocaleDateString() },
             ].map((f, i) => (
               <div key={i} className="px-6 py-4 bg-[#f7f9f4] border border-[#c8dfc8] rounded-xl flex flex-col gap-1">
                  <span className="text-[9px] font-black uppercase text-[#4a7a5a] opacity-50">{f.label}</span>
                  <span className="text-sm font-bold text-[#1a4a2e]">{f.value}</span>
               </div>
             ))}
          </div>
          <div className="p-4 bg-[#e8f5e9] border border-[#2d6a4f]/20 rounded-2xl text-[10px] font-bold text-[#2d6a4f] text-center">
             To update these details, please contact the platform administrator.
          </div>
       </div>

       {/* Subscription */}
       <div className="bg-white p-10 rounded-[40px] border border-[#c8dfc8] shadow-sm flex flex-col gap-8">
          <div className="flex items-center gap-3">
             <IconCreditCard className="w-5 h-5 text-[#d4850a]" />
             <h3 className="text-xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">Subscription Details</h3>
          </div>
          <div className="flex items-center justify-between p-8 bg-[#f0f5ef] rounded-[32px] border border-[#c8dfc8]">
             <div className="flex flex-col gap-2">
                <span className="text-xs font-black text-[#1a4a2e] uppercase tracking-widest">{institute.plan} Plan</span>
                <span className="text-sm font-bold text-[#4a7a5a]">Active until {new Date(institute.expires_at).toLocaleDateString()}</span>
             </div>
             <button className="px-8 py-4 bg-[#2d6a4f] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1a4a2e] transition-all">
                Upgrade Plan
             </button>
          </div>
       </div>

       {/* Security */}
       <div className="bg-white p-10 rounded-[40px] border border-[#c8dfc8] shadow-sm flex flex-col gap-8">
          <div className="flex items-center gap-3">
             <IconKey className="w-5 h-5 text-[#c0392b]" />
             <h3 className="text-xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">Security & Password</h3>
          </div>
          <form onSubmit={handleUpdatePassword} className="flex flex-col gap-6">
             <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2 col-span-2">
                   <label className="text-[10px] font-black uppercase text-[#4a7a5a] ml-1">Current Password</label>
                   <input 
                     type="password" 
                     className="px-6 py-4 bg-[#f7f9f4] border border-[#c8dfc8] rounded-xl text-sm focus:outline-none focus:border-[#2d6a4f]"
                     value={passForm.current}
                     onChange={(e) => setPassForm({...passForm, current: e.target.value})}
                   />
                </div>
                <div className="flex flex-col gap-2">
                   <label className="text-[10px] font-black uppercase text-[#4a7a5a] ml-1">New Password</label>
                   <input 
                     type="password" 
                     className="px-6 py-4 bg-[#f7f9f4] border border-[#c8dfc8] rounded-xl text-sm focus:outline-none focus:border-[#2d6a4f]"
                     value={passForm.next}
                     onChange={(e) => setPassForm({...passForm, next: e.target.value})}
                   />
                </div>
                <div className="flex flex-col gap-2">
                   <label className="text-[10px] font-black uppercase text-[#4a7a5a] ml-1">Confirm New Password</label>
                   <input 
                     type="password" 
                     className="px-6 py-4 bg-[#f7f9f4] border border-[#c8dfc8] rounded-xl text-sm focus:outline-none focus:border-[#2d6a4f]"
                     value={passForm.confirm}
                     onChange={(e) => setPassForm({...passForm, confirm: e.target.value})}
                   />
                </div>
             </div>
             <button 
               type="submit" 
               disabled={passwordLoading}
               className="w-fit px-10 py-4 bg-[#1a4a2e] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all text-center flex items-center gap-3"
             >
                {passwordLoading ? <IconLoader className="w-4 h-4 animate-spin" /> : <><IconCheck className="w-4 h-4"/> Update Password</>}
             </button>
          </form>
       </div>
    </div>
  );
}
