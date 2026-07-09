// apps/api/src/lib/ai-supplement/prompt-builder.ts
import { PromptBuilder, SupplementGenerationContext } from './types';

export { SupplementPromptBuilder as PromptBuilder };
export class SupplementPromptBuilder implements PromptBuilder {
  buildSupplementPrompt(context: SupplementGenerationContext): string {
    const sections: string[] = [];

    // Claim Information
    sections.push(this.formatClaimSection(context.claim));

    // Property Information
    sections.push(this.formatPropertySection(context.property));

    // Customer Information
    sections.push(this.formatCustomerSection(context.customer));

    // Interview Responses
    sections.push(this.formatInterviewSection(context.interviewResponses));

    // Adjuster Information
    if (context.adjuster) {
      sections.push(this.formatAdjusterSection(context.adjuster));
    }

    // Existing Supplements
    if (context.existingSupplements.length > 0) {
      sections.push(this.formatExistingSupplementsSection(context.existingSupplements));
    }

    // Documents
    if (context.documents.length > 0) {
      sections.push(this.formatDocumentsSection(context.documents));
    }

    // Photos
    if (context.photos.length > 0) {
      sections.push(this.formatPhotosSection(context.photos));
    }

    // Activity Timeline
    if (context.activityTimeline.length > 0) {
      sections.push(this.formatActivityTimelineSection(context.activityTimeline));
    }

    // Task Instructions
    sections.push(this.formatTaskInstructions());

    return sections.join('\n\n');
  }

  buildSystemPrompt(): string {
    return `You are an expert insurance restoration supplement analyst with deep knowledge of:
- Insurance claim processing and supplement workflows
- Construction damage assessment and repair methodologies
- Xactimate and industry-standard pricing
- Carrier supplement review processes
- Documentation requirements for successful supplement approval

Your role is to analyze claim information and generate professional supplement recommendations that:
1. Identify missing damage observations
2. Recommend appropriate line items with quantities and pricing
3. Provide clear justification for each recommendation
4. Link recommendations to supporting evidence
5. Flag missing information that could impact approval
6. Assess confidence levels for each recommendation
7. Identify potential risks or issues

Always be thorough, accurate, and conservative in your estimates. Never suggest items without evidence.
Provide clear explanations for why each recommendation is made.
`;
  }

  private formatClaimSection(claim: any): string {
    return `## CLAIM INFORMATION
- Claim Number: ${claim.claimNumber}
- Insurance Company: ${claim.insuranceCompany}
- Policy Number: ${claim.policyNumber}
- Date of Loss: ${claim.dateOfLoss}
- Cause of Loss: ${claim.causeOfLoss}
- Description: ${claim.description}
- Status: ${claim.status}
- Deductible: ${claim.deductible ? `$${claim.deductible}` : 'N/A'}
- Total Approved: ${claim.totalApproved ? `$${claim.totalApproved}` : 'N/A'}
- Total Requested: ${claim.totalRequested ? `$${claim.totalRequested}` : 'N/A'}`;
  }

  private formatPropertySection(property: any): string {
    return `## PROPERTY INFORMATION
- Address: ${property.address}
- Property Type: ${property.type}
- Year Built: ${property.yearBuilt || 'N/A'}
- Square Footage: ${property.squareFootage || 'N/A'}
- Occupancy: ${property.occupancy || 'N/A'}`;
  }

  private formatCustomerSection(customer: any): string {
    return `## CUSTOMER INFORMATION
- Name: ${customer.name}
- Phone: ${customer.phone}
- Email: ${customer.email}
- Address: ${customer.address || 'N/A'}`;
  }

  private formatInterviewSection(interview: any): string {
    const responseLines = Object.entries(interview.responses).map(([key, value]) => {
      return `- ${key}: ${JSON.stringify(value)}`;
    }).join('\n');

    return `## INTERVIEW RESPONSES
- Interview Number: ${interview.interviewNumber}
- Template: ${interview.templateName}
- Completed: ${interview.completedAt}

Responses:
${responseLines}`;
  }

  private formatAdjusterSection(adjuster: any): string {
    return `## ADJUSTER INFORMATION
- Name: ${adjuster.name}
- Phone: ${adjuster.phone}
- Email: ${adjuster.email}
- Company: ${adjuster.company}`;
  }

