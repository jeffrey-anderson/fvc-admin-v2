#!/bin/bash

# Script to create a test user in your FVC Cognito User Pool
# Usage: ./create-test-user.sh [devl|prod]

ACCOUNT=${1:-devl}
EMAIL="admin@test.com"
TEMP_PASSWORD="TempPass123!"

if [ "$ACCOUNT" = "devl" ]; then
    USER_POOL_ID="us-east-2_kUcf8yv7H"
    PROFILE="fvc-devl"
elif [ "$ACCOUNT" = "prod" ]; then
    USER_POOL_ID="REPLACE_WITH_PROD_USER_POOL_ID"
    PROFILE="fvc-prod"
else
    echo "❌ Invalid account. Use: ./create-test-user.sh [devl|prod]"
    exit 1
fi

echo "👤 Creating test user in $ACCOUNT Cognito User Pool..."
echo "📧 Email: $EMAIL"
echo "🔑 Temporary Password: $TEMP_PASSWORD"
echo ""

# Create the user
aws cognito-idp admin-create-user \
    --user-pool-id $USER_POOL_ID \
    --username $EMAIL \
    --user-attributes Name=email,Value=$EMAIL Name=email_verified,Value=true \
    --temporary-password $TEMP_PASSWORD \
    --message-action SUPPRESS \
    --region us-east-2 \
    --profile $PROFILE

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Test user created successfully in $ACCOUNT account!"
    echo ""
    echo "📋 Login credentials:"
    echo "   Email: $EMAIL"
    echo "   Temporary Password: $TEMP_PASSWORD"
    echo ""
    echo "🚀 Now you can:"
    echo "1. Visit http://localhost:3000"
    echo "2. Log in with these credentials"
    echo "3. You'll be prompted to set a new password"
    echo "4. Test the FVC API Management features"
else
    echo ""
    echo "❌ Failed to create user. The user might already exist."
    echo "   You can delete the existing user and try again, or use different credentials."
fi