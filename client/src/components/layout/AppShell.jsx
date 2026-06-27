/**
 * AppShell — Main layout wrapper with Sidebar and MobileNav.
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-navy-900">
      <Sidebar />
      <main className="lg:ml-60 min-h-screen pb-20 lg:pb-0">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
