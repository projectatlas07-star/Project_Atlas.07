import { NextRequest, NextResponse } from 'next/server';
import { db, setCompanyContext } from '@/lib/server-db';
import { claims } from '@project-atlas/database';
import { eq, desc } from 'drizzle-orm';
import { requireAuth } from '@/lib/server-auth';
import { z } from 'zod';

const claimSchema = z.object({
  claimNumber: z.string().min(1),
  status: z.string().default('new'),
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

// GET /api/claims - List claims
export async function GET(request: NextRequest) {
  try {
    const context = await requireAuth();
    await setCompanyContext(context.companyId);

    const allClaims = await db
      .select()
      .from(claims)
      .where(eq(claims.companyId, context.companyId))
      .orderBy(desc(claims.createdAt));

    return NextResponse.json(allClaims);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Claims GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch claims' }, { status: 500 });
  }
}

// POST /api/claims - Create claim
export async function POST(request: NextRequest) {
  try {
    const context = await requireAuth();
    await setCompanyContext(context.companyId);

    const body = await request.json();
    const validated = claimSchema.parse(body);

    const [newClaim] = await db
      .insert(claims)
      .values({
        claimNumber: validated.claimNumber,
        status: validated.status || 'new',
        companyId: context.companyId,
        dateOfLoss: validated.dateOfLoss ? new Date(validated.dateOfLoss) : null,
        dateReported: validated.dateReported ? new Date(validated.dateReported) : null,
        insuranceCompany: validated.insuranceCompany,
        policyNumber: validated.policyNumber,
        deductible: validated.deductible ? String(validated.deductible) : null,
        estimatedValue: validated.estimatedValue ? String(validated.estimatedValue) : null,
        approvedValue: validated.approvedValue ? String(validated.approvedValue) : null,
        description: validated.description,
        customerName: validated.customerName,
        customerEmail: validated.customerEmail,
        customerPhone: validated.customerPhone,
        adjusterId: validated.adjusterId,
        propertyId: validated.propertyId,
        createdBy: context.userId,
      })
      .returning();

    return NextResponse.json(newClaim, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    console.error('Claims POST error:', error);
    return NextResponse.json({ error: 'Failed to create claim' }, { status: 500 });
  }
}
