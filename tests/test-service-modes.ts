/**
 * Test script to verify different service modes
 * 
 * This script demonstrates switching between different implementations
 * of the viral detector and notification services.
 * 
 * Usage:
 * 1. Set NEXT_PUBLIC_SERVICE_MODE in .env to one of:
 *    - enhanced (production)
 *    - simple (testing)
 *    - free_tier (free API tier)
 *    - mock (no API calls)
 * 2. Run: npx ts-node -r tsconfig-paths/register scripts/test-service-modes.ts
 */

import { ViralPostDetectorFactory } from "../src/services/ViralPostDetectorFactory";
import { NotificationServiceFactory } from "../src/services/NotificationServiceFactory";
import { getServiceMode } from "../src/types/service-mode";

async function main() {
  console.log("\n=== SERVICE MODE TEST SCRIPT ===\n");
  console.log(`Current service mode: ${getServiceMode()}`);
  
  // Get detector and notification service
  const detectorFactory = ViralPostDetectorFactory.getInstance();
  const notificationFactory = NotificationServiceFactory.getInstance();
  const detector = detectorFactory.getDetector('twitter');
  const notificationService = notificationFactory.getService();
  
  console.log("\n=== Testing Viral Post Detection ===\n");
  
  // Start monitoring and check for viral posts
  try {
    console.log("Starting viral post monitoring...");
    const posts = await detector.startMonitoring();
    console.log(`Found ${posts.length} viral posts`);
    
    if (posts.length > 0) {
      console.log("\nSample viral post:");
      console.log(`- Content: ${posts[0].content.substring(0, 50)}...`);
      console.log(`- Author: ${posts[0].author}`);
      console.log(`- Likes: ${posts[0].engagement.likes}`);
      console.log(`- Viral Score: ${posts[0].viralScore}`);
      console.log(`- Tier: ${posts[0].tier || 'Not tiered'}`);
    }
    
    // Get queue status
    const status = await detector.getQueueStatus();
    console.log("\nQueue Status:");
    console.log(`- Posts Scanned: ${status.postsScanned}`);
    console.log(`- Potential Posts: ${status.potentialPosts}`);
    console.log(`- Minted Today: ${status.mintedToday}`);
    
    // Get engagement stats
    const stats = await detector.getEngagementStats();
    console.log("\nEngagement Stats:");
    console.log(`- Total Engagement: ${stats.totalEngagement}`);
    console.log(`- Average Likes: ${stats.averageLikes}`);
    console.log(`- Average Retweets: ${stats.averageRetweets}`);
    
    console.log("\n=== Testing Notification Service ===\n");
    
    // Test notification service
    if (posts.length > 0) {
      const post = posts[0];
      const mockNftAddress = `mock-nft-${Date.now()}`;
      const authorId = post.author.replace('@', '') || 'test_user';
      const tier = post.tier || 1;
      
      console.log(`Sending notification to ${post.author} about NFT ${mockNftAddress} (Tier ${tier})`);
      await notificationFactory.notifyCreator(authorId, mockNftAddress, tier);
      
      console.log(`\nSending tier upgrade notification to ${post.author}`);
      await notificationFactory.notifyTierUpgrade(authorId, mockNftAddress, tier, tier + 1);
    } else {
      console.log("No viral posts found to test notifications");
      
      // Send test notification
      const mockAuthorId = 'test_user';
      const mockNftAddress = `mock-nft-${Date.now()}`;
      const mockTier = 1;
      
      console.log(`Sending test notification to ${mockAuthorId}`);
      await notificationFactory.notifyCreator(mockAuthorId, mockNftAddress, mockTier);
    }

    console.log("\n=== Test Completed Successfully ===\n");
    console.log("Try changing NEXT_PUBLIC_SERVICE_MODE in .env to test different implementations");
    console.log("Options: enhanced, simple, free_tier, mock");
  } catch (error) {
    console.error("Error during test:", error);
  } finally {
    // Stop monitoring
    detector.stopMonitoring();
  }
}

main();
