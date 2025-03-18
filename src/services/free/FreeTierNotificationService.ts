import { TwitterApi } from "twitter-api-v2";
import { API_LIMITS } from "../config/viralConfig";

/**
 * Queue-based notification service that respects free tier API limits
 */
export class FreeTierNotificationService {
  private twitterClient: TwitterApi;
  private notificationQueue: {
    authorId: string;
    nftAddress: string;
    tier: number;
    queuedAt: Date;
  }[] = [];
  private lastNotificationSent: Date | null = null;

  constructor(apiKey: string) {
    this.twitterClient = new TwitterApi(apiKey);
  }

  /**
   * Queue notification to be sent when rate limits allow
   * This method is compatible with other notification services
   */
  async notifyCreator(
    authorId: string,
    nftAddress: string,
    tier: number
  ): Promise<boolean> {
    // Add to queue
    this.notificationQueue.push({
      authorId,
      nftAddress,
      tier,
      queuedAt: new Date()
    });

    // Process queue if possible
    await this.processQueue();

    return true;
  }

  /**
   * Process notification queue respecting rate limits
   */
  async processQueue(): Promise<number> {
    // Free tier is extremely limited, so we can only send
    // 1 notification per 15 minutes
    if (this.lastNotificationSent) {
      const timeSinceLast = Date.now() - this.lastNotificationSent.getTime();
      const minInterval = 15 * 60 * 1000; // 15 minutes

      if (timeSinceLast < minInterval) {
        // Not enough time has passed
        return 0;
      }
    }

    // Process the oldest notification in the queue
    if (this.notificationQueue.length > 0) {
      const notification = this.notificationQueue.shift();
      
      if (notification) {
        try {
          await this.sendNotification(
            notification.authorId,
            notification.nftAddress,
            notification.tier
          );
          this.lastNotificationSent = new Date();
          return 1;
        } catch (error) {
          console.error("Error sending notification:", error);
          // Put back in queue if failed
          this.notificationQueue.unshift(notification);
          return 0;
        }
      }
    }

    return 0;
  }

  /**
   * Actually send the notification via Twitter API
   */
  private async sendNotification(
    authorId: string,
    nftAddress: string,
    tier: number
  ): Promise<boolean> {
    try {
      // Get tier-specific message template
      const templateKey = `TIER_${tier}_DM` as keyof typeof API_LIMITS.NOTIFICATION_TEMPLATES;
      const messageTemplate = API_LIMITS.NOTIFICATION_TEMPLATES[templateKey] || 
        API_LIMITS.NOTIFICATION_TEMPLATES.TIER_1_DM; // Fallback to tier 1 if not found

      // Replace placeholder with actual claim URL
      const claimUrl = `https://solspace.app/claim/${nftAddress}`;
      const message = messageTemplate.replace("{claimUrl}", claimUrl);

      // Log instead of actually sending for free tier testing
      console.log(`[FREE TIER] Would send DM to ${authorId}: ${message}`);
      
      // In a real implementation, we would uncomment this
      /*
      await this.twitterClient.v2.sendDmToParticipant(authorId, {
        text: message
      });
      */

      return true;
    } catch (error) {
      console.error("Error sending notification:", error);
      return false;
    }
  }

  /**
   * Get current queue status
   */
  getQueueStatus(): {
    queueLength: number;
    oldestQueuedAt: Date | null;
    lastSentAt: Date | null;
  } {
    return {
      queueLength: this.notificationQueue.length,
      oldestQueuedAt: this.notificationQueue[0]?.queuedAt || null,
      lastSentAt: this.lastNotificationSent
    };
  }

  /**
   * Send tier upgrade notification
   */
  async notifyTierUpgrade(
    authorId: string,
    nftAddress: string,
    oldTier: number,
    newTier: number
  ): Promise<boolean> {
    // Add to queue - will be processed when rate limits allow
    this.notificationQueue.push({
      authorId,
      nftAddress,
      tier: -1, // Special marker for tier upgrade
      queuedAt: new Date()
    });

    // Process queue if possible
    await this.processQueue();
    
    return true;
  }
}

export default FreeTierNotificationService;
