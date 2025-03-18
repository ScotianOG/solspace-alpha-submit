import { TwitterApi, TweetPublicMetricsV2 } from "twitter-api-v2";
import { DatabaseService } from "./database";
import { NotificationService } from "./NotificationService";

/**
 * Service to monitor and update NFT tiers based on tweet engagement
 * Simplified for the MVP implementation
 */
export class SimpleEngagementMonitor {
  private twitterClient: TwitterApi;
  private notificationService: NotificationService;
  
  constructor(apiKey: string) {
    this.twitterClient = new TwitterApi(apiKey);
    this.notificationService = new NotificationService(apiKey);
  }
  
  /**
   * Check and update engagement for recently minted NFTs
   * @param hoursBack How many hours to look back for recent NFTs (default 48)
   */
  async checkAndUpdateEngagement(hoursBack: number = 48): Promise<number> {
    try {
      console.log(`Checking engagement for NFTs minted in the last ${hoursBack} hours...`);
      
      // Get NFTs minted in the last specified hours
      const cutoffDate = new Date(Date.now() - (hoursBack * 60 * 60 * 1000));
      const recentNFTs = await DatabaseService.getViralPostsAfterDate(cutoffDate);
      
      if (recentNFTs.length === 0) {
        console.log("No recent NFTs found to check engagement");
        return 0;
      }
      
      console.log(`Found ${recentNFTs.length} recent NFTs to check`);
      let updateCount = 0;
      
      // Process each NFT
      for (const nft of recentNFTs) {
        try {
          // Skip NFTs that are already at max tier
          if (nft.tier >= 3) {
            continue;
          }
          
          console.log(`Checking engagement for ${nft.tweetId} (current tier: ${nft.tier})`);
          
          // Fetch current tweet metrics
          const tweet = await this.twitterClient.v2.singleTweet(nft.tweetId, {
            "tweet.fields": ["public_metrics"]
          });
          
          const metrics = tweet.data.public_metrics;
          const newTier = this.determineNewTier(metrics, nft.tier);
          
          // Update if tier has increased
          if (newTier > nft.tier) {
            console.log(`Upgrading ${nft.tweetId} from tier ${nft.tier} to tier ${newTier}`);
            
            // Generate new metadata URI based on new tier
            const newMetadataUri = this.generateMetadataUri(nft.tweetId, newTier);
            
            // Update the NFT tier in the database
            await DatabaseService.updateViralPost(nft.tweetId, {
              tier: newTier,
              metadataUri: newMetadataUri
            });
            
            // Optional: Update the NFT on-chain (would be implemented in a production system)
            // await this.updateNFTOnChain(nft.nftAddress, newTier, newMetadataUri);
            
            // Notify the creator about the tier upgrade
            if (nft.authorId) {
              await this.notificationService.notifyTierUpgrade(
                nft.authorId,
                nft.nftAddress || '',
                nft.tier,
                newTier
              );
            }
            
            updateCount++;
          }
        } catch (error) {
          console.error(`Error updating engagement for ${nft.tweetId}:`, error);
          // Continue with next NFT
          continue;
        }
      }
      
      console.log(`Engagement check completed. Updated ${updateCount} NFTs.`);
      return updateCount;
    } catch (error) {
      console.error("Error in engagement monitoring:", error);
      return 0;
    }
  }
  
  /**
   * Determine new tier based on metrics
   * Simple tier logic based only on like count for MVP
   */
  private determineNewTier(metrics: { like_count: number; retweet_count?: number }, currentTier: number): number {
    // Simplified tier determination based only on like count
    if (metrics.like_count >= 5000 && currentTier < 3) {
      return 3; // Viral
    } else if (metrics.like_count >= 2500 && currentTier < 2) {
      return 2; // Trending
    }
    
    // No upgrade needed
    return currentTier;
  }
  
  /**
   * Generate metadata URI for a specific tier
   * In production, this would create and upload new metadata
   */
  private generateMetadataUri(tweetId: string, tier: number): string {
    // For MVP, just update the URI to indicate the tier
    // In production, this would generate actual metadata and upload to IPFS/Arweave
    return `https://metadata.solspace.app/${tweetId}/tier${tier}`;
  }
}

export default SimpleEngagementMonitor;
