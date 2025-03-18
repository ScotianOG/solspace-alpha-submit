# SOLspace - Viral NFT Platform for SONIC

SOLspace is a platform that automatically detects viral Twitter posts and mints them as NFTs on the SONIC blockchain, allowing creators to claim their viral content as digital assets.

## Table of Contents

1. [Features](#features)
2. [Architecture](#architecture)
3. [Quick Start](#quick-start)
4. [System Components](#system-components)
5. [API Endpoints](#api-endpoints)
6. [Development](#development)
7. [Service Modes](#service-modes)
8. [Deployment](#deployment)
   - [Production Deployment](#production-deployment)
   - [SONIC Testnet Deployment](#sonic-testnet-deployment)
   - [SONIC Mainnet Deployment](#sonic-mainnet-deployment)
9. [Interacting with Contracts](#interacting-with-contracts)
10. [Maintenance & Support](#maintenance--support)

## Features

- 🔍 Automated viral post detection
- 🎨 Dynamic NFT generation with tier-based designs
- 🔄 Automatic minting process
- ✅ Twitter account verification
- 💼 Wallet signature verification
- 📊 Real-time monitoring and analytics
- 🚀 Production-ready with error recovery

## Architecture

```mermaid
graph TD
    A[Twitter API] --> B[Viral Detector]
    B --> C[Queue Manager]
    C --> D[NFT Minter]
    D --> E[SONIC Network]
    F[Creator] --> G[Claim Interface]
    G --> H[Verification System]
    H --> I[NFT Transfer]
```

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/your-org/solspace.git
cd solspace
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. Initialize database:
```bash
npx prisma migrate dev
```

5. Start development server:
```bash
npm run dev
```

## System Components

### Viral Detection
- Monitors Twitter for viral posts
- Analyzes engagement metrics
- Calculates viral scores
- Manages detection queue

### NFT Generation
- Dynamic metadata generation
- Tier-based designs
- IPFS storage integration
- Engagement metrics embedding

### Claim System
- Twitter verification
- Wallet signature verification
- NFT transfer handling
- Claim status tracking

### Monitoring
- System health monitoring
- API limit tracking
- Queue monitoring
- Error tracking
- Performance metrics

## API Endpoints

### Viral Posts
- `GET /api/viral/posts` - List viral posts
- `GET /api/viral/status/:tweetId` - Get post status
- `POST /api/viral/mint` - Trigger manual mint

### Claims
- `POST /api/nft/claim` - Claim NFT
- `GET /api/nft/claim/:nftAddress` - Get claim status

### Monitoring
- `GET /api/health` - Basic health check
- `GET /api/health?detailed=true` - Detailed system status

## Development

### Code Structure
```
src/
├── app/              # Next.js app router
├── components/       # React components
├── services/        # Core services
│   ├── common/       # Shared service components
│   ├── enhanced/     # Enhanced mode services
│   ├── simple/       # Simple mode services
│   ├── free/         # Free tier mode services
│   └── mock/         # Mock mode services
├── utils/           # Utility functions
├── types/           # TypeScript types
└── config/          # Configuration
```

### Key Technologies
- Next.js 14
- TypeScript
- Prisma ORM
- PostgreSQL
- SONIC Web3.js
- Twitter API v2
- NFT.storage

### Testing
```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run load tests
npm run test:load
```

## Service Modes

SOLspace supports four different service modes that allow you to run the application with different implementations of key services:

1. **Enhanced Mode (Production)**: Full-featured implementation with optimal performance for production use.
2. **Simple Mode (Testing)**: Simplified implementation for development and testing.
3. **Free Tier Mode (Limited API)**: Implementation designed to work with Twitter's free API tier.
4. **Mock Mode (No API Calls)**: Completely offline mode using mock data for development without API access.

### Configuring Service Mode

To switch between different service modes, set the `NEXT_PUBLIC_SERVICE_MODE` environment variable in your `.env` file:

```
# Options: enhanced, simple, free_tier, mock
NEXT_PUBLIC_SERVICE_MODE="enhanced"
```

Available values:
- `enhanced` (default): Use enhanced implementations for production
- `simple`: Use simplified implementations for testing
- `free_tier`: Use implementations compatible with Twitter's free API tier
- `mock`: Use mock implementations with no external API calls

### Testing Service Modes

You can test the different service modes using the provided test script:

```bash
# Make sure environment variable is set in .env
npx ts-node -r tsconfig-paths/register scripts/test-service-modes.ts
```

### Service Mode Implementations

#### Viral Post Detection

| Mode | Implementation | Description |
|------|----------------|-------------|
| Enhanced | `EnhancedViralPostDetector` | Production-grade implementation with advanced viral detection algorithms |
| Simple | `SimpleViralDetector` | Basic implementation with simplified viral detection |
| Free Tier | `FreeTierViralDetector` | Implementation designed to work within Twitter's free tier API limits |
| Mock | `MockViralDetector` | Uses hardcoded mock data with no API calls |

#### Notifications

| Mode | Implementation | Description |
|------|----------------|-------------|
| Enhanced | `NotificationService` | Production-grade implementation with full notification capabilities |
| Simple | `SimpleNotificationService` | Basic implementation with simplified notification logic |
| Free Tier | `FreeTierNotificationService` | Queue-based implementation to stay within free tier API limits |
| Mock | `MockNotificationService` | Simulates notifications with console output, no API calls |

### Free Tier Limitations

When using the free tier mode, be aware of these limitations:

1. Twitter's free tier API has severe rate limits:
   - Only 1 request per 15 minutes for most endpoints
   - Limited to 17 POST requests per day

2. The free tier implementation addresses these limitations by:
   - Using extensive caching
   - Implementing strict rate limiting
   - Queuing operations to stay within limits
   - Using higher viral thresholds to focus on truly viral content

### When to Use Each Mode

- **Enhanced Mode**: Use in production environments with proper API access.
- **Simple Mode**: Use during development when you have API access but need simpler implementations.
- **Free Tier Mode**: Use when testing with Twitter's free API tier or when demonstrating the application with minimal API usage.
- **Mock Mode**: Use during initial development or when working on UI components without API access.

## Deployment

### Production Deployment

#### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- SONIC validator node access
- Twitter API credentials
- NFT.storage account
- Domain name and SSL certificate
- Environment with at least 4GB RAM and 2 vCPUs

#### Environment Setup

1. Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/solspace"

# SONIC
SOLANA_RPC_URL="https://rpc.mainnet-alpha.sonic.game"
PROGRAM_ID="your_program_id"
NETWORK="mainnet"

# Twitter API
TWITTER_API_KEY="your_api_key"
TWITTER_API_SECRET="your_api_secret"
TWITTER_BEARER_TOKEN="your_bearer_token"

# NFT Storage
NFT_STORAGE_API_KEY="your_api_key"

# Security
JWT_SECRET="your_jwt_secret"
ADMIN_WALLET="admin_wallet_address"

# Rate Limiting
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=100
```

2. Configure PostgreSQL:

```sql
CREATE DATABASE solspace;
CREATE USER solspace_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE solspace TO solspace_user;
```

#### Database Migration

1. Generate Prisma client:
```bash
npx prisma generate
```

2. Run migrations:
```bash
npx prisma migrate deploy
```

3. Create indexes for performance:
```sql
CREATE INDEX idx_viral_posts_status ON viral_posts(mint_status);
CREATE INDEX idx_viral_posts_author ON viral_posts(author_id);
CREATE INDEX idx_claims_status ON claim_status(status);
CREATE INDEX idx_api_limits_endpoint ON api_limits(endpoint);
```

#### Security Measures

1. Configure CORS in `next.config.ts`
2. Set up rate limiting middleware
3. Enable JWT authentication for admin routes
4. Configure wallet signature verification
5. Set up SSL/TLS certificates

#### Monitoring Setup

1. Configure logging with winston
2. Set up monitoring alerts
3. Create monitoring dashboard

#### Performance Optimization

1. Configure caching
2. Optimize database queries
3. Configure auto-scaling

#### Error Recovery

1. Set up automated recovery
2. Configure error notifications
3. Set up automated backups
4. Implement circuit breakers for external services

#### Deployment Steps

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

3. Set up PM2 process manager:
```bash
npm install -g pm2
pm2 start npm --name "solspace" -- start
```

4. Configure Nginx reverse proxy

#### Maintenance

1. Set up automated backups
2. Configure log rotation
3. Schedule regular maintenance

### SONIC Testnet Deployment

#### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ (running locally or accessible remotely)
- SONIC CLI (for keypair management and deployment)
- Twitter API credentials (for viral content detection)
- NFT.storage account (for metadata storage)
- SONIC testnet wallet with SOL (for deployment & testing)

#### Pre-Deployment Checklist

1. **Ensure all configuration files are updated for testnet**
   - `.env` file should point to SONIC testnet: `https://rpc.testnet-alpha.sonic.game`
   - `src/config/sonic.config.ts` should use testnet URLs
   - `scripts/deploy-sonic.sh` should deploy to testnet

2. **Create and fund SONIC testnet wallet**
   - Create a keypair for deployment: `solana-keygen new -o deploy-keypair.json`
   - Visit the SONIC testnet faucet: https://faucet.sonic.game/#/
   - Fund your wallet with testnet SOL

3. **Configure PostgreSQL database**
   - Create a database for the application
   - Update the `DATABASE_URL` in `.env` with your database connection details

4. **Set up required environment variables**
   - Ensure all variables in `.env` are properly set
   - Add your Twitter API credentials
   - Add your NFT.storage API key

#### Deployment Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Initialize the database**
   ```bash
   npx prisma migrate deploy
   ```

3. **Build the application**
   ```bash
   npm run build
   ```

4. **Deploy smart contract to SONIC testnet**
   ```bash
   # Set your keypair as default
   solana config set --keypair ./deploy-keypair.json

   # Set the cluster to SONIC testnet
   solana config set --url https://rpc.testnet-alpha.sonic.game

   # Run the deployment script
   ./scripts/deploy-sonic.sh
   ```

5. **Verify deployment**
   - Check if the program ID was updated in `.env`
   - Verify the smart contract on SONIC explorer
   - Run `solana balance` to check your wallet balance

6. **Start the application**
   ```bash
   npm run start
   ```

7. **Test the flow**
   - Run viral content monitoring: `npm run monitor-viral`
   - Test tier upgrades: `npm run monitor-engagement`
   - Process the minting queue: `npm run process-queue`
   - Send creator notifications: `npm run send-notifications`

#### Testing with Mock Data

If you don't have real viral content, you can use mock data for testing:

1. Create a mock dataset
   ```typescript
   // Create mock tweet data
   const mockTweet = {
     id: "1234567890",
     text: "This is a test viral post #web3 #sonic",
     author_id: "authorid123",
     public_metrics: {
       like_count: 5000,
       retweet_count: 1000,
       reply_count: 200
     },
     created_at: new Date().toISOString()
   };
   ```

2. Call your detection service directly
   ```typescript
   // Import your detector
   import { SimpleViralDetector } from "../services/simple/SimpleViralDetector";
   
   // Initialize detector
   const detector = new SimpleViralDetector("mock-token");
   
   // Process mock tweet
   const viralPosts = detector.processMockData([mockTweet]);
   ```

3. Queue the minting process with mock data
   ```typescript
   // Import your minting service
   import { AutoMintingService } from "../services/common/AutoMintingService";
   
   // Initialize minting service
   const minter = new AutoMintingService();
   
   // Queue minting for the mock viral post
   await minter.queueForMinting(viralPosts[0]);
   
   // Process the queue
   await minter.processMintingQueue();
   ```

### SONIC Mainnet Deployment (6-7 Day Timeline)

#### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Twitter API credentials
- NFT.storage account
- SONIC wallet with mainnet SOL (for deployment & testing)

#### Day 1: Setup & Core Architecture

1. **Update RPC URLs to SONIC mainnet**

   ```bash
   # Update .env file
   SOLANA_RPC_URL="https://rpc.mainnet-alpha.sonic.game"
   NETWORK="mainnet" # SONIC mainnet
   ```

2. **Create testnet accounts for development**
   
   ```bash
   # Use Solana CLI to create new keypairs
   solana-keygen new -o admin-keypair.json
   
   # Fund the accounts using the SONIC faucet
   # Visit: https://faucet.sonic.game/#/
   ```

3. **Set up deployment pipeline**

   ```bash
   # Create a deployment script for automated deployment
   touch scripts/deploy-sonic.sh
   chmod +x scripts/deploy-sonic.sh
   ```

#### Day 2: Smart Contract Implementation

1. **Update program ID in the Rust contract**

   Update `program/src/lib.rs`:
   ```rust
   declare_id!("your_program_id_here");
   ```

2. **Simplify and optimize smart contract**

   Ensure the contract focuses only on:
   - NFT minting
   - Tier upgrades
   - Claim verification

3. **Deploy and test contract**

   ```bash
   cd program
   anchor build
   anchor deploy --provider.cluster https://rpc.mainnet-alpha.sonic.game
   ```

#### Day 3-4: Backend & Frontend Development

1. **Focus on Twitter API integration**
2. **Implement simplified notification system**
3. **Set up scheduled jobs for monitoring**
4. **Update wallet adapter for SONIC**
5. **Create simplified claim flow**

#### Day 5-7: Integration, Testing & Deployment

1. **Connect viral detection to NFT minting service**
2. **Deploy contracts to SONIC mainnet**
3. **Optimize gas usage**
4. **Test with real viral content**
5. **Create user documentation**

## Interacting with Contracts

### Prerequisites

- Node.js v16+ and npm
- TypeScript
- SONIC CLI tools

### Installation

First, install the required dependencies:

```bash
npm install @project-serum/anchor @solana/web3.js @solana/spl-token
npm install typescript ts-node --save-dev
```

### Steps to Interact with the Program

#### 1. Extract the Program IDL

The first step is to extract the program's Interface Description Language (IDL) file, which describes the structure and methods of the SOLspace program:

```bash
ts-node extract-idl.ts
```

#### 2. Initialize the Program (if needed)

Before minting NFTs, the program must be initialized. This only needs to be done once:

```bash
ts-node interact-with-sonic.ts
```

#### 3. Minting and Claiming NFTs

The `interact-with-sonic.ts` script demonstrates three key operations:

1. **Initializing the program**: Sets up the viral authority needed for minting
2. **Minting a viral NFT**: Creates a new NFT with tier (1=Rising, 2=Trending, 3=Viral)
3. **Claiming an NFT**: Transfers the NFT to a claimer's wallet

### Example: Minting a Specific NFT

To mint an NFT for a specific tweet, modify the `interact-with-sonic.ts` script with the appropriate tweet ID and metadata:

```typescript
// Generate a keypair for the mint
const mintKeypair = Keypair.generate();

// Configure the NFT details
const tweetId = 'YOUR_TWEET_ID';
const nftName = 'My Viral Tweet NFT';
const uri = 'https://arweave.net/your-metadata-uri';
const tier = 2; // 1=Rising, 2=Trending, 3=Viral
const viralScore = 85;

// Mint the NFT
await mintViralNFT(mintKeypair, tweetId, nftName, uri, tier, viralScore);
```

### Example: Claiming an NFT

To claim an NFT for a specific user, modify the script:

```typescript
// Load the claimer's keypair
const claimerKeypair = Keypair.fromSecretKey(/* claimer secret key */);

// Claim the NFT
await claimNFT(mintAddress, tweetId, claimerKeypair);
```

## Maintenance & Support

### Regular Maintenance Tasks

1. Daily:
- Monitor error logs
- Check queue sizes
- Verify API limits
- Review system health

2. Weekly:
- Database cleanup
- Performance review
- Security updates
- Backup verification

3. Monthly:
- SSL certificate check
- Dependency updates
- Security audit
- Performance optimization

### Support

For issues or assistance:
1. Check logs: `pm2 logs solspace`
2. System health: `/api/health?detailed=true`
3. Monitor dashboard
4. Review error tracking

### Emergency Procedures

1. Create incident response plan:
- Contact list
- Escalation procedures
- Recovery steps

2. Document common issues:
- API rate limit exceeded
- Database connection issues
- High error rates
- Queue processing delays

3. Prepare rollback procedures:
- Database backups
- Code versioning
- Configuration backups

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
