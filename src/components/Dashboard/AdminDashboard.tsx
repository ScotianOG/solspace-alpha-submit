"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import StarryBackground from "@/components/StarryBackground";
import { 
  Wallet, 
  ShieldAlert, 
  Users, 
  BarChart2, 
  Settings, 
  RefreshCcw, 
  AlertCircle, 
  User, 
  CheckCircle, 
  XCircle, 
  Eye,
  Search,
  Filter,
  Download,
  Zap,
  Info,
  Flag,
  AlertTriangle,
  Clock,
  HelpCircle,
  Plus
} from "lucide-react";

interface User {
  id: string;
  username: string;
  email: string;
  walletAddress: string;
  joinDate: string;
  status: 'active' | 'pending' | 'suspended';
  nftsMinted: number;
  contentReported: number;
}

interface NFT {
  id: string;
  name: string;
  creator: string;
  mintDate: string;
  status: 'active' | 'flagged' | 'removed';
  contentType: string;
  platform: string;
}

interface SystemMetric {
  name: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

export default function AdminDashboard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Mock data
  const users: User[] = [
    {
      id: "user1",
      username: "CryptoInfluencer",
      email: "crypto@example.com",
      walletAddress: "8rGZ7VHqQjD4gHBiPrLjYbYnYKLHxbFiwB4Naiyx4kJc",
      joinDate: "Nov 15, 2023",
      status: 'active',
      nftsMinted: 12,
      contentReported: 0
    },
    {
      id: "user2",
      username: "NFTCreator",
      email: "nft@example.com",
      walletAddress: "7UeB8zUQJnEcTVQu4eff6QjgGsHBiRfFwkPGKPcmBDVi",
      joinDate: "Dec 3, 2023",
      status: 'active',
      nftsMinted: 8,
      contentReported: 1
    },
    {
      id: "user3",
      username: "Web3Enthusiast",
      email: "web3@example.com",
      walletAddress: "CS4hB1UVh7LS3DqGpeJUCR6PhQQRSiHGNgMkZMSJwKPu",
      joinDate: "Jan 8, 2024",
      status: 'pending',
      nftsMinted: 0,
      contentReported: 0
    },
    {
      id: "user4",
      username: "ReportedUser",
      email: "reported@example.com",
      walletAddress: "6ZvxZ5fDJpUELYrWqP4XgJcjV3R8xT9cxSVK9YAJZjNY",
      joinDate: "Oct 12, 2023",
      status: 'suspended',
      nftsMinted: 3,
      contentReported: 4
    }
  ];
  
  const nfts: NFT[] = [
    {
      id: "nft1",
      name: "Viral Web3 Insights",
      creator: "CryptoInfluencer",
      mintDate: "Nov 15, 2023",
      status: 'active',
      contentType: "Tweet",
      platform: "Twitter"
    },
    {
      id: "nft2",
      name: "Solana Ecosystem Thread",
      creator: "NFTCreator",
      mintDate: "Dec 3, 2023",
      status: 'active',
      contentType: "Thread",
      platform: "Twitter"
    },
    {
      id: "nft3",
      name: "Inappropriate Content",
      creator: "ReportedUser",
      mintDate: "Oct 15, 2023",
      status: 'flagged',
      contentType: "Tweet",
      platform: "Twitter"
    },
    {
      id: "nft4",
      name: "Violation of Terms",
      creator: "ReportedUser",
      mintDate: "Nov 5, 2023",
      status: 'removed',
      contentType: "Tweet",
      platform: "Twitter"
    }
  ];
  
  const systemMetrics: SystemMetric[] = [
    {
      name: "Active Users",
      value: 1253,
      change: 14.2,
      icon: <Users className="w-5 h-5" />,
      color: "text-cyan-400"
    },
    {
      name: "NFTs Minted",
      value: 3482,
      change: 23.8,
      icon: <BarChart2 className="w-5 h-5" />,
      color: "text-purple-400"
    },
    {
      name: "API Limit Usage",
      value: 42.7,
      change: -3.5,
      icon: <Zap className="w-5 h-5" />,
      color: "text-green-400"
    },
    {
      name: "System Health",
      value: 99.98,
      change: 0.02,
      icon: <CheckCircle className="w-5 h-5" />,
      color: "text-green-400"
    }
  ];
  
