/* FIXED: Removed GSAP animations for maximum performance (Cleanup) */
'use client';

export default function IconSort({ size = 24, color = "currentColor", className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m11 5-4-4-4 4M7 1v16" />
      <path d="m21 19-4 4-4-4M17 23V7" />
    </svg>
  );
}
