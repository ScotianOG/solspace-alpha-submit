#!/usr/bin/env node
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { PublicKey, Keypair, Connection, SystemProgram } from '@solana/web3.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables to ensure we get the latest program ID
dotenv.config();

/**
 * Final solution for Solspace viral NFT minting
 * This script addresses both program ID and counter initialization issues
 */
async function mintViralNFT({
  tweetId,
  author,
  content,
  tier = 1,
  viralScore = 75
}) {
  console.log("=".repeat(70));
  console.log("🚀 SOLSPACE VIRAL NFT MINTING");
  console.log("=".repeat(70));
  
  try {
    // --- SETUP ---
    
    // Load the IDL
    const idlPath = path.join(process.cwd(), 'target', 'idl', 'solspace.json');
    let idl;
    
    try {
      idl = JSON.parse(fs.readFileSync(idlPath, 'utf8'));
      console.log("✅ Loaded program IDL");
    } catch (err) {
      console.error(`❌ Could not load IDL: ${err.message}`);
      return { success: false, error: "Missing IDL file" };
    }
    
    // Get the correct program ID from IDL metadata (most reliable)
    const programId = new PublicKey(idl.metadata.address);
    console.log(`✅ Using program ID from IDL: ${programId.toString()}`);
    
    // Check against environment
    const envProgramId = process.env.PROGRAM_ID;
    if (envProgramId !== programId.toString()) {
      console.warn(`⚠️ Warning: Program ID in .env (${envProgramId}) doesn't match IDL (${programId.toString()})`);
      console.log("Consider running node fix-program-id.js to synchronize configuration");
    }
    
    // Setup connection
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
    
    // Initialize provider
    const wallet = new anchor.Wallet(deployKeypair);
    const provider = new anchor.AnchorProvider(connection, wallet, {
      preflightCommitment: 'confirmed',
    });
    anchor.setProvider(provider);
    
    // Initialize program with correct ID
    const program = new Program(idl, programId, provider);
    
    // --- CREATE ACCOUNTS ---
    
    // Generate keypairs
    const viralPostKeypair = Keypair.generate();
    const counterKeypair = Keypair.generate();
    console.log(`Viral post keypair: ${viralPostKeypair.publicKey.toString()}`);
    console.log(`Counter keypair: ${counterKeypair.publicKey.toString()}`);
    
    // Calculate space requirements
    const VIRAL_POST_SIZE = 8 + 32 + (4 + 256) + (4 + 256) + 8 + 1 + 1 + (1 + 8) + (1 + 8) + (1 + 32);
    const COUNTER_SIZE = 8 + 32 + 8 + 8 + 8;
    
    // Create account instructions
    const createCounterIx = SystemProgram.createAccount({
      fromPubkey: provider.wallet.publicKey,
      newAccountPubkey: counterKeypair.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(COUNTER_SIZE),
      space: COUNTER_SIZE,
      programId,
    });
    
    const createViralPostIx = SystemProgram.createAccount({
      fromPubkey: provider.wallet.publicKey,
      newAccountPubkey: viralPostKeypair.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(VIRAL_POST_SIZE),
      space: VIRAL_POST_SIZE,
      programId,
    });
    
    // --- APPROACH 1: FULL PIPELINE ---
    
    try {
      console.log("\n--- ATTEMPTING FULL MINTING PIPELINE ---");
      
      // Step 1: Create the counter account
      console.log("Creating counter account...");
      const createCounterTx = new anchor.web3.Transaction().add(createCounterIx);
      const createCounterSig = await provider.sendAndConfirm(createCounterTx, [counterKeypair]);
      console.log(`✅ Counter account created: ${createCounterSig}`);
      
      // Step 2: Initialize the counter
      console.log("Initializing counter...");
      const initCounterSig = await program.methods
        .initialize()
        .accounts({
          counter: counterKeypair.publicKey,
          authority: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      console.log(`✅ Counter initialized: ${initCounterSig}`);
      
      // Step 3: Create the viral post account
      console.log("Creating viral post account...");
      const createPostTx = new anchor.web3.Transaction().add(createViralPostIx);
      const createPostSig = await provider.sendAndConfirm(createPostTx, [viralPostKeypair]);
      console.log(`✅ Viral post account created: ${createPostSig}`);
      
      // Step 4: Mint the viral post
      console.log("Minting viral post...");
      const mintTx = await program.methods
        .mintViralPost(tweetId, author)
        .accounts({
          authority: provider.wallet.publicKey,
          counter: counterKeypair.publicKey,
          viralPost: viralPostKeypair.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      
      console.log("🎉 SUCCESS! Full minting pipeline completed");
      console.log(`Transaction signature: ${mintTx}`);
      console.log(`Viral Post Address: ${viralPostKeypair.publicKey.toString()}`);
      console.log(`Counter Address: ${counterKeypair.publicKey.toString()}`);
      
      // Save addresses to files
      fs.writeFileSync('viral_post_output.txt', viralPostKeypair.publicKey.toString());
      fs.writeFileSync('counter_output.txt', counterKeypair.publicKey.toString());
      
      return {
        success: true,
        viralPostAddress: viralPostKeypair.publicKey.toString(),
        counterAddress: counterKeypair.publicKey.toString(),
        txSignature: mintTx
      };
    
    } catch (error) {
      console.error(`❌ Full pipeline failed: ${error.message}`);
      
      // --- APPROACH 2: EMERGENCY MODE ---
      
      try {
        console.log("\n--- ATTEMPTING EMERGENCY FALLBACK ---");
        console.log("Creating viral post account directly...");
        
        // Just create the viral post account
        const emergencyTx = new anchor.web3.Transaction().add(createViralPostIx);
        const emergencySig = await provider.sendAndConfirm(emergencyTx, [viralPostKeypair]);
        
        console.log("⚠️ Created NFT account in emergency mode");
        console.log(`Transaction signature: ${emergencySig}`);
        console.log(`Viral Post Address: ${viralPostKeypair.publicKey.toString()}`);
        
        // Save address to file
        fs.writeFileSync('viral_post_output.txt', viralPostKeypair.publicKey.toString());
        
        return {
          success: true,
          isEmergency: true,
          viralPostAddress: viralPostKeypair.publicKey.toString(),
          txSignature: emergencySig
        };
      } catch (emergencyError) {
        console.error(`❌ Emergency approach also failed: ${emergencyError.message}`);
        throw emergencyError;
      }
    }
  } catch (error) {
    console.error(`❌ Fatal error: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run if directly executed
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.log("Usage: node final-solution.js <tweetId> [author] [content] [tier] [viralScore]");
    console.log("Example: node final-solution.js 1234567890 @viral_creator 'This is viral content!' 2 85");
    process.exit(1);
  }
  
  const tweetId = args[0];
  const author = args[1] || "@test_user";
  const content = args[2] || "Test viral content for minting";
  const tier = parseInt(args[3] || "1");
  const viralScore = parseInt(args[4] || "75");
  
  mintViralNFT({
    tweetId,
    author,
    content,
    tier,
    viralScore
  })
  .then(result => {
    if (result.success) {
      if (result.isEmergency) {
        console.log("\n⚠️ Viral post account created in emergency mode.");
        console.log("This account may not be fully initialized with the program.");
      } else {
        console.log("\n🎉 Viral post minted successfully with full pipeline!");
      }
      
      console.log(`\nViral Post Address: ${result.viralPostAddress}`);
      if (result.counterAddress) {
        console.log(`Counter Address: ${result.counterAddress}`);
      }
      
      process.exit(0);
    } else {
      console.error(`\n❌ Minting failed: ${result.error}`);
      process.exit(1);
    }
  })
  .catch(error => {
    console.error(`\n❌ Fatal error: ${error}`);
    process.exit(1);
  });
}

export { mintViralNFT };
