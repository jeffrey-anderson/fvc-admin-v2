'use client';

export default function UserManagement() {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            User Management
          </h3>
        </div>

        <div className="text-center py-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.239" />
            </svg>
          </div>
          
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            Manage Users in AWS Console
          </h4>
          
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            User management is handled through the AWS Cognito Console. This admin interface focuses on managing your FVC API data.
          </p>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <h5 className="font-medium text-gray-900 mb-2">To manage users:</h5>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Go to the AWS Cognito Console</li>
                <li>Navigate to your User Pool</li>
                <li>Use the "Users" tab to create, view, or delete users</li>
                <li>Set temporary passwords that users must change on first login</li>
              </ol>
            </div>
            
            <a
              href="https://console.aws.amazon.com/cognito/users/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Open AWS Cognito Console
              <svg className="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}