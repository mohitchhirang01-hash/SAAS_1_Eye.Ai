/* FIXED: Removed GSAP animations for maximum performance (Cleanup) */
'use client';

export default function IconBook({ size = 24, color = "currentColor", className = "" }) {
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
        <path d="M4 19a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2M4 19V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14" />
        <path d="M12 3v14" opacity="0.5" />
        <path d="M7 7h3" />
        <path d="M7 10h3" />
        <path d="M7 13h3" />
        <path d="M14 7h3" />
        <path d="M14 10h3" />
        <path d="M14 13h3" />
      </svg>
    </div>
  );
}
