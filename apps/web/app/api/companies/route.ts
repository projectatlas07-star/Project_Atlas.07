import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/server-db';
import { companies } from '@project-atlas/database';
import { desc } from 'drizzle-orm';
import { requireAuth } from '@/lib/server-auth';
import { z } from 'zod';

const companySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  plan: z.string().optional(),
});

// GET /api/companies - List companies
export async function GET(request: NextRequest) {
  try {
    const context = await requireAuth();
    
    // Companies are tenant-level, so we get all companies where the user is a tenant member
    // For now, return all companies (tenant isolation should be handled at auth level)
    const allCompanies = await db
      .select()
      .from(companies)
      .orderBy(desc(companies.created_at));

    return NextResponse.json(allCompanies);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Companies GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

// POST /api/companies - Create company
export async function POST(request: NextRequest) {
  try {
    const context = await requireAuth();

    const body = await request.json();
    const validated = companySchema.parse(body);

    const [newCompany] = await db
      .insert(companies)
      .values({
        ...validated,
        created_by: context.userId,
      })
      .returning();

    return NextResponse.json(newCompany, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    console.error('Companies POST error:', error);
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
}
