import { NextRequest, NextResponse } from 'next/server';
import { db, setCompanyContext } from '@/lib/server-db';
import { adjusters } from '@project-atlas/database';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/server-auth';
import { z } from 'zod';

const adjusterUpdateSchema = z.object({
  fullName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  insuranceCompany: z.string().optional(),
  office: z.string().optional(),
  territory: z.string().optional(),
  notes: z.string().optional(),
  active: z.boolean().optional(),
});

// GET /api/adjusters/[id] - Get adjuster by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await requireAuth();
    await setCompanyContext(context.companyId);
    const { id } = await params;

    const [adjuster] = await db
      .select()
      .from(adjusters)
      .where(eq(adjusters.id, id));

    if (!adjuster) {
      return NextResponse.json({ error: 'Adjuster not found' }, { status: 404 });
    }

    return NextResponse.json(adjuster);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Adjuster GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch adjuster' }, { status: 500 });
  }
}

// PUT /api/adjusters/[id] - Update adjuster
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await requireAuth();
    await setCompanyContext(context.companyId);
    const { id } = await params;

    const body = await request.json();
    const validated = adjusterUpdateSchema.parse(body);

    const [updatedAdjuster] = await db
      .update(adjusters)
      .set({
        ...validated,
        updatedBy: context.userId,
        updatedAt: new Date(),
      })
      .where(eq(adjusters.id, id))
      .returning();

    if (!updatedAdjuster) {
      return NextResponse.json({ error: 'Adjuster not found' }, { status: 404 });
    }

    return NextResponse.json(updatedAdjuster);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    console.error('Adjuster PUT error:', error);
    return NextResponse.json({ error: 'Failed to update adjuster' }, { status: 500 });
  }
}

// DELETE /api/adjusters/[id] - Delete adjuster
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await requireAuth();
    await setCompanyContext(context.companyId);
    const { id } = await params;

    const [deletedAdjuster] = await db
      .delete(adjusters)
      .where(eq(adjusters.id, id))
      .returning();

    if (!deletedAdjuster) {
      return NextResponse.json({ error: 'Adjuster not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Adjuster deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Adjuster DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete adjuster' }, { status: 500 });
  }
}