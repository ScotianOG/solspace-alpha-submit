"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { CheckCircle, Wallet, Trophy, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createRoot } from "react-dom/client";
import LoginModal from "@/components/auth/LoginModal";
import { useApp } from "@/context/AppContext";

const mockTweet = {
  author: "Soulie",
  username: "@Soulie",
  content: "Minting this so she'll be mine forever",
  timestamp: "2:30 PM · Dec 29, 2024",
  likes: 1500,
  retweets: 500,
  comments: 200,
};

export default function SimpleClaimFlow() {
  const [claimStep, setClaimStep] = useState<"connect" | "mint" | "success">("connect");
  const [isMinting, setIsMinting] = useState(false);
  const { login } = useApp();

  const handleShowLoginModal = () => {
    const loginModal = document.createElement("div");
    loginModal.id = "login-modal";
    document.body.appendChild(loginModal);

    const handleLogin = (type: "user" | "admin") => {
      login(type);
      document.body.removeChild(loginModal);
      window.location.href = '/internal/content-dashboard';
    };

    const handleClose = () => {
      document.body.removeChild(loginModal);
    };

    const modal = React.createElement(LoginModal, {
      isOpen: true,
      onClose: handleClose,
      onLogin: handleLogin,
    });

    const root = createRoot(loginModal);
    root.render(modal);
  };

  const handleConnect = () => {
    // Simulate wallet connection
    setTimeout(() => {
      setClaimStep("mint");
    }, 1000);
  };

  const handleMint = () => {
    setIsMinting(true);
    // Simulate minting process
    setTimeout(() => {
      setIsMinting(false);
      setClaimStep("success");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
      <Card className="w-full max-w-md mx-auto overflow-hidden border-gray-700/50 bg-gray-900/50 backdrop-blur-md">
        <CardHeader className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-transparent"></div>
          <div className="relative">
            <CardTitle className="text-2xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Claim Your Viral Post NFT
            </CardTitle>
            <CardDescription className="text-gray-400">
              Turn your viral content into a valuable digital asset
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Tweet Preview */}
          <div className="rounded-lg overflow-hidden border border-gray-800 bg-gray-800/30">
            <div className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-500/30">
                  <Image
                    src="/images/soulie-blue.png"
                    width={48}
                    height={48}
                    alt="Soulie Avatar"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white">
                    {mockTweet.author}
                    <span className="text-gray-400 font-normal ml-1">
                      {mockTweet.username}
                    </span>
                  </p>
                  <p className="mt-1 text-gray-200">{mockTweet.content}</p>
                  <div className="mt-4 rounded-lg overflow-hidden border border-gray-700">
                    <Image
                      src="/images/soulie-search.png"
                      width={400}
                      height={300}
                      alt="Angel Character NFT"
                      className="w-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-3 text-gray-400 text-sm">
                    <span>{mockTweet.timestamp}</span>
                    <div className="flex space-x-4">
                      <span className="flex items-center">
                        <Twitter className="w-3 h-3 mr-1" />
                        {mockTweet.comments}
                      </span>
                      <span className="flex items-center">
                        <Trophy className="w-3 h-3 mr-1" />
                        {mockTweet.retweets}
                      </span>
                      <span className="flex items-center">
                        <Trophy className="w-3 h-3 mr-1 text-red-400" />
                        {mockTweet.likes}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status and Actions */}
          <div className="space-y-4">
            {claimStep === "connect" && (
              <Button
                onClick={handleConnect}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            )}

            {claimStep === "mint" && (
              <div className="space-y-4">
                <div className="flex items-center text-green-400 text-sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Wallet Connected Successfully
                </div>
                <Button
                  onClick={handleMint}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  disabled={isMinting}
                >
                  {isMinting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Minting NFT...
                    </>
                  ) : (
                    <>
                      <Trophy className="w-4 h-4 mr-2" />
                      Mint as NFT
                    </>
                  )}
                </Button>
              </div>
            )}

            {claimStep === "success" && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    NFT Claimed Successfully!
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Your viral post has been minted as an NFT
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-400 mb-4">Want to manage your NFTs and earn from your content?</p>
                  <div className="grid grid-cols-1 gap-3">
                    <Link href="/internal/signup" className="block">
                      <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                        Create Account
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-700 text-gray-400 hover:text-white"
                      onClick={handleShowLoginModal}
                    >
                      Log In to Existing Account
                    </Button>
                    <div className="relative my-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="px-2 text-gray-500 bg-gray-900">or</span>
                      </div>
                    </div>
                    <Link href="/internal/claim" className="block">
                      <Button variant="outline" className="w-full border-gray-700 text-gray-400 hover:text-white">
                        Claim Another NFT
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
