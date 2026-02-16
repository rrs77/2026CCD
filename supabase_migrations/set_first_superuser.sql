-- ============================================
-- Set your account as superuser (run once after first login)
-- Run in Supabase SQL Editor after you have signed in at least once.
-- ============================================
-- Replace 'your-email@example.com' with the email you use to sign in, then run.

UPDATE public.profiles
SET role = 'superuser', updated_at = NOW()
WHERE email = 'your-email@example.com';

-- Optional: confirm the update (should return 1 row)
-- SELECT id, email, role FROM public.profiles WHERE email = 'your-email@example.com';
