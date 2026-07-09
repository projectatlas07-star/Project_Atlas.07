import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthenticatedRequest } from '../types/request';

// Define allowed roles
const ALLOWED_ROLES = ['admin', 'manager', 'estimator', 'viewer'] as const;
type Role = typeof ALLOWED_ROLES[number];

// Define role permissions
const ROLE_PERMISSIONS: Record<Role, string[]> = {
  admin: ['*'], // Full access
  manager: ['read', 'write', 'delete', 'approve'],
  estimator: ['read', 'write'],
  viewer: ['read'],
};

export async function roleMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const role = (request as AuthenticatedRequest).role as Role;
  
  if (!role) {
    reply.code(403).send({ error: 'Role not assigned' });
    return;
  }

  if (!ALLOWED_ROLES.includes(role)) {
    reply.code(403).send({ error: 'Invalid role' });
    return;
  }

  // Check if user has required permission for the route
  const method = request.method;
  const url = request.url;
  
  // Admin bypass
  if (role === 'admin') {
    return;
  }

  // Basic permission check based on HTTP method
  const permissions = ROLE_PERMISSIONS[role] || [];
  const requiredPermission = getRequiredPermission(method, url);
  
  if (!permissions.includes('*') && !permissions.includes(requiredPermission)) {
    reply.code(403).send({ error: 'Insufficient permissions' });
    return;
  }
}

function getRequiredPermission(method: string, url: string): string {
  if (method === 'GET' || method === 'HEAD') {
    return 'read';
  }
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    return 'write';
  }
  if (method === 'DELETE') {
    return 'delete';
  }
  // Special routes
  if (url.includes('/approve') || url.includes('/reject')) {
    return 'approve';
  }
  return 'read';
}
