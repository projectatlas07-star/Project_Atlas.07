// apps/api/src/routes/notes.ts
import { FastifyPluginAsync } from 'fastify';
import { registerCrudRoutes } from './crud';
import { notes } from '@project-atlas/database';
import { z } from 'zod';

// Simple schema – adjust fields to match your notes table
const noteSchema = z.object({
  title: z.string().min(1),
  content: z.string().optional(),
});

export const notesRoutes: FastifyPluginAsync = async (fastify) => {
  registerCrudRoutes(fastify, {
    basePath: '/',
    table: notes,
    schema: noteSchema,
  });
};
