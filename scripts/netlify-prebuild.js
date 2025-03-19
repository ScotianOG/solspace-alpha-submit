/**
 * This script is executed before the build on Netlify
 * It ensures all prerequisites are met for a successful build.
 */

// Patches for known issues

// 1. Create an empty dev.db file for SQLite
const fs = require('fs');
const path = require('path');

// Create prisma directory if it doesn't exist
const prismaDir = path.join(process.cwd(), 'prisma');
if (!fs.existsSync(prismaDir)) {
  fs.mkdirSync(prismaDir, { recursive: true });
}

// Touch an empty dev.db file
fs.writeFileSync(path.join(prismaDir, 'dev.db'), '');
console.log('Created empty dev.db file for SQLite');

// 2. Ensure the node_modules/.prisma directory exists
const prismaBinDir = path.join(process.cwd(), 'node_modules', '.prisma');
if (!fs.existsSync(prismaBinDir)) {
  fs.mkdirSync(prismaBinDir, { recursive: true });
}

// 3. Set environment variables that might be needed
process.env.DATABASE_URL = 'file:./prisma/dev.db';
process.env.NETLIFY = 'true';
process.env.NODE_ENV = 'production';

console.log('Netlify prebuild script complete');
