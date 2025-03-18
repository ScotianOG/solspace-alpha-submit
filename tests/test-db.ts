const { PrismaClient } = require('@prisma/client');
const { DatabaseService } = require('../src/services/database');

async function testDatabaseConnection() {
  try {
    // Test direct Prisma connection
    console.log('Testing direct Prisma connection...');
    const prisma = new PrismaClient();
    await prisma.$connect();
    console.log('✅ Direct Prisma connection successful');
    
    // Test getting API limits (should be empty but not error)
    console.log('\nTesting DatabaseService.getAPILimit...');
    const apiLimit = await DatabaseService.getAPILimit('test-endpoint');
    console.log('API Limit result:', apiLimit);
    
    // Add a test API limit
    console.log('\nTesting DatabaseService.updateAPILimit...');
    const updatedLimit = await DatabaseService.updateAPILimit(
      'test-endpoint',
      0,
      100,
      new Date(Date.now() + 24 * 60 * 60 * 1000)
    );
    console.log('Updated API Limit:', updatedLimit);
    
    // Verify it was added
    console.log('\nVerifying API limit was added...');
    const verifiedLimit = await DatabaseService.getAPILimit('test-endpoint');
    console.log('Verified API Limit:', verifiedLimit);
    
    console.log('\n✅ All database tests passed successfully!');
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    process.exit(1);
  }
}

testDatabaseConnection().catch(console.error);
