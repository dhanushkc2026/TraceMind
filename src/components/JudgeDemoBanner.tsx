import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  Check,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  Brain,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

interface JudgeDemoBannerProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  onOpenMttrModal: () => void;
  onAutoPlay: () => void;
  isAutoPlaying: boolean;
}

export const JudgeDemoBanner: React.FC<JudgeDemoBannerProps> = ({
  currentStep,
  onSelectStep,
  onOpenMttrModal,
  onAutoPlay,
  isAutoPlaying,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const steps = [
    {
      num: 1,
      name: 'Cold Start',
      badge: '0 MEMORY',
      desc: 'Incident #1 starts with 0 memory. First-principles analysis. MTTR: 38m.',
    },
    {
      num: 2,
      name: 'Retain',
      badge: 'INGEST',
      desc: 'Fix confirmed: stores root cause, failed attempts, fix, and MTTR in Hindsight.',
    },
    {
      num: 3,
      name: 'Warm Recall',
      badge: 'RECALL',
      desc: 'Incident #2 calls Recall. Surfaces precedent from PaymentService, failed fix & proven solution.',
    },
    {
      num: 4,
      name: 'Reflect',
      badge: 'SYNTHESIS',
      desc: 'Deep reasoning explains why previous fix applies & warns against pod restarts.',
    },
    {
      num: 5,
      name: 'Evaluation',
      badge: '-92% MTTR',
      desc: 'Cold vs Warm comparison: 38.0m vs 3.2m MTTR. 34.8 minutes saved.',
    },
    {
      num: 6,
      name: 'Timeline',
      badge: 'COMPOUND',
      desc: 'Inspect how TraceMind compounds knowledge from Incident #1 to #20.',
    },
  ];

  return (
    <div className="bg-[#090c14]/95 border-b border-white/[0.08] px-5 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] select-none relative z-30 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left Brand / Demo Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-3 w-3 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-tr from-emerald-500 to-amber-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5 font-sans">
                <span>HINDSIGHT AI SRE</span>
                <span className="text-[9px] font-mono tracking-wider font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                  PERSISTENT MEMORY
                </span>
              </span>
              <span className="hidden xl:inline text-[10px] text-slate-400 font-mono">
                Persistent Memory Workflow
              </span>
            </div>
          </div>
        </div>

        {/* Center: Premium 3D Workflow Progress System */}
        {!isCollapsed && (
          <div className="hidden md:flex items-center gap-2">
            {steps.map((st, idx) => {
              const isActive = currentStep === st.num;
              const isPast = currentStep > st.num;

              return (
                <div key={st.num} className="flex items-center">
                  <button
                    onClick={() => onSelectStep(st.num)}
                    className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'step-node-3d step-active'
                        : isPast
                        ? 'step-node-3d step-completed hover:brightness-110'
                        : 'step-node-3d step-future hover:border-slate-700'
                    }`}
                    title={st.desc}
                  >
                    {/* Node Number / Checkmark Badge */}
                    <span
                      className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold transition-all shadow-inner ${
                        isActive
                          ? 'bg-gradient-to-tr from-amber-400 to-emerald-400 text-slate-950 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                          : isPast
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isPast ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : st.num}
                    </span>

                    <span className={`font-semibold tracking-tight ${isActive ? 'text-amber-200' : isPast ? 'text-emerald-300' : 'text-slate-400'}`}>
                      {st.name}
                    </span>

                    {/* Subtle micro tag */}
                    <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                      isActive 
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' 
                        : isPast 
                        ? 'bg-emerald-950/60 text-emerald-400' 
                        : 'bg-slate-800/60 text-slate-500'
                    }`}>
                      {st.badge}
                    </span>
                  </button>

                  {/* Connecting Rail */}
                  {idx < steps.length - 1 && (
                    <div className="w-3.5 h-[2px] mx-1 relative overflow-hidden rounded-full">
                      <div className={`h-full w-full transition-colors duration-300 ${
                        isPast ? 'bg-emerald-500/70 shadow-[0_0_6px_rgba(16,185,129,0.5)]' : 'bg-slate-800'
                      }`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onAutoPlay}
            disabled={isAutoPlaying}
            className="btn-3d-emerald px-3.5 py-1.5 rounded-lg text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            <Play className={`w-3 h-3 text-amber-300 fill-amber-300 ${isAutoPlaying ? 'animate-spin' : ''}`} />
            <span>{isAutoPlaying ? 'Playing Demo...' : 'Auto-Play 2m'}</span>
          </button>

          <button
            onClick={onOpenMttrModal}
            className="btn-3d-graphite px-2.5 py-1.5 rounded-lg text-amber-300 text-xs font-mono font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">MTTR Benchmark</span>
          </button>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
