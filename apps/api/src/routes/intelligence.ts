// apps/api/src/routes/intelligence.ts
// API routes for Atlas Intelligence

import { FastifyInstance } from 'fastify';
import { analyticsService } from '../lib/intelligence/analytics-service';
import { businessIntelligenceService } from '../lib/intelligence/business-intelligence-service';
import { recommendationService } from '../lib/intelligence/recommendation-service';
import { learningRepository } from '../lib/intelligence/learning-repository';
import { healthService } from '../lib/intelligence/health-service';
import { diagnosticsService } from '../lib/intelligence/diagnostics-service';

export default async function intelligenceRoutes(fastify: FastifyInstance) {
  // Query endpoint for Ask Atlas
  fastify.post('/query', async (request, reply) => {
    try {
      const { question, timeframe } = request.body as { question: string; timeframe?: string };
      
      if (!question) {
        return reply.status(400).send({ error: 'Question is required' });
      }

      const result = await analyticsService.processQuery({
        type: 'revenue',
        question,
        timeframe: timeframe as 'today' | 'week' | 'month' | 'quarter' | 'year' | 'all' | undefined
      });

      return reply.send(result);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to process query' });
    }
  });

  // Get business insights
  fastify.get('/insights', async (request, reply) => {
    try {
      const insights = await businessIntelligenceService.getInsights();
      return reply.send(insights);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch insights' });
    }
  });

  // Get insights by category
  fastify.get('/insights/:category', async (request, reply) => {
    try {
      const { category } = request.params as { category: string };
      const insights = await businessIntelligenceService.getInsightsByCategory(category);
      return reply.send(insights);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch insights' });
    }
  });

  // Get recommendations
  fastify.get('/recommendations', async (request, reply) => {
    try {
      const recommendations = await recommendationService.getRecommendations();
      return reply.send(recommendations);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch recommendations' });
    }
  });

  // Get recommendations by priority
  fastify.get('/recommendations/priority/:priority', async (request, reply) => {
    try {
      const { priority } = request.params as { priority: string };
      const recommendations = await recommendationService.getRecommendationsByPriority(priority as 'high' | 'medium' | 'low');
      return reply.send(recommendations);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch recommendations' });
    }
  });

  // Acknowledge recommendation
  fastify.post('/recommendations/:id/acknowledge', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      await recommendationService.acknowledgeRecommendation(id);
      return reply.send({ success: true });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to acknowledge recommendation' });
    }
  });

  // Record AI interaction
  fastify.post('/learning/interactions', async (request, reply) => {
    try {
      const interaction = request.body as Omit<any, 'id' | 'timestamp'>;
      const recorded = await learningRepository.recordInteraction(interaction);
      return reply.send(recorded);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to record interaction' });
    }
  });

  // Get learning statistics
  fastify.get('/learning/statistics', async (request, reply) => {
    try {
      const stats = await learningRepository.getLearningStatistics();
      return reply.send(stats);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch learning statistics' });
    }
  });

  // Get learning patterns
  fastify.get('/learning/patterns/:type', async (request, reply) => {
    try {
      const { type } = request.params as { type: string };
      
      let patterns;
      switch (type) {
        case 'denial_reasons':
          patterns = await learningRepository.getCommonDenialReasons();
          break;
        case 'supplement_revisions':
          patterns = await learningRepository.getCommonSupplementRevisions();
          break;
        case 'documentation_requests':
          patterns = await learningRepository.getCommonDocumentationRequests();
          break;
        case 'carrier_preferences':
          patterns = await learningRepository.getCarrierPreferences();
          break;
        default:
          return reply.status(400).send({ error: 'Invalid pattern type' });
      }

      return reply.send(patterns);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch patterns' });
    }
  });

  // Health check endpoint
  fastify.get('/health', async (request, reply) => {
    try {
      const health = await healthService.getHealthStatus();
      return reply.send(health);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch health status' });
    }
  });

  // Run specific health check
  fastify.get('/health/check/:checkName', async (request, reply) => {
    try {
      const { checkName } = request.params as { checkName: string };
      const check = await healthService.runSpecificCheck(checkName);
      return reply.send(check);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to run health check' });
    }
  });

  // Get diagnostics
  fastify.get('/diagnostics', async (request, reply) => {
    try {
      const diagnostics = await diagnosticsService.getDiagnostics();
      return reply.send(diagnostics);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch diagnostics' });
    }
  });

  // Clear cache
  fastify.post('/diagnostics/clear-cache', async (request, reply) => {
    try {
      const result = await diagnosticsService.clearCache();
      return reply.send(result);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to clear cache' });
    }
  });

  // Refresh health
  fastify.post('/diagnostics/refresh-health', async (request, reply) => {
    try {
      const health = await diagnosticsService.refreshHealth();
      return reply.send(health);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to refresh health' });
    }
  });

  // Export diagnostics
  fastify.get('/diagnostics/export', async (request, reply) => {
    try {
      const diagnostics = await diagnosticsService.exportDiagnostics();
      reply.type('application/json');
      return reply.send(diagnostics);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to export diagnostics' });
    }
  });
}
