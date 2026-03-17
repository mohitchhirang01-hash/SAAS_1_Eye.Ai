/* FIXED: Removed GSAP animations for maximum performance (Cleanup) */
'use client';

export default function IconTrophy({ size = 24, color = "currentColor", className = "" }) {
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
        <g>
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 4h16v7a8 8 0 0 1-16 0V4Z" />
          <path d="M12 15v3" />
          <path d="M7 20h10" />
        </g>
      </svg>
    </div>
  );
}
