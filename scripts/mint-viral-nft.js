#!/usr/bin/env node
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { PublicKey, Keypair, Connection } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import fs from 'fs';
import path from 'path';

// Import BN for big number handling
import pkg from '@project-serum/anchor';
const { BN } = pkg;

// Metaplex Token Metadata Program ID
const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

/**
 * Mint a viral NFT for a specific tweet
 * This script can be used standalone or imported into other scripts
 */
export async function mintViralNFT({
  tweetId, 
  content,
  author,
  tier, 
  viralScore,
  engagement
}) {
  console.log("=".repeat(70));
  console.log("🚀 Minting Viral NFT on SONIC blockchain");
  console.log("=".repeat(70));
  
  try {
    // Load the IDL
    const idlPath = path.join(process.cwd(), 'target', 'idl', 'solspace.json');
    let idl;
    
    try {
      idl = JSON.parse(fs.readFileSync(idlPath, 'utf8'));
      console.log("✅ Loaded program IDL");
    } catch (err) {
      console.error(`❌ Could not load IDL from ${idlPath}: ${err.message}`);
      console.log("Make sure to extract the IDL first with 'npm run extract-idl'");
      return { success: false, error: "Missing IDL file" };
    }
    
    // Setup connection to Sonic testnet
    const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.testnet.sonic.game/';
    const connection = new Connection(rpcUrl, 'confirmed');
    console.log(`✅ Connected to SONIC RPC: ${rpcUrl}`);
    
    // Load deploy keypair
    let deployKeypair;
    try {
      const keypairPath = path.join(process.cwd(), 'deploy-keypair.json');
      const deployKeypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
      deployKeypair = Keypair.fromSecretKey(new Uint8Array(deployKeypairData));
      console.log(`✅ Loaded deploy keypair: ${deployKeypair.publicKey.toString()}`);
    } catch (err) {
      console.error(`❌ Could not load deploy keypair: ${err.message}`);
      return { success: false, error: "Missing deploy keypair" };
    }
    
    // Initialize Anchor provider
    const wallet = new anchor.Wallet(deployKeypair);
    const provider = new anchor.AnchorProvider(connection, wallet, {
      preflightCommitment: 'confirmed',
    });
    anchor.setProvider(provider);
    
    // Initialize the program with the correct Program ID
    const programId = new PublicKey(process.env.PROGRAM_ID || '9C2HRbrbvf3baZ8vXhQgiDjJRU1K6JoxUSBhpQsuPW3');
    const program = new Program(idl, programId, provider);
    console.log(`✅ Initialized program with ID: ${programId.toString()}`);
    
    // Generate a keypair for the NFT mint
    const mintKeypair = Keypair.generate();
    console.log(`✅ Generated mint keypair: ${mintKeypair.publicKey.toString()}`);
    
    // Prepare NFT metadata
    const nftName = `${tier === 3 ? 'Viral' : tier === 2 ? 'Trending' : 'Rising'} Tweet by ${author}`;
    const uri = `https://arweave.net/mock-metadata-uri-${tweetId}`; // In production, this would be a real URI
    
    console.log(`NFT Details:`);
    console.log(`- Name: ${nftName}`);
    console.log(`- Tier: ${tier}`);
    console.log(`- Viral Score: ${viralScore}`);
    console.log(`- Tweet: ${content.substring(0, 60)}...`);
    
    // Find the viral authority PDA
    const [viralAuthority, _] = PublicKey.findProgramAddressSync(
      [Buffer.from('viral_authority')],
      program.programId
    );
    
    // Find the NFT record PDA
    const [nftRecord, __] = PublicKey.findProgramAddressSync(
      [Buffer.from('nft'), Buffer.from(tweetId)],
      program.programId
    );
    
    // Create metadata address
    const metadataAddress = PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.publicKey.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )[0];
    
    // Create master edition address
    const masterEditionAddress = PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.publicKey.toBuffer(),
        Buffer.from('edition'),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )[0];
    
    // Create token account for the viral authority
    const tokenAccount = await getAssociatedTokenAddress(
      mintKeypair.publicKey,
      viralAuthority,
      true // Allow PDA as owner
    );
    
    // Prepare for minting
    console.log("Preparing to mint NFT...");
    
    try {
      // Use the Counter PDA directly
      console.log("Using Counter PDA...");
      
      // Get counter address from environment or derive it
      let counterAddress;
      if (process.env.COUNTER_ADDRESS) {
        counterAddress = new PublicKey(process.env.COUNTER_ADDRESS);
        console.log(`Using counter address from environment: ${counterAddress.toString()}`);
      } else {
        // Derive the counter PDA
        const [derivedCounterPDA] = PublicKey.findProgramAddressSync(
          [Buffer.from("counter")],
          program.programId
        );
        counterAddress = derivedCounterPDA;
        console.log(`Derived counter PDA: ${counterAddress.toString()}`);
      }
    
      // Create a new account for the viral post
      const viralPostKeypair = Keypair.generate();
      
      // Mint the viral post
      console.log(`Minting viral post with content ID "${tweetId}" and author "${author}"`);
      
      // Create instructions for creating the viral post account
      // Calculate accurate space for ViralPost
      // Discriminator (8) + authority (32) + contentId (4+256) + authorId (4+256) + 
      // createdAt (8) + tier (1) + claimed (1) + claimedAt option (1+8) + 
      // lastUpgraded option (1+8) + claimer option (1+32)
      const VIRAL_POST_SIZE = 8 + 32 + (4 + 256) + (4 + 256) + 8 + 1 + 1 + (1 + 8) + (1 + 8) + (1 + 32);
      
      const createAccountIx = anchor.web3.SystemProgram.createAccount({
        fromPubkey: provider.wallet.publicKey,
        newAccountPubkey: viralPostKeypair.publicKey,
        lamports: await connection.getMinimumBalanceForRentExemption(VIRAL_POST_SIZE),
        space: VIRAL_POST_SIZE,
        programId: program.programId,
      });
      
      // Add the mint viral post instruction
      const mintIx = await program.methods
        .mintViralPost(tweetId, author)
        .accounts({
          authority: provider.wallet.publicKey,
          counter: counterAddress,
          viralPost: viralPostKeypair.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .instruction();
      
      // Build the transaction
      const tx = new anchor.web3.Transaction().add(createAccountIx, mintIx);
      
      // Send the transaction
      const txSignature = await provider.sendAndConfirm(tx, [viralPostKeypair]);
      
      console.log("🎉 NFT minted successfully!");
      console.log(`Transaction signature: ${txSignature}`);
      console.log(`Viral Post Address: ${viralPostKeypair.publicKey.toString()}`);
      
      return {
        success: true,
        viralPostAddress: viralPostKeypair.publicKey.toString(),
        txSignature: txSignature
      };
    } catch (error) {
      console.error("❌ Error minting NFT:", error);
      return {
        success: false,
        error: error.message || "Unknown error during minting",
        mintAddress: mintKeypair.publicKey.toString()
      };
    }
  } catch (error) {
    console.error("❌ Fatal error:", error);
    return { success: false, error: error.message || "Unknown error" };
  }
}

// If this script is run directly, handle command line arguments
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.log("Usage: node mint-viral-nft.js <tweetId> [author] [content] [tier] [viralScore]");
    console.log("Example: node mint-viral-nft.js 1234567890 @viral_creator 'This is viral content!' 2 85");
    process.exit(1);
  }
  
  const tweetId = args[0];
  const author = args[1] || "@test_user";
  const content = args[2] || "Test viral content for minting";
  const tier = parseInt(args[3] || "2");
  const viralScore = parseInt(args[4] || "75");
  
  const engagement = {
    likes: 5000,
    retweets: 1000,
    replies: 500
  };
  
  mintViralNFT({
    tweetId,
    content,
    author,
    tier,
    viralScore,
    engagement
  })
  .then((result) => {
    if (result.success) {
      console.log("NFT minting completed successfully!");
    } else {
      console.error("NFT minting failed:", result.error);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("Fatal error during NFT minting:", error);
    process.exit(1);
  });
}
