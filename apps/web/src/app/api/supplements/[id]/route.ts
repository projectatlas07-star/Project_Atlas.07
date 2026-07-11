import { NextRequest, NextResponse } from 'next/server';
import { db, setCompanyContext } from '@/lib/server-db';
import { supplements } from '@project-atlas/database';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/server-auth';
import { z } from 'zod';

const supplementUpdateSchema = z.object({
  supplementNumber: z.string().min(1).optional(),
  version: z.string().or(z.number()).optional(),
  status: z.string().optional(),
  carrier: z.string().optional(),
  requestedAmount: z.string().or(z.number()).optional(),
  approvedAmount: z.string().or(z.number()).optional(),
  difference: z.string().or(z.number()).optional(),
  lineItems: z.record(z.any()).optional(),
  internalNotes: z.string().optional(),
  submissionDate: z.string().or(z.date()).optional(),
  responseDate: z.string().or(z.date()).optional(),
  approvalDate: z.string().or(z.date()).optional(),
  denialReason: z.string().optional(),
  revisionHistory: z.record(z.any()).optional(),
  statusHistory: z.record(z.any()).optional(),
  adjusterId: z.string().uuid().optional(),
});

// GET /api/supplements/[id] - Get supplement by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await requireAuth();
    await setCompanyContext(context.companyId);
    const { id } = await params;

    const [supplement] = await db
      .select()
      .from(supplements)
      .where(eq(supplements.id, id));

    if (!supplement) {
      return NextResponse.json({ error: 'Supplement not found' }, { status: 404 });
    }

    return NextResponse.json(supplement);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Supplement GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch supplement' }, { status: 500 });
  }
}

// PUT /api/supplements/[id] - Update supplement
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await requireAuth();
    await setCompanyContext(context.companyId);
    const { id } = await params;

    const body = await request.json();
    const validated = supplementUpdateSchema.parse(body);

    const updateData: any = {
      ...validated,
      updatedBy: context.userId,
      updatedAt: new Date(),
    };

    // Convert date strings to Date objects
    if (validated.submissionDate) updateData.submissionDate = new Date(validated.submissionDate);
    if (validated.responseDate) updateData.responseDate = new Date(validated.responseDate);
    if (validated.approvalDate) updateData.approvalDate = new Date(validated.approvalDate);

    // Convert numeric fields to strings
    if (validated.version) updateData.version = String(validated.version);
    if (validated.requestedAmount) updateData.requestedAmount = String(validated.requestedAmount);
    if (validated.approvedAmount) updateData.approvedAmount = String(validated.approvedAmount);
    if (validated.difference) updateData.difference = String(validated.difference);

    const [updatedSupplement] = await db
      .update(supplements)
      .set(updateData)
      .where(eq(supplements.id, id))
      .returning();

    if (!updatedSupplement) {
      return NextResponse.json({ error: 'Supplement not found' }, { status: 404 });
    }

    return NextResponse.json(updatedSupplement);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    console.error('Supplement PUT error:', error);
    return NextResponse.json({ error: 'Failed to update supplement' }, { status: 500 });
  }
}

// DELETE /api/supplements/[id] - Delete supplement
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await requireAuth();
    await setCompanyContext(context.companyId);
    const { id } = await params;

    const [deletedSupplement] = await db
      .delete(supplements)
      .where(eq(supplements.id, id))
      .returning();

    if (!deletedSupplement) {
      return NextResponse.json({ error: 'Supplement not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Supplement deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Supplement DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete supplement' }, { status: 500 });
  }
}