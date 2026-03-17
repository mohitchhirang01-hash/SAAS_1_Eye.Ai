/* FIXED: Removed GSAP animations for maximum performance (Cleanup) */
'use client';

export default function IconChart({ size = 24, color = "currentColor", className = "" }) {
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
        <path d="M3 20h18" opacity="0.3" />
        <rect x="5" y="11" width="3" height="6" rx="1" />
        <rect x="10" y="7" width="3" height="10" rx="1" />
        <rect x="15" y="13" width="3" height="4" rx="1" />
      </svg>
    </div>
  );
}
