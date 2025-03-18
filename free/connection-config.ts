// src/config/connection.ts
import { Connection } from '@solana/web3.js';
import { SONIC_CONFIG } from './viralConfig';

// Configure environment-aware RPC endpoint
// Default to testnet for initial development
const IS_MAINNET = process.env.NEXT_PUBLIC_NETWORK === 'mainnet';

// Export primary RPC endpoint
export const SONIC_RPC_ENDPOINT = IS_MAINNET 
  ? SONIC_CONFIG.MAINNET_RPC_URL 
  : SONIC_CONFIG.TESTNET_RPC_URL;

// Export explorer URL
export const SONIC_EXPLORER_URL = IS_MAINNET
  ? SONIC_CONFIG.MAINNET_EXPLORER
  : SONIC_CONFIG.TESTNET_EXPLORER;

// Create a reusable connection
export const getConnection = () => {
  return new Connection(SONIC_RPC_ENDPOINT);
}

// Helper to generate explorer links
export const getExplorerUrl = (address: string, type: 'tx' | 'address' = 'address') => {
  return `${SONIC_EXPLORER_URL}/#/${type}/${address}`;
}
