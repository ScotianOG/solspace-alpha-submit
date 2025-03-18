import { NextResponse } from 'next/server';
import { api } from '@/services/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tweetId = searchParams.get('tweetId');

    if (!tweetId) {
      return NextResponse.json(
        { error: 'Tweet ID is required' },
        { status: 400 }
      );
    }

    // Get queued posts to check minting status
    const queuedPosts = await api.getQueuedPosts();
    const post = queuedPosts.find(p => p.tweetId === tweetId);

    if (!post) {
      return NextResponse.json(
        { error: 'Tweet not found in viral queue' },
        { status: 404 }
      );
    }

    // Return post status with minting progress
    return NextResponse.json({
      status: 'success',
      data: {
        tweetId: post.tweetId,
        content: post.content,
        author: post.author,
        engagement: post.engagement,
        viralScore: post.viralScore,
        mintProgress: post.mintProgress,
        timestamp: post.timestamp,
      }
    });
  } catch (error) {
    console.error('Error fetching viral post status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post status' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { tweetId } = await request.json();

    if (!tweetId) {
      return NextResponse.json(
        { error: 'Tweet ID is required' },
        { status: 400 }
      );
    }

    // Get queued posts
    const queuedPosts = await api.getQueuedPosts();
    const post = queuedPosts.find(p => p.tweetId === tweetId);

    if (!post) {
      return NextResponse.json(
        { error: 'Tweet not found in viral queue' },
        { status: 404 }
      );
    }

    // If post is ready for minting (100% progress), trigger the mint
    if (post.mintProgress === 100) {
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
              retweets_per_hour: post.engagement.retweets / 2,
            },
            engagement_rate: post.viralScore,
            impression_count: post.engagement.likes * 3, // Estimate
            bookmark_count: Math.floor(post.engagement.likes * 0.05),
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
        return NextResponse.json(
          { error: 'Failed to mint viral post' },
          { status: 500 }
        );
      }
    }

    // If not ready, return current progress
    return NextResponse.json({
      status: 'success',
      data: {
        tweetId: post.tweetId,
        mintProgress: post.mintProgress,
        mintStatus: 'pending'
      }
    });
  } catch (error) {
    console.error('Error updating viral post status:', error);
    return NextResponse.json(
      { error: 'Failed to update post status' },
      { status: 500 }
    );
  }
}
