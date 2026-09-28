import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Brain,
  Sparkles,
  Layers,
  ShieldAlert,
  ArrowRight,
  Database,
  Clock,
  X,
  ShieldCheck,
} from 'lucide-react';
import { HindsightMemoryUnit } from '../types';

interface RetainVisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  memoryUnit: HindsightMemoryUnit | null;
  onProceedToWarmDemo?: () => void;
}

export const RetainVisualizerModal: React.FC<RetainVisualizerModalProps> = ({
  isOpen,
  onClose,
  memoryUnit,
  onProceedToWarmDemo,
}) => {
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setActiveStep(1);
      const timer1 = setTimeout(() => setActiveStep(2), 600);
      const timer2 = setTimeout(() => setActiveStep(3), 1200);
      const timer3 = setTimeout(() => setActiveStep(4), 1800);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isOpen]);

  if (!isOpen || !memoryUnit) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      {/* 3D Glass Modal with Realistic Depth & Ambient Occlusion */}
      <div className="relative bg-gradient-to-b from-[#131b26]/95 via-[#0b1018]/98 to-[#070b10] border border-white/[0.12] rounded-2xl w-full max-w-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(16,185,129,0.15)] ring-1 ring-white/[0.08]">
        {/* Top specular highlight line */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

        {/* Ambient volumetric glow */}
        <div className="absolute top-0 right-0 w-64 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600/30 to-emerald-950/80 border border-emerald-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.25)]">
              <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  HINDSIGHT RETAIN OPERATION
                </span>
                <span className="text-amber-300 text-[10px] font-mono font-bold">
                  PERSISTENT COMMIT
                </span>
              </div>
              <h3 className="font-extrabold text-white text-base tracking-tight font-sans mt-0.5">
                Ingesting Incident #{memoryUnit.incidentId} into Persistent Memory
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

        {/* Multi-step Retain Ingestion Visualizer */}
        <div className="p-6 space-y-5 text-xs relative z-10">
          <div className="space-y-3">
            <div className="flex items-center justify-between font-mono text-[11px] text-slate-400">
              <span>Hindsight Ingestion Pipeline:</span>
              <span className="text-amber-300 font-bold">Bank: {memoryUnit.bankId}</span>
            </div>

            <div className="space-y-2.5">
              {/* Step 1: Telemetry & Service Entities */}
              <div
                className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                  activeStep >= 1
                    ? 'bg-[#090d14] border-emerald-500/40 text-slate-200 shadow-sm'
                    : 'bg-[#06080d] border-white/[0.06] text-slate-500'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-[#121927] flex items-center justify-center shrink-0 mt-0.5 font-mono font-bold text-emerald-400 border border-emerald-500/40">
                  1
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="font-semibold text-white font-sans">
                    Extracting Service Entities & Failure Signature
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Service: <strong className="text-amber-300">{memoryUnit.service}</strong> · Tags: [{memoryUnit.tags.slice(0, 4).join(', ')}]
                  </div>
                </div>
                {activeStep >= 1 && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />}
              </div>

              {/* Step 2: Root Cause & Failed Approaches Blacklist */}
              <div
                className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                  activeStep >= 2
                    ? 'bg-[#090d14] border-emerald-500/40 text-slate-200 shadow-sm'
                    : 'bg-[#06080d] border-white/[0.06] text-slate-500'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-[#121927] flex items-center justify-center shrink-0 mt-0.5 font-mono font-bold text-emerald-400 border border-emerald-500/40">
                  2
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="font-semibold text-white font-sans flex items-center gap-1.5">
                    <span>Indexing Verified Root Cause & Blacklisting Failed Attempts</span>
                  </div>
                  <div className="text-[11px] text-rose-300 font-mono">
                    Blacklisted: {memoryUnit.failedApproaches.join('; ') || 'Pod restart attempt without pool expansion'}
                  </div>
                </div>
                {activeStep >= 2 && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />}
              </div>

              {/* Step 3: Proven Resolution & MTTR */}
              <div
                className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                  activeStep >= 3
                    ? 'bg-[#090d14] border-emerald-500/40 text-slate-200 shadow-sm'
                    : 'bg-[#06080d] border-white/[0.06] text-slate-500'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-[#121927] flex items-center justify-center shrink-0 mt-0.5 font-mono font-bold text-emerald-400 border border-emerald-500/40">
                  3
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="font-semibold text-white font-sans">
                    Storing Proven Resolution & MTTR Benchmark
                  </div>
                  <div className="text-[11px] text-emerald-300 font-mono">
                    Resolution: {memoryUnit.successfulResolution} (Baseline: {memoryUnit.mttrMinutes || 38}m)
                  </div>
                </div>
                {activeStep >= 3 && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />}
              </div>

              {/* Step 4: Ready for Recall */}
              <div
                className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                  activeStep >= 4
                    ? 'bg-gradient-to-r from-emerald-950/60 to-[#0d121c] border-emerald-500/60 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'bg-[#06080d] border-white/[0.06] text-slate-500'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-[#121927] flex items-center justify-center shrink-0 mt-0.5 font-mono font-bold text-amber-300 border border-amber-500/40">
                  4
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="font-semibold text-white font-sans flex items-center gap-1.5">
                    <span>Persistent Experience Ready for Semantic Recall</span>
                  </div>
                  <div className="text-[11px] text-amber-300 font-mono">
                    Node ID: {memoryUnit.id} · Indexed in {memoryUnit.bankId}
                  </div>
                </div>
                {activeStep >= 4 && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400 font-mono">
              Memory bank updated live.
            </span>

            <div className="flex items-center gap-2.5">
              <button
                onClick={onClose}
                className="btn-3d-graphite px-4 py-2 rounded-xl text-slate-300 font-medium cursor-pointer"
              >
                Close
              </button>

              {onProceedToWarmDemo && (
                <button
                  onClick={() => {
                    onProceedToWarmDemo();
                    onClose();
                  }}
                  className="btn-3d-emerald px-4 py-2 rounded-xl text-white font-bold font-mono text-xs flex items-center gap-2 cursor-pointer shadow-[0_4px_14px_rgba(16,185,129,0.3)]"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Test Warm Recall with This Memory</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-200" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
