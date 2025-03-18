import { SimpleEngagementMonitor } from "../services/simple/SimpleEngagementMonitor";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN || "";
const CHECK_HOURS_BACK = 48; // Check NFTs from the last 48 hours

/**
 * Main function to check and update engagement for recent NFTs
 */
async function main() {
  try {
    console.log("Starting engagement monitoring service...");
    
    // Initialize the engagement monitor
    const monitor = new SimpleEngagementMonitor(TWITTER_BEARER_TOKEN);
    
    // Check and update engagement for recent NFTs
    console.log(`Checking engagement for NFTs from the last ${CHECK_HOURS_BACK} hours...`);
    const updatedCount = await monitor.checkAndUpdateEngagement(CHECK_HOURS_BACK);
    
    // Log results
    if (updatedCount > 0) {
      console.log(`Successfully updated ${updatedCount} NFTs to higher tiers.`);
    } else {
      console.log("No NFTs needed tier upgrades at this time.");
    }
    
    console.log("Engagement monitoring completed successfully.");
  } catch (error) {
    console.error("Error in engagement monitoring:", error);
    process.exit(1);
  }
}

// For direct execution
// In a Node.js environment, this will be true when the file is being executed directly
if (typeof require !== 'undefined' && require.main === module) {
  main()
    .then(() => {
      console.log("Monitoring script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Fatal error in monitoring script:", error);
      process.exit(1);
    });
}

// For scheduled execution (if imported as a module)
export const runEngagementMonitoring = main;
