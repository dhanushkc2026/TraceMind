export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IncidentStatus = 'INVESTIGATING' | 'ANALYZED' | 'RESOLVED' | 'FAILED';
export type IncidentOutcome = 'SUCCESS' | 'FAILED' | 'PARTIAL';

export interface HistoricalEvidence {
  incidentId: string;
  service: string;
  timestamp: string;
  similarity: number; // 0 - 100%
  previousRootCause: string;
  previousSuccessfulFix: string;
  failedAttempts: string[];
  runbookUsed?: string;
  developerFeedback?: string;
  relevanceExplanation: string;
  mttrMinutes?: number;
}

export interface HindsightReflectData {
  reflectionSummary: string;
  whyProven: string;
  whyAvoidFailedAttempts: string;
  policyInsight?: string;
}

export interface IncidentAnalysisResult {
  diagnosis: string;
  likelyRootCause: string;
  recommendedAction: string;
  alternativeActions: string[];
  confidence: number; // 0 - 100
  reasoning: string;
  historicalEvidence: HistoricalEvidence[];
  memoryRecallCount: number;
  memoryUsed: boolean;
  hindsightMode: 'COLD_START_NO_MEMORY' | 'WARM_HINDSIGHT_RECALL' | 'RECURRING_PATTERN_SYNTHESIZED';
  suggestedRunbook?: string;
  reflectData?: HindsightReflectData;
  estimatedMttrMinutes: number;
  timeSavedMinutes?: number;
}

export interface Incident {
  id: string;
  title: string;
  timestamp: string;
  service: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  errorMessage: string;
  logs: string;
  symptoms: string[];
  rootCause?: string;
  resolutionAttempted?: string;
  successfulResolution?: string;
  failedApproaches?: string[];
  runbookUsed?: string;
  developerFeedback?: string;
  finalOutcome?: IncidentOutcome;
  resolvedAt?: string;
  analysis?: IncidentAnalysisResult;
  hindsightMemoryId?: string;
  mttrMinutes?: number;
  investigationTimeMinutes?: number;
  isDemoSeed?: boolean;
}

export interface HindsightMemoryUnit {
  id: string;
  bankId: string;
  type: 'experience' | 'world' | 'opinion' | 'observation';
  incidentId: string;
  timestamp: string;
  service: string;
  content: string;
  context: string;
  entities: string[];
  tags: string[];
  rootCause: string;
  successfulResolution: string;
  failedApproaches: string[];
  runbookUsed?: string;
  feedback?: string;
  outcome: IncidentOutcome;
  similarityScore?: number;
  mttrMinutes?: number;
  isDemoSeed?: boolean;
}

export interface HindsightStats {
  totalMemories: number;
  experiencesCount: number;
  observationsCount: number;
  servicesTracked: string[];
  avgRecallRelevance: number;
  learningIterations: number;
  recurringPatternsIdentified: number;
  hindsightClientStatus: 'CONNECTED' | 'EMBEDDED_ACTIVE';
  bankId: string;
  operationsCount: {
    retainCount: number;
    recallCount: number;
    reflectCount: number;
  };
}
