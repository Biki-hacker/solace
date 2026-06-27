/**
 * ExerciseTimer — Countdown timer for exercises.
 * @param {object} props
 * @param {number} props.duration - Duration in seconds
 * @param {boolean} props.running
 * @param {number} props.elapsed - Elapsed time in seconds
 * @param {string} [props.className]
 */
export default function ExerciseTimer({ duration, running, elapsed, className = '' }) {
  const remaining = Math.max(0, duration - elapsed);
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <div className={`text-center ${className}`}>
      <p className="text-4xl font-bold text-pearl font-mono tabular-nums">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </p>
    </div>
  );
}
