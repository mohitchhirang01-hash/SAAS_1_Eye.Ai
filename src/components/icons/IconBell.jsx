/* FIXED: Removed GSAP animations for maximum performance (Cleanup) */
'use client';

export default function IconBell({ size = 24, color = "currentColor", hasUnread = false, className = "" }) {
  return (
    <div 
      className={`inline-flex items-center justify-center relative ${className}`}
      style={{ width: size, height: size }}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <g>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </g>
      </svg>
      {hasUnread && (
        <div 
          className="absolute top-0 right-0 w-2 h-2 bg-[var(--danger)] rounded-full border-2 border-[var(--card)]"
        />
      )}
    </div>
  );
}
