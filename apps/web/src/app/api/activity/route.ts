import { NextRequest, NextResponse } from 'next/server';
import { db, setCompanyContext } from '@/lib/server-db';
import { activityLogs } from '@project-atlas/database';
import { eq, desc } from 'drizzle-orm';
import { requireAuth } from '@/lib/server-auth';
import { z } from 'zod';

const activitySchema = z.object({
  entityType: z.string().min(1),
  entityId: z.string().uuid().optional(),
  entityName: z.string().optional(),
  action: z.string().min(1),
  description: z.string().optional(),
  previousValues: z.record(z.any()).optional(),
  newValues: z.record(z.any()).optional(),
  ipAddress: z.string().optional(),
});

// GET /api/activity - List activity logs
export async function GET(request: NextRequest) {
  try {
    const context = await requireAuth();
    await setCompanyContext(context.companyId);

    const allActivity = await db
      .select()
      .from(activityLogs)
      .where(eq(activityLogs.companyId, context.companyId))
      .orderBy(desc(activityLogs.createdAt));

    return NextResponse.json(allActivity);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Activity GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch activity logs' }, { status: 500 });
  }
}

// POST /api/activity - Create activity log
export async function POST(request: NextRequest) {
  try {
    const context = await requireAuth();
    await setCompanyContext(context.companyId);

    const body = await request.json();
    const validated = activitySchema.parse(body);

    const [newActivity] = await db
      .insert(activityLogs)
      .values({
        entityType: validated.entityType,
        entityId: validated.entityId,
        entityName: validated.entityName,
        action: validated.action,
        description: validated.description,
        previousValues: validated.previousValues,
        newValues: validated.newValues,
        ipAddress: validated.ipAddress,
        companyId: context.companyId,
        userId: context.userId,
        userName: context.userName || null,
      })
      .returning();

    return NextResponse.json(newActivity, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    console.error('Activity POST error:', error);
    return NextResponse.json({ error: 'Failed to create activity log' }, { status: 500 });
  }
}