  private formatExistingSupplementsSection(supplements: any[]): string {
    const supplementLines = supplements.map(sup => {
      const lineItems = sup.lineItems.map((item: any) => {
        return `  - ${item.description}: ${item.quantity} ${item.unit} @ $${item.unitPrice} = $${item.totalPrice}`;
      }).join('\n');

      return `- Supplement ${sup.supplementNumber} (${sup.status})
  Requested: $${sup.requestedAmount}
  Approved: $${sup.approvedAmount}
  Line Items:
${lineItems}`;
    }).join('\n\n');

    return `## EXISTING SUPPLEMENTS
${supplementLines}`;
  }

  private formatDocumentsSection(documents: any[]): string {
    const docLines = documents.map(doc => {
      return `- ${doc.name} (${doc.type}) - Uploaded: ${doc.uploadedAt}`;
    }).join('\n');

    return `## DOCUMENTS
${docLines}`;
  }

  private formatPhotosSection(photos: any[]): string {
    const photoLines = photos.map(photo => {
      return `- ${photo.description || 'Untitled'} - Location: ${photo.location || 'N/A'} - Uploaded: ${photo.uploadedAt}`;
    }).join('\n');

    return `## PHOTOS
${photoLines}`;
  }

  private formatActivityTimelineSection(activities: any[]): string {
    const activityLines = activities.slice(-10).map(activity => {
      return `- ${activity.createdAt}: ${activity.description} by ${activity.userName}`;
    }).join('\n');

    return `## RECENT ACTIVITY
${activityLines}`;
  }

  private formatTaskInstructions(): string {
    return `## TASK

Based on the information above, generate a comprehensive supplement recommendation in JSON format with the following structure:

{
  "missingDamageObservations": [
    {
      "id": "unique-id",
      "location": "e.g., 'Roof - South Slope'",
      "description": "Detailed description of damage",
      "severity": "low|medium|high",
      "confidence": 0.0-1.0,
      "evidence": ["list of evidence sources"],
      "interviewAnswers": ["list of relevant interview answers"]
    }
  ],
  "recommendedLineItems": [
    {
      "id": "unique-id",
      "description": "Line item description",
      "category": "e.g., 'Roofing', 'Drywall', 'Plumbing'",
      "suggestedQuantity": number,
      "suggestedUnit": "e.g., 'SQ', 'LF', 'EA'",
      "suggestedUnitPrice": number,
      "suggestedTotalPrice": number,
      "confidence": 0.0-1.0,
      "justification": "Why this item is recommended",
      "evidence": ["list of evidence sources"],
      "interviewAnswers": ["list of relevant interview answers"],
      "documents": ["list of relevant documents"]
    }
  ],
  "suggestedQuantities": [
    {
      "lineItemId": "reference to line item",
      "currentQuantity": number,
      "suggestedQuantity": number,
      "reason": "Explanation for quantity change",
      "confidence": 0.0-1.0
    }
  ],
  "suggestedPricing": [
    {
      "lineItemId": "reference to line item",
      "currentUnitPrice": number,
      "suggestedUnitPrice": number,
      "reason": "Explanation for pricing",
      "confidence": 0.0-1.0,
      "marketData": "Market data reference if available"
    }
  ],
  "supportingJustification": "Overall justification for the supplement",
  "documentationChecklist": [
    {
      "id": "unique-id",
      "description": "Documentation needed",
      "type": "photo|document|estimate|report",
      "status": "required|recommended|optional",
      "reason": "Why this documentation is needed"
    }
  ],
  "missingInformation": [
    {
      "id": "unique-id",
      "description": "What information is missing",
      "impact": "low|medium|high",
      "source": "Where this information should come from"
    }
  ],
  "questionsForEstimator": [
    "Question 1",
    "Question 2"
  ],
  "warnings": [
    "Warning 1",
    "Warning 2"
  ],
  "evidenceLinks": [
    {
      "recommendationId": "reference to recommendation",
      "documentId": "document reference",
      "documentType": "type of document",
      "relevance": "high|medium|low",
      "description": "How this document supports the recommendation"
    }
  ],
  "aiExplanation": {
    "overallApproach": "Your overall approach to this analysis",
    "dataSourcesAnalyzed": ["List of data sources you analyzed"],
    "confidenceFactors": ["Factors affecting your confidence"],
    "limitations": ["Limitations of your analysis"],
    "recommendations": ["General recommendations for the estimator"]
  }
}

Important guidelines:
- Only recommend items with clear evidence from the provided information
- Use conservative estimates - it's better to be slightly under than over
- Provide specific justifications for each recommendation
- Link each recommendation to specific evidence sources
- Flag any information gaps that could impact approval
- Assess confidence honestly - low confidence items should be flagged
- Consider carrier approval criteria in your recommendations
- Ensure pricing aligns with industry standards
- Identify any potential red flags or issues`;
  }
}
