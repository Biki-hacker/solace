/**
 * MoodOrbs — 5 animated mood state SVGs.
 * Each orb represents a mood score (1-5) with unique visual treatment.
 * @param {object} props
 * @param {string} [props.className]
 * @param {number} [props.score] - If provided, renders only that mood
 * @param {number} [props.size] - Size in px
 * @param {boolean} [props.active] - Whether the orb is selected
 * @param {Function} [props.onClick]
 */
import { MOOD_COLORS } from '../../utils/constants';

const orbPaths = {
  1: ( /* Overwhelmed — fragmented circle */
    <>
      <circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8 4" opacity="0.6" />
      <circle cx="24" cy="24" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.4" />
      <circle cx="24" cy="24" r="4" fill="currentColor" opacity="0.5" />
    </>
  ),
  2: ( /* Tense — compressed zigzag */
    <>
      <circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <polyline points="12,24 16,18 20,30 24,14 28,32 32,20 36,24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.4" />
    </>
  ),
  3: ( /* Neutral — horizontal line */
    <>
      <circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <line x1="12" y1="24" x2="36" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.4" />
    </>
  ),
  4: ( /* Content — gentle arc */
    <>
      <circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <path d="M14 28 Q24 16 34 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.4" />
    </>
  ),
  5: ( /* Serene — flowing wave */
    <>
      <circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <path d="M10 24 Q17 18 24 24 Q31 30 38 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7">
        <animate attributeName="d" values="M10 24 Q17 18 24 24 Q31 30 38 24;M10 24 Q17 30 24 24 Q31 18 38 24;M10 24 Q17 18 24 24 Q31 30 38 24" dur="3s" repeatCount="indefinite" />
      </path>
      <circle cx="24" cy="24" r="4" fill="currentColor" opacity="0.5" />
    </>
  ),
};

export default function MoodOrbs({ className = '', score, size = 48, active = false, onClick, style }) {
  const color = score ? MOOD_COLORS[score] : 'currentColor';

  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={`transition-all duration-200 ${active ? 'scale-110' : 'hover:scale-105'} ${className}`}
      style={{ color, cursor: onClick ? 'pointer' : 'default', ...style }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? `Mood score ${score}` : undefined}
    >
      {active && (
        <circle cx="24" cy="24" r="22" fill="currentColor" opacity="0.12" />
      )}
      {score && orbPaths[score]}
    </svg>
  );
}
