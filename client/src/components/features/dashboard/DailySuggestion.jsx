/**
 * DailySuggestion — Fetches and displays AI-generated daily wellness tip.
 * @param {object} props
 * @param {string} [props.className]
 */
import { useState, useCallback, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';
import Skeleton from '../../ui/Skeleton';
import { useAuth } from '../../../hooks/useAuth';
import api from '../../../services/api.service';

export default function DailySuggestion({ recentMoods = [], recentTriggers = [], className = '' }) {
  const { profile } = useAuth();
  const [suggestion, setSuggestion] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSuggestion = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/ai/daily-suggestion', {
        examType: profile?.examType || 'OTHER',
        recentMoods,
        recentTriggers,
      });
      setSuggestion(response.suggestion);
      setCategory(response.category);
    } catch (err) {
      setSuggestion('Take a moment to breathe deeply. Step away from your desk, stretch, and remind yourself that progress is not always linear.');
      setCategory('mindset');
    } finally {
      setLoading(false);
    }
  }, [profile?.examType, recentMoods, recentTriggers]);

  useEffect(() => {
    fetchSuggestion();
  }, []);

  const categoryVariant = {
    breathing: 'sage',
    journaling: 'lavender',
    movement: 'amber',
    mindset: 'lavender',
    sleep: 'sage',
    social: 'sage',
  };

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-pearl/50">Daily Suggestion</p>
        <button
          onClick={fetchSuggestion}
          disabled={loading}
          className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors disabled:opacity-30"
          aria-label="Refresh suggestion"
        >
          <RefreshCw size={14} className={`text-pearl/40 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="80%" />
        </div>
      ) : (
        <>
          {category && (
            <Badge variant={categoryVariant[category] || 'neutral'} className="mb-2">
              {category}
            </Badge>
          )}
          <p className="text-sm text-pearl/80 leading-relaxed">{suggestion}</p>
        </>
      )}
    </Card>
  );
}
