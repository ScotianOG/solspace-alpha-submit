// src/types/nft-metadata.ts
import { Tier } from "./index";

/**
 * Standardized NFT metadata structure for SOLspace viral posts
 * Compatible with Metaplex NFT standards
 */

export interface AttributeTrait {
  trait_type: string;
  value: string | number;
  display_type?: string;
}

export interface Creator {
  address: string;
  share: number;
  verified: boolean;
}

export interface ViralPostMetrics {
  likes: number;
  retweets: number;
  replies: number;
  quote_tweets?: number;
  velocity: {
    likes_per_hour: number;
    retweets_per_hour: number;
  };
}

export interface SOLspaceViralPostMetadata {
  // Standard Metaplex fields
  name: string;
  symbol: string;
  description: string;
  image: string;
  animation_url?: string;
  external_url: string;
  attributes: AttributeTrait[];
  properties: {
    files: Array<{
      uri: string;
      type: string;
      cdn?: boolean;
    }>;
    category: "image" | "video" | "audio" | "vr" | "html";
    creators: Creator[];
  };

  // SOLspace-specific fields
  solspace_metadata: {
    version: string;
    platform: string;
    original_id: string;
    original_url: string;
    author_handle: string;
    author_id: string;
    timestamp: string;
    tier: Tier;
    tier_history: Array<{
      tier: Tier;
      timestamp: string;
    }>;
    metrics: ViralPostMetrics;
    content_hash: string;
    claimed: boolean;
    claim_timestamp?: string;
    claimer_address?: string;
  };
}

/**
 * Generate a standardized metadata object for a viral post NFT
 */
export function generateViralPostMetadata(params: {
  platform: string;
  postId: string;
  postUrl: string;
  authorHandle: string;
  authorId: string;
  content: string;
  timestamp: string;
  tier: Tier;
  metrics: ViralPostMetrics;
  creators: Array<{
    address: string;
    share: number;
  }>;
  imageUri: string;
}): SOLspaceViralPostMetadata {
  const {
    platform,
    postId,
    postUrl,
    authorHandle,
    authorId,
    content,
    timestamp,
    tier,
    metrics,
    creators,
    imageUri,
  } = params;

  // Create tier-specific name
  const tierNames = ["", "Rising", "Trending", "Viral"];
  const tierName = tierNames[tier];

  // Generate attributes based on metrics
  const attributes: AttributeTrait[] = [
    {
      trait_type: "Platform",
      value: platform,
    },
    {
      trait_type: "Tier",
      value: tier,
    },
    {
      trait_type: "Likes",
      value: metrics.likes,
      display_type: "number",
    },
    {
      trait_type: "Retweets",
      value: metrics.retweets,
      display_type: "number",
    },
    {
      trait_type: "Engagement Velocity",
      value: Math.round(metrics.velocity.likes_per_hour),
      display_type: "number",
    },
    {
      trait_type: "Date Created",
      value: Math.floor(new Date(timestamp).getTime() / 1000),
      display_type: "date",
    },
  ];

  // Add quote tweets attribute if available
  if (metrics.quote_tweets !== undefined) {
    attributes.push({
      trait_type: "Quote Tweets",
      value: metrics.quote_tweets,
      display_type: "number",
    });
  }

  // Calculate content hash for verification
  const contentHash = btoa(content).slice(0, 40);

  // Create standardized metadata object
  return {
    name: `${tierName} ${platform} Post by ${authorHandle}`,
    symbol: "SOLSPACE",
    description: content.length > 280 ? content.slice(0, 277) + "..." : content,
    image: imageUri,
    external_url: postUrl,
    attributes,
    properties: {
      files: [
        {
          uri: imageUri,
          type: "image/png",
        },
      ],
      category: "image",
      creators: creators.map((creator) => ({
        address: creator.address,
        share: creator.share,
        verified: false,
      })),
    },
    solspace_metadata: {
      version: "1.0.0",
      platform,
      original_id: postId,
      original_url: postUrl,
      author_handle: authorHandle,
      author_id: authorId,
      timestamp,
      tier,
      tier_history: [
        {
          tier,
          timestamp: new Date().toISOString(),
        },
      ],
      metrics,
      content_hash: contentHash,
      claimed: false,
    },
  };
}

/**
 * Update metadata when a post's tier changes
 */
export function updateTierMetadata(
  originalMetadata: SOLspaceViralPostMetadata,
  newTier: Tier,
  updatedMetrics: ViralPostMetrics
): SOLspaceViralPostMetadata {
  const tierNames = ["", "Rising", "Trending", "Viral"];
  const newTierName = tierNames[newTier];
  const authorHandle = originalMetadata.solspace_metadata.author_handle;
  const platform = originalMetadata.solspace_metadata.platform;

  // Create updated metadata by cloning original
  const updatedMetadata = JSON.parse(
    JSON.stringify(originalMetadata)
  ) as SOLspaceViralPostMetadata;

  // Update name to reflect new tier
  updatedMetadata.name = `${newTierName} ${platform} Post by ${authorHandle}`;

  // Update tier in metadata
  updatedMetadata.solspace_metadata.tier = newTier;

  // Add new tier to history
  updatedMetadata.solspace_metadata.tier_history.push({
    tier: newTier,
    timestamp: new Date().toISOString(),
  });

  // Update metrics
  updatedMetadata.solspace_metadata.metrics = updatedMetrics;

  // Update attributes
  updatedMetadata.attributes = updatedMetadata.attributes.map((attr) => {
    if (attr.trait_type === "Tier") {
      return { ...attr, value: newTier };
    }
    if (attr.trait_type === "Likes") {
      return { ...attr, value: updatedMetrics.likes };
    }
    if (attr.trait_type === "Retweets") {
      return { ...attr, value: updatedMetrics.retweets };
    }
    if (attr.trait_type === "Engagement Velocity") {
      return {
        ...attr,
        value: Math.round(updatedMetrics.velocity.likes_per_hour),
      };
    }
    if (
      attr.trait_type === "Quote Tweets" &&
      updatedMetrics.quote_tweets !== undefined
    ) {
      return { ...attr, value: updatedMetrics.quote_tweets };
    }
    return attr;
  });

  return updatedMetadata;
}

/**
 * Update metadata when an NFT is claimed
 */
export function updateClaimMetadata(
  originalMetadata: SOLspaceViralPostMetadata,
  claimerAddress: string
): SOLspaceViralPostMetadata {
  // Create updated metadata by cloning original
  const updatedMetadata = JSON.parse(
    JSON.stringify(originalMetadata)
  ) as SOLspaceViralPostMetadata;

  // Update claim status
  updatedMetadata.solspace_metadata.claimed = true;
  updatedMetadata.solspace_metadata.claim_timestamp = new Date().toISOString();
  updatedMetadata.solspace_metadata.claimer_address = claimerAddress;

  // Add claimed attribute
  updatedMetadata.attributes.push({
    trait_type: "Claimed",
    value: "Yes",
  });

  // Add claim date attribute
  updatedMetadata.attributes.push({
    trait_type: "Claim Date",
    value: Math.floor(Date.now() / 1000),
    display_type: "date",
  });

  return updatedMetadata;
}
