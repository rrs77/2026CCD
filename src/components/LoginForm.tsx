import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Download, X, RefreshCw } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from './LoadingSpinner';
import { LogoSVG } from './Logo';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useSettings } from '../contexts/SettingsContextNew';
import { supabase, isSupabaseAuthEnabled, checkSupabaseAuthHealth } from '../config/supabase';

export function LoginForm() {
  const { login } = useAuth();
  const { canInstall, isInstalled, install } = usePWAInstall();
  const { settings } = useSettings();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
  
  // Get branding settings with defaults
  const branding = settings.branding || {};
  const loginBgColor = branding.loginBackgroundColor || 'rgb(77, 181, 168)';
  const loginButtonColor = branding.loginButtonColor || '#008272';
  const logoLetters = branding.logoLetters || 'CCD';
  const loginTitle = branding.loginTitle || 'Creative Curriculum Designer';
  const loginSubtitle = branding.loginSubtitle || 'From Forward Thinking';

  // Check if WordPress is configured
  const wordpressUrl = import.meta.env.VITE_WORDPRESS_URL;
  const isWordPressConfigured = wordpressUrl && wordpressUrl !== 'https://your-wordpress-site.com';

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const LOGIN_TIMEOUT_MS = 60000; // 60s – Supabase free tier can take 30–60s to wake from sleep
      await Promise.race([
        login(username, password),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Connection timed out. The server may be waking up – please try again in a moment.')), LOGIN_TIMEOUT_MS)
        ),
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check Supabase Auth connectivity when login form mounts
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
    supabase.auth.getSession().catch(() => {});
  }, []);

  // Show install prompt after a short delay if available
  React.useEffect(() => {
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
  }, [canInstall, isInstalled]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailTrimmed = forgotEmail.trim();
    if (!emailTrimmed) return;
    setForgotError('');
    setForgotSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(emailTrimmed, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw new Error(error.message);
      setForgotSent(true);
    } catch (err) {
      setForgotError(err instanceof Error ? err.message : 'Failed to send');
    } finally {
      setForgotSubmitting(false);
    }
  };

  const handleInstall = async () => {
    // Automatically trigger installation - browser will handle the prompt
    await install();
    // Close modal after attempting installation (browser handles the rest)
    setShowInstallPrompt(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ backgroundColor: loginBgColor }}>
      <div className="w-full max-w-md">
        {/* Install Button - Top Right */}
        {canInstall && !isInstalled && (
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={async () => {
                // Automatically trigger installation
                await install();
              }}
              className="flex items-center space-x-2 bg-white/90 hover:bg-white text-teal-600 px-3 py-2 rounded-lg shadow-md hover:shadow-lg transition-all text-sm font-medium"
              title="Install App"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Install</span>
            </button>
          </div>
        )}

        {/* Header with Logo */}
        <div className="mb-6 w-full flex items-center justify-center">
          <LogoSVG size="lg" showText={true} className="justify-center" boldCurriculumDesigner={true} letters={logoLetters} />
        </div>

        {/* Login Form or Forgot Password */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {showForgotPassword ? (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Forgot password?</h2>
              {forgotSent ? (
                <p className="text-sm text-green-700 bg-green-50 p-4 rounded-lg">Check your email. We sent a link to reset your password.</p>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      id="forgot-email"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      className="block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                      placeholder="Enter your email"
                    />
                  </div>
                  {forgotError && <p className="text-sm text-red-600">{forgotError}</p>}
                  <button
                    type="submit"
                    disabled={forgotSubmitting}
                    className="w-full text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                    style={{ backgroundColor: forgotSubmitting ? '#9CA3AF' : loginButtonColor }}
                  >
                    {forgotSubmitting ? 'Sending…' : 'Send reset link'}
                  </button>
                </form>
              )}
              <button
                type="button"
                onClick={() => { setShowForgotPassword(false); setForgotSent(false); setForgotError(''); }}
                className="w-full text-sm text-gray-600 hover:text-gray-900"
              >
                Back to sign in
              </button>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            {isSupabaseAuthEnabled() && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm font-medium hover:underline"
                  style={{ color: loginButtonColor }}
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Supabase Auth status (when using Supabase auth) */}
            {isSupabaseAuthEnabled() && authStatus && (
              <div className={`p-2 rounded-lg text-xs ${authStatus === 'ok' ? 'bg-green-50 text-green-800' : authStatus === 'fail' ? 'bg-amber-50 text-amber-800' : 'bg-gray-50 text-gray-600'}`}>
                {authStatus === 'checking' && 'Checking Supabase…'}
                {authStatus === 'ok' && '✓ Supabase Auth connected'}
                {authStatus === 'fail' && `✗ Supabase Auth: ${authError || 'Not reachable'}. Check Supabase Dashboard → Project paused?`}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-2">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700 flex-1">{error}</p>
                </div>
                {error.includes('timed out') && (
                  <button
                    type="button"
                    onClick={() => handleSubmit()}
                    disabled={isSubmitting || !username.trim()}
                    className="flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-800"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try again
                  </button>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              style={{
                backgroundColor: isSubmitting ? '#6B7280' : loginButtonColor
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.opacity = '0.9';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.opacity = '1';
                }
              }}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
          )}

        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm font-light tracking-wide" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
            {loginTitle} • {loginSubtitle}
          </p>
        </div>
      </div>

      {/* Install Prompt Modal */}
      {showInstallPrompt && canInstall && !isInstalled && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <Download className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Install App</h3>
                  <p className="text-sm text-gray-600">Get quick access and work offline</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowInstallPrompt(false);
                  localStorage.setItem('pwa-install-dismissed', Date.now().toString());
                }}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <p className="text-sm text-teal-900 font-medium mb-2">Benefits of installing:</p>
                <ul className="text-sm text-teal-800 space-y-1 list-disc list-inside">
                  <li>Quick access from your desktop or home screen</li>
                  <li>Works offline with cached data</li>
                  <li>Faster loading times</li>
                  <li>No browser tabs needed</li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleInstall}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <Download className="h-5 w-5" />
                  <span>Install Now</span>
                </button>
                <button
                  onClick={() => {
                    setShowInstallPrompt(false);
                    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
                  }}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}