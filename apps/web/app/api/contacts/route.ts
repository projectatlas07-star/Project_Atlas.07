import { NextRequest, NextResponse } from 'next/server';
import { db, setCompanyContext } from '@/lib/server-db';
import { contacts } from '@project-atlas/database';
import { eq, desc } from 'drizzle-orm';
import { requireAuth } from '@/lib/server-auth';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  role: z.string().optional(),
});

// GET /api/contacts - List contacts
export async function GET(request: NextRequest) {
  try {
    const context = await requireAuth();
    await setCompanyContext(context.companyId);

    const allContacts = await db
      .select()
      .from(contacts)
      .where(eq(contacts.companyId, context.companyId))
      .orderBy(desc(contacts.createdAt));

    return NextResponse.json(allContacts);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Contacts GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

// POST /api/contacts - Create contact
export async function POST(request: NextRequest) {
  try {
    const context = await requireAuth();
    await setCompanyContext(context.companyId);

    const body = await request.json();
    const validated = contactSchema.parse(body);

    const [newContact] = await db
      .insert(contacts)
      .values({
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
        role: validated.role,
        companyId: context.companyId,
        createdBy: context.userId,
      })
      .returning();

    return NextResponse.json(newContact, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    console.error('Contacts POST error:', error);
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
  }
}
