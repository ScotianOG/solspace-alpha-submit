import { NextResponse } from 'next/server';
import { PublicKey } from '@solana/web3.js';
import { TwitterApi } from 'twitter-api-v2';
import { Program, AnchorProvider } from '@project-serum/anchor';
import { Connection, clusterApiUrl, Keypair } from '@solana/web3.js';
import { SolspaceIDL } from '@/types/program';
import { loadSolspaceIDL } from '@/utils/program';
import { DatabaseService } from '@/services';
import { validateSignatureProof } from '@/utils/signature';
import type { SignatureProof } from '@/types';

// Initialize Twitter v2 client
const twitterClient = new TwitterApi(process.env.TWITTER_API_KEY || '').v2;

interface ClaimRequest {
  nftAddress: string;
  twitterHandle: string;
  walletAddress: string;
  signatureProof: SignatureProof;
}

export async function POST(request: Request) {
  try {
    const body: ClaimRequest = await request.json();
    const { nftAddress, twitterHandle, walletAddress, signatureProof } = body;

    // Validate inputs
    if (!nftAddress || !twitterHandle || !walletAddress || !signatureProof) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate wallet address format
    try {
      new PublicKey(walletAddress);
    } catch {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    // Check if NFT exists and is claimable
    const nftPubkey = new PublicKey(nftAddress);
    // Initialize connection and provider with a temporary keypair for reading
    const connection = new Connection(clusterApiUrl('devnet'));
    const temporaryWallet = {
      publicKey: Keypair.generate().publicKey,
      signTransaction: async () => { throw new Error('Not implemented'); },
      signAllTransactions: async () => { throw new Error('Not implemented'); },
    };
    
    const provider = new AnchorProvider(
      connection,
      temporaryWallet,
      { commitment: 'confirmed' }
    );

    // Initialize program
    const program = new Program<SolspaceIDL>(
      loadSolspaceIDL(),
      new PublicKey(process.env.PROGRAM_ID || ''),
      provider
    );
    const nftAccount = await program.account.viralPost.fetch(nftPubkey);

    if (!nftAccount) {
      return NextResponse.json(
        { error: 'NFT not found' },
        { status: 404 }
      );
    }

    if (nftAccount.claimed) {
      return NextResponse.json(
        { error: 'NFT already claimed' },
        { status: 400 }
      );
    }

    // Verify Twitter account ownership
    try {
      const username = twitterHandle.replace('@', '');
      const userResponse = await twitterClient.search(`from:${username}`, {
        expansions: ["author_id"],
        "user.fields": ["id"]
      });
      const userId = userResponse.data[0]?.author_id;

      if (!userId || userId !== nftAccount.authorId) {
        return NextResponse.json(
          { error: 'Twitter account does not match NFT author' },
          { status: 403 }
        );
      }
    } catch (error) {
      console.error('Twitter verification error:', error);
      return NextResponse.json(
        { error: 'Failed to verify Twitter account' },
        { status: 500 }
      );
    }

    // Verify wallet ownership
    if (!validateSignatureProof(signatureProof, nftAddress, walletAddress)) {
      return NextResponse.json(
        { error: 'Invalid signature proof' },
        { status: 400 }
      );
    }

    // Get or create claim status
    let claimStatus = await DatabaseService.getClaimStatus(nftAddress);
    if (!claimStatus) {
      claimStatus = await DatabaseService.createClaimStatus(
        nftAddress,
        nftAccount.twitterId,
        nftAccount.authorId
      );
    }

    // Check if already claimed
    if (claimStatus.status === 'claimed') {
      return NextResponse.json(
        { error: 'NFT already claimed' },
        { status: 400 }
      );
    }

    // Update claim status to verified
    await DatabaseService.updateClaimStatus(nftAddress, {
      status: 'verified',
      walletAddress,
      signatureProof
    });

    // Transfer NFT
    try {
      await program.methods.claimNft()
        .accounts({
          viralPost: nftPubkey,
          recipient: new PublicKey(walletAddress)
        })
        .rpc();

      // Update claim status to claimed
      await DatabaseService.updateClaimStatus(nftAddress, {
        status: 'claimed',
        claimedAt: new Date()
      });

      // Update viral post status
      await DatabaseService.updateViralPost(nftAccount.twitterId, {
        mintStatus: 'claimed'
      });

      return NextResponse.json({
        status: 'success',
        message: 'NFT claimed successfully',
        nftAddress
      });
    } catch (error) {
      console.error('NFT transfer error:', error);

      // Update claim status to failed
      await DatabaseService.updateClaimStatus(nftAddress, {
        status: 'failed'
      });

      return NextResponse.json(
        { error: 'Failed to transfer NFT' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Claim process error:', error);
    return NextResponse.json(
      { error: 'Failed to process NFT claim' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const nftAddress = searchParams.get('nftAddress');
    const authorId = searchParams.get('authorId');

    if (!nftAddress && !authorId) {
      return NextResponse.json(
        { error: 'Either nftAddress or authorId is required' },
        { status: 400 }
      );
    }

    if (nftAddress) {
      // Get specific claim status
      const status = await DatabaseService.getClaimStatus(nftAddress);
      if (!status) {
        return NextResponse.json(
          { error: 'No claim status found' },
          { status: 404 }
        );
      }
      return NextResponse.json(status);
    } else {
      // Get all claims for author
      const claims = await DatabaseService.getClaimsByAuthor(authorId!);
      return NextResponse.json(claims);
    }
  } catch (error) {
    console.error('Error fetching claim status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch claim status' },
      { status: 500 }
    );
  }
}
