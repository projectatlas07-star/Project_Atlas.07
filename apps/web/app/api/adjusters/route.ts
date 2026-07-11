import { NextRequest, NextResponse } from 'next/server';
import { db, setCompanyContext } from '@/lib/server-db';
import { adjusters } from '@project-atlas/database';
import { eq, desc } from 'drizzle-orm';
import { requireAuth } from '@/lib/server-auth';
import { z } from 'zod';

const adjusterSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  insuranceCompany: z.string().optional(),
  office: z.string().optional(),
  territory: z.string().optional(),
  notes: z.string().optional(),
});

// GET /api/adjusters - List adjusters
export async function GET(request: NextRequest) {
  try {
    const context = await requireAuth();
    await setCompanyContext(context.companyId);

    const allAdjusters = await db
      .select()
      .from(adjusters)
      .where(eq(adjusters.companyId, context.companyId))
      .orderBy(desc(adjusters.createdAt));

    return NextResponse.json(allAdjusters);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Adjusters GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch adjusters' }, { status: 500 });
  }
}

// POST /api/adjusters - Create adjuster
export async function POST(request: NextRequest) {
  try {
    const context = await requireAuth();
    await setCompanyContext(context.companyId);

    const body = await request.json();
    const validated = adjusterSchema.parse(body);

    const [newAdjuster] = await db
      .insert(adjusters)
      .values({
        fullName: validated.fullName,
        email: validated.email,
        phone: validated.phone,
        insuranceCompany: validated.insuranceCompany,
        office: validated.office,
        territory: validated.territory,
        notes: validated.notes,
        companyId: context.companyId,
        createdBy: context.userId,
      })
      .returning();

    return NextResponse.json(newAdjuster, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    console.error('Adjusters POST error:', error);
    return NextResponse.json({ error: 'Failed to create adjuster' }, { status: 500 });
  }
}
