/**
 * Demo Mode API Routes
 * 
 * Endpoints for managing demo data:
 * - POST /api/demo/generate - Generate demo data
 * - POST /api/demo/reset - Reset demo data
 * - DELETE /api/demo/clear - Clear all demo data
 * - GET /api/demo/status - Check demo mode status
 * - GET /api/demo/metrics - Get dashboard metrics
 */

import { FastifyInstance } from 'fastify';
import { generateDemoData, calculateDashboardMetrics, validateDataIntegrity } from '../lib/demo-data/demo-data-service';
import { seedDemoData, clearDemoData } from '../lib/demo-data/database-seeder';

// Demo mode state
let demoModeEnabled = false;
let demoCompanyId: string | null = null;
let cachedDemoData: any = null;

export async function demoRoutes(fastify: FastifyInstance) {
  /**
   * Generate Demo Data
   * POST /api/demo/generate
   */
  fastify.post('/generate', async (request, reply) => {
    try {
      // Generate demo data
      const demoData = generateDemoData();
      cachedDemoData = demoData;

      // Validate data integrity
      const validation = validateDataIntegrity(demoData);
      if (!validation.valid) {
        fastify.log.error({ errors: validation.errors }, 'Demo data validation failed');
        return reply.status(500).send({
          error: 'Data validation failed',
          errors: validation.errors
        });
      }

      // Seed to in-memory storage
      const seedResult = await seedDemoData(demoData);
      if (!seedResult.success) {
        fastify.log.error({ error: seedResult.message }, 'Demo data seeding failed');
        return reply.status(500).send({
          error: 'Failed to seed demo data',
          message: seedResult.message
        });
      }

      demoModeEnabled = true;
      demoCompanyId = seedResult.companyId || null;

      // Calculate metrics
      const metrics = calculateDashboardMetrics(demoData);

      return reply.send({
        success: true,
        message: 'Demo data generated successfully',
        data: {
          company: demoData.company,
          companyId: demoCompanyId,
          summary: {
            customers: demoData.customers.length,
            properties: demoData.properties.length,
            claims: demoData.claims.length,
            adjusters: demoData.adjusters.length,
            documents: demoData.documents.length,
            interviews: demoData.interviews.length,
            supplements: demoData.supplements.length,
            activities: demoData.activities.length,
            users: demoData.users.length,
            teams: demoData.teams.length
          },
          personas: demoData.personas.map((p: any) => ({
            customerName: `${p.customer.firstName} ${p.customer.lastName}`,
            claimNumber: p.claim.claimNumber,
            workflow: p.workflow,
            story: p.story
          })),
          metrics
        }
      });
    } catch (error) {
      fastify.log.error({ error }, 'Error generating demo data');
      return reply.status(500).send({
        error: 'Failed to generate demo data',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  /**
   * Reset Demo Data
   * POST /api/demo/reset
   * Clears and regenerates demo data with the same seed
   */
  fastify.post('/reset', async (request, reply) => {
    try {
      if (!demoModeEnabled) {
        return reply.status(400).send({
          error: 'Demo mode is not enabled'
        });
      }

      // Clear existing data
      if (demoCompanyId) {
        await clearDemoData(demoCompanyId);
      }

      // Regenerate demo data (same seed = same data)
      const demoData = generateDemoData();
      cachedDemoData = demoData;

      // Validate
      const validation = validateDataIntegrity(demoData);
      if (!validation.valid) {
        return reply.status(500).send({
          error: 'Data validation failed',
          errors: validation.errors
        });
      }

      // Seed to in-memory storage
      const seedResult = await seedDemoData(demoData);
      demoCompanyId = seedResult.companyId || null;

      // Calculate metrics
      const metrics = calculateDashboardMetrics(demoData);

      return reply.send({
        success: true,
        message: 'Demo data reset successfully',
        data: {
          companyId: demoCompanyId,
          summary: {
            customers: demoData.customers.length,
            properties: demoData.properties.length,
            claims: demoData.claims.length,
            adjusters: demoData.adjusters.length,
            documents: demoData.documents.length,
            interviews: demoData.interviews.length,
            supplements: demoData.supplements.length,
            activities: demoData.activities.length
          },
          metrics
        }
      });
    } catch (error) {
      fastify.log.error({ error }, 'Error resetting demo data');
      return reply.status(500).send({
        error: 'Failed to reset demo data',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  /**
   * Clear Demo Data
   * DELETE /api/demo/clear
   * Removes all demo data from memory and disables demo mode
   */
  fastify.delete('/clear', async (request, reply) => {
    try {
      if (!demoModeEnabled) {
        return reply.status(400).send({
          error: 'Demo mode is not enabled'
        });
      }

      // Clear from in-memory storage
      if (demoCompanyId) {
        await clearDemoData(demoCompanyId);
      }

      demoModeEnabled = false;
      demoCompanyId = null;
      cachedDemoData = null;

      return reply.send({
        success: true,
        message: 'Demo data cleared successfully'
      });
    } catch (error) {
      fastify.log.error({ error }, 'Error clearing demo data');
      return reply.status(500).send({
        error: 'Failed to clear demo data',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  /**
   * Get Demo Status
   * GET /api/demo/status
   */
  fastify.get('/status', async (request, reply) => {
    return reply.send({
      enabled: demoModeEnabled,
      hasData: demoCompanyId !== null,
      companyId: demoCompanyId
    });
  });

  /**
   * Get Dashboard Metrics
   * GET /api/demo/metrics
   */
  fastify.get('/metrics', async (request, reply) => {
    if (!demoModeEnabled || !cachedDemoData) {
      return reply.status(400).send({
        error: 'Demo mode is not enabled'
      });
    }

    try {
      const metrics = calculateDashboardMetrics(cachedDemoData);
      return reply.send(metrics);
    } catch (error) {
      fastify.log.error({ error }, 'Error calculating metrics');
      return reply.status(500).send({
        error: 'Failed to calculate metrics',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  /**
   * Get Demo Personas
   * GET /api/demo/personas
   */
  fastify.get('/personas', async (request, reply) => {
    if (!demoModeEnabled || !cachedDemoData) {
      return reply.status(400).send({
        error: 'Demo mode is not enabled'
      });
    }

    return reply.send({
      personas: cachedDemoData.personas.map((p: any) => ({
        id: p.claim.id,
        customerName: `${p.customer.firstName} ${p.customer.lastName}`,
        claimNumber: p.claim.claimNumber,
        insuranceCompany: p.claim.insuranceCompany,
        damageType: p.claim.damageType,
        status: p.claim.status,
        workflow: p.workflow,
        story: p.story,
        address: p.property.address,
        supplements: p.supplements.map((s: any) => ({
          supplementNumber: s.supplementNumber,
          status: s.status,
          requestedAmount: s.requestedAmount,
          approvedAmount: s.approvedAmount
        }))
      }))
    });
  });

  /**
   * Get Persona Details
   * GET /api/demo/personas/:claimId
   */
  fastify.get('/personas/:claimId', async (request, reply) => {
    if (!demoModeEnabled || !cachedDemoData) {
      return reply.status(400).send({
        error: 'Demo mode is not enabled'
      });
    }

    const { claimId } = request.params as { claimId: string };
    const persona = cachedDemoData.personas.find((p: any) => p.claim.id === claimId);

    if (!persona) {
      return reply.status(404).send({
        error: 'Persona not found'
      });
    }

    return reply.send({
      customer: persona.customer,
      property: persona.property,
      claim: persona.claim,
      adjuster: persona.adjuster,
      supplements: persona.supplements,
      documents: persona.documents,
      interview: persona.interview,
      activities: persona.activities,
      workflow: persona.workflow,
      story: persona.story
    });
  });

  /**
   * Get All Customers
   * GET /api/demo/customers
   */
  fastify.get('/customers', async (request, reply) => {
    if (!demoModeEnabled || !cachedDemoData) {
      return reply.status(400).send({
        error: 'Demo mode is not enabled'
      });
    }

    return reply.send({
      customers: cachedDemoData.customers
    });
  });

  /**
   * Get All Claims
   * GET /api/demo/claims
   */
  fastify.get('/claims', async (request, reply) => {
    if (!demoModeEnabled || !cachedDemoData) {
      return reply.status(400).send({
        error: 'Demo mode is not enabled'
      });
    }

    return reply.send({
      claims: cachedDemoData.claims
    });
  });

  /**
   * Get All Supplements
   * GET /api/demo/supplements
   */
  fastify.get('/supplements', async (request, reply) => {
    if (!demoModeEnabled || !cachedDemoData) {
      return reply.status(400).send({
        error: 'Demo mode is not enabled'
      });
    }

    return reply.send({
      supplements: cachedDemoData.supplements
    });
  });

  /**
   * Get Activity Timeline
   * GET /api/demo/activities
   */
  fastify.get('/activities', async (request, reply) => {
    if (!demoModeEnabled || !cachedDemoData) {
      return reply.status(400).send({
        error: 'Demo mode is not enabled'
      });
    }

    const { claimId } = request.query as { claimId?: string };

    let activities = cachedDemoData.activities;
    if (claimId) {
      activities = activities.filter((a: any) => a.claimId === claimId);
    }

    // Sort by date
    activities = activities.sort((a: any, b: any) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return reply.send({
      activities
    });
  });

  /**
   * Get Guided Demo Walkthroughs
   * GET /api/demo/walkthroughs
   */
  fastify.get('/walkthroughs', async (request, reply) => {
    if (!demoModeEnabled || !cachedDemoData) {
      return reply.status(400).send({
        error: 'Demo mode is not enabled'
      });
    }

    const walkthroughs = [
      {
        id: 'lisa-chen',
        title: 'Start with Lisa Chen',
        description: 'Demonstrates contractor-first workflow from inspection to claim creation',
        workflow: 'B',
        claimId: cachedDemoData.personas[3].claim.id,
        customerId: cachedDemoData.personas[3].customer.id,
        propertyId: cachedDemoData.personas[3].property.id,
        steps: [
          'Review property inspection photos',
          'Examine FNOL interview responses',
          'Review claim creation details',
          'Analyze AI supplement recommendations',
          'Review approved supplement with missing line items'
        ]
      },
      {
        id: 'john-mitchell',
        title: 'Open John & Sarah Mitchell',
        description: 'Demonstrates an approved supplement with AI recommendations',
        workflow: 'A',
        claimId: cachedDemoData.personas[0].claim.id,
        customerId: cachedDemoData.personas[0].customer.id,
        propertyId: cachedDemoData.personas[0].property.id,
        steps: [
          'Review insurance claim details',
          'Examine hidden damage discovery',
          'Review AI supplement recommendations',
          'Analyze approved supplement',
          'Review payment and claim closure'
        ]
      },
      {
        id: 'emily-johnson',
        title: 'Review Emily Johnson',
        description: 'Demonstrates multiple supplement revisions and engineering reports',
        workflow: 'A',
        claimId: cachedDemoData.personas[1].claim.id,
        customerId: cachedDemoData.personas[1].customer.id,
        propertyId: cachedDemoData.personas[1].property.id,
        steps: [
          'Review water damage claim',
          'Examine mold remediation supplement',
          'Review engineer report documentation',
          'Analyze second supplement revision',
          'Review final approval and payment'
        ]
      },
      {
        id: 'robert-garcia',
        title: 'Review Robert Garcia',
        description: 'Demonstrates denied supplements and appeal workflow',
        workflow: 'A',
        claimId: cachedDemoData.personas[2].claim.id,
        customerId: cachedDemoData.personas[2].customer.id,
        propertyId: cachedDemoData.personas[2].property.id,
        steps: [
          'Review fire damage claim',
          'Examine structural damage supplement',
          'Review denial reason and carrier response',
          'Analyze appeal documentation',
          'Review pending appeal status'
        ]
      },
      {
        id: 'westgate',
        title: 'Explore Westgate Shopping Centre',
        description: 'Demonstrates commercial claims, executive dashboard metrics, multiple supplements and outstanding revenue',
        workflow: 'A',
        claimId: cachedDemoData.personas[4].claim.id,
        customerId: cachedDemoData.personas[4].customer.id,
        propertyId: cachedDemoData.personas[4].property.id,
        steps: [
          'Review commercial roof claim',
          'Examine large-scale supplement',
          'Review outstanding final supplement',
          'Analyze revenue metrics',
          'Review executive dashboard data'
        ]
      },
      {
        id: 'oak-valley',
        title: 'Explore Oak Valley Apartments',
        description: 'Demonstrates emergency mitigation, multiple buildings, and long-running claims',
        workflow: 'B',
        claimId: cachedDemoData.personas[5].claim.id,
        customerId: cachedDemoData.personas[5].customer.id,
        propertyId: cachedDemoData.personas[5].property.id,
        steps: [
          'Review emergency mitigation claim',
          'Examine multi-building damage',
          'Review long-running claim timeline',
          'Analyze activity history',
          'Review pending supplement'
        ]
      }
    ];

    return reply.send({
      walkthroughs
    });
  });
}
