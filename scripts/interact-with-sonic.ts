import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { PublicKey, Keypair, Connection, SystemProgram } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import fs from 'fs';

// Replace with the actual IDL path
const idl = JSON.parse(fs.readFileSync('./target/idl/solspace.json', 'utf8'));

// Metaplex Token Metadata Program ID
const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

// Setup connection to Sonic testnet
const connection = new Connection('https://api.testnet.sonic.game/', 'confirmed');

// Load deploy keypair
const deployKeypairData = JSON.parse(fs.readFileSync('./deploy-keypair.json', 'utf8'));
const deployKeypair = Keypair.fromSecretKey(new Uint8Array(deployKeypairData));

// Load wallet keypair (use deploy keypair as payer for this example)
const wallet = new anchor.Wallet(deployKeypair);
const provider = new anchor.AnchorProvider(connection, wallet, {
  preflightCommitment: 'confirmed',
});

anchor.setProvider(provider);

// Initialize the program
const programId = new PublicKey('Faf5BtxWH49YzC6UEcHSXyi6h6SgcWMGD1hz4rKxjgCL');
const program = new Program(idl, programId, provider);

async function main() {
  console.log('Connected to Sonic testnet with program ID:', programId.toString());
  
  try {
    // 1. Initialize the program
    await initializeProgram();
    
    // 2. Mint a viral NFT
    const mintKeypair = Keypair.generate();
    const tweetId = 'tweet_' + Date.now().toString();
    const nftName = 'Viral Tweet NFT #1';
    const uri = 'https://arweave.net/your-metadata-uri';
    const tier = 3; // 1=Rising, 2=Trending, 3=Viral
    const viralScore = 95;
    
    await mintViralNFT(mintKeypair, tweetId, nftName, uri, tier, viralScore);
    
    // 3. Claim the NFT
    const claimer = deployKeypair; // Using same keypair for demo
    await claimNFT(mintKeypair.publicKey, tweetId, claimer);
    
    console.log('All operations completed successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

async function initializeProgram() {
  console.log('Initializing program...');
  
  // Find the viral authority PDA
  const [viralAuthority, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from('viral_authority')],
    program.programId
  );
  
  try {
    // Check if already initialized
    try {
      const viralAuthorityAccount = await program.account.viralAuthority.fetch(viralAuthority);
      console.log('Program already initialized with authority:', viralAuthorityAccount.authority.toString());
      return;
    } catch (e) {
      // Not initialized yet, continue
    }
    
    // Initialize the program
    const tx = await program.methods
      .initialize()
      .accounts({
        viralAuthority,
        authority: provider.wallet.publicKey,
        payer: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();
    
    console.log('Program initialized! Transaction signature:', tx);
  } catch (error) {
    console.error('Error initializing program:', error);
    throw error;
  }
}

async function mintViralNFT(
  mintKeypair: Keypair,
  tweetId: string,
  name: string,
  uri: string,
  tier: number,
  viralScore: number
) {
  console.log(`Minting viral NFT for tweet ${tweetId}...`);
  
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
  
  try {
    // Mint the NFT
    const tx = await program.methods
      .mintViralNft(uri, name, tweetId, tier, new anchor.BN(viralScore))
      .accounts({
        viralAuthority,
        nftRecord,
        mint: mintKeypair.publicKey,
        tokenAccount,
        metadata: metadataAddress,
        masterEdition: masterEditionAddress,
        payer: provider.wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([mintKeypair])
      .rpc();
    
    console.log('NFT minted! Transaction signature:', tx);
    console.log('NFT Mint Address:', mintKeypair.publicKey.toString());
  } catch (error) {
    console.error('Error minting NFT:', error);
    throw error;
  }
}

async function claimNFT(
  mintAddress: PublicKey,
  tweetId: string,
  claimer: Keypair,
) {
  console.log(`Claiming NFT for tweet ${tweetId}...`);
  
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
  
  // Create token account for the viral authority
  const tokenAccount = await getAssociatedTokenAddress(
    mintAddress,
    viralAuthority,
    true // Allow PDA as owner
  );
  
  // Create token account for the claimer
  const claimerTokenAccount = await getAssociatedTokenAddress(
    mintAddress,
    claimer.publicKey,
  );
  
  try {
    // Claim the NFT
    const tx = await program.methods
      .claimNft()
      .accounts({
        viralAuthority,
        nftRecord,
        tokenAccount,
        claimerTokenAccount,
        mint: mintAddress,
        claimer: claimer.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([claimer])
      .rpc();
    
    console.log('NFT claimed! Transaction signature:', tx);
    console.log('Claimer Token Account:', claimerTokenAccount.toString());
  } catch (error) {
    console.error('Error claiming NFT:', error);
    throw error;
  }
}

main();
