import { PrismaClient, Prisma } from '@prisma/client';
import type { 
  ViralPost, 
  DBViralPost, 
  ClaimStatus, 
  SignatureProof,
  APILimit 
} from '../types';

class DatabaseError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'DatabaseError';
  }
}

const prisma = new PrismaClient();

// Type converters
function convertToDBViralPost(post: Prisma.ViralPostGetPayload<Record<string, never>>): DBViralPost {
  return {
    ...post,
    engagement: post.engagement as Record<string, number>,
  };
}

function convertToClaimStatus(claim: Prisma.ClaimStatusGetPayload<Record<string, never>>): ClaimStatus {
  const { claimedAt: rawClaimedAt, ...rest } = claim;
  return {
    ...rest,
    walletAddress: claim.walletAddress || undefined,
    signatureProof: claim.signatureProof ? JSON.parse(claim.signatureProof as string) as SignatureProof : undefined,
    status: claim.status as ClaimStatus['status'],
    claimedAt: rawClaimedAt || undefined,
  };
}

export class DatabaseService {
  private static handleError(error: unknown, message: string): never {
    console.error(`Database error: ${message}`, error);
    
    // Handle Prisma errors
    if (
      typeof error === 'object' && 
      error !== null && 
      'code' in error && 
      typeof error.code === 'string'
    ) {
      const prismaError = error as { code: string };
      switch (prismaError.code) {
        case 'P2002':
          throw new DatabaseError('Duplicate entry found', error);
        case 'P2025':
          throw new DatabaseError('Record not found', error);
        default:
          throw new DatabaseError(`Database operation failed: ${prismaError.code}`, error);
      }
    }

    // Handle other errors
    if (error instanceof Error) {
      throw new DatabaseError(error.message, error);
    }

    throw new DatabaseError(message, error);
  }

  // Viral Posts
  static async createViralPost(post: ViralPost): Promise<DBViralPost> {
    try {
      const result = await prisma.viralPost.create({
        data: {
          tweetId: post.tweetId,
          content: post.content,
          author: post.author,
          authorId: post.author.replace('@', ''),
          engagement: post.engagement as Prisma.InputJsonValue,
          viralScore: post.viralScore,
          tier: 1, // Start at tier 1
          mintStatus: 'pending',
          mintProgress: 0,
        },
      });
      return convertToDBViralPost(result);
    } catch (error) {
      this.handleError(error, `Failed to create viral post: ${post.tweetId}`);
    }
  }

  static async updateViralPost(tweetId: string, data: Partial<DBViralPost>): Promise<DBViralPost> {
    try {
      const result = await prisma.viralPost.update({
        where: { tweetId },
        data: {
          ...data,
          engagement: data.engagement ? data.engagement as Prisma.InputJsonValue : undefined,
        },
      });
      return convertToDBViralPost(result);
    } catch (error) {
      this.handleError(error, `Failed to update viral post: ${tweetId}`);
    }
  }

  static async getViralPost(tweetId: string): Promise<DBViralPost | null> {
    try {
      const result = await prisma.viralPost.findUnique({
        where: { tweetId },
      });
      return result ? convertToDBViralPost(result) : null;
    } catch (error) {
      this.handleError(error, `Failed to get viral post: ${tweetId}`);
    }
  }

  static async getViralPosts(status?: string): Promise<DBViralPost[]> {
    try {
      const results = await prisma.viralPost.findMany({
        where: status ? { mintStatus: status } : undefined,
        orderBy: { viralScore: 'desc' },
      });
      return results.map(convertToDBViralPost);
    } catch (error) {
      this.handleError(error, 'Failed to get viral posts');
    }
  }

  static async updateMintProgress(tweetId: string, progress: number): Promise<DBViralPost> {
    try {
      const result = await prisma.viralPost.update({
        where: { tweetId },
        data: {
          mintProgress: progress,
          mintStatus: progress === 100 ? 'completed' : 'minting',
        },
      });
      return convertToDBViralPost(result);
    } catch (error) {
      this.handleError(error, `Failed to update mint progress: ${tweetId}`);
    }
  }

  static async setNFTAddress(tweetId: string, nftAddress: string, metadataUri: string): Promise<DBViralPost> {
    try {
      const result = await prisma.viralPost.update({
        where: { tweetId },
        data: {
          nftAddress,
          metadataUri,
          mintStatus: 'completed',
          mintProgress: 100,
        },
      });
      return convertToDBViralPost(result);
    } catch (error) {
      this.handleError(error, `Failed to set NFT address: ${tweetId}`);
    }
  }

