/**
 * InsightCard — Shows recent AI journal insight.
 * @param {object} props
 * @param {string} props.insight - Suggested action text
 * @param {string} props.date - Journal date (YYYY-MM-DD)
 * @param {string} [props.className]
 */
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import Card from '../../ui/Card';
import { ROUTES } from '../../../utils/constants';

export default function InsightCard({ insight, date, className = '' }) {
  if (!insight) return null;

  return (
    <Card className={className}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-lavender-500/10 flex-shrink-0">
          <Sparkles size={16} className="text-lavender-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-pearl/50 mb-1">Recent Insight</p>
          <p className="text-sm text-pearl/80 leading-relaxed">{insight}</p>
          <Link
            to={ROUTES.JOURNAL}
            className="inline-flex items-center gap-1 text-xs text-lavender-400 hover:text-lavender-300 mt-2 transition-colors"
          >
            View full analysis
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </Card>
  );
}
