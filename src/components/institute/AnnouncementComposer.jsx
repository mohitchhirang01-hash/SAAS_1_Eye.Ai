'use client';

import { useState } from 'react';
import { useInstituteAnnouncements } from '@/hooks/useInstituteAnnouncements';
import { IconBell, IconLoader, IconCheck } from '@/components/icons';
import { clsx } from 'clsx';

export default function AnnouncementComposer({ onSuccess }) {
  const { createAnnouncement } = useInstituteAnnouncements();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    target: 'all'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await createAnnouncement(formData.title, formData.message, formData.target);
    setLoading(false);
    
    if (result.success) {
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setFormData({ title: '', message: '', target: 'all' });
        if (onSuccess) onSuccess();
      }, 2000);
    }
  };

  return (
    <div className="bg-white p-10 rounded-[40px] border border-[#c8dfc8] shadow-sm flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <IconBell className="w-5 h-5 text-[#2d6a4f]" />
        <h3 className="text-xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">New Announcement</h3>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a] ml-1">Announcement Title</label>
          <input 
            required
            type="text" 
            className="px-6 py-4 bg-[#f7f9f4] border border-[#c8dfc8] rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-[#2d6a4f]/5 focus:border-[#2d6a4f] transition-all"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="e.g. Schedule Change for Batch A"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between ml-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a]">Message</label>
            <span className="text-[10px] font-bold text-[#4a7a5a] opacity-50">{formData.message.length}/500</span>
          </div>
          <textarea 
            required
            maxLength={500}
            className="w-full h-32 px-6 py-4 bg-[#f7f9f4] border border-[#c8dfc8] rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-[#2d6a4f]/5 focus:border-[#2d6a4f] transition-all resize-none"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            placeholder="Write your message here..."
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a] ml-1">Target Audience</label>
          <div className="flex gap-3">
            {['all', 'teachers', 'students'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFormData({...formData, target: t})}
                className={clsx(
                  "flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                  formData.target === t 
                    ? "bg-[#2d6a4f] text-white border-[#2d6a4f]" 
                    : "bg-[#f7f9f4] border-[#c8dfc8] text-[#4a7a5a] hover:bg-[#f0f5ef]"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading || sent}
          className="mt-4 w-full py-5 bg-[#2d6a4f] text-white rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-[#2d6a4f]/20 hover:bg-[#1a4a2e] transition-all flex items-center justify-center gap-3"
        >
          {loading ? (
            <IconLoader className="w-5 h-5 animate-spin" />
          ) : sent ? (
            <>
              <IconCheck className="w-5 h-5" />
              SENT!
            </>
          ) : (
            'Broadcast Announcement'
          )}
        </button>
      </form>
    </div>
  );
}
