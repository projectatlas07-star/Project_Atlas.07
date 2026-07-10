/**
 * Seed Factories for Demo Data Generation
 * 
 * These factories generate realistic data for each entity type
 * using the deterministic random generator.
 */

import { demoRandom } from '../deterministic-random';

// ============================================================================
// DATA ARRAYS
// ============================================================================

const FIRST_NAMES = [
  'John', 'Sarah', 'Emily', 'Robert', 'Lisa', 'Michael', 'Jennifer', 'David',
  'Amanda', 'James', 'Jessica', 'William', 'Ashley', 'Christopher', 'Stephanie',
  'Daniel', 'Nicole', 'Matthew', 'Melissa', 'Andrew', 'Elizabeth', 'Joshua',
  'Michelle', 'Ryan', 'Kimberly', 'Brandon', 'Laura', 'Jason', 'Rebecca', 'Justin'
];

const LAST_NAMES = [
  'Mitchell', 'Johnson', 'Garcia', 'Chen', 'Smith', 'Williams', 'Brown', 'Jones',
  'Miller', 'Davis', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Jackson', 'White',
  'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez'
];

const INSURANCE_COMPANIES = [
  'State Farm', 'Allstate', 'Farmers Insurance', 'Travelers', 'Liberty Mutual',
  'Progressive', 'Geico', 'USAA', 'Nationwide', 'Chubb', 'AIG', 'Hartford'
];

const DAMAGE_TYPES = [
  'Hail Damage', 'Wind Damage', 'Water Damage', 'Fire Damage', 'Storm Damage',
  'Tree Damage', 'Ice Damage', 'Structural Damage', 'Roof Leak', 'Mold Damage'
];

const PROPERTY_TYPES = [
  'Single Family Home', 'Townhouse', 'Condo', 'Multi-Family', 'Commercial Building',
  'Apartment Complex', 'Retail Space', 'Office Building', 'Warehouse', 'Restaurant'
];

const ROOF_TYPES = [
  'Asphalt Shingle', 'Metal Roof', 'Tile Roof', 'Flat Roof', 'Slate Roof',
  'Wood Shake', 'TPO', 'EPDM', 'Modified Bitumen', 'Built-Up Roof'
];

const CLAIM_STATUSES = [
  'new', 'inspection_scheduled', 'inspection_completed', 'adjuster_assigned',
  'estimate_submitted', 'supplement_pending', 'supplement_submitted',
  'approved', 'in_progress', 'completed', 'closed', 'denied', 'appealed'
];

const SUPPLEMENT_STATUSES = [
  'draft', 'submitted', 'under_review', 'approved', 'denied', 'paid', 'archived'
];

const DOCUMENT_TYPES = [
  'roof_photo', 'drone_photo', 'inspection_report', 'insurance_estimate',
  'engineer_report', 'moisture_report', 'invoice', 'receipt', 'permit',
  'email', 'contract', 'certificate_of_completion', 'completion_photo'
];

const TEAM_ROLES = [
  'Sales Representative', 'Roof Inspector', 'Estimator', 'Office Staff',
  'Project Manager', 'Administrator', 'Field Supervisor', 'Quality Control'
];

// ============================================================================
// CUSTOMER FACTORY
// ============================================================================

export interface CustomerSeed {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  createdAt: Date;
}

export function createCustomerSeed(index: number): CustomerSeed {
  const firstName = demoRandom.pick(FIRST_NAMES);
  const lastName = demoRandom.pick(LAST_NAMES);
  const address = demoRandom.nextAddress();

  return {
    id: demoRandom.nextUuid(),
    firstName,
    lastName,
    email: demoRandom.nextEmail(`${firstName} ${lastName}`),
    phone: demoRandom.nextPhone(),
    address,
    createdAt: demoRandom.nextDate(
      new Date('2024-01-01'),
      new Date('2025-12-31')
    )
  };
}

// ============================================================================
// PROPERTY FACTORY
// ============================================================================

export interface PropertySeed {
  id: string;
  customerId: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  propertyType: string;
  roofType: string;
  yearBuilt: number;
  squareFootage: number;
  createdAt: Date;
}

export function createPropertySeed(customerId: string, index: number): PropertySeed {
  const address = demoRandom.nextAddress();
  
  return {
    id: demoRandom.nextUuid(),
    customerId,
    address,
    propertyType: demoRandom.pick(PROPERTY_TYPES),
    roofType: demoRandom.pick(ROOF_TYPES),
    yearBuilt: demoRandom.nextInt(1980, 2023),
    squareFootage: demoRandom.nextInt(1000, 5000),
    createdAt: demoRandom.nextDate(
      new Date('2024-01-01'),
      new Date('2025-12-31')
    )
  };
}

// ============================================================================
// CLAIM FACTORY
// ============================================================================

