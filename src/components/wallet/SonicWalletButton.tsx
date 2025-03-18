"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Wallet, Copy, ExternalLink, ChevronDown, LogOut, RefreshCw, Info } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SONIC_CONFIG, getSonicExplorerUrl } from "@/config/sonic.config";
import { useWallet } from "@/context/WalletProvider";

interface SonicWalletButtonProps {
  className?: string;
}

const SonicWalletButton: React.FC<SonicWalletButtonProps> = ({ className = "" }) => {
  const { connected, walletAddress, connecting, connectWallet, disconnectWallet } = useWallet();
  const [showInfo, setShowInfo] = useState(false);

  if (!connected) {
    return (
      <div className="wallet-button-container">
        <Button
          onClick={connectWallet}
          disabled={connecting}
          className={`flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 ${className}`}
        >
          {connecting ? (
            <div className="flex items-center">
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Connecting...
            </div>
          ) : (
            <div className="flex items-center">
              <Wallet className="w-4 h-4 mr-2" />
              Connect SONIC Wallet
            </div>
          )}
        </Button>
        
        <div className="mt-2 text-xs text-gray-400 flex items-center">
          <span>Supports Backpack, Nightly, OKX and Bybit wallets</span>
          <Info 
            className="w-3 h-3 ml-1 cursor-pointer" 
            onMouseEnter={() => setShowInfo(true)}
            onMouseLeave={() => setShowInfo(false)}
          />
        </div>

        {showInfo && (
          <div className="absolute mt-1 p-2 bg-gray-800 text-xs text-gray-300 rounded-md shadow-lg max-w-xs z-10">
            <p className="mb-1"><strong>New to SONIC?</strong></p>
            <p>Install one of our supported wallets to get started. We recommend Backpack for beginners.</p>
            <a 
              href="https://www.backpack.app/download" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline mt-1 inline-block"
            >
              Get Backpack →
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline"
          className={`flex items-center gap-2 bg-gray-900 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 ${className}`}
        >
          <div className="w-4 h-4 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full opacity-40"></div>
            <Wallet className="w-4 h-4 relative z-10" />
          </div>
          <span>{walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}</span>
          <ChevronDown className="w-4 h-4 ml-1 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-60 bg-gray-900 border border-gray-800 text-gray-200"
      >
        <div className="flex items-center gap-3 p-3 border-b border-gray-800">
          <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 p-2 rounded-lg">
            <div className="w-10 h-10 relative">
              <Image 
                src="/images/soulie-head.png" 
                alt="Wallet" 
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          </div>
          <div>
            <div className="font-medium text-white">SONIC Network</div>
            <div className="text-sm text-gray-400">{walletAddress?.slice(0, 10)}...{walletAddress?.slice(-4)}</div>
          </div>
        </div>
        
        <div className="p-2">
          <DropdownMenuItem 
            onClick={() => {
              if (walletAddress) {
                navigator.clipboard.writeText(walletAddress);
              }
            }} 
            className="flex items-center gap-2 cursor-pointer focus:bg-gray-800 text-gray-200"
          >
            <Copy className="w-4 h-4 text-gray-400" />
            Copy Address
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => {
              if (walletAddress) {
                window.open(getSonicExplorerUrl(walletAddress), "_blank");
              }
            }} 
            className="flex items-center gap-2 cursor-pointer focus:bg-gray-800 text-gray-200"
          >
            <ExternalLink className="w-4 h-4 text-gray-400" />
            View on SONIC Explorer
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-gray-800" />
          
          <DropdownMenuItem 
            onClick={() => disconnectWallet()} 
            className="flex items-center gap-2 cursor-pointer focus:bg-gray-800 text-red-400"
          >
            <LogOut className="w-4 h-4" />
            Disconnect Wallet
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SonicWalletButton;
