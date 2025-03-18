/**
 * Enhanced API Limit Tracker
 * Tracks API rate limits and provides enhanced functionality for managing API usage
 */

export interface APILimit {
  endpoint: string;
  limit: number;
  usage: number;
  resetAt: Date;
  usagePercent: number;
}

export class EnhancedAPILimitTracker {
  private limits: Map<string, APILimit> = new Map();
  
  constructor() {
    // Initialize with default values
    this.initializeDefaults();
  }

  private initializeDefaults() {
    // Twitter API has a rate limit of 500,000 per month for free tier
    const twitterLimit = {
      endpoint: 'twitter',
      limit: 500000,
      usage: 0,
      resetAt: new Date(new Date().setDate(new Date().getDate() + 30)), // Reset in 30 days
      usagePercent: 0
    };
    
    // Search API (custom limit)
    const searchLimit = {
      endpoint: 'search',
      limit: 1000,
      usage: 0,
      resetAt: new Date(new Date().setHours(new Date().getHours() + 24)), // Reset in 24 hours
      usagePercent: 0
    };
    
    // Minting API (custom limit)
    const mintingLimit = {
      endpoint: 'minting',
      limit: 100,
      usage: 0,
      resetAt: new Date(new Date().setHours(new Date().getHours() + 24)), // Reset in 24 hours
      usagePercent: 0
    };
    
    this.limits.set('twitter', twitterLimit);
    this.limits.set('search', searchLimit);
    this.limits.set('minting', mintingLimit);
  }
  
  /**
   * Track API usage for a specific endpoint
   */
  trackUsage(endpoint: string, increment: number = 1): APILimit {
    let limit = this.limits.get(endpoint);
    
    if (!limit) {
      // Create new limit if doesn't exist
      limit = {
        endpoint,
        limit: 1000, // Default
        usage: 0,
        resetAt: new Date(new Date().setDate(new Date().getDate() + 1)), // Default reset in 1 day
        usagePercent: 0
      };
      this.limits.set(endpoint, limit);
    }
    
    // Update usage
    limit.usage += increment;
    limit.usagePercent = (limit.usage / limit.limit) * 100;
    
    return { ...limit };
  }
  
  /**
   * Check if endpoint has exceeded rate limit
   */
  isLimitExceeded(endpoint: string): boolean {
    const limit = this.limits.get(endpoint);
    if (!limit) return false;
    
    // If reset time has passed, reset the limit
    if (new Date() > limit.resetAt) {
      limit.usage = 0;
      // Set next reset time
      limit.resetAt = new Date(new Date().setDate(new Date().getDate() + 1));
      limit.usagePercent = 0;
      this.limits.set(endpoint, limit);
      return false;
    }
    
    return limit.usage >= limit.limit;
  }
  
  /**
   * Get the current limit status for an endpoint
   */
  getLimitStatus(endpoint: string): APILimit | null {
    const limit = this.limits.get(endpoint);
    if (!limit) return null;
    
    // Check if reset time has passed
    if (new Date() > limit.resetAt) {
      limit.usage = 0;
      // Set next reset time
      limit.resetAt = new Date(new Date().setDate(new Date().getDate() + 1));
      limit.usagePercent = 0;
      this.limits.set(endpoint, limit);
    }
    
    return { ...limit };
  }
  
  /**
   * Get all tracked API limits
   */
  getAllLimits(): Record<string, APILimit> {
    const result: Record<string, APILimit> = {};
    
    this.limits.forEach((limit, key) => {
      // Check if reset time has passed
      if (new Date() > limit.resetAt) {
        limit.usage = 0;
        // Set next reset time
        limit.resetAt = new Date(new Date().setDate(new Date().getDate() + 1));
        limit.usagePercent = 0;
        this.limits.set(key, limit);
      }
      
      result[key] = { ...limit };
    });
    
    return result;
  }
  
  /**
   * Reset limit for a specific endpoint
   */
  resetLimit(endpoint: string): void {
    const limit = this.limits.get(endpoint);
    if (!limit) return;
    
    limit.usage = 0;
    limit.usagePercent = 0;
    limit.resetAt = new Date(new Date().setDate(new Date().getDate() + 1)); // Reset in 1 day
    this.limits.set(endpoint, limit);
  }
}

export default EnhancedAPILimitTracker;
