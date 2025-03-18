// src/components/wallet/IntegratedWalletButton.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Wallet, Copy, ExternalLink, ChevronDown, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface IntegratedWalletButtonProps {
  className?: string;
}

const IntegratedWalletButton: React.FC<IntegratedWalletButtonProps> = ({ className = "" }) => {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("0x742...5678");
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    
    // Simulate wallet connection
    setTimeout(() => {
      setConnected(true);
      setWalletAddress("0x742d5C4614628bE45A5a6635e6F4c0B54F9a5678");
      setConnecting(false);
    }, 1000);
  };

  const handleDisconnect = () => {
    setConnected(false);
  };

  const copyAddress = () => {
    // In a real implementation, you would use navigator.clipboard.writeText
    console.log("Copied address:", walletAddress);
  };

  const openExplorer = () => {
    window.open(`https://solscan.io/account/${walletAddress}`, "_blank");
  };

  if (!connected) {
    return (
      <Button
        onClick={handleConnect}
        disabled={connecting}
        className={`flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 ${className}`}
      >
        <Wallet className="w-4 h-4" />
        {connecting ? (
          <>
            <span className="animate-pulse">Connecting</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
          </>
        ) : (
          "Connect Wallet"
        )}
      </Button>
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
          <span>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
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
            <div className="font-medium text-white">Connected</div>
            <div className="text-sm text-gray-400">{walletAddress.slice(0, 10)}...{walletAddress.slice(-4)}</div>
          </div>
        </div>
        
        <div className="p-2">
          <DropdownMenuItem 
            onClick={copyAddress} 
            className="flex items-center gap-2 cursor-pointer focus:bg-gray-800 text-gray-200"
          >
            <Copy className="w-4 h-4 text-gray-400" />
            Copy Address
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={openExplorer} 
            className="flex items-center gap-2 cursor-pointer focus:bg-gray-800 text-gray-200"
          >
            <ExternalLink className="w-4 h-4 text-gray-400" />
            View on Explorer
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-gray-800" />
          
          <DropdownMenuItem 
            onClick={handleDisconnect} 
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

export default IntegratedWalletButton;