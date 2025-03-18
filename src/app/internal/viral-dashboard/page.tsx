"use client";

import { useRouter } from "next/navigation";
import ViralPostDashboard from "@/components/Dashboard/ViralPostDashboard";
import { useApp } from "@/context/AppContext";
import { useEffect } from "react";

export default function ViralDashboardPage() {
  const router = useRouter();
  const { userType, isAuthenticated } = useApp();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    } else if (userType !== "admin") {
      router.push("/internal/content-dashboard");
    }
  }, [userType, isAuthenticated, router]);

  if (!isAuthenticated || userType !== "admin") {
    return <div>Redirecting...</div>;
  }

  return <ViralPostDashboard />;
}
