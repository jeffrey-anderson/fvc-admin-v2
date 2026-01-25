# FVC Admin Dashboard

A pure static frontend admin dashboard built with Next.js and AWS Cognito authentication. This application manages your FVC API data and is deployed via CI/CD to S3 and CloudFront.

## Architecture

- **Frontend**: Next.js (static export) deployed to S3 + CloudFront
- **Authentication**: Uses your existing FVC API's Cognito User Pool
- **Backend**: Calls your existing FVC API directly
- **Deployment**: GitHub Actions or CodePipeline to S3/CloudFront

## Features

- ✅ **FVC API Integration**: Manage season and out-of-office data from your existing FVC API
- ✅ **User Management**: Guided interface to manage users via AWS Console
- ✅ **AWS Cognito Authentication**: Uses your FVC API's Cognito User Pool
- ✅ **Pure Static**: No backend infrastructure to maintain
- ✅ **CI/CD Ready**: GitHub Actions workflow for automated deployment
- ✅ **Multi-Environment**: Support for main and preview deployments
- ✅ **Responsive Design**: Tailwind CSS with mobile-friendly interface
- ✅ **TypeScript Support**: Full type safety throughout the application

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Your FVC API deployed with Cognito authentication
- S3 bucket and CloudFront distribution (see [Infrastructure Setup](INFRASTRUCTURE_SETUP.md))

### 1. Clone and Install

```bash
git clone <your-repo>
cd fvc-admin-dashboard
npm install
```

### 2. Configure Environment

Copy `.env.local.example` to `.env.local` and update with your values:

```bash
cp .env.local.example .env.local
```

Update the values:
- `NEXT_PUBLIC_COGNITO_USER_POOL_ID`: Your FVC API's Cognito User Pool ID
- `NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID`: Your FVC API's Cognito User Pool Client ID
- `NEXT_PUBLIC_FVC_API_URL`: Your FVC API URL

### 3. Local Development

```bash
npm run dev
```

Visit `http://localhost:3000` and log in with your FVC API Cognito credentials.

### 4. Deploy

#### Option A: GitHub Actions (Recommended)

1. Set up infrastructure (see [Infrastructure Setup](INFRASTRUCTURE_SETUP.md))
2. Configure GitHub secrets (see infrastructure guide)
3. Push to `main` or `preview` branch
4. GitHub Actions will automatically build and deploy

#### Option B: Manual Deployment

```bash
npm run build
aws s3 sync out/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## Project Structure

```
├── src/                        # Next.js application
│   ├── app/
│   ├── components/
│   │   ├── UserManagement.tsx  # User management guidance
│   │   ├── FvcApiManagement.tsx # FVC API data management
│   │   └── AuthWrapper.tsx     # Authentication wrapper
│   └── lib/
├── .github/workflows/          # GitHub Actions
│   └── deploy.yml             # Deployment workflow
├── buildspec.yml              # CodeBuild specification
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

### Deploy to Main Environment

Push to `main` branch or manually trigger workflow with main environment.

### Deploy to Preview Environment

Push to `preview` branch or manually trigger workflow with preview environment.

Each environment uses:
- Separate S3 buckets and CloudFront distributions
- Same FVC API and Cognito User Pool
- Environment-specific configuration

## Infrastructure

This application requires:

1. **S3 Bucket**: For hosting static files
2. **CloudFront Distribution**: For global CDN and HTTPS
3. **Your existing FVC API**: With Cognito authentication

See [Infrastructure Setup](INFRASTRUCTURE_SETUP.md) for detailed setup instructions.

## GitHub Secrets

Configure these secrets in your GitHub repository:

### Required Secrets
- `AWS_ACCESS_KEY_ID`: AWS access key for deployment
- `AWS_SECRET_ACCESS_KEY`: AWS secret key for deployment
- `COGNITO_USER_POOL_ID`: Your FVC API's Cognito User Pool ID
- `COGNITO_USER_POOL_CLIENT_ID`: Your FVC API's Cognito User Pool Client ID
- `FVC_API_URL`: Your FVC API URL

### Environment-Specific Secrets
- `S3_BUCKET_MAIN`: S3 bucket name for main environment
- `S3_BUCKET_PREVIEW`: S3 bucket name for preview environment
- `CLOUDFRONT_DISTRIBUTION_ID_MAIN`: CloudFront distribution ID for main
- `CLOUDFRONT_DISTRIBUTION_ID_PREVIEW`: CloudFront distribution ID for preview

## Cost Considerations

This setup uses minimal AWS services:
- **S3**: Storage costs for static files (minimal)
- **CloudFront**: Free tier includes 1TB data transfer/month
- **No Lambda or API Gateway costs**: Pure static application

## Troubleshooting

### Common Issues

1. **Authentication errors**: Verify Cognito User Pool ID and Client ID are correct
2. **API call failures**: Check FVC API URL and ensure it's accessible
3. **CORS errors**: Verify your domain is in the FVC API's CORS configuration
4. **Build failures**: Check environment variables are set correctly

### Debugging

- Check browser console for JavaScript errors
- Verify network requests in browser dev tools
- Check CloudWatch logs for your FVC API if API calls fail

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

[Your License Here]