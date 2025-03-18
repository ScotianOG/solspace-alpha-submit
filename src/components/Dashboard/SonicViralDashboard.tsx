"use client";

import SonicWalletButton from "@/components/wallet/SonicWalletButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { API_LIMITS } from "@/config/viralConfig";
import { SONIC_CONFIG } from "@/config/sonic.config";
import { useApp } from "@/context/AppContext";
import { useWallet } from "@/context/WalletProvider";
import {
  AlertCircle,
  TrendingUp,
  RefreshCw,
  Zap,
  BarChart2,
  Share2,
  Play,
  Pause,
  ArrowUp,
  Info,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { ViralPost } from "@/types";
import Image from "next/image";

const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

type TierColors = {
  [key: number]: {
    bg: string;
    text: string;
    border: string;
  };
};

const tierColors: TierColors = {
  1: { 
    bg: "bg-cyan-500/20", 
    text: "text-cyan-400",
    border: "border-cyan-500/40"
  },
  2: { 
    bg: "bg-blue-500/20", 
    text: "text-blue-400",
    border: "border-blue-500/40"
  },
  3: { 
    bg: "bg-purple-500/20", 
    text: "text-purple-400",
    border: "border-purple-500/40"
  }
};

export function SonicViralDashboard() {
  const {
    viralPosts,
    isMonitoring,
    isRefreshing,
    lastUpdated,
    error,
    mintingStatus,
    refreshViralPosts,
    startMonitoring,
    stopMonitoring,
    mintPost,
  } = useApp();

  const { connected } = useWallet();
  const [showTierInfo, setShowTierInfo] = useState<string | null>(null);

  // Initial data load
  useEffect(() => {
    refreshViralPosts();
  }, [refreshViralPosts]);

  // Handle monitoring status
  const toggleMonitoring = async () => {
    if (isMonitoring) {
      await stopMonitoring();
    } else {
      await startMonitoring();
    }
  };

  // Get tier data for a post based on engagement
  const getPostTier = (post: ViralPost): number => {
    if (post.engagement.likes >= 5000) return 3;
    if (post.engagement.likes >= 2500) return 2;
    return 1;
  };

  // Calculate tier progress percentage
  const getTierProgress = (post: ViralPost): number => {
    const tier = getPostTier(post);
    
    if (tier === 3) return 100;
    
    const currentLikes = post.engagement.likes;
    const nextThreshold = tier === 1 ? 2500 : 5000;
    const prevThreshold = tier === 1 ? 0 : 2500;
    
    return Math.min(100, ((currentLikes - prevThreshold) / (nextThreshold - prevThreshold)) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header with SONIC branding */}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              SONIC Viral Content
            </h1>
            <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/20 text-cyan-400 text-xs px-2 py-0.5 rounded-full">
              MVP
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            Monitor and mint viral content directly to the SONIC network
          </p>
        </div>
        <div className="flex gap-3">
          {!connected && (
            <div className="hidden sm:block">
              <SonicWalletButton />
            </div>
          )}
          <Button
            onClick={toggleMonitoring}
            variant="outline"
            className={
              isMonitoring
                ? "bg-red-500/10 text-red-400 border-red-400"
                : "bg-green-500/10 text-green-400 border-green-400"
            }
          >
            {isMonitoring ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Monitor
              </>
            )}
          </Button>
          <Button onClick={refreshViralPosts} disabled={isRefreshing}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Core metrics cards - simplified for MVP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium">Viral Content</CardTitle>
              <TrendingUp className="h-4 w-4 text-cyan-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{viralPosts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Posts ready to mint to SONIC
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium">Minting Status</CardTitle>
              <Zap className="h-4 w-4 text-cyan-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(mintingStatus).filter(status => status === "success").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Successfully minted today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium">SONIC Network</CardTitle>
              <div className="h-4 w-4 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full opacity-50 animate-pulse"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground mt-1">
              Connected to {SONIC_CONFIG.RPC_URL.split('//')[1].split('.')[0]}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tiers Info Card (for MVP reference) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">SONIC Tier System</CardTitle>
          <CardDescription>
            Viral content tiers based on engagement levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(SONIC_CONFIG.TIERS).map(([tierNum, tierData]) => {
              const tier = parseInt(tierNum);
              const color = tierColors[tier] || tierColors[1];
              return (
                <div 
                  key={tier} 
                  className={`p-3 rounded-lg ${color.bg} border ${color.border} relative`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`font-medium ${color.text}`}>{tierData.NAME}</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {tier < 3 ? 
                          `${tierData.UPGRADE_THRESHOLD?.toLocaleString()} likes to upgrade` : 
                          'Highest tier achieved'}
                      </p>
                    </div>
                    {tierData.IMAGE && (
                      <div className="w-8 h-8 relative">
                        <Image 
                          src={tierData.IMAGE}
                          alt={tierData.NAME}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Viral Posts with tier visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Viral Content Ready to Mint</CardTitle>
          <CardDescription>
            Posts detected with high engagement, sorted by viral score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {viralPosts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                {isRefreshing ? 
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" /> : 
                  <TrendingUp className="w-5 h-5 mx-auto mb-2" />
                }
                <p>
                  {isRefreshing ? 
                    "Looking for viral content..." : 
                    "No viral content detected yet. Start monitoring to detect viral posts."}
                </p>
              </div>
            ) : (
              viralPosts.map((post: ViralPost) => {
                const tier = getPostTier(post);
                const tierProgress = getTierProgress(post);
                const tierColor = tierColors[tier];
                
                return (
                  <Card key={post.tweetId} className="overflow-hidden border-gray-800">
                    <div className={`h-1 w-full ${tierColor.bg}`}>
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500" 
                        style={{ width: `${tierProgress}%` }}
                      ></div>
                    </div>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{post.author}</span>
                            <span className="text-sm text-muted-foreground">
                              {formatTimeAgo(new Date(post.timestamp))}
                            </span>
                            <div 
                              className={`text-xs px-2 py-0.5 rounded-full ${tierColor.bg} ${tierColor.text}`}
                              onMouseEnter={() => setShowTierInfo(post.tweetId.toString())}
                              onMouseLeave={() => setShowTierInfo(null)}
                            >
                              <div className="flex items-center gap-1">
                                {SONIC_CONFIG.TIERS[tier].NAME}
                                <Info className="w-3 h-3" />
                              </div>
                            </div>
                            {showTierInfo === post.tweetId && (
                              <div className="absolute mt-12 ml-36 p-2 bg-gray-800 text-xs text-gray-300 rounded-md shadow-lg max-w-xs z-10 border border-gray-700">
                                <p className="font-medium mb-1">{SONIC_CONFIG.TIERS[tier].NAME} Tier</p>
                                <p>{SONIC_CONFIG.TIERS[tier].DESCRIPTION}</p>
                                {tier < 3 && (
                                  <div className="mt-2">
                                    <p className="text-cyan-400 flex items-center gap-1">
                                      <ArrowUp className="w-3 h-3" />
                                      {post.engagement.likes.toLocaleString()} / {SONIC_CONFIG.TIERS[tier].UPGRADE_THRESHOLD?.toLocaleString()} likes to next tier
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <p className="text-sm">{post.content}</p>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <BarChart2 className="w-4 h-4" />
                              {post.engagement.likes.toLocaleString()} likes
                            </span>
                            <span className="flex items-center gap-1">
                              <Share2 className="w-4 h-4" />
                              {post.engagement.replies.toLocaleString()} replies
                            </span>
                            <span className="flex items-center gap-1">
                              <Zap className="w-4 h-4" />
                              {post.viralScore.toString()} score
                            </span>
                          </div>
                        </div>

                        <Button
                          onClick={() => mintPost(post)}
                          disabled={
                            !connected ||
                            mintingStatus[post.tweetId] === "pending" ||
                            mintingStatus[post.tweetId] === "success"
                          }
                          className={`min-w-[100px] ${
                            mintingStatus[post.tweetId] === "success"
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                              : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                          }`}
                        >
                          {mintingStatus[post.tweetId] === "pending" ? (
                            <div className="flex items-center">
                              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                              Minting
                            </div>
                          ) : mintingStatus[post.tweetId] === "success" ? (
                            <div className="flex items-center">
                              <Zap className="w-4 h-4 mr-2" />
                              Minted
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Zap className="w-4 h-4 mr-2" />
                              Mint to SONIC
                            </div>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error?.message ||
              "An error occurred. Please try refreshing the dashboard."}
          </AlertDescription>
        </Alert>
      )}

      {/* Last Updated info */}
      {lastUpdated && (
        <p className="text-xs text-muted-foreground text-right">
          Last updated: {formatTimeAgo(lastUpdated)}
        </p>
      )}
    </div>
  );
}

export default SonicViralDashboard;
