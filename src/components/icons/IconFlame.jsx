/* FIXED: Removed GSAP animations for maximum performance (Cleanup) */
'use client';

export default function IconFlame({ size = 24, color = "var(--math)", className = "" }) {
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
        <path 
          d="M12 2c0 0-4.5 4.5-4.5 8.5 0 2.485 2.015 4.5 4.5 4.5s4.5-2.015 4.5-4.5c0-4-4.5-8.5-4.5-8.5Z" 
          stroke={color} 
        />
        <path 
          d="M12 11c0 0-1.5 1.5-1.5 3 0 .828.672 1.5 1.5 1.5s1.5-.672 1.5-1.5c0-1.5-1.5-3-1.5-3Z" 
          fill={color} 
          opacity="0.8"
        />
        <path d="M12 18v1M9 19H8M16 19h-1" opacity="0.3" strokeWidth="1" />
      </svg>
    </div>
  );
}
