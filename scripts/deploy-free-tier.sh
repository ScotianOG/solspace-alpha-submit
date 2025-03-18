#!/bin/bash

set -e

echo "Building and deploying SOLspace program for SONIC free tier..."

# Set Solana to SONIC testnet with the wallet keypair
echo "Setting up SONIC testnet connection..."
solana config set --url https://api.testnet.sonic.game --keypair program/solspace-keypair.json

# Build the program
echo "Building Solana program..."
cd program
cargo build-sbf

# Deploy the program
echo "Deploying to SONIC testnet..."
solana program deploy target/deploy/solspace.so \
  --keypair solspace-keypair.json \
  --program-id program-keypair.json

echo "Deployment completed successfully!"
echo ""
echo "Program is now ready for SOLspace free tier operation."
echo "Note: The program errors in the IDE are expected due to the proc macros."
echo "The program will compile and deploy correctly with the Anchor build system."
