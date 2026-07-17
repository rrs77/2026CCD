import React, { useState, useEffect } from 'react';
import {
  Mail,
  Lock,
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
import { SketchbookLeftPage } from './login/SketchbookLeftPage';
import { PrototypeNoticeBar } from './login/PrototypeNoticeBar';
import { LOGO_BG } from './Logo';

const LOGIN_GREEN = LOGO_BG;

/**
 * Responsive open-notebook login matching the approved sketchbook mockup.
 * Desktop: left page = original art; right page = live form over mockup decor.
 * Mobile: brand + login first, then the original left-page art below.
 */
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
      className="login-sketchbook relative flex min-h-[100dvh] w-full flex-col"
      style={{
        backgroundColor: '#1c1410',
        backgroundImage: `
          radial-gradient(ellipse at 28% 18%, rgba(90,60,40,0.35), transparent 55%),
          linear-gradient(165deg, #2a1f18 0%, #120e0c 100%)
        `,
      }}
    >
      <PrototypeNoticeBar />

      <div className="relative z-10 flex flex-1 items-stretch justify-center p-2 sm:p-3 lg:p-4">
        {/* Open notebook — fills the viewport width responsively */}
        <div className="login-sketchbook-spread relative flex w-full max-w-[1400px] flex-1 flex-col overflow-hidden rounded-sm shadow-[0_24px_60px_rgba(0,0,0,0.45)] lg:min-h-[calc(100dvh-4.5rem)] lg:flex-row">
          {/* Spine / fold */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-1/2 z-20 hidden w-8 -translate-x-1/2 lg:block"
            style={{
              background:
                'linear-gradient(90deg, rgba(0,0,0,0.08), rgba(255,255,255,0.15) 45%, rgba(0,0,0,0.12))',
            }}
          />

          {/* Creative left page — second on mobile */}
          <div className="order-2 min-h-[50vh] flex-1 border-t border-[#0a2a44]/10 lg:order-1 lg:min-h-0 lg:border-t-0 lg:border-r lg:border-[#0a2a44]/10">
            <SketchbookLeftPage />
          </div>

          {/* Login right page — first on mobile; plant/guitar from approved mockup */}
          <div className="login-book-page login-book-page--right order-1 relative flex flex-1 flex-col overflow-hidden lg:order-2">
            <div className="pointer-events-none absolute inset-0 login-book-paper" aria-hidden />
            {/* Desktop: original right-page art (plant, guitar, stars) with form zone cleared */}
            <img
              src={`${import.meta.env.BASE_URL}login-sketchbook-right-bg.jpg`}
              alt=""
              aria-hidden
              className="pointer-events-none absolute inset-0 hidden h-full w-full object-cover object-right lg:block"
              decoding="async"
            />
            <SketchStars />

            <div className="relative z-10 flex flex-1 flex-col justify-start px-5 pb-6 pt-4 sm:px-8 sm:pb-8 sm:pt-5 lg:justify-center lg:px-10 lg:py-10">
              {/* Phone: brand pinned to the top of the page (not centered with the form) */}
              <header className="mb-5 flex shrink-0 items-start justify-between gap-3 lg:hidden">
                <h1
                  className="min-w-0 flex-1 whitespace-nowrap text-left text-[clamp(1.55rem,7vw,2rem)] font-semibold leading-none tracking-tight text-[#0a2a44]"
                  style={{ fontFamily: '"Caveat", cursive' }}
                >
                  Creative Curriculum Designer
                </h1>
                <MobileBrandPencil />
              </header>

              {canInstall && !isInstalled && (
                <div className="mb-3 flex justify-end lg:mb-3">
                  <button
                    type="button"
                    onClick={async () => {
                      await install();
                    }}
                    className="flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1.5 text-xs font-medium text-[#0a2a44] shadow-sm hover:bg-white"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Install
                  </button>
                </div>
              )}

              <div className="login-book-login-cluster w-full max-w-[23rem]">
                <h2
                  className="mb-1 text-[clamp(1.85rem,3vw,2.45rem)] leading-tight text-[#0a2a44]"
                  style={{ fontFamily: '"Caveat", cursive', fontWeight: 700 }}
                >
                  Back to the studio
                </h2>
                <svg
                  aria-hidden
                  className="mb-5 h-3 w-36 text-[#0a2a44]/45"
                  viewBox="0 0 140 12"
                  fill="none"
                >
                  <path
                    d="M2 8c18-6 38 2 58-1s42-4 78 2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="login-book-frame relative">
                  <FrameVines />
                {showForgotPassword ? (
                  <div className="space-y-3">
                    <p
                      className="text-xl text-[#0a2a44]"
                      style={{ fontFamily: '"Caveat", cursive', fontWeight: 600 }}
                    >
                      Forgot password?
                    </p>
                    {!isSupabaseAuthEnabled() ? (
                      <p className="text-sm text-amber-800">Password reset is unavailable on this site.</p>
                    ) : forgotSent ? (
                      <p className="text-sm text-[#0f3d34]">Check your email for a reset link.</p>
                    ) : (
                      <form onSubmit={handleForgotPassword} className="space-y-3">
                        <div>
                          <label htmlFor="forgot-email" className="mb-1 block text-sm font-medium text-[#2f4a42]">
                            Email
                          </label>
                          <input
                            id="forgot-email"
                            type="email"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            required
                            className="login-book-field"
                            placeholder="you@school.org"
                          />
                        </div>
                        {forgotError && <p className="text-sm text-red-700">{forgotError}</p>}
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
                      className="w-full text-center text-sm text-[#5a726a] hover:text-[#0a2a44]"
                    >
                      Back to sign in
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
                    <div>
                      <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-[#2f4a42]">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8aa099]" />
                        <input
                          id="login-email"
                          type="email"
                          autoComplete="email"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          className="login-book-field pl-10"
                          placeholder="you@school.org"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-[#2f4a42]">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8aa099]" />
                        <input
                          id="login-password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="login-book-field pl-10 pr-10"
                          placeholder="Password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-[#5a726a] hover:text-[#0a2a44]"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      {isSupabaseAuthEnabled() ? (
                        <label className="flex cursor-pointer items-center gap-2 text-sm text-[#3d5c54]">
                          <input
                            type="checkbox"
                            checked={staySignedIn}
                            onChange={(e) => setStaySignedIn(e.target.checked)}
                            className="h-4 w-4 rounded border-[#0a2a44]/30 text-[#0a2a44]"
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
                          className="text-sm font-medium text-[#0a2a44] underline underline-offset-2 hover:text-[#0a2a44]/80"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>

                    {error && (
                      <div className="flex items-start gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <div>
                          <span>{error}</span>
                          {error.includes('timed out') && (
                            <button
                              type="button"
                              onClick={() => handleSubmit()}
                              disabled={isSubmitting || !username.trim()}
                              className="mt-1 flex items-center gap-1 font-medium text-[#0a2a44] hover:underline"
                            >
                              <RefreshCw className="h-3.5 w-3.5" />
                              Try again
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {isSupabaseAuthEnabled() && authStatus === 'fail' && (
                      <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
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
                  </form>
                )}
                </div>

                {!showForgotPassword && (
                  <div className="mt-5 space-y-4">
                    <FeatureWalkthroughGraphic
                      onClick={() => setShowFeatureWalkthrough(true)}
                      className="max-w-none"
                    />

                    <p className="text-center text-sm text-[#5a726a]">
                      Don&apos;t have an account?{' '}
                      <a
                        href={loginSubtitleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#0a2a44] underline-offset-2 hover:underline"
                      >
                        Create one
                      </a>
                    </p>

                    <button
                      type="button"
                      onClick={handleStartPreview}
                      className="login-sketch-lift mx-auto block text-center text-[1.2rem] text-[#0a2a44] underline decoration-[#0a2a44]/40 underline-offset-4 hover:decoration-[#0a2a44]"
                      style={{ fontFamily: '"Caveat", cursive', fontWeight: 600 }}
                    >
                      Explore the working prototype
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowAboutPrototype(true)}
                      className="mx-auto block text-center text-xs text-[#5a726a] hover:text-[#0a2a44] hover:underline"
                    >
                      About this prototype
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
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

function MobileBrandPencil() {
  return (
    <svg
      aria-hidden
      className="mt-0.5 h-11 w-8 shrink-0 text-[#0a2a44]/35"
      viewBox="0 0 40 64"
      fill="none"
    >
      <path d="M18 4l6 2-8 48-6-2L18 4z" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M12 52l6 2 2-10-6-2-2 10z"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path d="M20 6l3 1" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function SketchStars() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] text-[#0a2a44]/35 lg:hidden">
      <svg className="absolute left-3 top-3 h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0l1.2 5.2L14 6.5l-4 3.2L11.5 16 8 12.8 4.5 16l1.5-6.3L2 6.5l4.8-1.3L8 0z" />
      </svg>
      <svg className="absolute right-4 top-5 h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0l1.2 5.2L14 6.5l-4 3.2L11.5 16 8 12.8 4.5 16l1.5-6.3L2 6.5l4.8-1.3L8 0z" />
      </svg>
      <svg className="absolute bottom-6 right-5 h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0l1.2 5.2L14 6.5l-4 3.2L11.5 16 8 12.8 4.5 16l1.5-6.3L2 6.5l4.8-1.3L8 0z" />
      </svg>
    </div>
  );
}

function FrameVines() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute -right-2 -top-3 h-10 w-14 text-[#0a2a44]/40"
      viewBox="0 0 56 40"
      fill="none"
    >
      <path
        d="M4 32c8-2 12-10 14-18M18 14c2 6 8 10 16 10M20 12c4-6 10-8 16-6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M16 16c2-3 1-6-1-8M28 22c3-1 5-4 5-7"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
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
            className="p-1 text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onInstall}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold text-white"
            style={{ backgroundColor: LOGIN_GREEN }}
          >
            <Download className="h-5 w-5" />
            Install Now
          </button>
          <button type="button" onClick={onDismiss} className="px-6 py-3 font-medium text-gray-600">
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
