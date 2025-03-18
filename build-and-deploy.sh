#!/bin/bash

echo "====================================="
echo "Building and Deploying Solspace Program"
echo "====================================="

# Navigate to program directory
cd program || { echo "Cannot find program directory"; exit 1; }

# Build the program
echo "Building program..."
cargo build-sbf || { echo "Build failed"; exit 1; }

# Deploy the program
echo "Deploying program..."
anchor deploy || { echo "Deployment failed"; exit 1; }

# Return to main directory
cd ..

# Extract IDL
echo "Extracting IDL..."
node scripts/extract-idl.js || { echo "IDL extraction failed"; exit 1; }

echo "====================================="
echo "Program successfully built and deployed!"
echo "====================================="
echo "Now you can mint viral posts without requiring a Counter account."
echo "Use the following command to mint a viral post:"
echo "node bypass-mint-viral.js"
echo "====================================="
