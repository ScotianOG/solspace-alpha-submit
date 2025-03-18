import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

enum ClaimStep {
  CONNECT_WALLET,
  VERIFY_IDENTITY,
  CLAIM_NFT,
  SUCCESS
}

interface SimpleClaimProcessProps {
  nftAddress: string;
}

const SimpleClaimProcess: React.FC<SimpleClaimProcessProps> = ({ nftAddress }) => {
  const { connected } = useWallet();
  const [currentStep, setCurrentStep] = useState<ClaimStep>(
    connected ? ClaimStep.VERIFY_IDENTITY : ClaimStep.CONNECT_WALLET
  );
  const [verificationCode, setVerificationCode] = useState('');
  
  // Effect to move to next step when wallet connects
  useEffect(() => {
    if (connected && currentStep === ClaimStep.CONNECT_WALLET) {
      setCurrentStep(ClaimStep.VERIFY_IDENTITY);
    }
  }, [connected, currentStep]);
  
  const handleVerify = async () => {
    // Simple verification for MVP
    // TODO: Implement proper verification via Twitter OAuth
    setCurrentStep(ClaimStep.CLAIM_NFT);
  };
  
  const handleClaim = async () => {
    try {
      // Call claim function on smart contract
      // ...
      setCurrentStep(ClaimStep.SUCCESS);
    } catch (error) {
      console.error("Error claiming NFT:", error);
      // Show error message
    }
  };
  
  return (
    <div className="claim-container">
      <h2>Claim Your Viral Content NFT</h2>
      
      {/* Progress indicator */}
      <div className="step-indicator">
        {[ClaimStep.CONNECT_WALLET, ClaimStep.VERIFY_IDENTITY, 
          ClaimStep.CLAIM_NFT, ClaimStep.SUCCESS].map((step, index) => (
          <div 
            key={index}
            className={`step ${currentStep >= step ? 'active' : ''} 
                       ${currentStep > step ? 'completed' : ''}`}
          >
            Step {index + 1}
          </div>
        ))}
      </div>
      
      {/* Step content */}
      <div className="step-content">
        {currentStep === ClaimStep.CONNECT_WALLET && (
          <div className="connect-wallet-step">
            <p>Connect your wallet to claim your NFT</p>
            <p className="helper-text">
              New to crypto? Don&apos;t worry! Click the button below and follow the instructions to create a wallet.
            </p>
            <WalletMultiButton />
          </div>
        )}
        
        {currentStep === ClaimStep.VERIFY_IDENTITY && (
          <div className="verify-step">
            <p>Verify you&apos;re the creator of this content</p>
            <p className="helper-text">
              For the MVP, enter any verification code. In production, we&apos;ll use Twitter OAuth.
            </p>
            <input
              type="text"
              placeholder="Verification Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <button 
              className="primary-button"
              onClick={handleVerify}
            >
              Verify Identity
            </button>
          </div>
        )}
        
        {currentStep === ClaimStep.CLAIM_NFT && (
          <div className="claim-step">
            <p>You&apos;re verified! Claim your NFT now</p>
            <div className="nft-preview">
              {/* NFT preview content */}
            </div>
            <button 
              className="primary-button"
              onClick={handleClaim}
            >
              Claim NFT
            </button>
          </div>
        )}
        
        {currentStep === ClaimStep.SUCCESS && (
          <div className="success-step">
            <div className="success-icon">🎉</div>
            <h3>Congratulations!</h3>
            <p>Your viral content NFT has been claimed and is now in your wallet</p>
            <button className="secondary-button">
              View in Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleClaimProcess;
