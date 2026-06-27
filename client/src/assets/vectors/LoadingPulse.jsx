/**
 * LoadingPulse — Branded loading animation (not a spinner).
 * Three pulsing dots with staggered animation.
 * @param {object} props
 * @param {string} [props.className]
 * @param {number} [props.size]
 * @param {object} [props.style]
 */
export default function LoadingPulse({ className = '', size = 48, style }) {
  return (
    <svg
      viewBox="0 0 60 20"
      width={size}
      height={size * (20 / 60)}
      className={className}
      style={style}
      role="img"
      aria-label="Loading"
    >
      <circle cx="10" cy="10" r="4" fill="var(--accent-primary)" opacity="0.8">
        <animate
          attributeName="opacity"
          values="0.8;0.3;0.8"
          dur="1.2s"
          begin="0s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="r"
          values="4;3;4"
          dur="1.2s"
          begin="0s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="30" cy="10" r="4" fill="var(--accent-primary)" opacity="0.8">
        <animate
          attributeName="opacity"
          values="0.8;0.3;0.8"
          dur="1.2s"
          begin="0.2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="r"
          values="4;3;4"
          dur="1.2s"
          begin="0.2s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="50" cy="10" r="4" fill="var(--accent-primary)" opacity="0.8">
        <animate
          attributeName="opacity"
          values="0.8;0.3;0.8"
          dur="1.2s"
          begin="0.4s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="r"
          values="4;3;4"
          dur="1.2s"
          begin="0.4s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
