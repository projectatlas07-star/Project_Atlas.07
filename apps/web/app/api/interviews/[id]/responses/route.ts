import { NextRequest, NextResponse } from 'next/server';
import { db, setCompanyContext } from '@/lib/server-db';
import { interviews } from '@project-atlas/database';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/server-auth';
import { z } from 'zod';

const responsesUpdateSchema = z.object({
  responses: z.record(z.any()),
});

// PUT /api/interviews/[id]/responses - Update interview responses
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await requireAuth();
    await setCompanyContext(context.companyId);
    const { id } = await params;

    const body = await request.json();
    const validated = responsesUpdateSchema.parse(body);

    const [updatedInterview] = await db
      .update(interviews)
      .set({
        responses: validated.responses,
        updatedBy: context.userId,
        updatedAt: new Date(),
      })
      .where(eq(interviews.id, id))
      .returning();

    if (!updatedInterview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    return NextResponse.json({ responses: updatedInterview.responses });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    console.error('Interview responses PUT error:', error);
    return NextResponse.json({ error: 'Failed to update interview responses' }, { status: 500 });
  }
}