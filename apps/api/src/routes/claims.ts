// apps/api/src/routes/claims.ts
import { FastifyPluginAsync } from 'fastify';
import { registerCrudRoutes } from './crud';
import { claims } from '../../../../packages/database/src/schema/claims';
import { z } from 'zod';

// Adjust schema fields to match your claims table definition
const claimSchema = z.object({
  // Example fields – replace with actual columns
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.string().optional(),
});

export const claimsRoutes: FastifyPluginAsync = async (fastify) => {
  registerCrudRoutes(fastify, {
    basePath: '/',
    table: claims,
    schema: claimSchema,
  });
};
