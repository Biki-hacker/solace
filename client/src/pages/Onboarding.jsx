/**
 * Onboarding Page — Three-step wizard (exam type, target year, challenges).
 */
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import ExamBadges from '../assets/vectors/ExamBadges';
import WellnessRing from '../assets/vectors/WellnessRing';
import { EXAM_TYPES, CHALLENGES, ROUTES } from '../utils/constants';
import { updateUser } from '../services/firestore.service';
import { Minus, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [examType, setExamType] = useState('');
  const [targetYear, setTargetYear] = useState(new Date().getFullYear() + 1);
  const [selectedChallenges, setSelectedChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const stepRef = useRef(null);

  useEffect(() => {
    if (!stepRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(stepRef.current, {
        y: 32,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out',
      });
    });
    return () => ctx.revert();
  }, [step]);

  const toggleChallenge = (challenge) => {
    setSelectedChallenges((prev) => {
      if (prev.includes(challenge)) return prev.filter((c) => c !== challenge);
      if (prev.length >= 3) return prev;
      return [...prev, challenge];
    });
  };

  const monthsAway = () => {
    const now = new Date();
    const target = new Date(targetYear, 5, 1);
    const diff = Math.round((target - now) / (1000 * 60 * 60 * 24 * 30));
    return Math.max(0, diff);
  };

  const handleComplete = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await updateUser(user.uid, {
        examType,
        targetYear,
        challenges: selectedChallenges,
        onboardingComplete: true,
        streakDays: 0,
      });
      setShowComplete(true);
      setTimeout(async () => {
        await refreshProfile();
        navigate(ROUTES.DASHBOARD);
      }, 2000);
    } catch (err) {
      toast.error('Failed to save preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showComplete) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center px-4">
        <div className="text-center">
          <WellnessRing score={100} size={140} color="#8EBD9B" />
          <h2 className="text-xl font-bold text-pearl mt-6 mb-2">You are all set</h2>
          <p className="text-sm text-pearl/50">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                s === step
                  ? 'bg-lavender-500 scale-125'
                  : s < step
                  ? 'bg-lavender-500/50'
                  : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        <div ref={stepRef}>
          {/* Step 1 — Choose Exam */}
          {step === 1 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-pearl mb-2">Choose Your Exam</h2>
              <p className="text-sm text-pearl/50 mb-8">What are you preparing for?</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {EXAM_TYPES.map(({ value, label, description }) => (
                  <button
                    key={value}
                    onClick={() => setExamType(value)}
                    className={`glass-card p-4 flex flex-col items-center gap-2 transition-all duration-200 ${
                      examType === value
                        ? 'ring-2 ring-lavender-500 bg-lavender-500/10'
                        : 'hover:bg-white/[0.06]'
                    }`}
                  >
                    <ExamBadges examType={value} size={40} />
                    <span className="text-sm font-medium text-pearl">{label}</span>
                    <span className="text-[10px] text-pearl/40">{description}</span>
                  </button>
                ))}
              </div>
              <Button
                onClick={() => setStep(2)}
                disabled={!examType}
                fullWidth
                size="lg"
                className="mt-8"
              >
                Continue
              </Button>
            </div>
          )}

          {/* Step 2 — Target Year */}
          {step === 2 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-pearl mb-2">Set Your Target</h2>
              <p className="text-sm text-pearl/50 mb-8">When are you appearing?</p>
              <div className="flex items-center justify-center gap-6 mb-4">
                <button
                  onClick={() => setTargetYear((y) => Math.max(new Date().getFullYear(), y - 1))}
                  className="p-3 rounded-xl glass-card hover:bg-white/[0.07] transition-colors"
                  aria-label="Decrease year"
                >
                  <Minus size={24} className="text-pearl/60" />
                </button>
                <span className="text-6xl font-bold text-pearl tabular-nums">{targetYear}</span>
                <button
                  onClick={() => setTargetYear((y) => Math.min(new Date().getFullYear() + 5, y + 1))}
                  className="p-3 rounded-xl glass-card hover:bg-white/[0.07] transition-colors"
                  aria-label="Increase year"
                >
                  <Plus size={24} className="text-pearl/60" />
                </button>
              </div>
              <p className="text-xs text-pearl/30 mb-8">
                Approximately {monthsAway()} months away
              </p>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={() => setStep(3)} fullWidth className="flex-1" size="lg">
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3 — Challenges */}
          {step === 3 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-pearl mb-2">What challenges you?</h2>
              <p className="text-sm text-pearl/50 mb-2">Select up to 3</p>
              <p className="text-xs text-pearl/30 mb-8">
                Solace uses this to personalize your experience from day one.
              </p>
              <div className="flex flex-wrap gap-2 justify-center mb-8">
                {CHALLENGES.map((challenge) => (
                  <button
                    key={challenge}
                    onClick={() => toggleChallenge(challenge)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                      selectedChallenges.includes(challenge)
                        ? 'bg-lavender-500/20 border-lavender-500/40 text-lavender-300'
                        : 'bg-white/[0.04] border-white/[0.08] text-pearl/60 hover:bg-white/[0.07]'
                    }`}
                  >
                    {challenge}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={selectedChallenges.length === 0}
                  loading={loading}
                  fullWidth
                  className="flex-1"
                  size="lg"
                >
                  Complete Setup
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
