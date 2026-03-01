import React from 'react';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, SignOutButton } from '@clerk/clerk-react';
import { LogoSVG } from './Logo';

export function AuthNavbar() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
      <LogoSVG size="xs-sm" showText={false} className="flex-shrink-0" />
      <nav className="flex items-center gap-3">
        <SignedOut>
          <SignInButton mode="redirect" redirectUrl="/sign-in" forceRedirectUrl="/dashboard">
            <button className="px-3 py-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg">
              Sign in
            </button>
          </SignInButton>
          <SignUpButton mode="redirect" redirectUrl="/sign-up" forceRedirectUrl="/dashboard">
            <button className="px-3 py-1.5 text-sm font-medium bg-teal-600 text-white hover:bg-teal-700 rounded-lg">
              Sign up
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/sign-in" />
          <SignOutButton redirectUrl="/sign-in">
            <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              Sign out
            </button>
          </SignOutButton>
        </SignedIn>
      </nav>
    </header>
  );
}
