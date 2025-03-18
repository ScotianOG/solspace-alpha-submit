// src/components/SonicWalletButton.tsx
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from './ui/button';
import { Wallet, RefreshCw } from 'lucide-react';
import React from 'react';

interface SonicWalletButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

const SonicWalletButton: React.FC<SonicWalletButtonProps> = ({
  variant = 'default',
  size = 'default',
  className = '',
}) => {
  const { publicKey, wallet, disconnect, connected, connecting } = useWallet();
  const { setVisible } = useWalletModal();

  const handleClick = () => {
    if (connected) {
      disconnect();
    } else {
      setVisible(true);
    }
  };

  return (
    <div className="wallet-button-container">
      <Button
        onClick={handleClick}
        variant={variant}
        size={size}
        className={className}
        disabled={connecting}
      >
        {connecting ? (
          <div className="flex items-center">
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Connecting...
          </div>
        ) : connected ? (
          <div className="flex items-center">
            <Wallet className="w-4 h-4 mr-2" />
            {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
          </div>
        ) : (
          <div className="flex items-center">
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </div>
        )}
      </Button>
      {!connected && !connecting && (
        <div className="mt-2 text-xs text-gray-400 text-center">
          Supports Backpack, Nightly, OKX, and Bybit
        </div>
      )}
    </div>
  );
};

export default SonicWalletButton;
