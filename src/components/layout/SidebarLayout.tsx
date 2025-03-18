// src/components/layout/SidebarLayout.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { createRoot } from "react-dom/client";
import LoginModal from "@/components/auth/LoginModal";
import { useApp } from "@/context/AppContext";
import {
  Wallet,
  Home,
  TrendingUp,
  FileCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  BarChart2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  divider?: boolean;
  external?: boolean;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { userType, isAuthenticated, login, logout } = useApp();

  const menuItems: MenuItem[] =
    userType === "admin"
      ? [
          {
            icon: <BarChart2 className="w-5 h-5" />,
            label: "Admin Dashboard",
            href: "/internal/admin-dashboard",
          },
          {
            icon: <TrendingUp className="w-5 h-5" />,
            label: "Viral Dashboard",
            href: "/internal/viral-dashboard",
          },
        ]
      : [
          {
            icon: <User className="w-5 h-5" />,
            label: "Profile",
            href: "/internal/profile",
          },
          {
            icon: <TrendingUp className="w-5 h-5" />,
            label: "Feed",
            href: "/internal/feed",
          },
          {
            icon: <FileCheck className="w-5 h-5" />,
            label: "Claim NFT",
            href: "/internal/claim",
          },
          {
            icon: <BarChart2 className="w-5 h-5" />,
            label: "Content Dashboard",
            href: "/internal/content-dashboard",
          },
        ];

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === path;
    }
    return pathname?.startsWith(path);
  };

  const handleConnectWallet = () => {
    if (!isAuthenticated) {
      // Show login modal
      const loginModal = document.createElement("div");
      loginModal.id = "login-modal";
      document.body.appendChild(loginModal);

      const handleLogin = (type: "user" | "admin") => {
        login(type);
        document.body.removeChild(loginModal);
      };

      const handleClose = () => {
        document.body.removeChild(loginModal);
      };

      const modal = React.createElement(LoginModal, {
        isOpen: true,
        onClose: handleClose,
        onLogin: handleLogin,
      });

      const root = createRoot(loginModal);
      root.render(modal);
    } else {
      logout();
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <div
        className={`bg-gray-900 border-r border-gray-800 transition-all duration-300 flex flex-col ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="py-6 flex justify-center">
          {collapsed ? (
            <div className="relative w-10 h-10">
              <Image
                src="/images/soulie-head.png"
                alt="SOLess"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          ) : (
            <div className="flex items-center px-4">
              <Image
                src="/images/solspace-logo.png"
                alt="SOLspace"
                width={140}
                height={40}
                className="object-contain"
              />
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="flex-1 py-6 flex flex-col justify-between">
          <div className="space-y-1 px-3">
            {menuItems.map((item, index) => {
              if (item.divider) {
                return (
                  <div
                    key={`divider-${index}`}
                    className="border-b border-gray-800 my-4"
                  />
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href || "#"}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors relative group ${
                    isActive(item.href || "")
                      ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/20"
                      : "hover:bg-gray-800 text-gray-400 hover:text-white"
                  } ${collapsed ? "justify-center" : ""}`}
                >
                  <div
                    className={`flex items-center ${
                      collapsed ? "justify-center" : ""
                    }`}
                  >
                    {item.icon}

                    {!collapsed && <span className="ml-3">{item.label}</span>}

                    {!collapsed && item.external && (
                      <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
                    )}
                  </div>

                  {/* Tooltip for collapsed state */}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                      {item.label}
                      {item.external && " (External)"}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Soulie */}
          <div
            className={`px-3 text-center mb-6 ${
              collapsed ? "hidden" : "block"
            }`}
          >
            <div className="relative h-24 my-6">
              <Image
                src="/images/soulie-laptop.png"
                alt="Soulie"
                width={120}
                height={96}
                className="object-contain mx-auto"
              />
            </div>
          </div>
        </div>

        {/* Collapse/Expand Button */}
        <div className="p-4 flex justify-center">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="relative z-10 px-6 py-4 flex justify-between items-center border-b border-gray-800/30 backdrop-blur-sm">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SONIC</span>
              <span className="text-purple-400">SPACE</span>
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => window.open("https://solswap.soless.fi", "_blank")}
              className="text-gray-300 hover:text-cyan-400 transition-colors"
            >
              SOLess Swap
            </button>
            <button
              onClick={() =>
                window.open("https://solarium.soless.fi", "_blank")
              }
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              SOLarium
            </button>
          </div>

          <Button
            onClick={handleConnectWallet}
            variant={isAuthenticated ? "outline" : "default"}
            className={`flex items-center gap-2 ${
              isAuthenticated
                ? "border-cyan-500 text-cyan-400"
                : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium shadow-lg shadow-cyan-500/20"
            }`}
          >
            <Wallet className="w-4 h-4" />
            {isAuthenticated ? "0x1234...5678" : "Connect Wallet"}
          </Button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6 bg-gradient-to-b from-gray-950 to-gray-900 scroll-smooth">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
