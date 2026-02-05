import { Amplify } from 'aws-amplify';

// Create a unique storage key based on the hostname
const getStorageKey = () => {
  // Use hostname to determine environment automatically
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '';
  // Use the last part of the user pool ID to create a unique namespace
  const poolSuffix = userPoolId.split('_')[1] || 'default';
  
  // Map hostnames to environment names
  let environment = 'development';
  if (hostname.includes('admin-preview.')) {
    environment = 'preview';
  } else if (hostname.includes('admin.')) {
    environment = 'production';
  } else if (hostname === 'localhost') {
    environment = 'local';
  }
  
  return `fvc-admin-${environment}-${poolSuffix}`;
};

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID!,
      region: process.env.NEXT_PUBLIC_AWS_REGION!,
      signUpVerificationMethod: 'code' as const,
      loginWith: {
        email: true,
      },
    },
  },
};

// Configure Amplify
Amplify.configure(amplifyConfig, { ssr: true });

// Simple approach: Clear localStorage on hostname change
if (typeof window !== 'undefined') {
  const currentStorageKey = getStorageKey();
  const lastStorageKey = localStorage.getItem('fvc-admin-storage-key');
  
  // If we're switching between different environments, clear auth storage
  if (lastStorageKey && lastStorageKey !== currentStorageKey) {
    // Clear all Amplify/Cognito related items
    Object.keys(localStorage).forEach(key => {
      if (key.includes('amplify') || key.includes('cognito') || key.includes('aws') || key.includes('CognitoIdentityServiceProvider')) {
        localStorage.removeItem(key);
      }
    });
  }
  
  // Store current storage key
  localStorage.setItem('fvc-admin-storage-key', currentStorageKey);
}

export default amplifyConfig;