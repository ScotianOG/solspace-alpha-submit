"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Zap,
  User,
  Twitter,
  CheckCircle,
  Shield,
  Award,
  FileCheck,
  Clock,
  Heart,
  Share2,
  Wallet,
  BarChart2,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SOLspaceVisualization() {
  const [activeStep, setActiveStep] = useState(0);
  const [animating, setAnimating] = useState(true);
  const router = useRouter();

  // Simulated tweet data
  const sampleTweet = {
    author: "@cryptoinfluencer",
    content:
      "Web3 is revolutionizing how we think about content ownership! #blockchain #web3",
    metrics: {
      likes: 5200,
      retweets: 1100,
      replies: 320,
      velocity: {
        likes_per_hour: 520,
        retweets_per_hour: 110,
      },
    },
    tier: 2,
    timestamp: "2h ago",
  };

  useEffect(() => {
    // Slower animation (8 seconds per step instead of 4)
    if (animating) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % 6);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [animating]);

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1:
        return "text-blue-400 bg-blue-500/20 border-blue-500/30";
      case 2:
        return "text-purple-400 bg-purple-500/20 border-purple-500/30";
      case 3:
        return "text-cyan-400 bg-cyan-500/20 border-cyan-500/30";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/30";
    }
  };

  const getTierName = (tier: number): string => {
    switch (tier) {
      case 1:
        return "Rising";
      case 2:
        return "Trending";
      case 3:
        return "Viral";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="bg-gray-950 text-white p-6 min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => router.push("/")}
        className="mb-6 px-4 py-2 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>

      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          SOLspace Viral Tweet NFT System
        </h2>

        {/* Controls */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setAnimating(!animating)}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm flex items-center"
          >
            {animating ? (
              <Clock className="w-4 h-4 mr-2" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            {animating ? "Pause Animation" : "Resume Animation"}
          </button>
          <div className="mx-2" />
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4, 5].map((step) => (
              <button
                key={step}
                onClick={() => {
                  setActiveStep(step);
                  setAnimating(false);
                }}
                className={`w-2 h-2 rounded-full ${
                  activeStep === step ? "bg-cyan-400" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Main visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - steps */}
          <div className="lg:col-span-1 space-y-6 self-start sticky top-6">
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <h3 className="text-xl font-semibold mb-4 text-cyan-400">
                Process Overview
              </h3>
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute left-3.5 top-0 h-full w-px bg-gradient-to-b from-cyan-500/50 via-purple-500/50 to-transparent"></div>

                  {[
                    {
                      icon: <TrendingUp className="w-4 h-4" />,
                      title: "Detection",
                      description: "System monitors Twitter for viral content",
                    },
                    {
                      icon: <Shield className="w-4 h-4" />,
                      title: "Preservation",
                      description: "Viral tweets automatically minted as NFTs",
                    },
                    {
                      icon: <Twitter className="w-4 h-4" />,
                      title: "Notification",
                      description: "Creator receives claim notification",
                    },
                    {
                      icon: <FileCheck className="w-4 h-4" />,
                      title: "Verification",
                      description: "Creator verifies ownership",
                    },
                    {
                      icon: <Wallet className="w-4 h-4" />,
                      title: "Claiming",
                      description: "NFT transferred to creator's wallet",
                    },
                    {
                      icon: <Award className="w-4 h-4" />,
                      title: "Monetization",
                      description: "Creator earns from engagement",
                    },
                  ].map((step, index) => (
                    <div
                      key={index}
                      className={`pl-8 relative pb-4 ${
                        activeStep === index ? "opacity-100" : "opacity-60"
                      }`}
                    >
                      <div
                        className={`absolute left-0 top-0 w-7 h-7 rounded-full flex items-center justify-center border ${
                          activeStep === index
                            ? "border-cyan-500 bg-cyan-500/20"
                            : activeStep > index
                            ? "border-green-500 bg-green-500/20"
                            : "border-gray-700 bg-gray-800"
                        }`}
                      >
                        {activeStep > index ? (
                          <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                        ) : (
                          <span
                            className={
                              activeStep === index
                                ? "text-cyan-400"
                                : "text-gray-500"
                            }
                          >
                            {step.icon}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4
                          className={`font-medium ${
                            activeStep === index
                              ? "text-white"
                              : "text-gray-400"
                          }`}
                        >
                          {step.title}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold mb-3 text-purple-400">
                Viral Thresholds
              </h3>
              <div className="space-y-3 text-sm">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-blue-400">Tier 1: Rising</span>
                    <span className="text-gray-400">1,000+ likes</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: "20%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    100+ likes/hour velocity
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-purple-400">Tier 2: Trending</span>
                    <span className="text-gray-400">2,500+ likes</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500"
                      style={{ width: "50%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    250+ likes/hour velocity
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-cyan-400">Tier 3: Viral</span>
                    <span className="text-gray-400">5,000+ likes</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    500+ likes/hour velocity
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Center and right columns - visualization */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main visualization area */}
            <div className="bg-gray-900 p-5 rounded-lg border border-gray-800 h-[700px] relative overflow-hidden">
              {/* Step 0: Detection */}
              {/* Step 1: Preservation */}
              {/* Step 2: Notification */}
              {/* Step 3: Verification */}
              {/* Step 4: Claiming */}
              {/* Step 5: Monetization */}
              <div
                className={`absolute inset-0 p-5 transition-opacity duration-500 ${
                  activeStep === 0
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 text-cyan-400 mr-2" />
                  Viral Content Detection
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="text-lg font-medium mb-2">
                      Automatic Monitoring
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        System scans Twitter for potential viral tweets
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        Monitors hashtags, engagement rates, and velocities
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        Targets up to 20 mints per day
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        Prioritizes fastest-growing content
                      </li>
                    </ul>

                    <div className="mt-4 p-3 bg-gray-900 rounded border border-gray-700 text-xs text-gray-400">
                      <div className="flex justify-between mb-1">
                        <span>API Usage</span>
                        <span>52%</span>
                      </div>
                      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-500"
                          style={{ width: "52%" }}
                        ></div>
                      </div>
                      <p className="mt-1">144 requests remaining today</p>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex justify-between mb-3">
                      <h4 className="font-medium">Latest Viral Candidates</h4>
                      <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded">
                        Monitoring
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 bg-gray-900 rounded border border-gray-700">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">
                            @cryptoinfluencer
                          </span>
                          <span className="text-xs text-gray-500">2h ago</span>
                        </div>
                        <p className="text-xs text-gray-300 mb-2">
                          Web3 is revolutionizing how we think about content
                          ownership! #blockchain #web3
                        </p>
                        <div className="flex justify-between text-xs text-gray-400">
                          <div className="flex space-x-3">
                            <span className="flex items-center">
                              <Heart className="w-3 h-3 text-red-400 mr-1" />
                              5.2k
                            </span>
                            <span className="flex items-center">
                              <Share2 className="w-3 h-3 text-green-400 mr-1" />
                              1.1k
                            </span>
                          </div>
                          <span className="flex items-center">
                            <Zap className="w-3 h-3 text-yellow-400 mr-1" />
                            520/hr
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-gray-900 rounded border border-gray-700">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">
                            @web3enthusiast
                          </span>
                          <span className="text-xs text-gray-500">4h ago</span>
                        </div>
                        <p className="text-xs text-gray-300 mb-2">
                          Decentralized social media is the future. No more
                          censorship or algorithm manipulation. #freedom
                        </p>
                        <div className="flex justify-between text-xs text-gray-400">
                          <div className="flex space-x-3">
                            <span className="flex items-center">
                              <Heart className="w-3 h-3 text-red-400 mr-1" />
                              3.7k
                            </span>
                            <span className="flex items-center">
                              <Share2 className="w-3 h-3 text-green-400 mr-1" />
                              850
                            </span>
                          </div>
                          <span className="flex items-center">
                            <Zap className="w-3 h-3 text-yellow-400 mr-1" />
                            370/hr
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-5 left-5 right-5">
                  <div className="text-sm mb-1 flex justify-between">
                    <span>Tweet detection in progress...</span>
                    <span>Analyzing engagement...</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 animate-pulse"
                      style={{ width: "65%" }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Step 1: Preservation/Minting */}
              <div
                className={`absolute inset-0 p-5 transition-opacity duration-500 ${
                  activeStep === 1
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Shield className="w-5 h-5 text-purple-400 mr-2" />
                  Automatic NFT Preservation
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="text-lg font-medium mb-2">
                      Instant Minting
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start">
                        <span className="text-purple-400 mr-2">•</span>
                        Tweet reaches Tier 2 (&quot;Trending&quot;) threshold
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-400 mr-2">•</span>
                        Smart contract automatically mints NFT on Solana
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-400 mr-2">•</span>
                        Content and metadata preserved on-chain
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-400 mr-2">•</span>
                        NFT held in escrow until claimed by creator
                      </li>
                    </ul>

                    <div className="mt-4 p-3 bg-gray-900 rounded border border-gray-700 text-xs">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-white">
                          Tier Assessment
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs border ${getTierColor(
                            sampleTweet.tier
                          )}`}
                        >
                          {getTierName(sampleTweet.tier)}
                        </span>
                      </div>
                      <p className="text-gray-400 mb-2">
                        NFT quality and features based on viral tier level
                      </p>
                      <div className="flex justify-between text-gray-400">
                        <span>
                          Tier automatically upgrades as engagement grows
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex justify-between mb-3">
                      <h4 className="font-medium">NFT Metadata Creation</h4>
                      <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">
                        Minting
                      </span>
                    </div>

                    <div className="p-3 bg-gray-900 rounded border border-gray-700 mb-3 text-xs">
                      <code className="text-purple-300">
                        {JSON.stringify(
                          {
                            name: `Trending Tweet by ${sampleTweet.author}`,
                            description:
                              sampleTweet.content.substring(0, 50) + "...",
                            image: "https://solspace.io/nft-images/...",
                            attributes: [
                              { trait_type: "Platform", value: "Twitter" },
                              { trait_type: "Tier", value: "Trending" },
                              { trait_type: "Likes", value: 5200 },
                              { trait_type: "Engagement Velocity", value: 520 },
                            ],
                            properties: {
                              original_id: "1234567890",
                              author_id: "92581950",
                              tier: 2,
                              content_hash: "a1b2c3d4...",
                            },
                          },
                          null,
                          2
                        )
                          .replace(/"([^"]+)":/g, "$1:")
                          .slice(0, 300) + "..."}
                      </code>
                    </div>

                    <div className="text-center p-2 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 rounded">
                      <div className="bg-gray-900 p-2 rounded text-sm">
                        <span className="text-white font-medium">
                          NFT successfully minted! 🎉
                        </span>
                        <p className="text-xs text-gray-400 mt-1">
                          Transaction ID: Hbt4R8JgXP...7aSNuYz
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-5 left-5 right-5">
                  <div className="text-sm mb-1 flex justify-between">
                    <span>Minting transaction confirmed</span>
                    <span>Preparing creator notification...</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Step 2: Notification */}
              <div
                className={`absolute inset-0 p-5 transition-opacity duration-500 ${
                  activeStep === 2
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Twitter className="w-5 h-5 text-blue-400 mr-2" />
                  Creator Notification
                </h3>

                <div className="max-w-md mx-auto mt-8">
                  <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    <div className="bg-gray-900 p-3 border-b border-gray-700 flex items-center">
                      <Twitter className="w-5 h-5 text-blue-400 mr-2" />
                      <span className="font-medium">
                        Twitter Direct Message
                      </span>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-full flex items-center justify-center mr-3 shrink-0">
                          <Shield className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div className="bg-gray-900 rounded-lg p-3 text-sm">
                          <p className="font-medium mb-1">SOLspace</p>
                          <p className="text-gray-300">
                            🎉 Congratulations! Your viral tweet has been
                            preserved as an NFT on Solana blockchain!
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-full flex items-center justify-center mr-3 shrink-0">
                          <Shield className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div className="bg-gray-900 rounded-lg p-3 text-sm">
                          <p className="font-medium mb-1">SOLspace</p>
                          <p className="text-gray-300">
                            Your tweet reached &quot;Trending&quot; tier with
                            over 5,200 likes! 🚀
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-full flex items-center justify-center mr-3 shrink-0">
                          <Shield className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div className="bg-gray-900 rounded-lg p-3 text-sm">
                          <p className="font-medium mb-1">SOLspace</p>
                          <p className="text-gray-300 mb-3">
                            Claim your NFT now to gain full ownership and start
                            earning from your content!
                          </p>
                          <div className="bg-gradient-to-r from-cyan-500 to-purple-500 p-0.5 rounded">
                            <div className="bg-gray-900 rounded p-2 text-center">
                              <a
                                href="#"
                                className="text-cyan-400 hover:text-cyan-300 font-medium"
                              >
                                https://solspace.io/claim/7UeB8zUQJn...
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mt-4 text-sm text-gray-400">
                    <p>No action required until creator decides to claim</p>
                    <p>NFT continues to upgrade automatically for 48 hours</p>
                  </div>
                </div>
              </div>

              {/* Step 3: Verification */}
              <div
                className={`absolute inset-0 p-5 transition-opacity duration-500 ${
                  activeStep === 3
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <FileCheck className="w-5 h-5 text-green-400 mr-2" />
                  Creator Verification
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="text-lg font-medium mb-3 flex items-center">
                      <Twitter className="w-4 h-4 text-blue-400 mr-2" />
                      Twitter Account Verification
                    </h4>

                    <div className="space-y-4">
                      <div className="p-3 bg-gray-900 rounded border border-gray-700">
                        <div className="flex items-center mb-2">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium">
                            Step 1: Identity Confirmation
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-3">
                          The system verifies that the person claiming the NFT
                          is the original tweet author
                        </p>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: "100%" }}
                          ></div>
                        </div>
                      </div>

                      <div className="p-3 bg-gray-900 rounded border border-gray-700">
                        <div className="flex items-center mb-2">
                          <Twitter className="w-4 h-4 text-blue-400 mr-2" />
                          <span className="text-sm font-medium">
                            Step 2: OAuth Authorization
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-3">
                          Creator authorizes SOLspace to verify they control the
                          Twitter account
                        </p>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: "100%" }}
                          ></div>
                        </div>
                      </div>

                      <div className="p-3 bg-gray-900 rounded border border-gray-700">
                        <div className="flex items-center mb-2">
                          <FileCheck className="w-4 h-4 text-green-400 mr-2" />
                          <span className="text-sm font-medium">
                            Step 3: Content Verification
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-3">
                          System confirms tweet content matches the preserved
                          NFT metadata
                        </p>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: "100%" }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-gradient-to-r from-green-500/20 to-green-500/10 rounded border border-green-500/30 text-sm">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                        <span className="font-medium text-green-400">
                          Verification Successful!
                        </span>
                      </div>
                      <p className="text-gray-300 text-xs mt-1">
                        Twitter account ownership verified for @cryptoinfluencer
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="text-lg font-medium mb-3 flex items-center">
                      <Wallet className="w-4 h-4 text-purple-400 mr-2" />
                      Wallet Connection
                    </h4>

                    <div className="p-3 bg-gray-900 rounded border border-gray-700 mb-4">
                      <div className="flex items-center mb-2">
                        <Wallet className="w-4 h-4 text-purple-400 mr-2" />
                        <span className="text-sm font-medium">
                          Connect Wallet
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mb-3">
                        Creator connects their Solana wallet to receive the NFT
                      </p>

                      <div className="space-y-2">
                        <div className="bg-gray-800 p-2 rounded flex items-center justify-between">
                          <span className="text-xs flex items-center">
                            <div className="w-4 h-4 bg-purple-500/20 rounded-full mr-2"></div>
                            Phantom Wallet
                          </span>
                          <span className="text-xs text-cyan-400">Connect</span>
                        </div>
                        <div className="bg-gray-800 p-2 rounded flex items-center justify-between">
                          <span className="text-xs flex items-center">
                            <div className="w-4 h-4 bg-blue-500/20 rounded-full mr-2"></div>
                            Solflare Wallet
                          </span>
                          <span className="text-xs text-cyan-400">Connect</span>
                        </div>
                        <div className="bg-gray-800 p-2 rounded flex items-center justify-between">
                          <span className="text-xs flex items-center">
                            <div className="w-4 h-4 bg-orange-500/20 rounded-full mr-2"></div>
                            Backpack
                          </span>
                          <span className="text-xs text-cyan-400">Connect</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded border border-cyan-500/30">
                        <div className="flex items-center mb-2">
                          <CheckCircle className="w-4 h-4 text-cyan-400 mr-2" />
                          <span className="text-sm font-medium">
                            Wallet Connected
                          </span>
                        </div>
                        <div className="bg-gray-900 p-2 rounded flex items-center justify-between text-xs">
                          <span className="flex items-center">
                            <div className="w-4 h-4 bg-purple-500/20 rounded-full mr-2"></div>
                            Phantom Wallet
                          </span>
                          <span className="text-gray-400">8rGZ...4kJc</span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/10 p-0.5 rounded">
                        <button className="w-full bg-gray-900 rounded p-2 text-sm text-center">
                          <FileCheck className="w-4 h-4 inline-block mr-1 text-green-400" />
                          <span className="text-cyan-400 font-medium">
                            Continue to Claim
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Claiming */}
              <div
                className={`absolute inset-0 p-5 transition-opacity duration-500 ${
                  activeStep === 4
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Wallet className="w-5 h-5 text-cyan-400 mr-2" />
                  NFT Claiming Process
                </h3>

                <div className="max-w-md mx-auto">
                  <div className="bg-gray-800/50 p-5 rounded-lg border border-gray-700 mb-5">
                    <h4 className="text-lg font-medium mb-3 text-center">
                      NFT Preview
                    </h4>

                    <div className="bg-gradient-to-br from-cyan-500/20 via-purple-500/10 to-transparent p-0.5 rounded-lg mb-3">
                      <div className="bg-gray-900 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-semibold">
                              {sampleTweet.author}
                            </div>
                            <div className="text-xs text-gray-400">
                              {sampleTweet.timestamp}
                            </div>
                          </div>
                          <div
                            className={`text-xs px-2 py-0.5 rounded border ${getTierColor(
                              sampleTweet.tier
                            )}`}
                          >
                            {getTierName(sampleTweet.tier)} Tier
                          </div>
                        </div>

                        <p className="text-sm text-gray-300 mb-3">
                          {sampleTweet.content}
                        </p>

                        <div className="flex justify-between text-xs text-gray-400">
                          <span className="flex items-center">
                            <Heart className="w-3 h-3 text-red-400 mr-1" />
                            {sampleTweet.metrics.likes.toLocaleString()} likes
                          </span>
                          <span className="flex items-center">
                            <Share2 className="w-3 h-3 text-green-400 mr-1" />
                            {sampleTweet.metrics.retweets.toLocaleString()} RTs
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-900 p-3 rounded-lg border border-gray-800 mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-gray-400">
                            NFT Address
                          </div>
                          <div className="text-sm font-mono">Hxz9...j7rM</div>
                        </div>
                        <div className="text-xs px-2 py-1 bg-blue-500/20 rounded-full text-blue-400">
                          Unclaimed
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-cyan-500 to-purple-500 p-0.5 rounded-lg">
                      <button className="w-full bg-gray-900 hover:bg-gray-800 rounded-lg py-3 text-center transition-colors">
                        <Zap className="w-5 h-5 inline-block mr-2 text-cyan-400" />
                        <span className="font-medium">Claim NFT</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 p-5 rounded-lg border border-gray-700">
                    <div className="mb-5">
                      <div className="text-center">
                        <div className="inline-block p-3 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full mb-2">
                          <Clock className="w-8 h-8 text-cyan-400 animate-pulse" />
                        </div>
                        <h4 className="text-lg font-medium">
                          Claim In Progress
                        </h4>
                        <p className="text-sm text-gray-400">
                          Please wait while your NFT is being transferred...
                        </p>
                      </div>

                      <div className="mt-4 w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 animate-pulse"
                          style={{ width: "75%" }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-gray-900 p-3 rounded-lg border border-gray-800 text-xs text-gray-400">
                      <p className="mb-2 font-medium text-white">
                        Transaction details:
                      </p>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Transaction ID:</span>
                          <span className="text-cyan-400">5KbnW...9pXq</span>
                        </div>
                        <div className="flex justify-between">
                          <span>From:</span>
                          <span>SOLspace Escrow</span>
                        </div>
                        <div className="flex justify-between">
                          <span>To:</span>
                          <span>8rGZ...4kJc</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span className="text-yellow-400">Confirming...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 5: Monetization */}
              <div
                className={`absolute inset-0 p-5 transition-opacity duration-500 ${
                  activeStep === 5
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Award className="w-5 h-5 text-yellow-400 mr-2" />
                  Creator Monetization
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="text-lg font-medium mb-3 text-center">
                      Claimed NFT
                    </h4>

                    <div className="bg-gradient-to-br from-cyan-500/20 via-purple-500/10 to-transparent p-0.5 rounded-lg mb-4">
                      <div className="bg-gray-900 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-semibold">
                              {sampleTweet.author}
                            </div>
                            <div className="text-xs text-gray-400">
                              {sampleTweet.timestamp}
                            </div>
                          </div>
                          <div className="text-xs px-2 py-0.5 rounded border bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                            Viral Tier
                          </div>
                        </div>

                        <p className="text-sm text-gray-300 mb-3">
                          {sampleTweet.content}
                        </p>

                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2 text-xs text-gray-400">
                            <span className="flex items-center">
                              <Heart className="w-3 h-3 text-red-400 mr-1" />
                              15.8k
                            </span>
                            <span className="flex items-center">
                              <Share2 className="w-3 h-3 text-green-400 mr-1" />
                              4.2k
                            </span>
                          </div>
                          <div className="text-xs px-2 py-1 bg-green-500/20 rounded-full text-green-400">
                            Claimed
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-900 p-3 rounded-lg border border-gray-800 mb-3 text-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">NFT Engagement</span>
                        <span className="text-xs px-2 py-0.5 bg-purple-500/20 rounded-full text-purple-400">
                          Active
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>On-chain views</span>
                          <span className="text-white">2,541</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>On-chain likes</span>
                          <span className="text-white">843</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>On-chain shares</span>
                          <span className="text-white">156</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 p-0.5 rounded-lg">
                      <div className="bg-gray-900 rounded-lg p-3 text-center">
                        <p className="text-green-400 font-medium text-base">
                          $12.50 Earned
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          From on-chain engagement
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="text-lg font-medium mb-3 flex items-center">
                      <Award className="w-4 h-4 text-yellow-400 mr-2" />
                      Creator Dashboard
                    </h4>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
                          <div className="text-xs text-gray-400 mb-1">
                            Total Earnings
                          </div>
                          <div className="text-xl font-bold text-green-400">
                            $42.75
                          </div>
                          <div className="text-xs text-green-400 flex items-center mt-1">
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
                            +18.3%
                          </div>
                        </div>
                        <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
                          <div className="text-xs text-gray-400 mb-1">
                            NFTs Owned
                          </div>
                          <div className="text-xl font-bold text-white">3</div>
                          <div className="text-xs text-cyan-400 mt-1">
                            2 Viral, 1 Trending
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
                        <div className="flex justify-between mb-2">
                          <div className="text-sm font-medium">
                            Earning Sources
                          </div>
                          <div className="text-xs text-gray-400">
                            Last 30 days
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-400">
                                Engagement Revenue
                              </span>
                              <span className="text-white">$32.50</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-cyan-500"
                                style={{ width: "76%" }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-400">NFT Sales</span>
                              <span className="text-white">$7.25</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-purple-500"
                                style={{ width: "16%" }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-400">Royalties</span>
                              <span className="text-white">$3.00</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500"
                                style={{ width: "8%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 p-0.5 rounded-lg">
                        <button className="w-full bg-gray-900 hover:bg-gray-800 rounded-lg py-2 text-sm text-center transition-colors">
                          <BarChart2 className="w-4 h-4 inline-block mr-2 text-cyan-400" />
                          <span className="font-medium">
                            View Full Analytics
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-5 left-0 right-0 text-center">
                  <p className="text-sm text-gray-400">
                    Creator now owns their viral content and earns directly from
                    engagement!
                  </p>
                </div>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex flex-col items-center text-center">
                <Shield className="w-8 h-8 text-cyan-400 mb-2" />
                <h3 className="font-medium mb-1">Content Preservation</h3>
                <p className="text-xs text-gray-400">
                  Viral moments permanently saved on Solana blockchain
                </p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex flex-col items-center text-center">
                <Award className="w-8 h-8 text-purple-400 mb-2" />
                <h3 className="font-medium mb-1">Creator Ownership</h3>
                <p className="text-xs text-gray-400">
                  True ownership rights for social media content
                </p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex flex-col items-center text-center">
                <Zap className="w-8 h-8 text-yellow-400 mb-2" />
                <h3 className="font-medium mb-1">Direct Monetization</h3>
                <p className="text-xs text-gray-400">
                  Earn from on-chain engagement and NFT value
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
