/**
 * Profile row from public.profiles (Supabase Auth).
 * id matches auth.users(id).
 */
export type ProfileRole = 'admin' | 'teacher' | 'viewer';

export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  role: ProfileRole;
  can_edit_activities: boolean;
  can_edit_lessons: boolean;
  can_manage_year_groups: boolean;
  can_manage_users: boolean;
  allowed_year_groups: string[] | null;
  created_at: string;
  updated_at: string;
}

/** App-level user (AuthContext): from Supabase auth + profile or from local/WordPress. */
export interface AppUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  token?: string;
  /** Set when logged in via Supabase Auth; used for RLS and permission checks. */
  profile?: Profile;
}
