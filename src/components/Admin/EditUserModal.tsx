import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Profile, ProfileRole } from '../../types/auth';

interface EditUserModalProps {
  user: Profile;
  yearGroupNames: string[];
  onSave: (updates: Partial<Profile>) => Promise<void>;
  onClose: () => void;
}

const ROLES: { value: ProfileRole; label: string }[] = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'admin', label: 'Admin' }
];

export function EditUserModal({ user, yearGroupNames, onSave, onClose }: EditUserModalProps) {
  const [role, setRole] = useState<ProfileRole>(user.role);
  const [displayName, setDisplayName] = useState(user.display_name ?? '');
  const [canEditActivities, setCanEditActivities] = useState(user.can_edit_activities);
  const [canEditLessons, setCanEditLessons] = useState(user.can_edit_lessons);
  const [canManageYearGroups, setCanManageYearGroups] = useState(user.can_manage_year_groups);
  const [canManageUsers, setCanManageUsers] = useState(user.can_manage_users);
  const [allowedYearGroups, setAllowedYearGroups] = useState<string[]>(user.allowed_year_groups ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const toggleYearGroup = (name: string) => {
    setAllowedYearGroups(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      await onSave({
        display_name: displayName || null,
        role,
        can_edit_activities: canEditActivities,
        can_edit_lessons: canEditLessons,
        can_manage_year_groups: canManageYearGroups,
        can_manage_users: canManageUsers,
        allowed_year_groups: allowedYearGroups.length > 0 ? allowedYearGroups : null,
        updated_at: new Date().toISOString()
      });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Edit user</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">{user.email ?? user.id}</p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display name</label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as ProfileRole)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              {ROLES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Permissions</label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={canEditLessons}
                onChange={e => setCanEditLessons(e.target.checked)}
              />
              <span className="text-sm">Can edit lessons</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={canEditActivities}
                onChange={e => setCanEditActivities(e.target.checked)}
              />
              <span className="text-sm">Can edit activities</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={canManageYearGroups}
                onChange={e => setCanManageYearGroups(e.target.checked)}
              />
              <span className="text-sm">Can manage year groups</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={canManageUsers}
                onChange={e => setCanManageUsers(e.target.checked)}
              />
              <span className="text-sm">Can manage users</span>
            </label>
          </div>

          {yearGroupNames.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Allowed year groups (optional)</label>
              <div className="flex flex-wrap gap-2">
                {yearGroupNames.map(name => (
                  <label key={name} className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-gray-200 bg-gray-50">
                    <input
                      type="checkbox"
                      checked={allowedYearGroups.includes(name)}
                      onChange={() => toggleYearGroup(name)}
                    />
                    <span className="text-sm">{name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
