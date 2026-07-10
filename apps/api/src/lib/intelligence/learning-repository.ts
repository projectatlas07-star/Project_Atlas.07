// apps/api/src/lib/intelligence/learning-repository.ts
// Learning Repository for Atlas Intelligence

export interface AIInteraction {
  id: string;
  type: 'accepted' | 'rejected' | 'edited';
  recommendationId: string;
  recommendationType: string;
  originalRecommendation: any;
  finalValue?: any;
  reason?: string;
  userId: string;
  timestamp: Date;
  context: {
    claimId?: string;
    supplementId?: string;
    carrier?: string;
    adjuster?: string;
  };
}

export interface LearningPattern {
  id: string;
  patternType: 'denial_reason' | 'supplement_revision' | 'documentation_request' | 'carrier_preference';
  pattern: string;
  frequency: number;
  confidence: number;
  lastObserved: Date;
  impact: {
    financial?: number;
    approvalRate?: number;
    timeDelay?: number;
  };
}

export class LearningRepository {
  private interactions: AIInteraction[] = [];
  private patterns: LearningPattern[] = [];

  /**
   * Record an AI interaction
   */
  async recordInteraction(interaction: Omit<AIInteraction, 'id' | 'timestamp'>): Promise<AIInteraction> {
    const newInteraction: AIInteraction = {
      ...interaction,
      id: `interaction-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };
    
    this.interactions.push(newInteraction);
    await this.analyzePatterns();
    
    return newInteraction;
  }

  /**
   * Get all interactions
   */
  async getInteractions(): Promise<AIInteraction[]> {
    return this.interactions;
  }

  /**
   * Get interactions by type
   */
  async getInteractionsByType(type: 'accepted' | 'rejected' | 'edited'): Promise<AIInteraction[]> {
    return this.interactions.filter(i => i.type === type);
  }

  /**
   * Get common denial reasons
   */
  async getCommonDenialReasons(): Promise<LearningPattern[]> {
    return this.patterns.filter(p => p.patternType === 'denial_reason');
  }

  /**
   * Get common supplement revisions
   */
  async getCommonSupplementRevisions(): Promise<LearningPattern[]> {
    return this.patterns.filter(p => p.patternType === 'supplement_revision');
  }

  /**
   * Get common documentation requests
   */
  async getCommonDocumentationRequests(): Promise<LearningPattern[]> {
    return this.patterns.filter(p => p.patternType === 'documentation_request');
  }

  /**
   * Get carrier preferences
   */
  async getCarrierPreferences(): Promise<LearningPattern[]> {
    return this.patterns.filter(p => p.patternType === 'carrier_preference');
  }

  /**
   * Analyze patterns from interactions
   */
  private async analyzePatterns(): Promise<void> {
    // This would analyze the interactions to identify patterns
    // For now, we'll return mock patterns
    
    this.patterns = [
      {
        id: 'pattern-1',
        patternType: 'denial_reason',
        pattern: 'Insufficient documentation - missing roof photos',
        frequency: 12,
        confidence: 0.85,
        lastObserved: new Date(),
        impact: {
          financial: 45000,
          approvalRate: 0.65
        }
      },
      {
        id: 'pattern-2',
        patternType: 'denial_reason',
        pattern: 'Missing engineer report for claims over $10,000',
        frequency: 8,
        confidence: 0.78,
        lastObserved: new Date(),
        impact: {
          financial: 32000,
          approvalRate: 0.72
        }
      },
      {
        id: 'pattern-3',
        patternType: 'supplement_revision',
        pattern: 'Code upgrade items added during revision',
        frequency: 15,
        confidence: 0.82,
        lastObserved: new Date(),
        impact: {
          financial: 35000,
          approvalRate: 0.88
        }
      },
      {
        id: 'pattern-4',
        patternType: 'documentation_request',
        pattern: 'Carrier requests before/after photos',
        frequency: 20,
        confidence: 0.90,
        lastObserved: new Date(),
        impact: {
          timeDelay: 3
        }
      },
      {
        id: 'pattern-5',
        patternType: 'carrier_preference',
        pattern: 'Liberty Mutual requires engineer reports for large claims',
        frequency: 16,
        confidence: 0.87,
        lastObserved: new Date(),
        impact: {
          approvalRate: 0.92
        }
      }
    ];
  }

  /**
   * Get learning statistics
   */
  async getLearningStatistics(): Promise<{
    totalInteractions: number;
    acceptanceRate: number;
    rejectionRate: number;
    editRate: number;
    patternsIdentified: number;
  }> {
    const total = this.interactions.length;
    const accepted = this.interactions.filter(i => i.type === 'accepted').length;
    const rejected = this.interactions.filter(i => i.type === 'rejected').length;
    const edited = this.interactions.filter(i => i.type === 'edited').length;

    return {
      totalInteractions: total,
      acceptanceRate: total > 0 ? accepted / total : 0,
      rejectionRate: total > 0 ? rejected / total : 0,
      editRate: total > 0 ? edited / total : 0,
      patternsIdentified: this.patterns.length
    };
  }
}

export const learningRepository = new LearningRepository();
