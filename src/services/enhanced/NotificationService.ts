import { TwitterApi } from "twitter-api-v2";

export class NotificationService {
  private twitterClient: TwitterApi;
  
  constructor(apiKey: string) {
    this.twitterClient = new TwitterApi(apiKey);
  }
  
  async notifyCreator(
    authorId: string, 
    nftAddress: string,
    tier: number
  ): Promise<boolean> {
    try {
      const tierNames = ["", "Rising", "Trending", "Viral"];
      const message = `
🎉 Congratulations! Your post has gone ${tierNames[tier]}!

We've preserved it as an NFT on the blockchain, giving you true ownership of your viral content.

Claim your NFT here: https://solspace.app/claim/${nftAddress}

No crypto experience needed - we'll guide you through the process!
`;
      
      await this.twitterClient.v2.sendDmToParticipant(authorId, {
        text: message,
      });
      
      return true;
    } catch (error) {
      console.error("Error sending notification:", error);
      return false;
    }
  }
  
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
      
      return true;
    } catch (error) {
      console.error("Error sending tier upgrade notification:", error);
      return false;
    }
  }
}
