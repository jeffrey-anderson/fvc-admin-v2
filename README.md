# FVC Admin Dashboard

A pure static frontend admin dashboard built with Next.js and AWS Cognito authentication. This application manages your FVC API data and is deployed via AWS CodePipeline to S3 and CloudFront.

## Architecture

- **Frontend**: Next.js (static export) deployed to S3 + CloudFront
- **Authentication**: Uses your existing FVC API's Cognito User Pool
- **Backend**: Calls your existing FVC API directly
- **Deployment**: AWS CodePipeline with CodeBuild to S3/CloudFront
- **Multi-Environment**: Separate development and production accounts

## Features

- ✅ **FVC API Integration**: Manage season and out-of-office data from your existing FVC API
- ✅ **User Management**: Users managed via AWS Cognito Console
- ✅ **AWS Cognito Authentication**: Uses your FVC API's Cognito User Pool
- ✅ **Pure Static**: No backend infrastructure to maintain
- ✅ **CI/CD Ready**: AWS CodePipeline with CodeBuild for automated deployment
- ✅ **Multi-Environment**: Support for development and production accounts
- ✅ **Responsive Design**: Tailwind CSS with mobile-friendly interface
- ✅ **TypeScript Support**: Full type safety throughout the application
- ✅ **Markdown Support**: Rich text formatting for season messages

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Your FVC API deployed with Cognito authentication
- S3 bucket and CloudFront distribution

### 1. Clone and Install

```bash
git clone <your-repo>
cd fvc-admin-dashboard
npm install
```

### 2. Configure Environment

For local development, use the development environment configuration:

```bash
cp .env.devl .env.local
```

Or run the configuration script to automatically extract settings from your deployed FVC API:

```bash
./get-fvc-config.sh
```

This will populate `.env.local` with:
- `NEXT_PUBLIC_COGNITO_USER_POOL_ID`: Your FVC API's Cognito User Pool ID
- `NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID`: Your FVC API's Cognito User Pool Client ID
- `NEXT_PUBLIC_FVC_API_URL`: Your FVC API URL
- `NEXT_PUBLIC_AWS_REGION`: AWS region (us-east-2)

### 3. Local Development

```bash
npm run dev
```

Visit `http://localhost:3000` and log in with your FVC API Cognito credentials.

### 4. Deploy

#### AWS CodePipeline Deployment

This project uses AWS CodePipeline with CodeBuild for automated deployment:

1. **Development Environment**: 
   - Uses `buildspec-devl.yml`
   - Copies `.env.devl` to `.env.local` during build
   - Deploys to development AWS account

2. **Production Environment**:
   - Uses `buildspec-prod.yml` 
   - Copies `.env.prod` to `.env.local` during build
   - Deploys to production AWS account

Set up CodePipeline projects pointing to your repository with the appropriate buildspec file for each environment.

#### Manual Deployment

```bash
npm run build
aws s3 sync out/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## Project Structure

```
├── src/                        # Next.js application
│   ├── app/
│   │   ├── layout.tsx         # Root layout with metadata
│   │   ├── page.tsx           # Main dashboard page
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── UserManagement.tsx  # User management guidance
│   │   ├── FvcApiManagement.tsx # FVC API data management
│   │   ├── AuthWrapper.tsx     # Authentication wrapper
│   │   └── AmplifyProvider.tsx # AWS Amplify configuration
│   └── lib/
│       └── amplify.ts         # Amplify configuration
├── public/                     # Static assets
│   ├── favicon.ico            # Site favicon
│   └── apple-touch-icon.png   # Apple touch icons
├── buildspec-devl.yml         # CodeBuild spec for development
├── buildspec-prod.yml         # CodeBuild spec for production
├── .env.devl                  # Development environment config
├── .env.prod                  # Production environment config
├── get-fvc-config.sh          # Script to extract API configuration
├── create-test-user.sh        # Script to create test users
├── INFRASTRUCTURE_SETUP.md    # Infrastructure setup guide
└── README.md
```

## Development

For local development:

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:3000`.

## FVC API Integration

This admin interface calls your FVC API endpoints:

- `GET /season` - Get current season data
- `PUT /season` - Update season data (requires authentication)
- `GET /events/ooo` - Get out-of-office data
- `PUT /events/ooo` - Update out-of-office data (requires authentication)
- `DELETE /events/ooo` - Delete out-of-office data (requires authentication)

## Authentication Flow

1. User logs in with Cognito credentials (from your FVC API User Pool)
2. Application gets JWT token from Cognito
3. JWT token is passed to FVC API in Authorization header
4. FVC API validates token against the same Cognito User Pool

## User Management

User management is handled through the AWS Cognito Console:

1. Go to AWS Cognito Console
2. Navigate to your FVC API's User Pool
3. Use the "Users" tab to create, view, or delete users
4. Set temporary passwords that users must change on first login

## Multi-Environment Deployment

### Development Environment
- Uses `.env.devl` configuration
- Deploys via `buildspec-devl.yml`
- Typically connected to a development branch in CodePipeline

### Production Environment  
- Uses `.env.prod` configuration
- Deploys via `buildspec-prod.yml`
- Typically connected to the main branch in CodePipeline

Each environment can use:
- Separate AWS accounts for isolation
- Same FVC API endpoints (or separate dev/prod APIs)
- Same Cognito User Pool or separate pools per environment

## Infrastructure

This application requires:

1. **S3 Bucket**: For hosting static files
2. **CloudFront Distribution**: For global CDN and HTTPS
3. **Your existing FVC API**: With Cognito authentication
4. **AWS CodePipeline**: For automated deployment (optional)
5. **AWS CodeBuild**: For building the application

## Configuration Files

### Environment Files
- `.env.devl`: Development environment configuration
- `.env.prod`: Production environment configuration (update with actual values)
- `.env.local`: Local development (created from .env.devl or get-fvc-config.sh)

### Build Specifications
- `buildspec-devl.yml`: CodeBuild specification for development deployment
- `buildspec-prod.yml`: CodeBuild specification for production deployment

### Utility Scripts
- `get-fvc-config.sh`: Extracts configuration from deployed FVC API stack
- `create-test-user.sh`: Creates test users in Cognito (requires AWS CLI)

## Cost Considerations

This setup uses minimal AWS services:
- **S3**: Storage costs for static files (minimal)
- **CloudFront**: Free tier includes 1TB data transfer/month
- **No Lambda or API Gateway costs**: Pure static application

## Troubleshooting

### Common Issues

1. **Authentication errors**: Verify Cognito User Pool ID and Client ID are correct in your environment file
2. **API call failures**: Check FVC API URL and ensure it's accessible
3. **CORS errors**: Verify your domain is in the FVC API's CORS configuration
4. **Build failures**: Check environment variables are set correctly in buildspec files
5. **Favicon not updating**: Clear browser cache or try incognito mode

### Debugging

- Check browser console for JavaScript errors
- Verify network requests in browser dev tools  
- Check CloudWatch logs for your FVC API if API calls fail
- Use `./get-fvc-config.sh` to verify API configuration
- Test API endpoints directly with `node test-api.js`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

[Your License Here]