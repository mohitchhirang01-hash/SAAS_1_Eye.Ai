/* FIXED: Removed GSAP animations for maximum performance (Cleanup) */
'use client';

export default function IconSigma({ size = 24, color = "var(--math)", className = "" }) {
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
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M18 7V5H6l6 7-6 7h12v-2" />
      </svg>
    </div>
  );
}
