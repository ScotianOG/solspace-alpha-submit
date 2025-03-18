"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, Mail, AtSign, Wallet } from "lucide-react";
import StarryBackground from "@/components/StarryBackground";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    handle: '',
    bio: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here you would typically make an API call to create the user
      // For now, we'll simulate a delay and redirect
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push('/internal/profile');
    } catch (error) {
      console.error('Error creating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <StarryBackground starCount={150} className="opacity-70" />
      
      <div className="relative z-10 w-full max-w-lg px-4">
        <Card className="glass-card backdrop-blur-md border-gray-700/50 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-transparent"></div>
          
          <CardHeader className="relative z-10 text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Create Your SOLspace Profile
            </CardTitle>
            <CardDescription>
              Join the decentralized social media revolution
            </CardDescription>
          </CardHeader>
          
          <CardContent className="relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="pl-10 bg-gray-800 border-gray-700 focus:border-cyan-500/50"
                    />
                  </div>
                </div>
                
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10 bg-gray-800 border-gray-700 focus:border-cyan-500/50"
                    />
                  </div>
                </div>
                
                <div>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Social Handle"
                      value={formData.handle}
                      onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                      className="pl-10 bg-gray-800 border-gray-700 focus:border-cyan-500/50"
                    />
                  </div>
                </div>
                
                <div>
                  <textarea
                    placeholder="Bio (optional)"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full h-24 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-500/50 focus:outline-none text-white placeholder-gray-400 resize-none"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-50 rounded-full border-t-transparent mr-2"></div>
                      Creating Profile...
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-2 h-4 w-4" />
                      Create Profile
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
