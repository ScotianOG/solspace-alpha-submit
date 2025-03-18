// test-free-mode.js
import { ViralPostDetectorFactory } from '../src/services/common/ViralPostDetectorFactory.js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Simple test function to check if the free tier viral detector works
 */
async function testFreeTierDetector() {
  try {
    console.log("Starting free tier viral detector test...");
    
    // Get the detector factory instance
    const factory = ViralPostDetectorFactory.getInstance();
    
    // Get the detector for Twitter
    const detector = factory.getDetector('twitter');
    
    // Start monitoring
    console.log("Checking for viral content in free tier mode...");
    const viralPosts = await detector.startMonitoring();
    
    if (viralPosts.length === 0) {
      console.log("No viral posts detected. This is expected with free tier limits.");
    } else {
      console.log(`Found ${viralPosts.length} viral posts:`);
      viralPosts.forEach((post, index) => {
        console.log(`\nPost #${index + 1}:`);
        console.log(`- Content: ${post.content.substring(0, 50)}...`);
        console.log(`- Author: ${post.author}`);
        console.log(`- Likes: ${post.engagement.likes}`);
        console.log(`- Viral Score: ${post.viralScore}`);
        console.log(`- Tier: ${post.tier}`);
      });
    }
    
    // Get queue status
    const queueStatus = await detector.getQueueStatus();
    console.log("\nQueue Status:");
    console.log(`- Posts Scanned: ${queueStatus.postsScanned}`);
    console.log(`- Potential Posts: ${queueStatus.potentialPosts}`);
    console.log(`- Minted Today: ${queueStatus.mintedToday}`);
    
    // Get engagement stats
    const engagementStats = await detector.getEngagementStats();
    console.log("\nEngagement Stats:");
    console.log(`- Total Engagement: ${engagementStats.totalEngagement}`);
    console.log(`- Average Likes: ${engagementStats.averageLikes}`);
    console.log(`- Average Retweets: ${engagementStats.averageRetweets}`);
    
    // Get optimal posting times
    const optimalTimes = await detector.getOptimalPostingTimes();
    console.log("\nOptimal Posting Times:");
    optimalTimes.forEach(time => console.log(`- ${time}`));
    
    console.log("\nFree tier detector test completed successfully!");
  } catch (error) {
    console.error("Error testing free tier detector:", error);
  }
}

// Run the test
testFreeTierDetector()
  .then(() => {
    console.log("Test completed.");
  })
  .catch((error) => {
    console.error("Fatal error in test:", error);
  });
