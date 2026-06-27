/**
 * MoodRadial — Large circular mood selector.
 * 5 MoodOrbs positioned around a circle at 72-degree intervals.
 * @param {object} props
 * @param {number|null} props.selected
 * @param {Function} props.onSelect
 * @param {string} [props.className]
 */
import MoodOrbs from '../../../assets/vectors/MoodOrbs';
import { MOOD_LABELS, MOOD_COLORS } from '../../../utils/constants';

export default function MoodRadial({ selected, onSelect, className = '' }) {
  const moodScores = [1, 2, 3, 4, 5];
  const radius = 130;
  const center = 160;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="relative" style={{ width: `${center * 2}px`, height: `${center * 2}px` }}>
        {/* Background circle */}
        <svg
          viewBox={`0 0 ${center * 2} ${center * 2}`}
          className="absolute inset-0 w-full h-full"
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />
        </svg>

        {/* Mood orbs positioned around the circle */}
        {moodScores.map((score, i) => {
          const angle = (i * 72 - 90) * (Math.PI / 180);
          const x = center + radius * Math.cos(angle) - 28;
          const y = center + radius * Math.sin(angle) - 28;

          return (
            <div
              key={score}
              className="absolute transition-all duration-300"
              style={{ left: `${x}px`, top: `${y}px` }}
            >
              <MoodOrbs
                score={score}
                size={56}
                active={selected === score}
                onClick={() => onSelect(score)}
              />
              <p
                className={`text-[10px] text-center mt-1 transition-colors ${
                  selected === score ? 'text-pearl/80' : 'text-pearl/30'
                }`}
              >
                {MOOD_LABELS[score]}
              </p>
            </div>
          );
        })}

        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {selected ? (
              <>
                <p
                  className="text-2xl font-bold"
                  style={{ color: MOOD_COLORS[selected] }}
                >
                  {MOOD_LABELS[selected]}
                </p>
                <p className="text-xs text-pearl/40 mt-1">
                  Tap to change
                </p>
              </>
            ) : (
              <p className="text-sm text-pearl/40">
                How are you feeling?
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
