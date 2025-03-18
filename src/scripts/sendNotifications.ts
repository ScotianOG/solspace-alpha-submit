import { DatabaseService } from "../services/common/database";
import { SimpleNotificationService } from "../services/simple/SimpleNotificationService";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN || "";

/**
 * Send notifications to creators of viral content
 * This script handles notifying creators about their minted NFTs and tier upgrades
 */
async function main() {
  try {
    console.log("Starting notification service...");
    
    // Initialize services
    const notificationService = new SimpleNotificationService(TWITTER_BEARER_TOKEN);
    
    // Get all completed viral posts without notifications
    console.log("Fetching completed viral posts...");
    const completedPosts = await DatabaseService.getViralPosts("completed");
    
    if (completedPosts.length === 0) {
      console.log("No completed posts requiring notifications.");
      return;
    }
    
    console.log(`Found ${completedPosts.length} posts to send notifications for.`);
    
    // Send notifications for each post
    let successCount = 0;
    let failureCount = 0;
    
    for (const post of completedPosts) {
      try {
        if (!post.nftAddress) {
          console.log(`Skipping post ${post.tweetId} - no NFT address found.`);
          continue;
        }
        
        console.log(`Sending notification for post ${post.tweetId} (NFT: ${post.nftAddress})...`);
        
        // Extract author ID (remove @ if present)
        const authorId = post.authorId.startsWith('@') ? post.authorId.substring(1) : post.authorId;
        
        // Send notification
        const success = await notificationService.notifyCreator(
          authorId,
          post.nftAddress,
          post.tier
        );
        
        if (success) {
          console.log(`Successfully sent notification to ${post.author} for NFT ${post.nftAddress}`);
          successCount++;
          
          // TODO: Update database to mark notification as sent
          // await DatabaseService.markNotificationSent(post.tweetId);
        } else {
          console.error(`Failed to send notification to ${post.author}`);
          failureCount++;
        }
      } catch (error) {
        console.error(`Error sending notification for post ${post.tweetId}:`, error);
        failureCount++;
      }
    }
    
    console.log(`Notification processing completed. Success: ${successCount}, Failed: ${failureCount}`);
    return { success: successCount, failed: failureCount };
  } catch (error) {
    console.error("Error processing notifications:", error);
    throw error;
  }
}

// Self-executing main function
main()
  .then(() => {
    console.log("Notification processing completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error in notification processing:", error);
    process.exit(1);
  });
