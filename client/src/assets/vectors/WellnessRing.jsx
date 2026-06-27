/**
 * WellnessRing — Circular SVG progress indicator.
 * Animates from 0 to the given score value.
 * @param {object} props
 * @param {string} [props.className]
 * @param {number} props.score - 0 to 100
 * @param {number} [props.size] - Size in px
 * @param {string} [props.color] - Stroke color
 * @param {object} [props.style]
 */
import { useEffect, useRef } from 'react';
import { getWellnessColor } from '../../utils/moodUtils';

export default function WellnessRing({ className = '', score = 0, size = 120, color, style }) {
  const circleRef = useRef(null);
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeColor = color || getWellnessColor(score);

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;

    const offset = circumference - (score / 100) * circumference;
    circle.style.transition = 'none';
    circle.setAttribute('stroke-dashoffset', String(circumference));

    requestAnimationFrame(() => {
      circle.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
      circle.setAttribute('stroke-dashoffset', String(offset));
    });
  }, [score, circumference]);

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      style={style}
      role="img"
      aria-label={`Wellness score: ${score} out of 100`}
    >
      {/* Background ring */}
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="8"
      />
      {/* Progress ring */}
      <circle
        ref={circleRef}
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke={strokeColor}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference}
        transform="rotate(-90 50 50)"
        style={{ filter: `drop-shadow(0 0 6px ${strokeColor}40)` }}
      />
      {/* Score text */}
      <text
        x="50"
        y="46"
        textAnchor="middle"
        fill="var(--text-primary)"
        fontSize="22"
        fontWeight="700"
        fontFamily="Inter, sans-serif"
      >
        {score}
      </text>
      <text
        x="50"
        y="62"
        textAnchor="middle"
        fill="var(--text-muted)"
        fontSize="10"
        fontFamily="Inter, sans-serif"
      >
        / 100
      </text>
    </svg>
  );
}
