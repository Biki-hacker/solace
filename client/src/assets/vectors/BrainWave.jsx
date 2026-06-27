/**
 * BrainWave — Flowing wave SVG for AI companion header.
 * @param {object} props
 * @param {string} [props.className]
 * @param {object} [props.style]
 */
export default function BrainWave({ className = '', style }) {
  return (
    <svg
      viewBox="0 0 400 120"
      className={`w-full ${className}`}
      style={style}
      preserveAspectRatio="none"
      role="img"
      aria-label="Decorative brain wave"
    >
      <defs>
        <linearGradient id="waveGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.5" />
          <stop offset="50%" stopColor="var(--accent-secondary)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* Wave 1 */}
      <path
        d="M0 60 Q50 20 100 60 Q150 100 200 60 Q250 20 300 60 Q350 100 400 60"
        fill="none"
        stroke="url(#waveGradient)"
        strokeWidth="2"
        opacity="0.6"
      >
        <animate
          attributeName="d"
          values="M0 60 Q50 20 100 60 Q150 100 200 60 Q250 20 300 60 Q350 100 400 60;M0 60 Q50 100 100 60 Q150 20 200 60 Q250 100 300 60 Q350 20 400 60;M0 60 Q50 20 100 60 Q150 100 200 60 Q250 20 300 60 Q350 100 400 60"
          dur="6s"
          repeatCount="indefinite"
        />
      </path>

      {/* Wave 2 */}
      <path
        d="M0 60 Q50 40 100 60 Q150 80 200 60 Q250 40 300 60 Q350 80 400 60"
        fill="none"
        stroke="var(--accent-primary)"
        strokeWidth="1.5"
        opacity="0.3"
      >
        <animate
          attributeName="d"
          values="M0 60 Q50 40 100 60 Q150 80 200 60 Q250 40 300 60 Q350 80 400 60;M0 60 Q50 80 100 60 Q150 40 200 60 Q250 80 300 60 Q350 40 400 60;M0 60 Q50 40 100 60 Q150 80 200 60 Q250 40 300 60 Q350 80 400 60"
          dur="8s"
          repeatCount="indefinite"
        />
      </path>

      {/* Wave 3 - subtle */}
      <path
        d="M0 60 Q100 30 200 60 Q300 90 400 60"
        fill="none"
        stroke="var(--accent-secondary)"
        strokeWidth="1"
        opacity="0.2"
      >
        <animate
          attributeName="d"
          values="M0 60 Q100 30 200 60 Q300 90 400 60;M0 60 Q100 90 200 60 Q300 30 400 60;M0 60 Q100 30 200 60 Q300 90 400 60"
          dur="10s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}
