import { DatabaseService } from './database';
import { APILimitStatus } from '@/types';

interface SystemHealth {
  apiLimits: {
    [endpoint: string]: APILimitStatus;
  };
  queueStatus: {
    pendingPosts: number;
    mintingPosts: number;
    pendingClaims: number;
  };
  errors: {
    count: number;
    lastError?: {
      message: string;
      timestamp: Date;
    };
  };
}

class MonitoringError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'MonitoringError';
  }
}

export class MonitoringService {
  private static instance: MonitoringService;
  private errors: Array<Error & { timestamp: Date }> = [];
  private healthStatus: SystemHealth = {
    apiLimits: {},
    queueStatus: {
      pendingPosts: 0,
      mintingPosts: 0,
      pendingClaims: 0,
    },
    errors: {
      count: 0,
    },
  };

  private constructor() {
    this.startMonitoring();
  }

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  private async startMonitoring() {
    // Monitor every 5 minutes
    setInterval(async () => {
      try {
        await this.checkSystemHealth();
      } catch (error) {
        console.error('Health check failed:', error);
        this.recordError(error);
      }
    }, 5 * 60 * 1000);

    // Clean up old errors every hour
    setInterval(() => {
      this.cleanupErrors();
    }, 60 * 60 * 1000);
  }

  private async checkSystemHealth() {
    try {
      // Check API limits
      const endpoints = ['twitter', 'search', 'user'];
      for (const endpoint of endpoints) {
        const limit = await DatabaseService.getAPILimit(endpoint);
        if (limit) {
          this.healthStatus.apiLimits[endpoint] = {
            currentUsage: limit.usage,
            dailyLimit: limit.limit,
            usagePercent: (limit.usage / limit.limit) * 100,
            remaining: limit.limit - limit.usage,
            nextReset: limit.resetAt,
          };

          // Alert if usage is high
          if ((limit.usage / limit.limit) > 0.8) {
            this.alert(`High API usage for ${endpoint}: ${Math.round((limit.usage / limit.limit) * 100)}%`);
          }
        }
      }

      // Check queue status
      const [pendingPosts, mintingPosts] = await Promise.all([
        DatabaseService.getViralPosts('pending'),
        DatabaseService.getViralPosts('minting'),
      ]);

      this.healthStatus.queueStatus = {
        pendingPosts: pendingPosts.length,
        mintingPosts: mintingPosts.length,
        pendingClaims: (await DatabaseService.getClaimsByAuthor('')).filter(c => c.status === 'pending').length,
      };

      // Alert if queue is getting large
      if (pendingPosts.length > 100) {
        this.alert(`Large pending posts queue: ${pendingPosts.length} posts`);
      }
      if (mintingPosts.length > 50) {
        this.alert(`Large minting queue: ${mintingPosts.length} posts`);
      }

    } catch (error) {
      throw new MonitoringError('Health check failed', error);
    }
  }

  private alert(message: string) {
    // TODO: Implement proper alerting (e.g., email, Slack, etc.)
    console.warn(`[ALERT] ${message}`);
  }

  private recordError(error: unknown) {
    const timestamp = new Date();
    const trackedError = Object.assign(
      error instanceof Error ? error : new Error(String(error)),
      { timestamp }
    );
    this.errors.push(trackedError);
    this.healthStatus.errors = {
      count: this.errors.length,
      lastError: {
        message: error instanceof Error ? error.message : String(error),
        timestamp,
      },
    };

    // Alert if there are many errors
    if (this.errors.length > 10) {
      this.alert(`High error rate: ${this.errors.length} errors in the last hour`);
    }
  }

  private cleanupErrors() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    this.errors = this.errors.filter(error => error.timestamp > oneHourAgo);
    this.healthStatus.errors.count = this.errors.length;
  }

  // Public methods
  public static recordError(error: unknown) {
    MonitoringService.getInstance().recordError(error);
  }

  public static getHealth(): SystemHealth {
    return MonitoringService.getInstance().healthStatus;
  }

  public static async checkHealth(): Promise<SystemHealth> {
    await MonitoringService.getInstance().checkSystemHealth();
    return MonitoringService.getInstance().healthStatus;
  }
}
