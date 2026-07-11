import { NextRequest, NextResponse } from 'next/server';
import { db, setCompanyContext } from '@/lib/server-db';
import { documents } from '@project-atlas/database';
import { eq, desc } from 'drizzle-orm';
import { requireAuth } from '@/lib/server-auth';
import { z } from 'zod';

const documentSchema = z.object({
  url: z.string().url(),
  fileName: z.string().min(1),
  mimeType: z.string().optional(),
  claimId: z.string().optional(),
});

// GET /api/documents - List documents
export async function GET(request: NextRequest) {
  try {
    const context = await requireAuth();
    await setCompanyContext(context.companyId);

    const allDocuments = await db
      .select()
      .from(documents)
      .where(eq(documents.companyId, context.companyId))
      .orderBy(desc(documents.createdAt));

    return NextResponse.json(allDocuments);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Documents GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

// POST /api/documents - Create document
export async function POST(request: NextRequest) {
  try {
    const context = await requireAuth();
    await setCompanyContext(context.companyId);

    const body = await request.json();
    const validated = documentSchema.parse(body);

    const [newDocument] = await db
      .insert(documents)
      .values({
        url: validated.url,
        fileName: validated.fileName,
        mimeType: validated.mimeType,
        claimId: validated.claimId,
        companyId: context.companyId,
        createdBy: context.userId,
      })
      .returning();

    return NextResponse.json(newDocument, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    console.error('Documents POST error:', error);
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
  }
}
