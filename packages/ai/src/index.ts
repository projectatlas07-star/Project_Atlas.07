/**
 * Project Atlas AI Services
 * 
 * This package provides AI functionality for supplement generation
 * and other AI-powered features.
 */

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

export interface AIServiceConfig {
  openaiApiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * AI Supplement Service
 * 
 * Handles AI-powered supplement generation using OpenAI
 */
export class AISupplementService {
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig = {}) {
    this.config = {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 4000,
      ...config,
    };
  }

  /**
   * Check if the AI service is properly configured
   */
  isConfigured(): boolean {
    return !!this.config.openaiApiKey;
  }

  /**
   * Generate supplement recommendations using AI
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
      // Import OpenAI dynamically to avoid build issues if not installed
      const OpenAI = require('openai');
      const openai = new OpenAI({
        apiKey: this.config.openaiApiKey,
      });

      // Build the prompt from context
      const prompt = this.buildPrompt(request.context);

      // Generate completion
      const completion = await openai.chat.completions.create({
        model: this.config.model || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt(),
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
      });

      const content = completion.choices[0]?.message?.content || '';

      // Parse the response
      const recommendations = this.parseAIResponse(content);

      return {
        supplementId: request.supplementId,
        recommendations,
        confidence: this.calculateConfidence(recommendations),
        generatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('AI supplement generation error:', error);
      throw new Error(`Failed to generate AI supplement recommendations: ${error}`);
    }
  }

  private getSystemPrompt(): string {
    return `You are an expert insurance restoration supplement analyst with deep knowledge of:
- Insurance claim processing and supplement workflows
- Construction damage assessment and repair methodologies
- Xactimate and industry-standard pricing
- Carrier supplement review processes
- Documentation requirements for successful supplement approval

Your role is to analyze claim information and generate professional supplement recommendations in JSON format.`;
  }

  private buildPrompt(context: any): string {
    const sections: string[] = [];

    if (context.claim) {
      sections.push(`CLAIM INFORMATION:
- Claim Number: ${context.claim.claimNumber}
- Insurance Company: ${context.claim.insuranceCompany}
- Date of Loss: ${context.claim.dateOfLoss}
- Description: ${context.claim.description}
- Status: ${context.claim.status}`);
    }

    if (context.property) {
      sections.push(`PROPERTY INFORMATION:
- Address: ${context.property.address}`);
    }

    if (context.interviewResponses) {
      sections.push(`INTERVIEW RESPONSES:
${JSON.stringify(context.interviewResponses, null, 2)}`);
    }

    sections.push(`Generate supplement recommendations in JSON format with:
- missingDamageObservations
- recommendedLineItems
- suggestedQuantities
- suggestedPricing
- supportingJustification
- documentationChecklist
- missingInformation
- confidence assessment`);

    return sections.join('\n\n');
  }

  private parseAIResponse(content: string): any {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      // Fallback: return structured error
      return {
        error: 'Could not parse AI response as JSON',
        rawContent: content,
      };
    } catch (error) {
      return {
        error: 'Failed to parse AI response',
        rawContent: content,
      };
    }
  }

  private calculateConfidence(recommendations: any): number {
    // Simple confidence calculation based on data quality
    if (recommendations.error) {
      return 0.0;
    }
    
    let confidence = 0.5;
    if (recommendations.recommendedLineItems?.length > 0) {
      confidence += 0.2;
    }
    if (recommendations.missingDamageObservations?.length > 0) {
      confidence += 0.2;
    }
    if (recommendations.documentationChecklist?.length > 0) {
      confidence += 0.1;
    }
    
    return Math.min(confidence, 1.0);
  }
}

/**
 * Create a configured AI service instance
 */
export function createAIService(config?: AIServiceConfig): AISupplementService {
  const openaiApiKey = config?.openaiApiKey || process.env.OPENAI_API_KEY;
  return new AISupplementService({
    ...config,
    openaiApiKey,
  });
}