import { ViralPost } from '../../types';
import { IViralPostDetector } from '../../types/detector';
import { EnhancedViralPostDetector } from '../enhanced/EnhancedViralPostDetector';
import { SimpleViralDetector } from '../simple/SimpleViralDetector';
import { FreeTierViralDetector } from '../free/FreeTierViralDetector';
import { getServiceMode, ServiceMode } from '../../types/service-mode';
import { mockViralPosts } from '../mock/mockServices';

export type SocialPlatform = 'twitter';

// Adapter to make SimpleViralDetector compatible with IViralPostDetector interface
class SimpleViralDetectorAdapter implements IViralPostDetector {
  private detector: SimpleViralDetector;
  
  constructor(apiKey: string) {
    this.detector = new SimpleViralDetector(apiKey);
  }
  
  async startMonitoring(): Promise<ViralPost[]> {
    const posts = await this.detector.checkForViralPosts();
    return posts.map(post => ({
      tweetId: post.id,
      content: post.content,
      author: `@user_${post.authorId.substring(0, 6)}`,
      engagement: {
        likes: post.metrics.like_count,
        retweets: post.metrics.retweet_count,
        replies: post.metrics.reply_count || 0
      },
      timestamp: post.timestamp,
      viralScore: post.tier * 25, // Simple calculation
      mintProgress: 0,
      platform: "twitter",
      tier: post.tier
    }));
  }
  
  stopMonitoring(): void {
    // Simple detector doesn't have anything to clean up
  }
  
  async getQueueStatus(): Promise<{
    postsScanned: number;
    potentialPosts: number;
    mintedToday: number;
  }> {
    return {
      postsScanned: 100, // Estimate
      potentialPosts: 10, // Estimate
      mintedToday: 0
    };
  }
  
  async getQueuedPosts(): Promise<ViralPost[]> {
    return this.startMonitoring(); // Re-run the check
  }
  
  async getOptimalPostingTimes(): Promise<string[]> {
    return ["9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM"]; // Standard times
  }
  
  async getEngagementStats(): Promise<{
    totalEngagement: number;
    averageLikes: number;
    averageRetweets: number;
  }> {
    const posts = await this.detector.checkForViralPosts();
    if (posts.length === 0) {
      return {
        totalEngagement: 0,
        averageLikes: 0,
        averageRetweets: 0
      };
    }
    
    const total = posts.reduce((acc, post) => {
      acc.likes += post.metrics.like_count;
      acc.retweets += post.metrics.retweet_count;
      return acc;
    }, { likes: 0, retweets: 0 });
    
    return {
      totalEngagement: total.likes + total.retweets,
      averageLikes: Math.round(total.likes / posts.length),
      averageRetweets: Math.round(total.retweets / posts.length)
    };
  }
}

// Mock detector for development without API calls
class MockViralDetector implements IViralPostDetector {
  async startMonitoring(): Promise<ViralPost[]> {
    return mockViralPosts;
  }
  
  stopMonitoring(): void {}
  
  async getQueueStatus(): Promise<{
    postsScanned: number;
    potentialPosts: number;
    mintedToday: number;
  }> {
    return {
      postsScanned: 250,
      potentialPosts: mockViralPosts.length,
      mintedToday: 3
    };
  }
  
  async getQueuedPosts(): Promise<ViralPost[]> {
    return mockViralPosts;
  }
  
  async getOptimalPostingTimes(): Promise<string[]> {
    return ["9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM"];
  }
  
  async getEngagementStats(): Promise<{
    totalEngagement: number;
    averageLikes: number;
    averageRetweets: number;
  }> {
    const total = mockViralPosts.reduce((acc, post) => {
      acc.likes += post.engagement.likes;
      acc.retweets += post.engagement.retweets;
      return acc;
    }, { likes: 0, retweets: 0 });
    
    return {
      totalEngagement: total.likes + total.retweets,
      averageLikes: Math.round(total.likes / mockViralPosts.length),
      averageRetweets: Math.round(total.retweets / mockViralPosts.length)
    };
  }
}

