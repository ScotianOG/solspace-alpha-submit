"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Wallet,
  Trophy,
  ArrowRight,
  Shield,
  User,
  Plus,
  Zap,
} from "lucide-react";
import StarryBackground from "@/components/StarryBackground";
import { useApp } from "@/context/AppContext";

export default function EnhancedLandingPage({
  navigateTo,
}: {
  navigateTo: (path: string) => void;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { login } = useApp();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleLogin = (type: "admin" | "user") => {
    login(type);
    if (type === "admin") {
      navigateTo("/internal/admin-dashboard");
    } else {
      navigateTo("/internal/profile");
    }
    setShowLoginModal(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Starry background */}
      <StarryBackground starCount={300} />

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <Card className="glass-card backdrop-blur-md border-gray-700/50 shadow-xl relative overflow-hidden w-full max-w-md mx-4">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-transparent"></div>

            <CardContent className="relative z-10 p-6 space-y-6">
              <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Choose Login Type
              </h2>

              <div className="flex flex-col gap-4">
                <Button
                  onClick={() => handleLogin("user")}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium h-14"
                >
                  <Wallet className="w-5 h-5 mr-3" />
                  Creator Login
                </Button>

                <Button
                  onClick={() => handleLogin("admin")}
                  className="bg-gradient-to-r from-red-500 to-purple-500 hover:from-red-600 hover:to-purple-600 text-white font-medium h-14"
                >
                  <Shield className="w-5 h-5 mr-3" />
                  Admin Login
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setShowLoginModal(false)}
                  className="mt-2"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 px-6 py-4 flex justify-between items-center border-b border-gray-800/30 backdrop-blur-sm">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">
            <span className="text-cyan-400">SOL</span>
            <span className="text-purple-400">SPACE</span>
          </h1>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => window.open("https://solswap.soless.fi", "_blank")}
            className="text-gray-300 hover:text-cyan-400 transition-colors"
          >
            SOLess Swap
          </button>
          <button
            onClick={() => window.open("https://solarium.soless.fi", "_blank")}
            className="text-gray-300 hover:text-purple-400 transition-colors"
          >
            SOLarium
          </button>
        </div>

        <Button
          onClick={() => setShowLoginModal(true)}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium shadow-lg shadow-cyan-500/20 flex items-center gap-2"
        >
          <Wallet className="w-4 h-4" />
          Login
        </Button>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col">
        <div
          className={`container mx-auto px-4 py-12 flex-1 flex flex-col transition-all duration-1000 ${
            isLoaded ? "opacity-100" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Hero Section */}
          <div className="min-h-[70vh] flex flex-col lg:flex-row items-center justify-center lg:justify-between">
            {/* Left column - text content */}
            <div className="lg:w-1/2 space-y-8 lg:pr-8 mb-12 lg:mb-0">
              <div className="mb-6 relative">
                {/* Halo effect */}
                <div className="absolute -top-20 left-20 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 right-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                  <h1 className="text-5xl md:text-6xl font-bold mb-6">
                    <span className="text-white">Own your</span>
                    <br />
                    <span className="text-cyan-400 neon-text-cyan">viral</span>
                    <span className="text-white"> </span>
                    <span className="text-purple-400 neon-text-purple">
                      content
                    </span>
                  </h1>

                  <p className="text-xl text-gray-300 mb-8">
                    SOLspace automatically preserves your viral social media
                    moments as NFTs, giving you true ownership, monetization,
                    and platform independence.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Button
                      onClick={() => navigateTo("/claim-nft")}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium shadow-lg shadow-cyan-500/20 flex items-center gap-2 h-12 px-6"
                    >
                      <Trophy className="w-5 h-5" />
                      Claim NFT
                    </Button>

                    <Button
                      onClick={() => navigateTo("/internal/visualizer")}
                      variant="outline"
                      className="border-gray-600 hover:bg-gray-800/50 text-white flex items-center gap-2 h-12 px-6"
                    >
                      <Zap className="w-5 h-5 text-purple-400" />
                      View Visualizer
                    </Button>
                  </div>

                  <div className="mt-12 grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-white">25K+</p>
                      <p className="text-sm text-gray-400">NFTs Minted</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-white">15K+</p>
                      <p className="text-sm text-gray-400">Active Users</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-white">5M+</p>
                      <p className="text-sm text-gray-400">SOLess Volume</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - visual content */}
            <div className="lg:w-1/2 relative flex justify-end">
              <Image
                src="/images/museum.png"
                alt="SOLspace Museum"
                width={575}
                height={402}
                className="object-contain rounded-lg"
              />
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="py-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
              Welcome to SOLspace
            </h2>
            <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto">
              Choose your path to get started
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="glass-card backdrop-blur-md border-gray-700/50 shadow-xl relative overflow-hidden hover:translate-y-[-5px] transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent"></div>

                <CardContent className="relative z-10 p-6 flex flex-col items-center text-center min-h-[300px]">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4">
                    <User className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">User Login</h3>
                  <p className="text-gray-300 mb-6">
                    Access your profile, manage your content, and track your
                    NFTs
                  </p>
                  <Button
                    onClick={() => setShowLoginModal(true)}
                    className="mt-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  >
                    <User className="mr-2 h-4 w-4" />
                    User Login
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-card backdrop-blur-md border-gray-700/50 shadow-xl relative overflow-hidden hover:translate-y-[-5px] transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-transparent"></div>

                <CardContent className="relative z-10 p-6 flex flex-col items-center text-center min-h-[300px]">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                    <Plus className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Sign Up</h3>
                  <p className="text-gray-300 mb-6">
                    Create your SOLspace profile and start your Web3 journey
                  </p>
                  <Button
                    onClick={() => navigateTo("/internal/signup")}
                    className="mt-auto bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600"
                  >
                    Create Profile
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800/30 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold">
                <span className="text-cyan-400">SOL</span>
                <span className="text-purple-400">SPACE</span>
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Decentralized Social Media Platform
              </p>
            </div>

            <div className="flex flex-wrap gap-6">
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-gray-300 hover:text-red-400 transition-colors"
              >
                Admin Login
              </button>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800/30 text-center text-sm text-gray-500">
            © 2025 SOLspace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
