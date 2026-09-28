import test from 'node:test';
import assert from 'node:assert';
import { hindsightService } from '../server/hindsight-service.ts';

test('REGRESSION: 1. Dashboard State & Stats Loading', () => {
  const stats = hindsightService.getStats();
  assert.ok(stats);
  assert.strictEqual(stats.bankId, 'tracemind-sre-prod');
  assert.ok(stats.totalMemories >= 4);
  assert.ok(
    stats.hindsightClientStatus === 'READY' ||
    stats.hindsightClientStatus === 'ACTIVE' ||
    stats.hindsightClientStatus === 'CONNECTED' ||
    stats.hindsightClientStatus === 'EMBEDDED_ACTIVE'
  );
});

test('REGRESSION: 2. Incident History Retrieval', () => {
  const incidents = hindsightService.getIncidents();
  assert.ok(Array.isArray(incidents));
  assert.ok(incidents.length > 0);
  
  const sample = incidents[0];
  assert.ok(sample.id);
  assert.ok(sample.title);
  assert.ok(sample.service);
});

test('REGRESSION: 3. Memory Bank Experience Retrieval', () => {
  const memories = hindsightService.getMemories();
  assert.ok(Array.isArray(memories));
  assert.ok(memories.length >= 4);

  const sample = memories[0];
  assert.ok(sample.id);
  assert.ok(sample.bankId);
  assert.ok(sample.rootCause);
  assert.ok(sample.successfulResolution);
  assert.ok(Array.isArray(sample.tags));
});

test('REGRESSION: 4. Incident Lookup by ID', () => {
  const incidents = hindsightService.getIncidents();
  const firstId = incidents[0].id;
  const found = hindsightService.getIncidentById(firstId);
  assert.ok(found);
  assert.strictEqual(found?.id, firstId);

  const notFound = hindsightService.getIncidentById('NON_EXISTENT_INCIDENT_ID');
  assert.strictEqual(notFound, undefined);
});

test('REGRESSION: 5. Demo State Reset Workflow (Cold Start vs. Warm Production)', () => {
  // Test Cold Demo Reset
  const coldStats = hindsightService.resetDemoMode('cold_demo');
  assert.ok(coldStats);
  assert.strictEqual(coldStats.totalMemories, 4);

  // Test Warm Production Reset
  const warmStats = hindsightService.resetDemoMode('warm_production');
  assert.ok(warmStats);
  assert.ok(warmStats.totalMemories >= 5);
});
