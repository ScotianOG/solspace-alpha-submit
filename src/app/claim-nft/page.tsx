"use client";

import BlockchainClaimFlow from "@/components/Claim/BlockchainClaimFlow";
import StarryBackground from "@/components/StarryBackground";

export default function ClaimNFTPage() {
  return (
    <div className="relative min-h-screen">
      <StarryBackground starCount={150} className="opacity-70" />
      <div className="relative z-10">
        <BlockchainClaimFlow />
      </div>
    </div>
  );
}
