/**
 * MoodMiniPicker — Compact horizontal mood selector for dashboard/journal.
 * @param {object} props
 * @param {number|null} props.selected
 * @param {Function} props.onSelect
 * @param {boolean} [props.disabled]
 * @param {string} [props.className]
 */
import MoodOrbs from '../../../assets/vectors/MoodOrbs';
import { MOOD_LABELS } from '../../../utils/constants';

export default function MoodMiniPicker({ selected, onSelect, disabled = false, className = '' }) {
  const scores = [1, 2, 3, 4, 5];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {scores.map((score) => (
        <button
          key={score}
          onClick={() => !disabled && onSelect(score)}
          disabled={disabled}
          className={`flex flex-col items-center gap-1 transition-all duration-200 ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          aria-label={`Mood: ${MOOD_LABELS[score]}`}
        >
          <MoodOrbs
            score={score}
            size={40}
            active={selected === score}
          />
          <span
            className={`text-[10px] ${
              selected === score ? 'text-pearl/80 font-medium' : 'text-pearl/30'
            }`}
          >
            {MOOD_LABELS[score]}
          </span>
        </button>
      ))}
    </div>
  );
}
