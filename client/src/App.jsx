/**
 * App.jsx — Router setup with auth guards.
 * Public routes: Landing, Auth
 * Protected routes: Dashboard, Journal, MoodLog, AICompanion, Mindfulness, Settings
 * Redirect to onboarding if not completed.
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './hooks/useAuth';
import { ROUTES } from './utils/constants';

import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import MoodLog from './pages/MoodLog';
import AICompanion from './pages/AICompanion';
import Mindfulness from './pages/Mindfulness';
import Settings from './pages/Settings';
import LoadingPulse from './assets/vectors/LoadingPulse';

/** Auth guard — redirects to /auth if not authenticated */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, profile } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <LoadingPulse size={64} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH} replace />;
  }

  if (profile && !profile.onboardingComplete) {
    return <Navigate to={ROUTES.ONBOARDING} replace />;
  }

  return children;
}

/** Public route — redirects to /dashboard if already authenticated */
function PublicRoute({ children }) {
  const { isAuthenticated, loading, profile } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <LoadingPulse size={64} />
      </div>
    );
  }

  if (isAuthenticated && profile?.onboardingComplete) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path={ROUTES.LANDING}
        element={
          <PublicRoute>
            <Landing />
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.AUTH}
        element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        }
      />

      {/* Onboarding */}
      <Route path={ROUTES.ONBOARDING} element={<Onboarding />} />

      {/* Protected routes */}
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.JOURNAL}
        element={
          <ProtectedRoute>
            <Journal />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.MOOD}
        element={
          <ProtectedRoute>
            <MoodLog />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.COMPANION}
        element={
          <ProtectedRoute>
            <AICompanion />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.MINDFULNESS}
        element={
          <ProtectedRoute>
            <Mindfulness />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.SETTINGS}
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to={ROUTES.LANDING} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#141D36',
                color: '#F8F9FF',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#8EBD9B', secondary: '#F8F9FF' },
              },
              error: {
                iconTheme: { primary: '#E87070', secondary: '#F8F9FF' },
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
