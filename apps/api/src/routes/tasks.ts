// apps/api/src/routes/tasks.ts
import { FastifyPluginAsync } from 'fastify';
import { registerCrudRoutes } from './crud';
import { tasks } from '@project-atlas/database';
import { z } from 'zod';

// Adjust schema fields to match your tasks table definition
const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.string().optional(),
  // Add other fields as needed (e.g., dueDate, assignedTo)
});

export const tasksRoutes: FastifyPluginAsync = async (fastify) => {
  registerCrudRoutes(fastify, {
    basePath: '/',
    table: tasks,
    schema: taskSchema,
  });
};
