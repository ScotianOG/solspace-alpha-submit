import { EnhancedViralPostDetector } from "../services/enhanced/EnhancedViralPostDetector";
import { DatabaseService } from "../services/common/database";
import { SimpleNotificationService } from "../services/simple/SimpleNotificationService";
import * as dotenv from "dotenv";
import { Connection } from "@solana/web3.js";
import { AutoMintingService } from "../services/common/AutoMintingService";

// Load environment variables
dotenv.config();

const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN || "";
const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || "https://rpc.mainnet-alpha.sonic.game";

/**
 * Main function for monitoring viral posts and processing them
 */
async function main() {
  try {
    console.log("Starting viral content monitoring...");
    
    // Initialize services
    const detector = new EnhancedViralPostDetector(TWITTER_BEARER_TOKEN);
    const notificationService = new SimpleNotificationService(TWITTER_BEARER_TOKEN);
    const connection = new Connection(SOLANA_RPC_URL);
    const minter = new AutoMintingService();
    
    // Monitor for viral posts
    console.log("Checking for viral content...");
    const viralPosts = await detector.startMonitoring();
    
    if (viralPosts.length === 0) {
      console.log("No new viral posts detected.");
      return;
    }
    
    console.log(`Found ${viralPosts.length} viral posts. Processing...`);
    
    // Process each viral post
    for (const post of viralPosts) {
      try {
        // Save to database
        console.log(`Saving post ${post.tweetId} to database...`);
        const savedPost = await DatabaseService.createViralPost(post);
        
        // Queue for minting
        console.log(`Queueing post ${post.tweetId} for minting...`);
        await minter.queueForMinting(post);
        
        console.log(`Successfully processed viral post: ${post.tweetId}`);
      } catch (error) {
        console.error(`Error processing viral post ${post.tweetId}:`, error);
      }
    }
    
    // Process minting queue to mint NFTs for queued posts
    console.log("Processing minting queue...");
    const mintResults = await minter.processMintingQueue();
    
    // Send notifications for successfully minted NFTs
    console.log("Sending notifications for minted NFTs...");
    for (const result of mintResults) {
      if (result.success) {
        await notificationService.notifyCreator(
          result.authorId,
          result.nftAddress,
          result.tier
        );
      }
    }
    
    console.log("Viral content monitoring cycle completed successfully.");
  } catch (error) {
    console.error("Error in viral monitoring process:", error);
  }
}

// Self-executing main function
main()
  .then(() => {
    console.log("Monitoring completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error in monitoring process:", error);
    process.exit(1);
  });
