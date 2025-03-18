import { TwitterApi } from "twitter-api-v2";
import { API_LIMITS } from "../config/viralConfig";
import { IViralPostDetector } from "../types/detector";
import type { ViralPost } from "../types";

// Rate limiting utility to ensure we don't exceed free tier limits
class RateLimiter {
  private lastRequestTime: Map<string, number> = new Map();

  canMakeRequest(endpoint: string): boolean {
    const now = Date.now();
    const last = this.lastRequestTime.get(endpoint) || 0;

    // Free tier is typically limited to 1 request per 15 minutes for most endpoints
    const minInterval = 15 * 60 * 1000; // 15 minutes in milliseconds

    if (now - last < minInterval) {
      return false;
    }

    return true;
  }

  recordRequest(endpoint: string): void {
    this.lastRequestTime.set(endpoint, Date.now());
  }

  getTimeUntilNextAvailable(endpoint: string): number {
    const now = Date.now();
    const last = this.lastRequestTime.get(endpoint) || 0;
    const minInterval = 15 * 60 * 1000;

    return Math.max(0, minInterval - (now - last));
  }
}

// Extended ViralPost type with internal fields
interface InternalViralPost extends ViralPost {
  id: string;
  authorId?: string;
  metrics?: {
    velocity: {
      likes_per_hour: number;
      retweets_per_hour: number;
    }
  };
  minted?: boolean;
}

export class FreeTierViralDetector implements IViralPostDetector {
  private twitterClient: TwitterApi;
  private rateLimiter: RateLimiter;
  private detectedPosts: InternalViralPost[] = [];
  private lastDetectionTime: Date | null = null;
  private todayMintCount = 0;

  constructor(apiKey: string) {
    this.twitterClient = new TwitterApi(apiKey);
    this.rateLimiter = new RateLimiter();
  }

  /**
   * Start monitoring for viral posts
   */
  async startMonitoring(): Promise<ViralPost[]> {
    const result = await this.checkForViralPosts();
    return this.getQueuedPosts();
  }

  /**
   * Stop monitoring for viral posts
   */
  stopMonitoring(): void {
    // Nothing to clean up with the free tier implementation
  }

