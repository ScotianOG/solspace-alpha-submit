// Simple script to verify free tier service mode
import { config } from 'dotenv';
import * as fs from 'fs';

// Load environment variables
config();

// Print current service mode
console.log(`Current .env configuration:`);
console.log(`NEXT_PUBLIC_SERVICE_MODE: ${process.env.NEXT_PUBLIC_SERVICE_MODE}`);
console.log(`Free tier services should be active: ${process.env.NEXT_PUBLIC_SERVICE_MODE === "free_tier"}`);

// Check for the existence of free tier implementation files
const freeTierFiles = [
  'src/services/free/FreeTierViralDetector.ts',
  'src/services/free/FreeTierNotificationService.ts'
];

console.log('\nVerifying required files:');
let allFilesExist = true;

for (const file of freeTierFiles) {
  const exists = fs.existsSync(file);
  console.log(`- ${file}: ${exists ? 'FOUND' : 'MISSING'}`);
  if (!exists) allFilesExist = false;
}

console.log(`\nDeployment status: ${allFilesExist && process.env.NEXT_PUBLIC_SERVICE_MODE === "free_tier" ? 'READY' : 'NOT READY'} for free service mode`);

if (allFilesExist && process.env.NEXT_PUBLIC_SERVICE_MODE === "free_tier") {
  console.log('\n✅ The deployment is correctly set up for free service mode!');
} else {
  console.log('\n❌ There are issues with the free service mode configuration:');
  if (process.env.NEXT_PUBLIC_SERVICE_MODE !== "free_tier") {
    console.log('   - NEXT_PUBLIC_SERVICE_MODE is not set to "free_tier"');
  }
  if (!allFilesExist) {
    console.log('   - Some required implementation files are missing');
  }
}
