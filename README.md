# SOLspace - Viral Content NFT Platform for SONIC

SOLspace automatically detects viral social media posts and mints them as NFTs on the SONIC blockchain, allowing creators to claim ownership of their viral content.

## Key Features

- 🔍 Automated viral post detection using AI-enhanced algorithms
- 🎨 Dynamic NFT generation with tier-based designs (Rising, Trending, Viral)
- 🔄 Fully automated minting process on SONIC blockchain
- ✅ Creator verification via Twitter
- 💼 Secure wallet integration and signature verification
- 📊 Real-time monitoring and analytics dashboard

## Technology Stack

- **Frontend**: Next.js, TypeScript, TailwindCSS
- **Backend**: Node.js, Prisma ORM, PostgreSQL
- **Blockchain**: SONIC (Solana fork), Anchor framework
- **APIs**: Twitter API, NFT.storage

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/your-org/solspace.git
cd solspace
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. Start the development server:
```bash
npm run dev
```

5. Deploy to SONIC:
```bash
npm run deploy:sonic
```

## Architecture

The project is organized into service modules that can operate in different modes:

- **Enhanced Mode**: Production-ready implementation with advanced algorithms
- **Simple Mode**: Streamlined implementation for testing
- **Free Tier Mode**: Optimized for Twitter's free API tier limits
- **Mock Mode**: Fully offline implementation for development

## Documentation

For comprehensive documentation, please refer to [SONIC-Documentation.md](./SONIC-Documentation.md).

## Grant Submission Information

This submission includes:

- Full implementation of viral content detection algorithm
- SONIC blockchain integration for NFT minting
- Multi-tier NFT design system with upgrade paths
- Creator verification and claim system
- Comprehensive architecture ready for scaling

## Contact

For questions about this submission, please contact:
- Email: contact@solspace.app
- Twitter: @solspace_app
