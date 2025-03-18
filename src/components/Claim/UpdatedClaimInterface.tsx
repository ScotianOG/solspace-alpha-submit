"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Wallet, Twitter, CheckCircle, AlertCircle, Trophy, Clock, ArrowRight, Search } from "lucide-react";

interface NFTData {
  id: string;
  content: string;
  author: string;
  authorId: string;
  tier: number;
  engagement: {
    likes: number;
    retweets: number;
    replies?: number;
    quote_tweets?: number;
  };
  velocity: {
    likes_per_hour: number;
    retweets_per_hour: number;
  };
  timestamp: string;
  metadata_uri: string;
  claimed: boolean;
  claimed_at?: string;
}

interface ClaimStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "active" | "completed" | "error";
  errorMessage?: string;
}

// Helper to get tier name
const getTierName = (tier: number): string => {
  switch(tier) {
    case 3: return "Viral";
    case 2: return "Trending";
    case 1: return "Rising";
    default: return "Unknown";
  }
};

// Helper to get tier color
const getTierColor = (tier: number): string => {
  switch(tier) {
    case 3: return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
    case 2: return "text-purple-400 bg-purple-500/10 border-purple-500/20";
    case 1: return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    default: return "text-gray-400 bg-gray-500/10 border-gray-500/20";
  }
};

const mockNFTData: NFTData[] = [
  {
    id: "CS4hB1UVh7LS3DqGpeJUCR6PhQQRSiHGNgMkZMSJwKPu",
    content: "Web3 is revolutionizing how we think about content ownership! #blockchain #web3",
    author: "@cryptoinfluencer",
    authorId: "123456",
    tier: 3,
    engagement: {
      likes: 15000,
      retweets: 3000,
      replies: 500,
      quote_tweets: 200
    },
    velocity: {
      likes_per_hour: 1500,
      retweets_per_hour: 300
    },
    timestamp: "2024-10-23T12:00:00Z",
    metadata_uri: "https://arweave.net/example-metadata-uri",
    claimed: false
  },
  {
    id: "7UeB8zUQJnEcTVQu4eff6QjgGsHBiRfFwkPGKPcmBDVi",
    content: "Just tried $SOL for the first time and I'm amazed at the speed and low fees! This is the future of finance.",
    author: "@cryptoinfluencer",
    authorId: "123456",
    tier: 2,
    engagement: {
      likes: 7200,
      retweets: 1800,
      replies: 300,
      quote_tweets: 150
    },
    velocity: {
      likes_per_hour: 720,
      retweets_per_hour: 180
    },
    timestamp: "2024-10-25T09:30:00Z",
    metadata_uri: "https://arweave.net/example-metadata-uri-2",
    claimed: false
  }
];

