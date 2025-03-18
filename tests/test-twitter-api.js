// Simple test script to verify Twitter API credentials
import { TwitterApi } from 'twitter-api-v2';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testTwitterAPI() {
  try {
    console.log("Testing Twitter API connection...");
    
    // Get bearer token from .env
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    
    if (!bearerToken) {
      console.error("ERROR: No TWITTER_BEARER_TOKEN found in .env file");
      return;
    }
    
    console.log("Bearer token found, attempting to connect to Twitter API...");
    
    // Create a Twitter client with bearer token
    const twitterClient = new TwitterApi(bearerToken);
    
    // Try a simple API call - get Twitter API v2 instance
    const v2Client = twitterClient.v2;
    
    // Try to search for some tweets (minimal request to test authentication)
    console.log("Making a test search request...");
    const result = await v2Client.search(
      '#SONIC OR #web3', 
      { 
        'max_results': 10,
        'tweet.fields': ['created_at', 'public_metrics']
      }
    );
    
    if (result && result.data) {
      console.log("✅ Twitter API connection successful!");
      console.log(`Found ${result.data.length} tweets in test search`);
      
      // Show a sample of the results
      if (result.data.length > 0) {
        console.log("\nSample tweet:");
        const sampleTweet = result.data[0];
        console.log(`- ID: ${sampleTweet.id}`);
        console.log(`- Text: ${sampleTweet.text.substring(0, 50)}...`);
        console.log(`- Created at: ${sampleTweet.created_at}`);
        if (sampleTweet.public_metrics) {
          console.log(`- Likes: ${sampleTweet.public_metrics.like_count}`);
          console.log(`- Retweets: ${sampleTweet.public_metrics.retweet_count}`);
        }
      }
      
      console.log("\nFree tier API limitations:");
      console.log("- 1 request per 15 minutes for most endpoints");
      console.log("- 17 POST requests per 24 hours");
      console.log("- Rate limiting is implemented in FreeTierViralDetector");
    } else {
      console.log("⚠️ API call succeeded but no results returned");
    }
  } catch (error) {
    console.error("❌ Twitter API test failed:", error.message);
    
    if (error.code === 401) {
      console.error("Authentication failed - check your bearer token");
    } else if (error.code === 429) {
      console.error("Rate limit exceeded - free tier limits are very restrictive");
    } else if (error.code === 403) {
      console.error("\n===== TWITTER API ACCESS ISSUE =====");
      console.error("Your Twitter API credentials appear to be valid, but lack proper project setup or permissions.");
      
      // Check if we can get more detailed information from the error
      if (error.data) {
        console.error("\nError details from Twitter:");
        if (error.data.detail) console.error(`- Detail: ${error.data.detail}`);
        if (error.data.title) console.error(`- Title: ${error.data.title}`);
        if (error.data.reason) console.error(`- Reason: ${error.data.reason}`);
        if (error.data.required_enrollment) console.error(`- Required enrollment: ${error.data.required_enrollment}`);
        if (error.data.registration_url) console.error(`- Registration URL: ${error.data.registration_url}`);
      }
      
      console.error("\nTo fix this issue:");
      console.error("1. Go to the Twitter Developer Portal (https://developer.twitter.com/en/portal/dashboard)");
      console.error("2. Ensure your developer account is properly set up");
      console.error("3. Create a Project and add your App to it");
      console.error("4. Make sure your Project has the necessary API access level (at least 'Essential')");
      console.error("5. Generate new API keys and update your .env file");
      console.error("\nFor SOLspace free tier, you need a Twitter developer account with:");
      console.error("- A Project with at least Basic (v2) API access");
      console.error("- OAuth 2.0 Client ID and Client Secret");
      console.error("- Bearer Token with read/write permissions");
      console.error("===============================");
    }
    
    // Log rate limit information if available
    if (error.rateLimit) {
      console.error("\nRate limit information:");
      console.error(`- Limit: ${error.rateLimit.limit}`);
      console.error(`- Remaining: ${error.rateLimit.remaining}`);
      console.error(`- Reset time: ${new Date(error.rateLimit.reset * 1000).toLocaleTimeString()}`);
    }
  }
}

// Run the test
testTwitterAPI()
  .then(() => {
    console.log("Twitter API test completed.");
  })
  .catch((error) => {
    console.error("Fatal error in Twitter API test:", error);
  });
