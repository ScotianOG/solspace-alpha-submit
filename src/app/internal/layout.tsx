// src/app/(internal)/layout.tsx
"use client";

import SidebarLayout from "@/components/layout/SidebarLayout";
import { usePathname } from "next/navigation";

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isVisualizer = pathname === '/internal/visualizer';

  if (isVisualizer) {
    return children;
  }

  return <SidebarLayout>{children}</SidebarLayout>;
}
