import { 
  RecommendationEngine, 
  SupplementGenerationContext, 
  SupplementRecommendations, 
  VersionComparison,
  PromptBuilder,
  AIProvider,
  ResultParser,
  ValidationService
} from './types';

export class SupplementRecommendationEngine implements RecommendationEngine {
  private promptBuilder: PromptBuilder;
  private aiProvider: AIProvider;
  private resultParser: ResultParser;
  private validationService: ValidationService;

  constructor(
    promptBuilder: PromptBuilder,
    aiProvider: AIProvider,
    resultParser: ResultParser,
    validationService: ValidationService
  ) {
    this.promptBuilder = promptBuilder;
    this.aiProvider = aiProvider;
    this.resultParser = resultParser;
    this.validationService = validationService;
  }

  async generateRecommendations(
    context: SupplementGenerationContext
  ): Promise<SupplementRecommendations> {
    // Build the prompt
    const prompt = this.promptBuilder.buildSupplementPrompt(context);
    const systemPrompt = this.promptBuilder.buildSystemPrompt();

    // Generate AI completion
    const aiResponse = await this.aiProvider.generateCompletion({
      prompt,
      systemPrompt,
      temperature: 0.7,
      maxTokens: 4000,
    });

    // Parse the AI response
    const recommendations = this.resultParser.parseSupplementRecommendations(
      aiResponse.content,
      context
    );

    // Validate the recommendations
    const validationResult = this.validationService.validateRecommendations(
      recommendations,
      context
    );

    if (!validationResult.isValid) {
      throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
    }

    // Add warnings to the recommendations
    if (validationResult.warnings.length > 0) {
      recommendations.warnings.push(...validationResult.warnings);
    }

    return recommendations;
  }

  compareVersions(
    version1: SupplementRecommendations,
    version2: SupplementRecommendations
  ): VersionComparison {
    const changes: any[] = [];

    // Compare line items
    this.compareLineItems(version1, version2, changes);

    // Compare damage observations
    this.compareDamageObservations(version1, version2, changes);

    // Compare documentation checklist
    this.compareDocumentationChecklist(version1, version2, changes);

    // Compare missing information
    this.compareMissingInformation(version1, version2, changes);

    // Compare confidence and risk scores
    this.compareScores(version1, version2, changes);

    // Generate summary
    const summary = this.generateComparisonSummary(changes, version1, version2);

    return {
      version1: version1.version,
      version2: version2.version,
      changes,
      summary,
    };
  }

  private compareLineItems(
    version1: SupplementRecommendations,
    version2: SupplementRecommendations,
    changes: any[]
  ): void {
    const v1Items = new Map(version1.recommendedLineItems.map(item => [item.id, item]));
    const v2Items = new Map(version2.recommendedLineItems.map(item => [item.id, item]));

    // Check for added items
    for (const [id, item] of v2Items) {
      if (!v1Items.has(id)) {
        changes.push({
          type: 'added',
          category: 'lineItem',
          description: `Added line item: ${item.description}`,
          newValue: item,
          impact: item.suggestedTotalPrice > 1000 ? 'high' : 'medium',
        });
      }
    }

    // Check for removed items
    for (const [id, item] of v1Items) {
      if (!v2Items.has(id)) {
        changes.push({
          type: 'removed',
          category: 'lineItem',
          description: `Removed line item: ${item.description}`,
          oldValue: item,
          impact: item.suggestedTotalPrice > 1000 ? 'high' : 'medium',
        });
      }
    }

    // Check for modified items
    for (const [id, v1Item] of v1Items) {
      const v2Item = v2Items.get(id);
      if (v2Item) {
        if (v1Item.suggestedQuantity !== v2Item.suggestedQuantity) {
          changes.push({
            type: 'modified',
            category: 'quantity',
            description: `Modified quantity for ${v1Item.description}`,
            oldValue: v1Item.suggestedQuantity,
            newValue: v2Item.suggestedQuantity,
            impact: Math.abs(v2Item.suggestedQuantity - v1Item.suggestedQuantity) > 5 ? 'high' : 'medium',
          });
        }

        if (v1Item.suggestedUnitPrice !== v2Item.suggestedUnitPrice) {
          changes.push({
            type: 'modified',
            category: 'pricing',
            description: `Modified unit price for ${v1Item.description}`,
            oldValue: v1Item.suggestedUnitPrice,
            newValue: v2Item.suggestedUnitPrice,
            impact: Math.abs(v2Item.suggestedUnitPrice - v1Item.suggestedUnitPrice) > 100 ? 'high' : 'medium',
          });
        }

        if (v1Item.description !== v2Item.description) {
          changes.push({
            type: 'modified',
            category: 'lineItem',
            description: `Modified description for line item`,
            oldValue: v1Item.description,
            newValue: v2Item.description,
            impact: 'low',
          });
        }
      }
    }
  }

