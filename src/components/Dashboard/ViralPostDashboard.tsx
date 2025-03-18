"use client";

import IntegratedWalletButton from "@/components/wallet/IntegratedWalletButton";
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
import { useApp } from "@/context/AppContext";
import { useWallet } from "@/context/WalletProvider";
import {
  AlertCircle,
  TrendingUp,
  Activity,
  Clock,
  RefreshCw,
  Zap,
  BarChart2,
  CheckCircle,
  Share2,
  Play,
  Pause,
} from "lucide-react";
import React, { useEffect } from "react";
import { ViralPost } from "@/types"; // Ensure correct import

const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const formatTimeUntil = (date: Date): string => {
  const diff = date.getTime() - new Date().getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

export function ViralPostDashboard() {
  const {
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
  } = useApp();

  const { connected } = useWallet();

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

  // Determine monitoring status UI display
  const getMonitoringStatus = () => {
    if (error) return "error";
    if (
      queueStatus?.apiLimitStatus?.usagePercent &&
      queueStatus.apiLimitStatus.usagePercent > 90
    )
      return "rate_limited";
    return "active";
  };

  const monitoringStatus = getMonitoringStatus();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Viral Post Monitor</h1>
        <div className="flex gap-3">
          {!connected && (
            <div className="hidden sm:block">
              <IntegratedWalletButton className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white" />
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
                Stop Monitoring
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start Monitoring
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

      {/* API Usage Progress */}
      <Card>
        <CardHeader>
          <CardTitle>API Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress
            value={queueStatus?.apiLimitStatus.usagePercent || 0}
            className="h-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>
              {queueStatus?.apiLimitStatus.remaining || 0} requests remaining
            </span>
            {queueStatus?.apiLimitStatus.nextReset && (
              <span>
                Resets in{" "}
                {formatTimeUntil(queueStatus.apiLimitStatus.nextReset)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posts Scanned</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {queueStatus?.postsScanned || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Daily Limit: {API_LIMITS.MONTHLY_LIMITS.POST_READS}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Potential Viral
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {queueStatus?.potentialPosts || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Threshold:{" "}
              {API_LIMITS.VIRAL_THRESHOLDS.TIER_1.MIN_LIKES.toLocaleString()}{" "}
              likes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Queue</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{viralPosts.length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Daily Target: {API_LIMITS.MONTHLY_LIMITS.POST_CREATES}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Minted Today</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {queueStatus?.mintedToday || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Remaining:{" "}
              {API_LIMITS.MONTHLY_LIMITS.POST_CREATES -
                (queueStatus?.mintedToday || 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Queued Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Viral Posts Queue</CardTitle>
          <CardDescription>
            Posts ready for minting, sorted by engagement velocity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {viralPosts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {isRefreshing
                  ? "Loading posts..."
                  : "No posts currently queued for minting"}
              </p>
            ) : (
              viralPosts.map((post: ViralPost) => (
                <Card key={post.tweetId}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{post.author}</span>
                          <span className="text-sm text-muted-foreground">
                            {formatTimeAgo(new Date(post.timestamp))}
                          </span>
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
                        onClick={() => {
                          // Convert to TwitterPost format for minting
                          const twitterPost: ViralPost = {
                            tweetId: post.tweetId,
                            content: post.content,
                            author: post.author,
                            engagement: {
                              likes: post.engagement.likes,
                              retweets: post.engagement.retweets,
                              replies: post.engagement.replies,
                            },
                            timestamp: post.timestamp,
                            viralScore: post.viralScore,
                            mintProgress: post.mintProgress,
                            platform: 'twitter'
                          };
                          mintPost(twitterPost);
                        }}
                        disabled={
                          !connected ||
                          mintingStatus[post.tweetId] === "pending" ||
                          mintingStatus[post.tweetId] === "success" ||
                          (queueStatus?.mintedToday || 0) >=
                            API_LIMITS.MONTHLY_LIMITS.POST_CREATES
                        }
                        className="min-w-[100px]"
                      >
                        {mintingStatus[post.tweetId] === "pending" ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : mintingStatus[post.tweetId] === "success" ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          "Mint Now"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status Alerts */}
      {monitoringStatus === "rate_limited" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Rate Limit Reached</AlertTitle>
          <AlertDescription>
            API rate limit reached. Monitoring paused until{" "}
            {queueStatus?.apiLimitStatus.nextReset &&
              formatTimeUntil(queueStatus.apiLimitStatus.nextReset)}
            .
          </AlertDescription>
        </Alert>
      )}

      {monitoringStatus === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error?.message ||
              "An error occurred while updating the dashboard. Please try refreshing."}
          </AlertDescription>
        </Alert>
      )}

      {/* Last Updated */}
      {lastUpdated && (
        <p className="text-xs text-muted-foreground text-right">
          Last updated: {formatTimeAgo(lastUpdated)}
        </p>
      )}
    </div>
  );
}

export default ViralPostDashboard;
