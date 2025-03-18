// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import SidebarLayout from "@/components/layout/SidebarLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SOLspace - Transform Social Media Into Digital Assets",
  description: "Decentralized social media platform for preserving viral content as NFTs on Solana",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} min-h-screen`}>
        <Providers>
          {/* Exclude SidebarLayout for landing page */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
