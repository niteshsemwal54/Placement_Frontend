export function ScoreRing({ pct, size = 120, stroke = 10 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const color = pct >= 80 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1f2937" strokeWidth={stroke} />
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
        style={{ transition: "stroke-dashoffset 1.2s ease" }}
      />
      <text x={size / 2} y={size / 2 - 5} textAnchor="middle" fontSize={size * 0.19} fontWeight="800" fill={color}>
        {Math.round(pct)}%
      </text>
      <text x={size / 2} y={size / 2 + 12} textAnchor="middle" fontSize={size * 0.1} fill="#6b7280">
        score
      </text>
    </svg>
  );
}
