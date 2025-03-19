/**
 * This script is executed before the build on Netlify
 * It ensures all prerequisites are met for a successful build.
 */

// Patches for known issues
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory with ES module support
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// 1. Create an empty dev.db file for SQLite
// Create prisma directory if it doesn't exist
const prismaDir = path.join(rootDir, 'prisma');
if (!fs.existsSync(prismaDir)) {
  fs.mkdirSync(prismaDir, { recursive: true });
}

// Touch an empty dev.db file
fs.writeFileSync(path.join(prismaDir, 'dev.db'), '');
console.log('Created empty dev.db file for SQLite');

// 2. Ensure the node_modules/.prisma directory exists
const prismaBinDir = path.join(rootDir, 'node_modules', '.prisma');
if (!fs.existsSync(prismaBinDir)) {
  fs.mkdirSync(prismaBinDir, { recursive: true });
}

// 3. Set environment variables that might be needed
process.env.DATABASE_URL = 'file:./prisma/dev.db';
process.env.NETLIFY = 'true';
process.env.NODE_ENV = 'production';

console.log('Netlify prebuild script complete');
