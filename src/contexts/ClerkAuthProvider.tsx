import React, { useMemo } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { AuthContext } from './AuthContext';
import type { AppUser } from '../types/auth';

interface ClerkAuthProviderProps {
  children: React.ReactNode;
}

/**
 * Provides AuthContext values derived from Clerk. Bridges Clerk user to the app's useAuth hook.
 */
export function ClerkAuthProvider({ children }: ClerkAuthProviderProps) {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const value = useMemo(() => {
    if (!isLoaded || !user) {
      return {
        user: null,
        profile: null,
        loading: !isLoaded,
        login: async () => {},
        logout: async () => {
          await signOut?.({ redirectUrl: '/sign-in' });
        },
        refreshProfile: async () => {},
      };
    }

    const appUser: AppUser = {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress ?? '',
      name: user.fullName ?? user.primaryEmailAddress?.emailAddress ?? 'User',
      avatar: user.imageUrl,
      role: 'teacher',
    };

    return {
      user: appUser,
      profile: null,
      loading: false,
      login: async () => {},
      logout: async () => {
        await signOut?.({ redirectUrl: '/sign-in' });
      },
      refreshProfile: async () => {},
    };
  }, [user, isLoaded, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
