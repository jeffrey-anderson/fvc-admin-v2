'use client';

import { Amplify } from 'aws-amplify';
import { useEffect, ReactNode } from 'react';

interface AmplifyConfigProps {
  children: ReactNode;
}

export default function AmplifyConfig({ children }: AmplifyConfigProps) {
  useEffect(() => {
    // Only configure Amplify on the client side
    const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
    const userPoolClientId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID;
    const region = process.env.NEXT_PUBLIC_AWS_REGION;

    if (!userPoolId || !userPoolClientId || !region) {
      console.error('Missing Amplify configuration:', {
        userPoolId: !!userPoolId,
        userPoolClientId: !!userPoolClientId,
        region: !!region,
      });
      return;
    }

    const amplifyConfig = {
      Auth: {
        Cognito: {
          userPoolId,
          userPoolClientId,
          region,
          signUpVerificationMethod: 'code' as const,
          loginWith: {
            email: true,
          },
        },
      },
    };

    console.log('Configuring Amplify with:', {
      userPoolId,
      userPoolClientId,
      region,
    });

    try {
      Amplify.configure(amplifyConfig);
      console.log('Amplify configured successfully');
    } catch (error) {
      console.error('Failed to configure Amplify:', error);
    }
  }, []);

  return <>{children}</>;
}