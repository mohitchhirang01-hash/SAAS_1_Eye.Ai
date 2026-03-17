'use client';

export default function ScoreSparkline({ scores = [] }) {
  if (scores.length < 2) return <div className="text-[9px] font-black text-[var(--muted2)] uppercase tracking-widest whitespace-nowrap opacity-50">Insufficient data</div>;

  const width = 80;
  const height = 30;
  const padding = 4;
  
  const max = Math.max(...scores, 300);
  const min = Math.min(...scores, 0);
  const range = max - min;

  const points = scores.map((val, i) => {
    const x = (i / (scores.length - 1)) * (width - padding * 2) + padding;
    const y = height - ((val - min) / range) * (height - padding * 2) - padding;
    return `${x},${y}`;
  }).join(' ');

  const isTrendingUp = scores[scores.length - 1] >= scores[scores.length - 2];
  const color = isTrendingUp ? 'var(--accent)' : 'red';

  return (
    <svg width={width} height={height} className="overflow-visible">
      <path
        d={`M ${points}`}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
      />
      {/* Target marker */}
      <circle 
        cx={(scores.length - 1) / (scores.length - 1) * (width - padding * 2) + padding} 
        cy={height - ((scores[scores.length - 1] - min) / range) * (height - padding * 2) - padding} 
        r="3" 
        fill={color} 
        className="shadow-sm"
      />
    </svg>
  );
}
