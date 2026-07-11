/**
 * Project Atlas AI Services
 * 
 * This package provides AI functionality for supplement generation
 * and other AI-powered features with a modular architecture.
 */

export * from './types';
export { SupplementPromptBuilder } from './prompt-builder';
export { OpenAIProvider } from './providers/openai';
export { SupplementResultParser } from './result-parser';
export { SupplementValidationService } from './validation';
export { SupplementRecommendationEngine } from './engine';

import { SupplementRecommendationEngine } from './engine';
import { SupplementPromptBuilder } from './prompt-builder';
import { OpenAIProvider } from './providers/openai';
import { SupplementResultParser } from './result-parser';
import { SupplementValidationService } from './validation';
import { AIServiceConfig } from './types';

export interface AISupplementRequest {
  claimId: string;
  supplementId: string;
  context: {
    claim: any;
    property?: any;
    documents?: any[];
    interviewResponses?: any;
  };
}

export interface AISupplementResponse {
  supplementId: string;
  recommendations: any;
  confidence: number;
  generatedAt: string;
}

export interface AIConfig extends AIServiceConfig {
  openaiApiKey?: string;
  model?: string;
}

/**
 * AI Supplement Service - Simplified interface for Route Handlers
 * 
 * This provides a thin wrapper around the modular engine for easier use in Next.js Route Handlers.
 */
export class AISupplementService {
  private engine: SupplementRecommendationEngine;
  private config: AIConfig;

  constructor(config: AIConfig = {}) {
    this.config = {
      model: 'gpt-4',
      ...config,
    };

    // Initialize the modular components
    const promptBuilder = new SupplementPromptBuilder();
    const aiProvider = new OpenAIProvider(
      config.openaiApiKey || process.env.OPENAI_API_KEY || '',
      {
        defaultModel: this.config.model,
      }
    );
    const resultParser = new SupplementResultParser();
    const validationService = new SupplementValidationService();

    // Initialize the engine
    this.engine = new SupplementRecommendationEngine(
      promptBuilder,
      aiProvider,
      resultParser,
      validationService
    );
  }

  /**
   * Check if the AI service is properly configured
   */
  isConfigured(): boolean {
    return !!this.config.openaiApiKey || !!process.env.OPENAI_API_KEY;
  }

  /**
   * Generate supplement recommendations using AI (thin wrapper around modular engine)
   */
  async generateSupplementRecommendations(
    request: AISupplementRequest
  ): Promise<AISupplementResponse> {
    if (!this.isConfigured()) {
      throw new Error(
        'AI service is not configured. Please set OPENAI_API_KEY environment variable.'
      );
    }

    try {
      // Map the simplified request to the engine's context format
      const context = {
        claim: request.context.claim,
        property: request.context.property,
        documents: request.context.documents,
        interviewResponses: request.context.interviewResponses ? {
          responses: request.context.interviewResponses
        } : undefined,
      };

      // Use the modular engine
      const recommendations = await this.engine.generateRecommendations(context);

      return {
        supplementId: request.supplementId,
        recommendations,
        confidence: recommendations.confidenceScore,
        generatedAt: recommendations.generatedAt,
      };
    } catch (error) {
      console.error('AI supplement generation error:', error);
      throw new Error(`Failed to generate AI supplement recommendations: ${error}`);
    }
  }

  /**
   * Get the underlying engine for advanced usage
   */
  getEngine(): SupplementRecommendationEngine {
    return this.engine;
  }
}

/**
 * Create a configured AI service instance
 */
export function createAIService(config?: AIConfig): AISupplementService {
  const openaiApiKey = config?.openaiApiKey || process.env.OPENAI_API_KEY;
  return new AISupplementService({
    ...config,
    openaiApiKey,
  });
}

/**
 * Create a modular AI engine instance for advanced usage
 */
export function createAIEngine(config?: AIConfig): SupplementRecommendationEngine {
  const openaiApiKey = config?.openaiApiKey || process.env.OPENAI_API_KEY || '';
  const promptBuilder = new SupplementPromptBuilder();
  const aiProvider = new OpenAIProvider(openaiApiKey, {
    defaultModel: config?.model || 'gpt-4',
  });
  const resultParser = new SupplementResultParser();
  const validationService = new SupplementValidationService();

  return new SupplementRecommendationEngine(
    promptBuilder,
    aiProvider,
    resultParser,
    validationService
  );
}