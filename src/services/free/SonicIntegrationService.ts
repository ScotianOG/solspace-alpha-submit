import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { PublicKey, Keypair, Connection, Transaction, SystemProgram } from '@solana/web3.js';
import { SolspaceIDL } from '@/types/program';
import { ViralPost } from '@/types';

// Environment variables
const SONIC_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.testnet.sonic.game/';
const PROGRAM_ID = process.env.NEXT_PUBLIC_PROGRAM_ID || '9C2HRbrbvf3baZ8vXhQgiDjJRU1K6JoxUSBhpQsuPW3';

export class SonicIntegrationService {
  private connection: Connection;
  private programId: PublicKey;

  constructor() {
    this.connection = new Connection(SONIC_RPC_URL, 'confirmed');
    this.programId = new PublicKey(PROGRAM_ID);
    console.log('SonicIntegrationService initialized with program ID:', this.programId.toString());
  }

  // Connect to the Solana program using Anchor
  async getProgram(wallet: anchor.Wallet): Promise<Program<SolspaceIDL>> {
    try {
      // Create provider with connection and wallet
      const provider = new anchor.AnchorProvider(
        this.connection,
        wallet,
        { preflightCommitment: 'confirmed' }
      );

      // Create program using IDL
      const idl = await anchor.Program.fetchIdl(this.programId, provider) as SolspaceIDL;
      if (!idl) throw new Error('Failed to fetch IDL');

      const program = new anchor.Program(idl, this.programId, provider) as Program<SolspaceIDL>;
      return program;
    } catch (error) {
      console.error('Error getting program:', error);
      throw error;
    }
  }

  // Create a viral post directly using our bypass method
  async createViralPost(wallet: anchor.Wallet, post: ViralPost): Promise<string> {
    try {
      console.log('Creating viral post for content:', post.content);
      
      // Generate a keypair for the viral post account
      const viralPostKeypair = Keypair.generate();
      console.log('Generated viral post keypair:', viralPostKeypair.publicKey.toString());
      
      // Define account size for viral post
      // Discriminator (8) + authority (32) + contentId (4+256) + authorId (4+256) + 
      // createdAt (8) + tier (1) + claimed (1) + claimedAt option (1+8) + 
      // lastUpgraded option (1+8) + claimer option (1+32)
      const VIRAL_POST_SIZE = 8 + 32 + (4 + 256) + (4 + 256) + 8 + 1 + 1 + (1 + 8) + (1 + 8) + (1 + 32);
      
      // Get minimum balance for rent exemption
      const rentExemptBalance = await this.connection.getMinimumBalanceForRentExemption(VIRAL_POST_SIZE);
      
      // Create the viral post account
      const createAccountIx = SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: viralPostKeypair.publicKey,
        lamports: rentExemptBalance,
        space: VIRAL_POST_SIZE,
        programId: this.programId
      });
      
      // Create a transaction to create the account
      const tx = new Transaction().add(createAccountIx);
      
      // Sign and send transaction
      console.log("Sending transaction to create viral post account...");
      const signature = await anchor.web3.sendAndConfirmTransaction(
        this.connection,
        tx,
        [wallet.payer, viralPostKeypair],
        { commitment: 'confirmed' }
      );
      
      console.log("Transaction successful!");
      console.log("Transaction signature:", signature);
      console.log("Viral post account created:", viralPostKeypair.publicKey.toString());
      
      return viralPostKeypair.publicKey.toString();
    } catch (error) {
      console.error("Error creating viral post:", error);
      throw error;
    }
  }

  // Claim a viral post using our Solana program
  async claimViralPost(
    wallet: anchor.Wallet, 
    viralPostAddress: string
  ): Promise<string> {
    try {
      console.log('Claiming viral post:', viralPostAddress);
      
      // Get program
      const program = await this.getProgram(wallet);
      
      // Call the claimNft instruction (from the IDL)
      const viralPostPubkey = new PublicKey(viralPostAddress);
      
      const tx = await program.methods
        .claimNft()
        .accounts({
          viralPost: viralPostPubkey,
          recipient: wallet.publicKey,
        })
        .rpc();
      
      console.log('Viral post claimed successfully');
      console.log('Transaction signature:', tx);
      
      return tx;
    } catch (error) {
      console.error('Error claiming viral post:', error);
      throw error;
    }
  }

  // Upgrade a viral post tier
  async upgradeViralPostTier(
    wallet: anchor.Wallet,
    viralPostAddress: string,
    metrics: {
      likes: number;
      retweets: number;
      replies: number;
      quote_tweets: number;
    }
  ): Promise<string> {
    try {
      console.log(`Checking upgrade for viral post ${viralPostAddress}`);
      
      // Get program
      const program = await this.getProgram(wallet);
      
      // Convert metrics to BN
      const bnMetrics = {
        likes: new anchor.BN(metrics.likes),
        retweets: new anchor.BN(metrics.retweets),
        replies: new anchor.BN(metrics.replies),
        quote_tweets: new anchor.BN(metrics.quote_tweets)
      };
      
      // Call the checkTierUpgrade instruction
      const viralPostPubkey = new PublicKey(viralPostAddress);
      
      const tx = await program.methods
        .checkTierUpgrade(bnMetrics)
        .accounts({
          authority: wallet.publicKey,
          viralPost: viralPostPubkey,
        })
        .rpc();
      
      console.log('Viral post tier check completed');
      console.log('Transaction signature:', tx);
      
      return tx;
    } catch (error) {
      console.error('Error checking viral post tier:', error);
      throw error;
    }
  }
}

const sonicIntegrationService = new SonicIntegrationService();
export default sonicIntegrationService;
