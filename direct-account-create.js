#!/usr/bin/env node
import * as anchor from '@project-serum/anchor';
import { SystemProgram, PublicKey, Keypair, Connection } from '@solana/web3.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Direct Account Creator for Solspace
 * Creates accounts directly using the System Program (bypassing the Solana program)
 * This is a last-resort approach when the program is not available for execution
 */
async function createAccounts({
  tweetId = "test-content",
  author = "@test_user",
  content = "Test viral content",
  tier = 1,
  viralScore = 75
}) {
  console.log("=".repeat(70));
  console.log("⚠️ EMERGENCY DIRECT ACCOUNT CREATION");
  console.log("This bypasses program execution and only creates the accounts");
  console.log("=".repeat(70));
  
  try {
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
    
    // This approach doesn't use the program directly, but creates accounts with
    // the program as the owner (to be populated manually if needed)
    const programIdStr = process.env.PROGRAM_ID || "9C2HRbrbvf3baZ8vXhQgiDjJRU1K6JoxUSBhpQsuPW3";
    const programId = new PublicKey(programIdStr);
    console.log(`Using program ID: ${programId.toString()}`);
    
    // Generate new keypairs for counter and viral post
    const counterKeypair = Keypair.generate();
    const viralPostKeypair = Keypair.generate();
    console.log(`Counter keypair: ${counterKeypair.publicKey.toString()}`);
    console.log(`Viral post keypair: ${viralPostKeypair.publicKey.toString()}`);
    
    console.log("\n--- DIRECT ACCOUNT CREATION ---");
    
    // Calculate exact space for the accounts
    const COUNTER_SIZE = 8 + 32 + 8 + 8 + 8; // Discriminator + authority + count + viral minted + viral claimed
    const VIRAL_POST_SIZE = 8 + 32 + (4 + 256) + (4 + 256) + 8 + 1 + 1 + (1 + 8) + (1 + 8) + (1 + 32);
    
    console.log(`Counter size: ${COUNTER_SIZE} bytes`);
    console.log(`Viral post size: ${VIRAL_POST_SIZE} bytes`);
    
    // Try to create counter account
    console.log("\nCreating counter account...");
    try {
      const lamportsCounter = await connection.getMinimumBalanceForRentExemption(COUNTER_SIZE);
      
      const createCounterIx = SystemProgram.createAccount({
        fromPubkey: provider.wallet.publicKey,
        newAccountPubkey: counterKeypair.publicKey,
        lamports: lamportsCounter,
        space: COUNTER_SIZE,
        programId,  // Set as the owner of the account
      });
      
      const createCounterTx = new anchor.web3.Transaction().add(createCounterIx);
      const counterSignature = await provider.sendAndConfirm(createCounterTx, [counterKeypair]);
      
      console.log(`✅ Counter account created with signature: ${counterSignature}`);
      console.log(`Counter address: ${counterKeypair.publicKey.toString()}`);
      
      // Save counter address
      fs.writeFileSync('counter_output.txt', counterKeypair.publicKey.toString());
      
    } catch (counterError) {
      console.error(`❌ Failed to create counter account: ${counterError.message}`);
    }
    
    // Try to create viral post account
    console.log("\nCreating viral post account...");
    try {
      const lamportsViralPost = await connection.getMinimumBalanceForRentExemption(VIRAL_POST_SIZE);
      
      const createViralPostIx = SystemProgram.createAccount({
        fromPubkey: provider.wallet.publicKey,
        newAccountPubkey: viralPostKeypair.publicKey,
        lamports: lamportsViralPost,
        space: VIRAL_POST_SIZE,
        programId,  // Set as the owner of the account
      });
      
      const createViralPostTx = new anchor.web3.Transaction().add(createViralPostIx);
      const viralPostSignature = await provider.sendAndConfirm(createViralPostTx, [viralPostKeypair]);
      
      console.log(`✅ Viral post account created with signature: ${viralPostSignature}`);
      console.log(`Viral post address: ${viralPostKeypair.publicKey.toString()}`);
      
      // Save viral post address
      fs.writeFileSync('viral_post_output.txt', viralPostKeypair.publicKey.toString());
      
    } catch (viralPostError) {
      console.error(`❌ Failed to create viral post account: ${viralPostError.message}`);
    }
    
    console.log("\n=".repeat(70));
    console.log("⚠️ IMPORTANT: These accounts have been created with the correct program owner");
    console.log("but they have NOT been initialized with the program's instructions.");
    console.log("They are placeholder accounts that can be used for development/testing purposes.");
    console.log("=".repeat(70));
    
    return {
      success: true,
      counterAddress: counterKeypair.publicKey.toString(),
      viralPostAddress: viralPostKeypair.publicKey.toString(),
      isEmergencyMode: true
    };
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
  
  // Parse arguments if provided
  const tweetId = args[0] || "test-content-id";
  const author = args[1] || "@test_user";
  const content = args[2] || "Test viral content for development";
  const tier = parseInt(args[3] || "1");
  const viralScore = parseInt(args[4] || "75");
  
  createAccounts({
    tweetId,
    author,
    content,
    tier,
    viralScore
  })
  .then(result => {
    if (result.success) {
      console.log("\n✅ Account creation completed!");
      console.log(`Counter address: ${result.counterAddress}`);
      console.log(`Viral post address: ${result.viralPostAddress}`);
      console.log("\nAdd these addresses to your environment as needed for development.");
      process.exit(0);
    } else {
      console.error(`\n❌ Account creation failed: ${result.error}`);
      process.exit(1);
    }
  })
  .catch(error => {
    console.error(`\n❌ Fatal error: ${error}`);
    process.exit(1);
  });
}

export { createAccounts };
