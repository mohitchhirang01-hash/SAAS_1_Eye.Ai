/* FIXED: Removed GSAP animations for maximum performance (Cleanup) */
'use client';

export default function IconFlask({ size = 24, color = "var(--chem)", className = "" }) {
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
        <path d="M10 2v8L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45L14 10V2" />
        <path d="M8.5 2h7" opacity="0.5" />
        <path d="M7 16.5c1 0 2-1 3-1s2 1 3 1 2-1 3-1v4a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-3z" fill={color} opacity="0.3" stroke="none" />
        <circle cx="10" cy="18" r="0.8" fill={color} />
        <circle cx="12" cy="16" r="0.6" fill={color} />
        <circle cx="14" cy="19" r="0.7" fill={color} />
      </svg>
    </div>
  );
}
