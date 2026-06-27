/**
 * DemoBanner — Persistent demo credentials banner on the auth page.
 * @param {object} props
 * @param {Function} props.onFillAndSignIn
 */
import { KeyRound } from 'lucide-react';
import { DEMO_CREDENTIALS } from '../../../utils/constants';

export default function DemoBanner({ onFillAndSignIn }) {
  return (
    <div className="glass-card p-4 mb-6 flex items-center gap-3 flex-wrap">
      <KeyRound size={18} className="text-lavender-400 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-pearl/70">
          <span className="font-medium text-pearl/90">Demo access</span>
          {' — '}
          <span className="font-mono text-lavender-300">{DEMO_CREDENTIALS.email}</span>
          {' / '}
          <span className="font-mono text-lavender-300">{DEMO_CREDENTIALS.password}</span>
        </p>
      </div>
      <button
        onClick={onFillAndSignIn}
        className="text-xs font-medium text-lavender-400 hover:text-lavender-300 transition-colors whitespace-nowrap"
      >
        Fill & Sign In
      </button>
    </div>
  );
}
