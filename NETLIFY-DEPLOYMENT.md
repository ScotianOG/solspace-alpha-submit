# Solspace Netlify Deployment Guide

This document provides instructions for deploying the Solspace application to Netlify.

## Prerequisites

- A Netlify account
- Git repository with your Solspace code
- Node.js v20.18.0 or higher

## Deployment Options

### Option 1: Manual Deployment via Netlify CLI

1. **Install Netlify CLI:**

```bash
npm install -g netlify-cli
```

2. **Run the deployment script:**

```bash
./netlify-deploy.sh
```

This script will:
- Create a production environment file
- Verify the build process
- Deploy to Netlify

3. **Follow the prompts to authenticate with Netlify** (if not already authenticated)

4. **Set up Custom Domain:**
   - In the Netlify dashboard, go to Site settings > Domain management
   - Add domain: `solspace-alpha.com`
   - Configure DNS settings as instructed by Netlify

### Option 2: GitHub Integration with Netlify

1. **In the Netlify Dashboard:**
   - Create a new site from Git
   - Connect to your GitHub repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`

2. **Add Environment Variables:**
   - In Netlify site settings, add the following environment variables:
     - `NEXT_PUBLIC_SOLANA_RPC_URL`: `https://api.testnet.sonic.game/`
     - `NEXT_PUBLIC_PROGRAM_ID`: `9C2HRbrbvf3baZ8vXhQgiDjJRU1K6JoxUSBhpQsuPW3`
     - `NEXT_PUBLIC_NETWORK`: `testnet`
     - `NEXT_PUBLIC_SERVICE_MODE`: `free_tier`

3. **Deploy:**
   - Netlify will automatically deploy when you push to your main branch

### Option 3: GitHub Actions Automation

We've included a GitHub Actions workflow that automatically deploys to Netlify when you push to the main branch.

1. **Set up Repository Secrets:**
   - In your GitHub repository, go to Settings > Secrets
   - Add the following secrets:
     - `NETLIFY_AUTH_TOKEN`: Your Netlify personal access token
     - `NETLIFY_SITE_ID`: Your Netlify site ID

2. **Push to main branch:**
   - The workflow will automatically build and deploy your site

## Solspace Configuration

### Integration with Solana Program

The deployed frontend connects to the Solana program running on the Sonic testnet. The frontend uses:

- Our updated Solana program with optional Counter account
- The bypass-mint-viral.js script for creating viral posts

### Test the Deployment

After deployment:

1. Visit your Netlify site URL
2. Test the UI functionality:
   - Login flow (uses mock authentication)
   - View viral posts
   - Claim NFT functionality

### Troubleshooting

- **Build Failures:** Check Netlify build logs for specific errors
- **RPC Connection Issues:** Verify the `NEXT_PUBLIC_SOLANA_RPC_URL` is accessible
- **Program Interaction:** Ensure the program ID matches the deployed Solana program

## Next Steps

1. Set up a custom domain in Netlify settings
2. Enable HTTPS
3. Configure CI/CD pipeline for test environments
4. Set up analytics and monitoring
