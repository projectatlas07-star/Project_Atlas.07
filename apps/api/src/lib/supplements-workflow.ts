// apps/api/src/lib/supplements-workflow.ts
export type SupplementStatus =
  | 'draft'
  | 'ready_for_review'
  | 'submitted'
  | 'waiting_for_carrier'
  | 'needs_revision'
  | 'partially_approved'
  | 'approved'
  | 'denied'
  | 'closed';

export interface LineItem {
  id?: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  depreciation: number;
  tax: number;
  notes?: string;
}

export interface StatusTransition {
  from: SupplementStatus;
  to: SupplementStatus;
  allowed: boolean;
  reason?: string;
}

export interface StatusHistoryEntry {
  status: SupplementStatus;
  timestamp: string;
  userId?: string;
  userName?: string;
  reason?: string;
}

export interface RevisionHistoryEntry {
  version: number;
  timestamp: string;
  userId?: string;
  userName?: string;
  changes: string;
}

// Valid status transitions
const VALID_TRANSITIONS: Record<SupplementStatus, SupplementStatus[]> = {
  draft: ['ready_for_review', 'closed'],
  ready_for_review: ['submitted', 'needs_revision', 'closed'],
  submitted: ['waiting_for_carrier', 'needs_revision', 'closed'],
  waiting_for_carrier: ['needs_revision', 'partially_approved', 'approved', 'denied', 'closed'],
  needs_revision: ['ready_for_review', 'closed'],
  partially_approved: ['submitted', 'approved', 'closed'],
  approved: ['closed'],
  denied: ['needs_revision', 'closed'],
  closed: [], // Terminal state
};

// Status display names
export const STATUS_LABELS: Record<SupplementStatus, string> = {
  draft: 'Draft',
  ready_for_review: 'Ready for Review',
  submitted: 'Submitted',
  waiting_for_carrier: 'Waiting for Carrier',
  needs_revision: 'Needs Revision',
  partially_approved: 'Partially Approved',
  approved: 'Approved',
  denied: 'Denied',
  closed: 'Closed',
};

// Status colors for UI
export const STATUS_COLORS: Record<SupplementStatus, string> = {
  draft: 'bg-gray-100 text-gray-800',
  ready_for_review: 'bg-blue-100 text-blue-800',
  submitted: 'bg-yellow-100 text-yellow-800',
  waiting_for_carrier: 'bg-purple-100 text-purple-800',
  needs_revision: 'bg-orange-100 text-orange-800',
  partially_approved: 'bg-cyan-100 text-cyan-800',
  approved: 'bg-green-100 text-green-800',
  denied: 'bg-red-100 text-red-800',
  closed: 'bg-gray-100 text-gray-800',
};

