/**
 * BreathingModal — Full-screen breathing exercise overlay.
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {'4-7-8'|'box'} props.type
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import Modal from '../../ui/Modal';
import BreathingOrb from '../../../assets/vectors/BreathingOrb';
import Button from '../../ui/Button';

const BREATHING_PATTERNS = {
  '4-7-8': {
    phases: [
      { name: 'Breathe in', duration: 4 },
      { name: 'Hold', duration: 7 },
      { name: 'Breathe out', duration: 8 },
    ],
    totalCycles: 4,
  },
  box: {
    phases: [
      { name: 'Breathe in', duration: 4 },
      { name: 'Hold', duration: 4 },
      { name: 'Breathe out', duration: 4 },
      { name: 'Hold', duration: 4 },
    ],
    totalCycles: 4,
  },
};

export default function BreathingModal({ isOpen, onClose, type = '4-7-8' }) {
  const [started, setStarted] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [cycle, setCycle] = useState(1);
  const [completed, setCompleted] = useState(false);
  const timerRef = useRef(null);

  const pattern = BREATHING_PATTERNS[type];
  const currentPhase = pattern.phases[phaseIndex];

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStarted(false);
    setPhaseIndex(0);
    setCountdown(0);
    setCycle(1);
    setCompleted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  useEffect(() => {
    if (!started || completed) return;

    setCountdown(currentPhase.duration);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          const nextPhase = phaseIndex + 1;

          if (nextPhase >= pattern.phases.length) {
            if (cycle >= pattern.totalCycles) {
              setCompleted(true);
              return 0;
            }
            setCycle((c) => c + 1);
            setPhaseIndex(0);
          } else {
            setPhaseIndex(nextPhase);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, phaseIndex, cycle, completed]);

  const getPhaseType = () => {
    const name = currentPhase?.name?.toLowerCase() || '';
    if (name.includes('in')) return 'inhale';
    if (name.includes('out')) return 'exhale';
    return 'hold';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} fullScreen>
      <div className="flex flex-col items-center justify-center h-full min-h-screen bg-navy-950">
        {completed ? (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-sage-400/20 flex items-center justify-center mx-auto">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#8EBD9B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-pearl mb-2">Well done</h3>
              <p className="text-sm text-pearl/50">
                You completed {pattern.totalCycles} cycles of {type === '4-7-8' ? '4-7-8' : 'box'} breathing.
              </p>
            </div>
            <Button onClick={onClose}>Close</Button>
          </div>
        ) : !started ? (
          <div className="text-center space-y-6">
            <BreathingOrb size={160} phase="hold" />
            <div>
              <h3 className="text-xl font-bold text-pearl mb-2">
                {type === '4-7-8' ? '4-7-8 Breathing' : 'Box Breathing'}
              </h3>
              <p className="text-sm text-pearl/50 max-w-xs mx-auto">
                {type === '4-7-8'
                  ? 'Inhale for 4 seconds, hold for 7, exhale for 8. Calms your nervous system.'
                  : 'Equal 4-second phases of breathing in, holding, breathing out, and holding. Used for focus under pressure.'}
              </p>
            </div>
            <Button onClick={() => setStarted(true)} size="lg">
              Begin
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-8">
            <BreathingOrb size={240} phase={getPhaseType()} />

            <div>
              <p className="text-2xl font-bold text-pearl mb-2">
                {currentPhase.name}...
              </p>
              <p className="text-5xl font-bold text-pearl font-mono tabular-nums">
                {countdown}
              </p>
            </div>

            <p className="text-xs text-pearl/30">
              Cycle {cycle} of {pattern.totalCycles}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
