// src/context/WalletProvider.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
  connected: boolean;
  walletAddress: string | null;
  connecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  walletAddress: null,
  connecting: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
});

export function useWallet() {
  return useContext(WalletContext);
}

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  // Demo wallet connection function
  const connectWallet = async () => {
    setConnecting(true);
    
    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Mock wallet connection
    setConnected(true);
    setWalletAddress('8xGzGH9qM3vUdFEF6centzqJEbG6Y8i3cmDUUosBpCNx');
    setConnecting(false);
  };

  const disconnectWallet = () => {
    setConnected(false);
    setWalletAddress(null);
  };

  // Check if wallet was previously connected
  useEffect(() => {
    const storedConnection = localStorage.getItem('walletConnected');
    if (storedConnection === 'true') {
      setConnected(true);
      setWalletAddress('8xGzGH9qM3vUdFEF6centzqJEbG6Y8i3cmDUUosBpCNx');
    }
  }, []);

  // Save connection state
  useEffect(() => {
    if (connected) {
      localStorage.setItem('walletConnected', 'true');
    } else {
      localStorage.removeItem('walletConnected');
    }
  }, [connected]);

  const value = {
    connected,
    walletAddress,
    connecting,
    connectWallet,
    disconnectWallet,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}
