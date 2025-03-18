import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, Shield, X } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (type: "user" | "admin") => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onLogin,
}: LoginModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn">
      <Card className="glass-card backdrop-blur-md border-gray-700/50 shadow-xl relative overflow-hidden w-full max-w-md mx-4">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-transparent"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <CardContent className="relative z-10 p-6 space-y-6">
          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Choose Login Type
          </h2>

          <div className="flex flex-col gap-4">
            <Button
              onClick={() => onLogin("user")}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium h-14"
            >
              <Wallet className="w-5 h-5 mr-3" />
              User Login
            </Button>

            <Button
              onClick={() => onLogin("admin")}
              className="bg-gradient-to-r from-red-500 to-purple-500 hover:from-red-600 hover:to-purple-600 text-white font-medium h-14"
            >
              <Shield className="w-5 h-5 mr-3" />
              Admin Login
            </Button>

            <Button variant="outline" onClick={onClose} className="mt-2">
              Cancel
            </Button>
          </div>

          <div className="text-center text-xs text-gray-400 mt-4">
            <p>Demo Mode: No credentials required</p>
            <p>Select a login type to view the respective dashboard</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
