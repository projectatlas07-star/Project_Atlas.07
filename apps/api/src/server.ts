import Fastify from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import multipart from '@fastify/multipart';
import { supabase } from './lib/supabase'; // Supabase client wrapper (will be created)
import { authMiddleware } from './middleware/auth';
import { roleMiddleware } from './middleware/role';
import { registerRoutes } from './routes';

export const buildFastify = () => {
  const server = Fastify({ logger: true });

  // Register multipart support for file uploads
  server.register(multipart);

  // Register plugins
  server.register(fastifyPlugin(async (fastify) => {
    fastify.addHook('preHandler', authMiddleware);
  }));
  server.register(fastifyPlugin(async (fastify) => {
    fastify.addHook('preHandler', roleMiddleware);
  }));

  // Register all API routes under /api/v1
  server.register(registerRoutes, { prefix: '/api/v1' });

  // Health check
  server.get('/health', async (request, reply) => {
    return { status: 'ok' };
  });

  return server;
};

if (require.main === module) {
  const server = buildFastify();
  const start = async () => {
    try {
      await server.listen({ port: Number(process.env.PORT) || 3000, host: '0.0.0.0' });
      server.log.info(`Server listening on ${server.server.address()?.toString()}`);
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  };

  start();
}
