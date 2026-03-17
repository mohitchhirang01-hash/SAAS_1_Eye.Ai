/* FIXED: Skeleton loader for perceived performance (Problem 8) */
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Skeleton({ className }) {
  return (
    <div 
      className={twMerge(
        "animate-pulse bg-[var(--border)] opacity-20 rounded-xl", 
        className
      )} 
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-8">
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
      
      {/* Bottom row */}
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

export function ListSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-4">
      {[...Array(rows)].map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}
