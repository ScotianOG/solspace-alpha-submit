import { TwitterApi } from "twitter-api-v2";
import { API_LIMITS } from "../config/viralConfig";

/**
 * SimpleNotificationService - A streamlined notification service for the SONIC MVP
 * Focuses only on Twitter DM notifications with minimal overhead
 */
export class SimpleNotificationService {
  private twitterClient: TwitterApi;
  
  constructor(apiKey: string) {
    this.twitterClient = new TwitterApi(apiKey);
  }
  
  /**
   * Send notification to content creator about their viral post
   * @param authorId Twitter author ID
   * @param nftAddress NFT address for claiming
   * @param tier Viral tier (1-3)
   * @returns Success status
   */
  async notifyCreator(authorId: string, nftAddress: string, tier: number): Promise<boolean> {
    try {
      // Get tier-specific message template
      const messageTemplate = API_LIMITS.NOTIFICATION_TEMPLATES[`TIER_${tier}_DM`];
      
      // Replace placeholder with actual claim URL
      const claimUrl = `https://solspace.app/claim/${nftAddress}`;
      const message = messageTemplate.replace("{claimUrl}", claimUrl);
      
      // Send DM to author
      await this.twitterClient.v2.sendDmToParticipant(authorId, {
        text: message,
      });
      
      console.log(`Notification sent to author ${authorId} for NFT ${nftAddress}`);
      return true;
    } catch (error) {
      console.error("Error sending notification:", error);
      return false;
    }
  }
  
  /**
   * Send tier upgrade notification
   * @param authorId Twitter author ID
   * @param nftAddress NFT address
   * @param oldTier Previous tier (1-2)
   * @param newTier New tier (2-3)
   * @returns Success status
   */
  async notifyTierUpgrade(
    authorId: string,
    nftAddress: string,
    oldTier: number,
    newTier: number
  ): Promise<boolean> {
    try {
      const tierNames = ["", "Rising", "Trending", "Viral"];
      const message = `
🚀 Your content is gaining momentum!

Your ${tierNames[oldTier]} post has been upgraded to ${tierNames[newTier]}!

This increases its value and visibility. View your NFT: https://solspace.app/nft/${nftAddress}
`;
      
      await this.twitterClient.v2.sendDmToParticipant(authorId, {
        text: message,
      });
      
      console.log(`Tier upgrade notification sent to author ${authorId} for NFT ${nftAddress}`);
      return true;
    } catch (error) {
      console.error("Error sending tier upgrade notification:", error);
      return false;
    }
  }
}

export default SimpleNotificationService;
