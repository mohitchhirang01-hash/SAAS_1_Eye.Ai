import { useProgressContext } from "@/app/Providers";
import { startOfToday, addDays, format } from "date-fns";
import clsx from "clsx";
import { IconCalendar } from "@/components/icons";

export default function ActivityMap() {
  const { S } = useProgressContext();
  const sprintStart = startOfToday();

  const cells = Array.from({ length: 25 }, (_, i) => {
    const date = addDays(sprintStart, i);
    const k = format(date, 'yyyy-MM-dd');
    const h = S.hours[k] || {};
    const total = (h.math || 0) + (h.phys || 0) + (h.chem || 0);

    let opacity = 0;
    if (total > 0) {
      if (total < 15) opacity = 0.2;
      else if (total < 30) opacity = 0.45;
      else if (total < 50) opacity = 0.7;
      else opacity = 1;
    }

    return { date, total, opacity, isToday: k === format(new Date(), 'yyyy-MM-dd') };
  });

  return (
    <div className="bg-[var(--card)] p-6 border border-[var(--border)] rounded-2xl shadow-sm">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text)] mb-6 flex items-center gap-2">
        <IconCalendar size={16} color="var(--text)" animated={true} />
        25-Day Activity Map
      </h3>
      <div className="flex flex-wrap gap-2">
        {cells.map((cell, i) => (
          <div
            key={i}
            className={clsx(
              "heat-cell group relative border transition-all duration-300",
              cell.isToday ? "border-[var(--accent)] ring-4 ring-[var(--accent)]/10" : "border-transparent"
            )}
            style={{ 
              backgroundColor: cell.total > 0 ? `rgba(45, 106, 79, ${cell.opacity})` : 'var(--card2)',
              borderColor: cell.total > 0 ? 'transparent' : 'var(--border)',
              color: cell.opacity > 0.6 ? '#ffffff' : 'var(--muted)'
            }}
          >
            {cell.date.getDate()}
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-[var(--text)] text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-xl">
              {format(cell.date, 'MMM d')}: {cell.total} attempted
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center gap-3 text-[10px] font-black text-[var(--muted2)] uppercase tracking-widest">
        <span>Less</span>
        <div className="flex gap-1.5">
          {[0, 0.2, 0.45, 0.7, 1].map((op, i) => (
            <div key={i} className="w-4 h-4 rounded-sm border" style={{ 
              backgroundColor: op === 0 ? 'var(--card2)' : `rgba(45, 106, 79, ${op})`,
              borderColor: op === 0 ? 'var(--border)' : 'transparent'
            }} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