  private compareDamageObservations(
    version1: SupplementRecommendations,
    version2: SupplementRecommendations,
    changes: any[]
  ): void {
    const v1Obs = new Map(version1.missingDamageObservations.map(obs => [obs.id, obs]));
    const v2Obs = new Map(version2.missingDamageObservations.map(obs => [obs.id, obs]));

    // Check for added observations
    for (const [id, obs] of v2Obs) {
      if (!v1Obs.has(id)) {
        changes.push({
          type: 'added',
          category: 'observation',
          description: `Added damage observation: ${obs.location} - ${obs.description}`,
          newValue: obs,
          impact: obs.severity === 'high' ? 'high' : 'medium',
        });
      }
    }

    // Check for removed observations
    for (const [id, obs] of v1Obs) {
      if (!v2Obs.has(id)) {
        changes.push({
          type: 'removed',
          category: 'observation',
          description: `Removed damage observation: ${obs.location} - ${obs.description}`,
          oldValue: obs,
          impact: obs.severity === 'high' ? 'high' : 'medium',
        });
      }
    }
  }

  private compareDocumentationChecklist(
    version1: SupplementRecommendations,
    version2: SupplementRecommendations,
    changes: any[]
  ): void {
    const v1Docs = new Map(version1.documentationChecklist.map(doc => [doc.id, doc]));
    const v2Docs = new Map(version2.documentationChecklist.map(doc => [doc.id, doc]));

    // Check for added documentation requirements
    for (const [id, doc] of v2Docs) {
      if (!v1Docs.has(id)) {
        changes.push({
          type: 'added',
          category: 'documentation',
          description: `Added documentation requirement: ${doc.description}`,
          newValue: doc,
          impact: doc.status === 'required' ? 'high' : 'low',
        });
      }
    }

    // Check for removed documentation requirements
    for (const [id, doc] of v1Docs) {
      if (!v2Docs.has(id)) {
        changes.push({
          type: 'removed',
          category: 'documentation',
          description: `Removed documentation requirement: ${doc.description}`,
          oldValue: doc,
          impact: doc.status === 'required' ? 'high' : 'low',
        });
      }
    }
  }

  private compareMissingInformation(
    version1: SupplementRecommendations,
    version2: SupplementRecommendations,
    changes: any[]
  ): void {
    const v1Missing = new Map(version1.missingInformation.map(item => [item.id, item]));
    const v2Missing = new Map(version2.missingInformation.map(item => [item.id, item]));

    // Check for added missing information
    for (const [id, item] of v2Missing) {
      if (!v1Missing.has(id)) {
        changes.push({
          type: 'added',
          category: 'missingInfo',
          description: `Added missing information: ${item.description}`,
          newValue: item,
          impact: item.impact === 'high' ? 'high' : 'low',
        });
      }
    }

    // Check for removed missing information
    for (const [id, item] of v1Missing) {
      if (!v2Missing.has(id)) {
        changes.push({
          type: 'removed',
          category: 'missingInfo',
          description: `Removed missing information: ${item.description}`,
          oldValue: item,
          impact: item.impact === 'high' ? 'high' : 'low',
        });
      }
    }
  }

  private compareScores(
    version1: SupplementRecommendations,
    version2: SupplementRecommendations,
    changes: any[]
  ): void {
    if (version1.confidenceScore !== version2.confidenceScore) {
      changes.push({
        type: 'modified',
        category: 'score',
        description: `Confidence score changed`,
        oldValue: version1.confidenceScore,
        newValue: version2.confidenceScore,
        impact: Math.abs(version2.confidenceScore - version1.confidenceScore) > 0.2 ? 'medium' : 'low',
      });
    }

    if (version1.riskScore !== version2.riskScore) {
      changes.push({
        type: 'modified',
        category: 'score',
        description: `Risk score changed`,
        oldValue: version1.riskScore,
        newValue: version2.riskScore,
        impact: Math.abs(version2.riskScore - version1.riskScore) > 0.2 ? 'medium' : 'low',
      });
    }
  }

  private generateComparisonSummary(changes: any[], version1: SupplementRecommendations, version2: SupplementRecommendations): string {
    const summaryParts: string[] = [];

    const added = changes.filter(c => c.type === 'added').length;
    const removed = changes.filter(c => c.type === 'removed').length;
    const modified = changes.filter(c => c.type === 'modified').length;

    if (added > 0) summaryParts.push(`${added} item(s) added`);
    if (removed > 0) summaryParts.push(`${removed} item(s) removed`);
    if (modified > 0) summaryParts.push(`${modified} item(s) modified`);

    if (summaryParts.length === 0) {
      return 'No changes detected between versions';
    }

    return summaryParts.join(', ');
  }
}