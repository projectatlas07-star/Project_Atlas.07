import { NextRequest, NextResponse } from 'next/server';
import { db, setCompanyContext } from '@/lib/server-db';
import { supplements } from '@project-atlas/database';
import { eq, sql, count } from 'drizzle-orm';
import { requireAuth } from '@/lib/server-auth';

// GET /api/supplements/dashboard/stats - Get supplements dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const context = await requireAuth();
    await setCompanyContext(context.companyId);

    // Get total supplements count
    const [totalCount] = await db
      .select({ count: count() })
      .from(supplements)
      .where(eq(supplements.companyId, context.companyId));

    // Get supplements by status
    const statusCounts = await db
      .select({
        status: supplements.status,
        count: count(),
      })
      .from(supplements)
      .where(eq(supplements.companyId, context.companyId))
      .groupBy(supplements.status);

    // Calculate total requested and approved amounts
    const [amountSums] = await db
      .select({
        totalRequested: sql<string>`COALESCE(SUM(CAST(${supplements.requestedAmount} AS NUMERIC)), 0)`,
        totalApproved: sql<string>`COALESCE(SUM(CAST(${supplements.approvedAmount} AS NUMERIC)), 0)`,
      })
      .from(supplements)
      .where(eq(supplements.companyId, context.companyId));

    // Get recent supplements
    const recentSupplements = await db
      .select()
      .from(supplements)
      .where(eq(supplements.companyId, context.companyId))
      .orderBy(sql`${supplements.createdAt} DESC`)
      .limit(5);

    const stats = {
      totalSupplements: totalCount?.count || 0,
      byStatus: statusCounts.reduce((acc, item) => {
        acc[item.status] = item.count;
        return acc;
      }, {} as Record<string, number>),
      totalRequested: amountSums?.totalRequested || '0',
      totalApproved: amountSums?.totalApproved || '0',
      recentSupplements,
    };

    return NextResponse.json(stats);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Supplements dashboard stats GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch supplements dashboard stats' }, { status: 500 });
  }
}