/**
 * Factory class for creating viral post detectors based on the selected service mode
 */
export class ViralPostDetectorFactory {
  private static instance: ViralPostDetectorFactory;
  private detectors: Map<SocialPlatform, IViralPostDetector> = new Map();
  private readonly serviceMode: ServiceMode;

  private constructor() {
    // Get service mode from environment
    this.serviceMode = getServiceMode();
    console.log(`ViralPostDetectorFactory initializing with service mode: ${this.serviceMode}`);

    // Initialize detector based on service mode
    const apiKey = process.env.TWITTER_API_KEY || '';
    
    switch (this.serviceMode) {
      case ServiceMode.FREE_TIER:
        console.log('Using FreeTierViralDetector for reduced API usage');
        this.detectors.set('twitter', new FreeTierViralDetector(apiKey));
        break;
      case ServiceMode.SIMPLE:
        console.log('Using SimpleViralDetector for testing');
        this.detectors.set('twitter', new SimpleViralDetectorAdapter(apiKey));
        break;
      case ServiceMode.MOCK:
        console.log('Using mock data for viral detection');
        this.detectors.set('twitter', new MockViralDetector());
        break;
      case ServiceMode.ENHANCED:
      default:
        console.log('Using EnhancedViralPostDetector for production');
        this.detectors.set('twitter', new EnhancedViralPostDetector(apiKey));
    }
  }

  public static getInstance(): ViralPostDetectorFactory {
    if (!ViralPostDetectorFactory.instance) {
      ViralPostDetectorFactory.instance = new ViralPostDetectorFactory();
    }
    return ViralPostDetectorFactory.instance;
  }

  public getDetector(platform: SocialPlatform) {
    const detector = this.detectors.get(platform);
    if (!detector) {
      throw new Error(`No detector found for platform: ${platform}`);
    }
    return detector;
  }

  public async startMonitoringAll(): Promise<Map<SocialPlatform, ViralPost[]>> {
    const results = new Map<SocialPlatform, ViralPost[]>();

    const entries = Array.from(this.detectors.entries());
    for (const [platform, detector] of entries) {
      try {
        const posts = await detector.startMonitoring();
        results.set(platform, posts);
      } catch (error) {
        console.error(`Error monitoring ${platform}:`, error);
        results.set(platform, []);
      }
    }

    return results;
  }

  public stopMonitoringAll(): void {
    const detectors = Array.from(this.detectors.values());
    detectors.forEach(detector => {
      try {
        detector.stopMonitoring();
      } catch (error) {
        console.error('Error stopping detector:', error);
      }
    });
  }

  public async getQueueStatus(platform: SocialPlatform) {
    const detector = this.getDetector(platform);
    return detector.getQueueStatus();
  }

  public async getQueuedPosts(platform: SocialPlatform): Promise<ViralPost[]> {
    const detector = this.getDetector(platform);
    return detector.getQueuedPosts();
  }

  public async getOptimalPostingTimes(platform: SocialPlatform): Promise<string[]> {
    const detector = this.getDetector(platform);
    return detector.getOptimalPostingTimes();
  }

  public async getEngagementStats(platform: SocialPlatform) {
    const detector = this.getDetector(platform);
    return detector.getEngagementStats();
  }

  // Helper method to get combined stats across all platforms
  public async getCombinedStats() {
    const stats = {
      totalPostsScanned: 0,
      totalPotentialPosts: 0,
      totalMintedToday: 0,
      platformBreakdown: new Map<SocialPlatform, {
        postsScanned: number;
        potentialPosts: number;
        mintedToday: number;
      }>()
    };

    const platforms = Array.from(this.detectors.keys());
    for (const platform of platforms) {
      const status = await this.getQueueStatus(platform);
      stats.totalPostsScanned += status.postsScanned;
      stats.totalPotentialPosts += status.potentialPosts;
      stats.totalMintedToday += status.mintedToday;
      stats.platformBreakdown.set(platform, {
        postsScanned: status.postsScanned,
        potentialPosts: status.potentialPosts,
        mintedToday: status.mintedToday
      });
    }

    return stats;
  }
}
