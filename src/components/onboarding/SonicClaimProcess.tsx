import React, { useState, useEffect } from 'react';
import { useWallet } from '@/context/WalletProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Info, ArrowRight, Check, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import SonicWalletButton from '@/components/wallet/SonicWalletButton';
import { SONIC_CONFIG } from '@/config/sonic.config';

enum ClaimStep {
  CONNECT_WALLET = 0,
  VERIFY_OWNERSHIP = 1,
  CLAIM_SUCCESS = 2
}

interface SonicClaimProcessProps {
  nftAddress: string;
  contentUrl?: string;
  contentPreview?: string;
  tier?: number;
}

const SonicClaimProcess: React.FC<SonicClaimProcessProps> = ({ 
  nftAddress, 
  contentUrl = '', 
  contentPreview = '',
  tier = 1
}) => {
  const { connected, walletAddress } = useWallet();
  const [currentStep, setCurrentStep] = useState<ClaimStep>(
    connected ? ClaimStep.VERIFY_OWNERSHIP : ClaimStep.CONNECT_WALLET
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Effect to update step when wallet connects
  useEffect(() => {
    if (connected && currentStep === ClaimStep.CONNECT_WALLET) {
      setCurrentStep(ClaimStep.VERIFY_OWNERSHIP);
    }
  }, [connected, currentStep]);
  
  const handleVerifyAndClaim = async () => {
    setError(null);
    setIsVerifying(true);
    
    try {
      // For MVP, simulate network communication
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsVerifying(false);
      setIsClaiming(true);
      
      // Simulate claim process
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsClaiming(false);
      setCurrentStep(ClaimStep.CLAIM_SUCCESS);
    } catch (err) {
      setError('Failed to verify or claim your NFT. Please try again.');
      setIsVerifying(false);
      setIsClaiming(false);
    }
  };
  
  const getTierInfo = () => {
    return {
      name: SONIC_CONFIG.TIERS[tier]?.NAME || 'Unknown',
      image: SONIC_CONFIG.TIERS[tier]?.IMAGE || '',
      description: SONIC_CONFIG.TIERS[tier]?.DESCRIPTION || ''
    };
  };
  
  const tierInfo = getTierInfo();
  
  return (
    <div className="max-w-md mx-auto">
      <Card className="border-gray-800 bg-gray-900/60 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-2xl bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Claim Your Viral Content on SONIC
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Your viral content has been preserved as an NFT on the SONIC network
          </CardDescription>
        </CardHeader>
        
        {/* Progress steps */}
        <div className="px-6 pb-4">
          <div className="relative flex items-center justify-between">
            <div className="z-10 flex flex-col items-center">
              <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                currentStep >= ClaimStep.CONNECT_WALLET 
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' 
                  : 'bg-gray-800 border-gray-700 text-gray-500'
              }`}>
                {currentStep > ClaimStep.CONNECT_WALLET ? <Check className="w-5 h-5" /> : '1'}
              </div>
              <span className="mt-1 text-xs text-gray-400">Connect</span>
            </div>
            
            <div className="z-10 flex flex-col items-center">
              <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                currentStep >= ClaimStep.VERIFY_OWNERSHIP 
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' 
                  : 'bg-gray-800 border-gray-700 text-gray-500'
              }`}>
                {currentStep > ClaimStep.VERIFY_OWNERSHIP ? <Check className="w-5 h-5" /> : '2'}
              </div>
              <span className="mt-1 text-xs text-gray-400">Verify</span>
            </div>
            
            <div className="z-10 flex flex-col items-center">
              <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                currentStep >= ClaimStep.CLAIM_SUCCESS 
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' 
                  : 'bg-gray-800 border-gray-700 text-gray-500'
              }`}>
                {currentStep > ClaimStep.CLAIM_SUCCESS ? <Check className="w-5 h-5" /> : '3'}
              </div>
              <span className="mt-1 text-xs text-gray-400">Success</span>
            </div>
            
            {/* Progress line */}
            <div className="absolute left-0 top-5 h-0.5 w-full bg-gray-700">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
                style={{ width: `${(currentStep / 2) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <CardContent>
          {currentStep === ClaimStep.CONNECT_WALLET && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                <h3 className="font-medium mb-2 flex items-center">
                  <Info className="w-4 h-4 mr-2 text-cyan-400" />
                  Connect your SONIC wallet
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Connect your wallet to verify ownership and claim your viral content NFT.
                </p>
                
                <div className="flex justify-center">
                  <SonicWalletButton />
                </div>
                
                <div className="mt-4 p-3 bg-gray-800 rounded border border-gray-700 text-xs text-gray-400">
                  <p className="font-medium text-gray-300 mb-1">New to SONIC?</p>
                  <p>SONIC is a high-performance blockchain for web3 gaming and socials.</p>
                  <p className="mt-1">Supported wallets: Backpack, Nightly, OKX, Bybit</p>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === ClaimStep.VERIFY_OWNERSHIP && (
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                <div className="flex-1">
                  <h3 className="font-medium mb-1">Content NFT</h3>
                  <p className="text-xs text-gray-400 mb-2">
                    Tier {tier}: {tierInfo.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate max-w-[12rem]">
                    {nftAddress}
                  </p>
                  
                  <div className="mt-4">
                    <Button 
                      onClick={handleVerifyAndClaim}
                      disabled={isVerifying || isClaiming}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                    >
                      {isVerifying ? 'Verifying...' : 
                       isClaiming ? 'Claiming...' : 
                       'Verify & Claim'}
                    </Button>
                  </div>
                </div>
                
                  <div className="w-20 h-20 bg-gray-700 rounded-md overflow-hidden flex items-center justify-center relative">
                    <Image 
                      src={contentPreview} 
                      alt="Content preview" 
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                
                {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="p-3 bg-gray-800 rounded border border-gray-700 text-xs text-gray-400">
                <p className="font-medium text-gray-300 mb-1">What happens when you claim?</p>
                <p>Your viral content NFT will be linked to your wallet on the SONIC network.</p>
                <p className="mt-1">You&apos;ll be able to view it in your wallet and on the SONIC explorer.</p>
              </div>
            </div>
          )}
          
          {currentStep === ClaimStep.CLAIM_SUCCESS && (
            <div className="space-y-4 text-center">
              <div className="p-6 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-500/20 text-green-400 mb-4">
                  <Check className="w-8 h-8" />
                </div>
                
                <h3 className="text-xl font-medium mb-2">Successfully Claimed!</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Your viral content NFT is now linked to your wallet on the SONIC network.
                </p>
                
                <div className="w-full p-3 bg-gray-800 rounded text-left text-xs text-gray-400 border border-gray-700">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300">NFT Address:</span>
                    <span className="font-mono truncate max-w-[10rem]">{nftAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Wallet:</span>
                    <span className="font-mono">{walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}</span>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-4">
                  <Button
                    variant="outline"
                    className="border-gray-700 hover:bg-gray-800"
                    onClick={() => window.open(contentUrl, '_blank')}
                  >
                    View Original
                  </Button>
                  
                  <Button
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                    onClick={() => window.open(`${SONIC_CONFIG.NFT_VIEWER_URL}${nftAddress}`, '_blank')}
                  >
                    View on SONIC
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SonicClaimProcess;
