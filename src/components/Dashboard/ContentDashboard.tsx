"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import StarryBackground from "@/components/StarryBackground";
import {
  Wallet,
  TrendingUp,
  Zap,
  RefreshCcw,
  Eye,
  Share2,
  Heart,
  Clock,
  MessageCircle,
  DollarSign,
  Copy,
  BarChart2,
  Search,
  Filter,
  ExternalLink,
  Settings,
} from "lucide-react";
import { Input } from "@/components/ui/input";

// Types
interface ContentStats {
  id: string;
  title: string;
  platform: string;
  engagement: {
    likes: number;
    retweets?: number;
    comments: number;
    shares: number;
  };
  mintedDate: string;
  status: "claimed" | "unclaimed" | "pending";
  earnings: number; // in SOUL tokens
  nftAddress: string;
  tier: 1 | 2 | 3;
  velocity: number;
}

interface AudienceStat {
  name: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

export default function CreatorDashboard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [walletConnected, setWalletConnected] = useState(true);

  // Mock data for the dashboard
  const contentStats: ContentStats[] = [
    {
      id: "1",
      title:
        "Web3 is revolutionizing how we think about content ownership! #blockchain #web3",
      platform: "Twitter",
      engagement: {
        likes: 15000,
        retweets: 3000,
        comments: 500,
        shares: 2800,
      },
      mintedDate: "2 days ago",
      status: "claimed",
      earnings: 25000, // 25,000 SOUL (~$12.50)
      nftAddress: "mock-nft-address-1",
      tier: 3,
      velocity: 1500,
    },
    {
      id: "2",
      title:
        "The future of decentralized social media looks promising. Here&apos;s why creators should pay attention...",
      platform: "Twitter",
      engagement: {
        likes: 8200,
        retweets: 1800,
        comments: 350,
        shares: 1200,
      },
      mintedDate: "3 days ago",
      status: "claimed",
      earnings: 13600, // 13,600 SOUL (~$6.80)
      nftAddress: "mock-nft-address-2",
      tier: 2,
      velocity: 820,
    },
    {
      id: "3",
      title:
        "Just published my thoughts on content monetization in the web3 era. Check it out!",
      platform: "Twitter",
      engagement: {
        likes: 3500,
        retweets: 980,
        comments: 210,
        shares: 820,
      },
      mintedDate: "5 days ago",
      status: "claimed",
      earnings: 8400, // 8,400 SOUL (~$4.20)
      nftAddress: "mock-nft-address-3",
      tier: 2,
      velocity: 350,
    },
    {
      id: "4",
      title:
        "I&apos;m thrilled to announce my partnership with SOLspace for better content ownership!",
      platform: "Twitter",
      engagement: {
        likes: 1200,
        retweets: 420,
        comments: 180,
        shares: 380,
      },
      mintedDate: "1 week ago",
      status: "unclaimed",
      earnings: 0,
      nftAddress: "mock-nft-address-4",
      tier: 1,
      velocity: 120,
    },
  ];

  const audienceStats: AudienceStat[] = [
    {
      name: "Total NFT Views",
      value: 28750,
      change: 24.6,
      icon: <Eye className="w-5 h-5" />,
      color: "text-cyan-400",
    },
    {
      name: "Total Engagement",
      value: 4928,
      change: 32.8,
      icon: <Heart className="w-5 h-5" />,
      color: "text-purple-400",
    },
    {
      name: "SOUL Earnings",
      value: 47000, // 47,000 SOUL (~$23.50)
      change: 18.2,
      icon: <DollarSign className="w-5 h-5" />,
      color: "text-green-400",
    },
    {
      name: "Viral Score",
      value: 82,
      change: 12.5,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-yellow-400",
    },
  ];

