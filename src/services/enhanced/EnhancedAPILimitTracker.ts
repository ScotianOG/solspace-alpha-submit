// src/services/EnhancedAPILimitTracker.ts
import { APILimitStatus } from "@/types";
import { API_LIMITS } from "@/config/viralConfig";

interface RateLimit {
  limit: number;
  remaining: number;
  reset: Date;
}

/**
 * Enhanced API limit tracker with improved rate limiting
 * and support for Twitter API v2 headers
 */
export class EnhancedAPILimitTracker {
  private limits: Map<string, RateLimit> = new Map();
  private requestCounts: Map<string, number> = new Map();
  private dailyReset: Date = new Date();

  constructor() {
    this.resetDailyCounts();
  }

  /**
   * Update limits based on API response headers
   * @param endpoint Endpoint name (for tracking different rate limits)
   * @param headers Response headers from Twitter API
   */
  updateLimitsFromHeaders(endpoint: string, headers: Record<string, string | string[] | undefined>): void {
    if (
      headers["x-rate-limit-limit"] &&
      headers["x-rate-limit-remaining"] &&
      headers["x-rate-limit-reset"]
    ) {
      const limitValue = Array.isArray(headers["x-rate-limit-limit"]) ? headers["x-rate-limit-limit"][0] : headers["x-rate-limit-limit"];
      const remainingValue = Array.isArray(headers["x-rate-limit-remaining"]) ? headers["x-rate-limit-remaining"][0] : headers["x-rate-limit-remaining"];
      const resetValue = Array.isArray(headers["x-rate-limit-reset"]) ? headers["x-rate-limit-reset"][0] : headers["x-rate-limit-reset"];
      
      const limit = parseInt(limitValue as string, 10);
      const remaining = parseInt(remainingValue as string, 10);
      const resetTimestamp = parseInt(resetValue as string, 10) * 1000;
      
      this.limits.set(endpoint, {
        limit,
        remaining,
        reset: new Date(resetTimestamp)
      });
      
      console.log(`Updated limits for ${endpoint}: ${remaining}/${limit}, resets at ${new Date(resetTimestamp)}`);
    }
  }

  /**
   * Record API request and increment counter
   * @param endpoint Endpoint name
   */
  recordRequest(endpoint: string): void {
    const currentCount = this.requestCounts.get(endpoint) || 0;
    this.requestCounts.set(endpoint, currentCount + 1);
    
    // Check if we need to reset daily counts
    this.checkAndResetDaily();
  }

  /**
   * Check if a request can be made to the specified endpoint
   * @param endpoint Endpoint name
   * @param safetyBuffer Safety buffer percentage (0-1)
   * @returns boolean indicating if request can be made
   */
  canMakeRequest(endpoint: string, safetyBuffer: number = API_LIMITS.DAILY_OPERATIONS.RATE_LIMIT_BUFFER): boolean {
    // Check if we need to reset daily counts
    this.checkAndResetDaily();
    
    // Check endpoint-specific rate limit
    const limit = this.limits.get(endpoint);
    if (limit) {
      // If we're past the reset time, consider the limit reset
      if (new Date() > limit.reset) {
        return true;
      }
      
      // Apply safety buffer to remaining requests
      const safeRemaining = Math.floor(limit.remaining * (1 - safetyBuffer));
      return safeRemaining > 0;
    }
    
    // Check daily request limits
    const maxDaily = Math.floor(
      endpoint === "search" 
        ? API_LIMITS.MONTHLY_LIMITS.TWEET_LOOKUP / 30
        : API_LIMITS.MONTHLY_LIMITS.POST_READS / 30
    );
    
    const currentCount = this.requestCounts.get(endpoint) || 0;
    const safeMax = Math.floor(maxDaily * (1 - safetyBuffer));
    
    return currentCount < safeMax;
  }

  /**
   * Get current API limit status for an endpoint
   * @param endpoint Endpoint name
   * @returns Current status
   */
  getStatus(endpoint: string): APILimitStatus {
    const limit = this.limits.get(endpoint);
    const dailyCount = this.requestCounts.get(endpoint) || 0;
    
    // If we have specific endpoint limits, use those
    if (limit) {
      return {
        currentUsage: limit.limit - limit.remaining,
        dailyLimit: limit.limit,
        usagePercent: ((limit.limit - limit.remaining) / limit.limit) * 100,
        remaining: limit.remaining,
        nextReset: limit.reset
      };
    }
    
    // Otherwise use the daily tracking
    const maxDaily = Math.floor(
      endpoint === "search" 
        ? API_LIMITS.MONTHLY_LIMITS.TWEET_LOOKUP / 30
        : API_LIMITS.MONTHLY_LIMITS.POST_READS / 30
    );
    
    return {
      currentUsage: dailyCount,
      dailyLimit: maxDaily,
      usagePercent: (dailyCount / maxDaily) * 100,
      remaining: maxDaily - dailyCount,
      nextReset: this.getNextReset()
    };
  }

  /**
   * Get a summary of all endpoint statuses
   * @returns Map of endpoint statuses
   */
  getAllStatuses(): Map<string, APILimitStatus> {
    const statuses = new Map<string, APILimitStatus>();
    
    // Convert Map keys to array before iterating
    Array.from(this.requestCounts.keys()).forEach(endpoint => {
      statuses.set(endpoint, this.getStatus(endpoint));
    });
    
    return statuses;
  }

  private checkAndResetDaily(): void {
    const now = new Date();
    if (now.getDate() !== this.dailyReset.getDate() || 
        now.getMonth() !== this.dailyReset.getMonth() ||
        now.getFullYear() !== this.dailyReset.getFullYear()) {
      this.resetDailyCounts();
    }
  }

  private resetDailyCounts(): void {
    this.requestCounts.clear();
    this.dailyReset = new Date();
  }

  private getNextReset(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  }
}
