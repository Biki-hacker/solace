/**
 * SparkPath — Streak visualization with filled/empty dots.
 * @param {object} props
 * @param {string} [props.className]
 * @param {number} props.streakDays - Current streak
 * @param {boolean[]} [props.lastSevenDays] - Array of 7 booleans (active/inactive)
 * @param {object} [props.style]
 */
export default function SparkPath({ className = '', streakDays = 0, lastSevenDays, style }) {
  const days = lastSevenDays || Array.from({ length: 7 }, (_, i) => i < streakDays);

  return (
    <svg
      viewBox="0 0 180 40"
      className={className}
      style={{ width: '180px', ...style }}
      role="img"
      aria-label={`${streakDays} day streak`}
    >
      {/* Connecting line */}
      <line
        x1="15"
        y1="20"
        x2="165"
        y2="20"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Active path overlay */}
      {days.filter(Boolean).length > 1 && (
        <line
          x1="15"
          y1="20"
          x2={15 + (days.lastIndexOf(true)) * 25}
          y2="20"
          stroke="var(--accent-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.4"
        />
      )}

      {/* Day dots */}
      {days.map((active, i) => (
        <g key={i}>
          <circle
            cx={15 + i * 25}
            cy="20"
            r={active ? 6 : 4}
            fill={active ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)'}
            stroke={active ? 'var(--accent-primary)' : 'transparent'}
            strokeWidth="1"
          />
          {active && (
            <circle
              cx={15 + i * 25}
              cy="20"
              r="10"
              fill="var(--accent-primary)"
              opacity="0.1"
            />
          )}
        </g>
      ))}
    </svg>
  );
}
