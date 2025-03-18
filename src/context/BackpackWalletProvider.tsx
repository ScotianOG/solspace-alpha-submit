"use client";

import React, { FC, ReactNode, useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  AlphaWalletAdapter,
  NightlyWalletAdapter,
  SkyWalletAdapter,
  AvanaWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

// Import the styles for the wallet adapter
import "@solana/wallet-adapter-react-ui/styles.css";

// Create the wallet provider wrapper component
export const BackpackWalletProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Set up the network - using 'testnet' for Sonic testnet
  // This can be configured via env variable if needed
  const network = WalletAdapterNetwork.Testnet;

  // Use Sonic's RPC URL
  const endpoint =
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.testnet.sonic.game/";

  // We can configure additional wallet adapters here
  // Prioritizing Backpack as the first option
  const wallets = useMemo(
    () => [
      new AlphaWalletAdapter(),
      new NightlyWalletAdapter(),
      new SkyWalletAdapter(),
      new AvanaWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};

export default BackpackWalletProvider;