  const pendingMints = [
    {
      id: "pending1",
      platform: "Twitter",
      content:
        "My thoughts on the future of social media and content ownership...",
      timestamp: "3 hours ago",
      metrics: {
        likes: 780,
        retweets: 210,
        comments: 85,
      },
      progress: 78,
    },
    {
      id: "pending2",
      platform: "Twitter",
      content: "Just released my new tutorial on Web3 development!",
      timestamp: "5 hours ago",
      metrics: {
        likes: 620,
        retweets: 180,
        comments: 42,
      },
      progress: 62,
    },
  ];

  // Simulated API call to refresh data
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const handleConnectWallet = () => {
    setWalletConnected(true);
  };

  const handleClaimNFT = (id: string) => {
    // Implement claim logic
    console.log(`Claiming NFT ${id}`);
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    // Could add a toast notification here
    console.log(`Copied ${address} to clipboard`);
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Format number with k/m suffixes
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "m";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  const getTierBadge = (tier: number) => {
    const tierNames = {
      1: "Rising",
      2: "Trending",
      3: "Viral",
    };

    const tierColors = {
      1: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      2: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      3: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs border ${
          tierColors[tier as keyof typeof tierColors]
        }`}
      >
        {tierNames[tier as keyof typeof tierNames]}
      </span>
    );
  };

  // Function to determine which button to show for content status
  const getActionButton = (content: ContentStats) => {
    if (content.status === "unclaimed") {
      return (
        <Button
          size="sm"
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
          onClick={() => handleClaimNFT(content.id)}
        >
          Claim NFT
        </Button>
      );
    } else if (content.status === "pending") {
      return (
        <Button
          variant="outline"
          size="sm"
          className="border-yellow-500/50 text-yellow-400"
          disabled
        >
          <Clock className="h-4 w-4 mr-1" />
          Processing
        </Button>
      );
    } else {
      return (
        <div className="flex items-center gap-2">
          {content.earnings > 0 && (
            <div className="text-sm font-medium text-green-400">
              {formatNumber(content.earnings)} SOUL
              <span className="text-xs text-gray-400 ml-1">
                (~${(content.earnings * 0.0005).toFixed(2)})
              </span>
            </div>
          )}
          <Button variant="outline" size="sm" className="border-gray-700">
            <Eye className="h-4 w-4 mr-1" />
            View NFT
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Starry background */}
      <StarryBackground starCount={150} />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div
          className={`mb-6 transition-all duration-1000 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Card className="glass-card backdrop-blur-md border-gray-700/50 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-gray-800/30 to-transparent"></div>

            <CardContent className="relative z-10 p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      Creator Dashboard
                    </span>
                  </h1>
                  <p className="text-gray-400 mt-1">
                    Track and monetize your viral content
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                  >
                    <RefreshCcw
                      className={`w-4 h-4 mr-2 ${
                        isRefreshing ? "animate-spin" : ""
                      }`}
                    />
                    {isRefreshing ? "Refreshing..." : "Refresh Data"}
                  </Button>

                  {!walletConnected ? (
                    <Button
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                      onClick={handleConnectWallet}
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      Connect Wallet
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-700"
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      8rGZ...4kJc
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Navigation */}
        <div
          className={`mb-6 transition-all duration-1000 delay-100 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full bg-gray-900/50 p-1 mb-6">
              <TabsTrigger
                value="overview"
                className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="content"
                className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white"
              >
                My Content
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="earnings"
                className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white"
              >
                Earnings
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {audienceStats.map((stat, index) => (
                  <Card
                    key={index}
                    className="glass-card backdrop-blur-md border-gray-700/50 shadow-xl relative overflow-hidden hover:translate-y-[-5px] transition-transform duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-transparent"></div>

                    <CardContent className="relative z-10 p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-400">{stat.name}</p>
                          <p className="text-3xl font-bold text-white mt-1">
                            {stat.name === "SOUL Earnings" ? (
                              <>{formatNumber(stat.value)} SOUL</>
                            ) : stat.name.includes("Score") ? (
                              `${stat.value}%`
                            ) : (
                              stat.value.toLocaleString()
                            )}
                          </p>
                          {stat.name === "SOUL Earnings" && (
                            <p className="text-xs text-gray-400">
                              ~${(stat.value * 0.0005).toFixed(2)}
                            </p>
                          )}
                        </div>
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.color
                            .replace("text-", "bg-")
                            .replace("400", "500/20")}`}
                        >
                          <span className={stat.color}>{stat.icon}</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="text-xs flex items-center text-green-400">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 10l7-7m0 0l7 7m-7-7v18"
                            />
                          </svg>
                          {stat.change}% from last month
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Content */}
              <Card className="glass-card backdrop-blur-md border-gray-700/50 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 to-transparent"></div>

                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-cyan-400 mr-2" />
                    Your Viral Content
                  </CardTitle>
                  <CardDescription>
                    Your content that has gone viral and been minted as NFTs
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative z-10 space-y-4">
                  {contentStats.slice(0, 3).map((content) => (
                    <Card
                      key={content.id}
                      className="bg-gray-800/30 border-gray-700 hover:bg-gray-800/40 transition-colors"
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-white">
                                  {content.platform}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {content.mintedDate}
                                </span>
                              </div>
                              <div>{getTierBadge(content.tier)}</div>
                            </div>
                            <p className="text-sm text-gray-200">
                              {content.title}
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <Heart className="w-4 h-4 text-red-400" />
                                {formatNumber(content.engagement.likes)} likes
                              </span>
                              {content.engagement.retweets && (
                                <span className="flex items-center gap-1">
                                  <Share2 className="w-4 h-4 text-blue-400" />
                                  {formatNumber(
                                    content.engagement.retweets
                                  )}{" "}
                                  RTs
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <MessageCircle className="w-4 h-4 text-green-400" />
                                {formatNumber(content.engagement.comments)}{" "}
                                comments
                              </span>
                              <span className="flex items-center gap-1">
                                <Zap className="w-4 h-4 text-yellow-400" />
                                {formatNumber(content.velocity)}/hr
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2 justify-between items-center">
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <span>NFT:</span>
                            <code className="bg-gray-800 px-2 py-0.5 rounded text-cyan-400">
                              {content.nftAddress.slice(0, 8)}...
                              {content.nftAddress.slice(-4)}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => copyAddress(content.nftAddress)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-2">
                            {getActionButton(content)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Pending Content */}
                  <div className="space-y-1 mt-6">
                    <h3 className="text-base font-medium text-white">
                      Pending Mints
                    </h3>
                    <p className="text-sm text-gray-400">
                      Content that&apos;s on its way to becoming viral
                    </p>
                  </div>

                  {pendingMints.map((pending) => (
                    <Card
                      key={pending.id}
                      className="bg-gray-800/30 border-gray-700 border-dashed"
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white">
                                {pending.platform}
                              </span>
                              <span className="text-xs text-gray-400">
                                {pending.timestamp}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-300">
                            {pending.content}
                          </p>
                          <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3 text-red-400" />
                              {formatNumber(pending.metrics.likes)} likes
                            </span>
                            <span className="flex items-center gap-1">
                              <Share2 className="w-3 h-3 text-blue-400" />
                              {formatNumber(pending.metrics.retweets)} RTs
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3 text-green-400" />
                              {formatNumber(pending.metrics.comments)} comments
                            </span>
                          </div>

                          <div className="mt-2 space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">
                                Viral threshold progress
                              </span>
                              <span className="text-cyan-400">
                                {pending.progress}%
                              </span>
                            </div>
                            <Progress
                              value={pending.progress}
                              className="h-1.5 bg-gray-700"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>

                <CardFooter className="relative z-10 border-t border-gray-800 bg-gray-900/30">
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto border-gray-700 text-gray-400 hover:text-white"
                  >
                    View All Content
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6">
              {/* Content Management */}
              <Card className="glass-card backdrop-blur-md border-gray-700/50 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-gray-800/30 to-transparent"></div>

                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center">
                    <BarChart2 className="w-5 h-5 text-purple-500 mr-2" />
                    Content Management
                  </CardTitle>
                  <CardDescription>
                    Manage your viral content and NFTs
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative z-10">
                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search content..."
                        className="pl-9 bg-gray-800/50 border-gray-700"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 border-gray-700"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>

                  {/* Content Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contentStats.map((content) => (
                      <Card
                        key={content.id}
                        className="bg-gray-800/30 border-gray-700"
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-white">
                                  {content.platform}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {content.mintedDate}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {getTierBadge(content.tier)}
                                {content.status === "claimed" && (
                                  <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                                    Claimed
                                  </span>
                                )}
                                {content.status === "unclaimed" && (
                                  <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                    Unclaimed
                                  </span>
                                )}
                              </div>
                            </div>

                            <p className="text-sm text-gray-200">
                              {content.title}
                            </p>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <Heart className="w-4 h-4 text-red-400" />
                                {formatNumber(content.engagement.likes)}
                              </span>
                              {content.engagement.retweets && (
                                <span className="flex items-center gap-1">
                                  <Share2 className="w-4 h-4 text-blue-400" />
                                  {formatNumber(content.engagement.retweets)}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <MessageCircle className="w-4 h-4 text-green-400" />
                                {formatNumber(content.engagement.comments)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Zap className="w-4 h-4 text-yellow-400" />
                                {formatNumber(content.velocity)}/hr
                              </span>
                            </div>

                            <div className="pt-2 border-t border-gray-700 flex justify-between items-center">
                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                <span>NFT:</span>
                                <code className="bg-gray-800 px-2 py-0.5 rounded text-cyan-400">
                                  {content.nftAddress.slice(0, 8)}...
                                  {content.nftAddress.slice(-4)}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() =>
                                    copyAddress(content.nftAddress)
                                  }
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>

                              <div className="flex items-center gap-2">
                                {content.status === "unclaimed" ? (
                                  <Button
                                    size="sm"
                                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                                    onClick={() => handleClaimNFT(content.id)}
                                  >
                                    Claim NFT
                                  </Button>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    {content.earnings > 0 && (
                                      <div className="text-sm font-medium text-green-400">
                                        {formatNumber(content.earnings)} SOUL
                                        <span className="text-xs text-gray-400 ml-1">
                                          (~$
                                          {(content.earnings * 0.0005).toFixed(
                                            2
                                          )}
                                          )
                                        </span>
                                      </div>
                                    )}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-gray-700"
                                    >
                                      <ExternalLink className="h-4 w-4 mr-1" />
                                      View NFT
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="relative z-10 border-t border-gray-800 bg-gray-900/30">
                  <div className="flex items-center justify-between w-full">
                    <p className="text-sm text-gray-400">
                      Showing <span className="font-medium text-white">4</span>{" "}
                      of <span className="font-medium text-white">12</span>{" "}
                      items
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-gray-700"
                        disabled
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-gray-700"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              {/* Analytics Dashboard */}
              <Card className="glass-card backdrop-blur-md border-gray-700/50 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-gray-800/30 to-transparent"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center">
                    <BarChart2 className="w-5 h-5 text-cyan-400 mr-2" />
                    Analytics Overview
                  </CardTitle>
                  <CardDescription>
                    Track your content performance and engagement metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-6">
                    {/* Placeholder for analytics charts */}
                    <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6 text-center">
                      <BarChart2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">
                        Analytics charts coming soon
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Earnings Tab */}
            <TabsContent value="earnings" className="space-y-6">
              {/* Earnings Dashboard */}
              <Card className="glass-card backdrop-blur-md border-gray-700/50 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-gray-800/30 to-transparent"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 text-green-400 mr-2" />
                    Earnings Overview
                  </CardTitle>
                  <CardDescription>
                    Track your earnings from viral content
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-6">
                    {/* Total Earnings Card */}
                    <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-400">
                            Total Earnings
                          </p>
                          <p className="text-3xl font-bold text-white mt-1">
                            47,000 SOUL
                          </p>
                          <p className="text-xs text-gray-400">~$23.50</p>
                        </div>
                        <div className="bg-green-500/20 w-10 h-10 rounded-full flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-green-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
