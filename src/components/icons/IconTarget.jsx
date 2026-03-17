/* FIXED: Removed GSAP animations for maximum performance (Cleanup) */
'use client';

export default function IconTarget({ size = 24, color = "currentColor", className = "" }) {
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
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="2" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2" opacity="0.4" />
        <circle cx="12" cy="12" r="0.8" fill={color} />
      </svg>
    </div>
  );
}
