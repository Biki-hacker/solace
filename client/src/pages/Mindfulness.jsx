/**
 * Mindfulness Page — Six exercise cards with breathing modal.
 */
import { useState } from 'react';
import AppShell from '../components/layout/AppShell';
import PageWrapper from '../components/layout/PageWrapper';
import ExerciseCard from '../components/features/mindfulness/ExerciseCard';
import BreathingModal from '../components/features/mindfulness/BreathingModal';
import BreathingOrb from '../assets/vectors/BreathingOrb';

const exercises = [
  {
    id: '4-7-8',
    title: '4-7-8 Breathing',
    description: 'Calm your nervous system instantly',
    breathingType: '4-7-8',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="8" opacity="0.3" />
        <circle cx="12" cy="12" r="5" opacity="0.5">
          <animate attributeName="r" values="5;8;5" dur="3s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
  },
  {
    id: 'box',
    title: 'Box Breathing',
    description: 'Used by Navy SEALs for focus under pressure',
    breathingType: 'box',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="5" width="14" height="14" rx="2" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'grounding',
    title: '5-4-3-2-1 Grounding',
    description: 'Anchor yourself when anxiety spikes',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="var(--accent-primary)" opacity="0.5">
        <circle cx="6" cy="6" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" />
      </svg>
    ),
  },
  {
    id: 'pmr',
    title: 'Progressive Muscle Relaxation',
    description: 'Release physical tension in 10 minutes',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round">
        <path d="M3 12 Q8 6 12 12 Q16 18 21 12" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'visualization',
    title: 'Visualization',
    description: 'Mentally rehearse your exam success',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round">
        <line x1="2" y1="16" x2="22" y2="16" opacity="0.3" />
        <path d="M4 16 Q8 8 12 12 Q16 6 20 16" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'gratitude',
    title: 'Gratitude Reflection',
    description: 'Shift focus from fear to appreciation',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="var(--accent-secondary)" opacity="0.5">
        <polygon points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9" />
      </svg>
    ),
  },
];

export default function Mindfulness() {
  const [breathingOpen, setBreathingOpen] = useState(false);
  const [breathingType, setBreathingType] = useState('4-7-8');

  const handleExerciseClick = (exercise) => {
    if (exercise.breathingType) {
      setBreathingType(exercise.breathingType);
      setBreathingOpen(true);
    }
  };

  return (
    <AppShell>
      <PageWrapper title="Mindfulness">
        <p className="text-sm text-pearl/50 mb-8">
          Quick exercises to calm your mind between study sessions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              title={exercise.title}
              description={exercise.description}
              icon={exercise.icon}
              onClick={() => handleExerciseClick(exercise)}
            />
          ))}
        </div>

        <BreathingModal
          isOpen={breathingOpen}
          onClose={() => setBreathingOpen(false)}
          type={breathingType}
        />
      </PageWrapper>
    </AppShell>
  );
}
