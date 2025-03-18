import { TwitterApi, TweetV2, TweetPublicMetricsV2 } from "twitter-api-v2";
import { API_LIMITS } from "./viralConfig";
import { EnhancedAPILimitTracker } from "@/services";
import { IViralPostDetector } from "@/types/detector";
import type {
  TwitterPost,
  MonitoringResult,
  QueueStatus,
  APILimitStatus,
  ViralMetrics,
  SearchQuery,
  ViralPost
} from "@/types";

/**
 * Enhanced viral post detector with improved algorithms
 * and better rate limit handling
 */
export class EnhancedViralPostDetector implements IViralPostDetector {
  private client: TwitterApi;
  private apiLimitTracker: EnhancedAPILimitTracker;
  private isMonitoring: boolean = false;
  private monitoringInterval: NodeJS.Timeout | null = null;
  
  // Track viral posts
  private viralPosts: Map<string, ViralPost> = new Map();
  private pendingQueue: string[] = [];
  private mintingQueue: string[] = [];
  
  constructor(bearerToken: string) {
    this.client = new TwitterApi(bearerToken);
    this.apiLimitTracker = new EnhancedAPILimitTracker();
  }
  
  /**
   * Start monitoring for viral posts
   */
  async startMonitoring(interval: number = 5 * 60 * 1000): Promise<void> {
    if (this.isMonitoring) {
      console.log("Monitoring already active");
      return;
    }
    
    this.isMonitoring = true;
    await this.checkForViralPosts();
    
    this.monitoringInterval = setInterval(async () => {
      await this.checkForViralPosts();
    }, interval);
    
    console.log(`Monitoring started with interval: ${interval}ms`);
  }
  
  /**
   * Stop monitoring for viral posts
   */
  stopMonitoring(): void {
    if (!this.isMonitoring || !this.monitoringInterval) {
      console.log("No active monitoring to stop");
      return;
    }
    
    clearInterval(this.monitoringInterval);
    this.monitoringInterval = null;
    this.isMonitoring = false;
    console.log("Monitoring stopped");
  }
  
