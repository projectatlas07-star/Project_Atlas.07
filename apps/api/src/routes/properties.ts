// apps/api/src/routes/properties.ts
import { FastifyPluginAsync } from 'fastify';
import { registerCrudRoutes } from './crud';
import { properties } from '../../../../packages/database/src/schema/properties';
import { z } from 'zod';

// Simple schema that accepts any fields; concrete validation can be added later.
const propertySchema = z.object({}).passthrough();

export const propertiesRoutes: FastifyPluginAsync = async (fastify) => {
  registerCrudRoutes(fastify, {
    basePath: '/',
    table: properties,
    schema: propertySchema,
  });
};
