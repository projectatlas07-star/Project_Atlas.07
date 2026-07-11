import { NextRequest, NextResponse } from 'next/server';
import { db, setCompanyContext } from '@/lib/server-db';
import { interviews, claims } from '@project-atlas/database';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/server-auth';

// POST /api/interviews/[id]/generate-claim - Generate claim from interview
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await requireAuth();
    await setCompanyContext(context.companyId);
    const { id } = await params;

    const [interview] = await db
      .select()
      .from(interviews)
      .where(eq(interviews.id, id));

    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    // TODO: Implement actual claim generation logic from interview responses
    // For now, return a placeholder response
    return NextResponse.json({
      message: 'Claim generation from interview - implementation pending',
      interviewId: id,
      claimData: null,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Interview generate-claim POST error:', error);
    return NextResponse.json({ error: 'Failed to generate claim from interview' }, { status: 500 });
  }
}