export interface ClaimSeed {
  id: string;
  claimNumber: string;
  policyNumber: string;
  customerId: string;
  propertyId: string;
  insuranceCompany: string;
  damageType: string;
  deductible: number;
  dateOfLoss: Date;
  dateReported: Date;
  status: string;
  estimatedAmount: number;
  approvedAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  adjusterId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export function createClaimSeed(
  customerId: string,
  propertyId: string,
  index: number
): ClaimSeed {
  const dateOfLoss = demoRandom.nextDate(
    new Date('2024-06-01'),
    new Date('2025-06-01')
  );
  const dateReported = new Date(dateOfLoss.getTime() + demoRandom.nextInt(1, 14) * 24 * 60 * 60 * 1000);
  const estimatedAmount = demoRandom.nextAmount(5000, 50000);
  const status = demoRandom.pick(CLAIM_STATUSES);
  
  // Calculate amounts based on status
  let approvedAmount = 0;
  let paidAmount = 0;
  
  if (['approved', 'in_progress', 'completed', 'closed'].includes(status)) {
    approvedAmount = estimatedAmount * demoRandom.nextAmount(0.7, 0.95);
  }
  
  if (['completed', 'closed'].includes(status)) {
    paidAmount = approvedAmount * demoRandom.nextAmount(0.8, 1.0);
  }

  return {
    id: demoRandom.nextUuid(),
    claimNumber: `CLM-${20240000 + index}`,
    policyNumber: `POL-${demoRandom.nextInt(100000, 999999)}`,
    customerId,
    propertyId,
    insuranceCompany: demoRandom.pick(INSURANCE_COMPANIES),
    damageType: demoRandom.pick(DAMAGE_TYPES),
    deductible: demoRandom.nextAmount(500, 5000),
    dateOfLoss,
    dateReported,
    status,
    estimatedAmount,
    approvedAmount,
    paidAmount,
    outstandingAmount: approvedAmount - paidAmount,
    createdAt: dateReported,
    updatedAt: new Date()
  };
}

// ============================================================================
// ADJUSTER FACTORY
// ============================================================================

export interface AdjusterSeed {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  insuranceCompany: string;
  licenseNumber: string;
  createdAt: Date;
}

export function createAdjusterSeed(index: number): AdjusterSeed {
  const firstName = demoRandom.pick(FIRST_NAMES);
  const lastName = demoRandom.pick(LAST_NAMES);
  const company = demoRandom.pick(INSURANCE_COMPANIES);

  return {
    id: demoRandom.nextUuid(),
    fullName: `${firstName} ${lastName}`,
    email: demoRandom.nextEmail(`${firstName} ${lastName}`, 'insurance.com'),
    phone: demoRandom.nextPhone(),
    insuranceCompany: company,
    licenseNumber: `ADJ-${demoRandom.nextInt(10000, 99999)}`,
    createdAt: demoRandom.nextDate(
      new Date('2023-01-01'),
      new Date('2024-12-31')
    )
  };
}

// ============================================================================
// DOCUMENT FACTORY
// ============================================================================

export interface DocumentSeed {
  id: string;
  claimId: string;
  supplementId?: string;
  customerId: string;
  propertyId: string;
  documentType: string;
  fileName: string;
  fileSize: number;
  uploadedAt: Date;
  uploadedBy: string;
}

export function createDocumentSeed(
  claimId: string,
  customerId: string,
  propertyId: string,
  supplementId?: string,
  index?: number
): DocumentSeed {
  const docType = demoRandom.pick(DOCUMENT_TYPES);
  const timestamp = new Date(
    new Date('2024-06-01').getTime() + demoRandom.nextInt(0, 365) * 24 * 60 * 60 * 1000
  );

  return {
    id: demoRandom.nextUuid(),
    claimId,
    supplementId,
    customerId,
    propertyId,
    documentType: docType,
    fileName: `${docType}_${demoRandom.nextInt(1000, 9999)}.pdf`,
    fileSize: demoRandom.nextInt(100000, 5000000),
    uploadedAt: timestamp,
    uploadedBy: 'demo-user'
  };
}

// ============================================================================
// INTERVIEW FACTORY
// ============================================================================

export interface InterviewSeed {
  id: string;
  claimId: string;
  customerId: string;
  propertyId: string;
  status: string;
  answers: Record<string, any>;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export function createInterviewSeed(
  claimId: string,
  customerId: string,
  propertyId: string,
  index: number
): InterviewSeed {
  const statuses = ['draft', 'in_progress', 'completed', 'archived'];
  const status = demoRandom.pick(statuses);
  const startedAt = demoRandom.nextDate(new Date('2024-06-01'), new Date('2025-06-01'));
  
  let completedAt: Date | undefined;
  if (status === 'completed' || status === 'archived') {
    completedAt = new Date(startedAt.getTime() + demoRandom.nextInt(30, 120) * 60 * 1000);
  }

  // Generate realistic FNOL answers
  const answers = {
    dateOfLoss: demoRandom.nextDate(new Date('2024-06-01'), new Date('2025-06-01')).toISOString().split('T')[0],
    timeOfLoss: `${demoRandom.nextInt(0, 23)}:${demoRandom.nextInt(0, 59).toString().padStart(2, '0')}`,
    damageDescription: demoRandom.pick([
      'Hail damage observed on roof shingles',
      'Wind damage to roof and siding',
      'Water intrusion from roof leak',
      'Fire damage to kitchen area',
      'Storm damage throughout property'
    ]),
    immediateActionsTaken: demoRandom.pick([
      'Contacted insurance company',
      'Covered exposed areas with tarps',
      'Documented damage with photos',
      'Contacted contractor for inspection'
    ]),
    injuries: demoRandom.nextBool(0.1) ? 'Minor injuries reported' : 'No injuries',
    otherStructures: demoRandom.nextBool(0.3) ? 'Yes - garage damaged' : 'No',
    additionalNotes: demoRandom.nextBool(0.5) ? 'Additional photos available on request' : ''
  };

  return {
    id: demoRandom.nextUuid(),
    claimId,
    customerId,
    propertyId,
    status,
    answers,
    startedAt,
    completedAt,
    createdAt: startedAt,
    updatedAt: completedAt || startedAt
  };
}

// ============================================================================
// SUPPLEMENT FACTORY
// ============================================================================

export interface SupplementSeed {
  id: string;
  claimId: string;
  customerId: string;
  propertyId: string;
  supplementNumber: string;
  status: string;
  requestedAmount: number;
  approvedAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  submittedAt?: Date;
  approvedAt?: Date;
  paidAt?: Date;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  carrierResponse?: string;
  internalNotes?: string;
  aiRecommendations?: {
    confidenceScore: number;
    riskScore: number;
    reasoning: string;
    suggestedLineItems: string[];
    missingDocumentation: string[];
    questionsForEstimator: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export function createSupplementSeed(
  claimId: string,
  customerId: string,
  propertyId: string,
  index: number
): SupplementSeed {
  const status = demoRandom.pick(SUPPLEMENT_STATUSES);
  const requestedAmount = demoRandom.nextAmount(2000, 25000);
  const submittedAt = demoRandom.nextDate(new Date('2024-07-01'), new Date('2025-06-01'));
  
  let approvedAmount = 0;
  let approvedAt: Date | undefined;
  let paidAmount = 0;
  let paidAt: Date | undefined;
  let carrierResponse: string | undefined;

  if (['approved', 'paid', 'archived'].includes(status)) {
    approvedAmount = requestedAmount * demoRandom.nextAmount(0.6, 0.9);
    approvedAt = new Date(submittedAt.getTime() + demoRandom.nextInt(7, 30) * 24 * 60 * 60 * 1000);
    carrierResponse = demoRandom.pick([
      'Approved as submitted',
      'Approved with minor adjustments',
      'Approved pending documentation'
    ]);
  }

  if (['paid', 'archived'].includes(status)) {
    paidAmount = approvedAmount * demoRandom.nextAmount(0.9, 1.0);
    paidAt = new Date(approvedAt!.getTime() + demoRandom.nextInt(14, 45) * 24 * 60 * 60 * 1000);
  }

  if (status === 'denied') {
    carrierResponse = demoRandom.pick([
      'Denied - insufficient documentation',
      'Denied - not covered under policy',
      'Denied - outside claim scope'
    ]);
  }

  // Generate line items
  const lineItemDescriptions = [
    'Roof decking replacement',
    'Underlayment installation',
    'Shingle replacement',
    'Flashing repair',
    'Drip edge installation',
    'Vent replacement',
    'Gutter repair',
    'Siding repair',
    'Paint touch-up',
    'Debris removal'
  ];

  const lineItems = demoRandom.pickN(lineItemDescriptions, demoRandom.nextInt(3, 8)).map(desc => ({
    description: desc,
    quantity: demoRandom.nextInt(1, 100),
    unitPrice: demoRandom.nextAmount(5, 50),
    totalPrice: 0 // Will be calculated
  })).map(item => ({
    ...item,
    totalPrice: item.quantity * item.unitPrice
  }));

  // Generate AI recommendations
  const aiRecommendations = {
    confidenceScore: demoRandom.nextAmount(0.7, 0.95),
    riskScore: demoRandom.nextAmount(0.1, 0.4),
    reasoning: demoRandom.pick([
      'Supplement appears well-documented with supporting photos',
      'Additional documentation recommended for line items 3 and 5',
      'Pricing consistent with market rates for region',
      'Missing before/after photos for verification'
    ]),
    suggestedLineItems: demoRandom.nextBool(0.6) ? demoRandom.pickN(lineItemDescriptions, demoRandom.nextInt(1, 3)) : [],
    missingDocumentation: demoRandom.nextBool(0.5) ? demoRandom.pickN([
      'Before photos',
      'After photos',
      'Material receipts',
      'Labor records',
      'Permit documentation'
    ], demoRandom.nextInt(1, 3)) : [],
    questionsForEstimator: demoRandom.nextBool(0.4) ? demoRandom.pickN([
      'Confirm square footage measurements',
      'Verify material specifications',
      'Clarify labor hours',
      'Confirm subcontractor costs'
    ], demoRandom.nextInt(1, 2)) : []
  };

  return {
    id: demoRandom.nextUuid(),
    claimId,
    customerId,
    propertyId,
    supplementNumber: `SUP-${20240000 + index}`,
    status,
    requestedAmount,
    approvedAmount,
    paidAmount,
    outstandingAmount: approvedAmount - paidAmount,
    submittedAt,
    approvedAt,
    paidAt,
    lineItems,
    carrierResponse,
    internalNotes: demoRandom.nextBool(0.3) ? 'Follow up with adjuster' : undefined,
    aiRecommendations,
    createdAt: submittedAt,
    updatedAt: paidAt || approvedAt || submittedAt
  };
}

// ============================================================================
// ACTIVITY EVENT FACTORY
// ============================================================================

export interface ActivityEventSeed {
  id: string;
  claimId: string;
  customerId: string;
  propertyId: string;
  eventType: string;
  description: string;
  userId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const EVENT_TYPES = [
  'lead_created',
  'inspection_scheduled',
  'inspection_completed',
  'claim_created',
  'document_uploaded',
  'adjuster_assigned',
  'interview_started',
  'interview_completed',
  'supplement_created',
  'ai_supplement_generated',
  'supplement_submitted',
  'carrier_requested_info',
  'carrier_approved',
  'payment_received',
  'claim_closed',
  'note_added',
  'status_changed'
];

export function createActivityEventSeed(
  claimId: string,
  customerId: string,
  propertyId: string,
  baseDate: Date,
  index: number
): ActivityEventSeed {
  const eventType = demoRandom.pick(EVENT_TYPES);
  const timestamp = new Date(baseDate.getTime() + index * demoRandom.nextInt(1, 7) * 24 * 60 * 60 * 1000);

  const descriptions: Record<string, string> = {
    lead_created: 'New lead created from website inquiry',
    inspection_scheduled: 'Roof inspection scheduled',
    inspection_completed: 'Roof inspection completed',
    claim_created: 'Insurance claim filed',
    document_uploaded: 'Document uploaded to claim',
    adjuster_assigned: 'Insurance adjuster assigned to claim',
    interview_started: 'FNOL interview started',
    interview_completed: 'FNOL interview completed',
    supplement_created: 'Supplement created',
    ai_supplement_generated: 'AI supplement recommendations generated',
    supplement_submitted: 'Supplement submitted to carrier',
    carrier_requested_info: 'Carrier requested additional information',
    carrier_approved: 'Carrier approved supplement',
    payment_received: 'Payment received from carrier',
    claim_closed: 'Claim closed',
    note_added: 'Internal note added',
    status_changed: 'Claim status updated'
  };

  return {
    id: demoRandom.nextUuid(),
    claimId,
    customerId,
    propertyId,
    eventType,
    description: descriptions[eventType],
    userId: demoRandom.nextBool(0.7) ? 'demo-user' : undefined,
    metadata: demoRandom.nextBool(0.3) ? { priority: demoRandom.pick(['low', 'medium', 'high']) } : undefined,
    createdAt: timestamp
  };
}

// ============================================================================
// USER FACTORY
// ============================================================================

export interface UserSeed {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  team: string;
  createdAt: Date;
}

export function createUserSeed(index: number, role?: string): UserSeed {
  const firstName = demoRandom.pick(FIRST_NAMES);
  const lastName = demoRandom.pick(LAST_NAMES);
  const assignedRole = role || demoRandom.pick(TEAM_ROLES);
  const teams = ['Sales Team', 'Inspection Team', 'Estimating Team', 'Project Management', 'Office Staff'];

  return {
    id: demoRandom.nextUuid(),
    fullName: `${firstName} ${lastName}`,
    email: demoRandom.nextEmail(`${firstName} ${lastName}`, 'npproofing.com'),
    phone: demoRandom.nextPhone(),
    role: assignedRole,
    team: demoRandom.pick(teams),
    createdAt: demoRandom.nextDate(new Date('2023-01-01'), new Date('2024-12-31'))
  };
}
