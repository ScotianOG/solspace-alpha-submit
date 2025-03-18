// src/services/api.ts
import { EnhancedViralPostDetector } from "./enhanced/EnhancedViralPostDetector";
import { AutoMintingService } from "./common/AutoMintingService";
import { Program } from "@project-serum/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { loadSolspaceIDL } from "@/utils/program";
import type { TwitterPost, ViralPost, QueueStatus } from "@/types";

// Initialize services
const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com');
const program = new Program(
  loadSolspaceIDL(),
  new PublicKey(process.env.PROGRAM_ID || ''),
  { connection }
);

const viralDetector = new EnhancedViralPostDetector(process.env.TWITTER_API_KEY || '');
const mintingService = new AutoMintingService();

// API Service for frontend
export const api = {
  getQueueStatus: async (): Promise<QueueStatus> => {
    return viralDetector.getQueueStatus();
  },

  getQueuedPosts: async (): Promise<ViralPost[]> => {
    return viralDetector.getQueuedPosts();
  },

  startMonitoring: async (): Promise<void> => {
    const viralPosts = await viralDetector.startMonitoring();
    
    // Auto-mint any viral posts
    for (const post of viralPosts) {
      try {
        // Queue for minting
        await mintingService.queueForMinting(post);
        // Process the minting queue
        const mintResults = await mintingService.processMintingQueue();
        // Find the result for this tweet
        const result = mintResults.find(r => r.tweetId === post.tweetId);
        if (result && result.success) {
          console.log(`Minted NFT ${result.nftAddress} for tweet ${post.tweetId}`);
          viralDetector.recordSuccessfulMint(post.tweetId);
        }
      } catch (error) {
        console.error(`Failed to mint NFT for tweet ${post.tweetId}:`, error);
      }
    }
  },

  stopMonitoring: (): void => {
    viralDetector.stopMonitoring();
  },

  mintPost: async (post: TwitterPost): Promise<string> => {
    // Convert to ViralPost format
    const viralPost: ViralPost = {
      tweetId: post.id,
      content: post.content,
      author: post.author,
      timestamp: post.timestamp || new Date().toISOString(),
      engagement: post.engagement,
      viralScore: 50, // Default score
      mintProgress: 0,
      platform: "twitter",
      tier: 1 // Default tier
    };
    
    // Queue for minting
    await mintingService.queueForMinting(viralPost);
    
    // Process the queue
    const results = await mintingService.processMintingQueue();
    
    // Find this post's result
    const result = results.find(r => r.tweetId === post.id);
    if (!result || !result.success) {
      throw new Error('Failed to mint NFT');
    }
    
    return result.nftAddress;
  },

  notifyCreator: async (post: TwitterPost, nftAddress: string): Promise<void> => {
    // Notification is handled automatically by AutoMintingService
    console.log(`Creator ${post.author} notified about NFT ${nftAddress}`);
  },

  claimNFT: async (nftAddress: string, twitterId: string, walletAddress: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/nft/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nftAddress,
          twitterHandle: twitterId,
          walletAddress,
          signatureProof: '', // TODO: Implement signature verification
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to claim NFT');
      }

      const result = await response.json();
      return result.status === 'success';
    } catch (error) {
      console.error('Error claiming NFT:', error);
      return false;
    }
  },

  getNFTDetails: async (nftAddress: string) => {
    try {
      const nftPubkey = new PublicKey(nftAddress);
      const nftAccount = await program.account.viralPost.fetch(nftPubkey);

      return {
        id: nftAccount.twitterId,
        content: nftAccount.metadataUri, // TODO: Fetch actual content from metadata
        author: nftAccount.authorId,
        tier: nftAccount.currentTier,
        claimed: nftAccount.claimed,
        engagement: {
          likes: 0, // TODO: Add engagement metrics to account state
          retweets: 0,
          comments: 0,
        },
      };
    } catch (error) {
      console.error('Error fetching NFT details:', error);
      throw error;
    }
  },
};
