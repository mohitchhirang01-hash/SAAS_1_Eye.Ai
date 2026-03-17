/* FIXED: Removed GSAP animations for maximum performance (Cleanup) */
'use client';

export default function IconClock({ size = 24, color = "currentColor", className = "" }) {
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
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5" transform="rotate(240 12 12)" />
        <path d="M12 6v6" transform="rotate(30 12 12)" />
        <circle cx="12" cy="12" r="1" fill={color} />
        <path d="M12 3v1M12 20v1M3 12h1M20 12h1" opacity="0.3" strokeWidth="1" />
      </svg>
    </div>
  );
}
