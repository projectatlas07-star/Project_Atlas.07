// apps/api/src/lib/ai-supplement/result-parser.ts
import { ResultParser, SupplementRecommendations, SupplementGenerationContext, ValidationResult } from './types';

export { SupplementResultParser as ResultParser };
export class SupplementResultParser implements ResultParser {
  parseSupplementRecommendations(
    aiResponse: string,
    context: SupplementGenerationContext
  ): SupplementRecommendations {
    try {
      // Extract JSON from AI response (handle markdown code blocks)
      const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/) || aiResponse.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : aiResponse;
      
      const parsed = JSON.parse(jsonString);
      
      // Calculate confidence and risk scores
      const confidenceScore = this.calculateConfidenceScore(parsed);
      const riskScore = this.calculateRiskScore(parsed, context);

      return {
        version: 1,
        generatedAt: new Date().toISOString(),
        confidenceScore,
        riskScore,
        missingDamageObservations: this.parseDamageObservations(parsed.missingDamageObservations || []),
        recommendedLineItems: this.parseRecommendedLineItems(parsed.recommendedLineItems || []),
        suggestedQuantities: this.parseQuantitySuggestions(parsed.suggestedQuantities || []),
        suggestedPricing: this.parsePricingSuggestions(parsed.suggestedPricing || []),
        supportingJustification: parsed.supportingJustification || '',
        documentationChecklist: this.parseDocumentationChecklist(parsed.documentationChecklist || []),
        missingInformation: this.parseMissingInformation(parsed.missingInformation || []),
        questionsForEstimator: parsed.questionsForEstimator || [],
        warnings: parsed.warnings || [],
        evidenceLinks: this.parseEvidenceLinks(parsed.evidenceLinks || []),
        aiExplanation: this.parseAIExplanation(parsed.aiExplanation || {}),
      };
    } catch (error) {
      throw new Error(`Failed to parse AI response: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  validateRecommendations(recommendations: SupplementRecommendations): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate required fields
    if (!recommendations.supportingJustification) {
      errors.push('Supporting justification is required');
    }

    if (recommendations.recommendedLineItems.length === 0) {
      warnings.push('No recommended line items provided');
    }

    // Validate line items
    recommendations.recommendedLineItems.forEach((item, index) => {
      if (!item.description) {
        errors.push(`Line item ${index + 1} is missing description`);
      }
      if (item.suggestedQuantity <= 0) {
        errors.push(`Line item ${index + 1} has invalid quantity`);
      }
      if (item.suggestedUnitPrice < 0) {
        errors.push(`Line item ${index + 1} has invalid unit price`);
      }
      if (item.confidence < 0 || item.confidence > 1) {
        warnings.push(`Line item ${index + 1} has invalid confidence score`);
      }
    });

    // Validate confidence and risk scores
    if (recommendations.confidenceScore < 0 || recommendations.confidenceScore > 1) {
      errors.push('Invalid confidence score');
    }

    if (recommendations.riskScore < 0 || recommendations.riskScore > 1) {
      errors.push('Invalid risk score');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private calculateConfidenceScore(parsed: any): number {
    if (!parsed.recommendedLineItems || parsed.recommendedLineItems.length === 0) {
      return 0;
    }

    const confidences = parsed.recommendedLineItems.map((item: any) => item.confidence || 0.5);
    const average = confidences.reduce((sum: number, conf: number) => sum + conf, 0) / confidences.length;
    
    // Adjust based on evidence
    const hasEvidence = parsed.recommendedLineItems.some((item: any) => 
      item.evidence && item.evidence.length > 0
    );
    
    return hasEvidence ? Math.min(1, average + 0.1) : average;
  }

  private calculateRiskScore(parsed: any, context: SupplementGenerationContext): number {
    let risk = 0;

    // High risk if missing information
    if (parsed.missingInformation && parsed.missingInformation.length > 0) {
      const highImpactMissing = parsed.missingInformation.filter((item: any) => item.impact === 'high').length;
      risk += highImpactMissing * 0.15;
    }

    // High risk if many warnings
    if (parsed.warnings && parsed.warnings.length > 0) {
      risk += parsed.warnings.length * 0.05;
    }

    // High risk if low confidence items
    if (parsed.recommendedLineItems) {
      const lowConfidenceItems = parsed.recommendedLineItems.filter((item: any) => item.confidence < 0.5).length;
      risk += lowConfidenceItems * 0.1;
    }

    // High risk if no documents
    if (context.documents.length === 0) {
      risk += 0.2;
    }

    // High risk if no photos
    if (context.photos.length === 0) {
      risk += 0.15;
    }

    return Math.min(1, risk);
  }

  private parseDamageObservations(observations: any[]): any[] {
    return observations.map(obs => ({
      id: obs.id || crypto.randomUUID(),
      location: obs.location || '',
      description: obs.description || '',
      severity: obs.severity || 'medium',
      confidence: obs.confidence || 0.5,
      evidence: obs.evidence || [],
      interviewAnswers: obs.interviewAnswers || [],
    }));
  }

  private parseRecommendedLineItems(items: any[]): any[] {
    return items.map(item => ({
      id: item.id || crypto.randomUUID(),
      description: item.description || '',
      category: item.category || 'Other',
      suggestedQuantity: item.suggestedQuantity || 1,
      suggestedUnit: item.suggestedUnit || 'EA',
      suggestedUnitPrice: item.suggestedUnitPrice || 0,
      suggestedTotalPrice: item.suggestedTotalPrice || (item.suggestedQuantity * item.suggestedUnitPrice),
      confidence: item.confidence || 0.5,
      justification: item.justification || '',
      evidence: item.evidence || [],
      interviewAnswers: item.interviewAnswers || [],
      documents: item.documents || [],
    }));
  }

  private parseQuantitySuggestions(suggestions: any[]): any[] {
    return suggestions.map(suggestion => ({
      lineItemId: suggestion.lineItemId || '',
      currentQuantity: suggestion.currentQuantity || 0,
      suggestedQuantity: suggestion.suggestedQuantity || 0,
      reason: suggestion.reason || '',
      confidence: suggestion.confidence || 0.5,
    }));
  }

  private parsePricingSuggestions(suggestions: any[]): any[] {
    return suggestions.map(suggestion => ({
      lineItemId: suggestion.lineItemId || '',
      currentUnitPrice: suggestion.currentUnitPrice || 0,
      suggestedUnitPrice: suggestion.suggestedUnitPrice || 0,
      reason: suggestion.reason || '',
      confidence: suggestion.confidence || 0.5,
      marketData: suggestion.marketData || '',
    }));
  }

  private parseDocumentationChecklist(items: any[]): any[] {
    return items.map(item => ({
      id: item.id || crypto.randomUUID(),
      description: item.description || '',
      type: item.type || 'document',
      status: item.status || 'recommended',
      reason: item.reason || '',
    }));
  }

  private parseMissingInformation(items: any[]): any[] {
    return items.map(item => ({
      id: item.id || crypto.randomUUID(),
      description: item.description || '',
      impact: item.impact || 'medium',
      source: item.source || '',
    }));
  }

  private parseEvidenceLinks(links: any[]): any[] {
    return links.map(link => ({
      recommendationId: link.recommendationId || '',
      documentId: link.documentId || '',
      documentType: link.documentType || '',
      relevance: link.relevance || 'medium',
      description: link.description || '',
    }));
  }

  private parseAIExplanation(explanation: any): any {
    return {
      overallApproach: explanation.overallApproach || '',
      dataSourcesAnalyzed: explanation.dataSourcesAnalyzed || [],
      confidenceFactors: explanation.confidenceFactors || [],
      limitations: explanation.limitations || [],
      recommendations: explanation.recommendations || [],
    };
  }
}
