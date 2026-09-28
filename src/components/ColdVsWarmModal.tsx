import React from 'react';
import {
  X,
  TrendingDown,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Zap,
  Activity,
  Layers,
  Brain,
} from 'lucide-react';

interface ColdVsWarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerColdDemo?: () => void;
  onTriggerWarmDemo?: () => void;
}

export const ColdVsWarmModal: React.FC<ColdVsWarmModalProps> = ({
  isOpen,
  onClose,
  onTriggerColdDemo,
  onTriggerWarmDemo,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      {/* 3D Glass Modal with Realistic Depth & Ambient Occlusion */}
      <div className="relative bg-gradient-to-b from-[#131b26]/95 via-[#0b1018]/98 to-[#070b10] border border-white/[0.12] rounded-2xl w-full max-w-4xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(16,185,129,0.15)] ring-1 ring-white/[0.08]">
        {/* Top specular highlight line */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

        {/* Ambient volumetric glow */}
        <div className="absolute top-0 right-0 w-80 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600/30 to-amber-950/80 border border-amber-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.25)]">
              <TrendingDown className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  -92% MTTR REDUCTION
                </span>
                <span className="text-slate-400 text-xs font-mono">
                  SRE BENCHMARK
                </span>
              </div>
              <h3 className="font-extrabold text-white text-base tracking-tight font-sans mt-0.5">
                Cold vs. Warm Hindsight Performance Comparison
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs relative z-10">
          {/* Top Visual Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cold Card (Zero Memory) */}
            <div className="p-5 rounded-2xl bg-[#090d14] border border-amber-600/40 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-600/60 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                  INCIDENT #1: COLD START (0 MEMORY)
                </span>
                <span className="text-amber-400 font-mono font-bold text-sm">38.0 Mins</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed font-sans">
                Zero historical records exist in Hindsight. SRE team must diagnose from first principles, testing hypotheses manually.
              </p>
              <div className="space-y-2 pt-1 text-[11px] font-mono">
                <div className="flex justify-between text-slate-400 p-1.5 rounded-lg bg-black/30">
                  <span>• Initial Alert & Log Grep:</span>
                  <span className="text-slate-300">8 mins</span>
                </div>
                <div className="flex justify-between text-rose-400 p-1.5 rounded-lg bg-rose-950/20 border border-rose-900/30">
                  <span>• Pod Restart Attempt (Failed):</span>
                  <span className="text-rose-400 font-bold">14 mins (Wasted)</span>
                </div>
                <div className="flex justify-between text-slate-400 p-1.5 rounded-lg bg-black/30">
                  <span>• Pool Sizing Root Cause Analysis:</span>
                  <span className="text-slate-300">12 mins</span>
                </div>
                <div className="flex justify-between text-emerald-400 p-1.5 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
                  <span>• Apply HikariCP maxPoolSize=50:</span>
                  <span className="text-emerald-400">4 mins</span>
                </div>
              </div>
            </div>

            {/* Warm Card (Hindsight Persistent Recall) */}
            <div className="p-5 rounded-2xl glass-command-hero space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                  INCIDENT #2: WARM HINDSIGHT RECALL
                </span>
                <span className="text-emerald-400 font-mono font-extrabold text-sm shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                  3.2 Mins (-92%)
                </span>
              </div>
              <p className="text-slate-200 text-xs leading-relaxed font-sans">
                TraceMind queries Hindsight, retrieves Incident #1 (94% match), blacklists pod restarts, and executes the proven 50-pool fix.
              </p>
              <div className="space-y-2 pt-1 text-[11px] font-mono">
                <div className="flex justify-between text-slate-400 p-1.5 rounded-lg bg-black/30">
                  <span>• Hindsight Hybrid Recall:</span>
                  <span className="text-amber-300 font-bold">3 seconds</span>
                </div>
                <div className="flex justify-between text-emerald-400 p-1.5 rounded-lg bg-emerald-950/30 border border-emerald-500/40">
                  <span>• Pod Restart Avoided:</span>
                  <span className="text-emerald-300 font-bold">0 mins (Blacklisted)</span>
                </div>
                <div className="flex justify-between text-slate-400 p-1.5 rounded-lg bg-black/30">
                  <span>• Deep Reflection Synthesis:</span>
                  <span className="text-amber-300 font-bold">2 seconds</span>
                </div>
                <div className="flex justify-between text-emerald-400 p-1.5 rounded-lg bg-emerald-950/30 border border-emerald-500/40">
                  <span>• Apply HikariCP maxPoolSize=50:</span>
                  <span className="text-emerald-400 font-bold">3.1 mins</span>
                </div>
              </div>
            </div>
          </div>

          {/* Time Saved Highlight Bar */}
          <div className="p-4 rounded-xl glass-command-gold flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="font-bold text-white text-xs font-sans">
                  Net Time Saved per Occurrence: 34.8 Minutes
                </div>
                <p className="text-slate-300 text-[11px] font-sans">
                  Eliminated customer churn during peak traffic surges and protected database stability.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-mono text-xs font-bold shrink-0">
              11.8x FASTER RECOVERY
            </span>
          </div>

          {/* SRE Demo Action Triggers */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {onTriggerColdDemo && (
              <button
                onClick={() => {
                  onTriggerColdDemo();
                  onClose();
                }}
                className="btn-3d-gold px-4 py-2.5 rounded-xl text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <span>1️⃣ Re-Run Cold Start (0 Memory)</span>
              </button>
            )}
            {onTriggerWarmDemo && (
              <button
                onClick={() => {
                  onTriggerWarmDemo();
                  onClose();
                }}
                className="btn-3d-emerald px-4 py-2.5 rounded-xl text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>2️⃣ Run Warm Hindsight Recall</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
