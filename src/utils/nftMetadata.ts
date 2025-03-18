import { NFTStorage, File } from 'nft.storage';
import { ViralPost } from '@/types';
import sharp from 'sharp';
import path from 'path';

interface TierConfig {
  name: string;
  color: string;
  overlay: (x: number, y: number) => string;
}

const TIER_CONFIGS: Record<number, TierConfig> = {
  1: {
    name: 'Rising',
    color: '#3498db',
    overlay: (x: number, y: number) => `
      <g transform="translate(${x},${y})" filter="url(#glow)">
        <circle r="100" fill="none" stroke="#3498db" stroke-width="4"/>
        <text x="0" y="15" font-family="Arial" font-size="48" fill="#3498db" text-anchor="middle">RISING</text>
        <path d="M-30 30L0 0L30 30" stroke="#3498db" stroke-width="4" fill="none"/>
      </g>
    `
  },
  2: {
    name: 'Trending',
    color: '#e67e22',
    overlay: (x: number, y: number) => `
      <g transform="translate(${x},${y})" filter="url(#glow)">
        <polygon points="-70,40 0,-40 70,40" fill="none" stroke="#e67e22" stroke-width="4"/>
        <text x="0" y="15" font-family="Arial" font-size="48" fill="#e67e22" text-anchor="middle">TRENDING</text>
        <path d="M-20 20L0 -20L20 20" stroke="#e67e22" stroke-width="4" fill="none"/>
      </g>
    `
  },
  3: {
    name: 'Viral',
    color: '#e74c3c',
    overlay: (x: number, y: number) => `
      <g transform="translate(${x},${y})" filter="url(#glow)">
        <path d="M-60,-60 L60,60 M-60,60 L60,-60" stroke="#e74c3c" stroke-width="8"/>
        <circle r="80" fill="none" stroke="#e74c3c" stroke-width="4"/>
        <text x="0" y="15" font-family="Arial" font-size="48" fill="#e74c3c" text-anchor="middle">VIRAL</text>
      </g>
    `
  }
};

export async function generateNFTImage(
  content: string,
  tier: number,
  engagement: { likes: number; retweets: number; replies: number }
): Promise<Buffer> {
  const config = TIER_CONFIGS[tier];
  
  // Create complete SVG with text and overlay
  const svgText = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${config.color};stop-opacity:0.1"/>
          <stop offset="100%" style="stop-color:${config.color};stop-opacity:0.3"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#bg)"/>
      
      <!-- Content -->
      <foreignObject x="100" y="100" width="1000" height="330">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font: 48px Arial; color: white; word-wrap: break-word;">
          ${content}
        </div>
      </foreignObject>
      
      <!-- Tier Overlay -->
      ${config.overlay(600, 315)}
      
      <!-- Stats -->
      <text x="1100" y="580" font-family="Arial" font-size="32" fill="white" text-anchor="end">
        ❤️ ${engagement.likes} 🔄 ${engagement.retweets} 💬 ${engagement.replies}
      </text>
    </svg>
  `;

  // Convert SVG to PNG
  const finalImage = await sharp(Buffer.from(svgText))
    .resize(1200, 630)
    .png()
    .toBuffer();

  return finalImage;
}

export async function generateNFTMetadata(
  post: ViralPost,
  tier: number,
  nftStorage: NFTStorage
): Promise<string> {
  // Generate image
  const image = await generateNFTImage(post.content, tier, post.engagement);
  
  // Create metadata
  const metadata = {
    name: `${TIER_CONFIGS[tier].name} Tweet #${post.tweetId}`,
    description: `A ${TIER_CONFIGS[tier].name} viral tweet by ${post.author}\n\n"${post.content}"\n\nEngagement:\n❤️ ${post.engagement.likes} Likes\n🔄 ${post.engagement.retweets} Retweets\n💬 ${post.engagement.replies} Replies`,
    image: new File([image], `${post.tweetId}.png`, { type: 'image/png' }),
    attributes: [
      {
        trait_type: 'Tier',
        value: TIER_CONFIGS[tier].name
      },
      {
        trait_type: 'Author',
        value: post.author
      },
      {
        trait_type: 'Likes',
        value: post.engagement.likes
      },
      {
        trait_type: 'Retweets',
        value: post.engagement.retweets
      },
      {
        trait_type: 'Replies',
        value: post.engagement.replies
      },
      {
        trait_type: 'Viral Score',
        value: post.viralScore
      },
      {
        trait_type: 'Platform',
        value: 'Twitter'
      },
      {
        display_type: 'date',
        trait_type: 'Created',
        value: new Date(post.timestamp).getTime()
      }
    ],
    properties: {
      tweetId: post.tweetId,
      tier,
      timestamp: post.timestamp,
      viralScore: post.viralScore
    }
  };

  // Upload to IPFS
  const result = await nftStorage.store(metadata);
  return result.url;
}

export function getTierName(tier: number): string {
  return TIER_CONFIGS[tier]?.name || 'Unknown';
}

export function getTierColor(tier: number): string {
  return TIER_CONFIGS[tier]?.color || '#000000';
}
