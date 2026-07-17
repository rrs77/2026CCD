import React, { useState, useEffect } from 'react';
import {
  Eye,
  EyeOff,
  AlertCircle,
  Download,
  X,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getAppBaseUrl } from '../utils/apiUrl';
import { LoadingSpinner } from './LoadingSpinner';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useSettings } from '../contexts/SettingsContextNew';
import {
  supabase,
  isSupabaseAuthEnabled,
  isSupabaseConfigured,
  checkSupabaseAuthHealth,
  setSessionOnlyCookie,
} from '../config/supabase';
import { activateDemoMode } from '../utils/demoMode';
import { seedDemoData } from '../utils/demoSeed';
import { FeatureWalkthroughModal } from './FeatureWalkthrough/FeatureWalkthroughModal';
import { PrototypePasswordPrompt, isPrototypeUnlocked } from './PrototypeGate';
import { AboutPrototypeModal } from './login/AboutPrototypeModal';
import { FeatureWalkthroughGraphic } from './login/FeatureWalkthroughGraphic';
import { SKETCHBOOK_IMG } from './login/LoginHeroPanel';
import { PrototypeNoticeBar } from './login/PrototypeNoticeBar';
import { LOGO_BG } from './Logo';

const LOGIN_GREEN = LOGO_BG;

/** Open-book artwork aspect (login-sketchbook-v6.jpg). */
const BOOK_ASPECT = '1459 / 953';

