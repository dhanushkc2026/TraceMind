import React, { useState, useEffect } from 'react';
import {
  Flame,
  CheckCircle2,
  Brain,
  Search,
  Sparkles,
  ArrowRight,
  ArrowDown,
  TrendingUp,
  Cpu,
  History,
  Activity,
  AlertTriangle,
  TrendingDown,
  Layers,
  Zap,
  ShieldCheck,
  Radio,
  Network,
  Database,
  Server,
  ShieldAlert,
  GitCommit,
  Boxes,
  Workflow,
  Key,
} from 'lucide-react';
import { Incident, HindsightStats } from '../types';

interface DashboardViewProps {
  incidents: Incident[];
  stats: HindsightStats | null;
  onNavigate: (tab: any) => void;
  onSelectIncident: (incident: Incident) => void;
  onStartDemoInteraction: (step: 1 | 2) => void;
  onOpenMttrModal?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  incidents,
  stats,
  onNavigate,
  onSelectIncident,
  onStartDemoInteraction,
  onOpenMttrModal,
}) => {
  const activeIncidents = incidents.filter((i) => i.status !== 'RESOLVED');
  const resolvedIncidents = incidents.filter((i) => i.status === 'RESOLVED');
  const memoryRecalls = incidents.reduce(
    (acc, i) => acc + (i.analysis?.memoryRecallCount || (i.hindsightMemoryId ? 1 : 0)),
    0
  );

  // Animation state for Warm Recall sequence
  // 'idle' -> 'current-active' -> 'gold-to-core' -> 'core-gold' -> 'historical-active' -> 'green-to-current' -> 'done'
  const [recallAnimStep, setRecallAnimStep] = useState<
    'idle' | 'current-active' | 'gold-to-core' | 'core-gold' | 'historical-active' | 'green-to-current' | 'done'
  >('idle');
  const [showLearningBanner, setShowLearningBanner] = useState(false);
  const [learningPulse, setLearningPulse] = useState(false);
  const [extraLearnedNode, setExtraLearnedNode] = useState(false);

  // Trigger Warm Recall Animation sequence (approx 1.6s total, smooth & non-distracting)
  const triggerWarmRecallAnimation = () => {
    setRecallAnimStep('current-active');
    setTimeout(() => setRecallAnimStep('gold-to-core'), 300);
    setTimeout(() => setRecallAnimStep('core-gold'), 650);
    setTimeout(() => setRecallAnimStep('historical-active'), 1000);
    setTimeout(() => setRecallAnimStep('green-to-current'), 1300);
    setTimeout(() => {
      setRecallAnimStep('done');
      onStartDemoInteraction(2);
    }, 1650);
  };

  // Demo trigger for Memory Learning Effect
  const triggerLearningEffect = () => {
    setLearningPulse(true);
    setExtraLearnedNode(true);
    setShowLearningBanner(true);
    setTimeout(() => setLearningPulse(false), 1600);
    setTimeout(() => setShowLearningBanner(false), 4000);
  };

  // If a new incident was resolved recently, trigger the subtle learning effect
  useEffect(() => {
    if (resolvedIncidents.length > 0 && stats && stats.operationsCount?.retainCount > 4) {
      setExtraLearnedNode(true);
    }
  }, [resolvedIncidents.length, stats]);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Command Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 uppercase tracking-wider">
              Autonomous Command SRE
            </span>
            <span className="text-slate-400 text-xs">· Persistent Memory Layer Active</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1.5 font-sans">
            TraceMind SRE Command Center
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            “Your production history becomes your AI’s experience.”
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onOpenMttrModal && (
            <button
              onClick={onOpenMttrModal}
              className="btn-3d-graphite px-3.5 py-2 rounded-xl text-amber-300 font-mono text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
              <span>Cold vs Warm MTTR</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('new-incident')}
            className="btn-3d-emerald px-4 py-2 rounded-xl text-white font-semibold text-xs flex items-center gap-2 cursor-pointer"
          >
            <Flame className="w-4 h-4 text-amber-300" />
            <span>Trigger Incident Triage</span>
          </button>
        </div>
      </div>

      {/* 1. COMPACT LEARNING-LOOP SECTION NEAR THE TOP: COLD START → RETAIN → WARM RECALL → LEARN */}
      <div className="glass-command rounded-2xl p-3.5 px-5 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
          <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">
            CORE LEARNING LOOP:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-600/40 text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="font-bold">COLD START</span>
            <span className="text-[10px] text-amber-400/80 hidden md:inline">(0 Memory)</span>
          </div>

          <span className="text-slate-500 font-bold">→</span>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-600/40 text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="font-bold">RETAIN</span>
            <span className="text-[10px] text-emerald-400/80 hidden md:inline">(Ingest Fix)</span>
          </div>

          <span className="text-slate-500 font-bold">→</span>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-500/50 text-amber-200">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span className="font-bold">WARM RECALL</span>
            <span className="text-[10px] text-amber-400/80 hidden md:inline">(94% Match)</span>
          </div>

          <span className="text-slate-500 font-bold">→</span>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-400/60 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span className="font-bold">LEARN</span>
            <span className="text-[10px] text-emerald-300 hidden md:inline">(-92% MTTR)</span>
          </div>
        </div>

        <span className="text-[10px] font-mono text-slate-400 hidden xl:inline">
          Autonomous experience accumulation across all microservices
        </span>
      </div>

      {/* Status banner for memory retention */}
      {showLearningBanner && (
        <div className="p-3 px-4 rounded-xl bg-gradient-to-r from-emerald-950/80 to-[#0e1622] border border-emerald-500/50 flex items-center justify-between shadow-[0_0_20px_rgba(16,185,129,0.25)] animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2.5 text-xs text-emerald-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-white font-sans">Experience retained in Hindsight Persistent Memory</span>
            <span className="text-slate-400 text-[11px]">· New experience node committed to Bank</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Node Synchronized
          </span>
        </div>
      )}

      {/* HINDSIGHT VISUAL HERO CARD: 3D Memory Core & Recall Visualizer */}
      <div className="glass-command-hero rounded-2xl p-6 relative overflow-hidden sheen-card">
        {/* Ambient volumetric lighting */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-60 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_10px_#10b981]"></span>
              </span>
              <span className="text-xs font-mono font-bold text-amber-300 tracking-wider uppercase">
                HINDSIGHT PERSISTENT MEMORY ENGINE
              </span>
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight leading-snug">
              Every resolved incident compounds into instant recovery intelligence
            </h2>

            <p className="text-slate-300 text-xs leading-relaxed">
              TraceMind stores root causes, proven fixes, and blacklisted failed attempts into Hindsight. When a similar outage strikes any microservice, the agent recalls the historical precedent and resolves it in <strong>3.2 minutes (-92% downtime)</strong>.
            </p>

            {/* 3D Interactive Demo Trigger Buttons with Realistic Depth */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onStartDemoInteraction(1)}
                className="btn-3d-gold px-4 py-2.5 rounded-xl text-white text-xs font-bold font-mono flex items-center gap-2 cursor-pointer shadow-[0_4px_15px_rgba(245,158,11,0.25)]"
              >
                <span>1️⃣ Test Cold Incident (0 Memory)</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-200" />
              </button>

              <button
                onClick={triggerWarmRecallAnimation}
                className={`btn-3d-emerald px-4 py-2.5 rounded-xl text-white text-xs font-bold font-mono flex items-center gap-2 cursor-pointer shadow-[0_4px_15px_rgba(16,185,129,0.25)] ${
                  recallAnimStep !== 'idle' ? 'ring-2 ring-amber-400/80' : ''
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {recallAnimStep !== 'idle' ? 'Recalling from Hindsight...' : '2️⃣ Test Warm Hindsight Recall'}
                </span>
              </button>
            </div>
          </div>

          {/* 1. HINDSIGHT CORE 3D VISUALIZATION: Realistic Floating Memory Core & Topology */}
          <div className="p-4 rounded-xl bg-[#060910]/90 border border-emerald-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_10px_30px_rgba(0,0,0,0.8)] w-full lg:w-96 shrink-0 space-y-3 font-mono">
            <div className="flex items-center justify-between text-[11px] pb-2 border-b border-white/[0.06]">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-emerald-400" />
                <span>Topology: {stats?.bankId}</span>
              </span>
              <span className="text-emerald-400 font-bold">
                {(stats?.totalMemories || 4) + (extraLearnedNode ? 1 : 0)} Experience Nodes
              </span>
            </div>

            {/* 3D Visual Nodes Topology Canvas */}
            <div className="h-40 bg-[#04060b] rounded-xl border border-white/[0.04] relative overflow-hidden flex items-center justify-center p-2 shadow-inner">
              {/* Background Subgrid */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06)_0%,transparent_70%)] pointer-events-none" />

              {/* Animated Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="goldBeamFlow" x1="100%" y1="100%" x2="50%" y2="50%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient id="greenBeamFlow" x1="20%" y1="80%" x2="80%" y2="80%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#34d399" stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient id="staticLink" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(16, 185, 129, 0.25)" />
                    <stop offset="100%" stopColor="rgba(245, 158, 11, 0.2)" />
                  </linearGradient>
                </defs>

                {/* Base Hairline Network Links */}
                <line x1="60" y1="40" x2="190" y2="78" stroke="url(#staticLink)" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="310" y1="40" x2="190" y2="78" stroke="url(#staticLink)" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="85" y1="125" x2="190" y2="78" stroke="url(#staticLink)" strokeWidth="1" />
                <line x1="295" y1="125" x2="190" y2="78" stroke="url(#staticLink)" strokeWidth="1" />

                {/* Active Recall Sequence Dynamic Beams */}
                {(recallAnimStep === 'gold-to-core' || recallAnimStep === 'core-gold') && (
                  <line
                    x1="295"
                    y1="125"
                    x2="190"
                    y2="78"
                    stroke="url(#goldBeamFlow)"
                    strokeWidth="2.5"
                    className="animate-beam-flow"
                  />
                )}

                {(recallAnimStep === 'green-to-current' || recallAnimStep === 'done') && (
                  <>
                    <line
                      x1="85"
                      y1="125"
                      x2="190"
                      y2="78"
                      stroke="url(#greenBeamFlow)"
                      strokeWidth="2.5"
                      className="animate-beam-flow"
                    />
                    <line
                      x1="190"
                      y1="78"
                      x2="295"
                      y2="125"
                      stroke="url(#greenBeamFlow)"
                      strokeWidth="2.5"
                      className="animate-beam-flow"
                    />
                  </>
                )}
              </svg>

              {/* 1. HINDSIGHT CORE 3D (Subtle Realistic Floating Memory Core) */}
              <div
                className={`relative z-20 flex flex-col items-center animate-float-subtle transition-all duration-300 ${
                  recallAnimStep === 'core-gold' ? 'scale-110' : ''
                } ${learningPulse ? 'animate-learning-pulse' : ''}`}
              >
                {/* 3D Core Sphere Container */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  {/* Outer Emerald Energy Ring (Extremely subtle slow rotation) */}
                  <div
                    className={`absolute inset-0 rounded-full border border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.35)] animate-spin-very-slow pointer-events-none ${
                      recallAnimStep === 'core-gold' ? 'border-amber-400/70 shadow-[0_0_20px_rgba(245,158,11,0.6)]' : ''
                    }`}
                    style={{
                      transform: 'rotateX(65deg)',
                      borderStyle: 'dashed',
                      borderWidth: '1.5px',
                    }}
                  />

                  {/* Secondary faint outer orbit */}
                  <div
                    className="absolute -inset-1.5 rounded-full border border-emerald-500/20 pointer-events-none"
                    style={{ transform: 'rotateX(60deg) rotateZ(45deg)' }}
                  />

                  {/* Dark Glass Sphere with Realistic Depth & Soft Shadow */}
                  <div
                    className={`w-12 h-12 rounded-full relative flex items-center justify-center cursor-pointer transition-all duration-300 ${
                      recallAnimStep === 'core-gold' ? 'animate-core-gold-flash' : 'animate-core-breathe'
                    }`}
                    style={{
                      background:
                        'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.28) 0%, rgba(16, 185, 129, 0.16) 30%, rgba(6, 10, 16, 0.96) 75%)',
                      boxShadow:
                        '0 14px 28px -6px rgba(0, 0, 0, 0.85), inset 0 1px 2px rgba(255, 255, 255, 0.35), inset 0 -2px 4px rgba(0, 0, 0, 0.65)',
                    }}
                  >
                    {/* Gold Inner Memory Signal */}
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shadow-inner transition-all duration-300 ${
                        recallAnimStep === 'core-gold'
                          ? 'bg-amber-300 shadow-[0_0_25px_#f59e0b]'
                          : 'bg-gradient-to-tr from-amber-500 to-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.6)]'
                      }`}
                    >
                      <Brain className="w-3.5 h-3.5 text-slate-950 font-bold" />
                    </div>

                    {/* Tiny orbiting photon on the glass edge */}
                    <div className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-emerald-300 shadow-[0_0_6px_#34d399]" />
                  </div>
                </div>

                <span
                  className={`text-[9px] mt-0.5 font-bold tracking-wider transition-colors font-mono ${
                    recallAnimStep === 'core-gold' ? 'text-amber-300 scale-105' : 'text-emerald-300'
                  }`}
                >
                  HINDSIGHT CORE
                </span>
              </div>

              {/* Historical Node: PaymentService (Precedent) */}
              <div
                className={`absolute left-3 bottom-2.5 z-10 flex items-center gap-1.5 p-1 px-2 rounded-lg bg-emerald-950/80 border text-[9px] transition-all duration-300 ${
                  recallAnimStep === 'historical-active' || recallAnimStep === 'green-to-current' || recallAnimStep === 'done'
                    ? 'border-emerald-400 bg-emerald-900/90 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-105'
                    : 'border-emerald-500/40 text-emerald-300'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                <span className="font-semibold">Payment (Precedent)</span>
              </div>

              {/* Current Incident Node: OrderService (Live Target) */}
              <div
                className={`absolute right-3 bottom-2.5 z-10 flex items-center gap-1.5 p-1 px-2 rounded-lg border text-[9px] transition-all duration-300 ${
                  recallAnimStep === 'current-active' || recallAnimStep === 'gold-to-core'
                    ? 'border-amber-400 bg-amber-950 text-white shadow-[0_0_15px_rgba(245,158,11,0.6)] scale-105 ring-1 ring-amber-400'
                    : recallAnimStep === 'done'
                    ? 'border-emerald-500/60 bg-[#0c1615] text-emerald-200'
                    : 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    recallAnimStep === 'done' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                  }`}
                />
                <span className="font-semibold">Order (Warm Target)</span>
              </div>

              {/* Tiny Satellite Nodes */}
              <div className="absolute left-6 top-2 z-10 text-[9px] text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                <span>AuthService</span>
              </div>

              <div className="absolute right-6 top-2 z-10 text-[9px] text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                <span>StorageGW</span>
              </div>

              {/* Extra newly learned node if active */}
              {extraLearnedNode && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 p-0.5 px-1.5 rounded bg-emerald-950/70 border border-emerald-500/60 text-[8px] text-emerald-300 animate-in fade-in zoom-in duration-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Newly Retained Experience</span>
                </div>
              )}
            </div>

            {/* Bottom Status Row */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Verified fix indexing</span>
              </span>
              <span
                className={`font-mono font-bold transition-all duration-300 ${
                  recallAnimStep === 'done'
                    ? 'text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                    : 'text-amber-300'
                }`}
              >
                94% Recall Match
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. WHY TRACEMIND IS DIFFERENT SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
            <h2 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
              WHY TRACEMIND IS DIFFERENT
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Persistent DevOps Experience Layer
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pillar 1: Experience Memory */}
          <div className="glass-command rounded-2xl p-5 space-y-2 border-emerald-500/30 hover:border-emerald-400/60 transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm font-sans tracking-tight">
                Experience Memory
              </h3>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed font-sans">
              Remembers proven incident resolutions. When an outage occurs, TraceMind immediately matches historical root causes, eliminating trial-and-error diagnosis.
            </p>
            <div className="pt-1 text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span>✓ Verified resolutions indexed</span>
            </div>
          </div>

          {/* Pillar 2: Failure Memory */}
          <div className="glass-command rounded-2xl p-5 space-y-2 border-amber-500/30 hover:border-amber-400/60 transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-amber-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm font-sans tracking-tight">
                Failure Memory
              </h3>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed font-sans">
              Remembers failed approaches and warns engineers not to repeat them. Prevents disastrous restart loops, ineffective pod scaling, or repeated configuration errors.
            </p>
            <div className="pt-1 text-[10px] text-amber-400 font-mono flex items-center gap-1">
              <span>✕ Blacklisted failure patterns enforced</span>
            </div>
          </div>

          {/* Pillar 3: Continuous Learning */}
          <div className="glass-command rounded-2xl p-5 space-y-2 border-emerald-500/30 hover:border-emerald-400/60 transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm font-sans tracking-tight">
                Continuous Learning
              </h3>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed font-sans">
              Every confirmed resolution becomes future operational experience. Knowledge compounds with every post-mortem without manual documentation overhead.
            </p>
            <div className="pt-1 text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span>⚡ Automatic knowledge compounding</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MEASURABLE IMPACT SECTION */}
      <div className="glass-command rounded-2xl p-5 space-y-4 border-emerald-500/25">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              MEASURABLE IMPACT
            </h2>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-amber-300 border border-white/[0.08]">
            Demo Benchmark · Empirical SRE Results
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cold Start Impact */}
          <div className="p-4 rounded-xl bg-[#090d14] border border-amber-600/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 font-mono flex items-center gap-1.5">
                <span>❄️ Cold Start</span>
              </span>
              <span className="text-[10px] font-mono text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-950 border border-amber-800/60">
                38.0m MTTR (Scenario Benchmark)
              </span>
            </div>
            <p className="text-slate-300 text-xs font-sans leading-relaxed">
              No useful precedent → investigation from scratch. SRE team must inspect raw logs, test unguided hypotheses, and endure trial-and-error downtime.
            </p>
            <div className="text-[10px] font-mono text-slate-400 pt-1 flex justify-between">
              <span>• Log Grep & Hypotheses: 20 mins</span>
              <span className="text-rose-400">• Failed Attempts: 14 mins</span>
              <span className="text-slate-300">• Fix Applied: 4 mins</span>
            </div>
          </div>

          {/* Warm Recall Impact */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 to-[#0c141e] border border-emerald-500/50 space-y-2 shadow-[0_0_20px_rgba(16,185,129,0.12)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>⚡ Warm Recall</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-300 font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-600/60 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                3.2m MTTR (-92% Speedup, Demo Benchmark)
              </span>
            </div>
            <p className="text-slate-200 text-xs font-sans leading-relaxed">
              Previous experience → proven resolution guidance. Agent retrieves precedent with 94% match, bypasses failed attempts, and prescribes the validated resolution in seconds.
            </p>
            <div className="text-[10px] font-mono text-slate-400 pt-1 flex justify-between">
              <span className="text-amber-300">• Hindsight Recall: 3s</span>
              <span className="text-emerald-300">• Failed Steps Avoided: 0m</span>
              <span className="text-emerald-400 font-bold">• 34.8m Net Saved</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. METRIC CARDS: Compact with Glass Depth, Floating Effect & Micro Animated Visualizations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Active Outages */}
        <div className="glass-command rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.85)]">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono tracking-wider uppercase">
            <span>ACTIVE OUTAGES</span>
            <Flame className="w-3.5 h-3.5 text-amber-400" />
          </div>

          <div className="my-2.5 flex items-baseline justify-between">
            <div className="text-2xl font-extrabold font-mono text-white tracking-tight">
              {activeIncidents.length}
            </div>
            {/* Tiny Animated Telemetry Visualization (3 Oscillating Bars) */}
            <div className="flex items-end gap-0.5 h-4 w-7">
              <span className="w-1.5 rounded-sm bg-amber-400/80 animate-[pulse_1s_ease-in-out_infinite] h-2" />
              <span className="w-1.5 rounded-sm bg-amber-400 animate-[pulse_1.4s_ease-in-out_infinite] h-3.5" />
              <span className="w-1.5 rounded-sm bg-amber-400/60 animate-[pulse_0.8s_ease-in-out_infinite] h-2.5" />
            </div>
          </div>

          <div className="text-[10px] text-amber-400/90 flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>{activeIncidents.length > 0 ? 'Live Triage Active' : 'All Services Nominal'}</span>
          </div>
        </div>

        {/* Card 2: Resolved Outages */}
        <div className="glass-command rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.85)]">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono tracking-wider uppercase">
            <span>RESOLVED OUTAGES</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>

          <div className="my-2.5 flex items-baseline justify-between">
            <div className="text-2xl font-extrabold font-mono text-emerald-400 tracking-tight">
              {resolvedIncidents.length}
            </div>
            {/* Tiny Animated Sparkline Indicator */}
            <div className="flex items-center gap-1">
              <svg className="w-8 h-4 overflow-visible" viewBox="0 0 32 16" fill="none">
                <path d="M1 12L10 8L18 13L31 2" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="31" cy="2" r="2" fill="#34d399" className="animate-pulse" />
              </svg>
            </div>
          </div>

          <div className="text-[10px] text-emerald-400/90 font-mono">
            100% retained into memory
          </div>
        </div>

        {/* Card 3: Hindsight Units */}
        <div className="glass-command rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.85)] border-emerald-500/25">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono tracking-wider uppercase">
            <span>HINDSIGHT UNITS</span>
            <Brain className="w-3.5 h-3.5 text-emerald-400" />
          </div>

          <div className="my-2.5 flex items-baseline justify-between">
            <div className="text-2xl font-extrabold font-mono text-white tracking-tight">
              {(stats?.totalMemories || 0) + (extraLearnedNode ? 1 : 0)}
            </div>
            {/* Tiny 3D Node Cluster Icon with Breathing Glow */}
            <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981] animate-pulse" />
            </div>
          </div>

          <div className="text-[10px] text-slate-400 font-mono">
            {stats?.experiencesCount || 4} exp · {stats?.observationsCount || 0} patterns
          </div>
        </div>

        {/* Card 4: Precedent Matches */}
        <div className="glass-command rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.85)] border-amber-500/25">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono tracking-wider uppercase">
            <span>PRECEDENT MATCHES</span>
            <Search className="w-3.5 h-3.5 text-amber-400" />
          </div>

          <div className="my-2.5 flex items-baseline justify-between">
            <div className="text-2xl font-extrabold font-mono text-amber-300 tracking-tight">
              {memoryRecalls}
            </div>
            {/* Tiny Match Percentage Gauge */}
            <div className="w-8 bg-[#090d14] h-2 rounded-full overflow-hidden border border-white/[0.08]">
              <div className="bg-amber-400 h-full rounded-full w-[94%]" />
            </div>
          </div>

          <div className="text-[10px] text-amber-400/90 font-mono">
            Avg relevance: {stats?.avgRecallRelevance || 94}%
          </div>
        </div>

        {/* Card 5: Warm MTTR Speedup */}
        <div className="glass-command rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.85)] border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.08)]">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono tracking-wider uppercase">
            <span>WARM MTTR SPEEDUP</span>
            <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
          </div>

          <div className="my-2.5 flex items-baseline justify-between">
            <div className="text-2xl font-extrabold font-mono text-emerald-400 tracking-tight">
              -92%
            </div>
            {/* Downward drop trend icon */}
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              11.8x
            </span>
          </div>

          <div className="text-[10px] text-slate-400 font-mono">
            38.0m → 3.2m (Scenario Benchmark)
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Incidents & Memory Core Topology */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Incidents */}
        <div className="lg:col-span-2 glass-command rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="font-semibold text-white text-sm font-sans">Recent Outage Telemetry</h3>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-mono text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>View All Outages</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-slate-400 font-mono text-[11px]">
                  <th className="pb-2.5 font-medium">INCIDENT / SERVICE</th>
                  <th className="pb-2.5 font-medium">SEVERITY</th>
                  <th className="pb-2.5 font-medium">STATUS</th>
                  <th className="pb-2.5 font-medium">HINDSIGHT LINK</th>
                  <th className="pb-2.5 font-medium text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {incidents.slice(0, 5).map((inc) => (
                  <tr
                    key={inc.id}
                    className="hover:bg-white/[0.03] transition-colors group cursor-pointer"
                    onClick={() => onSelectIncident(inc)}
                  >
                    <td className="py-3 pr-2">
                      <div className="font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors line-clamp-1 font-sans">
                        {inc.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                        <span className="text-amber-400 font-bold">{inc.id}</span>
                        <span>·</span>
                        <span className="text-slate-300">{inc.service}</span>
                        <span>·</span>
                        <span className="text-slate-500 font-mono">
                          {inc.mttrMinutes ? `${inc.mttrMinutes}m MTTR` : '38m MTTR'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          inc.severity === 'CRITICAL'
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-800/70'
                            : inc.severity === 'HIGH'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-800/70'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {inc.severity}
                      </span>
                    </td>
                    <td className="py-3 pr-2">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium font-mono ${
                          inc.status === 'RESOLVED'
                            ? 'text-emerald-400'
                            : inc.status === 'ANALYZED'
                            ? 'text-amber-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {inc.status === 'RESOLVED' ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        )}
                        <span>{inc.status}</span>
                      </span>
                    </td>
                    <td className="py-3 pr-2">
                      {inc.hindsightMemoryId || (inc.analysis && inc.analysis.memoryUsed) ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-700/60 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          <span>Precedent Recalled</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                          Cold Start (0 Memory)
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectIncident(inc);
                        }}
                        className="btn-3d-graphite px-2.5 py-1 rounded-lg text-slate-200 text-xs font-mono cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Hindsight Memory Core Breakdown */}
        <div className="glass-command rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-emerald-400" />
              <h3 className="font-semibold text-white text-sm font-sans">Memory Topology</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
              SYNCHRONIZED
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Memory breakdown card */}
            <div className="p-3.5 rounded-xl bg-[#07090f] border border-white/[0.06] space-y-2.5">
              <div className="flex items-center justify-between text-slate-300 font-medium">
                <span className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Network Capacity</span>
                </span>
                <span className="font-mono text-emerald-400 font-bold">
                  {(stats?.totalMemories || 4) + (extraLearnedNode ? 1 : 0)} Units
                </span>
              </div>
              <div className="space-y-1.5 pt-1 text-[11px] text-slate-400 font-mono">
                <div className="flex justify-between items-center">
                  <span>• Experience Units:</span>
                  <span className="text-slate-200">
                    {(stats?.experiencesCount || 4) + (extraLearnedNode ? 1 : 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>• Systemic Observations:</span>
                  <span className="text-amber-300 font-semibold">{stats?.observationsCount || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>• Services Monitored:</span>
                  <span className="text-slate-200">{stats?.servicesTracked.length || 4} Services</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/[0.06] text-[10px]">
                  <span>Operations: Retain / Recall / Reflect</span>
                  <span className="text-emerald-400 font-bold">
                    {(stats?.operationsCount?.retainCount || 4) + (extraLearnedNode ? 1 : 0)} / {stats?.operationsCount?.recallCount || 8} / {stats?.operationsCount?.reflectCount || 6}
                  </span>
                </div>
              </div>
            </div>

            {/* Pattern insight card with Gold/Emerald accent */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-950/30 to-emerald-950/20 border border-amber-500/30 text-[11px] text-slate-300 space-y-1 shadow-[0_4px_15px_rgba(245,158,11,0.08)]">
              <div className="font-bold text-amber-300 flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>CROSS-SERVICE HEURISTIC RULE:</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px] font-sans">
                HikariCP connection pool exhaustion in PostgreSQL clusters reoccurs under peak checkouts. Hindsight automatically blacklists pod restarts and prescribes immediate pool size expansion (50 connections).
              </p>
            </div>

            <button
              onClick={() => onNavigate('timeline')}
              className="btn-3d-graphite w-full py-2.5 px-3 rounded-xl text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              <History className="w-3.5 h-3.5 text-emerald-400" />
              <span>Inspect Memory Growth Timeline</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. BUILT FOR PRODUCTION AT SCALE SECTION */}
      <div className="glass-command rounded-2xl p-6 space-y-5 border-emerald-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <Boxes className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">
                BUILT FOR PRODUCTION AT SCALE
              </h2>
            </div>
            <p className="text-slate-400 text-xs mt-1 font-sans">
              All microservices run the same unified Incident Response workflow and feed into the shared Hindsight Persistent Memory layer.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-600/50 font-bold">
            Single Unified Workflow · 5 Connected Services
          </span>
        </div>

        {/* Cross-Service Topology Diagram */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {/* Order Service */}
          <div className="p-3.5 rounded-xl bg-[#090d14] border border-white/[0.08] hover:border-amber-400/50 transition-all space-y-1.5 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-amber-300">ORDER SERVICE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            </div>
            <p className="text-[11px] text-slate-300 font-sans">Checkout & surge flows</p>
            <div className="text-[9px] font-mono text-slate-500 flex items-center gap-1 pt-1">
              <span>Recalls: Pool Sizing</span>
            </div>
          </div>

          {/* Payment Service */}
          <div className="p-3.5 rounded-xl bg-[#090d14] border border-white/[0.08] hover:border-emerald-400/50 transition-all space-y-1.5 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-emerald-300">PAYMENT SERVICE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-300 font-sans">Gateway & transaction API</p>
            <div className="text-[9px] font-mono text-slate-500 flex items-center gap-1 pt-1">
              <span>Retained: INC-8041 Fix</span>
            </div>
          </div>

          {/* Auth Service */}
          <div className="p-3.5 rounded-xl bg-[#090d14] border border-white/[0.08] hover:border-amber-400/50 transition-all space-y-1.5 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-200">AUTH SERVICE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            </div>
            <p className="text-[11px] text-slate-300 font-sans">JWT & Secret rotation</p>
            <div className="text-[9px] font-mono text-slate-500 flex items-center gap-1 pt-1">
              <span>Retained: Key Sync</span>
            </div>
          </div>

          {/* API Gateway */}
          <div className="p-3.5 rounded-xl bg-[#090d14] border border-white/[0.08] hover:border-amber-400/50 transition-all space-y-1.5 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-200">API GATEWAY</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            </div>
            <p className="text-[11px] text-slate-300 font-sans">Ingress routing & proxy</p>
            <div className="text-[9px] font-mono text-slate-500 flex items-center gap-1 pt-1">
              <span>Retained: Buffer Limits</span>
            </div>
          </div>

          {/* Database Layer */}
          <div className="p-3.5 rounded-xl bg-[#090d14] border border-white/[0.08] hover:border-emerald-400/50 transition-all space-y-1.5 group col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-emerald-300">DATABASE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-300 font-sans">PostgreSQL clusters</p>
            <div className="text-[9px] font-mono text-slate-500 flex items-center gap-1 pt-1">
              <span>Rule: Pool Sizing &gt;= 50</span>
            </div>
          </div>
        </div>

        {/* Convergence Bar to Shared Hindsight Memory Layer */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/60 via-[#0a1018] to-amber-950/40 border border-emerald-500/40 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-emerald-300 font-semibold">
            <Workflow className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Convergence: All services feed into the same Hindsight Persistent Memory layer</span>
          </div>
          <span className="text-[10px] text-amber-300 hidden md:inline font-bold">
            Zero Siloed Knowledge · Fleet-wide Experience
          </span>
        </div>
      </div>

      {/* 5. HOW TRACEMIND WORKS SECTION (PIPELINE) */}
      <div className="glass-command rounded-2xl p-6 space-y-5 border-white/[0.1]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Workflow className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              HOW TRACEMIND WORKS
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            End-to-End Autonomous Incident Response Lifecycle
          </span>
        </div>

        {/* 7-Step Pipeline Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 items-center">
          {/* Step 1 */}
          <div className="p-3 rounded-xl bg-[#090d14] border border-white/[0.08] text-center space-y-1">
            <div className="w-7 h-7 rounded-lg bg-rose-950/80 border border-rose-600/60 flex items-center justify-center mx-auto text-rose-300">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <div className="text-[10px] font-mono font-bold text-white uppercase">
              Production Telemetry
            </div>
            <p className="text-[9px] text-slate-400 leading-tight">Logs, errors, traces & symptoms</p>
          </div>

          {/* Arrow 1 */}
          <div className="hidden md:flex justify-center text-slate-500 font-bold">
            <ArrowRight className="w-4 h-4 text-emerald-400/70" />
          </div>

          {/* Step 2 */}
          <div className="p-3 rounded-xl bg-[#090d14] border border-white/[0.08] text-center space-y-1">
            <div className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center mx-auto text-emerald-300">
              <Brain className="w-3.5 h-3.5" />
            </div>
            <div className="text-[10px] font-mono font-bold text-white uppercase">
              TraceMind Agent
            </div>
            <p className="text-[9px] text-slate-400 leading-tight">Extracts entities & signatures</p>
          </div>

          {/* Arrow 2 */}
          <div className="hidden md:flex justify-center text-slate-500 font-bold">
            <ArrowRight className="w-4 h-4 text-emerald-400/70" />
          </div>

          {/* Step 3 */}
          <div className="p-3 rounded-xl bg-[#090d14] border border-amber-500/40 text-center space-y-1 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
            <div className="w-7 h-7 rounded-lg bg-amber-950/80 border border-amber-500/60 flex items-center justify-center mx-auto text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="text-[10px] font-mono font-bold text-amber-300 uppercase">
              Hindsight Recall
            </div>
            <p className="text-[9px] text-slate-400 leading-tight">Hybrid search for precedent matches</p>
          </div>

          {/* Arrow 3 */}
          <div className="hidden md:flex justify-center text-slate-500 font-bold">
            <ArrowRight className="w-4 h-4 text-emerald-400/70" />
          </div>

          {/* Step 4 */}
          <div className="p-3 rounded-xl bg-[#090d14] border border-white/[0.08] text-center space-y-1">
            <div className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center mx-auto text-emerald-300">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <div className="text-[10px] font-mono font-bold text-white uppercase">
              LLM Reasoning
            </div>
            <p className="text-[9px] text-slate-400 leading-tight">Synthesizes evidence with telemetry</p>
          </div>
        </div>

        {/* Continuation Row on Smaller Screens & Second Row on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center pt-1">
          {/* Step 5 */}
          <div className="p-3 rounded-xl bg-[#090d14] border border-white/[0.08] text-center space-y-1 md:col-start-1">
            <div className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center mx-auto text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div className="text-[10px] font-mono font-bold text-white uppercase">
              Evidence + Recommendation
            </div>
            <p className="text-[9px] text-slate-400 leading-tight">Proven fix, runbook & failed warnings</p>
          </div>

          {/* Arrow 5 */}
          <div className="hidden md:flex justify-center text-slate-500 font-bold">
            <ArrowRight className="w-4 h-4 text-emerald-400/70" />
          </div>

          {/* Step 6 */}
          <div className="p-3 rounded-xl bg-[#090d14] border border-amber-500/30 text-center space-y-1">
            <div className="w-7 h-7 rounded-lg bg-amber-950/80 border border-amber-500/60 flex items-center justify-center mx-auto text-amber-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="text-[10px] font-mono font-bold text-amber-200 uppercase">
              Human Confirmation
            </div>
            <p className="text-[9px] text-slate-400 leading-tight">SRE validates or adjusts diagnosis</p>
          </div>

          {/* Arrow 6 */}
          <div className="hidden md:flex justify-center text-slate-500 font-bold">
            <ArrowRight className="w-4 h-4 text-emerald-400/70" />
          </div>

          {/* Step 7 */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-950/60 to-[#0e1622] border border-emerald-500/60 text-center space-y-1 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <div className="w-7 h-7 rounded-lg bg-emerald-900/90 border border-emerald-400/80 flex items-center justify-center mx-auto text-emerald-200">
              <GitCommit className="w-3.5 h-3.5" />
            </div>
            <div className="text-[10px] font-mono font-bold text-emerald-300 uppercase">
              Hindsight Retain
            </div>
            <p className="text-[9px] text-emerald-200/90 leading-tight font-medium">Outcome stored for future recall</p>
          </div>
        </div>
      </div>
    </div>
  );
};
