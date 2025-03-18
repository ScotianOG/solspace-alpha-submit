"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import IntegratedWalletButton from "@/components/wallet/IntegratedWalletButton";
import { useWallet } from "@/context/WalletProvider";

const Navigation = () => {
  const pathname = usePathname();
  const { connected } = useWallet();

  return (
    <nav className="bg-black/80 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/solspacebanner-CClv3KDJwEiNxv0ZRh3g4kd5hZf7UJ.png"
                  alt="SOLSPACE Logo"
                  width={150}
                  height={40}
                  className="object-contain w-auto h-auto"
                />
              </div>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`${
                pathname === "/"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-gray-300 hover:text-white"
              } transition-colors px-1 py-4`}
            >
              Dashboard
            </Link>
            <Link
              href="/feed"
              className={`${
                pathname === "/feed"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-gray-300 hover:text-white"
              } transition-colors px-1 py-4`}
            >
              Feed
            </Link>
            <Link
              href="/claim"
              className={`${
                pathname?.startsWith("/claim")
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-gray-300 hover:text-white"
              } transition-colors px-1 py-4`}
            >
              Claim NFT
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Link href="/feed?tab=viral-detector">
              <Button
                variant="ghost"
                className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
              >
                <Zap className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Viral Detector</span>
              </Button>
            </Link>
            <IntegratedWalletButton
              className={
                connected
                  ? "border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
                  : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              }
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
