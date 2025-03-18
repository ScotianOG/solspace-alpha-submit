// src/context/AppContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ViralPost, QueueStatus } from "@/types"; // Ensure correct import

export type MintStatus = "idle" | "pending" | "success" | "error";

interface AppContextType {
  viralPosts: ViralPost[];
  queueStatus: QueueStatus | null;
  isMonitoring: boolean;
  isRefreshing: boolean;
  lastUpdated: Date | null;
  error: Error | null;
  mintingStatus: { [key: string]: MintStatus };
  userType: "admin" | "user" | null;
  isAuthenticated: boolean;
  refreshViralPosts: () => Promise<void>;
  startMonitoring: () => Promise<void>;
  stopMonitoring: () => Promise<void>;
  mintPost: (post: ViralPost) => Promise<void>;
  claimNFT: (nftAddress: string, twitterId: string, walletAddress: string) => Promise<boolean>;
  login: (type: "admin" | "user") => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType>({
  viralPosts: [],
  queueStatus: {
    postsScanned: 0,
    potentialPosts: 0,
    mintedToday: 0,
    apiLimitStatus: {
      currentUsage: 0,
      dailyLimit: 0,
      usagePercent: 0,
      remaining: 0,
      nextReset: new Date(),
    },
  },
  isMonitoring: false,
  isRefreshing: false,
  lastUpdated: null,
  error: null,
  mintingStatus: {},
  userType: null,
  isAuthenticated: false,
  refreshViralPosts: async () => Promise.resolve(),
  startMonitoring: async () => Promise.resolve(),
  stopMonitoring: async () => Promise.resolve(),
  mintPost: async () => Promise.resolve(),
  claimNFT: async () => Promise.resolve(false),
  login: () => {},
  logout: () => {},
});

export function useApp() {
  return useContext(AppContext);
}

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [userType, setUserType] = useState<"admin" | "user" | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Mock viral posts data
  const [viralPosts, setViralPosts] = useState<ViralPost[]>([
    {
      tweetId: "1",
      author: "@cryptoinfluencer",
      content:
        "Web3 is revolutionizing how we think about content ownership! #blockchain #web3",
      engagement: {
        likes: 15000,
        retweets: 3000,
        replies: 500,
      },
      timestamp: new Date().toISOString(),
      viralScore: 95,
      mintProgress: 100,
      imageUrl: "",
      platform: "twitter",
    },
    {
      tweetId: "2",
      author: "@nftcreator",
      content:
        "Just launched my new NFT collection - check it out on SOLspace! #NFT #Solana",
      engagement: {
        likes: 5500,
        retweets: 1200,
        replies: 300,
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      viralScore: 82,
      mintProgress: 65,
      imageUrl: "",
      platform: "twitter",
    },
    {
      tweetId: "3",
      author: "@web3enthusiast",
      content:
        "Decentralized social media is the future. No more platform censorship or algorithm manipulation. #freedom #web3",
      engagement: {
        likes: 7800,
        retweets: 2100,
        replies: 450,
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      viralScore: 78,
      mintProgress: 40,
      imageUrl: "",
      platform: "twitter",
    },
  ]);

  // Mock queue status data
  const [queueStatus, setQueueStatus] = useState<QueueStatus>({
    postsScanned: 156,
    potentialPosts: 7,
    mintedToday: 4,
    apiLimitStatus: {
      currentUsage: 156,
      dailyLimit: 300,
      usagePercent: 52,
      remaining: 144,
      nextReset: new Date(Date.now() + 8 * 60 * 60 * 1000),
    },
  });

  const [isMonitoring, setIsMonitoring] = useState(true);
  const [mintingStatus, setMintingStatus] = useState<
    Record<string, MintStatus>
  >({});

  // Start monitoring function
  const startMonitoring = () => {
    setIsMonitoring(true);
  };

  // Stop monitoring function
  const stopMonitoring = () => {
    setIsMonitoring(false);
  };

  // Update queue status periodically when monitoring is active
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      // Simulate finding a new viral post occasionally
      if (Math.random() < 0.1) {
        setViralPosts((prev) => [
          ...prev,
          {
            tweetId: Date.now().toString(),
            author: "@newuser",
            content: "New viral content detected!",
            engagement: {
              likes: Math.floor(Math.random() * 10000),
              retweets: Math.floor(Math.random() * 2000),
              replies: Math.floor(Math.random() * 500),
            },
            timestamp: new Date().toISOString(),
            viralScore: Math.floor(Math.random() * 100),
            mintProgress: 0,
            imageUrl: "",
            platform: "twitter",
          },
        ]);
      }

      setQueueStatus((prevStatus) => ({
        ...prevStatus,
        postsScanned: prevStatus.postsScanned + 1,
        apiLimitStatus: {
          ...prevStatus.apiLimitStatus,
          currentUsage: prevStatus.apiLimitStatus.currentUsage + 1,
          remaining:
            prevStatus.apiLimitStatus.dailyLimit -
            prevStatus.apiLimitStatus.currentUsage -
            1,
          usagePercent:
            ((prevStatus.apiLimitStatus.currentUsage + 1) /
              prevStatus.apiLimitStatus.dailyLimit) *
            100,
        },
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const login = (type: "admin" | "user") => {
    setUserType(type);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUserType(null);
    setIsAuthenticated(false);
  };

  const value = {
    viralPosts,
    queueStatus,
    isMonitoring,
    isRefreshing: false,
    lastUpdated: null,
    error: null,
    mintingStatus,
    userType,
    isAuthenticated,
    startMonitoring: async () => startMonitoring(),
    stopMonitoring: async () => stopMonitoring(),
    refreshViralPosts: async () => Promise.resolve(),
    login,
    logout,
    mintPost: async (post: ViralPost) => {
      setMintingStatus((prev) => ({ ...prev, [post.tweetId]: "pending" }));
      try {
        // Simulate minting process
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setMintingStatus((prev) => ({ ...prev, [post.tweetId]: "success" }));
      } catch {
        setMintingStatus((prev) => ({ ...prev, [post.tweetId]: "error" }));
      }
    },
    claimNFT: async (nftAddress: string, twitterId: string, walletAddress: string) => {
      try {
        // Simulate NFT claiming process
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return true;
      } catch {
        return false;
      }
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
