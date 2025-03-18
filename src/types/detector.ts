import { ViralPost } from './index';

export interface IViralPostDetector {
  startMonitoring(): Promise<ViralPost[]>;
  stopMonitoring(): void;
  getQueueStatus(): Promise<{
    postsScanned: number;
    potentialPosts: number;
    mintedToday: number;
  }>;
  getQueuedPosts(): Promise<ViralPost[]>;
  getOptimalPostingTimes(): Promise<string[]>;
  getEngagementStats(): Promise<{
    totalEngagement: number;
    averageLikes: number;
    averageRetweets: number;
  }>;
}
