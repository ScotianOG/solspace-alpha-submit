// src/app/internal/content-dashboard/page.tsx
"use client";

import { useRouter } from "next/navigation";
import ContentDashboard from "@/components/Dashboard/ContentDashboard";
import { useApp } from "@/context/AppContext";
import { useEffect } from "react";

export default function ContentDashboardPage() {
  const router = useRouter();
  const { userType, isAuthenticated } = useApp();

  useEffect(() => {
    const handleRouting = async () => {
      if (!isAuthenticated) {
        await router.push("/");
      } else if (userType === "admin") {
        await router.push("/internal/admin-dashboard");
      }
    };
    handleRouting();
  }, [userType, isAuthenticated, router]);

  if (!isAuthenticated || userType === "admin") {
    return null;
  }

  return <ContentDashboard />;
}
