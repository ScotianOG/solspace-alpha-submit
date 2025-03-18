import { NextResponse } from 'next/server';
import { MonitoringService } from '@/services';
import { DatabaseService } from '@/services';
import type { DBViralPost, ClaimStatus, SystemHealth, APILimitStatus } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const detailed = searchParams.get('detailed') === 'true';

    // Get basic health status
    const health = await MonitoringService.checkHealth();

    if (!detailed) {
      // Return simple status
      return NextResponse.json({
        status: health.errors.count > 10 ? 'unhealthy' : 'healthy',
        timestamp: new Date().toISOString()
      });
    }

    // Get additional metrics for detailed report
    const [
      pendingPosts,
      mintingPosts,
      completedPosts,
      pendingClaims,
      completedClaims
    ] = await Promise.all([
      DatabaseService.getViralPosts('pending'),
      DatabaseService.getViralPosts('minting'),
      DatabaseService.getViralPosts('completed'),
      DatabaseService.getClaimsByAuthor('').then(claims =>
        claims.filter(c => c.status === 'pending')
      ),
      DatabaseService.getClaimsByAuthor('').then(claims =>
        claims.filter(c => c.status === 'claimed')
      )
    ]);

    // Calculate success rates
    const mintSuccessRate = completedPosts.length /
      (completedPosts.length + health.errors.count) * 100;

    const claimSuccessRate = completedClaims.length /
      (completedClaims.length + pendingClaims.length) * 100;

    // Return detailed health report
    return NextResponse.json({
      status: health.errors.count > 10 ? 'unhealthy' : 'healthy',
      timestamp: new Date().toISOString(),
      metrics: {
        posts: {
          pending: pendingPosts.length,
          minting: mintingPosts.length,
          completed: completedPosts.length,
          success_rate: Math.round(mintSuccessRate * 100) / 100
        },
        claims: {
          pending: pendingClaims.length,
          completed: completedClaims.length,
          success_rate: Math.round(claimSuccessRate * 100) / 100
        },
        api_limits: health.apiLimits,
        errors: {
          count: health.errors.count,
          last_error: health.errors.lastError
        },
        performance: {
          average_mint_time: calculateAverageMintTime(completedPosts),
          average_claim_time: calculateAverageClaimTime(completedClaims)
        }
      },
      recommendations: generateRecommendations(health)
    });
  } catch (error) {
    console.error('Health check failed:', error);
    MonitoringService.recordError(error);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to get health status',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

function calculateAverageMintTime(posts: DBViralPost[]): number {
  if (posts.length === 0) return 0;

  const times = posts.map(post => {
    const created = new Date(post.createdAt).getTime();
    const updated = new Date(post.updatedAt).getTime();
    return (updated - created) / 1000; // Convert to seconds
  });

  return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
}

function calculateAverageClaimTime(claims: ClaimStatus[]): number {
  if (claims.length === 0) return 0;

  const times = claims.map(claim => {
    const created = new Date(claim.createdAt).getTime();
    const claimed = new Date(claim.claimedAt || claim.updatedAt).getTime();
    return (claimed - created) / 1000; // Convert to seconds
  });

  return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
}

function generateRecommendations(health: SystemHealth): string[] {
  const recommendations: string[] = [];

  // Check API limits
  Object.entries(health.apiLimits).forEach(([endpoint, status]: [string, APILimitStatus]) => {
    if (status.usagePercent > 80) {
      recommendations.push(`Consider rate limiting ${endpoint} API calls`);
    }
  });

  // Check queue sizes
  if (health.queueStatus.pendingPosts > 100) {
    recommendations.push('Consider increasing minting capacity');
  }
  if (health.queueStatus.mintingPosts > 50) {
    recommendations.push('Consider optimizing minting process');
  }
  if (health.queueStatus.pendingClaims > 50) {
    recommendations.push('Consider improving claim process efficiency');
  }

  // Check error rate
  if (health.errors.count > 10) {
    recommendations.push('Investigate high error rate');
  }

  return recommendations;
}
