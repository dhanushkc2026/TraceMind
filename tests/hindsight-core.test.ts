import test from 'node:test';
import assert from 'node:assert';
import { hindsightService } from '../server/hindsight-service.ts';
import { geminiService } from '../server/gemini-service.ts';
import { Incident } from '../server/types.ts';

test('CORE HINDSIGHT: 1. Cold State Incident Ingestion with Zero Precedents', async () => {
  // Reset to clean cold state
  hindsightService.resetDemoMode('cold_demo');
  const initialMemories = hindsightService.getMemories();
  
  // Verify seed memories do NOT contain database pool exhaustion for PaymentService
  const matchingSeed = initialMemories.filter(
    (m) => m.service === 'PaymentService' || m.content.toLowerCase().includes('hikaricp')
  );
  assert.strictEqual(matchingSeed.length, 0, 'Cold start must have zero database pool memories for PaymentService');

  // Query Recall for cold incident
  const coldRecall = await hindsightService.recall(
    'PaymentService',
    'HikariPool-1 - Connection is not available, request timed out after 30002ms.',
    'java.sql.SQLTransientConnectionException: HikariPool-1 - Connection is not available',
    ['504 Gateway Timeouts', 'pool starvation']
  );

  assert.strictEqual(coldRecall.maxSimilarity, 0, 'Cold start similarity must be 0 for unprecedented error');
  assert.strictEqual(coldRecall.results.length, 0, 'Cold start must return 0 matching memories');
});

test('CORE HINDSIGHT: 2. Reflection and Grounded SRE Analysis for Cold Incident', async () => {
  const coldRecall = await hindsightService.recall(
    'PaymentService',
    'HikariPool-1 - Connection is not available, request timed out after 30002ms.',
    'java.sql.SQLTransientConnectionException',
    ['504 Gateway Timeouts']
  );

  const reflectData = await hindsightService.reflect(
    { service: 'PaymentService', errorMessage: 'HikariPool-1 timeout' },
    coldRecall.results
  );

  assert.ok(reflectData);
  assert.ok(reflectData.reflectionSummary.includes('Cold Start'));

  const analysis = await geminiService.analyzeIncident({
    title: 'Database Connection Pool Exhaustion on Checkout Flow',
    service: 'PaymentService',
    severity: 'CRITICAL',
    errorMessage: 'HikariPool-1 - Connection is not available, request timed out after 30002ms.',
    logs: 'Connection timeout after 30002ms. active=10, idle=0, waiting=124',
    symptoms: ['504 Gateway Timeouts', 'pool starvation'],
    recalledMemories: coldRecall.results,
    reflectData,
  });

  assert.ok(analysis.likelyRootCause);
  assert.ok(analysis.recommendedAction);
  assert.strictEqual(analysis.memoryUsed, false, 'Cold start analysis should indicate memory was not used');
});

test('CORE HINDSIGHT: 3. Incident Ingestion and Retention of Resolved Experience', async () => {
  const incidentId = `INC-TEST-${Date.now().toString().slice(-4)}`;
  const coldIncident: Incident = {
    id: incidentId,
    title: 'Database Connection Pool Exhaustion on Checkout Flow',
    timestamp: new Date().toISOString(),
    service: 'PaymentService',
    severity: 'CRITICAL',
    status: 'RESOLVED',
    errorMessage: 'HikariPool-1 - Connection is not available, request timed out after 30002ms.',
    logs: 'active=10, idle=0, waiting=124',
    symptoms: ['504 Gateway Timeouts', 'pool starvation'],
    rootCause: 'HikariCP maxPoolSize was set to default 10 connections while worker threads spiked to 120.',
    successfulResolution: 'Increased HikariCP maximumPoolSize to 50 and set connectionTimeout to 3000ms.',
    failedApproaches: ['Restarting replica pods (exhausted immediately again)'],
    runbookUsed: 'RUNBOOK-DB-09: Connection Pool Sizing & Hikari Tuning',
    developerFeedback: 'Increasing pool size solved the bottleneck in 90 seconds.',
    finalOutcome: 'SUCCESS',
    mttrMinutes: 38,
  };

  hindsightService.addIncident(coldIncident);
  const memoryUnit = await hindsightService.retain(coldIncident);

  assert.ok(memoryUnit.id);
  assert.strictEqual(memoryUnit.service, 'PaymentService');
  assert.strictEqual(memoryUnit.rootCause, coldIncident.rootCause);
  assert.strictEqual(memoryUnit.successfulResolution, coldIncident.successfulResolution);
  assert.ok(memoryUnit.failedApproaches && memoryUnit.failedApproaches.length > 0);
  assert.strictEqual(memoryUnit.outcome, 'SUCCESS');

  // Verify memory persists in memory bank
  const allMemories = hindsightService.getMemories();
  const found = allMemories.find((m) => m.id === memoryUnit.id);
  assert.ok(found, 'Retained memory unit must exist in persistent bank');
});

