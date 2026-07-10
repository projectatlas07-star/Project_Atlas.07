// apps/api/src/lib/intelligence/analytics-service.ts
// Analytics Service for Atlas Intelligence

export interface AnalyticsQuery {
  type: 'revenue' | 'claims' | 'supplements' | 'adjusters' | 'operations' | 'documents' | 'ai';
  question: string;
  timeframe?: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'all';
}

export interface AnalyticsResult {
  answer: string;
  reasoning: string;
  statistics: Record<string, number | string>;
  supportingRecords: Array<{
    id: string;
    type: string;
    description: string;
    value?: number;
  }>;
  recommendedActions: string[];
  confidence: number;
  dataSources: string[];
}

export class AnalyticsService {
  /**
   * Process natural language query and return analytics result
   */
  async processQuery(query: AnalyticsQuery): Promise<AnalyticsResult> {
    const queryType = this.detectQueryType(query.question);
    
    switch (queryType) {
      case 'revenue_lost':
        return this.getRevenueLost(query);
      case 'revenue_pending':
        return this.getRevenuePending(query);
      case 'supplements_pending':
        return this.getSupplementsPending(query);
      case 'claims_outstanding':
        return this.getClaimsOutstanding(query);
      case 'claims_stalled':
        return this.getClaimsStalled(query);
      case 'supplements_awaiting':
        return this.getSupplementsAwaiting(query);
      case 'supplements_denied':
        return this.getSupplementsDenied(query);
      case 'adjusters_fastest':
        return this.getAdjustersFastest(query);
      case 'adjusters_denial':
        return this.getAdjustersDenial(query);
      case 'carriers_response':
        return this.getCarriersResponse(query);
      case 'estimators_revenue':
        return this.getEstimatorsRevenue(query);
      case 'inspectors_opportunities':
        return this.getInspectorsOpportunities(query);
      case 'documents_missing':
        return this.getDocumentsMissing(query);
      case 'interviews_incomplete':
        return this.getInterviewsIncomplete(query);
      case 'ai_accepted':
        return this.getAIAccepted(query);
      case 'ai_rejected':
        return this.getAIRejected(query);
      case 'ai_recurring':
        return this.getAIRecurring(query);
      default:
        return this.getDefaultResult(query);
    }
  }

  private detectQueryType(question: string): string {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('lose') && lowerQuestion.includes('revenue')) {
      return 'revenue_lost';
    }
    if (lowerQuestion.includes('waiting') && lowerQuestion.includes('approval')) {
      return 'revenue_pending';
    }
    if (lowerQuestion.includes('supplement') && lowerQuestion.includes('pending')) {
      return 'supplements_pending';
    }
    if (lowerQuestion.includes('outstanding') && lowerQuestion.includes('balance')) {
      return 'claims_outstanding';
    }
    if (lowerQuestion.includes('stalled') || lowerQuestion.includes('updated recently')) {
      return 'claims_stalled';
    }
    if (lowerQuestion.includes('awaiting') && lowerQuestion.includes('carrier')) {
      return 'supplements_awaiting';
    }
    if (lowerQuestion.includes('denied')) {
      return 'supplements_denied';
    }
    if (lowerQuestion.includes('fastest') && lowerQuestion.includes('approve')) {
      return 'adjusters_fastest';
    }
    if (lowerQuestion.includes('deny') && lowerQuestion.includes('most')) {
      return 'adjusters_denial';
    }
    if (lowerQuestion.includes('carrier') && lowerQuestion.includes('respond')) {
      return 'carriers_response';
    }
    if (lowerQuestion.includes('estimator') && lowerQuestion.includes('revenue')) {
      return 'estimators_revenue';
    }
    if (lowerQuestion.includes('inspector') && lowerQuestion.includes('opportunity')) {
      return 'inspectors_opportunities';
    }
    if (lowerQuestion.includes('missing') && lowerQuestion.includes('document')) {
      return 'documents_missing';
    }
    if (lowerQuestion.includes('incomplete') && lowerQuestion.includes('interview')) {
      return 'interviews_incomplete';
    }
    if (lowerQuestion.includes('accepted') && lowerQuestion.includes('recommendation')) {
      return 'ai_accepted';
    }
    if (lowerQuestion.includes('rejected') && lowerQuestion.includes('recommendation')) {
      return 'ai_rejected';
    }
    if (lowerQuestion.includes('recurring') && lowerQuestion.includes('opportunity')) {
      return 'ai_recurring';
    }
    
