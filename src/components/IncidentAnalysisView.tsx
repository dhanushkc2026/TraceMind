import React, { useState } from 'react';
import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Terminal,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Tag,
  BookOpen,
  History,
  Layers,
  ShieldCheck,
  Percent,
  Clock,
  TrendingDown,
  Zap,
  Network,
  Share2,
  ArrowRight,
  ShieldAlert,
  Radio,
} from 'lucide-react';
import { Incident } from '../types';

interface IncidentAnalysisViewProps {
  incident: Incident | null;
  onOpenResolveModal: (outcome: 'SUCCESS' | 'FAILED' | 'PARTIAL') => void;
  onNavigateNew: () => void;
  onOpenMttrModal?: () => void;
}

export const IncidentAnalysisView: React.FC<IncidentAnalysisViewProps> = ({
  incident,
  onOpenResolveModal,
  onNavigateNew,
  onOpenMttrModal,
}) => {
  const [showFullLogs, setShowFullLogs] = useState(false);
  const [activeEvidenceTab, setActiveEvidenceTab] = useState(0);

  if (!incident) {
    return (
      <div className="p-12 text-center max-w-lg mx-auto space-y-4 my-20">
        <div className="w-16 h-16 rounded-2xl bg-[#0e141f] border border-white/[0.08] flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
          <Brain className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-white font-sans">No Incident Selected</h2>
        <p className="text-slate-400 text-xs">
          Select an incident from the Command Dashboard, or trigger autonomous analysis for a new production incident.
        </p>
        <button
          onClick={onNavigateNew}
          className="btn-3d-emerald px-5 py-2.5 rounded-xl text-white font-semibold text-xs transition-all cursor-pointer"
        >
          Analyze New Incident
        </button>
      </div>
    );
  }

  const analysis = incident.analysis;
  const isResolved = incident.status === 'RESOLVED';
  const hasMemories = (analysis?.historicalEvidence && analysis.historicalEvidence.length > 0) || false;
  const isColdStart = analysis?.hindsightMode === 'COLD_START_NO_MEMORY';

  return (
    <div className="p-8 space-y-7 max-w-7xl mx-auto">
      {/* Top Banner / Status Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 uppercase">
              {incident.id}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                incident.severity === 'CRITICAL'
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-800/70'
                  : 'bg-amber-950/80 text-amber-300 border border-amber-800/70'
              }`}
            >
              {incident.severity}
            </span>
            <span className="text-slate-400 text-xs">
              Service: <strong className="text-slate-200">{incident.service}</strong>
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white mt-1.5 font-sans">
            {incident.title}
          </h1>

          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
            <span>Detected: {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span>·</span>
            <span className="flex items-center gap-1.5 font-mono">
              <span
                className={`w-2 h-2 rounded-full ${
                  isResolved ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-amber-400 animate-pulse'
                }`}
              />
              <span className={isResolved ? 'text-emerald-400 font-bold' : 'text-amber-300'}>{incident.status}</span>
            </span>
            <span>·</span>
            <span className="text-amber-300 font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>
                MTTR:{' '}
                <strong className="text-white">
                  {incident.mttrMinutes !== undefined
                    ? `${incident.mttrMinutes}m`
                    : analysis?.estimatedMttrMinutes
                    ? `${analysis.estimatedMttrMinutes}m`
                    : '38m'}
                </strong>
              </span>
            </span>
          </div>
        </div>

        {/* Resolution Outcome Banner or Action Buttons */}
        <div>
          {isResolved ? (
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <div className="w-8 h-8 rounded-lg bg-emerald-900/60 border border-emerald-500/50 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="font-bold text-white font-sans">Incident Resolved & Experience Committed to Hindsight</div>
                <div className="text-[11px] text-emerald-300 font-mono mt-0.5">
                  Resolution: {incident.successfulResolution || incident.resolutionAttempted}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onOpenResolveModal('SUCCESS')}
                className="btn-3d-emerald px-4 py-2.5 rounded-xl text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-[0_4px_14px_rgba(16,185,129,0.3)]"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-100" />
                <span>Confirm Resolution</span>
              </button>
              <button
                onClick={() => onOpenResolveModal('FAILED')}
                className="btn-3d-graphite px-3.5 py-2.5 rounded-xl text-rose-300 font-semibold text-xs border border-rose-800/40 flex items-center gap-1.5 cursor-pointer hover:border-rose-600"
              >
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>Mark Failed</span>
              </button>
              <button
                onClick={() => onOpenResolveModal('PARTIAL')}
                className="btn-3d-graphite px-3.5 py-2.5 rounded-xl text-slate-300 font-medium text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-slate-400" />
                <span>Try Another</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Retain → Recall → Reflect Flow Navigation Indicator */}
      <div className="p-3.5 rounded-xl glass-command flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
            HINDSIGHT AGENT FLOW:
          </span>

          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                isColdStart
                  ? 'bg-amber-950/70 text-amber-300 border border-amber-600/60 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                  : 'bg-emerald-950/70 text-emerald-300 border border-emerald-600/60 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
              }`}
            >
              1. RECALL ({hasMemories ? `${analysis?.historicalEvidence[0]?.similarity}% MATCH` : '0 MEMORY'})
            </span>
            <span className="text-slate-600">→</span>
            <span
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                hasMemories
                  ? 'bg-amber-950/70 text-amber-300 border border-amber-500/60 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                  : 'bg-[#0f141f] text-slate-500 border border-white/[0.06]'
              }`}
            >
              2. REFLECT (SYNTHESIS)
            </span>
            <span className="text-slate-600">→</span>
            <span
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                isResolved
                  ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/60 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  : 'bg-[#0f141f] text-slate-400 border border-white/[0.08]'
              }`}
            >
              3. RETAIN {isResolved ? '✓ COMMITTED' : '(ON CONFIRM)'}
            </span>
          </div>
        </div>

        {onOpenMttrModal && (
          <button
            onClick={onOpenMttrModal}
            className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 text-xs font-semibold cursor-pointer transition-colors"
          >
            <TrendingDown className="w-4 h-4 text-amber-400" />
            <span>
              {isColdStart ? 'Cold MTTR: 38m (Compare with Warm)' : 'Warm MTTR: 3.2m (-92% Speedup!)'}
            </span>
          </button>
        )}
      </div>

      {/* ============================================================ */}
      {/* 3-COLUMN LAYOUT: CURRENT INCIDENT | HINDSIGHT MEMORY | AI RECOMMENDATION */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start relative">
        {/* Memory Recall animated connecting beam SVG overlay for desktop when warm */}
        {hasMemories && (
          <div className="hidden lg:block absolute inset-x-0 -top-4 h-4 pointer-events-none z-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="warmConnectionBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#10b981" stopOpacity="1" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <line
                x1="18%"
                y1="8"
                x2="50%"
                y2="8"
                stroke="url(#warmConnectionBeam)"
                strokeWidth="2"
                strokeDasharray="6 4"
                className="animate-beam-flow"
              />
              <line
                x1="50%"
                y1="8"
                x2="82%"
                y2="8"
                stroke="url(#warmConnectionBeam)"
                strokeWidth="2"
                strokeDasharray="6 4"
                className="animate-beam-flow"
              />
            </svg>
          </div>
        )}

        {/* ============================================================ */}
        {/* COLUMN 1: CURRENT INCIDENT */}
        {/* ============================================================ */}
        <div className="glass-command rounded-2xl p-5 space-y-4 hover:translate-y-[-2px] transition-transform duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h2 className="font-extrabold text-white text-xs tracking-wider uppercase font-mono">
                CURRENT INCIDENT
              </h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-slate-300 border border-white/[0.08]">
              TELEMETRY
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <span className="text-slate-400 text-[11px] font-mono block">Service Affected</span>
              <div className="font-mono font-bold text-amber-300 text-sm mt-0.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                <span>{incident.service}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 text-[11px] font-mono block">Error Signature</span>
              <div className="font-mono text-rose-300 bg-[#07090e] p-2.5 rounded-xl border border-rose-900/40 break-words mt-1 shadow-inner text-[11px]">
                {incident.errorMessage}
              </div>
            </div>

            {/* Observed Symptoms */}
            <div>
              <span className="text-slate-400 text-[11px] font-mono block mb-1">Observed Symptoms</span>
              <div className="flex flex-wrap gap-1.5">
                {incident.symptoms.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.04] text-slate-300 border border-white/[0.08]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Production Logs Terminal */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px] flex items-center gap-1.5 font-mono">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Production Logs</span>
                </span>
                <button
                  onClick={() => setShowFullLogs(!showFullLogs)}
                  className="text-[10px] text-amber-300 hover:text-amber-200 font-mono flex items-center gap-0.5 cursor-pointer"
                >
                  {showFullLogs ? (
                    <>
                      <span>Collapse</span>
                      <ChevronUp className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      <span>Expand</span>
                      <ChevronDown className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>

              <div
                className={`p-3 rounded-xl bg-[#06080d] border border-white/[0.08] text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre leading-relaxed shadow-inner ${
                  showFullLogs ? 'max-h-96' : 'max-h-44'
                }`}
              >
                {incident.logs || 'No raw logs attached.'}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* COLUMN 2: HINDSIGHT MEMORY (VISUAL HERO) */}
        {/* ============================================================ */}
        <div className={`rounded-2xl p-5 space-y-4 hover:translate-y-[-2px] transition-transform duration-200 ${
          hasMemories ? 'glass-command-gold' : 'glass-command'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Brain className={`w-4 h-4 ${hasMemories ? 'text-amber-400' : 'text-slate-400'}`} />
                {hasMemories && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                )}
              </div>
              <h2 className="font-extrabold text-white text-xs tracking-wider uppercase font-mono">
                HINDSIGHT MEMORY
              </h2>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
                hasMemories
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                  : 'bg-white/[0.05] text-slate-400 border border-white/[0.08]'
              }`}
            >
              {hasMemories
                ? `${analysis?.historicalEvidence.length} PRECEDENT${
                    analysis?.historicalEvidence.length === 1 ? '' : 'S'
                  } RECALLED`
                : 'RELEVANT MEMORIES: 0'}
            </span>
          </div>

          {hasMemories ? (
            <div className="space-y-4 text-xs">
              {/* Evidence tabs if multiple */}
              {analysis!.historicalEvidence.length > 1 && (
                <div className="flex gap-1.5 pb-1">
                  {analysis!.historicalEvidence.map((ev, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveEvidenceTab(idx)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all cursor-pointer ${
                        activeEvidenceTab === idx
                          ? 'btn-3d-gold text-white font-bold'
                          : 'bg-[#0e141f] text-slate-400 hover:text-slate-200 border border-white/[0.06]'
                      }`}
                    >
                      {ev.incidentId} ({ev.similarity}%)
                    </button>
                  ))}
                </div>
              )}

              {/* Selected Historical Incident Card */}
              {(() => {
                const ev =
                  analysis!.historicalEvidence[activeEvidenceTab] ||
                  analysis!.historicalEvidence[0];
                return (
                  <div className="space-y-3.5">
                    {/* Precedent Match Percentage Card (Gold Highlight when recalled) */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/50 via-[#0d1017] to-emerald-950/40 border border-amber-500/40 space-y-2 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-amber-200/90 font-mono font-semibold flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Precedent Match Percentage</span>
                        </span>
                        <span className="font-mono text-amber-300 font-extrabold text-sm shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                          {ev.similarity}% Match
                        </span>
                      </div>
                      <div className="w-full bg-[#0a0d14] h-2 rounded-full overflow-hidden border border-white/[0.06]">
                        <div
                          className="bg-gradient-to-r from-amber-500 via-emerald-400 to-emerald-500 h-full rounded-full transition-all duration-700"
                          style={{ width: `${ev.similarity}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-300 font-mono flex justify-between pt-0.5">
                        <span>
                          Previous Incident: <strong className="text-amber-300">{ev.incidentId}</strong> ({ev.service})
                        </span>
                        <span className="text-emerald-400 font-semibold">Baseline MTTR: {ev.mttrMinutes || 38}m</span>
                      </div>
                    </div>

                    {/* Previous Root Cause */}
                    <div>
                      <span className="text-slate-400 text-[11px] font-mono block">
                        Previous Root Cause
                      </span>
                      <div className="p-3 rounded-xl bg-[#070a10] text-slate-200 mt-1 border border-white/[0.08] leading-relaxed text-[11px] font-sans">
                        {ev.previousRootCause}
                      </div>
                    </div>

                    {/* Proven Fix (Green Highlight) */}
                    <div>
                      <span className="text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Proven Fix (Verified in Hindsight)</span>
                      </span>
                      <div className="p-3 rounded-xl bg-emerald-950/40 text-emerald-200 mt-1 border border-emerald-500/50 leading-relaxed font-mono text-[11px] shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                        {ev.previousSuccessfulFix}
                      </div>
                    </div>

                    {/* Failed Approach (Restrained Red) */}
                    {ev.failedAttempts && ev.failedAttempts.length > 0 && (
                      <div>
                        <span className="text-rose-400 text-[11px] font-mono font-bold flex items-center gap-1.5">
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          <span>Failed Approach to Avoid</span>
                        </span>
                        <ul className="mt-1 space-y-1.5">
                          {ev.failedAttempts.map((f, fIdx) => (
                            <li
                              key={fIdx}
                              className="text-[11px] text-rose-300 font-mono bg-rose-950/30 px-2.5 py-1.5 rounded-lg border border-rose-900/40 flex items-center gap-2"
                            >
                              <span className="text-rose-500 font-bold">✕</span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Reflect Synthesis Callout */}
                    {analysis?.reflectData && (
                      <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/30 to-emerald-950/30 border border-emerald-500/30 text-[11px] space-y-1.5 shadow-sm">
                        <span className="text-amber-300 font-bold font-mono flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Hindsight Reflect Synthesis:</span>
                        </span>
                        <p className="text-slate-300 leading-relaxed font-sans">
                          {analysis.reflectData.whyProven}
                        </p>
                        <p className="text-rose-300 font-mono text-[10px]">
                          ⚠️ {analysis.reflectData.whyAvoidFailedAttempts}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          ) : (
            /* True Cold Start State */
            <div className="p-5 rounded-xl bg-[#060a10] border border-amber-500/40 space-y-4 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-600/60 flex items-center justify-center shrink-0 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-300">
                      HINDSIGHT RECALL: NONE
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 text-[10px] font-mono border border-amber-600/50">
                      0 Relevant Memories
                    </span>
                  </div>
                  <div className="text-white font-bold text-sm mt-0.5 font-sans">
                    True Cold Start · Zero Historical Memories
                  </div>
                </div>
              </div>

              {/* Retrieval Details */}
              <div className="p-3.5 rounded-xl bg-[#090d14] border border-white/[0.06] font-mono text-[11px] space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>• Relevant Hindsight Memories:</span>
                  <span className="text-amber-300 font-bold">0 (None matched)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>• Hindsight Recall:</span>
                  <span className="text-slate-300 font-bold">none</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>• Analysis Mode:</span>
                  <span className="text-amber-300 font-bold">Fresh first-principles analysis</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>• Bank Searched:</span>
                  <span className="text-emerald-400">tracemind-sre-prod</span>
                </div>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed font-sans">
                TraceMind searched its persistent memory bank for historical precedents matching this failure and found <strong>zero relevant units</strong>. The agent is analyzing this outage from <strong>first principles</strong> using raw error telemetry and Gemini SRE heuristics without historical assistance.
              </p>

              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-600/40 text-[11px] text-amber-200 leading-relaxed font-mono">
                💡 <strong>Next Step (Retain):</strong> Confirm the resolution below to store this failure signature, root cause, and 38m MTTR into Hindsight. Future incidents will then recall this experience!
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* COLUMN 3: AI RECOMMENDATION (STRONGEST VISUAL CARD) */}
        {/* ============================================================ */}
        <div className="glass-command-hero rounded-2xl p-5 space-y-4 hover:translate-y-[-2px] transition-transform duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-500/30">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h2 className="font-extrabold text-white text-xs tracking-wider uppercase font-mono">
                AI RECOMMENDATION
              </h2>
            </div>
            <div
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                hasMemories
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'bg-amber-950 text-amber-300 border border-amber-600/60'
              }`}
            >
              <Percent className="w-3 h-3" />
              <span>
                {analysis?.confidence || (hasMemories ? 96 : 65)}% {hasMemories ? 'CONFIDENCE' : 'BASELINE'}
              </span>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Mode Tag */}
            <div>
              <span
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border inline-block ${
                  hasMemories
                    ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/60 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                    : 'bg-amber-950/70 text-amber-300 border-amber-600/60'
                }`}
              >
                {hasMemories
                  ? '⚡ Hindsight Grounded SRE Recommendation'
                  : '❄️ Fresh First-Principles SRE Analysis (Cold Start)'}
              </span>
            </div>

            {/* MTTR Impact Widget */}
            <div className="p-3.5 rounded-xl bg-[#060e10] border border-white/[0.08] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono block">ESTIMATED MTTR</span>
                <span
                  className={`font-mono text-sm font-extrabold ${
                    hasMemories ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {analysis?.estimatedMttrMinutes || (hasMemories ? 3.2 : 38)} Minutes
                </span>
              </div>
              {hasMemories ? (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/60 text-[10px] font-mono font-bold shadow-[0_0_10px_rgba(16,185,129,0.25)]">
                  -92% vs Cold (34.8m saved)
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-lg bg-amber-950 text-amber-300 border border-amber-600/50 text-[10px] font-mono font-bold">
                  Cold Baseline Triage
                </span>
              )}
            </div>

            {/* Diagnosed Root Cause */}
            <div>
              <span className="text-slate-400 text-[11px] font-mono block">Diagnosed Root Cause</span>
              <div className="p-3 rounded-xl bg-[#060b10] border border-white/[0.08] text-slate-200 mt-1 font-medium leading-relaxed font-sans text-xs">
                {analysis?.likelyRootCause || 'Investigating underlying resource contention.'}
              </div>
            </div>

            {/* Recommended Resolution */}
            <div>
              <span className="text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Recommended Resolution</span>
              </span>
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/50 text-emerald-100 font-mono text-[11px] mt-1 leading-relaxed shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                {analysis?.recommendedAction || 'Increase thread pool limits and review metrics.'}
              </div>
            </div>

            {/* Evidence-Based Reasoning (Hindsight) */}
            <div>
              <span className="text-slate-400 text-[11px] font-mono block">
                {hasMemories ? 'Evidence-Based Reasoning (Hindsight)' : 'First-Principles Reasoning'}
              </span>
              <div className="p-3 rounded-xl bg-[#060a10] border border-white/[0.08] text-slate-300 mt-1 leading-relaxed text-[11px] font-sans">
                {analysis?.reasoning || 'Reasoning generated from incident telemetry.'}
              </div>
            </div>

            {/* Suggested Runbook */}
            {analysis?.suggestedRunbook && (
              <div className="p-3 rounded-xl bg-[#060a10] border border-white/[0.08] flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2 text-slate-300">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span className="font-mono">{analysis.suggestedRunbook}</span>
                </div>
                <span className="text-[10px] text-amber-300 font-mono font-semibold">Standard Runbook</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RESOLUTION ACTION BAR (Commit to Hindsight) */}
      {!isResolved && (
        <div className="p-6 rounded-2xl glass-command-gold flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm flex items-center gap-2 font-sans">
              <Brain className="w-4 h-4 text-amber-400" />
              <span>Step 3: Commit Resolution to Hindsight Memory (Retain)</span>
            </h4>
            <p className="text-slate-300 text-xs">
              Confirming this verified fix stores the failure signature, root cause, and MTTR into Hindsight persistent memory so future outages recover in 3.2m.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onOpenResolveModal('SUCCESS')}
              className="btn-3d-emerald px-4 py-2.5 rounded-xl text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-[0_4px_15px_rgba(16,185,129,0.35)]"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-100" />
              <span>Confirm Resolution</span>
            </button>
            <button
              onClick={() => onOpenResolveModal('FAILED')}
              className="btn-3d-graphite px-3.5 py-2.5 rounded-xl text-rose-300 font-semibold text-xs border border-rose-800/40 flex items-center gap-1.5 cursor-pointer hover:border-rose-600"
            >
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>Mark Failed</span>
            </button>
            <button
              onClick={() => onOpenResolveModal('PARTIAL')}
              className="btn-3d-graphite px-3.5 py-2.5 rounded-xl text-slate-300 font-medium text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
              <span>Try Another</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
