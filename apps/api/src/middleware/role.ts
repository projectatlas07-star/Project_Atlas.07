import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthenticatedRequest } from '../types/request';

// Define allowed roles
const ALLOWED_ROLES = ['admin', 'manager', 'estimator', 'viewer'] as const;
type Role = typeof ALLOWED_ROLES[number];

// Define role permissions with granular control
const ROLE_PERMISSIONS: Record<Role, string[]> = {
  admin: ['*'], // Full access to all operations
  manager: ['read', 'write', 'delete', 'approve', 'reject', 'export', 'import'],
  estimator: ['read', 'write', 'export'],
  viewer: ['read'],
};

// Resource-specific permission requirements
const RESOURCE_PERMISSIONS: Record<string, string[]> = {
  '/users': ['admin'], // Only admin can manage users
  '/companies': ['admin', 'manager'], // Admin and manager can manage companies
  '/roles': ['admin'], // Only admin can manage roles
  '/settings': ['admin', 'manager'], // Admin and manager can manage settings
  '/ai-supplements/generate': ['admin', 'manager', 'estimator'], // AI supplement generation
  '/supplements': ['admin', 'manager', 'estimator'], // Supplement management
  '/approve': ['admin', 'manager'], // Approval operations
  '/reject': ['admin', 'manager'], // Rejection operations
  '/delete': ['admin', 'manager'], // Delete operations
  '/export': ['admin', 'manager', 'estimator'], // Export operations
  '/import': ['admin', 'manager'], // Import operations
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

  // Admin bypass - full access
  if (role === 'admin') {
    return;
  }

  // Check resource-specific permissions
  const url = request.url;
  const requiredPermissions = getResourcePermissions(url);
  
  if (requiredPermissions.length > 0) {
    const userPermissions = ROLE_PERMISSIONS[role] || [];
    const hasPermission = requiredPermissions.some(perm => 
      userPermissions.includes('*') || userPermissions.includes(perm)
    );
    
    if (!hasPermission) {
      reply.code(403).send({ 
        error: 'Insufficient permissions for this resource',
        required: requiredPermissions,
        userRole: role 
      });
      return;
    }
  }

  // Check method-based permissions
  const method = request.method;
  const methodPermission = getMethodPermission(method, url);
  const userPermissions = ROLE_PERMISSIONS[role] || [];
  
  if (!userPermissions.includes('*') && !userPermissions.includes(methodPermission)) {
    reply.code(403).send({ 
      error: 'Insufficient permissions for this operation',
      required: methodPermission,
      userRole: role 
    });
    return;
  }
}

function getResourcePermissions(url: string): string[] {
  // Check if URL matches any resource-specific permissions
  for (const [resource, permissions] of Object.entries(RESOURCE_PERMISSIONS)) {
    if (url.includes(resource)) {
      return permissions;
    }
  }
  return []; // No specific resource permissions required
}

function getMethodPermission(method: string, url: string): string {
  if (method === 'GET' || method === 'HEAD') {
    return 'read';
  }
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    return 'write';
  }
  if (method === 'DELETE') {
    return 'delete';
  }
  
  // Special route-based permissions
  if (url.includes('/approve')) {
    return 'approve';
  }
  if (url.includes('/reject')) {
    return 'reject';
  }
  if (url.includes('/export')) {
    return 'export';
  }
  if (url.includes('/import')) {
    return 'import';
  }
  
  return 'read'; // Default to read permission
}
