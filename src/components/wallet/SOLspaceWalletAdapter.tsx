import React, { FC, ReactNode, useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { BackpackWalletAdapter, NightlyWalletAdapter, OKXWalletAdapter, BitpieWalletAdapter } from '@solana/wallet-adapter-wallets';
import { SONIC_CONFIG } from '@/config/sonic.config';
import '@solana/wallet-adapter-react-ui/styles.css';

// Use SONIC RPC URL from config
const SONIC_RPC_URL = SONIC_CONFIG.RPC_URL;

export const SOLspaceWalletAdapter: FC<{ children: ReactNode }> = ({ children }) => {
  // SONIC-compatible wallets
  const wallets = useMemo(
    () => [
      new BackpackWalletAdapter(),
      new NightlyWalletAdapter(),
      new OKXWalletAdapter(),
      new BitpieWalletAdapter(), // Using BitpieWalletAdapter for Bybit support
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={SONIC_RPC_URL}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default SOLspaceWalletAdapter;
