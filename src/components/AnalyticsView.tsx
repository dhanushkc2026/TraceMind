import React from 'react';
import {
  TrendingDown,
  ShieldCheck,
  Zap,
  Activity,
  BarChart3,
  Brain,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { HindsightStats, Incident } from '../types';

interface AnalyticsViewProps {
  stats: HindsightStats | null;
  incidents: Incident[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ stats, incidents }) => {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 uppercase">
            SRE Telemetry & Learning ROI
          </span>
          <span className="text-slate-400 text-xs">· Production Benchmarks</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-1.5 font-sans">
          Hindsight Learning & Reliability Analytics
        </h1>
        <p className="text-slate-400 text-xs mt-0.5">
          Quantified impact of persistent memory on Mean Time to Resolution (MTTR), recurrence prevention, and cross-team knowledge reuse.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-command space-y-1">
          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>MTTR REDUCTION</span>
            <TrendingDown className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400">
            -92.4%
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            38m baseline → 3.2m with memory
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-command space-y-1">
          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>RECURRENCE PREVENTION</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">
            100%
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Zero repeated failed actions
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-command space-y-1">
          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>ACTIVE EXPERIENCE NODES</span>
            <Brain className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-300">
            {stats?.totalMemories || 0}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Across {stats?.servicesTracked.length || 0} production services
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-command space-y-1">
          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>MEAN RECALL SCORE</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-300">
            94.2%
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Hybrid semantic + keyword
          </div>
        </div>
      </div>

      {/* MTTR Progression Graph Visual */}
      <div className="p-6 rounded-2xl glass-command-hero space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-500/30">
          <div>
            <h3 className="font-bold text-white text-base font-sans">
              Mean Time to Resolution (MTTR) Learning Curve
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Incident resolution duration as Hindsight accumulates production memory
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/50 font-bold shadow-[0_0_10px_rgba(16,185,129,0.25)]">
            COMPOUNDING SRE ROI
          </span>
        </div>

        {/* Bar Comparison Visual */}
        <div className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Incident #1: Cold Start (No Memory)</span>
              <span className="text-amber-400 font-bold">38.0 Minutes</span>
            </div>
            <div className="w-full bg-[#0a0d14] h-3 rounded-full overflow-hidden border border-white/[0.06]">
              <div className="bg-gradient-to-r from-amber-600 to-amber-500 h-full rounded-full" style={{ width: '100%' }} />
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              First-principles exploratory analysis, manual log grep, unguided trial steps
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Incident #2: Warm Recall (Precedent Ingested)</span>
              <span className="text-emerald-400 font-bold">3.2 Minutes (-92%)</span>
            </div>
            <div className="w-full bg-[#0a0d14] h-3 rounded-full overflow-hidden border border-white/[0.06]">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: '8.4%' }} />
            </div>
            <div className="text-[10px] text-emerald-300 font-mono">
              Instant Hindsight recall, pod restart avoided, proven 50-pool fix deployed immediately
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Incident #20: Consolidated Architectural Rule</span>
              <span className="text-emerald-300 font-bold">1.2 Minutes (Auto-Prevented)</span>
            </div>
            <div className="w-full bg-[#0a0d14] h-3 rounded-full overflow-hidden border border-white/[0.06]">
              <div className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full" style={{ width: '3.1%' }} />
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Proactive policy enforcement across all microservices before database starvation
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
