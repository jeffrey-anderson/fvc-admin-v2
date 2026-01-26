'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { ReactNode, useState, useEffect } from 'react';

interface AuthWrapperProps {
  children: ReactNode;
}

function AuthenticatedContent({ children, user, signOut }: { children: ReactNode, user: any, signOut?: () => void }) {
  const [userAttributes, setUserAttributes] = useState<any>(null);

  useEffect(() => {
    const fetchAttributes = async () => {
      if (user) {
        try {
          const { fetchUserAttributes } = await import('aws-amplify/auth');
          const attributes = await fetchUserAttributes();
          setUserAttributes(attributes);
        } catch (error) {
          console.error('Error fetching user attributes:', error);
        }
      }
    };
    
    fetchAttributes();
  }, [user]);

  const displayName = userAttributes?.name || 
                     userAttributes?.given_name || 
                     userAttributes?.['custom:given_name'] || 
                     user?.signInDetails?.loginId?.split('@')[0] || 
                     'User';

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Freedom Valley Campground Website Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {displayName}
              </span>
              <button
                onClick={signOut || (() => {})}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 mt-6">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © 2007 — {new Date().getFullYear()} Freedom Valley Campground. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  return (
    <Authenticator 
      hideSignUp={true}
    >
      {({ signOut, user }) => (
        <AuthenticatedContent user={user} signOut={signOut || undefined}>
          {children}
        </AuthenticatedContent>
      )}
    </Authenticator>
  );
}