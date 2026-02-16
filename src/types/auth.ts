/**
 * Profile row from public.profiles (Supabase Auth).
 * id matches auth.users(id).
 */
export type ProfileRole = 'admin' | 'teacher' | 'viewer' | 'student' | 'superuser';

export type ProfileStatus = 'active' | 'invited' | 'suspended';

export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  role: ProfileRole;
  status?: ProfileStatus;
  can_edit_activities: boolean;
  can_edit_lessons: boolean;
  can_manage_year_groups: boolean;
  can_manage_users: boolean;
  allowed_year_groups: string[] | null;
  created_at: string;
  updated_at: string;
}

/** Purchase row for View Purchases (optional table user_purchases). */
export interface UserPurchase {
  id: string;
  user_id: string;
  product_name: string;
  status: string;
  purchased_at: string;
  expires_at?: string | null;
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
