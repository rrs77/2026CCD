import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// StrictMode intentionally double-mounts components in development to find bugs.
// This causes duplicate logs. You can disable it to reduce console noise.
// Re-enable periodically to check for side effects.
const ENABLE_STRICT_MODE = false; // Set to true to enable double-mounting checks

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const Root = () => {
  const app = <App />;
  if (publishableKey) {
    return (
      <ClerkProvider
        publishableKey={publishableKey}
        signInUrl="/sign-in"
        signUpUrl="/sign-up"
        signInFallbackRedirectUrl="/dashboard"
        signUpFallbackRedirectUrl="/dashboard"
        afterSignOutUrl="/sign-in"
      >
        <BrowserRouter>{app}</BrowserRouter>
      </ClerkProvider>
    );
  }
  return app;
};

createRoot(document.getElementById('root')!).render(
  ENABLE_STRICT_MODE ? (
    <StrictMode>
      <Root />
    </StrictMode>
  ) : (
    <Root />
  )
);
