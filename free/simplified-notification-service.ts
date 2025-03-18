// src/services/FreeTierNotificationService.ts
import { TwitterApi } from "twitter-api-v2";

// Rate limiting utility to ensure we don't exceed free tier limits
class RateLimiter {
  private dailyCount: number = 0;
  private lastReset: Date = new Date();
  
  constructor() {
    // Reset counter at midnight
    this.scheduleReset();
  }
  
  private scheduleReset() {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilReset = tomorrow.getTime() - now.getTime();
    
    setTimeout(() => {
      this.dailyCount = 0;
      this.lastReset = new Date();
      this.scheduleReset();
    }, timeUntilReset);
  }
  
  canSendNotification(): boolean {
    // Free tier is limited to 17 requests per 24 hours for POST /2/tweets
    return this.dailyCount < 15; // Keep 2 in reserve for safety
  }
  
  recordNotification(): void {
    this.dailyCount++;
  }
  
  getRemainingCount(): number {
    return 15 - this.dailyCount;
  }
}

// Queue for tracking notifications that need to be sent
interface QueuedNotification {
  authorId: string;
  nftAddress: string;
  tier: number;
  timestamp: Date;
  type: 'mint' | 'upgrade';
  oldTier?: number;
}

export class FreeTierNotificationService {
  private twitterClient: TwitterApi;
  private rateLimiter: RateLimiter;
  private notificationQueue: QueuedNotification[] = [];
  private notificationLogs: Array<{
    timestamp: Date;
    authorId: string;
    nftAddress: string;
    message: string;
    status: 'sent' | 'queued' | 'error';
  }> = [];
  
  constructor(apiKey: string) {
    this.twitterClient = new TwitterApi(apiKey);
    this.rateLimiter = new RateLimiter();
    
    // Process queue every 30 minutes
    setInterval(() => this.processQueue(), 30 * 60 * 1000);
  }
  
  /**
   * Queue a notification to a creator about their minted NFT
   */
  async queueCreatorNotification(
    authorId: string,
    nftAddress: string,
    tier: number
  ): Promise<boolean> {
    // Add to queue
    this.notificationQueue.push({
      authorId,
      nftAddress,
      tier,
      timestamp: new Date(),
      type: 'mint'
    });
    
    // Log the queued notification
    this.notificationLogs.push({
      timestamp: new Date(),
      authorId,
      nftAddress,
      message: `Notification queued for tier ${tier} NFT`,
      status: 'queued'
    });
    
    // Process queue immediately if rate limit allows
    if (this.rateLimiter.canSendNotification()) {
      this.processQueue();
    }
    
    return true;
  }
  
  /**
   * Queue a notification about a tier upgrade
   */
  async queueTierUpgradeNotification(
    authorId: string,
    nftAddress: string,
    oldTier: number,
    newTier: number
  ): Promise<boolean> {
    // Add to queue
    this.notificationQueue.push({
      authorId,
      nftAddress,
      tier: newTier,
      oldTier,
      timestamp: new Date(),
      type: 'upgrade'
    });
    
    // Log the queued notification
    this.notificationLogs.push({
      timestamp: new Date(),
      authorId,
      nftAddress,
      message: `Tier upgrade notification queued: ${oldTier} → ${newTier}`,
      status: 'queued'
    });
    
    // Process queue immediately if rate limit allows
    if (this.rateLimiter.canSendNotification()) {
      this.processQueue();
    }
    
    return true;
  }
  
  /**
   * Process the notification queue (respecting rate limits)
   */
  private async processQueue(): Promise<void> {
    // Don't process if we're rate limited
    if (!this.rateLimiter.canSendNotification() || this.notificationQueue.length === 0) {
      return;
    }
    
    // Sort by timestamp (oldest first)
    this.notificationQueue.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    // Process up to our remaining capacity
    const remainingCapacity = this.rateLimiter.getRemainingCount();
    const toProcess = this.notificationQueue.splice(0, remainingCapacity);
    
    for (const notification of toProcess) {
      try {
        if (notification.type === 'mint') {
          await this.sendMintNotification(
            notification.authorId,
            notification.nftAddress,
            notification.tier
          );
        } else if (notification.type === 'upgrade' && notification.oldTier) {
          await this.sendTierUpgradeNotification(
            notification.authorId,
            notification.nftAddress,
            notification.oldTier,
            notification.tier
          );
        }
      } catch (error) {
        console.error(`Error sending notification:`, error);
        // Log the error
        this.notificationLogs.push({
          timestamp: new Date(),
          authorId: notification.authorId,
          nftAddress: notification.nftAddress,
          message: `Error sending notification: ${error instanceof Error ? error.message : 'Unknown error'}`,
          status: 'error'
        });
      }
    }
  }
  
  /**
   * Send a mint notification (respecting rate limits)
   */
  private async sendMintNotification(
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
      
      // For free tier, we'll simulate notification
      console.log(`[NOTIFICATION] To user ${authorId}: ${message}`);
      
      // Record this notification for rate limiting
      this.rateLimiter.recordNotification();
      
      // Log the sent notification
      this.notificationLogs.push({
        timestamp: new Date(),
        authorId,
        nftAddress,
        message: `Mint notification sent for tier ${tier}`,
        status: 'sent'
      });
      
      // In a real implementation with higher tier API access, we would send via Twitter DM
      // For now, we'll just simulate success
      return true;
    } catch (error) {
      console.error("Error sending notification:", error);
      return false;
    }
  }
  
  /**
   * Send a tier upgrade notification (respecting rate limits)
   */
  private async sendTierUpgradeNotification(
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
      
      // For free tier, we'll simulate notification
      console.log(`[NOTIFICATION] To user ${authorId}: ${message}`);
      
      // Record this notification for rate limiting
      this.rateLimiter.recordNotification();
      
      // Log the sent notification
      this.notificationLogs.push({
        timestamp: new Date(),
        authorId,
        nftAddress,
        message: `Tier upgrade notification sent: ${oldTier} → ${newTier}`,
        status: 'sent'
      });
      
      // In a real implementation with higher tier API access, we would send via Twitter DM
      // For now, we'll just simulate success
      return true;
    } catch (error) {
      console.error("Error sending tier upgrade notification:", error);
      return false;
    }
  }
  
  /**
   * Get notification logs for debugging
   */
  getNotificationLogs() {
    return this.notificationLogs;
  }
  
  /**
   * Get current notification queue
   */
  getNotificationQueue() {
    return this.notificationQueue;
  }
  
  /**
   * Get rate limit status
   */
  getRateLimitStatus() {
    return {
      remainingNotifications: this.rateLimiter.getRemainingCount(),
      queueLength: this.notificationQueue.length
    };
  }
}
