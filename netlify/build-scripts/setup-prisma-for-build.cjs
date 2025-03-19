/**
 * This script sets up Prisma for Netlify builds by creating a temporary
 * schema.prisma file that uses SQLite instead of PostgreSQL.
 * 
 * This is necessary because we don't need an actual database for the build process,
 * we just need to generate the Prisma client.
 */

const fs = require('fs');
const path = require('path');

// Path to the schema file
const schemaPath = path.join(__dirname, '../../prisma/schema.prisma');
const originalSchemaPath = path.join(__dirname, '../../prisma/schema.prisma.original');

// Check if we already backed up the original schema
if (!fs.existsSync(originalSchemaPath)) {
  console.log('Backing up original Prisma schema...');
  fs.copyFileSync(schemaPath, originalSchemaPath);
}

// Read the original schema
const originalSchema = fs.readFileSync(
  fs.existsSync(originalSchemaPath) ? originalSchemaPath : schemaPath,
  'utf8'
);

// Replace PostgreSQL with SQLite for build
const buildSchema = originalSchema.replace(
  'datasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}',
  'datasource db {\n  provider = "sqlite"\n  url      = "file:./dev.db"\n}'
);

// Write the modified schema for the build
console.log('Writing SQLite-based schema for build...');
fs.writeFileSync(schemaPath, buildSchema);

console.log('Prisma schema modified successfully for Netlify build.');
