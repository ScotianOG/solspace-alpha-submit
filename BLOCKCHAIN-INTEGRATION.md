# Solspace Sonic Blockchain Integration

This document explains how the Solspace UI interacts with the Sonic blockchain.

## Integration Overview

The Solspace application is fully integrated with the Sonic blockchain, allowing users to:

1. **Mint viral posts as NFTs** directly on the Sonic blockchain
2. **Claim NFTs** that represent their viral social media content
3. **View their NFT collection** in the visualizer

## Components

### 1. Sonic Program (Smart Contract)

We've modified the Sonic program to make the Counter account optional, which resolves the initialization errors previously encountered. The key components:

- **Optional Counter**: All operations work without requiring Counter initialization
- **Direct Account Creation**: Viral post accounts can be created directly on-chain
- **Claiming Mechanism**: Users can claim viral posts by connecting their wallet

### 2. Integration Service

`SolanaIntegrationService` (`src/services/free/SolanaIntegrationService.ts`) provides the bridge between our frontend UI and the Sonic blockchain:

- Creates viral post accounts
- Facilitates NFT claiming 
- Handles tier upgrades for viral content

### 3. UI Components

- **BlockchainClaimFlow**: A complete UI flow for claiming NFTs
- **ViralPostDashboard**: Monitors and displays viral content

## Technical Implementation

### Creating Viral Posts

When content goes viral, we use our bypass method to create a Sonic account:

```typescript
// Generate a keypair for the viral post account
const viralPostKeypair = Keypair.generate();

// Create the viral post account
const createAccountIx = SystemProgram.createAccount({
  fromPubkey: wallet.publicKey,
  newAccountPubkey: viralPostKeypair.publicKey,
  lamports: rentExemptBalance,
  space: VIRAL_POST_SIZE,
  programId: this.programId
});
```

### Claiming NFTs

When users claim an NFT:

```typescript
// Call the claimNft instruction from the program
const tx = await program.methods
  .claimNft()
  .accounts({
    viralPost: viralPostPubkey,
    recipient: wallet.publicKey,
  })
  .rpc();
```

## Deployment Configuration

The following environment variables are used during deployment:

- `NEXT_PUBLIC_SOLANA_RPC_URL`: The Sonic RPC endpoint (defaults to Sonic Testnet)
- `NEXT_PUBLIC_PROGRAM_ID`: The deployed Sonic program ID

These are configured in the `.env.production` file created during the Netlify deployment process.

## Testing the Integration

To test the integration:

1. Build and deploy the Sonic program: `./build-and-deploy.sh`
2. Run the Netlify deployment: `./netlify-deploy.sh`
3. Visit the deployed site and navigate to `/claim-nft`
4. Connect your wallet and claim a viral post NFT

## Sonic Resources

- **Sonic Explorer (Testnet)**: [https://explorer.sonic.game/?cluster=testnet](https://explorer.sonic.game/?cluster=testnet)
- **Program ID**: `9C2HRbrbvf3baZ8vXhQgiDjJRU1K6JoxUSBhpQsuPW3`
