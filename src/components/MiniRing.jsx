export function MiniRing({ pct, size = 52 }) {
  const stroke = 5;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const color = pct >= 80 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#374151" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={circ - (pct / 100) * circ}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
      <text x={size / 2} y={size / 2 + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill={color}>
        {Math.round(pct)}%
      </text>
    </svg>
  );
}