export default function UpdatedClaimInterface() {
  // State
  const [claimStatus, setClaimStatus] = useState<"unclaimed" | "pending" | "claimed" | "error">("unclaimed");
  const [walletConnected, setWalletConnected] = useState(false);
  const [twitterVerified, setTwitterVerified] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentNFT, setCurrentNFT] = useState<NFTData | null>(null);
  const [availableNFTs, setAvailableNFTs] = useState<NFTData[]>(mockNFTData);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState<ClaimStep[]>([
    {
      id: "connect",
      title: "Connect Wallet",
      description: "Connect your Solana wallet to claim this NFT",
      status: "active"
    },
    {
      id: "verify",
      title: "Verify Twitter Account",
      description: "Verify you're the creator of this viral content",
      status: "pending"
    },
    {
      id: "claim",
      title: "Claim NFT",
      description: "Transfer the NFT to your wallet",
      status: "pending"
    }
  ]);

  // Activate next step
  const activateNextStep = useCallback(() => {
    const currentActiveIndex = steps.findIndex(step => step.status === "active");
    if (currentActiveIndex >= 0 && currentActiveIndex < steps.length - 1) {
      setSteps(currentSteps => 
        currentSteps.map((step, index) => 
          index === currentActiveIndex 
            ? { ...step, status: "completed" } 
            : index === currentActiveIndex + 1 
              ? { ...step, status: "active" } 
              : step
        )
      );
    }
  }, [steps]);

  // Update step status
  const updateStepStatus = (stepId: string, status: ClaimStep["status"], errorMessage?: string) => {
    setSteps(currentSteps => 
      currentSteps.map(step => 
        step.id === stepId 
          ? { ...step, status, errorMessage } 
          : step
      )
    );
  };

  // Update steps when wallet connection changes
  useEffect(() => {
    if (walletConnected) {
      updateStepStatus("connect", "completed");
      activateNextStep();
    }
  }, [walletConnected, activateNextStep]);

  const handleSearchNFT = () => {
    setIsLoading(true);
    setTimeout(() => {
      const found = availableNFTs.find(nft => 
        nft.id.toLowerCase() === searchTerm.toLowerCase() ||
        nft.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (found) {
        setCurrentNFT(found);
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const handleSelectNFT = (nft: NFTData) => {
    setCurrentNFT(nft);
  };

  const handleConnectWallet = async () => {
    setIsLoading(true);
    try {
      // Connect to wallet logic here
      setTimeout(() => {
        setWalletConnected(true);
        setCurrentStep(2);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setIsLoading(false);
    }
  };

  const handleTwitterVerify = async () => {
    setIsLoading(true);
    try {
      // Twitter verification logic
      setTimeout(() => {
        setTwitterVerified(true);
        setCurrentStep(3);
        updateStepStatus("verify", "completed");
        activateNextStep();
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error verifying Twitter:", error);
      setIsLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!currentNFT) return;
    
    setClaimStatus("pending");
    try {
      // Implement claim logic
      setTimeout(() => {
        setClaimStatus("claimed");
        
        // Update the claimed status in available NFTs
        setAvailableNFTs(prev => 
          prev.map(nft => 
            nft.id === currentNFT.id 
              ? { ...nft, claimed: true, claimed_at: new Date().toISOString() }
              : nft
          )
        );
        
        // Update current NFT
        setCurrentNFT({ ...currentNFT, claimed: true, claimed_at: new Date().toISOString() });
        updateStepStatus("claim", "completed");
      }, 2000);
    } catch (error) {
      setClaimStatus("error");
      console.error("Error claiming NFT:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Claim Your Viral Post NFT
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Your viral social media content has been preserved on the Solana blockchain. 
          Connect your wallet and verify ownership to claim.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Search & Available NFTs */}
        <div className="space-y-6">
          {/* Search */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Find Your NFT</CardTitle>
              <CardDescription>Search by NFT address or select from available NFTs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="Enter NFT address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-800 border-gray-700 focus:border-cyan-500/50 pr-10"
                  />
                  {searchTerm && (
                    <button 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      onClick={() => setSearchTerm("")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <Button 
                  onClick={handleSearchNFT}
                  disabled={!searchTerm || isLoading}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                >
                  {isLoading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-50 rounded-full border-t-transparent"></div>
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Available NFTs */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Available NFTs</CardTitle>
              <CardDescription>Select a viral post that has been preserved</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableNFTs.map((nft) => (
                <div 
                  key={nft.id}
                  onClick={() => handleSelectNFT(nft)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    currentNFT?.id === nft.id
                      ? "bg-gray-800/50 border-cyan-500/50"
                      : "bg-gray-800/20 border-gray-800 hover:border-gray-700"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">{nft.author}</div>
                    <div className={`text-xs px-2 py-0.5 rounded border ${getTierColor(nft.tier)}`}>
                      {getTierName(nft.tier)} Tier
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-2 mb-2">{nft.content}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <div className="flex space-x-3">
                      <span>{nft.engagement.likes.toLocaleString()} likes</span>
                      <span>{nft.engagement.retweets.toLocaleString()} RTs</span>
                    </div>
                    <span>{formatDate(nft.timestamp)}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Claim Process */}
        <div>
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Claim Process</CardTitle>
              <CardDescription>Complete these steps to claim your NFT</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!currentNFT ? (
                <div className="text-center py-8">
                  <div className="mx-auto w-24 h-24 mb-4">
                    <Image 
                      src="/images/soulie-search.png"
                      alt="Select NFT"
                      width={96}
                      height={96}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">Select an NFT</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    Select one of your available NFTs or search by NFT address to begin the claim process.
                  </p>
                </div>
              ) : (
                <>
                  {/* NFT Preview */}
                  <div className="rounded-lg overflow-hidden border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800">
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-semibold text-lg">{currentNFT.author}</div>
                          <div className="text-sm text-gray-400">{formatDate(currentNFT.timestamp)}</div>
                        </div>
                        <div className={`text-xs px-2 py-0.5 rounded border ${getTierColor(currentNFT.tier)}`}>
                          {getTierName(currentNFT.tier)} Tier
                        </div>
                      </div>
                      
                      <p className="text-gray-200 my-4">{currentNFT.content}</p>
                      
                      <div className="flex justify-between text-sm text-gray-400">
                        <div className="flex space-x-4">
                          <span className="flex items-center gap-1">
                            <Trophy className="w-4 h-4 text-red-500" />
                            {currentNFT.engagement.likes.toLocaleString()} likes
                          </span>
                          <span className="flex items-center gap-1">
                            <Twitter className="w-4 h-4 text-blue-500" />
                            {currentNFT.engagement.retweets.toLocaleString()} retweets
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-green-500" />
                            {Math.round(currentNFT.velocity.likes_per_hour).toLocaleString()}/hour
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Claim Steps */}
                  <div className="space-y-4 mt-6">
                    {steps.map((step) => (
                      <div key={step.id} className="border border-gray-800 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{step.title}</h3>
                            <p className="text-sm text-gray-500">{step.description}</p>
                          </div>
                          <div>
                            {step.status === "completed" && (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                            {step.status === "error" && (
                              <AlertCircle className="w-5 h-5 text-red-500" />
                            )}
                            {step.status === "active" && (
                              <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                            )}
                          </div>
                        </div>
                        
                        {step.id === "connect" && (
                          <Button
                            onClick={handleConnectWallet}
                            disabled={walletConnected || step.status === "pending"}
                            className="w-full mt-2"
                          >
                            <Wallet className="mr-2 h-4 w-4" />
                            {walletConnected ? "Wallet Connected" : "Connect Wallet"}
                          </Button>
                        )}
                        
                        {step.id === "verify" && (
                          <Button
                            onClick={handleTwitterVerify}
                            disabled={!walletConnected || twitterVerified || step.status === "pending"}
                            className="w-full mt-2"
                          >
                            <Twitter className="mr-2 h-4 w-4" />
                            {twitterVerified ? "Twitter Verified" : "Verify Twitter"}
                          </Button>
                        )}
                        
                        {step.id === "claim" && (
                          <Button
                            onClick={handleClaim}
                            disabled={!walletConnected || !twitterVerified || claimStatus === "claimed"}
                            className="w-full mt-2"
                          >
                            {claimStatus === "pending" ? (
                              <>
                                <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-50 rounded-full border-t-transparent mr-2"></div>
                                Claiming...
                              </>
                            ) : claimStatus === "claimed" ? (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                NFT Claimed!
                              </>
                            ) : (
                              <>
                                <Trophy className="mr-2 h-4 w-4" />
                                Claim NFT
                              </>
                            )}
                          </Button>
                        )}
                        
                        {step.status === "error" && step.errorMessage && (
                          <Alert variant="destructive" className="mt-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{step.errorMessage}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Status Messages */}
                  {claimStatus === "claimed" && (
                    <Alert className="bg-green-900/20 text-green-400 border-green-500/30 mt-4">
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>Success!</AlertTitle>
                      <AlertDescription>
                        Your NFT has been successfully claimed and transferred to your wallet.
                      </AlertDescription>
                    </Alert>
                  )}

                  {claimStatus === "error" && (
                    <Alert className="bg-red-900/20 text-red-400 border-red-500/30 mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        There was an error claiming your NFT. Please try again.
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </CardContent>
            {claimStatus === "claimed" && (
              <CardFooter>
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                  View in Wallet
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
