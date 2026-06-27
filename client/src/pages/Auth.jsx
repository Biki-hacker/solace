/**
 * Auth Page — Sign In / Sign Up with demo banner and Google auth.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/features/auth/AuthForm';
import GoogleButton from '../components/features/auth/GoogleButton';
import DemoBanner from '../components/features/auth/DemoBanner';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  getAuthErrorMessage,
} from '../services/auth.service';
import { getOrCreateUser } from '../services/firestore.service';
import { ROUTES, DEMO_CREDENTIALS } from '../utils/constants';
import toast from 'react-hot-toast';

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('signin');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const redirectAfterAuth = async (user) => {
    try {
      const profile = await getOrCreateUser(user.uid, {
        displayName: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || null,
      });
      if (!profile.onboardingComplete) {
        navigate(ROUTES.ONBOARDING);
      } else {
        navigate(ROUTES.DASHBOARD);
      }
    } catch {
      navigate(ROUTES.DASHBOARD);
    }
  };

  const handleSubmit = async (form) => {
    setErrors({});
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!form.name.trim()) {
          setErrors({ name: 'Name is required' });
          setLoading(false);
          return;
        }
        if (form.password !== form.confirmPassword) {
          setErrors({ confirmPassword: 'Passwords do not match' });
          setLoading(false);
          return;
        }
        const credential = await signUpWithEmail(form.email, form.password, form.name);
        await redirectAfterAuth(credential.user);
      } else {
        const credential = await signInWithEmail(form.email, form.password);
        await redirectAfterAuth(credential.user);
      }
    } catch (err) {
      const msg = getAuthErrorMessage(err.code);
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const credential = await signInWithGoogle();
      await redirectAfterAuth(credential.user);
    } catch (err) {
      toast.error('Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setLoading(true);
    setErrors({});
    try {
      const credential = await signInWithEmail(
        DEMO_CREDENTIALS.email,
        DEMO_CREDENTIALS.password
      );
      await redirectAfterAuth(credential.user);
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        try {
          const { signUpWithEmail } = await import('../services/auth.service');
          const credential = await signUpWithEmail(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password, 'Demo User');
          await redirectAfterAuth(credential.user);
        } catch (signupErr) {
          setErrors({ general: 'Demo sign-in failed. The demo account could not be created automatically.' });
        }
      } else {
        setErrors({ general: 'Demo sign-in failed. The demo account may not be set up yet.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center px-4 py-12">
      {/* Decorative gradient */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-lavender-500/[0.05] blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gradient mb-2">Solace</h1>
          <p className="text-sm text-pearl/50">Your AI companion through exam pressure</p>
        </div>

        {/* Demo Banner */}
        <DemoBanner onFillAndSignIn={handleDemoSignIn} />

        {/* Auth Form */}
        <div className="glass-card p-6">
          <AuthForm
            mode={mode}
            onModeChange={setMode}
            onSubmit={handleSubmit}
            loading={loading}
            errors={errors}
          />

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-xs text-pearl/30">or</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <GoogleButton onClick={handleGoogleSignIn} loading={googleLoading} />
        </div>
      </div>
    </div>
  );
}
