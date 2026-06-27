/**
 * Landing Page — Hero, features, social proof, and footer.
 * GSAP ScrollTrigger for feature card animations.
 */
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import BrainWave from '../assets/vectors/BrainWave';
import BreathingOrb from '../assets/vectors/BreathingOrb';
import JournalEmpty from '../assets/vectors/JournalEmpty';
import { signInWithGoogle } from '../services/auth.service';
import { ROUTES, DEMO_CREDENTIALS } from '../utils/constants';
import { signInWithEmail } from '../services/auth.service';
import toast from 'react-hot-toast';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: 'Journal & Reflect',
    description: 'Write freely about your day and let AI uncover stress patterns, emotional tones, and personalized coping strategies tailored to your exam.',
    Icon: JournalEmpty,
  },
  {
    title: 'AI Companion',
    description: 'A warm, perceptive chat companion that understands the unique pressures of Indian competitive exam culture — available 24/7.',
    Icon: BrainWave,
  },
  {
    title: 'Mindful Breaks',
    description: 'Guided breathing exercises and grounding techniques designed to calm your nervous system in under 5 minutes between study sessions.',
    Icon: BreathingOrb,
  },
];

const testimonials = [
  '"First time I felt heard during JEE prep." — Aryan, JEE 2024',
  '"Solace helped me manage my anxiety before NEET." — Priya, NEET 2025',
  '"The breathing exercises are a lifesaver during study breaks." — Rohan, GATE 2024',
  '"Finally, something that understands UPSC pressure." — Meera, UPSC 2025',
];

export default function Landing() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-content > *', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
      });

      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
        },
        y: 32,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
      });
    });
    return () => ctx.revert();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      toast.error('Google sign-in failed. Please try again.');
    }
  };

  const handleDemoSignIn = async () => {
    try {
      await signInWithEmail(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        try {
          // Auto-create demo user if it doesn't exist yet
          const { signUpWithEmail } = await import('../services/auth.service');
          await signUpWithEmail(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password, 'Demo User');
          navigate(ROUTES.DASHBOARD);
        } catch (signupErr) {
          toast.error('Demo sign-in failed. Please try the auth page.');
        }
      } else {
        toast.error('Demo sign-in failed. Please try the auth page.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-navy-900">
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 pt-16 overflow-hidden">
        {/* Decorative gradient orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-lavender-500/[0.08] blur-[120px] animate-rotate-slow pointer-events-none" />

        <div className="hero-content relative z-10 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-pearl leading-tight tracking-tight mb-6" style={{ letterSpacing: '-0.025em' }}>
            Your mind matters more than your marks.
          </h1>
          <p className="text-lg sm:text-xl text-pearl/60 max-w-2xl mx-auto mb-8 leading-relaxed">
            AI-powered mental wellness support designed specifically for students preparing for
            NEET, JEE, CUET, CAT, GATE, and UPSC. Because your well-being should never take a back seat.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" onClick={handleGoogleSignIn} className="rounded-full px-8">
              Begin with Google
            </Button>
            <Button size="lg" variant="secondary" onClick={handleDemoSignIn} className="rounded-full px-8">
              Try Demo
            </Button>
          </div>

          <div className="mt-16 animate-float">
            <BrainWave className="max-w-lg mx-auto opacity-50" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-pearl text-center mb-12 tracking-tight">
            Built for the journey, not just the destination
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map(({ title, description, Icon }) => (
              <div
                key={title}
                className="feature-card glass-card p-6 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                  <Icon className="opacity-60" style={{ width: '64px', height: '48px' }} />
                </div>
                <h3 className="text-base font-semibold text-pearl mb-2">{title}</h3>
                <p className="text-sm text-pearl/50 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 overflow-hidden border-y border-white/[0.04]">
        <div className="animate-marquee flex gap-12 whitespace-nowrap">
          {[...testimonials, ...testimonials].map((text, i) => (
            <span key={i} className="text-sm text-pearl/30 italic flex-shrink-0">
              {text}
            </span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gradient">Solace</span>
            <span className="text-xs text-pearl/30">Your AI companion through exam pressure</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-pearl/20">
            <span>Built with Gemini API</span>
            <span>Privacy-first design</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
