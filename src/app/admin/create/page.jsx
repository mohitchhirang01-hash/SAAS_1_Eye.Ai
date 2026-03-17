'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminInstitutes } from '@/hooks/useAdminInstitutes';
import { 
  IconCheck, 
  IconLoader, 
  IconRocket, 
  IconUsers, 
  IconShield,
  IconArrowRight
} from '@/components/icons';
import { clsx } from 'clsx';

export default function CreateInstitutePage() {
  const router = useRouter();
  const { createInstitute, generateAccounts, exportCredentialsPDF } = useAdminInstitutes();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    owner_name: '',
    owner_phone: '',
    email: '',
    password: '',
    city: '',
    plan: 'starter',
    student_limit: 30,
    amount: 499,
    duration: 1,
    notes: '',
    teacherNames: '',
    studentNames: ''
  });

  const plans = [
    { 
      id: 'starter', 
      name: 'Starter', 
      price: 499, 
      limit: 30, 
      teachers: 1, 
      features: ['Up to 30 students', '1 teacher account', 'Basic analytics']
    },
    { 
      id: 'growth', 
      name: 'Growth', 
      price: 1299, 
      limit: 75, 
      teachers: 3, 
      features: ['Up to 75 students', '3 teacher accounts', 'Full analytics + alerts'],
      popular: true
    },
    { 
      id: 'institute', 
      name: 'Institute', 
      price: 2999, 
      limit: 500, 
      teachers: 999, 
      features: ['Unlimited* students', 'Unlimited teachers', 'Custom branding', 'Priority support']
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const expires_at = new Date();
      expires_at.setMonth(expires_at.getMonth() + parseInt(formData.duration));

      // 1. Create Institute and Head Owner
      const instResult = await createInstitute({
        ...formData,
        expires_at: expires_at.toISOString()
      });

      if (!instResult.success) throw new Error(instResult.error);

      const instituteId = instResult.data.id;
      let allAccounts = [];

      // 2. Generate initial accounts if provided
      const tList = formData.teacherNames.split('\n').filter(n => n.trim());
      const sList = formData.studentNames.split('\n').filter(n => n.trim());

      if (tList.length > 0 || sList.length > 0) {
        const batchResult = await generateAccounts(instituteId, sList, tList);
        if (batchResult.success) {
          allAccounts = batchResult.accounts;
        }
      }

      // 3. Export PDF
      exportCredentialsPDF(instituteId, formData.name, allAccounts);

      // 4. Redirect
      router.push(`/admin/institutes/${instituteId}`);
    } catch (err) {
      alert(`Onboarding failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10 pb-20">
      {/* Section 1: Details */}
      <div className="bg-white p-10 rounded-[40px] border border-[#c8dfc8] shadow-sm flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <IconRocket className="w-5 h-5 text-[#2d6a4f]" />
          <h3 className="text-xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">Institute Details</h3>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a] ml-1">Institute Name</label>
            <input 
              required
              type="text" 
              className="px-6 py-4 bg-[#f7f9f4] border border-[#c8dfc8] rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-[#2d6a4f]/5 focus:border-[#2d6a4f] transition-all"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Sharma Classes"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a] ml-1">City</label>
            <input 
              required
              type="text" 
              className="px-6 py-4 bg-[#f7f9f4] border border-[#c8dfc8] rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-[#2d6a4f]/5 focus:border-[#2d6a4f] transition-all"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              placeholder="e.g. Jaipur"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a] ml-1">Owner Name</label>
            <input 
              required
              type="text" 
              className="px-6 py-4 bg-[#f7f9f4] border border-[#c8dfc8] rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-[#2d6a4f]/5 focus:border-[#2d6a4f] transition-all"
              value={formData.owner_name}
              onChange={(e) => setFormData({...formData, owner_name: e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a] ml-1">Owner Email (Platform Login)</label>
            <input 
              required
              type="email" 
              className="px-6 py-4 bg-[#f7f9f4] border border-[#c8dfc8] rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-[#2d6a4f]/5 focus:border-[#2d6a4f] transition-all"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a] ml-1">Temporary Password</label>
            <input 
              required
              type="password" 
              className="px-6 py-4 bg-[#f7f9f4] border border-[#c8dfc8] rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-[#2d6a4f]/5 focus:border-[#2d6a4f] transition-all"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a] ml-1">Contact Phone</label>
            <input 
              type="text" 
              className="px-6 py-4 bg-[#f7f9f4] border border-[#c8dfc8] rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-[#2d6a4f]/5 focus:border-[#2d6a4f] transition-all"
              value={formData.owner_phone}
              onChange={(e) => setFormData({...formData, owner_phone: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Section 2: Plan Selection */}
      <div className="bg-white p-10 rounded-[40px] border border-[#c8dfc8] shadow-sm flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <IconShield className="w-5 h-5 text-[#2d6a4f]" />
          <h3 className="text-xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">Select Plan</h3>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {plans.map((p) => (
            <div 
              key={p.id}
              onClick={() => setFormData({...formData, plan: p.id, student_limit: p.limit, amount: p.id === 'starter' ? 499 : p.id === 'growth' ? 1299 : 2999})}
              className={clsx(
                "p-8 rounded-[32px] border-4 cursor-pointer transition-all flex flex-col gap-6 relative overflow-hidden",
                formData.plan === p.id ? "border-[#2d6a4f] bg-[#e8f5e9]/50" : "border-[#f0f5ef] hover:border-[#c8dfc8]"
              )}
            >
              {p.popular && (
                <div className="absolute top-0 right-0 bg-[#2d6a4f] text-white px-6 py-2 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-sm font-black text-[#4a7a5a] uppercase tracking-widest mb-1">{p.name}</span>
                <span className="text-3xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">₹{p.price.toLocaleString()}<span className="text-sm font-bold opacity-40">/mo</span></span>
              </div>
              <ul className="flex flex-col gap-3">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs font-bold text-[#4a7a5a]">
                    <IconCheck className="w-4 h-4 text-[#2d6a4f]" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Subscription & Accounts */}
      <div className="grid grid-cols-2 gap-8">
        {/* Subscription Setup */}
        <div className="bg-white p-10 rounded-[40px] border border-[#c8dfc8] shadow-sm flex flex-col gap-8">
          <h3 className="text-xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">Subscription Setup</h3>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a] ml-1">Initial Duration</label>
              <select 
                className="px-6 py-4 bg-[#f7f9f4] border border-[#c8dfc8] rounded-xl text-sm font-bold focus:outline-none"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
              >
                <option value="1">1 Month</option>
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="12">1 Year</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-6 bg-[#f0f5ef] rounded-2xl">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-[#4a7a5a]">Subscription Expires</span>
                <span className="text-lg font-black text-[#1a4a2e]">
                  {(() => {
                    const d = new Date();
                    d.setMonth(d.getMonth() + parseInt(formData.duration));
                    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
                  })()}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase text-[#4a7a5a]">Initial Payment</span>
                <span className="text-2xl font-black text-[#2d6a4f]">₹{(formData.amount * formData.duration).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Initial Accounts */}
        <div className="bg-white p-10 rounded-[40px] border border-[#c8dfc8] shadow-sm flex flex-col gap-6">
          <h3 className="text-xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">Initial Accounts (Optional)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a] ml-1">Teachers</label>
              <textarea 
                className="w-full h-32 p-4 bg-[#f7f9f4] border border-[#c8dfc8] rounded-xl text-xs focus:outline-none resize-none"
                placeholder="Names per line..."
                value={formData.teacherNames}
                onChange={(e) => setFormData({...formData, teacherNames: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a] ml-1">Students</label>
              <textarea 
                className="w-full h-32 p-4 bg-[#f7f9f4] border border-[#c8dfc8] rounded-xl text-xs focus:outline-none resize-none"
                placeholder="Names per line..."
                value={formData.studentNames}
                onChange={(e) => setFormData({...formData, studentNames: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button 
          type="submit"
          disabled={loading}
          className="px-16 py-6 bg-[#2d6a4f] text-white rounded-[32px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#2d6a4f]/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group"
        >
          {loading ? (
            <>
              <IconLoader className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Create Institute & Generate Accounts
              <IconArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
