/**
 * Defines the different service modes that can be used throughout the application.
 * This allows switching between different implementations of the same service.
 */
export enum ServiceMode {
  /** Enhanced mode with full API access for production use */
  ENHANCED = 'enhanced',
  
  /** Simplified implementation for testing */
  SIMPLE = 'simple',
  
  /** Free tier implementation with severe API limitations */
  FREE_TIER = 'free_tier',
  
  /** Mock implementation using hardcoded data */
  MOCK = 'mock'
}

/**
 * Helper function to parse the service mode from environment variable
 * or configuration
 */
export function getServiceMode(): ServiceMode {
  // Read from environment variable or default to ENHANCED
  const modeFromEnv = process.env.NEXT_PUBLIC_SERVICE_MODE;
  
  // Parse the mode or default to ENHANCED
  switch (modeFromEnv?.toLowerCase()) {
    case 'free_tier':
    case 'free':
      return ServiceMode.FREE_TIER;
    case 'simple':
      return ServiceMode.SIMPLE;
    case 'mock':
      return ServiceMode.MOCK;
    case 'enhanced':
    default:
      return ServiceMode.ENHANCED;
  }
}

/**
 * Helper to check if we're using the free tier implementation
 */
export function isFreeTier(): boolean {
  return getServiceMode() === ServiceMode.FREE_TIER;
}

/**
 * Helper to check if we're using mock implementations
 */
export function isMockMode(): boolean {
  return getServiceMode() === ServiceMode.MOCK;
}
