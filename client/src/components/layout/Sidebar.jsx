/**
 * Sidebar — Desktop navigation sidebar.
 * @param {object} props
 * @param {string} [props.className]
 */
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Heart,
  MessageCircle,
  Wind,
  Settings,
} from 'lucide-react';
import { ROUTES } from '../../utils/constants';

const navItems = [
  { path: ROUTES.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
  { path: ROUTES.JOURNAL, icon: BookOpen, label: 'Journal' },
  { path: ROUTES.MOOD, icon: Heart, label: 'Mood' },
  { path: ROUTES.COMPANION, icon: MessageCircle, label: 'AI Companion' },
  { path: ROUTES.MINDFULNESS, icon: Wind, label: 'Mindfulness' },
  { path: ROUTES.SETTINGS, icon: Settings, label: 'Settings' },
];

export default function Sidebar({ className = '' }) {
  return (
    <aside
      className={`hidden lg:flex flex-col w-60 h-screen fixed left-0 top-0 bg-navy-800 border-r border-white/[0.06] py-6 px-3 ${className}`}
    >
      {/* Logo */}
      <div className="px-3 mb-8">
        <h1 className="text-xl font-bold text-gradient">Solace</h1>
        <p className="text-xs text-pearl/30 mt-0.5">Mental Wellness Tracker</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-[180ms] ${
                isActive
                  ? 'bg-lavender-500/10 text-pearl border-l-2 border-lavender-500 ml-0'
                  : 'text-pearl/50 hover:text-pearl/80 hover:bg-white/[0.04] border-l-2 border-transparent'
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pt-4 border-t border-white/[0.06]">
        <p className="text-[10px] text-pearl/20">Built with Gemini API</p>
      </div>
    </aside>
  );
}
