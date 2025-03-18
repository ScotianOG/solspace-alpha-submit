// src/config/viralConfig.ts

/**
 * API limits and viral thresholds configuration
 * Optimized for free tier initially, with plans to upgrade before submission
 */
export const API_LIMITS = {
  // Viral detection thresholds
  VIRAL_THRESHOLDS: {
    // Minimum engagement needed for each tier
    TIER_1: {
      // Rising tier (increased for free tier to reduce volume)
      MIN_LIKES: 2500,
      VELOCITY: {
        LIKES_PER_HOUR: 250,
      }
    },
    TIER_2: {
      // Trending tier (increased for free tier to reduce volume)
      MIN_LIKES: 5000,
      VELOCITY: {
        LIKES_PER_HOUR: 500,
      }
    },
    TIER_3: {
      // Viral tier (increased for free tier to reduce volume)
      MIN_LIKES: 7500,
      VELOCITY: {
        LIKES_PER_HOUR: 750,
      }
    },
    // How long to continue monitoring for tier upgrades
    AGE_HOURS_MAX: 48
  },

  // Twitter API usage limits (free tier)
  // These values reflect the extremely limited free tier access
  MONTHLY_LIMITS: {
    // Free tier: 1 request / 15 mins
    TWEET_LOOKUP: 1,
    // Free tier: 1 request / 15 mins
    POST_READS: 1,
    // Free tier: 17 requests / 24 hours
    POST_CREATES: 17,
  },

  // Daily operational parameters
  DAILY_OPERATIONS: {
    // Safety buffer to avoid hitting rate limits
    RATE_LIMIT_BUFFER: 0.2,
    // Maximum mints per day (limited by POST_CREATES)
    MINTS_PER_DAY: 15, // Keep 2 in reserve for safety
    // Minutes between tier checks
    TIER_CHECK_INTERVAL: 720, // 12 hours (due to free tier limitations)
  },

  // Notification templates
  NOTIFICATION_TEMPLATES: {
    TIER_1_DM: `🚀 Congratulations! Your tweet just went viral and we've preserved it as an NFT on Solana blockchain. \n\nClaim your NFT here: {claimUrl} \n\nNo crypto experience needed - we'll guide you through the process!`,
    TIER_2_DM: `🔥 Your tweet is trending! We've preserved it as an NFT on Solana blockchain. \n\nClaim your NFT here: {claimUrl} \n\nNo crypto experience needed - we'll guide you through the process!`,
    TIER_3_DM: `⚡ WOW! Your tweet has gone mega-viral and we've preserved it as an NFT on Solana blockchain. \n\nClaim your NFT here: {claimUrl} \n\nNo crypto experience needed - we'll guide you through the process!`,
    TIER_UPGRADE_DM: `🚀 Your content is gaining momentum! Your NFT has been upgraded from {oldTier} to {newTier} tier. Check it out: {viewUrl}`
  }
};

/**
 * SONIC configuration for testnet/mainnet
 */
export const SONIC_CONFIG = {
  // SONIC Testnet RPC endpoint
  TESTNET_RPC_URL: "https://api.testnet.sonic.game/",
  
  // SONIC Mainnet RPC endpoint
  MAINNET_RPC_URL: "https://rpc.mainnet-alpha.sonic.game",
  
  // SONIC Explorer URLs
  TESTNET_EXPLORER: "https://explorer.sonic.game/?cluster=testnet",
  MAINNET_EXPLORER: "https://explorer.sonic.game/"