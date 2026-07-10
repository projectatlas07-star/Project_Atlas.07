/**
 * Relationship Builders
 * 
 * These functions build relationships between entities to ensure
 * data integrity and realistic connections throughout the demo environment.
 */

import { demoRandom } from '../deterministic-random';
import {
  CustomerSeed,
  PropertySeed,
  ClaimSeed,
  AdjusterSeed,
  DocumentSeed,
  InterviewSeed,
  SupplementSeed,
  ActivityEventSeed,
  UserSeed,
  createCustomerSeed,
  createPropertySeed,
  createClaimSeed,
  createDocumentSeed,
  createInterviewSeed,
  createSupplementSeed,
  createActivityEventSeed
} from './seed-factories';

// ============================================================================
// DEMO PERSONAS - SPECIFIC WORKFLOWS
// ============================================================================

export interface DemoPersona {
  customer: CustomerSeed;
  property: PropertySeed;
  claim: ClaimSeed;
  adjuster?: AdjusterSeed;
  supplements: SupplementSeed[];
  documents: DocumentSeed[];
  interview?: InterviewSeed;
  activities: ActivityEventSeed[];
  workflow: 'A' | 'B'; // Workflow A: Insurance claim exists, Workflow B: Contractor finds damage first
  story: string;
}

/**
 * Create the 6 specific demo personas with complete workflows
 */
