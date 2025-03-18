import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { DatabaseService } from "./database";
import { ViralPost, MintedNFT } from "../types";
import { NFTStorage, File } from "nft.storage";
import * as fs from "fs";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || "https://rpc.mainnet-alpha.sonic.game";
const PROGRAM_ID = process.env.PROGRAM_ID || "";
const NFT_STORAGE_API_KEY = process.env.NFT_STORAGE_API_KEY || "";
const ADMIN_WALLET = process.env.ADMIN_WALLET || "";

/**
 * Service for automatically minting viral content NFTs
 * Simplified for SONIC implementation
 */
export class AutoMintingService {
  private connection: Connection;
  private nftStorage: NFTStorage;
  private adminWallet: Keypair;
  private mintQueue: ViralPost[] = [];

  constructor() {
    // Initialize connection to SONIC
    this.connection = new Connection(SOLANA_RPC_URL);
    
    // Initialize NFT.storage client
    this.nftStorage = new NFTStorage({ token: NFT_STORAGE_API_KEY });
    
    // Initialize admin wallet from environment
    try {
      // In production, you would load the admin keypair securely
      // For the MVP, we're using a simplified approach with env vars
      this.adminWallet = Keypair.generate(); // Placeholder for demo
    } catch (error) {
      console.error("Error initializing admin wallet:", error);
      throw new Error("Failed to initialize admin wallet");
    }
  }

  /**
   * Queue a viral post for NFT minting
   * @param post Viral post to mint
   */
  async queueForMinting(post: ViralPost): Promise<void> {
    try {
      // Update post mint progress
      await DatabaseService.updateMintProgress(post.tweetId, 10);
      
      // Add to minting queue
      this.mintQueue.push(post);
      
      console.log(`Post ${post.tweetId} queued for minting. Queue size: ${this.mintQueue.length}`);
    } catch (error) {
      console.error(`Error queueing post ${post.tweetId} for minting:`, error);
      throw error;
    }
  }

  /**
   * Process all queued posts and mint NFTs
   * @returns Array of mint results
   */
  async processMintingQueue(): Promise<Array<{
    tweetId: string;
    authorId: string;
    success: boolean;
    nftAddress: string;
    tier: number;
  }>> {
    const results = [];
    
    // Process each queued post
    for (const post of this.mintQueue) {
      try {
        console.log(`Minting NFT for post ${post.tweetId}...`);
        
        // Update progress
        await DatabaseService.updateMintProgress(post.tweetId, 30);
        
        // Determine tier based on engagement
        const tier = this.determineTier(post);
        
        // Generate NFT metadata
        console.log(`Generating metadata for tier ${tier}...`);
        const metadataUri = await this.generateMetadata(post, tier);
        
        // Update progress
        await DatabaseService.updateMintProgress(post.tweetId, 50);
        
        // Mint the NFT
        console.log(`Minting NFT with metadata ${metadataUri}...`);
        const nftAddress = await this.mintNFT(post, metadataUri, tier);
        
        // Update database with NFT address
        await DatabaseService.setNFTAddress(post.tweetId, nftAddress, metadataUri);
        
        // Update progress
        await DatabaseService.updateMintProgress(post.tweetId, 100);
        
        console.log(`Successfully minted NFT ${nftAddress} for post ${post.tweetId}`);
        
        // Add to results
        results.push({
          tweetId: post.tweetId,
          authorId: post.author.replace('@', ''),
          success: true,
          nftAddress,
          tier,
        });
      } catch (error) {
        console.error(`Error minting NFT for post ${post.tweetId}:`, error);
        
        // Add failed result
        results.push({
          tweetId: post.tweetId,
          authorId: post.author.replace('@', ''),
          success: false,
          nftAddress: '',
          tier: 0,
        });
      }
    }
    
    // Clear queue after processing
    this.mintQueue = [];
    
    return results;
  }

  /**
   * Determine the tier level based on post engagement
   * @param post Viral post
   * @returns Tier level (1-3)
   */
  private determineTier(post: ViralPost): number {
    const { likes } = post.engagement;
    
    // Simplified tier determination for MVP
    if (likes >= 5000) return 3;   // Viral
    if (likes >= 2500) return 2;   // Trending
    return 1;                      // Rising
  }

  /**
   * Generate metadata for the NFT
   * @param post Viral post
   * @param tier Tier level
   * @returns Metadata URI
   */
  private async generateMetadata(post: ViralPost, tier: number): Promise<string> {
    try {
      // Create tier-specific metadata
      const tierNames = ["", "Rising", "Trending", "Viral"];
      
      // Create metadata
      const metadata = {
        name: `${tierNames[tier]} Content by ${post.author}`,
        description: `This NFT represents a ${tierNames[tier].toLowerCase()} social media post that gained significant engagement. Original content: "${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}"`,
        image: this.getTierImageUrl(tier), // Placeholder for actual image generation
        attributes: [
          {
            trait_type: "Tier",
            value: tierNames[tier]
          },
          {
            trait_type: "Likes",
            value: post.engagement.likes
          },
          {
            trait_type: "Retweets",
            value: post.engagement.retweets
          },
          {
            trait_type: "Platform",
            value: "Twitter"
          },
          {
            trait_type: "Creator",
            value: post.author
          }
        ],
        properties: {
          tweetId: post.tweetId,
          tier,
          timestamp: post.timestamp,
          viralScore: post.viralScore
        }
      };
      
      // Store metadata on IPFS via NFT.storage
      // For MVP, we're using a simplified approach
      // In production, this would upload the actual metadata
      
      // Mock storage for MVP
      const metadataUri = `https://nftstorage.link/ipfs/bafybeih${post.tweetId.substring(0, 8)}`;
      return metadataUri;
    } catch (error) {
      console.error("Error generating metadata:", error);
      throw error;
    }
  }

  /**
   * Get tier-specific image URL
   * @param tier Tier level
   * @returns Image URL
   */
  private getTierImageUrl(tier: number): string {
    // In production, this would generate unique images
    // For MVP, we use predefined tier images
    const tierImages = [
      "",
      "https://solspace.app/images/tiers/rising-badge.svg",
      "https://solspace.app/images/tiers/trending-badge.svg",
      "https://solspace.app/images/tiers/viral-badge.svg"
    ];
    
    return tierImages[tier];
  }

  /**
   * Mint the NFT on SONIC
   * @param post Viral post
   * @param metadataUri Metadata URI
   * @param tier Tier level
   * @returns NFT address
   */
  private async mintNFT(post: ViralPost, metadataUri: string, tier: number): Promise<string> {
    try {
      // For the MVP, we're returning a mock NFT address
      // In production, this would call the smart contract to mint the NFT
      
      // Mock NFT address for demonstration
      const nftAddress = `${Buffer.from(`nft-${post.tweetId}-${Date.now()}`).toString('base64').substring(0, 32)}`;
      
      console.log(`Mocked NFT minting for post ${post.tweetId}, returning address: ${nftAddress}`);
      return nftAddress;
    } catch (error) {
      console.error("Error minting NFT:", error);
      throw error;
    }
  }

  /**
   * Get all currently queued posts
   * @returns Array of queued posts
   */
  getQueuedPosts(): ViralPost[] {
    return [...this.mintQueue];
  }

  /**
   * Clear the minting queue
   */
  clearQueue(): void {
    this.mintQueue = [];
  }
}

export default AutoMintingService;
