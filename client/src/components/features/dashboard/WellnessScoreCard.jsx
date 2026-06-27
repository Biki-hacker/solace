/**
 * WellnessScoreCard — Shows current week's average wellness score.
 * @param {object} props
 * @param {number} props.score - 0 to 100
 * @param {string} [props.className]
 */
import Card from '../../ui/Card';
import WellnessRing from '../../../assets/vectors/WellnessRing';

export default function WellnessScoreCard({ score = 0, className = '' }) {
  return (
    <Card className={`flex items-center gap-4 ${className}`}>
      <WellnessRing score={score} size={90} />
      <div>
        <p className="text-xs text-pearl/50 mb-1">This Week's Wellness</p>
        <p className="text-2xl font-bold text-pearl">{score}</p>
        <p className="text-[10px] text-pearl/30 mt-0.5">out of 100</p>
      </div>
    </Card>
  );
}
