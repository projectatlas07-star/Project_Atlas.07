/**
 * Demo Data Service
 * 
 * Main service for generating and managing demo data.
 * Orchestrates all seed factories and relationship builders.
 */

import { demoRandom } from '../deterministic-random';
import {
  createCustomerSeed,
  createPropertySeed,
  createClaimSeed,
  createAdjusterSeed,
  createDocumentSeed,
  createInterviewSeed,
  createSupplementSeed,
  createUserSeed
} from './seed-factories';
import {
  createDemoPersonas,
  generateAdditionalCustomers,
  generateAdditionalProperties,
  generateAdditionalClaims,
  generateActivityEventsForClaims
} from './relationship-builders';
import {
  createDemoCompany,
  createDemoUsers,
  createDemoTeams
} from './demo-company';

export interface DemoData {
  company: any;
  teams: any[];
  users: any[];
  adjusters: any[];
  customers: any[];
  properties: any[];
  claims: any[];
  documents: any[];
  interviews: any[];
  supplements: any[];
  activities: any[];
  personas: any[];
}

/**
 * Generate complete demo data set
 */
export function generateDemoData(): DemoData {
  // Reset random seed for consistency
  const seed = 42;
  (demoRandom as any).seed = seed;

  // Create company
  const company = createDemoCompany();

  // Create users and teams
  const users = createDemoUsers(12);
  const teams = createDemoTeams(users);

  // Create adjusters
  const adjusters: any[] = [];
  for (let i = 0; i < 15; i++) {
    adjusters.push(createAdjusterSeed(i));
  }

  // Create demo personas (6 specific workflows)
  const personas = createDemoPersonas(adjusters, users);

  // Extract persona data
  const personaCustomers = personas.map(p => p.customer);
  const personaProperties = personas.map(p => p.property);
  const personaClaims = personas.map(p => p.claim);
  const personaDocuments = personas.flatMap(p => p.documents);
  const personaInterviews = personas.filter(p => p.interview).map(p => p.interview!);
  const personaSupplements = personas.flatMap(p => p.supplements);
  const personaActivities = personas.flatMap(p => p.activities);

  // Generate additional customers (total 50)
  const additionalCustomers = generateAdditionalCustomers(50 - personaCustomers.length);
  const allCustomers = [...personaCustomers, ...additionalCustomers];

  // Generate additional properties (total 50)
  const additionalProperties = generateAdditionalProperties(additionalCustomers);
  const allProperties = [...personaProperties, ...additionalProperties];

  // Generate additional claims (total 40)
  const additionalClaims = generateAdditionalClaims(allCustomers, allProperties, 40 - personaClaims.length);
  const allClaims = [...personaClaims, ...additionalClaims];

  // Generate additional documents (total 100)
  const additionalDocuments: any[] = [];
  const documentsNeeded = 100 - personaDocuments.length;
  for (let i = 0; i < documentsNeeded; i++) {
    const claim = demoRandom.pick(allClaims);
    additionalDocuments.push(createDocumentSeed(
      claim.id,
      claim.customerId,
      claim.propertyId,
      undefined,
      i
    ));
  }
  const allDocuments = [...personaDocuments, ...additionalDocuments];

  // Generate additional interviews (total 25)
  const additionalInterviews: any[] = [];
  const interviewsNeeded = 25 - personaInterviews.length;
  for (let i = 0; i < interviewsNeeded; i++) {
    const claim = demoRandom.pick(allClaims);
    additionalInterviews.push(createInterviewSeed(
      claim.id,
      claim.customerId,
      claim.propertyId,
      i
    ));
  }
  const allInterviews = [...personaInterviews, ...additionalInterviews];

  // Generate additional supplements (total 40)
  const additionalSupplements: any[] = [];
  const supplementsNeeded = 40 - personaSupplements.length;
  for (let i = 0; i < supplementsNeeded; i++) {
    const claim = demoRandom.pick(allClaims);
    additionalSupplements.push(createSupplementSeed(
      claim.id,
      claim.customerId,
      claim.propertyId,
      i
    ));
  }
  const allSupplements = [...personaSupplements, ...additionalSupplements];

  // Generate activity events (1,000+ total)
  const additionalActivities = generateActivityEventsForClaims(
    additionalClaims,
    25 // events per additional claim
  );
  const allActivities = [...personaActivities, ...additionalActivities];

  return {
    company,
    teams,
    users,
    adjusters,
    customers: allCustomers,
    properties: allProperties,
    claims: allClaims,
    documents: allDocuments,
    interviews: allInterviews,
    supplements: allSupplements,
    activities: allActivities,
    personas
  };
}

