#!/bin/bash

# Script to get FVC API configuration values
# Run this from your terminal to get the values for .env.local

echo "🔍 Getting FVC API configuration using fvc-devl profile..."
echo ""

# Get the API Gateway URL from your FVC API stack
echo "📡 Getting API Gateway URL..."
FVC_API_URL=$(aws cloudformation describe-stacks \
    --stack-name sam-fvc-api-deploy \
    --region us-east-2 \
    --profile fvc-devl \
    --query 'Stacks[0].Outputs[?OutputKey==`HttpApiGwUrl`].OutputValue' \
    --output text 2>/dev/null)

if [ ! -z "$FVC_API_URL" ]; then
    echo "✅ FVC API URL: $FVC_API_URL"
else
    echo "❌ Could not find FVC API URL. Checking available outputs..."
    aws cloudformation describe-stacks \
        --stack-name sam-fvc-api-deploy \
        --region us-east-2 \
        --profile fvc-devl \
        --query 'Stacks[0].Outputs[].{Key:OutputKey,Value:OutputValue}' \
        --output table
fi

echo ""

# Get Cognito User Pool ID from your FVC API stack
echo "🔐 Getting Cognito User Pool ID..."
USER_POOL_ID=$(aws cloudformation describe-stacks \
    --stack-name sam-fvc-api-deploy \
    --region us-east-2 \
    --profile fvc-devl \
    --query 'Stacks[0].Parameters[?ParameterKey==`CognitoUserPoolId`].ParameterValue' \
    --output text 2>/dev/null)

if [ ! -z "$USER_POOL_ID" ]; then
    echo "✅ User Pool ID: $USER_POOL_ID"
else
    echo "❌ Could not find User Pool ID from stack parameters. Checking parameters..."
    aws cloudformation describe-stacks \
        --stack-name sam-fvc-api-deploy \
        --region us-east-2 \
        --profile fvc-devl \
        --query 'Stacks[0].Parameters[].{Key:ParameterKey,Value:ParameterValue}' \
        --output table
fi

echo ""

# Get Cognito User Pool Client ID from your FVC API stack
echo "🔑 Getting Cognito User Pool Client ID..."
CLIENT_ID=$(aws cloudformation describe-stacks \
    --stack-name sam-fvc-api-deploy \
    --region us-east-2 \
    --profile fvc-devl \
    --query 'Stacks[0].Parameters[?ParameterKey==`CognitoUserPoolClientId`].ParameterValue' \
    --output text 2>/dev/null)

if [ ! -z "$CLIENT_ID" ]; then
    echo "✅ User Pool Client ID: $CLIENT_ID"
else
    echo "❌ Could not find User Pool Client ID from stack parameters."
fi

echo ""
echo "📝 Update your .env.local file with these values:"
echo ""
echo "NEXT_PUBLIC_COGNITO_USER_POOL_ID=$USER_POOL_ID"
echo "NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=$CLIENT_ID"
echo "NEXT_PUBLIC_AWS_REGION=us-east-2"
echo "NEXT_PUBLIC_FVC_API_URL=$FVC_API_URL"
echo "NEXT_PUBLIC_ENVIRONMENT=development"
echo ""

# Test API connectivity
if [ ! -z "$FVC_API_URL" ]; then
    echo "🧪 Testing API connectivity..."
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${FVC_API_URL}season" 2>/dev/null)
    
    if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "404" ]; then
        echo "✅ API is reachable (HTTP $HTTP_STATUS)"
    else
        echo "⚠️  API returned HTTP $HTTP_STATUS - check if the API is deployed correctly"
    fi
else
    echo "⚠️  Cannot test API connectivity without URL"
fi

echo ""
echo "🚀 Once you update .env.local, run: npm run dev"