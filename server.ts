import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { hindsightService } from './server/hindsight-service.js';
import { geminiService } from './server/gemini-service.js';
import { Incident } from './server/types.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // --- HEALTH & STATUS ---
  app.get('/api/health', (req, res) => {
    const stats = hindsightService.getStats();
    res.json({
      status: 'healthy',
      app: 'TraceMind',
      tagline: 'Your production history becomes your AI’s experience.',
      hindsight: {
        status: stats.hindsightClientStatus,
        bankId: stats.bankId,
        totalMemories: stats.totalMemories,
        operations: stats.operationsCount,
      },
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    });
  });

  // --- INCIDENT ENDPOINTS ---

  // Get all incidents
  app.get('/api/incidents', (req, res) => {
    try {
      const incidents = hindsightService.getIncidents();
      res.json(incidents);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get single incident
  app.get('/api/incidents/:id', (req, res) => {
    try {
      const incident = hindsightService.getIncidentById(req.params.id);
      if (!incident) {
        return res.status(404).json({ error: 'Incident not found' });
      }
      res.json(incident);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Analyze new incident: HINDSIGHT RECALL → HINDSIGHT REFLECT → SRE REASONING
  app.post('/api/incidents/analyze', async (req, res) => {
    try {
      const {
        title,
        service,
        severity = 'HIGH',
        errorMessage,
        logs = '',
        symptoms = [],
      } = req.body;

      if (!title || !service || !errorMessage) {
        return res.status(400).json({ error: 'Title, service, and errorMessage are required.' });
      }

      const symptomsList = Array.isArray(symptoms) ? symptoms : [symptoms];

      // 1. HINDSIGHT RECALL: Query past historical precedents
      const { results: recalledMemories, maxSimilarity } = await hindsightService.recall(
        service,
        errorMessage,
        logs,
        symptomsList
      );

      // 2. HINDSIGHT REFLECT: Deep reasoning synthesis over memories
      const reflectData = await hindsightService.reflect(
        { service, errorMessage },
        recalledMemories
      );

      // 3. SRE REASONING using Gemini grounded on Hindsight Recall & Reflect
      const analysis = await geminiService.analyzeIncident({
        title,
        service,
        severity,
        errorMessage,
        logs,
        symptoms: symptomsList,
        recalledMemories,
        reflectData,
      });

      // 4. Register incident in system
      const incidentId = `INC-${Date.now().toString().slice(-4)}`;
      const newIncident: Incident = {
        id: incidentId,
        title,
        timestamp: new Date().toISOString(),
        service,
        severity,
        status: 'ANALYZED',
        errorMessage,
        logs,
        symptoms: symptomsList,
        rootCause: analysis.likelyRootCause,
        resolutionAttempted: analysis.recommendedAction,
        analysis,
        mttrMinutes: analysis.estimatedMttrMinutes,
        investigationTimeMinutes: analysis.memoryUsed ? 1 : 28,
      };

      hindsightService.addIncident(newIncident);

      res.json({
        incident: newIncident,
        analysis,
        recalledMemories,
        reflectData,
        hindsightMatchScore: maxSimilarity,
      });
    } catch (err: any) {
      console.error('[TraceMind] Incident analysis error:', err);
      res.status(500).json({ error: err.message || 'Failed to analyze incident' });
    }
  });

  // Resolve incident: HINDSIGHT RETAIN (stores outcome, root cause, failed approaches, MTTR into Hindsight)
  app.post('/api/incidents/resolve', async (req, res) => {
    try {
      const {
        incidentId,
        rootCause,
        successfulResolution,
        failedApproaches = [],
        runbookUsed = '',
        developerFeedback = '',
        outcome = 'SUCCESS',
        mttrMinutes,
      } = req.body;

      if (!incidentId) {
        return res.status(400).json({ error: 'incidentId is required.' });
      }

      const existing = hindsightService.getIncidentById(incidentId);
      if (!existing) {
        return res.status(404).json({ error: 'Incident not found' });
      }

      const updated = hindsightService.updateIncident(incidentId, {
        status: outcome === 'SUCCESS' ? 'RESOLVED' : 'FAILED',
        rootCause: rootCause || existing.rootCause || 'Unspecified',
        successfulResolution: successfulResolution || existing.successfulResolution || (outcome === 'SUCCESS' ? existing.resolutionAttempted : undefined),
        failedApproaches: Array.isArray(failedApproaches) ? failedApproaches : [failedApproaches],
        runbookUsed,
        developerFeedback,
        finalOutcome: outcome,
        resolvedAt: new Date().toISOString(),
        mttrMinutes: mttrMinutes !== undefined ? mttrMinutes : (existing.analysis?.memoryUsed ? 3.2 : 38),
      });

      if (!updated) {
        return res.status(500).json({ error: 'Failed to update incident' });
      }

      // HINDSIGHT RETAIN: Commit learning to persistent memory bank
      const memoryUnit = await hindsightService.retain(updated);
      hindsightService.updateIncident(incidentId, { hindsightMemoryId: memoryUnit.id });

      res.json({
        success: true,
        incident: updated,
        retainedMemory: memoryUnit,
        message: 'Outcome successfully committed to Hindsight Persistent Memory. Future incidents will utilize this learning.',
      });
    } catch (err: any) {
      console.error('[TraceMind] Resolve incident error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // --- HINDSIGHT ENGINE ENDPOINTS ---

  // Get all Hindsight memory units
  app.get('/api/hindsight/memories', (req, res) => {
    try {
      const memories = hindsightService.getMemories();
      res.json(memories);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get Hindsight memory statistics & operation metrics
  app.get('/api/hindsight/stats', (req, res) => {
    try {
      const stats = hindsightService.getStats();
      res.json(stats);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Manual recall endpoint
  app.post('/api/hindsight/recall', async (req, res) => {
    try {
      const { service = '', query = '', logs = '', symptoms = [] } = req.body;
      const result = await hindsightService.recall(service, query, logs, symptoms);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Manual reflect endpoint
  app.post('/api/hindsight/reflect', async (req, res) => {
    try {
      const { service = '', errorMessage = '', recalledMemories = [] } = req.body;
      const result = await hindsightService.reflect({ service, errorMessage }, recalledMemories);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Reset demo state (Cold Start vs. Warm Production History)
  const handleResetDemo = (req: any, res: any) => {
    try {
      const { mode = 'warm_production' } = req.body;
      const stats = hindsightService.resetDemoMode(mode as 'cold_demo' | 'warm_production');
      res.json({
        success: true,
        mode,
        message: mode === 'cold_demo'
          ? 'Reset to Cold Memory state. TraceMind has NO prior database timeout history.'
          : 'Reset to Warm Production state with accumulated Hindsight memories and recurring patterns.',
        stats,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  app.post('/api/demo/reset', handleResetDemo);
  app.post('/api/hindsight/reset-demo', handleResetDemo);

  // --- VITE MIDDLEWARE / STATIC ASSETS ---
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TraceMind] SRE Agent running on http://0.0.0.0:${PORT}`);
    console.log(`[TraceMind] Hindsight persistent memory ready.`);
  });
}

startServer().catch((err) => {
  console.error('[TraceMind] Server startup error:', err);
  process.exit(1);
});