  const recentAlerts = [
    {
      id: "alert1",
      type: "warning",
      title: "API Rate Limit Warning",
      description: "Twitter API rate limit at 85% capacity",
      time: "45 minutes ago",
      icon: <AlertCircle className="w-5 h-5 text-yellow-400" />
    },
    {
      id: "alert2",
      type: "error",
      title: "Content Reported",
      description: "3 posts reported by users for review",
      time: "2 hours ago",
      icon: <Flag className="w-5 h-5 text-red-400" />
    },
    {
      id: "alert3",
      type: "info",
      title: "System Update",
      description: "Scheduled maintenance in 3 days",
      time: "5 hours ago",
      icon: <Info className="w-5 h-5 text-blue-400" />
    }
  ];
  
  // Simulated API call to refresh data
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Starry background with reduced opacity for admin interface */}
      <StarryBackground starCount={120} className="opacity-60" />
      
      {/* Header */}
      <header className="relative z-10 px-6 py-4 flex justify-between items-center border-b border-gray-800/30 backdrop-blur-sm">
        <Link href="/" className="flex items-center">
          <h1 className="text-3xl font-bold">
            <span className="text-cyan-400">SOL</span>
            <span className="text-purple-400">SPACE</span>
          </h1>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/feed" className="text-gray-300 hover:text-cyan-400 transition-colors">
            Dashboard
          </Link>
          <Link href="/solarium" className="text-gray-300 hover:text-purple-400 transition-colors">
            SOLarium
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline-glow" size="sm" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
            <ShieldAlert className="w-4 h-4 mr-2" />
            Admin Mode
          </Button>
          
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium shadow-lg shadow-cyan-500/20 flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Wallet Connected
          </Button>
        </div>
      </header>
      
      {/* Admin Dashboard Layout */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Admin Dashboard Header */}
        <div 
          className={`mb-6 transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <Card className="glass-card backdrop-blur-md border-red-900/20 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-gray-900/50 to-transparent"></div>
            
            <CardContent className="relative z-10 p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    <span className="bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">Admin Dashboard</span>
                  </h1>
                  <p className="text-gray-400 mt-1">System status and management</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-gray-700"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                  >
                    <RefreshCcw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-gray-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  
                  <Button 
                    variant="outline-glow" 
                    size="sm" 
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Admin Dashboard Navigation */}
        <div 
          className={`mb-6 transition-all duration-1000 delay-100 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 bg-gray-900/50 p-1 mb-6">
              <TabsTrigger 
                value="overview"
                className="text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white"
              >
                Users
              </TabsTrigger>
              <TabsTrigger 
                value="content" 
                className="text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white"
              >
                Content
              </TabsTrigger>
              <TabsTrigger 
                value="system" 
                className="text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white"
              >
                System
              </TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {systemMetrics.map((metric, index) => (
                  <Card 
                    key={index} 
                    className="glass-card backdrop-blur-md border-gray-700/50 shadow-xl relative overflow-hidden hover-lift"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-transparent"></div>
                    
                    <CardContent className="relative z-10 p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-400">{metric.name}</p>
                          <p className="text-3xl font-bold text-white mt-1">
                            {typeof metric.value === 'number' && metric.name.includes('Percentage') 
                              ? `${metric.value}%` 
                              : metric.value.toLocaleString()}
                          </p>
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${metric.color.replace('text-', 'bg-').replace('400', '500/20')}`}>
                          <span className={metric.color}>{metric.icon}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className={`text-xs flex items-center ${
                          metric.change > 0 ? 'text-green-400' : metric.change < 0 ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {metric.change > 0 ? (
                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                          ) : metric.change < 0 ? (
                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          )}
                          {Math.abs(metric.change)}% from last month
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Recent Alerts */}
              <Card className="glass-card backdrop-blur-md border-gray-700/50 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 to-transparent"></div>
                
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                    Recent Alerts
                  </CardTitle>
                  <CardDescription>
                    System notifications and warnings
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="relative z-10 space-y-4">
                  {recentAlerts.map(alert => (
                    <div 
                      key={alert.id}
                      className={`p-4 rounded-lg border flex items-start gap-3 ${
                        alert.type === 'error' 
                          ? 'bg-red-900/20 border-red-900/40' 
                          : alert.type === 'warning'
                            ? 'bg-yellow-900/20 border-yellow-900/40'
                            : 'bg-blue-900/20 border-blue-900/40'
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {alert.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{alert.title}</h4>
                        <p className="text-gray-300 text-sm mt-1">{alert.description}</p>
                        <div className="flex items-center mt-2 text-xs text-gray-400">
                          <Clock className="w-3 h-3 mr-1" />
                          {alert.time}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="shrink-0 h-8 px-2 border-gray-700 hover:bg-gray-800">
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
                
                <CardFooter className="relative z-10 border-t border-gray-800 bg-gray-900/30">
                  <Button variant="outline" size="sm" className="ml-auto border-gray-700 text-gray-400 hover:text-white">
                    View All Alerts
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User Activity */}
                <Card className="glass-card backdrop-blur-md border-gray-700/50 shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-gray-800/30 to-transparent"></div>
                  
                  <CardHeader className="relative z-10 pb-2">
                    <CardTitle className="text-lg">User Activity</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="relative z-10 pt-0">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">New Users (30d)</span>
                          <span className="text-white">145</span>
                        </div>
                        <Progress value={72.5} className="h-1.5 bg-gray-800" />
                        <p className="text-xs text-green-400 mt-1">+12% vs. last month</p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Active Users (DAU)</span>
                          <span className="text-white">842</span>
                        </div>
                        <Progress value={68} className="h-1.5 bg-gray-800" />
                        <p className="text-xs text-yellow-400 mt-1">-3% vs. last month</p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Retention Rate</span>
                          <span className="text-white">65.4%</span>
                        </div>
                        <Progress value={65.4} className="h-1.5 bg-gray-800" />
                        <p className="text-xs text-green-400 mt-1">+5.2% vs. last month</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Content Stats */}
                <Card className="glass-card backdrop-blur-md border-gray-700/50 shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-gray-800/30 to-transparent"></div>
                  
                  <CardHeader className="relative z-10 pb-2">
                    <CardTitle className="text-lg">Content Stats</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="relative z-10 pt-0">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Posts Created (30d)</span>
                          <span className="text-white">3,542</span>
                        </div>
                        <Progress value={82} className="h-1.5 bg-gray-800" />
                        <p className="text-xs text-green-400 mt-1">+18% vs. last month</p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">NFTs Minted (30d)</span>
                          <span className="text-white">427</span>
                        </div>
                        <Progress value={78} className="h-1.5 bg-gray-800" />
                        <p className="text-xs text-green-400 mt-1">+24% vs. last month</p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Content Reported</span>
                          <span className="text-white">12</span>
                        </div>
                        <Progress value={12} className="h-1.5 bg-gray-800" />
                        <p className="text-xs text-red-400 mt-1">+8 vs. last month</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* System Health */}
                <Card className="glass-card backdrop-blur-md border-gray-700/50 shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-gray-800/30 to-transparent"></div>
                  
                  <CardHeader className="relative z-10 pb-2">
                    <CardTitle className="text-lg">System Health</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="relative z-10 pt-0">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">API Uptime</span>
                          <span className="text-white">99.98%</span>
                        </div>
                        <Progress value={99.98} className="h-1.5 bg-gray-800" />
                        <p className="text-xs text-green-400 mt-1">+0.02% vs. last month</p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Database Load</span>
                          <span className="text-white">42.7%</span>
                        </div>
                        <Progress value={42.7} className="h-1.5 bg-gray-800" />
                        <p className="text-xs text-green-400 mt-1">-3.5% vs. last month</p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Storage Used</span>
                          <span className="text-white">586 GB</span>
                        </div>
                        <Progress value={58.6} className="h-1.5 bg-gray-800" />
                        <p className="text-xs text-yellow-400 mt-1">+8.2% vs. last month</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              {/* User Management */}
              <Card className="glass-card backdrop-blur-md border-gray-700/50 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-gray-800/30 to-transparent"></div>
                
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-cyan-500 mr-2" />
                      User Management
                    </div>
                    <Button variant="outline" size="sm" className="h-8 border-gray-700">
                      <Plus className="w-3 h-3 mr-1" />
                      Add User
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Manage platform users and permissions
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        placeholder="Search users..." 
                        className="pl-9 bg-gray-800/50 border-gray-700"
                      />
                    </div>
                    <Button variant="outline" size="sm" className="h-10 border-gray-700">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                  
                  {/* Users Table */}
                  <div className="rounded-lg border border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-800">
                        <thead className="bg-gray-900">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                              User
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                              Wallet
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                              Joined
                            </th>
                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-gray-900/50 divide-y divide-gray-800">
                          {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center text-cyan-400">
                                    <User className="h-4 w-4" />
                                  </div>
                                  <div className="ml-3">
                                    <div className="text-sm font-medium text-white">{user.username}</div>
                                    <div className="text-xs text-gray-400">{user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  user.status === 'active' 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : user.status === 'pending'
                                      ? 'bg-yellow-500/20 text-yellow-400'
                                      : 'bg-red-500/20 text-red-400'
                                }`}>
                                  {user.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                                  {user.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                                  {user.status === 'suspended' && <XCircle className="w-3 h-3 mr-1" />}
                                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                {user.walletAddress.slice(0, 4)}...{user.walletAddress.slice(-4)}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                {user.joinDate}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <Button variant="outline" size="sm" className="h-7 w-7 p-0 border-gray-700">
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button variant="outline" size="sm" className="h-7 w-7 p-0 border-gray-700">
                                    <Settings className="h-3 w-3" />
                                  </Button>
                                  {user.status !== 'suspended' ? (
                                    <Button variant="outline" size="sm" className="h-7 w-7 p-0 border-red-700 text-red-400 hover:bg-red-900/30">
                                      <XCircle className="h-3 w-3" />
                                    </Button>
                                  ) : (
                                    <Button variant="outline" size="sm" className="h-7 w-7 p-0 border-green-700 text-green-400 hover:bg-green-900/30">
                                      <CheckCircle className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="relative z-10 border-t border-gray-800 bg-gray-900/30">
                  <div className="flex items-center justify-between w-full">
                    <p className="text-sm text-gray-400">
                      Showing <span className="font-medium text-white">4</span> of <span className="font-medium text-white">1,253</span> users
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="h-8 border-gray-700" disabled>
                        Previous
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 border-gray-700">
                        Next
                      </Button>
                    </div>
                  </div>
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
                    Manage NFTs and content moderation
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
                    <Button variant="outline" size="sm" className="h-10 border-gray-700">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                  
                  {/* Content Table */}
                  <div className="rounded-lg border border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-800">
                        <thead className="bg-gray-900">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                              Content
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                              Creator
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                              Platform
                            </th>
                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-gray-900/50 divide-y divide-gray-800">
                          {nfts.map(nft => (
                            <tr key={nft.id} className="hover:bg-gray-800/50 transition-colors">
                              <td className="px-4 py-3">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-md bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center text-cyan-400">
                                    <Zap className="h-4 w-4" />
                                  </div>
                                  <div className="ml-3">
                                    <div className="text-sm font-medium text-white">{nft.name}</div>
                                    <div className="text-xs text-gray-400">{nft.mintDate}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  nft.status === 'active' 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : nft.status === 'flagged'
                                      ? 'bg-yellow-500/20 text-yellow-400'
                                      : 'bg-red-500/20 text-red-400'
                                }`}>
                                  {nft.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                                  {nft.status === 'flagged' && <Flag className="w-3 h-3 mr-1" />}
                                  {nft.status === 'removed' && <XCircle className="w-3 h-3 mr-1" />}
                                  {nft.status.charAt(0).toUpperCase() + nft.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                {nft.creator}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                {nft.platform}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <Button variant="outline" size="sm" className="h-7 w-7 p-0 border-gray-700">
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  {nft.status === 'flagged' && (
                                    <>
                                      <Button variant="outline" size="sm" className="h-7 w-7 p-0 border-green-700 text-green-400 hover:bg-green-900/30">
                                        <CheckCircle className="h-3 w-3" />
                                      </Button>
                                      <Button variant="outline" size="sm" className="h-7 w-7 p-0 border-red-700 text-red-400 hover:bg-red-900/30">
                                        <XCircle className="h-3 w-3" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="relative z-10 border-t border-gray-800 bg-gray-900/30">
                  <div className="flex items-center justify-between w-full">
                    <p className="text-sm text-gray-400">
                      Showing <span className="font-medium text-white">4</span> of <span className="font-medium text-white">3,482</span> items
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="h-8 border-gray-700" disabled>
                        Previous
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 border-gray-700">
                        Next
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* System Tab */}
            <TabsContent value="system" className="space-y-6">
              {/* System Settings */}
              <Card className="glass-card backdrop-blur-md border-gray-700/50 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 via-gray-800/30 to-transparent"></div>
                
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 text-gray-400 mr-2" />
                    System Configuration
                  </CardTitle>
                  <CardDescription>
                    Manage system settings and configuration
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <div className="space-y-1 mb-6">
                    <h3 className="text-lg font-medium text-white">API Configuration</h3>
                    <p className="text-sm text-gray-400">Manage API rate limits and external service connections</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-white">Twitter API</h4>
                          <p className="text-xs text-gray-400 mt-0.5">Manage Twitter API connection and rate limits</p>
                        </div>
                        <div className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                          Connected
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">API Usage</span>
                          <span className="text-white">85%</span>
                        </div>
                        <Progress value={85} className="h-1.5 bg-gray-700" />
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Rate Limit: 5,000/15min</span>
                          <span className="text-yellow-400">Warning Threshold</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-gray-700">
                          <Settings className="h-4 w-4 mr-1" />
                          Configure
                        </Button>
                        <Button variant="outline" size="sm" className="border-gray-700">
                          <RefreshCcw className="h-4 w-4 mr-1" />
                          Reset
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-white">Solana Connection</h4>
                          <p className="text-xs text-gray-400 mt-0.5">Manage Solana blockchain connection settings</p>
                        </div>
                        <div className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                          Connected
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Network</span>
                          <span className="text-white">Mainnet</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">RPC Endpoint</span>
                          <span className="text-white">api.mainnet-beta.solana.com</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Status</span>
                          <span className="text-green-400">Healthy</span>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm" className="border-gray-700">
                        <Settings className="h-4 w-4 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-1 mb-6">
                    <h3 className="text-lg font-medium text-white">System Maintenance</h3>
                    <p className="text-sm text-gray-400">Manage system updates and maintenance</p>
                  </div>
                  
                  <div className="p-4 bg-yellow-900/10 rounded-lg border border-yellow-900/30 flex gap-4 items-start mb-6">
                    <div className="shrink-0">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">Scheduled Maintenance</h4>
                      <p className="text-sm text-gray-300 mt-1">System maintenance scheduled for March 2, 2025 at 02:00 UTC. Expected downtime: 2 hours.</p>
                      <div className="mt-3 flex gap-2">
                        <Button variant="outline" size="sm" className="border-gray-700">
                          Edit Schedule
                        </Button>
                        <Button variant="outline" size="sm" className="border-red-700 text-red-400 hover:bg-red-900/30">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Help & Support */}
              <Card className="glass-card backdrop-blur-md border-gray-700/50 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-gray-800/30 to-transparent"></div>
                
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center">
                    <HelpCircle className="w-5 h-5 text-blue-400 mr-2" />
                    Help & Support
                  </CardTitle>
                  <CardDescription>
                    Access documentation and support resources
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-gray-800/30 border-gray-700 hover:bg-gray-800/50 transition-colors">
                      <CardContent className="p-4 flex gap-3 items-start">
                        <div className="p-2 rounded-lg bg-gray-800/50">
                          <svg className="h-5 w-5 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium text-white">Documentation</h4>
                          <p className="text-xs text-gray-400 mt-0.5">View developer and admin documentation</p>
                          <Button variant="outline" size="sm" className="mt-2 h-7 border-gray-700 text-xs">
                            View Docs
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800/30 border-gray-700 hover:bg-gray-800/50 transition-colors">
                      <CardContent className="p-4 flex gap-3 items-start">
                        <div className="p-2 rounded-lg bg-gray-800/50">
                          <svg className="h-5 w-5 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 18l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium text-white">Technical Support</h4>
                          <p className="text-xs text-gray-400 mt-1">Get help from our engineering team</p>
                          <Button variant="outline" size="sm" className="mt-2 h-7 border-gray-700 text-xs">
                            Contact Support
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
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
