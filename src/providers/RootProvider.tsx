// src/app/providers.tsx
"use client";

import React from "react";
import { WalletProvider } from "@/context/WalletProvider";
import { AppProvider } from "@/context/AppContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <AppProvider>
        {children}
      </AppProvider>
    </WalletProvider>
  );
}