export function LoginForm() {
  const { login } = useAuth();
  const { canInstall, isInstalled, install } = usePWAInstall();
  const { settings } = useSettings();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [staySignedIn, setStaySignedIn] = useState(false);
  const [error, setError] = useState('');
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authStatus, setAuthStatus] = useState<'checking' | 'ok' | 'fail' | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [showFeatureWalkthrough, setShowFeatureWalkthrough] = useState(false);
  const [showAboutPrototype, setShowAboutPrototype] = useState(false);
  const [showPrototypePassword, setShowPrototypePassword] = useState(false);

  const branding = settings.branding || {};
  const loginSubtitleUrl = branding.loginSubtitleUrl || 'https://www.rhythmstix.co.uk';

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      if (isSupabaseAuthEnabled() && !staySignedIn) {
        setSessionOnlyCookie();
      }
      const LOGIN_TIMEOUT_MS = 60000;
      await Promise.race([
        login(username, password),
        new Promise<never>((_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error(
                  'Connection timed out. The server may be waking up – please try again in a moment.',
                ),
              ),
            LOGIN_TIMEOUT_MS,
          ),
        ),
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message || 'Email or password incorrect. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isSupabaseAuthEnabled()) {
      setAuthStatus(null);
      return;
    }
    setAuthStatus('checking');
    checkSupabaseAuthHealth()
      .then(({ ok, error }) => {
        setAuthStatus(ok ? 'ok' : 'fail');
        setAuthError(error ?? null);
      })
      .catch(() => {
        setAuthStatus('fail');
        setAuthError('Check failed');
      });
  }, []);

  useEffect(() => {
    if (canInstall && !isInstalled) {
      const timer = setTimeout(() => {
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (!dismissed) {
          setShowInstallPrompt(true);
        } else {
          const dismissedTime = parseInt(dismissed, 10);
          const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
          if (daysSinceDismissed >= 7) {
            setShowInstallPrompt(true);
          }
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [canInstall, isInstalled]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailTrimmed = forgotEmail.trim();
    if (!emailTrimmed) return;
    setForgotError('');
    setForgotSubmitting(true);
    try {
      const baseUrl = getAppBaseUrl();
      const redirectTo = baseUrl
        ? `${baseUrl}/reset-password`
        : `${window.location.origin}/reset-password`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(emailTrimmed, {
        redirectTo,
      });
      if (resetError) {
        const msg = resetError.message || '';
        if (msg.toLowerCase().includes('rate limit')) {
          throw new Error('Too many reset requests. Please wait about an hour and try again.');
        }
        throw new Error(resetError.message);
      }
      setForgotSent(true);
    } catch (err) {
      setForgotError(err instanceof Error ? err.message : 'Failed to send');
    } finally {
      setForgotSubmitting(false);
    }
  };

  const handleInstall = async () => {
    await install();
    setShowInstallPrompt(false);
  };

  const handleStartPreview = async () => {
    if (!isPrototypeUnlocked()) {
      setShowPrototypePassword(true);
      return;
    }
    await enterPrototype();
  };

  const enterPrototype = async () => {
    activateDemoMode('default');
    await seedDemoData();
    window.location.assign('/?demo=1');
  };

  return (
    <div
      className="login-sketchbook relative flex min-h-[100dvh] w-full flex-col overflow-x-hidden"
      style={{
        backgroundColor: '#1c1410',
        backgroundImage: `
          radial-gradient(ellipse at 30% 20%, rgba(90,60,40,0.4), transparent 55%),
          linear-gradient(160deg, #2a1f18 0%, #120e0c 100%)
        `,
      }}
    >
      <PrototypeNoticeBar />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-1 py-2 sm:px-2 sm:py-3">
        {/* Whole open book visible — interactive fields live on the right page */}
        <div
          className="login-sketchbook-spread relative w-full max-w-[min(96vw,1280px)]"
          style={{ aspectRatio: BOOK_ASPECT }}
        >
          <img
            src={SKETCHBOOK_IMG}
            alt="Creative Curriculum Designer sketchbook — Drama, Music and Dance. Sign in on the right page."
            className="absolute inset-0 h-full w-full object-contain object-center select-none"
            draggable={false}
            decoding="async"
          />

          {/* Slanted interactive zone aligned to the drawn form on the right page */}
          <div
            className="login-book-form-zone absolute z-20"
            style={{
              left: '51.5%',
              top: '26%',
              width: '34%',
              transform: 'perspective(1400px) rotateY(-7deg) rotateZ(-1.4deg)',
              transformOrigin: 'left center',
            }}
          >
            {showForgotPassword ? (
              <div className="space-y-2 rounded-sm bg-[#f7f1e6]/90 p-2 shadow-sm backdrop-blur-[1px] sm:p-3">
                <p
                  className="text-lg text-[#002D24] sm:text-xl"
                  style={{ fontFamily: '"Caveat", cursive', fontWeight: 600 }}
                >
                  Forgot password?
                </p>
                {!isSupabaseAuthEnabled() ? (
                  <p className="text-xs text-amber-800">Password reset is unavailable on this site.</p>
                ) : forgotSent ? (
                  <p className="text-xs text-[#0f3d34]">Check your email for a reset link.</p>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-2">
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      placeholder="Email"
                      className="login-book-field"
                    />
                    {forgotError && <p className="text-xs text-red-700">{forgotError}</p>}
                    <button
                      type="submit"
                      disabled={forgotSubmitting}
                      className="login-book-submit"
                      style={{ backgroundColor: forgotSubmitting ? '#9CA3AF' : LOGIN_GREEN }}
                    >
                      {forgotSubmitting ? 'Sending…' : 'Send reset link'}
                    </button>
                  </form>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotSent(false);
                    setForgotError('');
                  }}
                  className="w-full text-center text-xs text-[#5a726a] hover:text-[#002D24]"
                >
                  Back to sign in
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-2.5" noValidate>
                <label className="sr-only" htmlFor="login-email">
                  Email address
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Email"
                  className="login-book-field"
                />

                <div className="relative">
                  <label className="sr-only" htmlFor="login-password">
                    Password
                  </label>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Password"
                    className="login-book-field pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#5a726a] hover:text-[#002D24]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 px-0.5">
                  {isSupabaseAuthEnabled() ? (
                    <label className="flex cursor-pointer items-center gap-1.5 text-[0.65rem] text-[#3d5c54] sm:text-xs">
                      <input
                        type="checkbox"
                        checked={staySignedIn}
                        onChange={(e) => setStaySignedIn(e.target.checked)}
                        className="h-3 w-3 rounded border-[#002D24]/30 text-[#002D24]"
                      />
                      Remember me
                    </label>
                  ) : (
                    <span />
                  )}
                  {isSupabaseConfigured() && (
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-[0.65rem] font-medium text-[#002D24] underline-offset-2 hover:underline sm:text-xs"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                {error && (
                  <div className="flex items-start gap-1.5 rounded-sm bg-red-50/95 p-2 text-[0.7rem] text-red-700">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <div>
                      <span>{error}</span>
                      {error.includes('timed out') && (
                        <button
                          type="button"
                          onClick={() => handleSubmit()}
                          disabled={isSubmitting || !username.trim()}
                          className="mt-1 flex items-center gap-1 font-medium text-[#002D24] hover:underline"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Try again
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {isSupabaseAuthEnabled() && authStatus === 'fail' && (
                  <p className="rounded-sm bg-amber-50/95 px-2 py-1 text-[0.65rem] text-amber-800">
                    Supabase Auth: {authError || 'Not reachable'}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="login-book-submit"
                  style={{ backgroundColor: isSubmitting ? '#6B7280' : LOGIN_GREEN }}
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      Signing in…
                    </span>
                  ) : (
                    'Sign in'
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleStartPreview}
                  className="login-sketch-lift w-full text-center text-sm text-[#002D24] underline decoration-[#002D24]/35 underline-offset-4 hover:decoration-[#002D24]"
                  style={{ fontFamily: '"Caveat", cursive', fontWeight: 600 }}
                >
                  Explore the working prototype
                </button>

                <div className="pt-1">
                  <FeatureWalkthroughGraphic
                    onClick={() => setShowFeatureWalkthrough(true)}
                    className="max-w-none"
                  />
                </div>

                <p className="pt-1 text-center text-[0.65rem] text-[#5a726a] sm:text-xs">
                  Don&apos;t have an account?{' '}
                  <a
                    href={loginSubtitleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#002D24] hover:underline"
                  >
                    Create one
                  </a>
                  {' · '}
                  <button
                    type="button"
                    onClick={() => setShowAboutPrototype(true)}
                    className="hover:text-[#002D24] hover:underline"
                  >
                    About
                  </button>
                </p>
              </form>
            )}
          </div>

          {canInstall && !isInstalled && (
            <button
              type="button"
              onClick={async () => {
                await install();
              }}
              className="absolute right-[2%] top-[3%] z-30 flex items-center gap-1 rounded-full bg-[#f7f1e6]/90 px-2.5 py-1.5 text-[0.65rem] font-medium text-[#002D24] shadow-sm backdrop-blur-sm hover:bg-white"
            >
              <Download className="h-3 w-3" />
              Install
            </button>
          )}
        </div>
      </div>

      {showInstallPrompt && canInstall && !isInstalled && (
        <InstallPromptModal
          onInstall={handleInstall}
          onDismiss={() => {
            setShowInstallPrompt(false);
            localStorage.setItem('pwa-install-dismissed', Date.now().toString());
          }}
        />
      )}

      <FeatureWalkthroughModal
        isOpen={showFeatureWalkthrough}
        onClose={() => setShowFeatureWalkthrough(false)}
      />

      {showPrototypePassword && (
        <PrototypePasswordPrompt
          onUnlocked={() => {
            setShowPrototypePassword(false);
            void enterPrototype();
          }}
          onCancel={() => setShowPrototypePassword(false)}
        />
      )}

      <AboutPrototypeModal
        isOpen={showAboutPrototype}
        onClose={() => setShowAboutPrototype(false)}
      />
    </div>
  );
}

function InstallPromptModal({
  onInstall,
  onDismiss,
}: {
  onInstall: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Install App</h3>
            <p className="text-sm text-gray-600">Get quick access and work offline</p>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="p-1 text-gray-400 transition-colors hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onInstall}
            className="flex flex-1 items-center justify-center space-x-2 rounded-lg px-6 py-3 font-semibold text-white"
            style={{ backgroundColor: LOGIN_GREEN }}
          >
            <Download className="h-5 w-5" />
            <span>Install Now</span>
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="px-6 py-3 font-medium text-gray-600 hover:text-gray-800"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
