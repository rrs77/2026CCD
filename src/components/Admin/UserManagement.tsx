import React, { useEffect, useState } from 'react';
import { Users, Edit2, Loader2 } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { useSettings } from '../../contexts/SettingsContextNew';
import type { Profile } from '../../types/auth';
import { EditUserModal } from './EditUserModal';

export function UserManagement() {
  const { customYearGroups } = useSettings();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);

  const yearGroupNames = customYearGroups.map(g => g.name);

  useEffect(() => {
    let cancelled = false;
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (cancelled) return;
      if (error) {
        console.error('Failed to load users:', error);
        setUsers([]);
      } else {
        setUsers((data as Profile[]) ?? []);
      }
      setLoading(false);
    };
    fetchUsers();
    return () => { cancelled = true; };
  }, []);

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
        <h3 className="text-lg font-semibold">User Management</h3>
      </div>
      <p className="text-sm text-gray-600">
        Manage roles and permissions for users who sign in with Supabase Auth.
      </p>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-sm font-medium text-gray-700">Email</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-700">Display name</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-700">Role</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-700 w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  No users found. Users appear here after they sign up with Supabase Auth.
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{user.email ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{user.display_name ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{user.role}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setEditingUser(user)}
                      className="inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-800"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </button>
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
