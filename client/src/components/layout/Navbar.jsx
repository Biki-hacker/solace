/**
 * Navbar — Landing page top navigation bar.
 */
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy-900/80 backdrop-blur-xl border-b border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to={ROUTES.LANDING} className="text-xl font-bold text-gradient">
          Solace
        </Link>
        <Link
          to={ROUTES.AUTH}
          className="px-5 py-2 text-sm font-medium text-pearl bg-lavender-500 hover:bg-lavender-600 rounded-full transition-all duration-[180ms]"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}
