import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { DatabaseService } from '@/services';

export async function GET(req: NextRequest) {
  try {
    // Test direct Prisma connection
    const prisma = new PrismaClient();
    await prisma.$connect();

    // Test getting API limits
    const apiLimit = await DatabaseService.getAPILimit('test-endpoint');

    // Add a test API limit
    const updatedLimit = await DatabaseService.updateAPILimit(
      'test-endpoint',
      0,
      100,
      new Date(Date.now() + 24 * 60 * 60 * 1000)
    );

    // Verify it was added
    const verifiedLimit = await DatabaseService.getAPILimit('test-endpoint');

    await prisma.$disconnect();

    return NextResponse.json({
      status: 'success',
      message: 'Database connection test successful',
      data: {
        initialApiLimit: apiLimit,
        updatedLimit,
        verifiedLimit
      }
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        error: error instanceof Error ? error.stack : String(error)
      },
      { status: 500 }
    );
  }
}
