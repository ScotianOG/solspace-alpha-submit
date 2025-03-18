// src/config/wallet.tsx
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { BackpackWalletAdapter, NightlyWalletAdapter, OKXWalletAdapter, BitKeepWalletAdapter } from '@solana/wallet-adapter-wallets';
import { SONIC_RPC_ENDPOINT } from './connection';
import React, { FC, ReactNode, useMemo } from 'react';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

export const SonicWalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // Configure supported wallets for SONIC
  const wallets = useMemo(() => {
    return [
      new BackpackWalletAdapter(),
      new NightlyWalletAdapter(),
      new OKXWalletAdapter(),
      new BitKeepWalletAdapter(),
    ];
  }, []);

  return (
    <ConnectionProvider endpoint={SONIC_RPC_ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
