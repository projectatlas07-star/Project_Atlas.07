// apps/api/src/lib/ai-supplement/validation.ts
import { ValidationService, SupplementRecommendations, SupplementGenerationContext, ValidationResult, Issue } from './types';

export { SupplementValidationService as ValidationService };
export class SupplementValidationService implements ValidationService {
  validateRecommendations(
    recommendations: SupplementRecommendations,
    context: SupplementGenerationContext
  ): ValidationResult {
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
      if (!item.category) {
        warnings.push(`Line item ${index + 1} is missing category`);
      }
    });

    // Validate confidence and risk scores
    if (recommendations.confidenceScore < 0 || recommendations.confidenceScore > 1) {
      errors.push('Invalid confidence score');
    }

    if (recommendations.riskScore < 0 || recommendations.riskScore > 1) {
      errors.push('Invalid risk score');
    }

    // Validate damage observations
    recommendations.missingDamageObservations.forEach((obs, index) => {
      if (!obs.location) {
        warnings.push(`Damage observation ${index + 1} is missing location`);
      }
      if (!obs.description) {
        warnings.push(`Damage observation ${index + 1} is missing description`);
      }
    });

    // Validate documentation checklist
    recommendations.documentationChecklist.forEach((item, index) => {
      if (!item.description) {
        warnings.push(`Documentation checklist item ${index + 1} is missing description`);
      }
    });

    // Validate missing information
    recommendations.missingInformation.forEach((item, index) => {
      if (!item.description) {
        warnings.push(`Missing information item ${index + 1} is missing description`);
      }
    });

    // Validate evidence links
    recommendations.evidenceLinks.forEach((link, index) => {
      if (!link.recommendationId) {
        warnings.push(`Evidence link ${index + 1} is missing recommendation ID`);
      }
      if (!link.documentId) {
        warnings.push(`Evidence link ${index + 1} is missing document ID`);
      }
    });

    // Context-specific validations
    if (context.photos.length === 0) {
      warnings.push('No photos available for review - this may impact supplement approval');
    }

    if (context.documents.length === 0) {
      warnings.push('No documents available for review - this may impact supplement approval');
    }

    if (!context.interviewResponses || Object.keys(context.interviewResponses.responses).length === 0) {
      warnings.push('No interview responses available - this may limit AI recommendations');
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

    // Check for high confidence items with no evidence
    recommendations.recommendedLineItems.forEach((item, index) => {
      if (item.confidence > 0.8 && (!item.evidence || item.evidence.length === 0)) {
        issues.push({
          id: `high-confidence-no-evidence-${index}`,
          type: 'warning',
          severity: 'medium',
          message: `Line item "${item.description}" has high confidence (${item.confidence}) but no supporting evidence`,
          recommendation: 'Review this item and add supporting evidence or reduce confidence',
        });
      }
    });

    // Check for low confidence items with high suggested amounts
    recommendations.recommendedLineItems.forEach((item, index) => {
      if (item.confidence < 0.5 && item.suggestedTotalPrice > 1000) {
        issues.push({
          id: `low-confidence-high-amount-${index}`,
          type: 'warning',
          severity: 'high',
          message: `Line item "${item.description}" has low confidence (${item.confidence}) but high suggested amount ($${item.suggestedTotalPrice})`,
          recommendation: 'Review this item carefully or consider removing it',
        });
      }
    });

    // Check for missing high-impact information
    recommendations.missingInformation.forEach((item, index) => {
      if (item.impact === 'high') {
        issues.push({
          id: `missing-high-impact-${index}`,
          type: 'error',
          severity: 'high',
          message: `Missing high-impact information: ${item.description}`,
          recommendation: `Obtain this information from ${item.source} before submitting`,
        });
      }
    });

    // Check for high risk score
    if (recommendations.riskScore > 0.7) {
      issues.push({
        id: 'high-risk-score',
        type: 'warning',
        severity: 'high',
        message: `Overall risk score is high (${Math.round(recommendations.riskScore * 100)}%)`,
        recommendation: 'Review all recommendations carefully and address warnings before submission',
      });
    }

    // Check for low overall confidence
    if (recommendations.confidenceScore < 0.5) {
      issues.push({
        id: 'low-confidence-score',
        type: 'warning',
        severity: 'medium',
        message: `Overall confidence score is low (${Math.round(recommendations.confidenceScore * 100)}%)`,
        recommendation: 'Consider gathering more information before proceeding',
      });
    }

    // Check for duplicate line items
    const descriptions = recommendations.recommendedLineItems.map(item => item.description.toLowerCase());
    const duplicates = descriptions.filter((desc, index) => descriptions.indexOf(desc) !== index);
    if (duplicates.length > 0) {
      issues.push({
        id: 'duplicate-line-items',
        type: 'warning',
        severity: 'medium',
        message: 'Potential duplicate line items detected',
        recommendation: 'Review line items and consolidate or clarify duplicates',
      });
    }

    // Check for unreasonable pricing
    recommendations.recommendedLineItems.forEach((item, index) => {
      if (item.suggestedUnitPrice > 10000) {
        issues.push({
          id: `unreasonable-pricing-${index}`,
          type: 'warning',
          severity: 'medium',
          message: `Line item "${item.description}" has very high unit price ($${item.suggestedUnitPrice})`,
          recommendation: 'Verify pricing is correct and justified',
        });
      }
    });

    // Check for missing documentation
    const requiredDocs = recommendations.documentationChecklist.filter(item => item.status === 'required');
    if (requiredDocs.length > 0) {
      issues.push({
        id: 'missing-required-docs',
        type: 'error',
        severity: 'high',
        message: `${requiredDocs.length} required documentation items are missing`,
        recommendation: 'Gather all required documentation before submission',
      });
    }

    // Check for warnings from AI
    recommendations.warnings.forEach((warning, index) => {
      issues.push({
        id: `ai-warning-${index}`,
        type: 'warning',
        severity: 'medium',
        message: `AI Warning: ${warning}`,
        recommendation: 'Review this warning and address if necessary',
      });
    });

    // Check for context issues
    if (context.existingSupplements.length > 0) {
      const recentSupplements = context.existingSupplements.filter(
        (sup: any) => new Date(sup.submittedAt || sup.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );
      if (recentSupplements.length > 0) {
        issues.push({
          id: 'recent-supplements',
          type: 'info',
          severity: 'low',
          message: `${recentSupplements.length} supplement(s) submitted in the last 30 days`,
          recommendation: 'Consider if additional supplements are appropriate',
        });
      }
    }

    return issues;
  }
}
