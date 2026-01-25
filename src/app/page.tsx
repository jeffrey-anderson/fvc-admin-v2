'use client';

import AuthWrapper from '@/components/AuthWrapper';
import UserManagement from '@/components/UserManagement';
import FvcApiManagement from '@/components/FvcApiManagement';
import ClientOnly from '@/components/AmplifyProvider';
import AmplifyConfig from '@/components/AmplifyConfig';

export default function Home() {
  return (
    <ClientOnly>
      <AmplifyConfig>
        <AuthWrapper>
          <div className="px-4 py-6 sm:px-0">
            <div className="space-y-8">
              <FvcApiManagement />
              <UserManagement />
            </div>
          </div>
        </AuthWrapper>
      </AmplifyConfig>
    </ClientOnly>
  );
}