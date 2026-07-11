import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/server-auth';

// GET /api/intelligence/health - Get intelligence service health
export async function GET(request: NextRequest) {
  try {
    const context = await requireAuth();

    // TODO: Implement actual intelligence service health checks
    // For now, return a basic health status
    return NextResponse.json({
      status: 'healthy',
      services: {
        ai: 'configured',
        analytics: 'available',
        recommendations: 'available',
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Intelligence health GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch intelligence health' }, { status: 500 });
  }
}