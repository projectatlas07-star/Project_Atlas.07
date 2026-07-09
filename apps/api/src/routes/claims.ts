// apps/api/src/routes/claims.ts
import { FastifyPluginAsync } from 'fastify';
import { registerCrudRoutes } from './crud';
import { claims } from '@project-atlas/database';
import { z } from 'zod';
import { db } from '@project-atlas/database';
import { eq, and, like, or, desc } from 'drizzle-orm';
import { ActivityService } from '../lib/activity';
import { ClaimsWorkflowService, ClaimStatus, STATUS_LABELS } from '../lib/claims-workflow';

// Claim schema for validation
const claimSchema = z.object({
  claimNumber: z.string().min(1).max(64),
  status: z.string().default('new'),
  dateOfLoss: z.string().optional(),
  dateReported: z.string().optional(),
  insuranceCompany: z.string().max(255).optional(),
  policyNumber: z.string().max(100).optional(),
  deductible: z.number().optional(),
  estimatedValue: z.number().optional(),
  approvedValue: z.number().optional(),
  description: z.string().optional(),
  customerName: z.string().max(255).optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().max(50).optional(),
  adjusterId: z.string().uuid().optional(),
  propertyId: z.string().uuid().optional(),
});

export const claimsRoutes: FastifyPluginAsync = async (fastify) => {
  // Register generic CRUD routes
  registerCrudRoutes(fastify, {
    basePath: '/',
    table: claims,
    schema: claimSchema,
    beforeCreate: async (data, req) => {
      const userId = (req as any).userId;
      const companyId = (req as any).companyId;
      return {
        ...data,
        companyId,
        createdBy: userId,
        updatedBy: userId,
        statusHistory: [{
          status: data.status || 'new',
          timestamp: new Date().toISOString(),
          userId,
          userName: (req as any).userName,
        }],
      };
    },
    afterCreate: async (result, req) => {
      const userInfo = ActivityService.getUserInfo(req);
      const companyId = (req as any).companyId;
      await ActivityService.logCreate({
        companyId,
        userId: userInfo.userId,
        userName: userInfo.userName,
        entityType: 'claim',
        entityId: (result as any).id,
        entityName: (result as any).claimNumber,
        description: `Created claim: ${(result as any).claimNumber}`,
        newValues: { claimNumber: (result as any).claimNumber, status: (result as any).status },
        ipAddress: userInfo.ipAddress,
      });
    },
  });

  // List claims with search, filters, and pagination
  fastify.get('/', async (req, reply) => {
    const companyId = (req as any).companyId;
    const query = req.query as any;

    // Pagination
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const offset = (page - 1) * limit;

    // Filters
    const status = query.status || '';
    const adjusterId = query.adjusterId || '';
    const search = query.search || '';

    // Build query conditions
    const conditions = [
      eq((claims as any).companyId, companyId),
    ];

    if (status) {
      conditions.push(eq((claims as any).status, status));
    }

    if (adjusterId) {
      conditions.push(eq((claims as any).adjusterId, adjusterId));
    }

    if (search) {
      const searchCondition = or(
        like((claims as any).claimNumber, `%${search}%`),
        like((claims as any).customerName, `%${search}%`),
        like((claims as any).insuranceCompany, `%${search}%`)
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

    // Get total count
    const [countResult] = await db
      .select({ count: (claims as any).id })
      .from(claims)
      .where(whereClause);

    const total = Array.isArray(countResult) ? countResult.length : 1;

    // Get paginated results
    const results = await db
      .select()
      .from(claims)
      .where(whereClause)
      .orderBy(desc((claims as any).updatedAt))
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

  // Update claim status with validation
  fastify.put('/:id/status', async (req, reply) => {
    const { id } = req.params as any;
    const companyId = (req as any).companyId;
    const userId = (req as any).userId;
    const userInfo = ActivityService.getUserInfo(req);

    const { status, reason } = req.body as { status: ClaimStatus; reason?: string };

    // Verify ownership
    const [existing] = await db
      .select()
      .from(claims)
      .where(eq((claims as any).id, id));

    if (!existing) {
      return reply.code(404).send({ error: 'Claim not found' });
    }

    if ((existing as any).companyId !== companyId) {
      return reply.code(403).send({ error: 'Access denied' });
    }

    // Validate status transition
    const validation = ClaimsWorkflowService.validateTransition(
      (existing as any).status as ClaimStatus,
      status
    );

    if (!validation.allowed) {
      return reply.code(400).send({ error: validation.reason });
    }

    // Update status history
    const currentHistory = (existing as any).statusHistory || [];
    const newHistory = ClaimsWorkflowService.addStatusHistoryEntry(
      currentHistory,
      status,
      userId,
      userInfo.userName,
      reason
    );

    // Update claim
    const [updated] = await db
      .update(claims)
      .set({
        status,
        statusHistory: newHistory,
        updatedBy: userId,
        updatedAt: new Date(),
      })
      .where(eq((claims as any).id, id))
      .returning();

    // Log activity
    await ActivityService.logStatusChange({
      companyId,
      userId: userInfo.userId,
      userName: userInfo.userName,
      entityType: 'claim',
      entityId: id,
      entityName: (existing as any).claimNumber,
      description: `Changed claim status from ${STATUS_LABELS[(existing as any).status as ClaimStatus]} to ${STATUS_LABELS[status]}`,
      previousValues: { status: (existing as any).status },
      newValues: { status, reason },
      ipAddress: userInfo.ipAddress,
    });

    reply.send(updated);
  });

  // Get claim details with related data
  fastify.get('/:id', async (req, reply) => {
    const { id } = req.params as any;
    const companyId = (req as any).companyId;

    const [claim] = await db
      .select()
      .from(claims)
      .where(and(
        eq((claims as any).id, id),
        eq((claims as any).companyId, companyId)
      ));

    if (!claim) {
      return reply.code(404).send({ error: 'Claim not found' });
    }

    // Calculate financial summary
    const financialSummary = ClaimsWorkflowService.calculateFinancialSummary(claim);

    reply.send({
      ...claim,
      financialSummary,
    });
  });

  // Get dashboard statistics
  fastify.get('/dashboard/stats', async (req, reply) => {
    const companyId = (req as any).companyId;

    const allClaims = await db
      .select()
      .from(claims)
      .where(eq((claims as any).companyId, companyId));

    const stats = ClaimsWorkflowService.getDashboardStats(allClaims);

    reply.send(stats);
  });

  // Get available status transitions for a claim
  fastify.get('/:id/transitions', async (req, reply) => {
    const { id } = req.params as any;
    const companyId = (req as any).companyId;

    const [claim] = await db
      .select()
      .from(claims)
      .where(and(
        eq((claims as any).id, id),
        eq((claims as any).companyId, companyId)
      ));

    if (!claim) {
      return reply.code(404).send({ error: 'Claim not found' });
    }

    const nextStatuses = ClaimsWorkflowService.getNextStatuses(
      (claim as any).status as ClaimStatus
    );

    reply.send({
      currentStatus: (claim as any).status,
      nextStatuses: nextStatuses.map(status => ({
        value: status,
        label: STATUS_LABELS[status],
      })),
    });
  });
};
