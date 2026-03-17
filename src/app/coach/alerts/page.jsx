'use client';

import { useAlerts } from '@/hooks/useAlerts';
import AlertComposer from '@/components/coach/AlertComposer';
import AlertHistory from '@/components/coach/AlertHistory';
import { 
  IconBell, 
  IconArrow, 
  IconClock, 
  IconLoader 
} from '@/components/icons';

export default function AlertsManagementPage() {
  const { sentAlerts, isLoading, sendBatchAlert, deleteAlert } = useAlerts();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <IconLoader size={40} color="var(--accent)" animated={true} />
        <p className="text-[var(--muted2)] font-black uppercase tracking-[0.3em] text-[10px]">Syncing Batch Notifications...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 max-w-6xl">
      {/* Top Section: Quick Broadcast */}
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-countryside text-[var(--text)]">Alert Composer</h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-[var(--accent-bg)] rounded-full border border-[var(--accent)]/10 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="text-[9px] font-black text-[var(--accent)] uppercase tracking-widest">System Online</span>
          </div>
        </div>
        <div className="bg-[var(--card)] p-4 border border-[var(--border)] rounded-[2.5rem] shadow-sm overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity duration-700" />
          <AlertComposer onSent={sendBatchAlert} />
        </div>
      </div>

      {/* history Section */}
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[var(--card2)] border border-[var(--border)] rounded-2xl flex items-center justify-center shadow-sm">
            <IconClock size={24} color="var(--muted)" animated={true} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-countryside text-[var(--text)]">Message Registry</h2>
            <p className="text-[10px] font-black text-[var(--muted2)] uppercase tracking-[0.3em] leading-none mt-1">Audit log for all sent communications</p>
          </div>
        </div>
        <AlertHistory alerts={sentAlerts} onDelete={deleteAlert} />
      </div>
    </div>
  );
}
