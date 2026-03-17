/* FIXED: Removed GSAP animations for maximum performance (Cleanup) */
'use client';

export default function IconCalendar({ size = 24, color = "currentColor", className = "" }) {
  return (
    <div 
      className={`inline-flex items-center justify-center ${className}`}
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
        <rect x="3" y="4" width="18" height="17" rx="3" />
        <path d="M3 9h18" opacity="0.4" />
        <path d="M7 2v4M17 2v4" />
        <circle cx="7" cy="13" r="1" fill={color} />
        <circle cx="12" cy="13" r="1" fill={color} />
        <circle cx="17" cy="13" r="1" fill={color} />
        <circle cx="7" cy="17" r="1" fill={color} />
        <circle cx="12" cy="17" r="1" fill={color} />
        <circle cx="17" cy="17" r="1" fill={color} />
      </svg>
    </div>
  );
}
