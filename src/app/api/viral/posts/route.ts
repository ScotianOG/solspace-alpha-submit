import { NextResponse } from 'next/server';
import { api } from '@/services/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'pending', 'minting', 'completed'
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get all queued posts
    const queuedPosts = await api.getQueuedPosts();

    // Filter posts based on status
    let filteredPosts = queuedPosts;
    if (status) {
      filteredPosts = queuedPosts.filter(post => {
        switch (status) {
          case 'pending':
            return post.mintProgress === 0;
          case 'minting':
            return post.mintProgress > 0 && post.mintProgress < 100;
          case 'completed':
            return post.mintProgress === 100;
          default:
            return true;
        }
      });
    }

    // Paginate results
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedPosts = filteredPosts.slice(start, end);

    // Get queue status for metadata
    const queueStatus = await api.getQueueStatus();

    return NextResponse.json({
      status: 'success',
      data: {
        posts: paginatedPosts,
        metadata: {
          total: filteredPosts.length,
          page,
          limit,
          totalPages: Math.ceil(filteredPosts.length / limit),
          queueStatus: {
            postsScanned: queueStatus.postsScanned,
            potentialPosts: queueStatus.potentialPosts,
            mintedToday: queueStatus.mintedToday,
            apiStatus: {
              usagePercent: queueStatus.apiLimitStatus.usagePercent,
              nextReset: queueStatus.apiLimitStatus.nextReset,
            },
          },
        },
      },
    });
  } catch (error) {
    console.error('Error fetching viral posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch viral posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { tweetIds } = await request.json();

    if (!Array.isArray(tweetIds) || tweetIds.length === 0) {
      return NextResponse.json(
        { error: 'Tweet IDs array is required' },
        { status: 400 }
      );
    }

    // Get queued posts
    const queuedPosts = await api.getQueuedPosts();
    
    // Find status for each tweet
    const statuses = tweetIds.map(tweetId => {
      const post = queuedPosts.find(p => p.tweetId === tweetId);
      if (!post) {
        return {
          tweetId,
          status: 'not_found',
          mintProgress: 0,
        };
      }

      let status = 'pending';
      if (post.mintProgress === 100) {
        status = 'completed';
      } else if (post.mintProgress > 0) {
        status = 'minting';
      }

      return {
        tweetId,
        status,
        mintProgress: post.mintProgress,
        viralScore: post.viralScore,
        engagement: post.engagement,
      };
    });

    return NextResponse.json({
      status: 'success',
      data: statuses,
    });
  } catch (error) {
    console.error('Error fetching viral post statuses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post statuses' },
      { status: 500 }
    );
  }
}