  /**
   * Check Twitter for viral posts
   */
  async checkForViralPosts(): Promise<MonitoringResult> {
    try {
      console.log("Checking for viral posts...");
      
      // Check API limits first
      if (this.apiLimitTracker.isLimitExceeded('twitter')) {
        console.log("Twitter API rate limit exceeded, skipping check");
        return {
          success: false,
          newViralPosts: [],
          error: "API rate limit exceeded"
        };
      }
      
      // Track API usage
      this.apiLimitTracker.trackUsage('twitter', 10); // Estimate 10 API calls per check
      
      // Run searches for potential viral posts
      const queries: SearchQuery[] = [
        { query: "#NFT", minEngagement: 500 },
        { query: "#Solana", minEngagement: 300 },
        { query: "#Web3", minEngagement: 400 },
        { query: "#Blockchain", minEngagement: 250 }
      ];
      
      const results = await Promise.all(
        queries.map(q => this.searchForViralTweets(q.query, q.minEngagement))
      );
      
      // Flatten and deduplicate results
      const uniqueResults: Map<string, ViralPost> = new Map();
      results.forEach(batch => {
        batch.forEach(post => {
          if (!uniqueResults.has(post.tweetId)) {
            uniqueResults.set(post.tweetId, post);
          }
        });
      });
      
      const newViralPosts = Array.from(uniqueResults.values());
      
      // Add new viral posts to tracking
      newViralPosts.forEach(post => {
        // Only track if not already tracked
        if (!this.viralPosts.has(post.tweetId)) {
          this.viralPosts.set(post.tweetId, post);
          this.pendingQueue.push(post.tweetId);
        }
      });
      
      return {
        success: true,
        newViralPosts,
        totalTracked: this.viralPosts.size,
        pendingCount: this.pendingQueue.length,
        mintingCount: this.mintingQueue.length
      };
    } catch (error) {
      console.error("Error checking for viral posts:", error);
      return {
        success: false,
        newViralPosts: [],
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * Search Twitter for viral tweets
   */
  private async searchForViralTweets(query: string, minEngagement: number): Promise<ViralPost[]> {
    try {
      console.log(`Searching for viral tweets with query: ${query}`);
      
      // Search for tweets
      const result = await this.client.v2.search(`${query} -is:retweet`, {
        "tweet.fields": ["public_metrics", "created_at", "author_id"],
        "user.fields": ["username"],
        "expansions": ["author_id"]
      });
      
      // Track API usage
      this.apiLimitTracker.trackUsage('twitter', 1);
      
      // Filter and map to viral posts
      const viralPosts: ViralPost[] = [];
      
      for await (const tweet of result) {
        // Calculate engagement
        const engagement = this.calculateEngagement(tweet);
        
        // Calculate viral score
        const viralScore = this.calculateViralScore(tweet, engagement);
        
        // Check if meets viral threshold
        if (engagement.total >= minEngagement && viralScore >= API_LIMITS.VIRAL_SCORE_THRESHOLD) {
          // Find author info
          const authorInfo = result.includes?.users?.find(u => u.id === tweet.author_id);
          
          viralPosts.push({
            tweetId: tweet.id,
            content: tweet.text,
            author: authorInfo ? `@${authorInfo.username}` : `@unknown`,
            timestamp: tweet.created_at || new Date().toISOString(),
            engagement,
            viralScore,
            mintStatus: "pending",
            mintProgress: 0
          });
        }
      }
      
      console.log(`Found ${viralPosts.length} viral posts for query: ${query}`);
      return viralPosts;
    } catch (error) {
      console.error(`Error searching for viral tweets with query ${query}:`, error);
      throw error;
    }
  }
  
  /**
   * Calculate engagement for a tweet
   */
  private calculateEngagement(tweet: TweetV2): ViralMetrics {
    const metrics = tweet.public_metrics || {
      retweet_count: 0,
      reply_count: 0,
      like_count: 0,
      quote_count: 0
    };
    
    const likes = metrics.like_count || 0;
    const retweets = metrics.retweet_count || 0;
    const replies = metrics.reply_count || 0;
    const quotes = metrics.quote_count || 0;
    
    // Calculate total engagement
    const total = likes + retweets * 2 + replies + quotes * 2;
    
    return {
      likes,
      retweets,
      replies,
      quotes,
      total
    };
  }
  
  /**
   * Calculate viral score for a tweet
   */
  private calculateViralScore(tweet: TweetV2, metrics: ViralMetrics): number {
    const { likes, retweets, replies, quotes, total } = metrics;
    
    // Basic score is total engagement
    let score = total;
    
    // Boost for high retweets (they spread content)
    if (retweets > 100) score += 15;
    if (retweets > 250) score += 15;
    if (retweets > 500) score += 20;
    
    // Boost for likes/retweet ratio (indicates quality)
    const likesRetweetRatio = retweets > 0 ? likes / retweets : 0;
    if (likesRetweetRatio > 2) score += 5;
    if (likesRetweetRatio > 4) score += 10;
    
    // Boost for reply/like ratio (indicates conversation)
    const replyLikeRatio = likes > 0 ? replies / likes : 0;
    if (replyLikeRatio > 0.2) score += 10;
    
    // Time decay - fresher content scores higher
    const tweetAge = tweet.created_at
      ? (Date.now() - new Date(tweet.created_at).getTime()) / (1000 * 60 * 60)
      : 24; // Default to 24 hours if no date
    
    // Reduce score for older tweets (0-20% reduction based on age)
    const timeDecay = Math.min(0.2, tweetAge / 120); // Max 20% reduction
    score = score * (1 - timeDecay);
    
    // Normalize score to 0-100 range
    return Math.min(100, Math.round(score / 10));
  }
  
  /**
   * Get queue status information
   */
  getQueueStatus(): QueueStatus {
    return {
      pendingPosts: this.pendingQueue.length,
      mintingPosts: this.mintingQueue.length,
      totalTracked: this.viralPosts.size,
      isMonitoring: this.isMonitoring,
      apiLimitStatus: this.apiLimitTracker.getLimitStatus('twitter') as APILimitStatus,
    };
  }
  
  /**
   * Get all tracked viral posts
   */
  getViralPosts(status?: 'pending' | 'minting' | 'completed'): ViralPost[] {
    let posts: ViralPost[] = Array.from(this.viralPosts.values());
    
    // Filter by status if requested
    if (status) {
      posts = posts.filter(post => post.mintStatus === status);
    }
    
    return posts;
  }
  
  /**
   * Get a specific viral post by ID
   */
  getViralPost(tweetId: string): ViralPost | undefined {
    return this.viralPosts.get(tweetId);
  }
  
  /**
   * Update the status of a viral post
   */
  updateViralPostStatus(tweetId: string, status: 'pending' | 'minting' | 'completed', progress: number = 0): boolean {
    const post = this.viralPosts.get(tweetId);
    if (!post) return false;
    
    // Update the post status
    post.mintStatus = status;
    post.mintProgress = progress;
    this.viralPosts.set(tweetId, post);
    
    // Update queues
    if (status === 'minting') {
      // Move from pending to minting
      this.pendingQueue = this.pendingQueue.filter(id => id !== tweetId);
      if (!this.mintingQueue.includes(tweetId)) {
        this.mintingQueue.push(tweetId);
      }
    } else if (status === 'completed') {
      // Remove from both queues
      this.pendingQueue = this.pendingQueue.filter(id => id !== tweetId);
      this.mintingQueue = this.mintingQueue.filter(id => id !== tweetId);
    }
    
    return true;
  }
}

export default EnhancedViralPostDetector;