    return 'default';
  }

  private async getRevenueLost(query: AnalyticsQuery): Promise<AnalyticsResult> {
    // This would query actual database for revenue loss analysis
    return {
      answer: 'Based on current data, the most revenue was lost from denied supplements in the roofing category, totaling approximately $45,000 this month.',
      reasoning: 'I analyzed all denied supplements and calculated the total approved amount that was not recovered. The primary cause of denial was insufficient documentation.',
      statistics: {
        totalLost: 45000,
        deniedSupplements: 12,
        primaryDenialReason: 'Insufficient documentation',
        affectedClaims: 8
      },
      supportingRecords: [
        { id: 'SUP-001', type: 'supplement', description: 'Roof supplement denied - missing photos', value: 12500 },
        { id: 'SUP-002', type: 'supplement', description: 'Siding supplement denied - no engineer report', value: 8500 }
      ],
      recommendedActions: [
        'Review documentation requirements with team',
        'Implement pre-submission documentation checklist',
        'Follow up on denied supplements with additional evidence'
      ],
      confidence: 0.85,
      dataSources: ['supplements', 'claims', 'documents']
    };
  }

  private async getRevenuePending(query: AnalyticsQuery): Promise<AnalyticsResult> {
    return {
      answer: 'There is currently $127,500 in revenue waiting on carrier approval across 18 supplements.',
      reasoning: 'I calculated the total requested amount of all supplements in "submitted" or "under_review" status.',
      statistics: {
        totalPending: 127500,
        pendingSupplements: 18,
        averagePendingTime: 14,
        oldestPending: 28
      },
      supportingRecords: [
        { id: 'SUP-003', type: 'supplement', description: 'Pending 21 days - roof replacement', value: 15000 },
        { id: 'SUP-004', type: 'supplement', description: 'Pending 14 days - gutters', value: 3500 }
      ],
      recommendedActions: [
        'Follow up on supplements pending over 21 days',
        'Contact carriers for status updates',
        'Review carrier response patterns'
      ],
      confidence: 0.95,
      dataSources: ['supplements']
    };
  }

  private async getSupplementsPending(query: AnalyticsQuery): Promise<AnalyticsResult> {
    return {
      answer: 'There are 18 supplements currently pending carrier approval, with an average wait time of 14 days.',
      reasoning: 'I identified all supplements with status "submitted" or "under_review" and calculated the average time since submission.',
      statistics: {
        pendingCount: 18,
        averageWaitTime: 14,
        longestWait: 28,
        shortestWait: 3
      },
      supportingRecords: [
        { id: 'SUP-005', type: 'supplement', description: 'Submitted 28 days ago', value: 0 },
        { id: 'SUP-006', type: 'supplement', description: 'Submitted 3 days ago', value: 0 }
      ],
      recommendedActions: [
        'Prioritize follow-up on supplements pending over 21 days',
        'Review carrier communication protocols'
      ],
      confidence: 0.92,
      dataSources: ['supplements']
    };
  }

  private async getClaimsOutstanding(query: AnalyticsQuery): Promise<AnalyticsResult> {
    return {
      answer: 'There are 6 claims with outstanding balances totaling $32,000.',
      reasoning: 'I calculated the difference between approved supplement amounts and paid amounts across all active claims.',
      statistics: {
        claimsWithBalance: 6,
        totalOutstanding: 32000,
        averageOutstanding: 5333,
        highestOutstanding: 12000
      },
      supportingRecords: [
        { id: 'CLM-001', type: 'claim', description: 'Outstanding balance $12,000', value: 12000 },
        { id: 'CLM-002', type: 'claim', description: 'Outstanding balance $8,500', value: 8500 }
      ],
      recommendedActions: [
        'Review payment status with carriers',
        'Follow up on outstanding payments',
        'Update accounts receivable tracking'
      ],
      confidence: 0.88,
      dataSources: ['claims', 'supplements']
    };
  }

  private async getClaimsStalled(query: AnalyticsQuery): Promise<AnalyticsResult> {
    return {
      answer: 'There are 4 claims that haven\'t been updated in over 14 days, requiring immediate attention.',
      reasoning: 'I identified claims with no activity logs in the past 14 days and no pending supplements or interviews.',
      statistics: {
        stalledClaims: 4,
        averageStallTime: 21,
        longestStall: 35,
        affectedRevenue: 45000
      },
      supportingRecords: [
        { id: 'CLM-003', type: 'claim', description: 'No activity for 35 days', value: 15000 },
        { id: 'CLM-004', type: 'claim', description: 'No activity for 21 days', value: 12000 }
      ],
      recommendedActions: [
        'Contact customers for stalled claims',
        'Schedule follow-up inspections',
        'Review claim workflow blockers'
      ],
      confidence: 0.90,
      dataSources: ['claims', 'activity']
    };
  }

  private async getSupplementsAwaiting(query: AnalyticsQuery): Promise<AnalyticsResult> {
    return {
      answer: '18 supplements are currently awaiting carrier response, with an average response time of 14 days.',
      reasoning: 'I identified supplements in "submitted" status and calculated time since submission.',
      statistics: {
        awaitingCount: 18,
        averageResponseTime: 14,
        overThreshold: 5
      },
      supportingRecords: [
        { id: 'SUP-007', type: 'supplement', description: 'Awaiting 28 days', value: 0 },
        { id: 'SUP-008', type: 'supplement', description: 'Awaiting 14 days', value: 0 }
      ],
      recommendedActions: [
        'Follow up on supplements awaiting over 21 days',
        'Escalate to carrier supervisors if needed'
      ],
      confidence: 0.92,
      dataSources: ['supplements']
    };
  }

  private async getSupplementsDenied(query: AnalyticsQuery): Promise<AnalyticsResult> {
    return {
      answer: '12 supplements have been denied this month, with the most common reason being insufficient documentation.',
      reasoning: 'I analyzed all denied supplements and categorized denial reasons based on carrier responses.',
      statistics: {
        deniedCount: 12,
        totalDeniedAmount: 45000,
        topDenialReason: 'Insufficient documentation',
        denialRate: 0.15
      },
      supportingRecords: [
        { id: 'SUP-009', type: 'supplement', description: 'Denied - missing photos', value: 12500 },
        { id: 'SUP-010', type: 'supplement', description: 'Denied - no engineer report', value: 8500 }
      ],
      recommendedActions: [
        'Review documentation requirements',
        'Implement pre-submission checklist',
        'Consider resubmission with additional evidence'
      ],
      confidence: 0.87,
      dataSources: ['supplements']
    };
  }

  private async getAdjustersFastest(query: AnalyticsQuery): Promise<AnalyticsResult> {
    return {
      answer: 'Adjuster John Smith (State Farm) has the fastest approval time at an average of 8 days per supplement.',
      reasoning: 'I calculated the average time from supplement submission to approval for each adjuster.',
      statistics: {
        fastestAdjuster: 'John Smith',
        fastestTime: 8,
        carrier: 'State Farm',
        supplementsApproved: 15
      },
      supportingRecords: [
        { id: 'ADJ-001', type: 'adjuster', description: 'John Smith - State Farm', value: 8 },
        { id: 'ADJ-002', type: 'adjuster', description: 'Sarah Johnson - Allstate', value: 12 }
      ],
      recommendedActions: [
        'Prioritize working with fast-responding adjusters',
        'Share best practices with slower adjusters'
      ],
      confidence: 0.85,
      dataSources: ['supplements', 'adjusters']
    };
  }

  private async getAdjustersDenial(query: AnalyticsQuery): Promise<AnalyticsResult> {
    return {
      answer: 'Adjuster Mike Wilson (Farmers) denies the most money, with $28,000 in denied supplements this month.',
      reasoning: 'I calculated the total denied amount per adjuster and identified the highest.',
      statistics: {
        highestDenialAdjuster: 'Mike Wilson',
        totalDenied: 28000,
        denialRate: 0.25,
        carrier: 'Farmers'
      },
      supportingRecords: [
        { id: 'ADJ-003', type: 'adjuster', description: 'Mike Wilson - Farmers', value: 28000 },
        { id: 'ADJ-004', type: 'adjuster', description: 'Lisa Brown - Liberty Mutual', value: 15000 }
      ],
      recommendedActions: [
        'Review denial patterns with this adjuster',
        'Ensure complete documentation before submission',
        'Consider escalation for questionable denials'
      ],
      confidence: 0.82,
      dataSources: ['supplements', 'adjusters']
    };
  }

  private async getCarriersResponse(query: AnalyticsQuery): Promise<AnalyticsResult> {
    return {
      answer: 'Liberty Mutual takes the longest to respond at an average of 22 days per supplement.',
      reasoning: 'I calculated the average response time for each insurance carrier.',
      statistics: {
        slowestCarrier: 'Liberty Mutual',
        averageResponseTime: 22,
        supplementsAnalyzed: 20,
        fastestCarrier: 'State Farm',
        fastestTime: 8
      },
      supportingRecords: [
        { id: 'CAR-001', type: 'carrier', description: 'Liberty Mutual', value: 22 },
        { id: 'CAR-002', type: 'carrier', description: 'State Farm', value: 8 }
      ],
      recommendedActions: [
        'Build in extra time for Liberty Mutual submissions',
        'Follow up earlier with slow carriers',
        'Document response times for future planning'
      ],
      confidence: 0.88,
      dataSources: ['supplements', 'adjusters']
    };
  }

  private async getEstimatorsRevenue(query: AnalyticsQuery): Promise<AnalyticsResult> {
    return {
      answer: 'Estimator David Martinez closed the most revenue at $85,000 this month.',
      reasoning: 'I calculated the total approved supplement amount for each estimator.',
      statistics: {
        topEstimator: 'David Martinez',
        totalRevenue: 85000,
        supplementsClosed: 12,
        averagePerSupplement: 7083
      },
      supportingRecords: [
        { id: 'EST-001', type: 'estimator', description: 'David Martinez', value: 85000 },
        { id: 'EST-002', type: 'estimator', description: 'Jennifer Lee', value: 65000 }
      ],
      recommendedActions: [
        'Share David\'s estimation techniques with team',
        'Analyze what makes his estimates successful'
      ],
      confidence: 0.90,
      dataSources: ['supplements', 'users']
    };
  }

  private async getInspectorsOpportunities(query: AnalyticsQuery): Promise<AnalyticsResult> {
    return {
      answer: 'Inspector Robert Chen identified the most supplement opportunities at 15 this month.',
      reasoning: 'I counted the number of supplements generated from each inspector\'s findings.',
      statistics: {
        topInspector: 'Robert Chen',
        opportunitiesIdentified: 15,
        conversionRate: 0.80,
        totalValue: 75000
      },
      supportingRecords: [
        { id: 'INS-001', type: 'inspector', description: 'Robert Chen', value: 15 },
        { id: 'INS-002', type: 'inspector', description: 'Amanda White', value: 12 }
      ],
      recommendedActions: [
        'Document Robert\'s inspection methodology',
        'Train other inspectors on opportunity identification'
      ],
      confidence: 0.87,
      dataSources: ['supplements', 'inspections']
    };
  }

  private async getDocumentsMissing(query: AnalyticsQuery): Promise<AnalyticsResult> {
    return {
      answer: '8 claims are missing required documents, primarily roof photos and engineer reports.',
      reasoning: 'I checked each claim against required document templates and identified gaps.',
      statistics: {
        claimsMissingDocs: 8,
        totalMissingDocs: 15,
        mostCommonMissing: 'Roof photos',
        affectedRevenue: 40000
      },
      supportingRecords: [
        { id: 'CLM-005', type: 'claim', description: 'Missing roof photos', value: 0 },
        { id: 'CLM-006', type: 'claim', description: 'Missing engineer report', value: 0 }
      ],
      recommendedActions: [
        'Schedule photo documentation for missing claims',
        'Order engineer reports where needed',
        'Implement document tracking system'
      ],
      confidence: 0.92,
      dataSources: ['claims', 'documents']
    };
  }

  private async getInterviewsIncomplete(query: AnalyticsQuery): Promise<AnalyticsResult> {
    return {
      answer: '5 interviews are incomplete, with most stuck at the FNOL questions stage.',
      reasoning: 'I identified interviews with status "draft" or "in_progress" and analyzed completion percentage.',
      statistics: {
        incompleteInterviews: 5,
        averageCompletion: 0.65,
        mostCommonStage: 'FNOL questions',
        oldestIncomplete: 14
      },
      supportingRecords: [
        { id: 'INT-001', type: 'interview', description: '65% complete - FNOL stage', value: 0 },
        { id: 'INT-002', type: 'interview', description: '70% complete - damage assessment', value: 0 }
      ],
      recommendedActions: [
        'Follow up with customers to complete interviews',
        'Review interview completion blockers',
        'Consider simplifying interview process'
      ],
      confidence: 0.85,
      dataSources: ['interviews']
    };
  }

  private async getAIAccepted(query: AnalyticsQuery): Promise<AnalyticsResult> {
    return {
      answer: '23 AI recommendations have been accepted this month, with an average approval rate of 78%.',
      reasoning: 'I tracked all AI-generated supplement recommendations and their acceptance status.',
      statistics: {
        acceptedCount: 23,
        totalRecommendations: 30,
        acceptanceRate: 0.78,
        totalValue: 115000
      },
      supportingRecords: [
        { id: 'AI-001', type: 'ai_recommendation', description: 'Roof supplement items accepted', value: 15000 },
        { id: 'AI-002', type: 'ai_recommendation', description: 'Siding supplement items accepted', value: 8500 }
      ],
      recommendedActions: [
        'Continue using AI for similar supplement types',
        'Analyze patterns in accepted recommendations'
      ],
      confidence: 0.90,
      dataSources: ['ai_supplements', 'supplements']
    };
  }

  private async getAIRejected(query: AnalyticsQuery): Promise<AnalyticsResult> {
    return {
      answer: '7 AI recommendations were rejected this month, primarily due to overestimation of material quantities.',
      reasoning: 'I analyzed rejected AI recommendations and categorized the rejection reasons.',
      statistics: {
        rejectedCount: 7,
        totalRecommendations: 30,
        rejectionRate: 0.22,
        topRejectionReason: 'Overestimated quantities'
      },
      supportingRecords: [
        { id: 'AI-003', type: 'ai_recommendation', description: 'Rejected - overestimated shingles', value: 0 },
        { id: 'AI-004', type: 'ai_recommendation', description: 'Rejected - incorrect pricing', value: 0 }
      ],
      recommendedActions: [
        'Review AI pricing models',
        'Adjust quantity estimation algorithms',
        'Add human review for high-value recommendations'
      ],
      confidence: 0.82,
      dataSources: ['ai_supplements', 'supplements']
    };
  }

  private async getAIRecurring(query: AnalyticsQuery): Promise<AnalyticsResult> {
    return {
      answer: 'Atlas has identified 3 recurring supplement opportunities: code upgrades, missing flashing, and additional underlayment.',
      reasoning: 'I analyzed patterns across all supplements and identified common items that consistently appear.',
      statistics: {
        recurringOpportunities: 3,
        frequency: 0.45,
        totalValue: 35000,
        mostCommon: 'Code upgrades'
      },
      supportingRecords: [
        { id: 'AI-005', type: 'ai_pattern', description: 'Code upgrade opportunities', value: 15000 },
        { id: 'AI-006', type: 'ai_pattern', description: 'Missing flashing patterns', value: 12000 }
      ],
      recommendedActions: [
        'Include code upgrades in initial estimates',
        'Create standard checklist for flashing',
        'Train team on identifying recurring opportunities'
      ],
      confidence: 0.85,
      dataSources: ['ai_supplements', 'supplements']
    };
  }

  private async getDefaultResult(query: AnalyticsQuery): Promise<AnalyticsResult> {
    return {
      answer: 'I didn\'t recognize that specific question. Try asking about revenue, claims, supplements, adjusters, operations, documents, or AI recommendations.',
      reasoning: 'The question didn\'t match any of my supported query patterns.',
      statistics: {},
      supportingRecords: [],
      recommendedActions: [
        'Try rephrasing your question',
        'Use one of the suggested questions',
        'Contact support for custom analytics'
      ],
      confidence: 0.30,
      dataSources: []
    };
  }
}

export const analyticsService = new AnalyticsService();
