import { Prisma } from '@prisma/client';

// Viral Detection Types
export interface ViralMetrics {
  likes: number;
  retweets: number;
  replies: number;
  created_at: string;
  velocity: {
    likes_per_hour: number;
    retweets_per_hour: number;
  };
  engagement_rate: number;
  impression_count?: number;
  bookmark_count?: number;
  hashtags?: string[];
}

export interface TwitterPost {
  id: string;
  content: string;
  author: string;
  authorId: string;
  engagement: {
    likes: number;
    retweets: number;
    replies: number;
    quote_tweets?: number;
  };
  timestamp: string;
  metrics: ViralMetrics;
}

export interface ViralPost {
  tweetId: string;
  content: string;
  author: string;
  engagement: {
    likes: number;
    retweets: number;
    replies: number;
  };
  timestamp: string;
  viralScore: number;
  mintProgress: number;
  platform: string;
  tier?: number; // Viral tier (1-3)
}

export interface MonitoringResult {
  status: 'success' | 'rate_limited' | 'error';
  processed?: number;
  queued?: number;
  message?: string;
}

// API Limit Types
export interface APILimitStatus {
  currentUsage: number;
  dailyLimit: number;
  usagePercent: number;
  remaining: number;
  nextReset: Date;
}

export interface QueueStatus {
  postsScanned: number;
  potentialPosts: number;
  mintedToday: number;
  apiLimitStatus: APILimitStatus;
}

// System Health Types
export interface SystemHealth {
  apiLimits: {
    [endpoint: string]: APILimitStatus;
  };
  queueStatus: {
    pendingPosts: number;
    mintingPosts: number;
    pendingClaims: number;
  };
  errors: {
    count: number;
    lastError?: {
      message: string;
      timestamp: Date;
    };
  };
}

// Database Types
export type DBViralPost = {
  id: string;
  tweetId: string;
  content: string;
  author: string;
  authorId: string;
  engagement: Record<string, number>;
  viralScore: number;
  tier: number;
  mintStatus: string;
  mintProgress: number;
  nftAddress?: string | null;
  metadataUri?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export interface SignatureProof {
  signature: string;
  message: string;
  publicKey: string;
}

export interface ClaimStatus {
  id: string;
  nftAddress: string;
  tweetId: string;
  authorId: string;
  walletAddress?: string;
  status: 'pending' | 'verified' | 'claimed' | 'failed';
  signatureProof?: SignatureProof;
  createdAt: Date;
  updatedAt: Date;
  claimedAt?: Date;
}

export interface APILimit {
  id: string;
  endpoint: string;
  usage: number;
  limit: number;
  resetAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// NFT Types
export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
    display_type?: string;
  }>;
  properties: {
    tweetId: string;
    tier: number;
    timestamp: string;
    viralScore: number;
  };
}

export interface MintedNFT {
  id: string;
  address: string;
  creator: string;
  owner?: string;
  tier: number;
  content: string;
  engagement: {
    likes: number;
    retweets: number;
    replies: number;
  };
  claimed: boolean;
  mintedAt: string;
  claimedAt?: string;
}
