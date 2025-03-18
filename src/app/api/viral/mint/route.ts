import { NextResponse } from 'next/server';
import { api } from '@/services/api';
import { EnhancedAPILimitTracker } from '@/services';

const apiLimitTracker = new EnhancedAPILimitTracker();

export async function POST(request: Request) {
  try {
    const { tweetId, force = false } = await request.json();

    if (!tweetId) {
      return NextResponse.json(
        { error: 'Tweet ID is required' },
        { status: 400 }
      );
    }

    // Check API limits unless force is true
    if (!force) {
      const queueStatus = await api.getQueueStatus();
      if (queueStatus.apiLimitStatus.usagePercent >= 90) {
        return NextResponse.json(
          { error: 'API rate limit approaching, please try again later' },
          { status: 429 }
        );
      }
    }

    // Get queued posts to verify tweet is viral
    const queuedPosts = await api.getQueuedPosts();
    const post = queuedPosts.find(p => p.tweetId === tweetId);

    if (!post) {
      return NextResponse.json(
        { error: 'Tweet not found in viral queue' },
        { status: 404 }
      );
    }

    // Check if already minted
    if (post.mintProgress === 100) {
      return NextResponse.json(
        { error: 'Tweet already minted' },
        { status: 400 }
      );
    }

    // Start minting process
    try {
      const nftAddress = await api.mintPost({
        id: post.tweetId,
        content: post.content,
        author: post.author,
        authorId: post.author.replace('@', ''),
        engagement: post.engagement,
        timestamp: post.timestamp,
        metrics: {
          likes: post.engagement.likes,
          retweets: post.engagement.retweets,
          replies: post.engagement.replies,
          created_at: post.timestamp,
          velocity: {
            likes_per_hour: post.engagement.likes / 2, // Estimate
            retweets_per_hour: post.engagement.retweets / 2
          },
          engagement_rate: post.viralScore,
          impression_count: post.engagement.likes * 3, // Estimate
          bookmark_count: Math.floor(post.engagement.likes * 0.05)
        }
      });

      return NextResponse.json({
        status: 'success',
        data: {
          tweetId: post.tweetId,
          nftAddress,
          mintStatus: 'completed'
        }
      });
    } catch (error) {
      console.error('Error minting viral post:', error);

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
        { error: 'Failed to mint viral post' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing mint request:', error);
    return NextResponse.json(
      { error: 'Failed to process mint request' },
      { status: 500 }
    );
  }
}
