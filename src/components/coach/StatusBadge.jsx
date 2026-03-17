import { IconFlame, IconClock, IconWarning } from '@/components/icons';
import { clsx } from 'clsx';

export default function StatusBadge({ status }) {
  const configs = {
    active: { label: 'Active Today', bg: 'bg-[var(--accent-bg)]', text: 'text-[var(--accent)]', icon: IconFlame, color: 'var(--accent)', border: 'border-[var(--accent)]/20' },
    idle: { label: 'Idle', bg: 'bg-orange-50', text: 'text-orange-600', icon: IconClock, color: '#ea580c', border: 'border-orange-200' },
    inactive: { label: 'Inactive', bg: 'bg-red-50', text: 'text-red-600', icon: IconWarning, color: '#dc2626', border: 'border-red-200' }
  };

  const config = configs[status] || configs.inactive;
  const Icon = config.icon;

  return (
    <div className={clsx(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-xs",
      config.bg,
      config.text,
      config.border
    )}>
      <Icon size={10} color={config.color} animated={status === 'active'} />
      <span className="text-[9px] font-black uppercase tracking-widest">{config.label}</span>
    </div>
  );
}
