import { PublicKey } from '@solana/web3.js';
import { sign } from 'tweetnacl';
import bs58 from 'bs58';

export interface SignatureProof {
  signature: string;
  message: string;
  publicKey: string;
}

export function verifySignature(proof: SignatureProof): boolean {
  try {
    const message = new TextEncoder().encode(proof.message);
    const signature = bs58.decode(proof.signature);
    const publicKey = new PublicKey(proof.publicKey).toBytes();

    return sign.detached.verify(
      message,
      signature,
      publicKey
    );
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}

export function createSignatureMessage(nftAddress: string, walletAddress: string): string {
  return `Sign this message to claim your NFT\nNFT: ${nftAddress}\nWallet: ${walletAddress}\nTimestamp: ${Date.now()}`;
}

export function validateSignatureProof(
  proof: SignatureProof,
  nftAddress: string,
  walletAddress: string
): boolean {
  // Verify the message format
  const expectedMessage = createSignatureMessage(nftAddress, walletAddress);
  if (proof.message !== expectedMessage) {
    return false;
  }

  // Verify the wallet address matches
  if (proof.publicKey !== walletAddress) {
    return false;
  }

  // Verify the signature
  return verifySignature(proof);
}
