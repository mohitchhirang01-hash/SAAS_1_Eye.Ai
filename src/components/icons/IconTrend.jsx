/* FIXED: Removed GSAP animations for maximum performance (Cleanup) */
'use client';

export default function IconTrend({ size = 24, color = "currentColor", className = "" }) {
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
        <path d="M3 17l6-6 4 4 8-8" />
        <circle cx="3" cy="17" r="1.5" fill={color} stroke="none" />
        <circle cx="9" cy="11" r="1.5" fill={color} stroke="none" />
        <circle cx="13" cy="15" r="1.5" fill={color} stroke="none" />
        <circle cx="21" cy="7" r="1.5" fill={color} stroke="none" />
      </svg>
    </div>
  );
}
