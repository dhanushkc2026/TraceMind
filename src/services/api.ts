import { Incident, IncidentAnalysisResult, HindsightMemoryUnit, HindsightStats } from '../types';

export const api = {
  // Get all incidents
  async getIncidents(): Promise<Incident[]> {
    const res = await fetch('/api/incidents');
    if (!res.ok) throw new Error('Failed to fetch incidents');
    return res.json();
  },

  // Get incident by ID
  async getIncident(id: string): Promise<Incident> {
    const res = await fetch(`/api/incidents/${id}`);
    if (!res.ok) throw new Error('Failed to fetch incident');
    return res.json();
  },

  // Analyze new incident
  async analyzeIncident(payload: {
    title: string;
    service: string;
    severity: string;
    errorMessage: string;
    logs: string;
    symptoms: string[];
  }): Promise<{
    incident: Incident;
    analysis: IncidentAnalysisResult;
    recalledMemories: HindsightMemoryUnit[];
    hindsightMatchScore: number;
  }> {
    const res = await fetch('/api/incidents/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to analyze incident');
    }
    return res.json();
  },

  // Resolve incident and retain outcome in Hindsight
  async resolveIncident(payload: {
    incidentId: string;
    rootCause: string;
    successfulResolution?: string;
    failedApproaches?: string[];
    runbookUsed?: string;
    developerFeedback?: string;
    outcome?: 'SUCCESS' | 'FAILED' | 'PARTIAL';
    mttrMinutes?: number;
  }): Promise<{
    success: boolean;
    incident: Incident;
    retainedMemory: HindsightMemoryUnit;
    message: string;
  }> {
    const res = await fetch('/api/incidents/resolve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to resolve incident');
    }
    return res.json();
  },

  // Perform manual reflect test
  async testReflect(payload: {
    service: string;
    errorMessage: string;
    recalledMemories?: HindsightMemoryUnit[];
  }): Promise<any> {
    const res = await fetch('/api/hindsight/reflect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to run reflection');
    return res.json();
  },

  // Get Hindsight memories
  async getMemories(): Promise<HindsightMemoryUnit[]> {
    const res = await fetch('/api/hindsight/memories');
    if (!res.ok) throw new Error('Failed to fetch memories');
    return res.json();
  },

  // Get Hindsight stats
  async getStats(): Promise<HindsightStats> {
    const res = await fetch('/api/hindsight/stats');
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  // Perform manual recall test
  async testRecall(payload: {
    service: string;
    query: string;
    logs?: string;
    symptoms?: string[];
  }): Promise<{ results: HindsightMemoryUnit[]; maxSimilarity: number }> {
    const res = await fetch('/api/hindsight/recall', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to test recall');
    return res.json();
  },

  // Reset demo mode
  async resetDemoMode(mode: 'cold_demo' | 'warm_production'): Promise<{
    success: boolean;
    mode: string;
    message: string;
    stats: HindsightStats;
  }> {
    const res = await fetch('/api/demo/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode }),
    });
    if (!res.ok) throw new Error('Failed to reset demo mode');
    return res.json();
  },

  // Health check
  async getHealth(): Promise<any> {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Failed to fetch health');
    return res.json();
  },
};
