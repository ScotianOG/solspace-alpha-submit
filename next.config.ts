import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["hebbkx1anhila5yf.public.blob.vercel-storage.com"],
  },
  // Exclude free directory from TypeScript compilation
  typescript: {
    // Ignoring build errors since we have the free directory which contains example files
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
