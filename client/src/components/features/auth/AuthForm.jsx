/**
 * AuthForm — Sign In / Sign Up form with tab switching.
 * @param {object} props
 * @param {'signin'|'signup'} props.mode
 * @param {Function} props.onModeChange
 * @param {Function} props.onSubmit
 * @param {boolean} props.loading
 * @param {object} props.errors
 */
import { useState } from 'react';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import { Mail, Lock, User } from 'lucide-react';

export default function AuthForm({ mode, onModeChange, onSubmit, loading, errors = {} }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Tab indicator */}
      <div className="flex bg-white/[0.04] rounded-xl p-1 mb-6">
        <button
          onClick={() => onModeChange('signin')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            mode === 'signin'
              ? 'bg-lavender-500 text-white'
              : 'text-pearl/50 hover:text-pearl/70'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => onModeChange('signup')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            mode === 'signup'
              ? 'bg-lavender-500 text-white'
              : 'text-pearl/50 hover:text-pearl/70'
          }`}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <Input
            label="Full Name"
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange('name')}
            error={errors.name}
            icon={<User size={16} />}
            required
          />
        )}
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange('email')}
          error={errors.email}
          icon={<Mail size={16} />}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange('password')}
          error={errors.password}
          icon={<Lock size={16} />}
          required
        />
        {mode === 'signup' && (
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={form.confirmPassword}
            onChange={handleChange('confirmPassword')}
            error={errors.confirmPassword}
            icon={<Lock size={16} />}
            required
          />
        )}
        {errors.general && (
          <p className="text-xs text-rose-mood text-center" role="alert">
            {errors.general}
          </p>
        )}
        <Button type="submit" fullWidth loading={loading} size="lg">
          {mode === 'signin' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>
    </div>
  );
}
