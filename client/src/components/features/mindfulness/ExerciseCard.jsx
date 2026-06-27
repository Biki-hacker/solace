/**
 * ExerciseCard — Mindfulness exercise card with thumbnail and description.
 * @param {object} props
 * @param {string} props.title
 * @param {string} props.description
 * @param {React.ReactNode} props.icon
 * @param {boolean} [props.recommended]
 * @param {Function} props.onClick
 * @param {string} [props.className]
 */
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';

export default function ExerciseCard({
  title,
  description,
  icon,
  recommended = false,
  onClick,
  className = '',
}) {
  return (
    <Card
      className={`cursor-pointer hover:scale-[1.015] transition-transform ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-lavender-500/10 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-pearl">{title}</h3>
            {recommended && <Badge variant="sage">Recommended for you</Badge>}
          </div>
          <p className="text-xs text-pearl/50 leading-relaxed">{description}</p>
        </div>
      </div>
    </Card>
  );
}
