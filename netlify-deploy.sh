#!/bin/bash

echo "====================================="
echo "Preparing Solspace UI for Netlify Deployment"
echo "====================================="

# Create a production .env file for Netlify
cat > .env.production << EOL
# Solana Configuration
NEXT_PUBLIC_SOLANA_RPC_URL="https://api.testnet.sonic.game/"
NEXT_PUBLIC_PROGRAM_ID="9C2HRbrbvf3baZ8vXhQgiDjJRU1K6JoxUSBhpQsuPW3"
NEXT_PUBLIC_NETWORK="testnet"

# Service Mode Configuration (enhanced, simple, free_tier, mock)
NEXT_PUBLIC_SERVICE_MODE="free_tier"
EOL

echo "✅ Created production environment file"

# Install Netlify CLI if not already installed
if ! command -v netlify &> /dev/null; then
    echo "Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Run build to verify everything works
echo "Building application to verify configuration..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Netlify
echo "Deploying to Netlify..."
netlify deploy --prod

echo "====================================="
echo "Deployment process complete!"
echo "====================================="
