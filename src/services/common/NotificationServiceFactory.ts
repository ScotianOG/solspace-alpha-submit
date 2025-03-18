import { NotificationService } from '../enhanced/NotificationService';
import { SimpleNotificationService } from '../simple/SimpleNotificationService';
import { FreeTierNotificationService } from '../free/FreeTierNotificationService';
import { getServiceMode, ServiceMode } from '../../types/service-mode';

// Define a common interface for all notification services
interface INotificationService {
  notifyCreator(authorId: string, nftAddress: string, tier: number): Promise<boolean>;
  notifyTierUpgrade(authorId: string, nftAddress: string, oldTier: number, newTier: number): Promise<boolean>;
}

/**
 * Factory for creating notification services based on the configured service mode
 */
export class NotificationServiceFactory {
  private static instance: NotificationServiceFactory;
  private service: INotificationService;
  private readonly serviceMode: ServiceMode;

  private constructor() {
    // Get service mode from environment
    this.serviceMode = getServiceMode();
    console.log(`NotificationServiceFactory initializing with service mode: ${this.serviceMode}`);

    // Initialize notification service based on service mode
    const apiKey = process.env.TWITTER_API_KEY || '';

    switch (this.serviceMode) {
      case ServiceMode.FREE_TIER:
        console.log('Using FreeTierNotificationService for reduced API usage');
        this.service = new FreeTierNotificationService(apiKey);
        break;
      case ServiceMode.SIMPLE:
        console.log('Using SimpleNotificationService for testing');
        this.service = new SimpleNotificationService(apiKey);
        break;
      case ServiceMode.MOCK:
        console.log('Using mock notification service');
        this.service = this.createMockNotificationService();
        break;
      case ServiceMode.ENHANCED:
      default:
        console.log('Using NotificationService for production');
        this.service = new NotificationService(apiKey);
    }
  }

  /**
   * Create a mock notification service that just logs actions
   */
  private createMockNotificationService(): INotificationService {
    return {
      notifyCreator: async (authorId: string, nftAddress: string, tier: number): Promise<boolean> => {
        console.log(`[MOCK] Would notify author ${authorId} about NFT ${nftAddress} (Tier ${tier})`);
        return true;
      },
      notifyTierUpgrade: async (authorId: string, nftAddress: string, oldTier: number, newTier: number): Promise<boolean> => {
        console.log(`[MOCK] Would notify author ${authorId} about tier upgrade from ${oldTier} to ${newTier} for NFT ${nftAddress}`);
        return true;
      }
    };
  }

  public static getInstance(): NotificationServiceFactory {
    if (!NotificationServiceFactory.instance) {
      NotificationServiceFactory.instance = new NotificationServiceFactory();
    }
    return NotificationServiceFactory.instance;
  }

  /**
   * Get the initialized notification service
   */
  public getService(): INotificationService {
    return this.service;
  }

  /**
   * Notify creator about their viral post
   */
  public async notifyCreator(authorId: string, nftAddress: string, tier: number): Promise<boolean> {
    return this.service.notifyCreator(authorId, nftAddress, tier);
  }

  /**
   * Notify creator about tier upgrade
   */
  public async notifyTierUpgrade(
    authorId: string,
    nftAddress: string,
    oldTier: number,
    newTier: number
  ): Promise<boolean> {
    return this.service.notifyTierUpgrade(authorId, nftAddress, oldTier, newTier);
  }
}
