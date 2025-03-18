import { NextResponse } from 'next/server';
import { api } from '@/services/api';
import { EnhancedAPILimitTracker } from '@/services';

const apiLimitTracker = new EnhancedAPILimitTracker();

export async function POST(request: Request) {
  try {
    const { action } = await request.json();

    if (action === 'start') {
      // Check API limits before starting
      const canMakeRequest = await api.getQueueStatus().then(status =>
        status.apiLimitStatus.usagePercent < 90
      );

      if (!canMakeRequest) {
        return NextResponse.json(
          { error: 'API rate limit approaching, please try again later' },
          { status: 429 }
        );
      }

      await api.startMonitoring();
      return NextResponse.json({
        status: 'Monitoring started',
        queueStatus: await api.getQueueStatus()
      });
    } else if (action === 'stop') {
      api.stopMonitoring();
      return NextResponse.json({
        status: 'Monitoring stopped',
        queueStatus: await api.getQueueStatus()
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "start" or "stop".' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error with monitoring:', error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Twitter API rate limit exceeded' },
          { status: 429 }
        );
      }
      if (error.message.includes('authentication')) {
        return NextResponse.json(
          { error: 'Twitter API authentication failed' },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to update monitoring status' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const queueStatus = await api.getQueueStatus();
    const queuedPosts = await api.getQueuedPosts();

    return NextResponse.json({
      status: queueStatus,
      posts: queuedPosts
    });
  } catch (error) {
    console.error('Error fetching monitoring status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monitoring status' },
      { status: 500 }
    );
  }
}
