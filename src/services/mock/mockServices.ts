import type {
    TwitterPost,
    QueueStatus,
    APILimitStatus,
    ViralMetrics,
    ViralPost,
    MintedNFT
  } from "@/types";
  import { API_LIMITS } from "@/config/viralConfig";

  const mockPost: TwitterPost = {
    id: "1",
    author: "@cryptoinfluencer",
    authorId: "123456",
    content:
      "Web3 is revolutionizing how we think about content ownership! #blockchain #web3",
    engagement: {
      likes: 15000,
      retweets: 3000,
      replies: 500
    },
    timestamp: new Date().toISOString(),
    metrics: {
      likes: 15000,
      retweets: 3000,
      replies: 500,
      created_at: new Date().toISOString(),
      velocity: {
        likes_per_hour: 1500,
        retweets_per_hour: 300
      },
      engagement_rate: 22000,
      impression_count: 50000,
      bookmark_count: 20
    }
  };

  // Export mock viral posts for testing and development
  export const mockViralPosts: ViralPost[] = [
    {
      tweetId: "1",
      content: "Web3 is revolutionizing how we think about content ownership! #blockchain #web3",
      author: "@cryptoinfluencer",
      engagement: {
        likes: 15000,
        replies: 500,
        retweets: 3000
      },
      timestamp: new Date().toISOString(),
      viralScore: 85,
      mintProgress: 100,
      platform: "twitter",
      tier: 3
    },
    {
      tweetId: "2",
      content: "Just launched our new NFT collection! Check it out 🚀 #NFT #solana",
      author: "@nftcreator",
      engagement: {
        likes: 8000,
        replies: 300,
        retweets: 1500
      },
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      viralScore: 65,
      mintProgress: 0,
      platform: "twitter",
      tier: 2
    },
    {
      tweetId: "3",
      content: "The future of decentralized finance is here. Building on SONIC blockchain! #defi #sonic",
      author: "@defibuilder",
      engagement: {
        likes: 3500,
        replies: 200,
        retweets: 750
      },
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      viralScore: 45,
      mintProgress: 0,
      platform: "twitter",
      tier: 1
    }
  ];

  export class MockViralPostDetector {
    private recentlyChecked = new Set<string>();
    private potentialViral = new Map<string, ViralMetrics>();
    private mintingQueue: TwitterPost[] = [mockPost];
    private todayMintCount = 0;
    private lastUpdateTime = Date.now();
    private intervalId: NodeJS.Timeout | null = null;

    async monitorPosts() {
      // Start a periodic check
      if (this.intervalId === null) {
        this.intervalId = setInterval(() => {
          console.log("Monitoring posts...");
          // In a real implementation this would check Twitter API
        }, 5 * 60 * 1000); // Check every 5 minutes
      }

      return {
        status: "success" as const,
        processed: 1,
        queued: this.mintingQueue.length
      };
    }

    stopMonitoring() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }

    async getQueueStatus(): Promise<QueueStatus> {
      return {
        postsScanned: 156,
        potentialPosts: 3,
        mintedToday: this.todayMintCount,
        apiLimitStatus: {
          currentUsage: 156,
          dailyLimit: API_LIMITS.DAILY_OPERATIONS.VIRAL_CHECKS,
          usagePercent: 52,
          remaining: 144,
          nextReset: new Date(Date.now() + 8 * 60 * 60 * 1000)
        }
      };
    }

    async getQueuedPosts(): Promise<ViralPost[]> {
      return mockViralPosts;
    }

    async checkApiLimits(): Promise<boolean> {
      return true;
    }

    async getApiLimitStatus(): Promise<APILimitStatus> {
      return {
        currentUsage: 156,
        dailyLimit: 300,
        usagePercent: 52,
        remaining: 144,
        nextReset: new Date(Date.now() + 8 * 60 * 60 * 1000)
      };
    }

    async clearQueue(): Promise<void> {
      this.mintingQueue = [];
    }
  }

  export class MockTwitterMintingService {
    private mintedPosts: Map<string, MintedNFT> = new Map();

    async mintPost(post: TwitterPost): Promise<string> {
      // Simulate minting delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const nftAddress = `mock-nft-${post.id}`;
      const mintedPost: MintedNFT = {
        id: post.id,
        address: nftAddress,
        creator: post.authorId,
        tier: 1,
        content: post.content,
        engagement: {
          likes: post.engagement.likes,
          retweets: post.engagement.retweets,
          replies: post.engagement.replies
        },
        claimed: false,
        mintedAt: new Date().toISOString()
      };

      this.mintedPosts.set(post.id, mintedPost);
      return nftAddress;
    }

    async notifyCreator(post: TwitterPost, nftAddress: string): Promise<void> {
      // Simulate notification delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log(`Mock: Notified ${post.author} about NFT ${nftAddress}`);
    }

    async getClaimStatus(nftAddress: string): Promise<boolean> {
      const post = Array.from(this.mintedPosts.values()).find(
        (p) => p.address === nftAddress
      );
      return post?.claimed ?? false;
    }

    async claimNFT(nftAddress: string, twitterId: string, walletAddress: string): Promise<boolean> {
      const post = Array.from(this.mintedPosts.values()).find(
        (p) => p.address === nftAddress && p.creator === twitterId
      );

      if (!post) return false;

      post.claimed = true;
      post.owner = walletAddress;
      post.claimedAt = new Date().toISOString();
      this.mintedPosts.set(post.id, post);
      return true;
    }

    async getMintedPosts(): Promise<MintedNFT[]> {
      return Array.from(this.mintedPosts.values());
    }
  }

  // Generate a mock post for testing
  export const generateMockPost = (overrides = {}): TwitterPost => {
    const timestamp = new Date().toISOString();
    const likes = Math.floor(Math.random() * 50000) + 5000;
    const retweets = Math.floor(likes * 0.2);
    const replies = Math.floor(likes * 0.1);

    return {
      id: `mock-${Date.now()}`,
      author: "@mockuser",
      authorId: `mock-${Date.now()}`,
      content:
        "Another viral post about web3 and the future! #blockchain #crypto",
      engagement: {
        likes,
        retweets,
        replies
      },
      timestamp,
      metrics: {
        likes,
        retweets,
        replies,
        created_at: timestamp,
        velocity: {
          likes_per_hour: likes / 2,
          retweets_per_hour: retweets / 2
        },
        engagement_rate: likes + retweets * 2 + replies * 3,
        impression_count: likes * 3,
        bookmark_count: Math.floor(likes * 0.05)
      },
      ...overrides
    };
  };
