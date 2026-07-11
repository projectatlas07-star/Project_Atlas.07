import { NextRequest, NextResponse } from 'next/server';
import { db, setCompanyContext } from '@/lib/server-db';
import { claims } from '@project-atlas/database';
import { eq, sql, count } from 'drizzle-orm';
import { requireAuth } from '@/lib/server-auth';

// GET /api/claims/dashboard/stats - Get claims dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const context = await requireAuth();
    await setCompanyContext(context.companyId);

    // Get total claims count
    const [totalCount] = await db
      .select({ count: count() })
      .from(claims)
      .where(eq(claims.companyId, context.companyId));

    // Get claims by status
    const statusCounts = await db
      .select({
        status: claims.status,
        count: count(),
      })
      .from(claims)
      .where(eq(claims.companyId, context.companyId))
      .groupBy(claims.status);

    // Get recent claims
    const recentClaims = await db
      .select()
      .from(claims)
      .where(eq(claims.companyId, context.companyId))
      .orderBy(sql`${claims.createdAt} DESC`)
      .limit(5);

    const stats = {
      totalClaims: totalCount?.count || 0,
      byStatus: statusCounts.reduce((acc, item) => {
        acc[item.status] = item.count;
        return acc;
      }, {} as Record<string, number>),
      recentClaims,
    };

    return NextResponse.json(stats);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Claims dashboard stats GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch claims dashboard stats' }, { status: 500 });
  }
}