import { ResultParser, SupplementRecommendations, SupplementGenerationContext, ValidationResult } from './types';

export class SupplementResultParser implements ResultParser {
  parseSupplementRecommendations(
    aiResponse: string,
    context: SupplementGenerationContext
  ): SupplementRecommendations {
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Validate required fields
      if (!parsed.missingDamageObservations) parsed.missingDamageObservations = [];
      if (!parsed.recommendedLineItems) parsed.recommendedLineItems = [];
      if (!parsed.suggestedQuantities) parsed.suggestedQuantities = [];
      if (!parsed.suggestedPricing) parsed.suggestedPricing = [];
      if (!parsed.documentationChecklist) parsed.documentationChecklist = [];
      if (!parsed.missingInformation) parsed.missingInformation = [];
      if (!parsed.questionsForEstimator) parsed.questionsForEstimator = [];
      if (!parsed.warnings) parsed.warnings = [];
      if (!parsed.evidenceLinks) parsed.evidenceLinks = [];
      if (!parsed.aiExplanation) {
        parsed.aiExplanation = {
          overallApproach: 'Standard analysis approach',
          dataSourcesAnalyzed: [],
          confidenceFactors: [],
          limitations: [],
          recommendations: [],
        };
      }

      return {
        version: 1,
        generatedAt: new Date().toISOString(),
        confidenceScore: this.calculateConfidence(parsed),
        riskScore: this.calculateRiskScore(parsed),
        ...parsed,
      };
    } catch (error) {
      throw new Error(`Failed to parse AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  validateRecommendations(recommendations: SupplementRecommendations): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for required fields
    if (!recommendations.missingDamageObservations || !Array.isArray(recommendations.missingDamageObservations)) {
      errors.push('missingDamageObservations must be an array');
    }

    if (!recommendations.recommendedLineItems || !Array.isArray(recommendations.recommendedLineItems)) {
      errors.push('recommendedLineItems must be an array');
    }

    if (!recommendations.confidenceScore || recommendations.confidenceScore < 0 || recommendations.confidenceScore > 1) {
      warnings.push('confidenceScore should be between 0 and 1');
    }

    if (!recommendations.riskScore || recommendations.riskScore < 0 || recommendations.riskScore > 1) {
      warnings.push('riskScore should be between 0 and 1');
    }

    // Check line item validity
    recommendations.recommendedLineItems.forEach((item, index) => {
      if (!item.id) {
        errors.push(`Line item ${index} missing id`);
      }
      if (!item.description) {
        errors.push(`Line item ${index} missing description`);
      }
      if (!item.suggestedQuantity || item.suggestedQuantity <= 0) {
        errors.push(`Line item ${index} has invalid quantity`);
      }
      if (!item.suggestedUnitPrice || item.suggestedUnitPrice <= 0) {
        errors.push(`Line item ${index} has invalid unit price`);
      }
      if (item.confidence === undefined || item.confidence < 0 || item.confidence > 1) {
        warnings.push(`Line item ${index} has invalid confidence`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private calculateConfidence(recommendations: any): number {
    let confidence = 0.5;

    if (recommendations.recommendedLineItems?.length > 0) {
      confidence += 0.2;
    }

    if (recommendations.missingDamageObservations?.length > 0) {
      confidence += 0.1;
    }

    if (recommendations.documentationChecklist?.length > 0) {
      confidence += 0.1;
    }

    if (recommendations.evidenceLinks?.length > 0) {
      confidence += 0.1;
    }

    return Math.min(confidence, 1.0);
  }

  private calculateRiskScore(recommendations: any): number {
    let risk = 0.0;

    // High risk if no line items
    if (!recommendations.recommendedLineItems || recommendations.recommendedLineItems.length === 0) {
      risk += 0.5;
    }

    // High risk if missing information
    if (recommendations.missingInformation?.length > 0) {
      const highImpactItems = recommendations.missingInformation.filter((item: any) => item.impact === 'high');
      risk += Math.min(highImpactItems.length * 0.2, 0.5);
    }

    return Math.min(risk, 1.0);
  }
}