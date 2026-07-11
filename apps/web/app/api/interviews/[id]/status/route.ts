import { NextRequest, NextResponse } from 'next/server';
import { db, setCompanyContext } from '@/lib/server-db';
import { interviews } from '@project-atlas/database';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/server-auth';
import { z } from 'zod';

const statusUpdateSchema = z.object({
  status: z.string(),
});

// PUT /api/interviews/[id]/status - Update interview status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await requireAuth();
    await setCompanyContext(context.companyId);
    const { id } = await params;

    const body = await request.json();
    const validated = statusUpdateSchema.parse(body);

    const [updatedInterview] = await db
      .update(interviews)
      .set({
        status: validated.status,
        updatedBy: context.userId,
        updatedAt: new Date(),
      })
      .where(eq(interviews.id, id))
      .returning();

    if (!updatedInterview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    return NextResponse.json({ status: updatedInterview.status });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    console.error('Interview status PUT error:', error);
    return NextResponse.json({ error: 'Failed to update interview status' }, { status: 500 });
  }
}