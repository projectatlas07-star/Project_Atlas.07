// apps/api/src/lib/intelligence/business-intelligence-service.ts
// Business Intelligence Service for Atlas Intelligence

export interface BusinessInsight {
  id: string;
  title: string;
  value: number | string;
  trend: 'up' | 'down' | 'stable';
  trendValue?: number;
  description: string;
  category: 'revenue' | 'claims' | 'supplements' | 'operations' | 'ai';
  priority: 'high' | 'medium' | 'low';
  lastUpdated: Date;
}

export class BusinessIntelligenceService {
  /**
   * Get all business insights for the dashboard
   */
  async getInsights(): Promise<BusinessInsight[]> {
    return [
      {
        id: 'insight-1',
        title: 'Revenue At Risk',
        value: '$45,000',
        trend: 'up',
        trendValue: 12,
        description: 'Total value of denied supplements this month',
        category: 'revenue',
        priority: 'high',
        lastUpdated: new Date()
      },
      {
        id: 'insight-2',
        title: 'Claims Awaiting Carrier',
        value: 8,
        trend: 'down',
        trendValue: 3,
        description: 'Claims waiting for carrier response',
        category: 'claims',
        priority: 'high',
        lastUpdated: new Date()
      },
      {
        id: 'insight-3',
        title: 'Supplements Awaiting Review',
        value: 18,
        trend: 'stable',
        description: 'Supplements in submitted or under review status',
        category: 'supplements',
        priority: 'medium',
        lastUpdated: new Date()
      },
      {
        id: 'insight-4',
        title: 'Average Carrier Response Time',
        value: '14 days',
        trend: 'down',
        trendValue: 2,
        description: 'Average time for carriers to respond to supplements',
        category: 'operations',
        priority: 'medium',
        lastUpdated: new Date()
      },
      {
        id: 'insight-5',
        title: 'Claims Stalled Over 14 Days',
        value: 4,
        trend: 'up',
        trendValue: 1,
        description: 'Claims with no activity in over 14 days',
        category: 'claims',
        priority: 'high',
        lastUpdated: new Date()
      },
      {
        id: 'insight-6',
        title: 'AI Recommendation Acceptance Rate',
        value: '78%',
        trend: 'up',
        trendValue: 5,
        description: 'Percentage of AI recommendations accepted by users',
        category: 'ai',
        priority: 'medium',
        lastUpdated: new Date()
      },
      {
        id: 'insight-7',
        title: 'Most Common Denial Reason',
        value: 'Insufficient Documentation',
        trend: 'stable',
        description: 'Primary reason for supplement denials',
        category: 'supplements',
        priority: 'high',
        lastUpdated: new Date()
      },
      {
        id: 'insight-8',
        title: 'Top Insurance Carrier',
        value: 'State Farm',
        trend: 'stable',
        description: 'Carrier with most active claims',
        category: 'operations',
        priority: 'low',
        lastUpdated: new Date()
      },
      {
        id: 'insight-9',
        title: 'Top Adjuster',
        value: 'John Smith',
        trend: 'stable',
        description: 'Adjuster with fastest approval time (8 days)',
        category: 'operations',
        priority: 'low',
        lastUpdated: new Date()
      },
      {
        id: 'insight-10',
        title: 'Largest Outstanding Supplement',
        value: '$15,000',
        trend: 'stable',
        description: 'Single largest supplement awaiting approval',
        category: 'revenue',
        priority: 'medium',
        lastUpdated: new Date()
      }
    ];
  }

  /**
   * Get insights by category
   */
  async getInsightsByCategory(category: string): Promise<BusinessInsight[]> {
    const allInsights = await this.getInsights();
    return allInsights.filter(insight => insight.category === category);
  }

  /**
   * Get high-priority insights
   */
  async getHighPriorityInsights(): Promise<BusinessInsight[]> {
    const allInsights = await this.getInsights();
    return allInsights.filter(insight => insight.priority === 'high');
  }
}

export const businessIntelligenceService = new BusinessIntelligenceService();
