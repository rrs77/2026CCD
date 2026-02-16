import React, { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { ProfileRole } from '../../types/auth';

interface AuthGuardProps {
  children: ReactNode;
  /** Require at least this role (admin > teacher > viewer). */
  requiredRole?: ProfileRole;
  /** Or require can_manage_users (for admin user management). */
  requireCanManageUsers?: boolean;
  /** Content when access is denied (default: "Access denied"). */
  fallback?: ReactNode;
}

/**
 * Renders children only when the user is authenticated and meets role/permission.
 * Use for admin-only sections (e.g. User Management).
 */
export function AuthGuard({
  children,
  requiredRole,
  requireCanManageUsers,
  fallback = <div className="p-4 text-gray-600">Access denied.</div>
}: AuthGuardProps) {
  const { user, profile, loading } = useAuth();

  if (loading || !user) {
    return null;
  }

  if (requireCanManageUsers) {
    const isSuperAdmin = user?.email === 'rob.reichstorer@gmail.com' || user?.role === 'administrator';
    const canManage = isSuperAdmin || profile?.role === 'admin' || profile?.can_manage_users === true;
    if (!canManage) return <>{fallback}</>;
  }

  if (requiredRole) {
    const roleOrder: ProfileRole[] = ['viewer', 'teacher', 'admin'];
    const userRole = (profile?.role ?? user.role) as ProfileRole;
    const requiredIndex = roleOrder.indexOf(requiredRole);
    const userIndex = roleOrder.indexOf(userRole);
    if (userIndex < requiredIndex) return <>{fallback}</>;
  }

  return <>{children}</>;
}
