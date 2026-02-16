import React, { useEffect, useState } from 'react';
import { Users, Edit2, Loader2, Mail } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { useSettings } from '../../contexts/SettingsContextNew';
import type { Profile, ProfileRole } from '../../types/auth';
import { EditUserModal } from './EditUserModal';
import toast from 'react-hot-toast';

function roleLabel(role: ProfileRole): string {
  switch (role) {
    case 'superuser': return 'Superuser';
    case 'admin': return 'Admin';
    case 'teacher': return 'Teacher';
    case 'viewer': return 'Viewer';
    default: return role;
  }
}

function roleBadgeClass(role: ProfileRole): string {
  switch (role) {
    case 'superuser': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'admin': return 'bg-teal-100 text-teal-800 border-teal-200';
    case 'teacher': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'viewer': return 'bg-gray-100 text-gray-700 border-gray-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

function formatDate(iso: string | undefined): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '—';
  }
}

export function UserManagement() {
  const { customYearGroups } = useSettings();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [sendingResetFor, setSendingResetFor] = useState<string | null>(null);

  const yearGroupNames = customYearGroups.map(g => g.name);

  const fetchUsers = React.useCallback(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Failed to load users:', error);
      return [];
    }
    return (data as Profile[]) ?? [];
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchUsers().then(data => {
      if (!cancelled) setUsers(data);
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [fetchUsers]);

  const handleSave = async (updates: Partial<Profile>) => {
    if (!editingUser) return;
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', editingUser.id);
    if (error) throw new Error(error.message);
    setUsers(prev => prev.map(u => (u.id === editingUser.id ? { ...u, ...updates } : u)));
    setEditingUser(null);
  };

  const handleSendResetEmail = async (profile: Profile) => {
    const email = profile.email?.trim();
    if (!email) {
      toast.error('No email on file for this user. They must sign in once so their email is stored.');
      return;
    }
    setSendingResetFor(profile.id);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success(`Password reset email sent to ${email}. They can use the link to set a new password.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to send reset email');
    } finally {
      setSendingResetFor(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-700">
        <Users className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Users & access</h3>
      </div>
      <p className="text-sm text-gray-600">
        View all user accounts, contact details, and <strong>user types</strong> (Viewer, Teacher, Admin, Superuser). Use <strong>Edit</strong> to change a user’s role and permissions. Use <strong>Reset password</strong> to send them a password reset email so they can set a new password.
      </p>
      <div className="border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full text-left min-w-[640px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-sm font-medium text-gray-700">Email</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-700">Display name</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-700">User type</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-700">Created</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  <p>No users found.</p>
                  <p className="mt-2 text-xs max-w-sm mx-auto">Users appear here after they sign up with Supabase Auth. If you are a superuser and expect to see users, ensure the migration <code className="bg-gray-100 px-1 rounded">profiles_superuser_and_rls.sql</code> has been run in Supabase (see <code className="bg-gray-100 px-1 rounded">supabase_migrations/README_RUN_IN_SUPABASE.md</code>).</p>
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{user.email ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{user.display_name ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${roleBadgeClass(user.role as ProfileRole)}`}>
                      {roleLabel(user.role as ProfileRole)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(user.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingUser(user)}
                        className="inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-800"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSendResetEmail(user)}
                        disabled={!user.email?.trim() || sendingResetFor === user.id}
                        className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={user.email ? 'Send password reset email' : 'No email on file'}
                      >
                        {sendingResetFor === user.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Mail className="h-4 w-4" />
                        )}
                        Reset password
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {editingUser && (
        <EditUserModal
          user={editingUser}
          yearGroupNames={yearGroupNames}
          onSave={handleSave}
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  );
}
