// src/context/AppContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { FreeTierViralDetector } from '../services/FreeTierViralDetector';
import { FreeTierNotificationService } from '../services/FreeTierNotificationService';
import { SONIC_RPC_ENDPOINT } from '../config/connection';

// Types for our context
type AppContextType = {
  viralPosts: any[];
  queueStatus: {
    postsScanned: number;
    potentialPosts: number;
    mintedToday: number;
    apiLimitStatus: {
      currentUsage: number;
      dailyLimit: number;
      usagePercent: number;
      remaining: number;
      nextReset: Date;
    };
  } | null;
  isMonitoring: boolean;
  isRefreshing: boolean;
  lastUpdated: Date | null;
  error: Error | null;
  mintingStatus: Record<string, 'idle' | 'pending' | 'success' | 'error'>;
  refreshViralPosts: () => Promise<void>;
  startMonitoring: () => Promise<void>;
  stopMonitoring: () => void;
  mintPost: (post: any) => Promise<void>;
};

// Default context values
const defaultContext: AppContextType = {
  viralPosts: [],
  queueStatus: null,
  isMonitoring: false,
  isRefreshing: false,
  lastUpdated: null,
  error: null,
  mintingStatus: {},
  refreshViralPosts: async () => {},
  startMonitoring: async () => {},
  stopMonitoring: () => {},
  mintPost: async () => {},
};

// Create the context
const AppContext = createContext<AppContextType>(defaultContext);

// Context provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { publicKey, connected } = useWallet();
  const [viralPosts, setViralPosts] = useState<any[]>([]);
  const [queueStatus, setQueueStatus] = useState<AppContextType['queueStatus']>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [mintingStatus, setMintingStatus] = useState<Record<string, 'idle' | 'pending' | 'success' | 'error'>>({});
  const [monitoringInterval, setMonitoringInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Initialize services
  // Note: In a real app, you'd securely manage these API keys
  const [viralDetector] = useState(() => 
    new FreeTierViralDetector(process.env.NEXT_PUBLIC_TWITTER_API_KEY || 'YOUR_API_KEY')
  );
  const [notificationService] = useState(() => 
    new FreeTierNotificationService(process.env.NEXT_PUBLIC_TWITTER_API_KEY || 'YOUR_API_KEY')
  );
  
  // Connection to SONIC
  const [connection] = useState(() => new Connection(SONIC_RPC_ENDPOINT));
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (monitoringInterval) {
        clearInterval(monitoringInterval);
      }
    };
  }, [monitoringInterval]);
  
  // Refresh viral posts
  const refreshViralPosts = async () => {
    setIsRefreshing(true);
    setError(null);
    
    try {
      const result = await viralDetector.checkForViralPosts();
      
      if (result.status === 'success') {
        setViralPosts(result.posts);
        setLastUpdated(new Date());
      } else if (result.status === 'rate_limited') {
        setViralPosts(result.posts); // Use cached posts
        setError(new Error(`Rate limited. Next check available in ${Math.round(result.nextAvailableIn! / 60000)} minutes`));
      } else {
        setError(new Error(result.message || 'Error refreshing viral posts'));
      }
      
      // Update queue status
      updateQueueStatus();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Start monitoring for viral posts
  const startMonitoring = async () => {
    setIsMonitoring(true);
    
    // Initial check
    await refreshViralPosts();
    
    // Set interval for future checks (15 minutes for free tier)
    const interval = setInterval(async () => {
      await refreshViralPosts();
    }, 15 * 60 * 1000);
    
    setMonitoringInterval(interval);
  };
  
  // Stop monitoring
  const stopMonitoring = () => {
    setIsMonitoring(false);
    
    if (monitoringInterval) {
      clearInterval(monitoringInterval);
      setMonitoringInterval(null);
    }
  };
  
  // Update queue status 
  const updateQueueStatus = () => {
    // For free tier, we'll create mock queue status
    setQueueStatus({
      postsScanned: viralDetector.getCachedViralPosts().length,
      potentialPosts: viralPosts.length,
      mintedToday: Object.values(mintingStatus).filter(status => status === 'success').length,
      apiLimitStatus: {
        currentUsage: 1,
        dailyLimit: 1,
        usagePercent: 100,
        remaining: 0,
        nextReset: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now
      }
    });
  };
  
  // Mint a post as an NFT
  const mintPost = async (post: any) => {
    if (!connected || !publicKey) {
      setError(new Error('Wallet not connected'));
      return;
    }
    
    setMintingStatus(prev => ({
      ...prev,
      [post.id]: 'pending'
    }));
    
    try {
      // In a real implementation, we would:
      // 1. Call our smart contract to mint the NFT
      // 2. Wait for the transaction to confirm
      // 3. Update the UI with the result
      
      // For the free tier MVP, we'll simulate minting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful minting
      setMintingStatus(prev => ({
        ...prev,
        [post.id]: 'success'
      }));
      
      // Queue notification
      await notificationService.queueCreatorNotification(
        post.authorId,
        `simulated-nft-address-${post.id}`,
        post.tier || 1
      );
      
      // Update queue status
      updateQueueStatus();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error minting NFT'));
      setMintingStatus(prev => ({
        ...prev,
        [post.id]: 'error'
      }));
    }
  };
  
  // Context value
  const value = {
    viralPosts,
    queueStatus,
    isMonitoring,
    isRefreshing,
    lastUpdated,
    error,
    mintingStatus,
    refreshViralPosts,
    startMonitoring,
    stopMonitoring,
    mintPost,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Hook to use the context
export const useApp = () => useContext(AppContext);

export default AppContext;
