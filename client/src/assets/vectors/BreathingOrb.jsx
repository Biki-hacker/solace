/**
 * BreathingOrb — Animated breathing circle for mindfulness exercises.
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} [props.phase] - "inhale" | "hold" | "exhale"
 * @param {number} [props.size]
 * @param {object} [props.style]
 */
export default function BreathingOrb({ className = '', phase = 'inhale', size = 200, style }) {
  const getScale = () => {
    switch (phase) {
      case 'inhale': return '1.3';
      case 'hold': return '1.3';
      case 'exhale': return '0.8';
      default: return '1';
    }
  };

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      style={style}
      role="img"
      aria-label={`Breathing exercise - ${phase}`}
    >
      <defs>
        <radialGradient id="breathGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.4" />
          <stop offset="60%" stopColor="var(--accent-primary)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="breathCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent-secondary)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.3" />
        </radialGradient>
      </defs>

      {/* Outer glow */}
      <circle
        cx="100"
        cy="100"
        r="80"
        fill="url(#breathGradient)"
        style={{
          transform: `scale(${getScale()})`,
          transformOrigin: '100px 100px',
          transition: `transform ${phase === 'inhale' ? '4s' : phase === 'hold' ? '0.3s' : '8s'} ease-in-out`,
        }}
      />

      {/* Middle ring */}
      <circle
        cx="100"
        cy="100"
        r="50"
        fill="none"
        stroke="var(--accent-primary)"
        strokeWidth="1"
        opacity="0.2"
        style={{
          transform: `scale(${getScale()})`,
          transformOrigin: '100px 100px',
          transition: `transform ${phase === 'inhale' ? '4s' : phase === 'hold' ? '0.3s' : '8s'} ease-in-out`,
        }}
      />

      {/* Core */}
      <circle
        cx="100"
        cy="100"
        r="30"
        fill="url(#breathCore)"
        style={{
          transform: `scale(${getScale()})`,
          transformOrigin: '100px 100px',
          transition: `transform ${phase === 'inhale' ? '4s' : phase === 'hold' ? '0.3s' : '8s'} ease-in-out`,
        }}
      />

      {/* Pulse ring for hold phase */}
      {phase === 'hold' && (
        <circle
          cx="100"
          cy="100"
          r="45"
          fill="none"
          stroke="var(--accent-primary)"
          strokeWidth="2"
          opacity="0.3"
        >
          <animate attributeName="r" values="40;55;40" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  );
}
