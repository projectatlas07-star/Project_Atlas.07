import { NextRequest, NextResponse } from 'next/server';
import { db, setCompanyContext } from '@/lib/server-db';
import { interviews } from '@project-atlas/database';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/server-auth';
import { z } from 'zod';

const interviewUpdateSchema = z.object({
  interviewNumber: z.string().min(1).optional(),
  templateId: z.string().min(1).optional(),
  templateName: z.string().min(1).optional(),
  propertyId: z.string().uuid().optional(),
  claimId: z.string().uuid().optional(),
  responses: z.record(z.any()).optional(),
  conversationHistory: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
  status: z.string().optional(),
  currentSection: z.string().optional(),
  progress: z.string().or(z.number()).optional(),
});

// GET /api/interviews/[id] - Get interview by ID
export async function GET(
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

    return NextResponse.json(interview);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Interview GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch interview' }, { status: 500 });
  }
}

// PUT /api/interviews/[id] - Update interview
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await requireAuth();
    await setCompanyContext(context.companyId);
    const { id } = await params;

    const body = await request.json();
    const validated = interviewUpdateSchema.parse(body);

    const updateData: any = {
      ...validated,
      updatedBy: context.userId,
      updatedAt: new Date(),
    };

    // Convert progress to string
    if (validated.progress) updateData.progress = String(validated.progress);

    const [updatedInterview] = await db
      .update(interviews)
      .set(updateData)
      .where(eq(interviews.id, id))
      .returning();

    if (!updatedInterview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    return NextResponse.json(updatedInterview);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    console.error('Interview PUT error:', error);
    return NextResponse.json({ error: 'Failed to update interview' }, { status: 500 });
  }
}

// DELETE /api/interviews/[id] - Delete interview
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await requireAuth();
    await setCompanyContext(context.companyId);
    const { id } = await params;

    const [deletedInterview] = await db
      .delete(interviews)
      .where(eq(interviews.id, id))
      .returning();

    if (!deletedInterview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Interview deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Interview DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete interview' }, { status: 500 });
  }
}