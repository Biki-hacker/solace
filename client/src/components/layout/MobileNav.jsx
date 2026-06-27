/**
 * MobileNav — Bottom navigation bar for mobile devices.
 */
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Heart,
  MessageCircle,
  Wind,
} from 'lucide-react';
import { ROUTES } from '../../utils/constants';

const navItems = [
  { path: ROUTES.DASHBOARD, icon: LayoutDashboard, label: 'Home' },
  { path: ROUTES.JOURNAL, icon: BookOpen, label: 'Journal' },
  { path: ROUTES.MOOD, icon: Heart, label: 'Mood' },
  { path: ROUTES.COMPANION, icon: MessageCircle, label: 'Chat' },
  { path: ROUTES.MINDFULNESS, icon: Wind, label: 'Calm' },
];

export default function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-navy-800/95 backdrop-blur-xl border-t border-white/[0.06] px-2 pb-safe">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-medium transition-all duration-[180ms] ${
                isActive
                  ? 'text-lavender-400'
                  : 'text-pearl/35 hover:text-pearl/60'
              }`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
