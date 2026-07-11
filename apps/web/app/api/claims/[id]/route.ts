import { NextRequest, NextResponse } from 'next/server';
import { db, setCompanyContext } from '@/lib/server-db';
import { claims } from '@project-atlas/database';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/server-auth';
import { z } from 'zod';

const claimUpdateSchema = z.object({
  claimNumber: z.string().min(1).optional(),
  status: z.string().optional(),
  dateOfLoss: z.string().or(z.date()).optional(),
  dateReported: z.string().or(z.date()).optional(),
  insuranceCompany: z.string().optional(),
  policyNumber: z.string().optional(),
  deductible: z.string().or(z.number()).optional(),
  estimatedValue: z.string().or(z.number()).optional(),
  approvedValue: z.string().or(z.number()).optional(),
  description: z.string().optional(),
  customerName: z.string().optional(),
  customerEmail: z.string().optional(),
  customerPhone: z.string().optional(),
  adjusterId: z.string().optional(),
  propertyId: z.string().optional(),
});

// GET /api/claims/[id] - Get claim by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await requireAuth();
    await setCompanyContext(context.companyId);
    const { id } = await params;

    const [claim] = await db
      .select()
      .from(claims)
      .where(eq(claims.id, id));

    if (!claim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
    }

    return NextResponse.json(claim);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Claim GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch claim' }, { status: 500 });
  }
}

// PUT /api/claims/[id] - Update claim
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await requireAuth();
    await setCompanyContext(context.companyId);
    const { id } = await params;

    const body = await request.json();
    const validated = claimUpdateSchema.parse(body);

    const updateData: any = {
      ...validated,
      updatedBy: context.userId,
      updatedAt: new Date(),
    };

    // Convert date strings to Date objects
    if (validated.dateOfLoss) updateData.dateOfLoss = new Date(validated.dateOfLoss);
    if (validated.dateReported) updateData.dateReported = new Date(validated.dateReported);

    // Convert numeric fields to strings
    if (validated.deductible) updateData.deductible = String(validated.deductible);
    if (validated.estimatedValue) updateData.estimatedValue = String(validated.estimatedValue);
    if (validated.approvedValue) updateData.approvedValue = String(validated.approvedValue);

    const [updatedClaim] = await db
      .update(claims)
      .set(updateData)
      .where(eq(claims.id, id))
      .returning();

    if (!updatedClaim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
    }

    return NextResponse.json(updatedClaim);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    console.error('Claim PUT error:', error);
    return NextResponse.json({ error: 'Failed to update claim' }, { status: 500 });
  }
}

// DELETE /api/claims/[id] - Delete claim
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await requireAuth();
    await setCompanyContext(context.companyId);
    const { id } = await params;

    const [deletedClaim] = await db
      .delete(claims)
      .where(eq(claims.id, id))
      .returning();

    if (!deletedClaim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Claim deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Claim DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete claim' }, { status: 500 });
  }
}