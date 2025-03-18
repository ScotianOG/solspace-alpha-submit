# SOLspace Free Tier Setup

This document provides instructions for setting up and running SOLspace in free tier mode, which allows you to run the platform with minimal API usage within Twitter's free tier limits.

## Prerequisites

1. Node.js 16+ and npm/yarn
2. PostgreSQL database
3. Twitter API key (free tier)
4. SONIC-compatible wallet (Backpack, Nightly, OKX, or Bybit)

## Setup Steps

### 1. Initialize the Environment

SOLspace has already been configured to work in free tier mode. The `.env` file has been set with:
```
NEXT_PUBLIC_SERVICE_MODE="free_tier"
```

### 2. Twitter API Configuration

The free tier setup requires valid Twitter API credentials. To update your Twitter API credentials:

1. Go to the [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a Project with at least Basic (v2) API access
3. Generate API keys and tokens for your app
4. Update the following values in your `.env` file:
   ```
   TWITTER_API_KEY="your_api_key"
   TWITTER_API_SECRET="your_api_secret"
   TWITTER_BEARER_TOKEN="your_bearer_token"
   TWITTER_ACCESS_TOKEN="your_access_token"
   TWITTER_ACCESS_SECRET="your_access_secret"
   ```

### 3. SONIC Testnet Setup

If you want to deploy to SONIC testnet:

1. Get SONIC testnet SOL from the faucet: https://faucet.sonic.game/
2. Deploy the Solana program:
   ```bash
   ./scripts/deploy-free-tier.sh
   ```

## Running in Free Tier Mode

### Option 1: Using the Convenience Script

The repository includes a script that starts the system in free tier mode:

```bash
./scripts/run-free-tier.sh
```

This script:
- Verifies PostgreSQL is running
- Ensures the database is migrated
- Sets the service mode to "free_tier" if not already set
- Starts the development server

### Option 2: Manual Steps

If you prefer to run the steps manually:

1. Ensure PostgreSQL is running
2. Apply database migrations:
   ```bash
   npx prisma migrate dev
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Free Tier Limitations

The Twitter API free tier has significant limitations:

- Only 1 request per 15 minutes for most endpoints
- Limited to 17 POST requests per 24 hours

SOLspace's free tier mode accounts for these limitations by:

1. Using extensive caching
2. Implementing strict rate limiting
3. Prioritizing content with higher viral potential
4. Queuing operations to stay within limits

## Testing Twitter API Connection

To test if your Twitter API credentials are correctly configured:

```bash
node --experimental-specifier-resolution=node tests/test-twitter-api.js
```

This will attempt to make a simple API call and display the result or error information.

## Troubleshooting

### API Rate Limit Errors

If you see rate limit errors, this is expected with the free tier. The system will queue operations and retry them when the rate limit resets.

### Database Connection Issues

If you get database connection errors:
1. Ensure PostgreSQL is running
2. Check the database connection string in `.env`
3. Verify the database exists with: `psql -c "\l" | grep solspace`

### Running on a Different Port

If port 3000 is already in use, you can specify a different port:
```bash
npm run dev -- -p 3001
