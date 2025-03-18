/**
 * Monitoring Service - Simplified stub implementation
 * This module provides monitoring capabilities for the Solspace system
 */

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  uptime: number;
  timestamp: string;
  services: Record<string, boolean>;
}

/**
 * Get the current system health status
 */
export async function getSystemHealth(): Promise<HealthStatus> {
  const startTime = process.env.SYSTEM_START_TIME 
    ? Number(process.env.SYSTEM_START_TIME)
    : Date.now();
  
  return {
    status: 'healthy',
    uptime: Date.now() - startTime,
    timestamp: new Date().toISOString(),
    services: {
      api: true,
      database: true,
      blockchain: true
    }
  };
}

/**
 * Log an event to the monitoring system
 */
export function logEvent(event: string, data?: unknown): void {
  console.log(`[MONITORING] ${event}:`, data || '');
}

/**
 * Track an error in the monitoring system
 */
export function trackError(error: Error, context?: string): void {
  console.error(`[ERROR]${context ? ` [${context}]` : ''}:`, error);
}

// Export as object for named imports
const monitoring = {
  getSystemHealth,
  logEvent,
  trackError
};

export default monitoring;
