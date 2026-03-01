import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { ClerkAuthProvider } from './contexts/ClerkAuthProvider';
import { DataProvider } from './contexts/DataContext';
import { SettingsProviderNew } from './contexts/SettingsContextNew';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { LoginForm } from './components/LoginForm';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Footer } from './components/Footer';
import { AuthNavbar } from './components/AuthNavbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import { HelpGuide } from './components/HelpGuide';
import { initializeSupabaseKeepAlive } from './utils/supabaseKeepAlive';
import './utils/setupKS1Maths'; // Make setupKS1MathsExample available in browser console
import './utils/setupDanceObjectives'; // Make setupDanceObjectives available in browser console
import './utils/addForParentsToLKG'; // Make addForParentsToLKG available in browser console
import './utils/addLKGActivitiesToAllYearGroups'; // Make addLKGActivitiesToAllYearGroups available in browser console

function AppContent() {
  const { user, loading } = useAuth();
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  const [helpGuideSection, setHelpGuideSection] = useState<
    'activity' | 'lesson' | 'unit' | 'assign' | undefined
  >(undefined);

  // Initialize Supabase keep-alive service to prevent database sleep
  useEffect(() => {
    const cleanup = initializeSupabaseKeepAlive();
    
    // Also check when user returns to the app (after tab was inactive)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // User returned to the app - check if ping is needed
        import('./utils/supabaseKeepAlive').then(({ checkAndPingSupabase }) => {
          checkAndPingSupabase();
        });
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      cleanup();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const handleOpenGuide = (
    section?: 'activity' | 'lesson' | 'unit' | 'assign'
  ) => {
    setHelpGuideSection(section);
    setShowHelpGuide(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#333',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
          success: {
            iconTheme: {
              primary: '#0D9488',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#DC2626',
              secondary: '#fff',
            },
          },
        }}
      />
      <Header />
      <main className="flex-1 pt-14 sm:pt-16 pb-20">
        <Dashboard />
      </main>
      <Footer />
      <HelpGuide
        isOpen={showHelpGuide}
        onClose={() => setShowHelpGuide(false)}
        initialSection={helpGuideSection}
      />
    </div>
  );
}

function DashboardLayout() {
  return (
    <ClerkAuthProvider>
      <SettingsProviderNew>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </SettingsProviderNew>
    </ClerkAuthProvider>
  );
}

function App() {
  const useClerkAuth = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

  if (useClerkAuth) {
    return (
      <ErrorBoundary>
        <Routes>
          <Route
            path="/sign-in"
            element={
              <>
                <AuthNavbar />
                <div className="min-h-[calc(100vh-52px)] flex items-center justify-center bg-gray-50">
                  <SignIn
                    signUpUrl="/sign-up"
                    fallbackRedirectUrl="/dashboard"
                  />
                </div>
              </>
            }
          />
          <Route
            path="/sign-up"
            element={
              <>
                <AuthNavbar />
                <div className="min-h-[calc(100vh-52px)] flex items-center justify-center bg-gray-50">
                  <SignUp
                    signInUrl="/sign-in"
                    fallbackRedirectUrl="/dashboard"
                  />
                </div>
              </>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <SettingsProviderNew>
          <DataProvider>
            <AppContent />
          </DataProvider>
        </SettingsProviderNew>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
