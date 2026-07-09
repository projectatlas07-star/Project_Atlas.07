// apps/api/src/types/request.ts
import { FastifyRequest } from 'fastify';

export interface AuthenticatedRequest extends FastifyRequest {
  user: {
    id: string;
    email?: string;
    [key: string]: any;
  };
  companyId: string;
  role: string;
  userId: string;
  userName: string;
  ipAddress: string;
}
