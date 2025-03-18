#!/bin/bash

# SOLspace SONIC Deployment Script
# This script automates the deployment of SOLspace to SONIC mainnet

# Exit on error
set -e

echo "===== SOLspace SONIC Deployment ====="
echo "Starting deployment process..."

# Check if SONIC RPC URL is set
if [ -z "$SOLANA_RPC_URL" ]; then
  echo "Setting SONIC testnet RPC URL..."
  # Use the latest testnet RPC URL from documentation
  export SOLANA_RPC_URL="https://rpc.testnet-alpha.sonic.game"
  echo "Using RPC URL: $SOLANA_RPC_URL"
fi

# Step 1: Install dependencies
echo "Installing dependencies..."
npm install

# Step 2: Build the application
echo "Building SOLspace application..."
npm run build

# Step 3: Deploy smart contract (if needed)
echo "Deploying smart contract to SONIC testnet..."
cd program
anchor build

echo "Deploying Anchor program..."
anchor deploy --provider.cluster $SOLANA_RPC_URL

# Step 4: Update program ID in environment
echo "Updating program ID in environment..."
PROGRAM_ID=$(solana address -k target/deploy/solspace-keypair.json)
cd ..
sed -i "s/PROGRAM_ID=.*/PROGRAM_ID=\"$PROGRAM_ID\"/" .env

# Step 5: Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Step 6: Create tier badge images
echo "Creating tier badge images..."
mkdir -p public/images/tiers

# Step 7: Test the deployment
echo "Testing deployment..."
echo "Checking API health..."
curl -s http://localhost:3000/api/health || echo "API not running yet, will need to be started manually"

echo "===== Deployment Complete ====="
echo "Program ID: $PROGRAM_ID"
echo ""
echo "Next steps:"
echo "1. Start the application: npm run start"
echo "2. Run the viral monitoring: npm run monitor-viral"
echo "3. Test the claim flow: http://localhost:3000/claim-nft"
echo ""
echo "For more details, see SONIC_DEPLOYMENT.md"
