#!/bin/bash

set -e

echo "Starting SOLspace in free tier mode..."

# Check if PostgreSQL is running
echo "Checking PostgreSQL status..."
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
  echo "❌ PostgreSQL is not running! Please start it first."
  echo "   You can usually start it with: sudo service postgresql start"
  exit 1
fi

# Ensure the database is migrated
echo "Ensuring database is up to date..."
npx prisma migrate dev

# Set up environment for the free tier mode
echo "Configuring free tier mode..."
if ! grep -q "NEXT_PUBLIC_SERVICE_MODE=\"free_tier\"" .env; then
  # Backup the existing .env file
  cp .env .env.backup
  # Update the service mode
  sed -i 's/NEXT_PUBLIC_SERVICE_MODE=.*/NEXT_PUBLIC_SERVICE_MODE="free_tier"/' .env
  echo "✅ Updated .env to use free tier mode"
else
  echo "✅ Free tier mode already configured"
fi

# Run the application in development mode
echo "Starting the application in development mode..."
echo "Note: Free tier limits Twitter API requests to 1 per 15 minutes"
echo "      The application will use caching to minimize API requests"
echo ""
echo "Press Ctrl+C to stop the server when done."
echo ""
npm run dev