  /**
   * Check for viral posts respecting free tier rate limits
   * For free tier we'll make a single request and cache results
   */
  async checkForViralPosts(): Promise<{
    posts: InternalViralPost[];
    status: 'success' | 'rate_limited' | 'error';
    message?: string;
    nextAvailableIn?: number;
  }> {
    // Check if we can make a request
    if (!this.rateLimiter.canMakeRequest('search')) {
      const nextAvailableIn = this.rateLimiter.getTimeUntilNextAvailable('search');
      return {
        posts: this.detectedPosts, // Return cached posts
        status: 'rate_limited',
        message: 'Rate limit reached for Twitter API',
        nextAvailableIn
      };
    }

    try {
      // Record this request
      this.rateLimiter.recordRequest('search');

      // For free tier we'll use a more targeted search to find viral content
      // with popular hashtags related to our domain
      const result = await this.twitterClient.v2.search(
        'min_faves:1000 (#web3 OR #NFT OR #blockchain OR #crypto) -is:retweet',
        {
          'tweet.fields': ['public_metrics', 'created_at', 'author_id'],
          'expansions': ['author_id'],
          'user.fields': ['username', 'name'],
          'max_results': 10 // Free tier only gives 10 results anyway
        }
      );

      // Update last detection time
      this.lastDetectionTime = new Date();

      // Process results to identify viral content
      const viralPosts: InternalViralPost[] = [];

      for (const tweet of result.data || []) {
        const metrics = tweet.public_metrics;
        const tier = this.determineTier(metrics, new Date(tweet.created_at));

        // Only consider viral content
        if (tier > 0) {
          // Find the author data
          const users = result.includes?.users || [];
          const author = users.find((u: {id: string}) => u.id === tweet.author_id);

          viralPosts.push({
            id: tweet.id,
            tweetId: tweet.id,
            content: tweet.text,
            author: author ? `@${author.username}` : 'unknown',
            authorId: tweet.author_id,
            timestamp: tweet.created_at,
            engagement: {
              likes: metrics.like_count,
              retweets: metrics.retweet_count,
              replies: metrics.reply_count,
              shares: metrics.retweet_count, // Duplicate for UI consistency
              comments: metrics.reply_count // Duplicate for UI consistency
            },
            metrics: {
              velocity: {
                likes_per_hour: this.calculateVelocity(metrics.like_count, new Date(tweet.created_at)),
                retweets_per_hour: this.calculateVelocity(metrics.retweet_count, new Date(tweet.created_at))
              }
            },
            viralScore: this.calculateViralScore(metrics, new Date(tweet.created_at)),
            tier,
            mintProgress: 0,
            minted: false,
            platform: "twitter"
          });
        }
      }

      // Refresh our cached posts
      if (viralPosts.length > 0) {
        this.detectedPosts = [...viralPosts, ...this.detectedPosts]
          // Deduplicate by ID
          .filter((post, index, self) =>
            index === self.findIndex(p => p.tweetId === post.tweetId)
          )
          // Keep only the 10 most recent
          .slice(0, 10);
      }

      return {
        posts: this.detectedPosts,
        status: 'success'
      };
    } catch (error) {
      console.error("Error detecting viral posts:", error);
      return {
        posts: this.detectedPosts, // Return cached posts on error
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get cached viral posts without making API requests
   */
  async getQueuedPosts(): Promise<ViralPost[]> {
    return this.detectedPosts.map(post => ({
      tweetId: post.tweetId,
      content: post.content,
      author: post.author,
      engagement: post.engagement,
      timestamp: post.timestamp,
      viralScore: post.viralScore,
      mintProgress: post.mintProgress || 0,
      platform: "twitter",
      tier: post.tier
    }));
  }

  /**
   * Get last detection time
   */
  getLastDetectionTime(): Date | null {
    return this.lastDetectionTime;
  }

  /**
   * Get cached viral posts without making an API request
   */
  getCachedViralPosts(): InternalViralPost[] {
    return this.detectedPosts;
  }

  /**
   * Get queue status
   */
  async getQueueStatus(): Promise<{
    postsScanned: number;
    potentialPosts: number;
    mintedToday: number;
    apiLimitStatus?: Record<string, unknown>;
  }> {
    return {
      postsScanned: this.detectedPosts.length * 10, // Rough estimate
      potentialPosts: this.detectedPosts.length,
      mintedToday: this.todayMintCount
    };
  }

  /**
   * Get optimal posting times (simple implementation for free tier)
   */
  async getOptimalPostingTimes(): Promise<string[]> {
    // Return some default optimal posting times
    return ["9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM"];
  }

  /**
   * Get engagement stats from cached posts
   */
  async getEngagementStats(): Promise<{
    totalEngagement: number;
    averageLikes: number;
    averageRetweets: number;
  }> {
    if (this.detectedPosts.length === 0) {
      return {
        totalEngagement: 0,
        averageLikes: 0,
        averageRetweets: 0
      };
    }

    const totals = this.detectedPosts.reduce(
      (acc, post) => {
        acc.likes += post.engagement.likes;
        acc.retweets += post.engagement.retweets;
        acc.replies += post.engagement.replies || 0;
        return acc;
      },
      { likes: 0, retweets: 0, replies: 0 }
    );

    return {
      totalEngagement: totals.likes + totals.retweets + totals.replies,
      averageLikes: Math.round(totals.likes / this.detectedPosts.length),
      averageRetweets: Math.round(totals.retweets / this.detectedPosts.length)
    };
  }

  /**
   * Determine the tier based on engagement metrics
   */
  private determineTier(metrics: { like_count: number; retweet_count: number; reply_count: number }, createdAt: Date): number {
    // Calculate hours since creation
    const hoursOld = Math.max(1, (Date.now() - createdAt.getTime()) / (1000 * 60 * 60));
    const likeVelocity = metrics.like_count / hoursOld;

    // For free tier we'll use higher thresholds to reduce the number of "viral" posts
    // so we can focus our limited API calls on truly viral content

    // Tier 3 (Viral)
    if (metrics.like_count >= 7500 || likeVelocity >= 750) {
      return 3;
    }

    // Tier 2 (Trending)
    if (metrics.like_count >= 5000 || likeVelocity >= 500) {
      return 2;
    }

    // Tier 1 (Rising)
    if (metrics.like_count >= 2500 || likeVelocity >= 250) {
      return 1;
    }

    return 0; // Not viral
  }

  /**
   * Calculate engagement velocity
   */
  private calculateVelocity(count: number, createdAt: Date): number {
    const hoursOld = Math.max(1, (Date.now() - createdAt.getTime()) / (1000 * 60 * 60));
    return Math.round(count / hoursOld);
  }

  /**
   * Calculate viral score (0-100)
   */
  private calculateViralScore(metrics: { like_count: number; retweet_count: number; reply_count: number }, createdAt: Date): number {
    const hoursOld = Math.max(1, (Date.now() - createdAt.getTime()) / (1000 * 60 * 60));

    // Basic score based on like velocity
    const likeVelocity = metrics.like_count / hoursOld;

    // Additional factors
    const rtFactor = 1 + (metrics.retweet_count / Math.max(1, metrics.like_count)) * 0.5;
    const replyFactor = 1 + (metrics.reply_count / Math.max(1, metrics.like_count)) * 0.3;

    // Recency bonus (newer content gets higher score)
    const recencyBonus = Math.max(1, 2 - (hoursOld / 24)); // Bonus for content less than 24h old

    // Calculate raw score
    const rawScore = likeVelocity * rtFactor * replyFactor * recencyBonus / 10;

    // Cap at 100 and ensure minimum 1
    return Math.min(100, Math.max(1, Math.round(rawScore)));
  }
}
