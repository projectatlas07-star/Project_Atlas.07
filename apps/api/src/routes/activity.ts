// apps/api/src/routes/activity.ts
import { FastifyPluginAsync } from 'fastify';
import { activityLogs } from '@project-atlas/database';
import { db } from '@project-atlas/database';
import { eq, and, like, or, desc, gte, lte } from 'drizzle-orm';

export const activityRoutes: FastifyPluginAsync = async (fastify) => {
  // Get activity timeline with filters, search, and pagination
  fastify.get('/', async (req, reply) => {
    const companyId = (req as any).companyId;
    const query = req.query as any;

    // Pagination
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 50;
    const offset = (page - 1) * limit;

    // Filters
    const userId = query.userId || '';
    const entityType = query.entityType || '';
    const action = query.action || '';
    const search = query.search || '';
    const startDate = query.startDate || '';
    const endDate = query.endDate || '';

    // Build query conditions
    const conditions = [
      eq((activityLogs as any).companyId, companyId),
    ];

    if (userId) {
      conditions.push(eq((activityLogs as any).userId, userId));
    }

    if (entityType) {
      conditions.push(eq((activityLogs as any).entityType, entityType));
    }

    if (action) {
      conditions.push(eq((activityLogs as any).action, action));
    }

    if (search) {
      const searchCondition = or(
        like((activityLogs as any).userName, `%${search}%`),
        like((activityLogs as any).entityName, `%${search}%`),
        like((activityLogs as any).description, `%${search}%`)
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    if (startDate) {
      conditions.push(gte((activityLogs as any).createdAt, new Date(startDate)));
    }

    if (endDate) {
      conditions.push(lte((activityLogs as any).createdAt, new Date(endDate)));
    }

    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

    // Get total count
    const [countResult] = await db
      .select({ count: (activityLogs as any).id })
      .from(activityLogs)
      .where(whereClause);

    const total = Array.isArray(countResult) ? countResult.length : 1;

    // Get paginated results
    const results = await db
      .select()
      .from(activityLogs)
      .where(whereClause)
      .orderBy(desc((activityLogs as any).createdAt))
      .limit(limit)
      .offset(offset);

    reply.send({
      data: results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  });

  // Get unique users for filter dropdown
  fastify.get('/users', async (req, reply) => {
    const companyId = (req as any).companyId;

    const users = await db
      .selectDistinct({
        userId: (activityLogs as any).userId,
        userName: (activityLogs as any).userName,
      })
      .from(activityLogs)
      .where(eq((activityLogs as any).companyId, companyId))
      .orderBy((activityLogs as any).userName);

    reply.send(users);
  });

  // Get unique entity types for filter dropdown
  fastify.get('/entity-types', async (req, reply) => {
    const companyId = (req as any).companyId;

    const entityTypes = await db
      .selectDistinct({
        entityType: (activityLogs as any).entityType,
      })
      .from(activityLogs)
      .where(eq((activityLogs as any).companyId, companyId))
      .orderBy((activityLogs as any).entityType);

    reply.send(entityTypes);
  });

  // Get unique actions for filter dropdown
  fastify.get('/actions', async (req, reply) => {
    const companyId = (req as any).companyId;

    const actions = await db
      .selectDistinct({
        action: (activityLogs as any).action,
      })
      .from(activityLogs)
      .where(eq((activityLogs as any).companyId, companyId))
      .orderBy((activityLogs as any).action);

    reply.send(actions);
  });
};
