export const API_LIMITS = {
  MONTHLY_LIMITS: {
    POST_READS: 10000,
    POST_CREATES: 50,
    TWEET_LOOKUP: 25000,
    UPDATE_FREQUENCY: 900 // 15 minutes in seconds
  },

  VIRAL_THRESHOLDS: {
    // Tiered thresholds for different viral levels
    TIER_1: {
      MIN_LIKES: 1000, // Was 5000
      MIN_RETWEETS: 200, // Was 1000
      MIN_REPLY_COUNT: 50, // Was 200
      VELOCITY: {
        LIKES_PER_HOUR: 100, // Was 500
        RETWEETS_PER_HOUR: 20 // Was 100
      }
    },
    TIER_2: {
      MIN_LIKES: 2500,
      MIN_RETWEETS: 500,
      MIN_REPLY_COUNT: 100,
      VELOCITY: {
        LIKES_PER_HOUR: 250,
        RETWEETS_PER_HOUR: 50
      }
    },
    TIER_3: {
      // Original "viral" tier
      MIN_LIKES: 5000,
      MIN_RETWEETS: 1000,
      MIN_REPLY_COUNT: 200,
      VELOCITY: {
        LIKES_PER_HOUR: 500,
        RETWEETS_PER_HOUR: 100
      }
    },
    AGE_HOURS_MAX: 48 // Was 24 - giving more time to detect growth
  },

  DAILY_OPERATIONS: {
    VIRAL_CHECKS: 300, // Keeping this to stay within rate limits
    MINTS_PER_DAY: 20, // Increased from 5
    UPDATE_FREQUENCY: 900, // 15 minutes (was 30)
    RATE_LIMIT_BUFFER: 0.1
  },

  // Different DM templates for different tiers
  NOTIFICATION_TEMPLATES: {
    TIER_1_DM: `🌟 Your tweet is gaining traction! We've preserved it as an NFT on SOLspace.

💫 Benefits of claiming:
- True content ownership
- Direct profit from engagement
- Platform independence

🎯 Ready to own your content? Claim it here: {claimUrl}

Join creators building their digital legacy!`,

    TIER_2_DM: `🚀 Your tweet is taking off! We've preserved this rising star as an NFT on SOLspace.

💫 Why creators choose SOLspace:
- True content ownership (on blockchain)
- Direct profit from engagement
- No algorithmic suppression
- Platform independence

🎯 Ready to own your viral content? Claim it here: {claimUrl}

Join creators turning viral moments into opportunities!`,

    TIER_3_DM: `🌟 Congratulations! Your tweet has gone viral! We've preserved this moment as an NFT on SOLspace.

💫 Why top creators choose SOLspace:
- True content ownership (on blockchain)
- Direct profit from viral engagement
- No algorithmic suppression
- Platform independence

🎯 Ready to own your viral success? Claim it here: {claimUrl}

Join the elite creators monetizing their viral moments!`
  },
  
  // Added for compatibility with free tier
  VIRAL_SCORE_THRESHOLD: 60
};

// Add SONIC_CONFIG for connection-config.ts
export const SONIC_CONFIG = {
  MAINNET_RPC_URL: "https://api.mainnet.sonic.game",
  TESTNET_RPC_URL: "https://api.testnet.sonic.game",
  MAINNET_EXPLORER: "https://explorer.sonic.game",
  TESTNET_EXPLORER: "https://explorer.testnet.sonic.game",
  PROGRAM_ID: "9C2HRbrbvf3baZ8vXhQgiDjJRU1K6JoxUSBhpQsuPW3"
};