export class SupplementsWorkflowService {
  /**
   * Validate if a status transition is allowed
   */
  static validateTransition(from: SupplementStatus, to: SupplementStatus): StatusTransition {
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
  static getNextStatuses(currentStatus: SupplementStatus): SupplementStatus[] {
    return VALID_TRANSITIONS[currentStatus] || [];
  }

  /**
   * Check if a status is a terminal state
   */
  static isTerminalStatus(status: SupplementStatus): boolean {
    return VALID_TRANSITIONS[status].length === 0;
  }

  /**
   * Add status history entry
   */
  static addStatusHistoryEntry(
    currentHistory: StatusHistoryEntry[],
    newStatus: SupplementStatus,
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
   * Add revision history entry
   */
  static addRevisionHistoryEntry(
    currentHistory: RevisionHistoryEntry[],
    version: number,
    userId?: string,
    userName?: string,
    changes?: string
  ): RevisionHistoryEntry[] {
    const entry: RevisionHistoryEntry = {
      version,
      timestamp: new Date().toISOString(),
      userId,
      userName,
      changes: changes || 'Updated supplement',
    };

    return [...currentHistory, entry];
  }

  /**
   * Calculate line item totals
   */
  static calculateLineItemTotal(item: LineItem): number {
    const subtotal = item.quantity * item.unitPrice;
    const tax = subtotal * (item.tax / 100);
    const depreciation = subtotal * (item.depreciation / 100);
    return subtotal + tax - depreciation;
  }

  /**
   * Calculate supplement totals from line items
   */
  static calculateSupplementTotals(lineItems: LineItem[]): {
    subtotal: number;
    tax: number;
    depreciation: number;
    requestedAmount: number;
  } {
    let subtotal = 0;
    let tax = 0;
    let depreciation = 0;

    lineItems.forEach(item => {
      const itemSubtotal = item.quantity * item.unitPrice;
      subtotal += itemSubtotal;
      tax += itemSubtotal * (item.tax / 100);
      depreciation += itemSubtotal * (item.depreciation / 100);
    });

    const requestedAmount = subtotal + tax - depreciation;

    return {
      subtotal,
      tax,
      depreciation,
      requestedAmount,
    };
  }

  /**
   * Calculate difference between requested and approved amounts
   */
  static calculateDifference(requested: number, approved: number): number {
    return approved - requested;
  }

  /**
   * Get financial summary for a supplement
   */
  static calculateFinancialSummary(supplement: any): any {
    const lineItems = supplement.lineItems || [];
    const totals = this.calculateSupplementTotals(lineItems);
    const requestedAmount = supplement.requestedAmount || totals.requestedAmount;
    const approvedAmount = supplement.approvedAmount || 0;
    const difference = this.calculateDifference(requestedAmount, approvedAmount);

    return {
      ...totals,
      requestedAmount,
      approvedAmount,
      difference,
      outstandingAmount: requestedAmount - approvedAmount,
    };
  }

  /**
   * Get dashboard statistics
   */
  static getDashboardStats(supplements: any[]) {
    const stats = {
      total: supplements.length,
      byStatus: {} as Record<string, number>,
      pending: 0,
      approved: 0,
      denied: 0,
      totalRequested: 0,
      totalApproved: 0,
      averageApprovalTime: 0,
      approvalRate: 0,
      recentlyUpdated: [] as any[],
    };

    const approvalTimes: number[] = [];
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    supplements.forEach(supplement => {
      const status = supplement.status;
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;

      if (['draft', 'ready_for_review', 'submitted', 'waiting_for_carrier', 'needs_revision'].includes(status)) {
        stats.pending++;
      }

      if (status === 'approved') {
        stats.approved++;
        stats.totalApproved += Number(supplement.approvedAmount || 0);

        // Calculate approval time if dates are available
        if (supplement.submissionDate && supplement.approvalDate) {
          const submissionTime = new Date(supplement.submissionDate).getTime();
          const approvalTime = new Date(supplement.approvalDate).getTime();
          const days = (approvalTime - submissionTime) / (1000 * 60 * 60 * 24);
          if (days > 0 && days < 365) {
            approvalTimes.push(days);
          }
        }
      }

      if (status === 'denied') {
        stats.denied++;
      }

      stats.totalRequested += Number(supplement.requestedAmount || 0);

      if (new Date(supplement.updatedAt) > oneWeekAgo) {
        stats.recentlyUpdated.push(supplement);
      }
    });

    // Calculate average approval time
    if (approvalTimes.length > 0) {
      stats.averageApprovalTime = approvalTimes.reduce((a, b) => a + b, 0) / approvalTimes.length;
    }

    // Calculate approval rate
    const totalDecisions = stats.approved + stats.denied;
    if (totalDecisions > 0) {
      stats.approvalRate = (stats.approved / totalDecisions) * 100;
    }

    // Sort recently updated by date descending
    stats.recentlyUpdated.sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    // Limit to 10 most recent
    stats.recentlyUpdated = stats.recentlyUpdated.slice(0, 10);

    return stats;
  }
}
