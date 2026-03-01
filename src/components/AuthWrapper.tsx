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
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const configureAmplify = async () => {
      try {
        const { getCurrentUser, signOut } = await import('aws-amplify/auth');
        
        // Check if there's a current user and validate the session
        try {
          await getCurrentUser();
          // Session is valid, continue
        } catch (error) {
          // Session is invalid or expired, clear it
          console.log('Invalid session detected, clearing...');
          try {
            await signOut();
          } catch (signOutError) {
            // If signOut fails, force clear storage
            localStorage.clear();
            sessionStorage.clear();
          }
        }
      } catch (error) {
        console.error('Error configuring auth:', error);
      } finally {
        setIsConfigured(true);
      }
    };

    configureAmplify();
  }, []);

  const clearSession = async () => {
    try {
      const { signOut } = await import('aws-amplify/auth');
      await signOut({ global: true });
    } catch (error) {
      console.error('Error clearing session:', error);
    }
    // Force clear all storage
    localStorage.clear();
    sessionStorage.clear();
    // Clear all cookies for this domain
    document.cookie.split(";").forEach((c) => {
      const name = c.split("=")[0].trim();
      document.cookie = name + "=;expires=" + new Date().toUTCString() + ";path=/;Secure";
    });
    window.location.reload();
  };

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Authenticator 
      hideSignUp={true}
      services={{
        async handleSignIn(formData) {
          try {
            const { signIn } = await import('aws-amplify/auth');
            const { username, password } = formData;
            return await signIn({ username, password });
          } catch (error: any) {
            // Normalize error messages to prevent user enumeration
            if (error.name === 'UserNotFoundException' || 
                error.name === 'NotAuthorizedException' ||
                error.name === 'UserNotConfirmedException') {
              const normalizedError = new Error('Invalid username or password');
              normalizedError.name = 'AuthError';
              throw normalizedError;
            }
            // Re-throw other errors as-is
            throw error;
          }
        }
      }}
      components={{
        Header() {
          return (
            <div className="text-center mb-4">
              <h1 className="text-xl font-semibold text-gray-900 mb-4">
                Freedom Valley Campground Admin
              </h1>
              <details className="text-xs text-gray-500">
                <summary className="cursor-pointer hover:text-gray-700">
                  Troubleshooting
                </summary>
                <div className="mt-2">
                  <p className="mb-2">Having persistent login issues?</p>
                  <button
                    onClick={clearSession}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
                  >
                    Clear Session Data
                  </button>
                </div>
              </details>
            </div>
          );
        }
      }}
    >
      {({ signOut, user }) => (
        <AuthenticatedContent user={user} signOut={signOut || undefined}>
          {children}
        </AuthenticatedContent>
      )}
    </Authenticator>
  );
}