test('CORE HINDSIGHT: 4. Relevant Memory Recall and Precedent Matching for Future Outage', async () => {
  // New incident occurs in OrderService with identical database pool timeout symptom
  const warmRecall = await hindsightService.recall(
    'OrderService',
    'HikariPool-1 - Connection is not available, request timed out after 30002ms.',
    'java.sql.SQLTransientConnectionException: HikariPool-1 - Connection is not available',
    ['504 Gateway Timeouts', 'pool starvation', '142 blocked worker threads']
  );

  assert.ok(warmRecall.results.length > 0, 'Warm recall must find prior precedents');
  assert.ok(warmRecall.maxSimilarity >= 60, `Warm recall match similarity must be high (got ${warmRecall.maxSimilarity}%)`);
  
  const matchedPrecedent = warmRecall.results[0];
  assert.strictEqual(matchedPrecedent.service, 'PaymentService', 'Cross-service precedent must recall PaymentService fix');
  assert.ok(matchedPrecedent.successfulResolution?.includes('50'), 'Must contain the 50-pool resolution');
  assert.ok(matchedPrecedent.failedApproaches?.some((a) => a.toLowerCase().includes('restarting')), 'Must recall that pod restarts failed');
});

test('CORE HINDSIGHT: 5. Reflection Synthesis & Grounded Recommendation with Failure Blacklisting', async () => {
  const warmRecall = await hindsightService.recall(
    'OrderService',
    'HikariPool-1 - Connection is not available, request timed out after 30002ms.',
    'java.sql.SQLTransientConnectionException',
    ['504 Gateway Timeouts']
  );

  const reflectData = await hindsightService.reflect(
    { service: 'OrderService', errorMessage: 'HikariPool-1 timeout' },
    warmRecall.results
  );

  assert.ok(reflectData.reflectionSummary);
  assert.ok(reflectData.whyAvoidFailedAttempts.includes('restarting replica pods'), 'Must warn against restarting pods');

  const analysis = await geminiService.analyzeIncident({
    title: 'OrderService 504 Gateway Timeout during Checkout Surge',
    service: 'OrderService',
    severity: 'CRITICAL',
    errorMessage: 'HikariPool-1 - Connection is not available, request timed out after 30002ms.',
    logs: 'Connection timeout after 30002ms. active=10, idle=0, waiting=142',
    symptoms: ['504 Gateway Timeouts', 'pool starvation'],
    recalledMemories: warmRecall.results,
    reflectData,
  });

  assert.strictEqual(analysis.memoryUsed, true, 'Warm analysis must confirm memory was used');
  assert.ok(analysis.similarityScore && analysis.similarityScore >= 60);
  assert.ok(analysis.recommendedAction.includes('50'), 'Grounded recommendation must reuse the 50-pool fix');
  assert.ok(analysis.warningsAgainstKnownFailures.length > 0, 'Must warn against known failure attempts');
  assert.ok(analysis.estimatedMttrMinutes < 10, 'Estimated MTTR must reflect warm precedent speedup');
});

test('CORE HINDSIGHT: 6. Human Confirmation and Retention of Resolved Experience', async () => {
  const secondIncidentId = `INC-ORDER-${Date.now().toString().slice(-4)}`;
  const resolvedIncident: Incident = {
    id: secondIncidentId,
    title: 'OrderService 504 Gateway Timeout during Checkout Surge',
    timestamp: new Date().toISOString(),
    service: 'OrderService',
    severity: 'CRITICAL',
    status: 'RESOLVED',
    errorMessage: 'HikariPool-1 - Connection is not available, request timed out after 30002ms.',
    logs: 'active=10, idle=0, waiting=142',
    symptoms: ['504 Gateway Timeouts', 'pool starvation'],
    rootCause: 'HikariCP maxPoolSize was set to default 10 connections. Precedent from PaymentService applied.',
    successfulResolution: 'Increased HikariCP maximumPoolSize to 50 & connectionTimeout to 3000ms based on Hindsight precedent.',
    failedApproaches: ['Bypassed pod restart based on Hindsight blacklisted attempt warning'],
    runbookUsed: 'RUNBOOK-DB-09: Connection Pool Sizing & Hikari Tuning',
    developerFeedback: 'Resolved within 3 minutes by reusing proven precedent.',
    finalOutcome: 'SUCCESS',
    mttrMinutes: 3.2,
  };

  hindsightService.addIncident(resolvedIncident);
  const memory = await hindsightService.retain(resolvedIncident);

  assert.ok(memory.id);
  assert.strictEqual(memory.service, 'OrderService');
  assert.strictEqual(memory.mttrMinutes, 3.2);

  // Experience can now be recalled again across any future service
  const thirdRecall = await hindsightService.recall(
    'AuthService',
    'HikariPool-1 - Connection is not available, request timed out after 30002ms.',
    '',
    ['504 Gateway Timeouts', 'pool starvation']
  );

  assert.ok(thirdRecall.results.length >= 2, 'Future service must now recall experience from multiple previous incidents');
});
