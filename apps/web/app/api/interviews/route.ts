import { NextRequest, NextResponse } from 'next/server';
import { db, setCompanyContext } from '@/lib/server-db';
import { interviews } from '@project-atlas/database';
import { eq, desc } from 'drizzle-orm';
import { requireAuth } from '@/lib/server-auth';
import { z } from 'zod';

const interviewSchema = z.object({
  interviewNumber: z.string().min(1),
  templateId: z.string().min(1),
  templateName: z.string().min(1),
  propertyId: z.string().uuid().optional(),
  claimId: z.string().uuid().optional(),
  responses: z.record(z.any()).optional(),
  conversationHistory: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
  status: z.string().default('draft'),
  currentSection: z.string().optional(),
  progress: z.string().or(z.number()).optional(),
});

// GET /api/interviews - List interviews
export async function GET(request: NextRequest) {
  try {
    const context = await requireAuth();
    await setCompanyContext(context.companyId);

    const allInterviews = await db
      .select()
      .from(interviews)
      .where(eq(interviews.companyId, context.companyId))
      .orderBy(desc(interviews.createdAt));

    return NextResponse.json(allInterviews);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Interviews GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch interviews' }, { status: 500 });
  }
}

// POST /api/interviews - Create interview
export async function POST(request: NextRequest) {
  try {
    const context = await requireAuth();
    await setCompanyContext(context.companyId);

    const body = await request.json();
    const validated = interviewSchema.parse(body);

    const [newInterview] = await db
      .insert(interviews)
      .values({
        interviewNumber: validated.interviewNumber,
        templateId: validated.templateId,
        templateName: validated.templateName,
        propertyId: validated.propertyId,
        claimId: validated.claimId,
        responses: validated.responses,
        conversationHistory: validated.conversationHistory,
        metadata: validated.metadata,
        status: validated.status || 'draft',
        currentSection: validated.currentSection,
        progress: validated.progress ? String(validated.progress) : '0',
        companyId: context.companyId,
        createdBy: context.userId,
        updatedBy: context.userId,
      })
      .returning();

    return NextResponse.json(newInterview, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    console.error('Interviews POST error:', error);
    return NextResponse.json({ error: 'Failed to create interview' }, { status: 500 });
  }
}
