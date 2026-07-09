import { FastifyRequest, FastifyReply } from 'fastify';

export async function roleMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const role = (request as any).role;
  // Add role-based access control logic here
  // For now, this is a placeholder
  if (!role) {
    reply.code(403).send({ error: 'Role not assigned' });
    return;
  }
}
