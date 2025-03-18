/**
 * SONIC network configuration
 * Contains settings specific to the SONIC network deployment
 */

// Define tier type for type safety
type TierInfo = {
  NAME: string;
  IMAGE: string;
  DESCRIPTION: string;
  UPGRADE_THRESHOLD?: number;
};

// Define tiers record type
type TiersConfig = Record<number, TierInfo>;

export const SONIC_CONFIG = {
  // Network configuration
  RPC_URL: 'https://rpc.testnet-alpha.sonic.game',
  EXPLORER_URL: 'https://explorer.sonic.game/testnet',
  NFT_VIEWER_URL: 'https://explorer.sonic.game/testnet/address/',

  // Wallet configuration
  SUPPORTED_WALLETS: ['Backpack', 'Nightly', 'OKX'] as const,
  
  // Transaction configuration
  COMMITMENT: 'confirmed' as const, // Transaction commitment level
  TIMEOUT: 30000, // Transaction timeout in ms
  MAX_RETRIES: 3, // Maximum number of retries for failed transactions
  
  // SONIC-specific NFT settings
  NFT_SYMBOL_PREFIX: 'SOL', // Prefix for NFT symbols
  COLLECTION_NAME: 'SOLspace Viral Content',
  
  // Fee configuration
  CREATOR_FEE_PERCENTAGE: 95, // 95% to creator
  PLATFORM_FEE_PERCENTAGE: 5, // 5% to platform
  
  // Tier configuration
  TIERS: {
    1: {
      NAME: 'Rising',
      IMAGE: '/images/tiers/rising-badge.svg',
      DESCRIPTION: 'A rising social media post with growing engagement',
      UPGRADE_THRESHOLD: 2500, // Likes to upgrade to tier 2
    },
    2: {
      NAME: 'Trending',
      IMAGE: '/images/tiers/trending-badge.svg',
      DESCRIPTION: 'A trending post with substantial engagement',
      UPGRADE_THRESHOLD: 5000, // Likes to upgrade to tier 3
    },
    3: {
      NAME: 'Viral',
      IMAGE: '/images/tiers/viral-badge.svg',
      DESCRIPTION: 'A viral post with exceptional engagement',
      // No upgrade from tier 3
    }
  } as TiersConfig,

  // Deployment settings
  IS_TESTING: process.env.NODE_ENV !== 'production',
  MAX_GAS_LIMIT: 1000000, // Maximum gas limit for transactions
};

// Helper functions
export const getSonicExplorerUrl = (address: string, type: 'transaction' | 'address' = 'address'): string => {
  return `${SONIC_CONFIG.EXPLORER_URL}/${type}/${address}`;
};

export const getSonicNftViewerUrl = (address: string): string => {
  return `${SONIC_CONFIG.NFT_VIEWER_URL}${address}`;
};

export const getTierName = (tier: number): string => {
  return tier in SONIC_CONFIG.TIERS ? SONIC_CONFIG.TIERS[tier].NAME : 'Unknown';
};

export const getTierImage = (tier: number): string => {
  return tier in SONIC_CONFIG.TIERS ? SONIC_CONFIG.TIERS[tier].IMAGE : '';
};

export const getTierDescription = (tier: number): string => {
  return tier in SONIC_CONFIG.TIERS ? SONIC_CONFIG.TIERS[tier].DESCRIPTION : '';
};

export default SONIC_CONFIG;
