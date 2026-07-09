// apps/api/src/lib/activity.ts
import { db } from '@project-atlas/database';
import { activityLogs } from '@project-atlas/database';
import { FastifyRequest } from 'fastify';

export interface ActivityLogOptions {
  companyId: string;
  userId?: string;
  userName?: string;
  entityType: string;
  entityId?: string;
  entityName?: string;
  action: string;
  description?: string;
  previousValues?: any;
  newValues?: any;
  ipAddress?: string;
}

export class ActivityService {
  /**
   * Log a create action
   */
  static async logCreate(options: Omit<ActivityLogOptions, 'action'>) {
    return this.log({
      ...options,
      action: 'create',
      description: options.description || `Created ${options.entityType}${options.entityName ? `: ${options.entityName}` : ''}`,
    });
  }

  /**
   * Log an update action
   */
  static async logUpdate(options: Omit<ActivityLogOptions, 'action'>) {
    return this.log({
      ...options,
      action: 'update',
      description: options.description || `Updated ${options.entityType}${options.entityName ? `: ${options.entityName}` : ''}`,
    });
  }

  /**
   * Log a delete action
   */
  static async logDelete(options: Omit<ActivityLogOptions, 'action'>) {
    return this.log({
      ...options,
      action: 'delete',
      description: options.description || `Deleted ${options.entityType}${options.entityName ? `: ${options.entityName}` : ''}`,
    });
  }

  /**
   * Log an upload action
   */
  static async logUpload(options: Omit<ActivityLogOptions, 'action'>) {
    return this.log({
      ...options,
      action: 'upload',
      description: options.description || `Uploaded ${options.entityType}${options.entityName ? `: ${options.entityName}` : ''}`,
    });
  }

  /**
   * Log a download action
   */
  static async logDownload(options: Omit<ActivityLogOptions, 'action'>) {
    return this.log({
      ...options,
      action: 'download',
      description: options.description || `Downloaded ${options.entityType}${options.entityName ? `: ${options.entityName}` : ''}`,
    });
  }

  /**
   * Log an assignment action
   */
  static async logAssignment(options: Omit<ActivityLogOptions, 'action'>) {
    return this.log({
      ...options,
      action: 'assignment',
      description: options.description || `Assigned ${options.entityType}${options.entityName ? `: ${options.entityName}` : ''}`,
    });
  }

  /**
   * Log a status change action
   */
  static async logStatusChange(options: Omit<ActivityLogOptions, 'action'>) {
    return this.log({
      ...options,
      action: 'status_change',
      description: options.description || `Changed status of ${options.entityType}${options.entityName ? `: ${options.entityName}` : ''}`,
    });
  }

  /**
   * Log an interview action
   */
  static async logInterview(options: Omit<ActivityLogOptions, 'action'>) {
    return this.log({
      ...options,
      action: 'interview',
      description: options.description || `Interview ${options.entityType}${options.entityName ? `: ${options.entityName}` : ''}`,
    });
  }

  /**
   * Log a supplement action
   */
  static async logSupplement(options: Omit<ActivityLogOptions, 'action'>) {
    return this.log({
      ...options,
      action: 'supplement',
      description: options.description || `Supplement ${options.entityType}${options.entityName ? `: ${options.entityName}` : ''}`,
    });
  }

  /**
   * Generic log method
   */
  static async log(options: ActivityLogOptions) {
    try {
      await db.insert(activityLogs).values({
        companyId: options.companyId,
        userId: options.userId,
        userName: options.userName,
        entityType: options.entityType,
        entityId: options.entityId,
        entityName: options.entityName,
        action: options.action,
        description: options.description,
        previousValues: options.previousValues || null,
        newValues: options.newValues || null,
        ipAddress: options.ipAddress,
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
      // Don't throw - logging failures shouldn't break the main operation
    }
  }

  /**
   * Extract user info from request
   */
  static getUserInfo(req: FastifyRequest): { userId?: string; userName?: string; ipAddress?: string } {
    const userId = (req as any).userId;
    const userName = (req as any).userName;
    const ipAddress = (req as any).ip || req.ip;
    return { userId, userName, ipAddress };
  }
}
