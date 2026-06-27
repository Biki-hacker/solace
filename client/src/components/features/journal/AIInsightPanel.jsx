/**
 * AIInsightPanel — Displays AI analysis results for a journal entry.
 * Slides in with animation after analysis completes.
 * @param {object} props
 * @param {object} props.analysis - AI analysis result
 * @param {string} [props.className]
 */
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';
import WellnessRing from '../../../assets/vectors/WellnessRing';
import TriggerTag from './TriggerTag';
import { wellnessToPercentage } from '../../../utils/moodUtils';
import { EMOTIONAL_TONES } from '../../../utils/constants';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function AIInsightPanel({ analysis, className = '' }) {
  const panelRef = useRef(null);
  const [expandedAction, setExpandedAction] = useState(null);

  useEffect(() => {
    if (!panelRef.current || !analysis) return;
    const ctx = gsap.context(() => {
      gsap.from(panelRef.current, {
        x: 40,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      });
    });
    return () => ctx.revert();
  }, [analysis]);

  if (!analysis) return null;

  const toneStyle = EMOTIONAL_TONES[analysis.emotionalTone] || EMOTIONAL_TONES.neutral;
  const wellnessPercent = wellnessToPercentage(analysis.wellnessScore);

  return (
    <div ref={panelRef} className={`space-y-4 ${className}`}>
      {/* Wellness Score */}
      <Card hoverable={false}>
        <div className="flex items-center gap-4">
          <WellnessRing score={wellnessPercent} size={80} />
          <div>
            <p className="text-sm text-pearl/50">Wellness Score</p>
            <p className="text-lg font-bold text-pearl">
              {analysis.wellnessScore} / 10
            </p>
          </div>
        </div>
      </Card>

      {/* Emotional Tone */}
      <Card hoverable={false}>
        <p className="text-xs text-pearl/50 mb-2">Emotional Tone</p>
        <Badge
          variant={
            ['hopeful', 'content'].includes(analysis.emotionalTone)
              ? 'sage'
              : ['anxious', 'tired'].includes(analysis.emotionalTone)
              ? 'amber'
              : ['overwhelmed', 'frustrated', 'sad'].includes(analysis.emotionalTone)
              ? 'rose'
              : 'lavender'
          }
        >
          {analysis.emotionalTone}
        </Badge>
      </Card>

      {/* Stress Triggers */}
      {analysis.stressTriggers?.length > 0 && (
        <Card hoverable={false}>
          <p className="text-xs text-pearl/50 mb-2">Stress Triggers</p>
          <div className="flex flex-wrap gap-2">
            {analysis.stressTriggers.map((trigger, i) => (
              <TriggerTag key={i} label={trigger} />
            ))}
          </div>
        </Card>
      )}

      {/* Key Themes */}
      {analysis.keyThemes?.length > 0 && (
        <Card hoverable={false}>
          <p className="text-xs text-pearl/50 mb-2">Key Themes</p>
          <div className="space-y-1">
            {analysis.keyThemes.map((theme, i) => (
              <p key={i} className="text-sm text-pearl/70 italic">
                {theme}
              </p>
            ))}
          </div>
        </Card>
      )}

      {/* Suggested Actions */}
      {analysis.suggestedActions?.length > 0 && (
        <Card hoverable={false}>
          <p className="text-xs text-pearl/50 mb-3">Suggested Actions</p>
          <div className="space-y-2">
            {analysis.suggestedActions.map((action, i) => (
              <button
                key={i}
                onClick={() => setExpandedAction(expandedAction === i ? null : i)}
                className="w-full text-left flex items-start gap-2 p-2 rounded-lg hover:bg-white/[0.04] transition-colors"
              >
                <span className="text-xs font-mono text-lavender-400 mt-0.5 flex-shrink-0">
                  {i + 1}.
                </span>
                <span className="text-sm text-pearl/80 flex-1">{action}</span>
                {expandedAction === i ? (
                  <ChevronUp size={14} className="text-pearl/30 flex-shrink-0 mt-0.5" />
                ) : (
                  <ChevronDown size={14} className="text-pearl/30 flex-shrink-0 mt-0.5" />
                )}
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
