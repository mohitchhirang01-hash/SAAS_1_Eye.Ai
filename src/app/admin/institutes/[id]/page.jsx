'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdminInstitutes } from '@/hooks/useAdminInstitutes';
import { useAdminPayments } from '@/hooks/useAdminPayments';
import StatusBadge from '@/components/admin/StatusBadge';
import BulkAccountCreator from '@/components/admin/BulkAccountCreator';
import { createClient } from '@/lib/supabase-client';
import { clsx } from 'clsx';
import { 
  IconArrowLeft, 
  IconEdit, 
  IconCreditCard, 
  IconFileExport,
  IconPower,
  IconUsers,
  IconUser,
  IconClock,
  IconCheck
} from '@/components/icons';

const supabase = createClient();

export default function InstituteDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { institutes, updateInstitute, suspendInstitute, exportCredentialsPDF } = useAdminInstitutes();
  const { logPayment } = useAdminPayments();
  const [inst, setInst] = useState(null);
  const [users, setUsers] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: instData } = await supabase
        .from('institutes')
        .select('*')
        .eq('id', id)
        .single();
      
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('institute_id', id);

      setInst(instData);
      setEditData(instData);
      setUsers(userData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  if (isLoading || !inst) return <div className="p-20 text-center font-black text-[#4a7a5a]">Loading institute details...</div>;

  const stats = [
    { label: 'Total Accounts', value: users.length, icon: IconUsers, color: 'text-[#2d6a4f]' },
    { label: 'Teachers', value: users.filter(u => u.role === 'teacher').length, icon: IconUser, color: 'text-[#0891b2]' },
    { label: 'Students', value: users.filter(u => u.role === 'student').length, icon: IconUsers, color: 'text-[#d97706]' },
    { label: 'Active Today', value: 0, icon: IconClock, color: 'text-[#2d6a4f]' }, // Mock
  ];

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Header section */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-4">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-black text-[#4a7a5a] uppercase tracking-widest hover:text-[#2d6a4f] transition-colors">
            <IconArrowLeft className="w-4 h-4" />
            Back to list
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">{inst.name}</h1>
            <StatusBadge status={inst.plan} />
            <StatusBadge status={inst.payment_status} />
          </div>
          <div className="flex items-center gap-6 text-sm font-bold text-[#4a7a5a]">
            <span>{inst.city}</span>
            <span className="opacity-30">|</span>
            <span>{inst.owner_name} • {inst.owner_phone}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setIsEdit(true)} className="flex items-center gap-2 px-5 py-3 bg-white border border-[#c8dfc8] rounded-xl text-xs font-black text-[#1a4a2e] hover:bg-[#f0f5ef] transition-colors">
            <IconEdit className="w-4 h-4" />
            EDIT DETAILS
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-[#2d6a4f] text-white rounded-xl text-xs font-black hover:bg-[#1a4a2e] transition-colors">
            <IconCreditCard className="w-4 h-4" />
            LOG PAYMENT
          </button>
          <button 
            onClick={() => exportCredentialsPDF(inst.id, inst.name, users)}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-[#c8dfc8] rounded-xl text-xs font-black text-[#2d6a4f] hover:bg-[#e8f5e9] transition-colors"
          >
            <IconFileExport className="w-4 h-4" />
            EXPORT PDF
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-[#c8dfc8] shadow-sm flex items-center gap-5">
              <div className={clsx("p-4 rounded-2xl bg-[#f7f9f4]", stat.color)}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a] mb-1">{stat.label}</span>
                <span className="text-2xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">{stat.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bulk Creator Section */}
      <div className="bg-white p-10 rounded-[40px] border border-[#c8dfc8] shadow-sm flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">Bulk Account Creator</h3>
          <p className="text-sm text-[#4a7a5a]">Generate thousands of teacher and student accounts instantly. Emails and passwords will follow the JEE Sprint secure format.</p>
        </div>
        
        <BulkAccountCreator instituteId={inst.id} instituteName={inst.name} />
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Existing Accounts */}
        <div className="col-span-8 bg-white p-10 rounded-[40px] border border-[#c8dfc8] shadow-sm flex flex-col gap-8">
          <h3 className="text-xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">Existing Accounts</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f0f5ef] text-[10px] font-black uppercase tracking-widest text-[#4a7a5a]">
                  <th className="p-4 rounded-l-xl">Name</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Email</th>
                  <th className="p-4 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user.id} className="border-b border-[#f0f5ef] last:border-0 hover:bg-[#f7f9f4] transition-colors">
                    <td className="p-4 font-bold text-sm text-[#1a4a2e]">{user.name}</td>
                    <td className="p-4"><StatusBadge status={user.role} /></td>
                    <td className="p-4 text-xs font-bold text-[#4a7a5a]">{user.email}</td>
                    <td className="p-4 text-right">
                      <button className="text-[10px] font-black uppercase text-[#2d6a4f] hover:underline">Reset Pass</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Column */}
        <div className="col-span-4 flex flex-col gap-8">
          <div className="bg-[#1a4a2e] p-8 rounded-[40px] text-white flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Revenue Tracking</span>
              <h3 className="text-2xl font-black font-['Syne',sans-serif]">Total Paid: ₹{(inst.amount || 0).toLocaleString()}</h3>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="opacity-60">Subscribed At</span>
                <span>{new Date(inst.subscribed_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="opacity-60">Expires At</span>
                <span className="text-[#fbbf24]">{new Date(inst.expires_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-[#c8dfc8] flex flex-col gap-4">
            <h4 className="font-black font-['Syne',sans-serif] text-[#1a4a2e]">Institute Notes</h4>
            <p className="text-sm text-[#4a7a5a] whitespace-pre-wrap">{inst.notes || 'No special notes for this institute.'}</p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEdit && (
        <div className="fixed inset-0 bg-[#1a4a2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] border border-[#c8dfc8] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-10 flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black font-['Syne',sans-serif] text-[#1a4a2e]">Edit Institute Details</h3>
                <button onClick={() => setIsEdit(false)} className="text-[#4a7a5a] hover:text-[#c0392b] transition-colors font-black uppercase text-xs">Close</button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a]">Institute Name</label>
                  <input 
                    type="text" 
                    className="px-6 py-4 bg-[#f7f9f4] border border-[#c8dfc8] rounded-xl text-sm focus:outline-none focus:border-[#2d6a4f]"
                    value={editData.name || ''}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a]">City</label>
                  <input 
                    type="text" 
                    className="px-6 py-4 bg-[#f7f9f4] border border-[#c8dfc8] rounded-xl text-sm focus:outline-none focus:border-[#2d6a4f]"
                    value={editData.city || ''}
                    onChange={(e) => setEditData({...editData, city: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a]">Owner Name</label>
                  <input 
                    type="text" 
                    className="px-6 py-4 bg-[#f7f9f4] border border-[#c8dfc8] rounded-xl text-sm focus:outline-none focus:border-[#2d6a4f]"
                    value={editData.owner_name || ''}
                    onChange={(e) => setEditData({...editData, owner_name: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a]">Owner Phone</label>
                  <input 
                    type="text" 
                    className="px-6 py-4 bg-[#f7f9f4] border border-[#c8dfc8] rounded-xl text-sm focus:outline-none focus:border-[#2d6a4f]"
                    value={editData.owner_phone || ''}
                    onChange={(e) => setEditData({...editData, owner_phone: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a]">Plan</label>
                  <select 
                    className="px-6 py-4 bg-[#f7f9f4] border border-[#c8dfc8] rounded-xl text-sm focus:outline-none"
                    value={editData.plan || 'starter'}
                    onChange={(e) => setEditData({...editData, plan: e.target.value})}
                  >
                    <option value="starter">Starter</option>
                    <option value="growth">Growth</option>
                    <option value="institute">Enterprise</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a]">Payment Status</label>
                  <select 
                    className="px-6 py-4 bg-[#f7f9f4] border border-[#c8dfc8] rounded-xl text-sm focus:outline-none"
                    value={editData.payment_status || 'trial'}
                    onChange={(e) => setEditData({...editData, payment_status: e.target.value})}
                  >
                    <option value="trial">Trial</option>
                    <option value="active">Active</option>
                    <option value="overdue">Overdue</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#4a7a5a]">Notes</label>
                  <textarea 
                    className="px-6 py-4 bg-[#f7f9f4] border border-[#c8dfc8] rounded-xl text-sm focus:outline-none focus:border-[#2d6a4f] h-24 resize-none"
                    value={editData.notes || ''}
                    onChange={(e) => setEditData({...editData, notes: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={async () => {
                    const res = await updateInstitute(inst.id, editData);
                    if (res.success) {
                      setIsEdit(false);
                      fetchDetails();
                    } else {
                      alert(res.error);
                    }
                  }}
                  className="flex-1 py-5 bg-[#2d6a4f] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1a4a2e] transition-all"
                >
                  Save Changes
                </button>
                <button 
                  onClick={() => suspendInstitute(inst.id)}
                  className="px-8 py-5 border border-[#c0392b] text-[#c0392b] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#c0392b] hover:text-white transition-all"
                >
                  Suspend
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
