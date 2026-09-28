/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { NewIncidentView } from './components/NewIncidentView';
import { IncidentAnalysisView } from './components/IncidentAnalysisView';
import { MemoryTimelineView } from './components/MemoryTimelineView';
import { IncidentHistoryView } from './components/IncidentHistoryView';
import { MemoryBankView } from './components/MemoryBankView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { ResolveModal } from './components/ResolveModal';
import { JudgeDemoBanner } from './components/JudgeDemoBanner';
import { ColdVsWarmModal } from './components/ColdVsWarmModal';
import { RetainVisualizerModal } from './components/RetainVisualizerModal';
import { LoginPage } from './components/LoginPage';
import { api } from './services/api';
import { authService } from './services/auth-service';
import { Incident, HindsightMemoryUnit, HindsightStats, IncidentSeverity, AuthUser } from './types';
import { CheckCircle2, AlertTriangle, Sparkles, X } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => authService.getCurrentUser());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [memories, setMemories] = useState<HindsightMemoryUnit[]>([]);
  const [stats, setStats] = useState<HindsightStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Resolution modal state
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [resolveOutcome, setResolveOutcome] = useState<'SUCCESS' | 'FAILED' | 'PARTIAL'>('SUCCESS');

  // Cold vs Warm MTTR Benchmark modal
  const [isMttrModalOpen, setIsMttrModalOpen] = useState(false);

  // Retain Ingestion Visualizer modal
  const [isRetainVisualizerOpen, setIsRetainVisualizerOpen] = useState(false);
  const [lastRetainedMemory, setLastRetainedMemory] = useState<HindsightMemoryUnit | null>(null);

  // Judge Demo Step State (1: Cold Start, 2: Retain Ingestion, 3: Warm Recall, 4: Reflect, 5: Evaluation, 6: Timeline)
  const [currentJudgeStep, setCurrentJudgeStep] = useState<number>(1);
  const [isAutoPlayingDemo, setIsAutoPlayingDemo] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<{
    title: string;
    description: string;
    type: 'success' | 'info';
  } | null>(null);

  // Preset tracking for demo interactions
  const [demoPreset, setDemoPreset] = useState<'cold_db' | 'warm_db' | null>(null);

  const loadData = async () => {
    try {
      const [incidentsData, memoriesData, statsData] = await Promise.all([
        api.getIncidents(),
        api.getMemories(),
        api.getStats(),
      ]);
      setIncidents(incidentsData);
      setMemories(memoriesData);
      setStats(statsData);

      if (!selectedIncident && incidentsData.length > 0) {
        setSelectedIncident(incidentsData[0]);
      }
    } catch (err) {
      console.error('Failed to load TraceMind data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (title: string, description: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ title, description, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  };

  // Analyze new incident
  const handleAnalyzeIncident = async (payload: {
    title: string;
    service: string;
    severity: IncidentSeverity;
    errorMessage: string;
    logs: string;
    symptoms: string[];
  }) => {
    setIsAnalyzing(true);
    try {
      const res = await api.analyzeIncident(payload);
      setIncidents((prev) => [res.incident, ...prev]);
      setSelectedIncident(res.incident);
      setActiveTab('analysis');

      const isWarm = res.analysis.memoryUsed;
      showToast(
        isWarm ? 'Precedent Recalled from Hindsight!' : 'Cold Start Analysis Completed',
        isWarm
          ? `Matched past incident with ${res.hindsightMatchScore}% relevance. SRE recommendation formulated. Estimated MTTR: 3.2 mins!`
          : 'Zero prior memories found. First-principles SRE diagnosis generated. MTTR: 38 mins.'
      );

      const [updatedMemories, updatedStats] = await Promise.all([
        api.getMemories(),
        api.getStats(),
      ]);
      setMemories(updatedMemories);
      setStats(updatedStats);
      return res;
    } catch (err: any) {
      console.error(err);
      alert(`Incident analysis failed: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Commit resolution to Hindsight (Retain)
  const handleCommitResolve = async (payload: {
    incidentId: string;
    rootCause: string;
    successfulResolution: string;
    failedApproaches: string[];
    runbookUsed: string;
    developerFeedback: string;
    outcome: 'SUCCESS' | 'FAILED' | 'PARTIAL';
    mttrMinutes?: number;
  }) => {
    try {
      const res = await api.resolveIncident(payload);
      setIncidents((prev) =>
        prev.map((i) => (i.id === res.incident.id ? res.incident : i))
      );
      setSelectedIncident(res.incident);
      setLastRetainedMemory(res.retainedMemory);

      showToast(
        'Experience retained in Hindsight Persistent Memory',
        `Incident ${res.incident.id} root cause, validated resolution, and failure signatures committed. Memory bank updated.`
      );

      const [updatedMemories, updatedStats] = await Promise.all([
        api.getMemories(),
        api.getStats(),
      ]);
      setMemories(updatedMemories);
      setStats(updatedStats);

      return res;
    } catch (err: any) {
      console.error(err);
      alert(`Failed to commit resolution: ${err.message}`);
    }
  };

  // Reset demo state (Cold vs Warm)
  const handleResetDemo = async (mode: 'cold_demo' | 'warm_production') => {
    setIsResetting(true);
    try {
      const res = await api.resetDemoMode(mode);
      await loadData();
      showToast(
        mode === 'cold_demo' ? '❄️ Reset to Cold Memory Mode' : '🔥 Reset to Warm Memory Mode',
        res.message
      );
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsResetting(false);
    }
  };

  // Step trigger for the 2-minute Judge Demo Flow (6 Steps)
  const handleSelectJudgeStep = async (step: number) => {
    setCurrentJudgeStep(step);

    if (step === 1) {
      // Step 1: Cold start incident (0 memory)
      await handleResetDemo('cold_demo');
      setDemoPreset('cold_db');
      setActiveTab('new-incident');
      showToast(
        'Judge Step 1: Cold Start (Incident #1)',
        'Database timeout pre-filled. TraceMind has 0 prior connection pool memories. Notice first-principles analysis with MTTR: 38m.'
      );
    } else if (step === 2) {
      // Step 2: Show Hindsight Ingestion (Retain)
      if (selectedIncident && !lastRetainedMemory) {
        // Create live retained memory representation for modal
        setLastRetainedMemory({
          id: `mem-retain-demo`,
          bankId: 'tracemind-sre-prod',
          type: 'experience',
          incidentId: selectedIncident.id,
          timestamp: new Date().toISOString(),
          service: selectedIncident.service,
          content: `Incident [${selectedIncident.id}] in ${selectedIncident.service}: Database Connection Pool Exhaustion. Root Cause: HikariCP maxPoolSize was set to default 10 connections. Successful Resolution: Increased HikariCP maximumPoolSize to 50 & connectionTimeout to 3000ms. Failed Attempts: Restarting replica pods. MTTR: 38.0 mins.`,
          context: 'Surge in checkout requests caused connection queue buildup.',
          entities: [selectedIncident.service, 'PostgreSQL', 'HikariCP', 'ConnectionPool'],
          tags: [`service:${selectedIncident.service}`, 'database', 'postgres', 'pool-exhaustion', 'hikaricp'],
          rootCause: 'HikariCP maxPoolSize was set to default 10 connections while worker threads spiked to 120.',
          successfulResolution: 'Increased HikariCP maximumPoolSize to 50 and set connectionTimeout to 3000ms.',
          failedApproaches: ['Restarting replica pods (exhausted immediately again)'],
          runbookUsed: 'RUNBOOK-DB-09: Connection Pool Sizing & Hikari Tuning',
          feedback: 'Increasing pool size solved the bottleneck in 90 seconds. Documented for future services.',
          outcome: 'SUCCESS',
          mttrMinutes: 38,
          isDemoSeed: false,
        });
      }
      setIsRetainVisualizerOpen(true);
      showToast(
        'Judge Step 2: Hindsight Ingestion (Retain)',
        'Retain pipeline is actively committing the verified root cause, blacklisted failed attempt, and 38m MTTR.'
      );
    } else if (step === 3) {
      // Step 3: Warm Incident with 94% recall
      await handleResetDemo('warm_production');
      setDemoPreset('warm_db');
      setActiveTab('new-incident');
      showToast(
        'Judge Step 3: Warm Incident (Recall Ready)',
        'OrderService pool timeout pre-filled. When analyzed, TraceMind immediately matches PaymentService precedent in Hindsight!'
      );
    } else if (step === 4) {
      // Step 4: Reflect Synthesis
      setActiveTab('analysis');
      showToast(
        'Judge Step 4: Hindsight Reflect Synthesis',
        'Observe how the AI reasons over recalled memory, explains why the fix applies, and warns against pod restarts.'
      );
    } else if (step === 5) {
      // Step 5: Cold vs Warm MTTR Evaluation
      setIsMttrModalOpen(true);
      showToast(
        'Judge Step 5: Cold vs Warm MTTR Evaluation',
        'Comparing Cold (38m) vs Warm (3.2m): Net 34.8 minutes saved (-92% MTTR reduction).'
      );
    } else if (step === 6) {
      // Step 6: Memory Timeline & Knowledge Compounding
      setActiveTab('timeline');
      showToast(
        'Judge Step 6: Memory Growth Timeline',
        'See how TraceMind compounds intelligence from Incident #1 to Incident #20.'
      );
    }
  };

  // Scripted Auto-Play 2-minute demo execution
  const handleAutoPlayDemo = async () => {
    if (isAutoPlayingDemo) return;
    setIsAutoPlayingDemo(true);

    try {
      // Step 1: Cold start
      await handleSelectJudgeStep(1);
      await new Promise((r) => setTimeout(r, 1200));

      // Auto-analyze Cold Incident
      const coldRes = await handleAnalyzeIncident({
        title: 'Database Connection Pool Exhaustion on Checkout Flow',
        service: 'PaymentService',
        severity: 'CRITICAL',
        errorMessage: 'HikariPool-1 - Connection is not available, request timed out after 30002ms.',
        logs: `2026-09-28 09:14:58 ERROR [PaymentController] - Failed to acquire connection from pool
java.sql.SQLTransientConnectionException: HikariPool-1 - Connection is not available, request timed out after 30002ms.
2026-09-28 09:15:01 WARN [HikariPool-1] - Pool stats: total=10, active=10, idle=0, waiting=124`,
        symptoms: ['504 Gateway Timeouts', 'pool starvation', '124 blocked threads'],
      });

      // Step 2: Ingest into Hindsight
      setCurrentJudgeStep(2);
      await new Promise((r) => setTimeout(r, 2000));
      if (coldRes?.incident) {
        const retainRes = await handleCommitResolve({
          incidentId: coldRes.incident.id,
          rootCause: 'HikariCP maxPoolSize was set to default 10 connections while threads spiked to 120.',
          successfulResolution: 'Increased HikariCP maximumPoolSize to 50 and set connectionTimeout to 3000ms.',
          failedApproaches: ['Restarting replica pods (exhausted immediately again)'],
          runbookUsed: 'RUNBOOK-DB-09: Connection Pool Sizing & Hikari Tuning',
          developerFeedback: 'Increasing pool size solved the bottleneck in 90 seconds. Documented for future services.',
          outcome: 'SUCCESS',
          mttrMinutes: 38,
        });
        if (retainRes?.retainedMemory) {
          setLastRetainedMemory(retainRes.retainedMemory);
          setIsRetainVisualizerOpen(true);
        }
      }

      // Step 3: Warm Recall
      await new Promise((r) => setTimeout(r, 2400));
      setIsRetainVisualizerOpen(false);
      setCurrentJudgeStep(3);
      await handleAnalyzeIncident({
        title: 'OrderService 504 Gateway Timeout during Checkout Surge',
        service: 'OrderService',
        severity: 'CRITICAL',
        errorMessage: 'HikariPool-1 - Connection is not available, request timed out after 30002ms.',
        logs: `2026-09-28 09:14:58 ERROR [OrderController] - Failed to acquire DB connection from pool
java.sql.SQLTransientConnectionException: HikariPool-1 - Connection is not available, request timed out after 30002ms.
2026-09-28 09:15:01 WARN [HikariPool-1] - Pool stats: total=10, active=10, idle=0, waiting=142`,
        symptoms: ['504 Gateway Timeouts', '142 blocked worker threads', '30s latency spike on checkout API'],
      });

      // Step 4: Reflect
      setCurrentJudgeStep(4);
      await new Promise((r) => setTimeout(r, 2000));

      // Step 5: Evaluation
      setCurrentJudgeStep(5);
      setIsMttrModalOpen(true);
      await new Promise((r) => setTimeout(r, 2500));
      setIsMttrModalOpen(false);

      // Step 6: Memory Timeline
      setCurrentJudgeStep(6);
      setActiveTab('timeline');
      showToast(
        '🎉 2-Minute Demo Complete!',
        'Notice how TraceMind eliminated 34.8 minutes of downtime using Hindsight Persistent Memory.'
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsAutoPlayingDemo(false);
    }
  };

  const handleStartDemoInteraction = async (step: 1 | 2) => {
    if (step === 1) {
      await handleSelectJudgeStep(1);
    } else {
      await handleSelectJudgeStep(3);
    }
  };

  const handleOpenResolveModal = (outcome: 'SUCCESS' | 'FAILED' | 'PARTIAL') => {
    setResolveOutcome(outcome);
    setIsResolveModalOpen(true);
  };

  const handleSignOut = () => {
    authService.clearSession();
    setCurrentUser(null);
    showToast(
      'Session Terminated',
      'Signed out of TraceMind cluster. Hindsight memory bank state remains intact.',
      'info'
    );
  };

  // If unauthenticated, display the 3D Enterprise LoginPage
  if (!currentUser) {
    return (
      <LoginPage
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          showToast(
            'Authenticated to TraceMind Cluster',
            `Signed in as ${user.name} (${user.role}). Hindsight persistent memory layer connected.`
          );
        }}
      />
    );
  }

  return (
    <div className="flex h-screen bg-[#07090e] text-slate-100 font-sans overflow-hidden bg-grid-pattern flex-col">
      {/* 2-Minute Judge Demo Controller Bar (All 6 Steps) */}
      <JudgeDemoBanner
        currentStep={currentJudgeStep}
        onSelectStep={handleSelectJudgeStep}
        onOpenMttrModal={() => setIsMttrModalOpen(true)}
        onAutoPlay={handleAutoPlayDemo}
        isAutoPlaying={isAutoPlayingDemo}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-16 right-5 z-50 flex items-start gap-3 p-4 rounded-xl bg-slate-900/95 border border-cyan-500/50 shadow-2xl backdrop-blur-md max-w-md animate-in fade-in slide-in-from-top-4 duration-300">
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 flex-1">
              <h4 className="font-bold text-white text-xs tracking-tight">
                {toastMessage.title}
              </h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {toastMessage.description}
              </p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          stats={stats}
          hasActiveIncident={Boolean(selectedIncident && selectedIncident.status !== 'RESOLVED')}
          onResetDemo={handleResetDemo}
          currentUser={currentUser}
          onSignOut={handleSignOut}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              incidents={incidents}
              stats={stats}
              onNavigate={setActiveTab}
              onSelectIncident={(inc) => {
                setSelectedIncident(inc);
                setActiveTab('analysis');
              }}
              onStartDemoInteraction={handleStartDemoInteraction}
              onOpenMttrModal={() => setIsMttrModalOpen(true)}
            />
          )}

          {activeTab === 'new-incident' && (
            <NewIncidentView
              onAnalyze={handleAnalyzeIncident}
              isLoading={isAnalyzing}
              initialPreset={demoPreset}
            />
          )}

          {activeTab === 'analysis' && (
            <IncidentAnalysisView
              incident={selectedIncident}
              onOpenResolveModal={handleOpenResolveModal}
              onNavigateNew={() => setActiveTab('new-incident')}
              onOpenMttrModal={() => setIsMttrModalOpen(true)}
            />
          )}

          {activeTab === 'timeline' && (
            <MemoryTimelineView memories={memories} />
          )}

          {activeTab === 'history' && (
            <IncidentHistoryView
              incidents={incidents}
              onSelectIncident={(inc) => {
                setSelectedIncident(inc);
                setActiveTab('analysis');
              }}
            />
          )}

          {activeTab === 'memory' && (
            <MemoryBankView memories={memories} stats={stats} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView stats={stats} incidents={incidents} />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              stats={stats}
              onResetDemo={handleResetDemo}
              isResetting={isResetting}
            />
          )}
        </main>
      </div>

      {/* Resolve Incident Outcome Drawer / Modal */}
      {selectedIncident && (
        <ResolveModal
          isOpen={isResolveModalOpen}
          incident={selectedIncident}
          initialOutcome={resolveOutcome}
          onClose={() => setIsResolveModalOpen(false)}
          onCommitResolve={handleCommitResolve}
        />
      )}

      {/* Cold vs Warm MTTR Benchmark Modal */}
      <ColdVsWarmModal
        isOpen={isMttrModalOpen}
        onClose={() => setIsMttrModalOpen(false)}
        onTriggerColdDemo={() => handleSelectJudgeStep(1)}
        onTriggerWarmDemo={() => handleSelectJudgeStep(3)}
      />

      {/* Retain Ingestion Visualizer Modal */}
      <RetainVisualizerModal
        isOpen={isRetainVisualizerOpen}
        onClose={() => setIsRetainVisualizerOpen(false)}
        memoryUnit={lastRetainedMemory}
        onProceedToWarmDemo={() => handleSelectJudgeStep(3)}
      />
    </div>
  );
}