/**
 * Calculate dashboard metrics from demo data
 */
export function calculateDashboardMetrics(data: DemoData) {
  const { claims, supplements, activities } = data;

  // Claims by status
  const claimsByStatus = claims.reduce((acc, claim) => {
    acc[claim.status] = (acc[claim.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Supplements by status
  const supplementsByStatus = supplements.reduce((acc, supp) => {
    acc[supp.status] = (acc[supp.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Financial metrics
  const totalRequested = supplements.reduce((sum, s) => sum + s.requestedAmount, 0);
  const totalApproved = supplements.reduce((sum, s) => sum + s.approvedAmount, 0);
  const totalPaid = supplements.reduce((sum, s) => sum + s.paidAmount, 0);
  const totalOutstanding = totalApproved - totalPaid;

  // Approval rate
  const approvedSupplements = supplements.filter(s => s.status === 'approved' || s.status === 'paid').length;
  const approvalRate = supplements.length > 0 ? (approvedSupplements / supplements.length) * 100 : 0;

  // Average approval time (days)
  const approvedWithDates = supplements.filter(s => s.submittedAt && s.approvedAt);
  const avgApprovalTime = approvedWithDates.length > 0
    ? approvedWithDates.reduce((sum, s) => {
        const days = Math.floor((s.approvedAt!.getTime() - s.submittedAt!.getTime()) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0) / approvedWithDates.length
    : 0;

  // Average claim value
  const avgClaimValue = claims.length > 0
    ? claims.reduce((sum, c) => sum + c.estimatedAmount, 0) / claims.length
    : 0;

  // Average supplement value
  const avgSupplementValue = supplements.length > 0
    ? supplements.reduce((sum, s) => sum + s.requestedAmount, 0) / supplements.length
    : 0;

  // AI acceptance rate
  const supplementsWithAI = supplements.filter(s => s.aiRecommendations);
  const aiAcceptedCount = supplementsWithAI.filter(s => {
    const ai = s.aiRecommendations!;
    return ai.suggestedLineItems.length > 0 && s.status === 'approved';
  }).length;
  const aiAcceptanceRate = supplementsWithAI.length > 0
    ? (aiAcceptedCount / supplementsWithAI.length) * 100
    : 0;

  // Claims awaiting carrier
  const claimsAwaitingCarrier = claims.filter(c =>
    ['estimate_submitted', 'supplement_pending', 'supplement_submitted', 'under_review'].includes(c.status)
  ).length;

  // Claims awaiting supplement
  const claimsAwaitingSupplement = claims.filter(c =>
    ['inspection_completed', 'adjuster_assigned'].includes(c.status)
  ).length;

  // Most active users (from activities)
  const userActivityCount = activities.reduce((acc, activity) => {
    if (activity.userId) {
      acc[activity.userId] = (acc[activity.userId] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const mostActiveUsers = Object.entries(userActivityCount)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5)
    .map(([userId, count]) => ({ userId, count }));

  // Top insurance carriers
  const carrierCount = claims.reduce((acc, claim) => {
    acc[claim.insuranceCompany] = (acc[claim.insuranceCompany] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCarriers = Object.entries(carrierCount)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5)
    .map(([carrier, count]) => ({ carrier, count }));

  // Top adjusters
  const adjusterCount = claims.reduce((acc, claim) => {
    if (claim.adjusterId) {
      acc[claim.adjusterId] = (acc[claim.adjusterId] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topAdjusters = Object.entries(adjusterCount)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5)
    .map(([adjusterId, count]) => ({ adjusterId, count }));

  return {
    claimsByStatus,
    supplementsByStatus,
    revenueRequested: totalRequested,
    revenueApproved: totalApproved,
    revenueOutstanding: totalOutstanding,
    approvalRate: Math.round(approvalRate * 10) / 10,
    avgApprovalTime: Math.round(avgApprovalTime * 10) / 10,
    avgClaimValue: Math.round(avgClaimValue),
    avgSupplementValue: Math.round(avgSupplementValue),
    aiAcceptanceRate: Math.round(aiAcceptanceRate * 10) / 10,
    claimsAwaitingCarrier,
    claimsAwaitingSupplement,
    mostActiveUsers,
    topCarriers,
    topAdjusters
  };
}

/**
 * Validate data integrity
 */
export function validateDataIntegrity(data: DemoData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for orphaned records
  const customerIds = new Set(data.customers.map(c => c.id));
  const propertyIds = new Set(data.properties.map(p => p.id));
  const claimIds = new Set(data.claims.map(c => c.id));
  const adjusterIds = new Set(data.adjusters.map(a => a.id));

  // Check claims reference valid customers and properties
  data.claims.forEach(claim => {
    if (!customerIds.has(claim.customerId)) {
      errors.push(`Claim ${claim.claimNumber} references invalid customer ${claim.customerId}`);
    }
    if (!propertyIds.has(claim.propertyId)) {
      errors.push(`Claim ${claim.claimNumber} references invalid property ${claim.propertyId}`);
    }
    if (claim.adjusterId && !adjusterIds.has(claim.adjusterId)) {
      errors.push(`Claim ${claim.claimNumber} references invalid adjuster ${claim.adjusterId}`);
    }
  });

  // Check properties reference valid customers
  data.properties.forEach(property => {
    if (!customerIds.has(property.customerId)) {
      errors.push(`Property ${property.id} references invalid customer ${property.customerId}`);
    }
  });

  // Check supplements reference valid claims
  data.supplements.forEach(supplement => {
    if (!claimIds.has(supplement.claimId)) {
      errors.push(`Supplement ${supplement.supplementNumber} references invalid claim ${supplement.claimId}`);
    }
  });

  // Check documents reference valid claims
  data.documents.forEach(document => {
    if (!claimIds.has(document.claimId)) {
      errors.push(`Document ${document.id} references invalid claim ${document.claimId}`);
    }
  });

  // Check interviews reference valid claims
  data.interviews.forEach(interview => {
    if (!claimIds.has(interview.claimId)) {
      errors.push(`Interview ${interview.id} references invalid claim ${interview.claimId}`);
    }
  });

  // Check activities reference valid claims
  data.activities.forEach(activity => {
    if (!claimIds.has(activity.claimId)) {
      errors.push(`Activity ${activity.id} references invalid claim ${activity.claimId}`);
    }
  });

  // Check for duplicate IDs
  const allIds = [
    ...data.customers.map(c => c.id),
    ...data.properties.map(p => p.id),
    ...data.claims.map(c => c.id),
    ...data.adjusters.map(a => a.id),
    ...data.documents.map(d => d.id),
    ...data.interviews.map(i => i.id),
    ...data.supplements.map(s => s.id),
    ...data.activities.map(a => a.id)
  ];

  const idCounts = allIds.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  Object.entries(idCounts).forEach(([id, count]) => {
    if ((count as number) > 1) {
      errors.push(`Duplicate ID found: ${id} (${count} occurrences)`);
    }
  });

  // Check chronological activity timestamps
  data.activities.forEach(activity => {
    if (activity.createdAt < new Date('2024-01-01') || activity.createdAt > new Date('2026-01-01')) {
      errors.push(`Activity ${activity.id} has invalid timestamp: ${activity.createdAt.toISOString()}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}