export function createDemoPersonas(
  adjusters: AdjusterSeed[],
  users: UserSeed[]
): DemoPersona[] {
  const personas: DemoPersona[] = [];

  // --------------------------------------------------------
  // PERSONA 1: John & Sarah Mitchell - Residential Roof, Workflow A
  // --------------------------------------------------------
  const mitchellCustomer: CustomerSeed = {
    id: demoRandom.nextUuid(),
    firstName: 'John',
    lastName: 'Mitchell',
    email: 'john.mitchell@example.com',
    phone: '(469) 555-0123',
    address: {
      street: '1234 Oak Street',
      city: 'Plano',
      state: 'TX',
      zip: '75023'
    },
    createdAt: new Date('2024-08-15')
  };

  const mitchellProperty: PropertySeed = {
    id: demoRandom.nextUuid(),
    customerId: mitchellCustomer.id,
    address: mitchellCustomer.address,
    propertyType: 'Single Family Home',
    roofType: 'Asphalt Shingle',
    yearBuilt: 2015,
    squareFootage: 2800,
    createdAt: new Date('2024-08-15')
  };

  const mitchellClaim: ClaimSeed = {
    id: demoRandom.nextUuid(),
    claimNumber: 'CLM-20240001',
    policyNumber: 'POL-543210',
    customerId: mitchellCustomer.id,
    propertyId: mitchellProperty.id,
    insuranceCompany: 'State Farm',
    damageType: 'Hail Damage',
    deductible: 1500,
    dateOfLoss: new Date('2024-07-20'),
    dateReported: new Date('2024-07-22'),
    status: 'closed',
    estimatedAmount: 18500,
    approvedAmount: 17250,
    paidAmount: 17250,
    outstandingAmount: 0,
    adjusterId: adjusters[0].id,
    createdAt: new Date('2024-07-22'),
    updatedAt: new Date('2024-10-15')
  };

  const mitchellSupplement: SupplementSeed = {
    id: demoRandom.nextUuid(),
    claimId: mitchellClaim.id,
    customerId: mitchellCustomer.id,
    propertyId: mitchellProperty.id,
    supplementNumber: 'SUP-20240001',
    status: 'paid',
    requestedAmount: 4500,
    approvedAmount: 4200,
    paidAmount: 4200,
    outstandingAmount: 0,
    submittedAt: new Date('2024-09-01'),
    approvedAt: new Date('2024-09-15'),
    paidAt: new Date('2024-10-10'),
    lineItems: [
      { description: 'Roof decking replacement', quantity: 25, unitPrice: 45, totalPrice: 1125 },
      { description: 'Underlayment installation', quantity: 28, unitPrice: 35, totalPrice: 980 },
      { description: 'Shingle replacement', quantity: 28, unitPrice: 85, totalPrice: 2380 }
    ],
    carrierResponse: 'Approved as submitted with AI recommendations',
    internalNotes: 'Hidden decking discovered during tear-off',
    aiRecommendations: {
      confidenceScore: 0.92,
      riskScore: 0.15,
      reasoning: 'Supplement well-documented with photos showing hidden damage. AI identified additional line items for decking replacement.',
      suggestedLineItems: ['Roof decking replacement', 'Underlayment installation'],
      missingDocumentation: [],
      questionsForEstimator: ['Confirm total square footage of decking replaced']
    },
    createdAt: new Date('2024-09-01'),
    updatedAt: new Date('2024-10-10')
  };

  const mitchellDocuments = [
    createDocumentSeed(mitchellClaim.id, mitchellCustomer.id, mitchellProperty.id, mitchellSupplement.id, 1),
    createDocumentSeed(mitchellClaim.id, mitchellCustomer.id, mitchellProperty.id, mitchellSupplement.id, 2),
    createDocumentSeed(mitchellClaim.id, mitchellCustomer.id, mitchellProperty.id, mitchellSupplement.id, 3)
  ];

  const mitchellActivities = [
    createActivityEventSeed(mitchellClaim.id, mitchellCustomer.id, mitchellProperty.id, new Date('2024-07-20'), 0),
    createActivityEventSeed(mitchellClaim.id, mitchellCustomer.id, mitchellProperty.id, new Date('2024-07-22'), 1),
    createActivityEventSeed(mitchellClaim.id, mitchellCustomer.id, mitchellProperty.id, new Date('2024-08-01'), 2),
    createActivityEventSeed(mitchellClaim.id, mitchellCustomer.id, mitchellProperty.id, new Date('2024-08-15'), 3),
    createActivityEventSeed(mitchellClaim.id, mitchellCustomer.id, mitchellProperty.id, new Date('2024-09-01'), 4),
    createActivityEventSeed(mitchellClaim.id, mitchellCustomer.id, mitchellProperty.id, new Date('2024-09-15'), 5),
    createActivityEventSeed(mitchellClaim.id, mitchellCustomer.id, mitchellProperty.id, new Date('2024-10-10'), 6),
    createActivityEventSeed(mitchellClaim.id, mitchellCustomer.id, mitchellProperty.id, new Date('2024-10-15'), 7)
  ];

  personas.push({
    customer: mitchellCustomer,
    property: mitchellProperty,
    claim: mitchellClaim,
    adjuster: adjusters[0],
    supplements: [mitchellSupplement],
    documents: mitchellDocuments,
    activities: mitchellActivities,
    workflow: 'A',
    story: 'Insurance approved roof replacement. Hidden decking discovered. AI suggested additional line items. Supplement approved. Claim closed.'
  });

  // --------------------------------------------------------
  // PERSONA 2: Emily Johnson - Water Damage, Workflow A
  // --------------------------------------------------------
  const johnsonCustomer: CustomerSeed = {
    id: demoRandom.nextUuid(),
    firstName: 'Emily',
    lastName: 'Johnson',
    email: 'emily.johnson@example.com',
    phone: '(407) 555-0456',
    address: {
      street: '5678 Maple Avenue',
      city: 'Orlando',
      state: 'FL',
      zip: '32801'
    },
    createdAt: new Date('2024-09-10')
  };

  const johnsonProperty: PropertySeed = {
    id: demoRandom.nextUuid(),
    customerId: johnsonCustomer.id,
    address: johnsonCustomer.address,
    propertyType: 'Single Family Home',
    roofType: 'Tile Roof',
    yearBuilt: 2012,
    squareFootage: 2200,
    createdAt: new Date('2024-09-10')
  };

  const johnsonClaim: ClaimSeed = {
    id: demoRandom.nextUuid(),
    claimNumber: 'CLM-20240002',
    policyNumber: 'POL-654321',
    customerId: johnsonCustomer.id,
    propertyId: johnsonProperty.id,
    insuranceCompany: 'Allstate',
    damageType: 'Water Damage',
    deductible: 1000,
    dateOfLoss: new Date('2024-08-25'),
    dateReported: new Date('2024-08-26'),
    status: 'closed',
    estimatedAmount: 32000,
    approvedAmount: 28500,
    paidAmount: 28500,
    outstandingAmount: 0,
    adjusterId: adjusters[1].id,
    createdAt: new Date('2024-08-26'),
    updatedAt: new Date('2024-11-20')
  };

  const johnsonSupplements = [
    {
      id: demoRandom.nextUuid(),
      claimId: johnsonClaim.id,
      customerId: johnsonCustomer.id,
      propertyId: johnsonProperty.id,
      supplementNumber: 'SUP-20240002',
      status: 'paid',
      requestedAmount: 8500,
      approvedAmount: 7800,
      paidAmount: 7800,
      outstandingAmount: 0,
      submittedAt: new Date('2024-10-01'),
      approvedAt: new Date('2024-10-15'),
      paidAt: new Date('2024-11-05'),
      lineItems: [
        { description: 'Mold remediation', quantity: 1, unitPrice: 3500, totalPrice: 3500 },
        { description: 'Drywall replacement', quantity: 12, unitPrice: 150, totalPrice: 1800 },
        { description: 'Flooring replacement', quantity: 400, unitPrice: 8, totalPrice: 3200 }
      ],
      carrierResponse: 'Approved with engineer report',
      internalNotes: 'Hidden mold discovered behind walls',
      aiRecommendations: {
        confidenceScore: 0.88,
        riskScore: 0.22,
        reasoning: 'Mold remediation requires professional certification. AI recommended additional documentation.',
        suggestedLineItems: ['Mold remediation', 'Air quality testing'],
        missingDocumentation: ['Engineer report', 'Mold test results'],
        questionsForEstimator: ['Confirm mold certification number']
      },
      createdAt: new Date('2024-10-01'),
      updatedAt: new Date('2024-11-05')
    },
    {
      id: demoRandom.nextUuid(),
      claimId: johnsonClaim.id,
      customerId: johnsonCustomer.id,
      propertyId: johnsonProperty.id,
      supplementNumber: 'SUP-20240003',
      status: 'paid',
      requestedAmount: 3200,
      approvedAmount: 2900,
      paidAmount: 2900,
      outstandingAmount: 0,
      submittedAt: new Date('2024-10-20'),
      approvedAt: new Date('2024-11-01'),
      paidAt: new Date('2024-11-15'),
      lineItems: [
        { description: 'Additional drywall', quantity: 8, unitPrice: 150, totalPrice: 1200 },
        { description: 'Paint and finish', quantity: 1, unitPrice: 1700, totalPrice: 1700 }
      ],
      carrierResponse: 'Approved as revised',
      internalNotes: 'Second revision for additional damage',
      aiRecommendations: {
        confidenceScore: 0.85,
        riskScore: 0.25,
        reasoning: 'Additional damage found after initial remediation',
        suggestedLineItems: [],
        missingDocumentation: ['Photos of additional damage'],
        questionsForEstimator: []
      },
      createdAt: new Date('2024-10-20'),
      updatedAt: new Date('2024-11-15')
    }
  ];

  const johnsonDocuments = johnsonSupplements.flatMap((supp, idx) => [
    createDocumentSeed(johnsonClaim.id, johnsonCustomer.id, johnsonProperty.id, supp.id, idx * 3 + 1),
    createDocumentSeed(johnsonClaim.id, johnsonCustomer.id, johnsonProperty.id, supp.id, idx * 3 + 2),
    createDocumentSeed(johnsonClaim.id, johnsonCustomer.id, johnsonProperty.id, supp.id, idx * 3 + 3)
  ]);

  const johnsonActivities = [
    createActivityEventSeed(johnsonClaim.id, johnsonCustomer.id, johnsonProperty.id, new Date('2024-08-25'), 0),
    createActivityEventSeed(johnsonClaim.id, johnsonCustomer.id, johnsonProperty.id, new Date('2024-08-26'), 1),
    createActivityEventSeed(johnsonClaim.id, johnsonCustomer.id, johnsonProperty.id, new Date('2024-09-05'), 2),
    createActivityEventSeed(johnsonClaim.id, johnsonCustomer.id, johnsonProperty.id, new Date('2024-10-01'), 3),
    createActivityEventSeed(johnsonClaim.id, johnsonCustomer.id, johnsonProperty.id, new Date('2024-10-15'), 4),
    createActivityEventSeed(johnsonClaim.id, johnsonCustomer.id, johnsonProperty.id, new Date('2024-10-20'), 5),
    createActivityEventSeed(johnsonClaim.id, johnsonCustomer.id, johnsonProperty.id, new Date('2024-11-01'), 6),
    createActivityEventSeed(johnsonClaim.id, johnsonCustomer.id, johnsonProperty.id, new Date('2024-11-15'), 7),
    createActivityEventSeed(johnsonClaim.id, johnsonCustomer.id, johnsonProperty.id, new Date('2024-11-20'), 8)
  ];

  personas.push({
    customer: johnsonCustomer,
    property: johnsonProperty,
    claim: johnsonClaim,
    adjuster: adjusters[1],
    supplements: johnsonSupplements,
    documents: johnsonDocuments,
    activities: johnsonActivities,
    workflow: 'A',
    story: 'Burst pipe. Hidden mold. Two supplement revisions. Engineer report. Carrier approved. Claim closed.'
  });

  // --------------------------------------------------------
  // PERSONA 3: Robert Garcia - Kitchen Fire, Workflow A
  // --------------------------------------------------------
  const garciaCustomer: CustomerSeed = {
    id: demoRandom.nextUuid(),
    firstName: 'Robert',
    lastName: 'Garcia',
    email: 'robert.garcia@example.com',
    phone: '(214) 555-0789',
    address: {
      street: '9012 Cedar Lane',
      city: 'Plano',
      state: 'TX',
      zip: '75075'
    },
    createdAt: new Date('2024-10-05')
  };

  const garciaProperty: PropertySeed = {
    id: demoRandom.nextUuid(),
    customerId: garciaCustomer.id,
    address: garciaCustomer.address,
    propertyType: 'Single Family Home',
    roofType: 'Asphalt Shingle',
    yearBuilt: 2018,
    squareFootage: 3200,
    createdAt: new Date('2024-10-05')
  };

  const garciaClaim: ClaimSeed = {
    id: demoRandom.nextUuid(),
    claimNumber: 'CLM-20240003',
    policyNumber: 'POL-765432',
    customerId: garciaCustomer.id,
    propertyId: garciaProperty.id,
    insuranceCompany: 'Farmers Insurance',
    damageType: 'Fire Damage',
    deductible: 2500,
    dateOfLoss: new Date('2024-09-15'),
    dateReported: new Date('2024-09-16'),
    status: 'appealed',
    estimatedAmount: 45000,
    approvedAmount: 28000,
    paidAmount: 28000,
    outstandingAmount: 0,
    adjusterId: adjusters[2].id,
    createdAt: new Date('2024-09-16'),
    updatedAt: new Date('2024-12-01')
  };

  const garciaSupplement: SupplementSeed = {
    id: demoRandom.nextUuid(),
    claimId: garciaClaim.id,
    customerId: garciaCustomer.id,
    propertyId: garciaProperty.id,
    supplementNumber: 'SUP-20240004',
    status: 'denied',
    requestedAmount: 15000,
    approvedAmount: 0,
    paidAmount: 0,
    outstandingAmount: 0,
    submittedAt: new Date('2024-11-01'),
    approvedAt: undefined,
    paidAt: undefined,
    lineItems: [
      { description: 'Structural beam replacement', quantity: 4, unitPrice: 1200, totalPrice: 4800 },
      { description: 'Load-bearing wall reconstruction', quantity: 1, unitPrice: 8500, totalPrice: 8500 },
      { description: 'Fire-rated materials upgrade', quantity: 1, unitPrice: 1700, totalPrice: 1700 }
    ],
    carrierResponse: 'Denied - structural damage deemed pre-existing',
    internalNotes: 'Appeal in progress with engineer report',
    aiRecommendations: {
      confidenceScore: 0.75,
      riskScore: 0.45,
      reasoning: 'Structural damage claim requires additional evidence. AI flagged as high risk due to pre-existing condition possibility.',
      suggestedLineItems: [],
      missingDocumentation: ['Structural engineer report', 'Before photos', 'Building permits'],
      questionsForEstimator: ['Document pre-existing conditions', 'Obtain structural assessment']
    },
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-12-01')
  };

  const garciaDocuments = [
    createDocumentSeed(garciaClaim.id, garciaCustomer.id, garciaProperty.id, garciaSupplement.id, 1),
    createDocumentSeed(garciaClaim.id, garciaCustomer.id, garciaProperty.id, garciaSupplement.id, 2),
    createDocumentSeed(garciaClaim.id, garciaCustomer.id, garciaProperty.id, garciaSupplement.id, 3),
    createDocumentSeed(garciaClaim.id, garciaCustomer.id, garciaProperty.id, garciaSupplement.id, 4)
  ];

  const garciaActivities = [
    createActivityEventSeed(garciaClaim.id, garciaCustomer.id, garciaProperty.id, new Date('2024-09-15'), 0),
    createActivityEventSeed(garciaClaim.id, garciaCustomer.id, garciaProperty.id, new Date('2024-09-16'), 1),
    createActivityEventSeed(garciaClaim.id, garciaCustomer.id, garciaProperty.id, new Date('2024-10-01'), 2),
    createActivityEventSeed(garciaClaim.id, garciaCustomer.id, garciaProperty.id, new Date('2024-11-01'), 3),
    createActivityEventSeed(garciaClaim.id, garciaCustomer.id, garciaProperty.id, new Date('2024-11-15'), 4),
    createActivityEventSeed(garciaClaim.id, garciaCustomer.id, garciaProperty.id, new Date('2024-12-01'), 5)
  ];

  personas.push({
    customer: garciaCustomer,
    property: garciaProperty,
    claim: garciaClaim,
    adjuster: adjusters[2],
    supplements: [garciaSupplement],
    documents: garciaDocuments,
    activities: garciaActivities,
    workflow: 'A',
    story: 'Structural damage discovered. Supplement denied. Appeal pending. Excellent denied-claim demonstration.'
  });

  // --------------------------------------------------------
  // PERSONA 4: Lisa Chen - Wind Damage, Workflow B
  // --------------------------------------------------------
  const chenCustomer: CustomerSeed = {
    id: demoRandom.nextUuid(),
    firstName: 'Lisa',
    lastName: 'Chen',
    email: 'lisa.chen@example.com',
    phone: '(972) 555-0321',
    address: {
      street: '3456 Pine Road',
      city: 'Plano',
      state: 'TX',
      zip: '75093'
    },
    createdAt: new Date('2024-07-01')
  };

  const chenProperty: PropertySeed = {
    id: demoRandom.nextUuid(),
    customerId: chenCustomer.id,
    address: chenCustomer.address,
    propertyType: 'Single Family Home',
    roofType: 'Asphalt Shingle',
    yearBuilt: 2016,
    squareFootage: 2400,
    createdAt: new Date('2024-07-01')
  };

  const chenClaim: ClaimSeed = {
    id: demoRandom.nextUuid(),
    claimNumber: 'CLM-20240004',
    policyNumber: 'POL-876543',
    customerId: chenCustomer.id,
    propertyId: chenProperty.id,
    insuranceCompany: 'State Farm',
    damageType: 'Wind Damage',
    deductible: 1000,
    dateOfLoss: new Date('2024-06-15'),
    dateReported: new Date('2024-06-20'),
    status: 'closed',
    estimatedAmount: 16000,
    approvedAmount: 15500,
    paidAmount: 15500,
    outstandingAmount: 0,
    adjusterId: adjusters[3].id,
    createdAt: new Date('2024-06-20'),
    updatedAt: new Date('2024-09-30')
  };

  const chenSupplement: SupplementSeed = {
    id: demoRandom.nextUuid(),
    claimId: chenClaim.id,
    customerId: chenCustomer.id,
    propertyId: chenProperty.id,
    supplementNumber: 'SUP-20240005',
    status: 'paid',
    requestedAmount: 3800,
    approvedAmount: 3500,
    paidAmount: 3500,
    outstandingAmount: 0,
    submittedAt: new Date('2024-08-01'),
    approvedAt: new Date('2024-08-20'),
    paidAt: new Date('2024-09-15'),
    lineItems: [
      { description: 'Flashing replacement', quantity: 150, unitPrice: 8, totalPrice: 1200 },
      { description: 'Drip edge installation', quantity: 180, unitPrice: 5, totalPrice: 900 },
      { description: 'Permit fees', quantity: 1, unitPrice: 500, totalPrice: 500 },
      { description: 'Additional shingles', quantity: 15, unitPrice: 85, totalPrice: 1275 }
    ],
    carrierResponse: 'Approved with AI recommendations',
    internalNotes: 'Contractor-first workflow - NPP discovered damage',
    aiRecommendations: {
      confidenceScore: 0.94,
      riskScore: 0.12,
      reasoning: 'AI identified missing flashing, drip edge, and permit costs. All items approved by carrier.',
      suggestedLineItems: ['Flashing replacement', 'Drip edge installation', 'Permit fees'],
      missingDocumentation: [],
      questionsForEstimator: []
    },
    createdAt: new Date('2024-08-01'),
    updatedAt: new Date('2024-09-15')
  };

  const chenInterview: InterviewSeed = {
    id: demoRandom.nextUuid(),
    claimId: chenClaim.id,
    customerId: chenCustomer.id,
    propertyId: chenProperty.id,
    status: 'completed',
    answers: {
      dateOfLoss: '2024-06-15',
      timeOfLoss: '14:30',
      damageDescription: 'Storm damage discovered during routine inspection',
      immediateActionsTaken: 'Contacted NPP Roofing for inspection',
      injuries: 'No injuries',
      otherStructures: 'No',
      additionalNotes: 'No insurance claim existed prior to inspection'
    },
    startedAt: new Date('2024-06-20'),
    completedAt: new Date('2024-06-20'),
    createdAt: new Date('2024-06-20'),
    updatedAt: new Date('2024-06-20')
  };

  const chenDocuments = [
    createDocumentSeed(chenClaim.id, chenCustomer.id, chenProperty.id, chenSupplement.id, 1),
    createDocumentSeed(chenClaim.id, chenCustomer.id, chenProperty.id, chenSupplement.id, 2),
    createDocumentSeed(chenClaim.id, chenCustomer.id, chenProperty.id, chenSupplement.id, 3)
  ];

  const chenActivities = [
    createActivityEventSeed(chenClaim.id, chenCustomer.id, chenProperty.id, new Date('2024-06-10'), 0),
    createActivityEventSeed(chenClaim.id, chenCustomer.id, chenProperty.id, new Date('2024-06-15'), 1),
    createActivityEventSeed(chenClaim.id, chenCustomer.id, chenProperty.id, new Date('2024-06-20'), 2),
    createActivityEventSeed(chenClaim.id, chenCustomer.id, chenProperty.id, new Date('2024-07-01'), 3),
    createActivityEventSeed(chenClaim.id, chenCustomer.id, chenProperty.id, new Date('2024-08-01'), 4),
    createActivityEventSeed(chenClaim.id, chenCustomer.id, chenProperty.id, new Date('2024-08-20'), 5),
    createActivityEventSeed(chenClaim.id, chenCustomer.id, chenProperty.id, new Date('2024-09-15'), 6),
    createActivityEventSeed(chenClaim.id, chenCustomer.id, chenProperty.id, new Date('2024-09-30'), 7)
  ];

  personas.push({
    customer: chenCustomer,
    property: chenProperty,
    claim: chenClaim,
    adjuster: adjusters[3],
    supplements: [chenSupplement],
    documents: chenDocuments,
    interview: chenInterview,
    activities: chenActivities,
    workflow: 'B',
    story: 'No insurance claim existed. NPP discovered storm damage. Claim created. Insurance approved roof. AI identified missing flashing, drip edge and permit costs. Supplement approved. Excellent contractor-first demonstration.'
  });

  // --------------------------------------------------------
  // PERSONA 5: Westgate Shopping Centre - Commercial Roof, Workflow A
  // --------------------------------------------------------
  const westgateCustomer: CustomerSeed = {
    id: demoRandom.nextUuid(),
    firstName: 'Westgate',
    lastName: 'Shopping Centre',
    email: 'management@westgateshopping.com',
    phone: '(469) 555-0654',
    address: {
      street: '7890 Commerce Drive',
      city: 'Plano',
      state: 'TX',
      zip: '75024'
    },
    createdAt: new Date('2024-05-01')
  };

  const westgateProperty: PropertySeed = {
    id: demoRandom.nextUuid(),
    customerId: westgateCustomer.id,
    address: westgateCustomer.address,
    propertyType: 'Commercial Building',
    roofType: 'Flat Roof',
    yearBuilt: 2010,
    squareFootage: 48000,
    createdAt: new Date('2024-05-01')
  };

  const westgateClaim: ClaimSeed = {
    id: demoRandom.nextUuid(),
    claimNumber: 'CLM-20240005',
    policyNumber: 'POL-987654',
    customerId: westgateCustomer.id,
    propertyId: westgateProperty.id,
    insuranceCompany: 'Travelers',
    damageType: 'Hail Damage',
    deductible: 10000,
    dateOfLoss: new Date('2024-04-20'),
    dateReported: new Date('2024-04-22'),
    status: 'supplement_pending',
    estimatedAmount: 285000,
    approvedAmount: 245000,
    paidAmount: 200000,
    outstandingAmount: 45000,
    adjusterId: adjusters[4].id,
    createdAt: new Date('2024-04-22'),
    updatedAt: new Date('2024-12-10')
  };

  const westgateSupplements = [
    {
      id: demoRandom.nextUuid(),
      claimId: westgateClaim.id,
      customerId: westgateCustomer.id,
      propertyId: westgateProperty.id,
      supplementNumber: 'SUP-20240006',
      status: 'paid',
      requestedAmount: 45000,
      approvedAmount: 42000,
      paidAmount: 42000,
      outstandingAmount: 0,
      submittedAt: new Date('2024-06-01'),
      approvedAt: new Date('2024-06-20'),
      paidAt: new Date('2024-07-15'),
      lineItems: [
        { description: 'TPO membrane replacement', quantity: 48000, unitPrice: 0.65, totalPrice: 31200 },
        { description: 'Insulation replacement', quantity: 24000, unitPrice: 0.35, totalPrice: 8400 },
        { description: 'Drain system repair', quantity: 12, unitPrice: 200, totalPrice: 2400 }
      ],
      carrierResponse: 'Approved as submitted',
      internalNotes: 'First supplement for membrane damage',
      aiRecommendations: {
        confidenceScore: 0.91,
        riskScore: 0.18,
        reasoning: 'Commercial roof supplement with proper documentation',
        suggestedLineItems: [],
        missingDocumentation: [],
        questionsForEstimator: []
      },
      createdAt: new Date('2024-06-01'),
      updatedAt: new Date('2024-07-15')
    },
    {
      id: demoRandom.nextUuid(),
      claimId: westgateClaim.id,
      customerId: westgateCustomer.id,
      propertyId: westgateProperty.id,
      supplementNumber: 'SUP-20240007',
      status: 'under_review',
      requestedAmount: 58000,
      approvedAmount: 0,
      paidAmount: 0,
      outstandingAmount: 0,
      submittedAt: new Date('2024-11-15'),
      approvedAt: undefined,
      paidAt: undefined,
      lineItems: [
        { description: 'Additional TPO membrane', quantity: 15000, unitPrice: 0.65, totalPrice: 9750 },
        { description: 'Structural deck repair', quantity: 2500, unitPrice: 12, totalPrice: 30000 },
        { description: 'HVAC unit protection', quantity: 8, unitPrice: 2300, totalPrice: 18400 }
      ],
      carrierResponse: undefined,
      internalNotes: 'Final supplement for hidden structural damage',
      aiRecommendations: {
        confidenceScore: 0.87,
        riskScore: 0.28,
        reasoning: 'Large commercial supplement requiring additional carrier review',
        suggestedLineItems: ['Structural deck repair'],
        missingDocumentation: ['Structural engineer report', 'Before/after photos'],
        questionsForEstimator: ['Confirm structural assessment completed']
      },
      createdAt: new Date('2024-11-15'),
      updatedAt: new Date('2024-12-10')
    }
  ];

  const westgateDocuments = westgateSupplements.flatMap((supp, idx) => [
    createDocumentSeed(westgateClaim.id, westgateCustomer.id, westgateProperty.id, supp.id, idx * 4 + 1),
    createDocumentSeed(westgateClaim.id, westgateCustomer.id, westgateProperty.id, supp.id, idx * 4 + 2),
    createDocumentSeed(westgateClaim.id, westgateCustomer.id, westgateProperty.id, supp.id, idx * 4 + 3),
    createDocumentSeed(westgateClaim.id, westgateCustomer.id, westgateProperty.id, supp.id, idx * 4 + 4)
  ]);

  const westgateActivities = [
    createActivityEventSeed(westgateClaim.id, westgateCustomer.id, westgateProperty.id, new Date('2024-04-20'), 0),
    createActivityEventSeed(westgateClaim.id, westgateCustomer.id, westgateProperty.id, new Date('2024-04-22'), 1),
    createActivityEventSeed(westgateClaim.id, westgateCustomer.id, westgateProperty.id, new Date('2024-05-15'), 2),
    createActivityEventSeed(westgateClaim.id, westgateCustomer.id, westgateProperty.id, new Date('2024-06-01'), 3),
    createActivityEventSeed(westgateClaim.id, westgateCustomer.id, westgateProperty.id, new Date('2024-06-20'), 4),
    createActivityEventSeed(westgateClaim.id, westgateCustomer.id, westgateProperty.id, new Date('2024-07-15'), 5),
    createActivityEventSeed(westgateClaim.id, westgateCustomer.id, westgateProperty.id, new Date('2024-10-01'), 6),
    createActivityEventSeed(westgateClaim.id, westgateCustomer.id, westgateProperty.id, new Date('2024-11-15'), 7),
    createActivityEventSeed(westgateClaim.id, westgateCustomer.id, westgateProperty.id, new Date('2024-12-10'), 8)
  ];

  personas.push({
    customer: westgateCustomer,
    property: westgateProperty,
    claim: westgateClaim,
    adjuster: adjusters[4],
    supplements: westgateSupplements,
    documents: westgateDocuments,
    activities: westgateActivities,
    workflow: 'A',
    story: '48,000 square foot roof. Multiple supplements. Large financial values. Carrier still reviewing final supplement. Outstanding revenue. Executive dashboard example.'
  });

  // --------------------------------------------------------
  // PERSONA 6: Oak Valley Apartments - Large Apartment Complex, Workflow B
  // --------------------------------------------------------
  const oakValleyCustomer: CustomerSeed = {
    id: demoRandom.nextUuid(),
    firstName: 'Oak Valley',
    lastName: 'Apartments',
    email: 'management@oakvalleyapts.com',
    phone: '(972) 555-0987',
    address: {
      street: '1356 Valley Lane',
      city: 'Plano',
      state: 'TX',
      zip: '75074'
    },
    createdAt: new Date('2024-03-01')
  };

  const oakValleyProperty: PropertySeed = {
    id: demoRandom.nextUuid(),
    customerId: oakValleyCustomer.id,
    address: oakValleyCustomer.address,
    propertyType: 'Apartment Complex',
    roofType: 'TPO',
    yearBuilt: 2014,
    squareFootage: 85000,
    createdAt: new Date('2024-03-01')
  };

  const oakValleyClaim: ClaimSeed = {
    id: demoRandom.nextUuid(),
    claimNumber: 'CLM-20240006',
    policyNumber: 'POL-111222',
    customerId: oakValleyCustomer.id,
    propertyId: oakValleyProperty.id,
    insuranceCompany: 'Liberty Mutual',
    damageType: 'Storm Damage',
    deductible: 15000,
    dateOfLoss: new Date('2024-02-15'),
    dateReported: new Date('2024-02-18'),
    status: 'in_progress',
    estimatedAmount: 425000,
    approvedAmount: 380000,
    paidAmount: 250000,
    outstandingAmount: 130000,
    adjusterId: adjusters[5].id,
    createdAt: new Date('2024-02-18'),
    updatedAt: new Date('2024-12-10')
  };

  const oakValleySupplements = [
    {
      id: demoRandom.nextUuid(),
      claimId: oakValleyClaim.id,
      customerId: oakValleyCustomer.id,
      propertyId: oakValleyProperty.id,
      supplementNumber: 'SUP-20240008',
      status: 'paid',
      requestedAmount: 75000,
      approvedAmount: 68000,
      paidAmount: 68000,
      outstandingAmount: 0,
      submittedAt: new Date('2024-04-01'),
      approvedAt: new Date('2024-04-20'),
      paidAt: new Date('2024-05-15'),
      lineItems: [
        { description: 'Emergency mitigation', quantity: 1, unitPrice: 25000, totalPrice: 25000 },
        { description: 'TPO repair Building A', quantity: 15000, unitPrice: 0.75, totalPrice: 11250 },
        { description: 'TPO repair Building B', quantity: 12000, unitPrice: 0.75, totalPrice: 9000 },
        { description: 'Interior water damage repair', quantity: 1, unitPrice: 22500, totalPrice: 22500 }
      ],
      carrierResponse: 'Approved for emergency mitigation',
      internalNotes: 'Emergency supplement for storm damage',
      aiRecommendations: {
        confidenceScore: 0.93,
        riskScore: 0.15,
        reasoning: 'Emergency mitigation approved quickly',
        suggestedLineItems: [],
        missingDocumentation: [],
        questionsForEstimator: []
      },
      createdAt: new Date('2024-04-01'),
      updatedAt: new Date('2024-05-15')
    },
    {
      id: demoRandom.nextUuid(),
      claimId: oakValleyClaim.id,
      customerId: oakValleyCustomer.id,
      propertyId: oakValleyProperty.id,
      supplementNumber: 'SUP-20240009',
      status: 'under_review',
      requestedAmount: 95000,
      approvedAmount: 0,
      paidAmount: 0,
      outstandingAmount: 0,
      submittedAt: new Date('2024-11-01'),
      approvedAt: undefined,
      paidAt: undefined,
      lineItems: [
        { description: 'TPO replacement Building C', quantity: 20000, unitPrice: 0.75, totalPrice: 15000 },
        { description: 'TPO replacement Building D', quantity: 18000, unitPrice: 0.75, totalPrice: 13500 },
        { description: 'Structural repairs', quantity: 1, unitPrice: 45000, totalPrice: 45000 },
        { description: 'Additional interior repairs', quantity: 1, unitPrice: 21500, totalPrice: 21500 }
      ],
      carrierResponse: undefined,
      internalNotes: 'Multiple buildings affected',
      aiRecommendations: {
        confidenceScore: 0.82,
        riskScore: 0.32,
        reasoning: 'Complex multi-building supplement requiring detailed documentation',
        suggestedLineItems: ['Structural repairs'],
        missingDocumentation: ['Building-by-building assessment', 'Photos for each building'],
        questionsForEstimator: ['Confirm all buildings included in scope']
      },
      createdAt: new Date('2024-11-01'),
      updatedAt: new Date('2024-12-10')
    }
  ];

  const oakValleyDocuments = oakValleySupplements.flatMap((supp, idx) => [
    createDocumentSeed(oakValleyClaim.id, oakValleyCustomer.id, oakValleyProperty.id, supp.id, idx * 5 + 1),
    createDocumentSeed(oakValleyClaim.id, oakValleyCustomer.id, oakValleyProperty.id, supp.id, idx * 5 + 2),
    createDocumentSeed(oakValleyClaim.id, oakValleyCustomer.id, oakValleyProperty.id, supp.id, idx * 5 + 3),
    createDocumentSeed(oakValleyClaim.id, oakValleyCustomer.id, oakValleyProperty.id, supp.id, idx * 5 + 4),
    createDocumentSeed(oakValleyClaim.id, oakValleyCustomer.id, oakValleyProperty.id, supp.id, idx * 5 + 5)
  ]);

  const oakValleyActivities = [
    createActivityEventSeed(oakValleyClaim.id, oakValleyCustomer.id, oakValleyProperty.id, new Date('2024-02-15'), 0),
    createActivityEventSeed(oakValleyClaim.id, oakValleyCustomer.id, oakValleyProperty.id, new Date('2024-02-18'), 1),
    createActivityEventSeed(oakValleyClaim.id, oakValleyCustomer.id, oakValleyProperty.id, new Date('2024-03-01'), 2),
    createActivityEventSeed(oakValleyClaim.id, oakValleyCustomer.id, oakValleyProperty.id, new Date('2024-04-01'), 3),
    createActivityEventSeed(oakValleyClaim.id, oakValleyCustomer.id, oakValleyProperty.id, new Date('2024-04-20'), 4),
    createActivityEventSeed(oakValleyClaim.id, oakValleyCustomer.id, oakValleyProperty.id, new Date('2024-05-15'), 5),
    createActivityEventSeed(oakValleyClaim.id, oakValleyCustomer.id, oakValleyProperty.id, new Date('2024-08-01'), 6),
    createActivityEventSeed(oakValleyClaim.id, oakValleyCustomer.id, oakValleyProperty.id, new Date('2024-11-01'), 7),
    createActivityEventSeed(oakValleyClaim.id, oakValleyCustomer.id, oakValleyProperty.id, new Date('2024-12-10'), 8)
  ];

  personas.push({
    customer: oakValleyCustomer,
    property: oakValleyProperty,
    claim: oakValleyClaim,
    adjuster: adjusters[5],
    supplements: oakValleySupplements,
    documents: oakValleyDocuments,
    activities: oakValleyActivities,
    workflow: 'B',
    story: 'Emergency mitigation. Multiple buildings. Several adjusters. Many documents. Long-running claim. Large activity history.'
  });

  return personas;
}

