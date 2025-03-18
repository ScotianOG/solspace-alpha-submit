import { TwitterApi, TweetV2, TweetPublicMetricsV2 } from "twitter-api-v2";

// Define types for viral posts
interface ViralPost {
  id: string;
  content: string;
  authorId: string;
  metrics: TweetPublicMetricsV2;
  tier: number;
  timestamp: string;
}

export class SimpleViralDetector {
  private twitterClient: TwitterApi;
  
  constructor(apiKey: string) {
    this.twitterClient = new TwitterApi(apiKey);
  }
  
  async checkForViralPosts(): Promise<ViralPost[]> {
    try {
      // Simplified search for viral content
      const results = await this.twitterClient.v2.search(
        'min_faves:1000 -is:retweet lang:en', 
        {
          'tweet.fields': ['public_metrics', 'created_at', 'author_id'],
          max_results: 100,
        }
      );
      
      // Process results and filter viral posts
      const viralPosts = [];
      for (const tweet of results.data) {
        const metrics = tweet.public_metrics;
        const tier = this.determineTier(metrics, new Date(tweet.created_at));
        
        if (tier > 0) {
          viralPosts.push({
            id: tweet.id,
            content: tweet.text,
            authorId: tweet.author_id,
            metrics,
            tier,
            timestamp: tweet.created_at
          });
        }
      }
      
      return viralPosts;
    } catch (error) {
      console.error("Error detecting viral posts:", error);
      return [];
    }
  }
  
  private determineTier(metrics: TweetPublicMetricsV2, createdAt: Date): number {
    // Calculate hours since creation
    const hoursOld = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);
    const likeVelocity = metrics.like_count / Math.max(1, hoursOld);
    
    // Tier 3 (Viral)
    if (metrics.like_count >= 5000 || likeVelocity >= 500) {
      return 3;
    }
    
    // Tier 2 (Trending)
    if (metrics.like_count >= 2500 || likeVelocity >= 250) {
      return 2;
    }
    
    // Tier 1 (Rising)
    if (metrics.like_count >= 1000 || likeVelocity >= 100) {
      return 1;
    }
    
    return 0; // Not viral
  }
}
