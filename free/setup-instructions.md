# SOLspace MVP Setup Instructions for SONIC Testnet

These instructions will help you set up and run the SOLspace MVP on SONIC testnet using the free Twitter API tier for testing purposes.

## Prerequisites

1. Node.js 16+ and npm/yarn
2. Git
3. Twitter API key (free tier for testing)
4. SONIC-compatible wallet (Backpack, Nightly, OKX, or Bybit)

## Setup Steps

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/your-repo/solspace-mvp.git
cd solspace-mvp
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```
# Network configuration (testnet or mainnet)
NEXT_PUBLIC_NETWORK=testnet

# Twitter API keys (even free tier requires these)
NEXT_PUBLIC_TWITTER_API_KEY=your_api_key
NEXT_PUBLIC_TWITTER_API_SECRET=your_api_secret
NEXT_PUBLIC_TWITTER_BEARER_TOKEN=your_bearer_token

# For development
NEXT_PUBLIC_DEBUG_MODE=true
```

### 3. Get SONIC Testnet SOL

1. Visit the SONIC faucet: https://faucet.sonic.game/
2. Connect your wallet
3. Request testnet tokens

### 4. Launch Development Server

```bash
npm run dev
```

The app will be available at http://localhost:3000

## Free Tier Limitations

The Twitter API free tier has severe limitations:

- Only 1 request per 15 minutes for most endpoints
- Limited to 17 POST requests per 24 hours

These limitations are reflected in the code, which:

1. Uses caching extensively
2. Implements stringent rate limiting
3. Prioritizes truly viral content
4. Queues notifications to stay within limits

## Testing the MVP

Even with free tier limitations, you can test the core functionality:

1. **Viral Detection**: Will check Twitter (once per 15 minutes)
2. **NFT Minting**: Simulated for testing, but contract calls are ready for upgrade
3. **Notifications**: Queued and limited to stay within free tier limits
4. **Wallet Integration**: Fully functional with SONIC-compatible wallets

## Preparing for Submission

Before submitting to the hackathon:

1. Upgrade to Twitter API Basic or Pro tier
2. Update the API keys in `.env.local`
3. Deploy contracts to SONIC mainnet
4. Set `NEXT_PUBLIC_NETWORK=mainnet` in your environment

## Notes on Testnet vs Mainnet

The code is configured to support both environments through environment variables. When you're ready to move to mainnet:

1. Update `NEXT_PUBLIC_NETWORK=mainnet`
2. Make sure your wallet has actual SONIC tokens
3. The code will automatically use the correct RPC endpoints

## Common Issues

1. **Rate Limit Errors**: Expected with free tier, check logs for details
2. **Wallet Connection Issues**: Make sure you're using a supported wallet
3. **No Viral Content Found**: Free tier is very limited, try raising viral content thresholds