// ============================================================================
// GENERAL DATA GENERATION
// ============================================================================

/**
 * Generate additional customers beyond the personas
 */
export function generateAdditionalCustomers(count: number): CustomerSeed[] {
  const customers: CustomerSeed[] = [];
  for (let i = 0; i < count; i++) {
    customers.push(createCustomerSeed(i));
  }
  return customers;
}

/**
 * Generate additional properties linked to customers
 */
export function generateAdditionalProperties(customers: CustomerSeed[]): PropertySeed[] {
  const properties: PropertySeed[] = [];
  customers.forEach((customer, index) => {
    const numProperties = demoRandom.nextInt(1, 2);
    for (let i = 0; i < numProperties; i++) {
      properties.push(createPropertySeed(customer.id, index * 2 + i));
    }
  });
  return properties;
}

/**
 * Generate additional claims
 */
export function generateAdditionalClaims(
  customers: CustomerSeed[],
  properties: PropertySeed[],
  count: number
): ClaimSeed[] {
  const claims: ClaimSeed[] = [];
  for (let i = 0; i < count; i++) {
    const customer = demoRandom.pick(customers);
    const customerProperties = properties.filter(p => p.customerId === customer.id);
    const property = customerProperties.length > 0 ? demoRandom.pick(customerProperties) : properties[0];
    claims.push(createClaimSeed(customer.id, property.id, i));
  }
  return claims;
}

/**
 * Generate additional activity events for claims
 */
export function generateActivityEventsForClaims(
  claims: ClaimSeed[],
  eventsPerClaim: number
): ActivityEventSeed[] {
  const activities: ActivityEventSeed[] = [];
  claims.forEach((claim, claimIndex) => {
    const baseDate = claim.dateOfLoss;
    for (let i = 0; i < eventsPerClaim; i++) {
      activities.push(createActivityEventSeed(
        claim.id,
        claim.customerId,
        claim.propertyId,
        baseDate,
        i
      ));
    }
  });
  return activities;
}
