#!/usr/bin/env node
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { PublicKey, Keypair, Connection, SystemProgram } from '@solana/web3.js';
import fs from 'fs';
import path from 'path';

async function directCounterInit() {
  try {
    console.log("Creating counter account with direct approach...");
    
    // Load the IDL
    const idlPath = path.join(process.cwd(), 'target', 'idl', 'solspace.json');
    const idl = JSON.parse(fs.readFileSync(idlPath, 'utf8'));
    console.log("✅ Loaded program IDL");
    
    // Setup connection to Sonic testnet
    const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.testnet.sonic.game/';
    const connection = new Connection(rpcUrl, 'confirmed');
    console.log(`✅ Connected to SONIC RPC: ${rpcUrl}`);
    
    // Load deploy keypair
    const keypairPath = path.join(process.cwd(), 'deploy-keypair.json');
    const deployKeypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
    const deployKeypair = Keypair.fromSecretKey(new Uint8Array(deployKeypairData));
    console.log(`✅ Loaded deploy keypair: ${deployKeypair.publicKey.toString()}`);
    
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
    
    // Create a new keypair for the counter account
    const counterKeypair = Keypair.generate();
    console.log(`Counter keypair: ${counterKeypair.publicKey.toString()}`);
    
    // Calculate the exact space required for the counter account
    // Counter struct: discriminator (8) + authority (32) + count (8) + viralPostsMinted (8) + viralPostsClaimed (8)
    const COUNTER_SIZE = 8 + 32 + 8 + 8 + 8;
    console.log(`Counter account size: ${COUNTER_SIZE} bytes`);
    
    // Create account instruction - explicitly specify the size
    const rentExemptLamports = await connection.getMinimumBalanceForRentExemption(COUNTER_SIZE);
    const createAccountIx = SystemProgram.createAccount({
      fromPubkey: provider.wallet.publicKey,
      newAccountPubkey: counterKeypair.publicKey,
      lamports: rentExemptLamports,
      space: COUNTER_SIZE,
      programId: program.programId,
    });
    console.log(`Rent exempt lamports: ${rentExemptLamports}`);
    
    // Create the initialize instruction
    const initializeIx = await program.methods
      .initialize()
      .accounts({
        counter: counterKeypair.publicKey,
        authority: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .instruction();
    
    // Create and send the transaction
    console.log("Sending transaction with create account + initialize...");
    const tx = new anchor.web3.Transaction()
      .add(createAccountIx)
      .add(initializeIx);
    
    const signature = await provider.sendAndConfirm(tx, [counterKeypair]);
    
    console.log(`✅ Counter initialized successfully!`);
    console.log(`Transaction signature: ${signature}`);
    console.log(`Counter address: ${counterKeypair.publicKey.toString()}`);
    
    return {
      success: true,
      counterAddress: counterKeypair.publicKey.toString(),
      txSignature: signature
    };
  } catch (error) {
    console.error("Error initializing counter:", error);
    return {
      success: false,
      error: error.message || "Unknown error"
    };
  }
}

// Run if directly executed
if (import.meta.url === `file://${process.argv[1]}`) {
  directCounterInit()
    .then(result => {
      if (result.success) {
        console.log("Counter initialization completed successfully!");
        console.log("Use this counter address in your minting script:", result.counterAddress);
        // Save the counter address to a file
        fs.writeFileSync('counter_output.txt', result.counterAddress);
      } else {
        console.error("Counter initialization failed:", result.error);
        process.exit(1);
      }
    })
    .catch(err => {
      console.error("Fatal error:", err);
      process.exit(1);
    });
}
