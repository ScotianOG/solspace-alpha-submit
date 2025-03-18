import { DatabaseService } from "../services/common/database";
import { AutoMintingService } from "../services/common/AutoMintingService";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * Process the minting queue for viral posts
 * This script is designed to be run on a schedule to mint NFTs for viral content
 */
async function main() {
  try {
    console.log("Starting NFT minting queue processing...");
    
    // Initialize services
    const mintingService = new AutoMintingService();
    
    // Get all pending posts from database
    console.log("Fetching pending viral posts...");
    const pendingPosts = await DatabaseService.getViralPosts("pending");
    
    if (pendingPosts.length === 0) {
      console.log("No pending posts to process.");
      return;
    }
    
    console.log(`Found ${pendingPosts.length} pending posts to process.`);
    
    // Queue posts for minting
    for (const post of pendingPosts) {
      try {
        console.log(`Queueing viral post ${post.tweetId} for minting...`);
        
        // Convert from DB type to standard ViralPost type
        const viralPost = {
          tweetId: post.tweetId,
          content: post.content,
          author: post.author,
          engagement: post.engagement as {
            likes: number;
            retweets: number;
            replies: number;
          },
          timestamp: post.createdAt.toISOString(),
          viralScore: post.viralScore,
          mintProgress: post.mintProgress,
          platform: "twitter",
        };
        
        // Queue for minting
        await mintingService.queueForMinting(viralPost);
      } catch (error) {
        console.error(`Error queueing post ${post.tweetId}:`, error);
      }
    }
    
    // Process all queued posts
    console.log("Processing minting queue...");
    const mintResults = await mintingService.processMintingQueue();
    
    // Log results
    const successCount = mintResults.filter(r => r.success).length;
    console.log(`Processed ${mintResults.length} posts. Success: ${successCount}, Failed: ${mintResults.length - successCount}`);
    
    // Details of minted NFTs
    for (const result of mintResults) {
      if (result.success) {
        console.log(`Successfully minted NFT for post ${result.tweetId}: ${result.nftAddress} (Tier ${result.tier})`);
      } else {
        console.log(`Failed to mint NFT for post ${result.tweetId}`);
      }
    }
    
    console.log("NFT minting queue processing completed.");
    return mintResults;
  } catch (error) {
    console.error("Error processing minting queue:", error);
    throw error;
  }
}

// Self-executing main function
main()
  .then(() => {
    console.log("Queue processing completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error in queue processing:", error);
    process.exit(1);
  });
