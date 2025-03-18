#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

/**
 * This script fixes the program ID configuration to use the correct
 * program ID (9C2HRbrbvf3baZ8vXhQgiDjJRU1K6JoxUSBhpQsuPW3) instead of the wallet address.
 */
async function fixProgramId() {
  console.log("=".repeat(70));
  console.log("🔧 FIXING PROGRAM ID CONFIGURATION");
  console.log("=".repeat(70));
  
  try {
    // Hard-coded correct program ID
    const CORRECT_PROGRAM_ID = "9C2HRbrbvf3baZ8vXhQgiDjJRU1K6JoxUSBhpQsuPW3";
    console.log(`Using correct program ID: ${CORRECT_PROGRAM_ID}`);
    
    // Update .env file
    console.log("\nUpdating .env file...");
    const envPath = path.join(process.cwd(), '.env');
    let envContent;
    
    try {
      envContent = fs.readFileSync(envPath, 'utf8');
      
      // Check if the current program ID is already correct
      if (envContent.includes(`PROGRAM_ID="${CORRECT_PROGRAM_ID}"`)) {
        console.log("✅ .env already has the correct program ID");
      } else {
        // Update the program ID in .env
        const updatedEnvContent = envContent.replace(
          /^PROGRAM_ID=".*"$/m,
          `PROGRAM_ID="${CORRECT_PROGRAM_ID}"`
        );
        
        fs.writeFileSync(envPath, updatedEnvContent);
        console.log(`✅ Updated .env with program ID: ${CORRECT_PROGRAM_ID}`);
      }
    } catch (err) {
      console.error(`❌ Error updating .env: ${err.message}`);
    }
    
    // Update Anchor.toml
    console.log("\nUpdating Anchor.toml...");
    const anchorTomlPath = path.join(process.cwd(), 'Anchor.toml');
    let anchorToml;
    
    try {
      anchorToml = fs.readFileSync(anchorTomlPath, 'utf8');
      
      // Check if the current program ID is already correct
      if (anchorToml.includes(`solspace = "${CORRECT_PROGRAM_ID}"`)) {
        console.log("✅ Anchor.toml already has the correct program ID");
      } else {
        // Update the program ID in Anchor.toml
        const updatedAnchorToml = anchorToml.replace(
          /^solspace = ".*"$/m,
          `solspace = "${CORRECT_PROGRAM_ID}"`
        );
        
        fs.writeFileSync(anchorTomlPath, updatedAnchorToml);
        console.log(`✅ Updated Anchor.toml with program ID: ${CORRECT_PROGRAM_ID}`);
      }
    } catch (err) {
      console.error(`❌ Error updating Anchor.toml: ${err.message}`);
    }
    
    // Update lib.rs
    console.log("\nUpdating lib.rs...");
    const libRsPath = path.join(process.cwd(), 'program', 'src', 'lib.rs');
    let libRsContent;
    
    try {
      libRsContent = fs.readFileSync(libRsPath, 'utf8');
      
      // Check if the current program ID is already correct
      if (libRsContent.includes(`declare_id!("${CORRECT_PROGRAM_ID}");`)) {
        console.log("✅ lib.rs already has the correct program ID");
      } else {
        // Update the program ID in lib.rs
        const updatedLibRsContent = libRsContent.replace(
          /declare_id!\(".*"\);/,
          `declare_id!("${CORRECT_PROGRAM_ID}");`
        );
        
        fs.writeFileSync(libRsPath, updatedLibRsContent);
        console.log(`✅ Updated lib.rs with program ID: ${CORRECT_PROGRAM_ID}`);
      }
    } catch (err) {
      console.error(`❌ Error updating lib.rs: ${err.message}`);
    }
    
    console.log("\n=".repeat(70));
    console.log(`✅ PROGRAM ID FIXED TO: ${CORRECT_PROGRAM_ID}`);
    console.log("=".repeat(70));
    console.log("\nYou can now use the final-solution.js script to mint viral posts.");
    
    return { 
      success: true,
      programId: CORRECT_PROGRAM_ID
    };
  } catch (error) {
    console.error("❌ Error fixing program ID:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run if directly executed
if (import.meta.url === `file://${process.argv[1]}`) {
  fixProgramId()
    .then(result => {
      if (!result.success) {
        process.exit(1);
      }
    })
    .catch(err => {
      console.error("Fatal error:", err);
      process.exit(1);
    });
}

export { fixProgramId };
