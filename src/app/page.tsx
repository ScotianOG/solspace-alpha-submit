// src/app/page.tsx
"use client";

import EnhancedLandingPage from "@/components/landing/EnhancedLandingPage";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  const navigateTo = (path: string) => {
    router.push(path);
  };

  return <EnhancedLandingPage navigateTo={navigateTo} />;
}
