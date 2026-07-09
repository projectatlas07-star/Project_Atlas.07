// apps/api/src/lib/claims-workflow.ts
export type ClaimStatus =
  | 'new'
  | 'inspection_scheduled'
  | 'inspection_complete'
  | 'estimate_submitted'
  | 'supplement_required'
  | 'supplement_submitted'
  | 'waiting_for_carrier'
  | 'approved'
  | 'denied'
  | 'work_in_progress'
  | 'completed'
  | 'closed';

export interface StatusTransition {
  from: ClaimStatus;
  to: ClaimStatus;
  allowed: boolean;
  reason?: string;
}

export interface StatusHistoryEntry {
  status: ClaimStatus;
  timestamp: string;
  userId?: string;
  userName?: string;
  reason?: string;
}

// Valid status transitions
const VALID_TRANSITIONS: Record<ClaimStatus, ClaimStatus[]> = {
  new: ['inspection_scheduled', 'closed'],
  inspection_scheduled: ['inspection_complete', 'closed'],
  inspection_complete: ['estimate_submitted', 'closed'],
  estimate_submitted: ['supplement_required', 'waiting_for_carrier', 'closed'],
  supplement_required: ['supplement_submitted', 'closed'],
  supplement_submitted: ['waiting_for_carrier', 'closed'],
  waiting_for_carrier: ['approved', 'denied', 'closed'],
  approved: ['work_in_progress', 'closed'],
  denied: ['closed'],
  work_in_progress: ['completed', 'closed'],
  completed: ['closed'],
  closed: [], // Terminal state
};

// Status display names
export const STATUS_LABELS: Record<ClaimStatus, string> = {
  new: 'New',
  inspection_scheduled: 'Inspection Scheduled',
  inspection_complete: 'Inspection Complete',
  estimate_submitted: 'Estimate Submitted',
  supplement_required: 'Supplement Required',
  supplement_submitted: 'Supplement Submitted',
  waiting_for_carrier: 'Waiting for Carrier',
  approved: 'Approved',
  denied: 'Denied',
  work_in_progress: 'Work In Progress',
  completed: 'Completed',
  closed: 'Closed',
};

// Status colors for UI
export const STATUS_COLORS: Record<ClaimStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  inspection_scheduled: 'bg-yellow-100 text-yellow-800',
  inspection_complete: 'bg-green-100 text-green-800',
  estimate_submitted: 'bg-purple-100 text-purple-800',
  supplement_required: 'bg-orange-100 text-orange-800',
  supplement_submitted: 'bg-indigo-100 text-indigo-800',
  waiting_for_carrier: 'bg-pink-100 text-pink-800',
  approved: 'bg-emerald-100 text-emerald-800',
  denied: 'bg-red-100 text-red-800',
  work_in_progress: 'bg-cyan-100 text-cyan-800',
  completed: 'bg-teal-100 text-teal-800',
  closed: 'bg-gray-100 text-gray-800',
};

export class ClaimsWorkflowService {
  /**
   * Validate if a status transition is allowed
   */
  static validateTransition(from: ClaimStatus, to: ClaimStatus): StatusTransition {
    const allowedTransitions = VALID_TRANSITIONS[from] || [];
    const isAllowed = allowedTransitions.includes(to);

    if (isAllowed) {
      return { from, to, allowed: true };
    }

    return {
      from,
      to,
      allowed: false,
      reason: `Cannot transition from ${STATUS_LABELS[from]} to ${STATUS_LABELS[to]}. Valid transitions: ${allowedTransitions.map(s => STATUS_LABELS[s]).join(', ') || 'none'}`,
    };
  }

  /**
   * Get all possible next statuses for a given current status
   */
  static getNextStatuses(currentStatus: ClaimStatus): ClaimStatus[] {
    return VALID_TRANSITIONS[currentStatus] || [];
  }

  /**
   * Check if a status is a terminal state
   */
  static isTerminalStatus(status: ClaimStatus): boolean {
    return VALID_TRANSITIONS[status].length === 0;
  }

  /**
   * Add status history entry
   */
  static addStatusHistoryEntry(
    currentHistory: StatusHistoryEntry[],
    newStatus: ClaimStatus,
    userId?: string,
    userName?: string,
    reason?: string
  ): StatusHistoryEntry[] {
    const entry: StatusHistoryEntry = {
      status: newStatus,
      timestamp: new Date().toISOString(),
      userId,
      userName,
      reason,
    };

    return [...currentHistory, entry];
  }

  /**
   * Get financial summary for a claim
   */
  static calculateFinancialSummary(claim: any): any {
    return {
      estimatedValue: claim.estimatedValue || 0,
      approvedValue: claim.approvedValue || 0,
      deductible: claim.deductible || 0,
      netApproved: (claim.approvedValue || 0) - (claim.deductible || 0),
      pendingSupplements: 0, // Would be calculated from supplements
      totalPaid: 0, // Would be calculated from payments
    };
  }

  /**
   * Get dashboard statistics
   */
  static getDashboardStats(claims: any[]) {
    const stats = {
      total: claims.length,
      byStatus: {} as Record<string, number>,
      awaitingSupplement: 0,
      awaitingCarrier: 0,
      recentlyUpdated: [] as any[],
    };

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    claims.forEach(claim => {
      const status = claim.status;
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;

      if (status === 'supplement_required') {
        stats.awaitingSupplement++;
      }

      if (status === 'waiting_for_carrier') {
        stats.awaitingCarrier++;
      }

      if (new Date(claim.updatedAt) > oneWeekAgo) {
        stats.recentlyUpdated.push(claim);
      }
    });

    // Sort recently updated by date descending
    stats.recentlyUpdated.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    // Limit to 10 most recent
    stats.recentlyUpdated = stats.recentlyUpdated.slice(0, 10);

    return stats;
  }
}
