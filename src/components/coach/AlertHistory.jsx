'use client';

import {
  IconBell,
  IconUser,
  IconWarning,
  IconTrash
} from '@/components/icons';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { clsx } from 'clsx';

export default function AlertHistory({ alerts, onDelete }) {
  if (alerts.length === 0) {
    return (
      <div className="bg-[var(--card)] flex flex-col items-center justify-center p-20 gap-4 border border-[var(--border)] rounded-3xl shadow-sm">
        <div className="w-16 h-16 bg-[var(--card2)] rounded-full flex items-center justify-center border border-[var(--border)] shadow-sm">
          <IconBell size={32} color="var(--muted2)" animated={false} />
        </div>
        <div className="text-center">
          <p className="text-[var(--text)] font-black uppercase tracking-widest text-sm mb-1">No alerts Registry</p>
          <p className="text-[10px] text-[var(--muted2)] uppercase font-black tracking-[0.2em]">Use the composer to notify your students.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-sm overflow-x-auto custom-scrollbar">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--card2)]/50">
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)]">Timestamp</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)]">Recipient</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)]">Message Content</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)]">Flag</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)]">Status</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)] text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {alerts.map((alert) => (
            <tr key={alert.id} className="hover:bg-[var(--card2)] transition-colors group">
              <td className="px-6 py-6">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[var(--text)] text-xs font-black">{formatDistanceToNow(parseISO(alert.created_at))} ago</span>
                  <span className="text-[9px] text-[var(--muted2)] uppercase font-black tracking-widest">{new Date(alert.created_at).toLocaleDateString()}</span>
                </div>
              </td>
              <td className="px-6 py-6">
                <div className="flex items-center gap-3">
                  <div className={clsx(
                    "w-9 h-9 rounded-xl flex items-center justify-center shadow-sm border",
                    alert.student_id ? "bg-[var(--accent-bg)] border-[var(--accent)]/10" : "bg-orange-50 border-orange-100"
                  )}>
                    <IconUser size={18} color={alert.student_id ? "var(--accent)" : "#ea580c"} animated={false} />
                  </div>
                  <span className="text-xs font-black text-[var(--text2)] uppercase tracking-wider">
                    {alert.student_id ? alert.recipient?.name : 'Global Batch'}
                  </span>
                </div>
              </td>
              <td className="px-6 py-6 font-medium">
                <p className="text-sm text-[var(--text)] line-clamp-2 leading-relaxed max-w-sm italic">"{alert.message}"</p>
              </td>
              <td className="px-6 py-6">
                {alert.topic_flag ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-50 border border-red-100 text-[9px] font-black text-red-600 uppercase tracking-widest shadow-xs">
                    <IconWarning size={14} color="var(--danger)" animated={false} /> {alert.topic_flag}
                  </span>
                ) : (
                  <span className="text-[var(--muted2)] text-[10px] font-black tracking-widest">—</span>
                )}
              </td>
              <td className="px-6 py-6">
                {alert.student_id ? (
                  <span className={clsx(
                    "text-[9px] font-black uppercase tracking-[.2em] px-2.5 py-1 rounded-full border shadow-xs",
                    alert.is_read ? "bg-[var(--accent-bg)] text-[var(--accent)] border-[var(--accent)]/20" : "bg-[var(--card2)] text-[var(--muted2)] border-[var(--border)]"
                  )}>
                    {alert.is_read ? 'Seen' : 'Sent'}
                  </span>
                ) : (
                  <span className="text-[9px] font-black text-[var(--muted)] uppercase tracking-[.2em]">Blast Logic</span>
                )}
              </td>
              <td className="px-6 py-6 text-right">
                <button 
                  onClick={() => onDelete(alert.id)}
                  className="p-3 text-[var(--muted2)] hover:text-red-600 transition-all hover:bg-red-50 border border-transparent hover:border-red-100 rounded-xl group/del"
                >
                  <IconTrash size={18} color="var(--muted2)" className="group-hover/del:text-red-600 group-hover/del:scale-110 transition-all" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
