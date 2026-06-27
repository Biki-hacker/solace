/**
 * StreakCard — Shows current streak with SparkPath visualization.
 * @param {object} props
 * @param {number} props.streakDays
 * @param {string} [props.className]
 */
import Card from '../../ui/Card';
import SparkPath from '../../../assets/vectors/SparkPath';
import { getStreakMotivation } from '../../../utils/moodUtils';

export default function StreakCard({ streakDays = 0, className = '' }) {
  return (
    <Card className={className}>
      <p className="text-xs text-pearl/50 mb-2">Current Streak</p>
      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-3xl font-bold text-amber-wellness">{streakDays}</span>
        <span className="text-sm text-pearl/40">
          {streakDays === 1 ? 'day' : 'days'}
        </span>
      </div>
      <SparkPath streakDays={Math.min(streakDays, 7)} />
      <p className="text-xs text-pearl/40 mt-3">
        {getStreakMotivation(streakDays)}
      </p>
    </Card>
  );
}
