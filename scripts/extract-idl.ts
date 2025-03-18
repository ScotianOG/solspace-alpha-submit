import * as anchor from '@project-serum/anchor';
import { PublicKey, Connection } from '@solana/web3.js';
import fs from 'fs';
import path from 'path';

async function extractIdl() {
  try {
    // Setup connection to Sonic testnet
    const connection = new Connection('https://api.testnet.sonic.game/', 'confirmed');
    
    // Program ID
    const programId = new PublicKey('Faf5BtxWH49YzC6UEcHSXyi6h6SgcWMGD1hz4rKxjgCL');
    
    console.log('Fetching IDL for program:', programId.toString());
    
    // Fetch the IDL
    const idl = await anchor.Program.fetchIdl(programId, new anchor.AnchorProvider(
      connection,
      // We don't need a real wallet for fetching IDL
      { publicKey: PublicKey.default } as any,
      { preflightCommitment: 'confirmed' }
    ));
    
    if (!idl) {
      console.error('Failed to fetch IDL. Make sure the program is deployed with Anchor.');
      return;
    }
    
    // Save the IDL
    const targetDir = './target/idl';
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    const filePath = path.join(targetDir, 'solspace.json');
    fs.writeFileSync(filePath, JSON.stringify(idl, null, 2));
    
    console.log(`IDL saved to ${filePath}`);
  } catch (error) {
    console.error('Error extracting IDL:', error);
  }
}

extractIdl();
