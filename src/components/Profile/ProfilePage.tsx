"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Calendar, Link as LinkIcon, Settings } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Banner */}
      <div className="relative h-48 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-blue-500/20">
        <Image
          src="/images/solspace-landing.jpg"
          alt="Profile Banner"
          fill
          className="object-cover opacity-50"
        />
      </div>

      {/* Profile Info */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative -mt-20 pb-4 border-b border-gray-800">
          {/* Avatar */}
          <div className="absolute bottom-12 left-4">
            <div className="w-32 h-32 rounded-full border-4 border-gray-950 overflow-hidden">
              <Image
                src="/images/soulie-blue.png"
                alt="Soulie"
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pb-4">
            <Button variant="outline" className="border-gray-700">
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          {/* Profile Details */}
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-white">Soulie</h1>
            <p className="text-gray-400">@Soulie</p>
            <p className="mt-3 text-gray-200">
              Official mascot of The SOLess System | Educator | Therapist
            </p>

            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Nova Scotia, Canada
              </div>
              <div className="flex items-center">
                <LinkIcon className="w-4 h-4 mr-1" />
                <a href="https://soless.app" className="text-cyan-400 hover:underline">soless.app</a>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Joined December 2024
              </div>
            </div>

            <div className="flex gap-6 mt-4 text-sm">
              <div>
                <span className="font-bold text-white">420</span>
                <span className="text-gray-400 ml-1">Following</span>
              </div>
              <div>
                <span className="font-bold text-white">4,200,000</span>
                <span className="text-gray-400 ml-1">Followers</span>
              </div>
              <div>
                <span className="font-bold text-white">354</span>
                <span className="text-gray-400 ml-1">NFTs Created</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800 mt-4">
          <button className="px-4 py-4 text-cyan-400 border-b-2 border-cyan-400 font-medium">
            Posts
          </button>
          <button className="px-4 py-4 text-gray-400 hover:text-gray-200 hover:bg-white/5">
            NFTs
          </button>
          <button className="px-4 py-4 text-gray-400 hover:text-gray-200 hover:bg-white/5">
            Collections
          </button>
          <button className="px-4 py-4 text-gray-400 hover:text-gray-200 hover:bg-white/5">
            Activity
          </button>
        </div>

        {/* Content */}
        <div className="py-4">
          {/* Placeholder for content */}
          <Card className="bg-gray-900/50 border-gray-800 p-4">
            <p className="text-gray-400 text-center">No posts yet</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
