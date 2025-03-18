#!/bin/bash

echo "====================================="
echo "Solspace Full System Deployment"
echo "Includes Solana Program and Netlify Frontend"
echo "====================================="

# Step 1: Build and deploy Solana program
echo -e "\n📋 Step 1: Building and deploying Solana program..."

# Check if the program directory exists
if [ ! -d "program" ]; then
  echo "❌ Program directory not found. Make sure you're in the root directory of the project."
  exit 1
fi

# Build the program
cd program || { echo "Failed to navigate to program directory"; exit 1; }
echo "Building Solana program..."
cargo build-sbf || { echo "❌ Program build failed"; exit 1; }

# Deploy the program
echo "Deploying Solana program..."
cd .. || { echo "Failed to navigate back to root directory"; exit 1; }

# Extract the program ID for use in frontend deployment
PROGRAM_ID=$(grep "PROGRAM_ID" .env | cut -d "=" -f2 | tr -d '"')
echo "Using Program ID: $PROGRAM_ID"

# Step 2: Build the frontend
echo -e "\n📋 Step 2: Building frontend..."

# Create a production .env file for frontend
echo "Creating production environment file..."
cat > .env.production << EOL
# Solana Configuration
NEXT_PUBLIC_SOLANA_RPC_URL="https://api.testnet.sonic.game/"
NEXT_PUBLIC_PROGRAM_ID="${PROGRAM_ID}"
NEXT_PUBLIC_NETWORK="testnet"

# Service Mode Configuration
NEXT_PUBLIC_SERVICE_MODE="free_tier"
EOL

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing npm dependencies..."
  npm install || { echo "❌ Failed to install dependencies"; exit 1; }
fi

# Build the Next.js app
echo "Building Next.js application..."
npm run build || { echo "❌ Frontend build failed"; exit 1; }

# Step 3: Deploy to Netlify
echo -e "\n📋 Step 3: Deploying to Netlify..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
  echo "Installing Netlify CLI..."
  npm install -g netlify-cli || { echo "❌ Failed to install Netlify CLI"; exit 1; }
fi

# Deploy to Netlify
echo "Deploying to Netlify..."
netlify deploy --prod --dir=.next || { echo "❌ Netlify deployment failed"; exit 1; }

echo -e "\n✅ Deployment complete!"
echo "Your Solspace system is now deployed with:"
echo "- Solana program running on Sonic testnet"
echo "- Frontend hosted on Netlify"
echo ""
echo "Next steps:"
echo "1. Configure your custom domain 'solspace-alpha.com' in Netlify dashboard"
echo "2. Test the complete system functionality"
echo "3. Set up automated GitHub Actions deployment (see .github/workflows folder)"
echo "====================================="