  // Claim Status
  static async createClaimStatus(nftAddress: string, tweetId: string, authorId: string): Promise<ClaimStatus> {
    try {
      const result = await prisma.claimStatus.create({
        data: {
          nftAddress,
          tweetId,
          authorId,
          status: 'pending',
        },
      });
      return convertToClaimStatus(result);
    } catch (error) {
      this.handleError(error, `Failed to create claim status: ${nftAddress}`);
    }
  }

  static async updateClaimStatus(
    nftAddress: string,
    data: {
      status: ClaimStatus['status'];
      walletAddress?: string;
      signatureProof?: SignatureProof;
      claimedAt?: Date;
    }
  ): Promise<ClaimStatus> {
    try {
      const result = await prisma.claimStatus.update({
        where: { nftAddress },
        data: {
          ...data,
          signatureProof: data.signatureProof ? JSON.stringify(data.signatureProof) as Prisma.InputJsonValue : undefined,
        },
      });
      return convertToClaimStatus(result);
    } catch (error) {
      this.handleError(error, `Failed to update claim status: ${nftAddress}`);
    }
  }

  static async getClaimStatus(nftAddress: string): Promise<ClaimStatus | null> {
    try {
      const result = await prisma.claimStatus.findUnique({
        where: { nftAddress },
      });
      return result ? convertToClaimStatus(result) : null;
    } catch (error) {
      this.handleError(error, `Failed to get claim status: ${nftAddress}`);
    }
  }

  static async getClaimsByAuthor(authorId: string): Promise<ClaimStatus[]> {
    try {
      const results = await prisma.claimStatus.findMany({
        where: { authorId },
      });
      return results.map(convertToClaimStatus);
    } catch (error) {
      this.handleError(error, `Failed to get claims by author: ${authorId}`);
    }
  }

  // API Limits
  static async updateAPILimit(endpoint: string, usage: number, limit: number, resetAt: Date): Promise<APILimit> {
    try {
      return await prisma.aPILimit.upsert({
        where: { endpoint },
        update: {
          usage,
          limit,
          resetAt,
        },
        create: {
          endpoint,
          usage,
          limit,
          resetAt,
        },
      });
    } catch (error) {
      this.handleError(error, `Failed to update API limit: ${endpoint}`);
    }
  }

  static async getAPILimit(endpoint: string): Promise<APILimit | null> {
    try {
      return await prisma.aPILimit.findUnique({
        where: { endpoint },
      });
    } catch (error) {
      this.handleError(error, `Failed to get API limit: ${endpoint}`);
    }
  }

  static async resetAPILimit(endpoint: string): Promise<APILimit> {
    try {
      return await prisma.aPILimit.update({
        where: { endpoint },
        data: {
          usage: 0,
          resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Reset in 24 hours
        },
      });
    } catch (error) {
      this.handleError(error, `Failed to reset API limit: ${endpoint}`);
    }
  }

  // Get viral posts created after a specific date
  static async getViralPostsAfterDate(date: Date): Promise<DBViralPost[]> {
    try {
      const results = await prisma.viralPost.findMany({
        where: {
          createdAt: { gt: date }
        },
        orderBy: { createdAt: 'desc' }
      });
      return results.map(convertToDBViralPost);
    } catch (error) {
      this.handleError(error, `Failed to get viral posts after date: ${date}`);
    }
  }
  
  // Cleanup
  static async cleanup(): Promise<void> {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      // Remove old completed posts
      await prisma.viralPost.deleteMany({
        where: {
          mintStatus: 'completed',
          updatedAt: { lt: thirtyDaysAgo },
        },
      });

      // Remove old failed claims
      await prisma.claimStatus.deleteMany({
        where: {
          status: 'failed',
          updatedAt: { lt: thirtyDaysAgo },
        },
      });

      // Reset expired API limits
      const now = new Date();
      await prisma.aPILimit.updateMany({
        where: {
          resetAt: { lt: now },
        },
        data: {
          usage: 0,
          resetAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        },
      });
    } catch (error) {
      this.handleError(error, 'Failed to perform cleanup');
    }
  }
}
