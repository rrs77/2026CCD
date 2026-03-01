lessonviewergit

## Clerk Authentication

This app uses [Clerk](https://clerk.com) for authentication with email/password, email verification, and password reset.

### Setup

1. Create an app at [Clerk Dashboard](https://dashboard.clerk.com).
2. Enable **Email** and **Password** as sign-in options.
3. Enable **Email verification** and **Forgot password** in the dashboard.
4. Copy your Publishable Key to `VITE_CLERK_PUBLISHABLE_KEY`.

### Vercel Environment Variables

In your Vercel project settings, add:

- `VITE_CLERK_PUBLISHABLE_KEY` – Your Clerk Publishable Key (from Clerk Dashboard → API Keys)

### Clerk Allowed Origins

In Clerk Dashboard → **Configure** → **Paths** (or **Settings** → **Paths**):

- Add your Vercel preview URLs (e.g. `https://your-app.vercel.app`, `https://*.vercel.app` for previews)
- Add `http://localhost:5173` for local development
