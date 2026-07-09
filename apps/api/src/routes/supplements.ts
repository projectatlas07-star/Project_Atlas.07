// apps/api/src/routes/supplements.ts
import { FastifyPluginAsync } from 'fastify';
import { registerCrudRoutes } from './crud';
import { supplements } from '../../../../packages/database/src/schema/supplements';
import { z } from 'zod';

// Basic schema for supplements; extend as needed.
const supplementSchema = z.object({
  claimId: z.string().uuid(),
  requestedAmount: z.number().optional(),
  approvedAmount: z.number().optional(),
  status: z.string().optional()
});

export const supplementsRoutes: FastifyPluginAsync = async (fastify) => {
  registerCrudRoutes(fastify, {
    basePath: '/',
    table: supplements,
    schema: supplementSchema,
  });
};
