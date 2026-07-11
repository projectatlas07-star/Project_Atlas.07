import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/server-auth';

// GET /api/demo/status - Get demo status
export async function GET(request: NextRequest) {
  try {
    const context = await requireAuth();

    return NextResponse.json({
      status: 'active',
      userId: context.userId,
      companyId: context.companyId,
      message: 'Demo environment is active',
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Demo status GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch demo status' }, { status: 500 });
  }
}