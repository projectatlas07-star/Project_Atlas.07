import { ValidationService, SupplementRecommendations, SupplementGenerationContext, Issue, ValidationResult } from './types';

export class SupplementValidationService implements ValidationService {
  validateRecommendations(
    recommendations: SupplementRecommendations,
    context: SupplementGenerationContext
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for data consistency with context
    if (context.existingSupplements && context.existingSupplements.length > 0) {
      const existingTotal = context.existingSupplements.reduce((sum, sup) => sum + sup.approvedAmount, 0);
      const newTotal = recommendations.recommendedLineItems.reduce((sum, item) => sum + item.suggestedTotalPrice, 0);

      if (newTotal > existingTotal * 10) {
        warnings.push(`New supplement total ($${newTotal}) is significantly higher than existing total ($${existingTotal})`);
      }
    }

    // Check for realistic pricing
    recommendations.recommendedLineItems.forEach(item => {
      if (item.suggestedUnitPrice > 10000) {
        warnings.push(`Unit price for "${item.description}" is unusually high: $${item.suggestedUnitPrice}`);
      }
      if (item.suggestedQuantity > 1000) {
        warnings.push(`Quantity for "${item.description}" is unusually high: ${item.suggestedQuantity}`);
      }
    });

    // Check for missing critical information
    if (!context.claim.claimNumber) {
      errors.push('Claim number is missing from context');
    }

    if (!context.claim.insuranceCompany) {
      warnings.push('Insurance company is missing from context');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  checkForIssues(
    recommendations: SupplementRecommendations,
    context: SupplementGenerationContext
  ): Issue[] {
    const issues: Issue[] = [];

    // Check for low confidence recommendations
    recommendations.recommendedLineItems.forEach(item => {
      if (item.confidence < 0.5) {
        issues.push({
          id: `low-confidence-${item.id}`,
          type: 'warning',
          severity: 'medium',
          message: `Low confidence for "${item.description}": ${item.confidence}`,
          recommendation: 'Consider manual review or additional documentation',
        });
      }
    });

    // Check for high severity damage observations
    recommendations.missingDamageObservations.forEach(obs => {
      if (obs.severity === 'high' && obs.confidence < 0.7) {
        issues.push({
          id: `high-severity-low-confidence-${obs.id}`,
          type: 'warning',
          severity: 'high',
          message: `High severity damage observation with low confidence: ${obs.location}`,
          recommendation: 'Recommend field inspection to confirm',
        });
      }
    });

    // Check for missing documentation
    recommendations.documentationChecklist.forEach(doc => {
      if (doc.status === 'required' && !context.documents?.some(d => d.type === doc.type)) {
        issues.push({
          id: `missing-doc-${doc.id}`,
          type: 'error',
          severity: 'high',
          message: `Required documentation missing: ${doc.description}`,
          recommendation: `Upload ${doc.type} before submission`,
        });
      }
    });

    return issues;
  }
}