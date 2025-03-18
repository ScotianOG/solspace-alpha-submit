"use client";

import SOLspaceVisualization from "@/components/Visualizer/SOLspaceVisualization";
import StarryBackground from "@/components/StarryBackground";

export default function VisualizerPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <StarryBackground starCount={150} className="opacity-70" />
      <div className="relative z-10">
        <SOLspaceVisualization />
      </div>
    </div>
  );
}
