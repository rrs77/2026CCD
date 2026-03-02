/**
 * Returns the full URL for Vercel API routes.
 * Use for create-user, resend-invite, etc.
 *
 * - In dev: Uses VITE_VERCEL_URL if set (points to deployed Vercel app)
 * - In prod on Vercel: Returns path (same-origin)
 * - When VITE_API_BASE_URL is set: Uses it (for frontend on Cloudflare, etc.)
 */
export function getVercelApiUrl(path: string): string {
  const baseFromEnv = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_VERCEL_URL;
  if (baseFromEnv) {
    const base = String(baseFromEnv).replace(/\/$/, '');
    return `${base}${path.startsWith('/') ? path : `/${path}`}`;
  }
  return path.startsWith('/') ? path : `/${path}`;
}
