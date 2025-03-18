"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Filter,
  Heart,
  MessageCircle,
  RefreshCcw,
  Share2,
  Users,
} from "lucide-react";

// Mock data for community posts
const mockPosts = [
  {
    id: "1",
    author: "@cryptoinfluencer",
    authorId: "123456",
    content:
      "Web3 is revolutionizing how we think about content ownership! #blockchain #web3",
    engagement: {
      likes: 15000,
      retweets: 3000,
      replies: 500,
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    platform: "Twitter",
  },
  {
    id: "2",
    author: "@nftcreator",
    authorId: "234567",
    content:
      "Just launched my new NFT collection - check it out on SOLspace! #NFT #Solana",
    engagement: {
      likes: 5500,
      retweets: 1200,
      replies: 300,
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    platform: "Twitter",
  },
  {
    id: "3",
    author: "@web3enthusiast",
    authorId: "345678",
    content:
      "Decentralized social media is the future. No more platform censorship or algorithm manipulation. #freedom #web3",
    engagement: {
      likes: 7800,
      retweets: 2100,
      replies: 450,
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    platform: "Twitter",
  },
  {
    id: "4",
    author: "@solana_dev",
    authorId: "456789",
    content:
      "Just deployed my first dApp on Solana. The speed and low fees are incredible! Tutorial coming soon. #Solana #Web3 #DeveloperJourney",
    engagement: {
      likes: 4200,
      retweets: 980,
      replies: 230,
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    platform: "Twitter",
  },
  {
    id: "5",
    author: "@crypto_analyst",
    authorId: "567890",
    content:
      "The future of finance is being built right now on Solana. Speed, scalability and affordability will win the race to mass adoption. #Solana #DeFi",
    engagement: {
      likes: 6300,
      retweets: 1500,
      replies: 340,
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    platform: "Twitter",
  },
];

export default function FeedPage() {
  const [posts, setPosts] = useState(mockPosts);
  const [filteredPosts, setFilteredPosts] = useState(mockPosts);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentFilter, setCurrentFilter] = useState("all"); // all, trending, latest
  const [searchTerm, setSearchTerm] = useState("");

  // Animation states
  const [contentVisible, setContentVisible] = useState(false);

  const filterPosts = useCallback(() => {
    let filtered = [...posts];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    switch (currentFilter) {
      case "trending":
        filtered.sort((a, b) => b.engagement.likes - a.engagement.likes);
        break;
      case "latest":
        filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        break;
      // "all" shows default order
    }

    setFilteredPosts(filtered);
  }, [posts, searchTerm, currentFilter]);

  useEffect(() => {
    setContentVisible(true);
    filterPosts();
  }, [posts, currentFilter, searchTerm, filterPosts]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div
      className={`space-y-8 transition-opacity duration-700 ease-out ${
        contentVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Community Feed
          </h1>
          <p className="text-gray-400">
            View and interact with posts from the community
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="border-gray-700 text-gray-400 hover:text-white"
        >
          <RefreshCcw
            className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Input
            placeholder="Search by content or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 border-gray-700 focus:border-cyan-500/50 pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              onClick={() => setSearchTerm("")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-400 whitespace-nowrap hidden sm:block">
            Filter:
          </div>
          <Tabs
            value={currentFilter}
            onValueChange={setCurrentFilter}
            className="w-full sm:w-auto"
          >
            <TabsList className="w-full sm:w-auto border border-gray-800 bg-gray-900/50 p-0.5">
              <TabsTrigger
                value="all"
                className="text-xs px-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white"
              >
                All Posts
              </TabsTrigger>
              <TabsTrigger
                value="trending"
                className="text-xs px-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white"
              >
                Trending
              </TabsTrigger>
              <TabsTrigger
                value="latest"
                className="text-xs px-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white"
              >
                Latest
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            variant="outline"
            size="sm"
            className="border-gray-700 text-gray-400 hover:text-white hidden sm:flex"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {/* No results state */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-lg">
            <h3 className="text-xl font-medium text-gray-400 mb-2">
              No posts found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm
                ? "No posts match your search criteria. Try a different search term."
                : "No posts have been created yet."}
            </p>
          </div>
        )}

        {/* Post cards */}
        <div className="grid grid-cols-1 gap-4">
          {filteredPosts.map((post) => (
            <Card
              key={post.id}
              className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  <div className="mr-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
                      {post.platform === "Twitter" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-cyan-400"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                        </svg>
                      ) : (
                        <Users className="h-5 w-5 text-purple-400" />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-white">
                      {post.author}
                    </div>
                    <div className="text-xs text-gray-400 flex items-center">
                      {formatTimeAgo(post.timestamp)}
                      <span className="mx-1">•</span>
                      {post.platform}
                    </div>
                  </div>
                </div>

                <p className="text-gray-200 mb-4">{post.content}</p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-400" />
                    {post.engagement.likes.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4 text-blue-400" />
                    {post.engagement.replies.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 className="w-4 h-4 text-green-400" />
                    {post.engagement.retweets.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
