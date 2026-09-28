import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  X,
  Plus,
  Trash2,
  Loader2,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  Brain,
} from 'lucide-react';
import { Incident } from '../types';

interface ResolveModalProps {
  isOpen: boolean;
  incident: Incident;
  initialOutcome: 'SUCCESS' | 'FAILED' | 'PARTIAL';
  onClose: () => void;
  onCommitResolve: (payload: {
    incidentId: string;
    rootCause: string;
    successfulResolution: string;
    failedApproaches: string[];
    runbookUsed: string;
    developerFeedback: string;
    outcome: 'SUCCESS' | 'FAILED' | 'PARTIAL';
    mttrMinutes?: number;
  }) => Promise<any>;
}

export const ResolveModal: React.FC<ResolveModalProps> = ({
  isOpen,
  incident,
  initialOutcome,
  onClose,
  onCommitResolve,
}) => {
  if (!isOpen) return null;

  const [outcome, setOutcome] = useState<'SUCCESS' | 'FAILED' | 'PARTIAL'>(initialOutcome);
  const [rootCause, setRootCause] = useState(
    incident.analysis?.likelyRootCause ||
      incident.rootCause ||
      'HikariCP database connection pool exhaustion.'
  );
  const [validatedResolution, setValidatedResolution] = useState(
    incident.analysis?.recommendedAction ||
      incident.successfulResolution ||
      'Increased HikariCP maximumPoolSize to 50 and set connectionTimeout to 3000ms.'
  );
  const [failedApproaches, setFailedApproaches] = useState<string[]>([
    'Restarting replica pods (queue immediately re-exhausted)',
  ]);
  const [newFailedInput, setNewFailedInput] = useState('');
  const [runbookUsed, setRunbookUsed] = useState(
    incident.analysis?.suggestedRunbook || 'RUNBOOK-DB-09: Connection Pool Sizing & Hikari Tuning'
  );
  const [developerFeedback, setDeveloperFeedback] = useState(
    'Resolved connection starvation in 90 seconds without dropping user sessions.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddFailedApproach = () => {
    if (!newFailedInput.trim()) return;
    setFailedApproaches([...failedApproaches, newFailedInput.trim()]);
    setNewFailedInput('');
  };

  const handleRemoveFailed = (idx: number) => {
    setFailedApproaches(failedApproaches.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onCommitResolve({
        incidentId: incident.id,
        rootCause,
        successfulResolution: validatedResolution,
        failedApproaches,
        runbookUsed,
        developerFeedback,
        outcome,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      {/* 3D Glass Confirmation Modal with Realistic Depth & Ambient Occlusion */}
      <div className="relative bg-gradient-to-b from-[#131b26]/95 via-[#0b1018]/98 to-[#070b10] border border-white/[0.12] rounded-2xl w-full max-w-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(16,185,129,0.15)] ring-1 ring-white/[0.08]">
        {/* Subtle top specular highlight line */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

        {/* Ambient volumetric glow in header corner */}
        <div className="absolute top-0 right-0 w-64 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600/30 to-emerald-950/80 border border-emerald-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.25)]">
              <Brain className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  HINDSIGHT INGESTION
                </span>
                <span className="text-slate-400 text-xs font-mono">
                  {incident.id} · {incident.service}
                </span>
              </div>
              <h3 className="font-extrabold text-white text-base tracking-tight font-sans mt-0.5">
                Confirm Incident Resolution
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/[0.06] cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs relative z-10">
          {/* Resolution Result Selector - CONFIRMED FIX */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 font-mono text-[11px] uppercase tracking-wider">
              Resolution Status
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setOutcome('SUCCESS')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  outcome === 'SUCCESS'
                    ? 'btn-3d-emerald text-white'
                    : 'bg-[#0f141e] text-slate-400 border-white/[0.08] hover:text-slate-200 hover:bg-[#151c2a]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>CONFIRMED FIX</span>
              </button>

              <button
                type="button"
                onClick={() => setOutcome('FAILED')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  outcome === 'FAILED'
                    ? 'bg-gradient-to-b from-rose-900 to-rose-950 text-rose-200 border-rose-600/80 shadow-[0_4px_12px_rgba(225,29,72,0.35)]'
                    : 'bg-[#0f141e] text-slate-400 border-white/[0.08] hover:text-slate-200 hover:bg-[#151c2a]'
                }`}
              >
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>Failed Attempt</span>
              </button>

              <button
                type="button"
                onClick={() => setOutcome('PARTIAL')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  outcome === 'PARTIAL'
                    ? 'bg-gradient-to-b from-amber-900 to-amber-950 text-amber-200 border-amber-600/80 shadow-[0_4px_12px_rgba(217,119,6,0.35)]'
                    : 'bg-[#0f141e] text-slate-400 border-white/[0.08] hover:text-slate-200 hover:bg-[#151c2a]'
                }`}
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>Partial Fix</span>
              </button>
            </div>
          </div>

          {/* Verified Root Cause */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300 font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <span>Verified Root Cause</span>
            </label>
            <textarea
              rows={2}
              required
              value={rootCause}
              onChange={(e) => setRootCause(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#090d14] border border-white/[0.1] text-slate-200 focus:outline-none focus:border-amber-400/60 font-sans shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] transition-colors"
            />
          </div>

          {/* Validated Resolution */}
          <div className="space-y-1">
            <label className="font-semibold text-emerald-400 font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Validated Resolution</span>
            </label>
            <textarea
              rows={2}
              required
              value={validatedResolution}
              onChange={(e) => setValidatedResolution(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#07130e] border border-emerald-500/40 text-emerald-200 font-mono text-[11px] focus:outline-none focus:border-emerald-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] transition-colors"
            />
          </div>

          {/* Failed Approach to Avoid */}
          <div className="space-y-1.5">
            <label className="font-semibold text-rose-300 font-mono text-[11px] uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Failed Approach to Avoid</span>
              </span>
              <span className="text-[10px] text-slate-500 font-normal lowercase font-sans">
                (Blacklisted in Hindsight to prevent repeated mistakes)
              </span>
            </label>

            <div className="space-y-2">
              {failedApproaches.map((approach, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-rose-950/20 border border-rose-900/40 text-rose-200 font-mono text-[11px] shadow-sm"
                >
                  <span className="line-clamp-1">{approach}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFailed(idx)}
                    className="text-rose-400 hover:text-rose-200 ml-2 transition-colors cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFailedInput}
                  onChange={(e) => setNewFailedInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFailedApproach();
                    }
                  }}
                  placeholder="e.g. Restarting pod without increasing pool limits"
                  className="flex-1 px-3 py-2 rounded-xl bg-[#090d14] border border-white/[0.1] text-slate-300 text-xs font-mono focus:outline-none focus:border-amber-400/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
                />
                <button
                  type="button"
                  onClick={handleAddFailedApproach}
                  className="btn-3d-graphite px-3 py-2 rounded-xl text-slate-200 flex items-center gap-1 font-mono text-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-300" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Runbook Used & Developer / Post-Mortem Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Runbook Used</span>
              </label>
              <input
                type="text"
                value={runbookUsed}
                onChange={(e) => setRunbookUsed(e.target.value)}
                placeholder="e.g. RUNBOOK-DB-09: Connection Pool Sizing"
                className="w-full px-3 py-2 rounded-xl bg-[#090d14] border border-white/[0.1] text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-400/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300 font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Developer / Post-Mortem Note</span>
              </label>
              <input
                type="text"
                value={developerFeedback}
                onChange={(e) => setDeveloperFeedback(e.target.value)}
                placeholder="e.g. Resolved queue build-up in 90s without user session drops"
                className="w-full px-3 py-2 rounded-xl bg-[#090d14] border border-white/[0.1] text-slate-200 text-xs focus:outline-none focus:border-emerald-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
              />
            </div>
          </div>

          {/* Footer Submit with Primary CTA: COMMIT EXPERIENCE TO HINDSIGHT */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Future warm incidents will recall this precedent.</span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="btn-3d-graphite px-4 py-2 rounded-xl text-slate-300 font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-3d-gold px-5 py-2.5 rounded-xl text-white font-bold font-mono tracking-tight flex items-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(245,158,11,0.35)]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>COMMITTING TO HINDSIGHT...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>COMMIT EXPERIENCE TO HINDSIGHT</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
