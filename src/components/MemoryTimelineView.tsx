import React, { useState } from 'react';
import {
  Clock,
  Sparkles,
  ArrowRight,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Layers,
  TrendingDown,
  Shield,
  Zap,
} from 'lucide-react';
import { HindsightMemoryUnit } from '../types';

interface MemoryTimelineViewProps {
  memories: HindsightMemoryUnit[];
}

export const MemoryTimelineView: React.FC<MemoryTimelineViewProps> = ({ memories }) => {
  const [selectedNode, setSelectedNode] = useState<number>(0);

  const learningMilestones = [
    {
      id: 1,
      title: 'Incident #1: Auth JWT Secret Mismatch',
      subtitle: 'Cold Start · First-Principles Diagnosis',
      stage: 'LEARNED',
      service: 'AuthService',
      mttr: '58 mins MTTR',
      tag: 'First occurrence',
      badgeColor: 'bg-amber-950/80 text-amber-300 border border-amber-600/60 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
      icon: AlertTriangle,
      description:
        'Zero prior memory existed. The agent performed exploratory log analysis. Developer diagnosed secret rotation out-of-sync and retained the fix in Hindsight.',
      whatLearned:
        'Learned: Dual-signing key rotation is required. Never rotate Kubernetes secrets without cluster-wide replica sync window.',
      retainedFact:
        'Stored memory unit in Hindsight Bank with tags [auth, jwt, secrets, rollout].',
      metrics: 'Baseline MTTR: 58m · Exploratory steps: 7',
    },
    {
      id: 5,
      title: 'Incident #5: HikariCP Connection Exhaustion',
      subtitle: 'First Database Pool Collapse',
      stage: 'LEARNED & RETAINED',
      service: 'PaymentService',
      mttr: '32 mins MTTR',
      tag: 'Proven fix recorded',
      badgeColor: 'bg-amber-950/80 text-amber-300 border border-amber-600/60 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
      icon: Brain,
      description:
        'Flash sale checkout traffic spiked to 120 threads. Default Hikari pool (10) caused 504 timeouts. Pod restart failed; increasing pool size to 50 resolved the queue in 90s.',
      whatLearned:
        'Learned: Pod restart is ineffective for pool starvation. Increase pool to 50 and set connectionTimeout=3000ms.',
      retainedFact:
        'Recorded successful resolution and explicitly blacklisted pod restarts as a failed approach.',
      metrics: 'MTTR: 32m · Restart attempt eliminated in future runs',
    },
    {
      id: 12,
      title: 'Incident #12: OrderService Pool Saturation',
      subtitle: 'Warm Recall · Immediate High-Confidence Match',
      stage: 'RECALLED PREVIOUS SOLUTION',
      service: 'OrderService',
      mttr: '3.2 mins MTTR (-92%)',
      tag: '94% Hindsight Match',
      badgeColor: 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.3)]',
      icon: Sparkles,
      description:
        'OrderService experienced an identical 504 surge. TraceMind searched Hindsight, identified 94% similarity with Incident #5, warned against pod restarts, and prescribed the 50-connection pool sizing.',
      whatLearned:
        'Recalled: SRE immediately applied the verified fix from PaymentService. Zero trial-and-error downtime.',
      retainedFact:
        'Strengthened cross-service association between OrderService and PaymentService database topologies.',
      metrics: 'MTTR reduced 92% to 3.2 minutes',
    },
    {
      id: 20,
      title: 'Incident #20: Multi-Service Pool Consolidation',
      subtitle: 'Systemic Intelligence · Autonomous Observation',
      stage: 'RECOGNIZED RECURRING PATTERN',
      service: 'SharedDatabaseLayer',
      mttr: '1.2 mins MTTR (Auto-Prevented)',
      tag: 'Synthesized Policy',
      badgeColor: 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.3)]',
      icon: Shield,
      description:
        'Hindsight automatically consolidated multiple pool exhaustion incidents into a systemic Observation Unit. Recommended automated Terraform & Helm baseline across all microservices before outages happen.',
      whatLearned:
        'Synthesized: Autonomous policy established. TraceMind proactively audits all new service manifests for Hikari pool sizing >= 50.',
      retainedFact:
        'Systemic pattern memory created. The AI shifted from reactive response to proactive architectural defense.',
      metrics: 'MTTR: 1.2m · Preventive policy auto-enforced',
    },
  ];

  const current = learningMilestones[selectedNode];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 uppercase">
            Evolution of Intelligence
          </span>
          <span className="text-slate-400 text-xs">· Persistent Learning Loop</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-1.5 font-sans">
          Memory Learning Timeline
        </h1>
        <p className="text-slate-400 text-xs mt-0.5">
          See how TraceMind's memory compounds over time: from zero-knowledge exploratory diagnosis, to instant historical recall, to proactive recurring pattern synthesis.
        </p>
      </div>

      {/* Compounding Learning Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-command flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-mono">RESOLUTION SPEEDUP</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              16.5x Faster
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              58 mins → 3.2 mins MTTR
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-command flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-mono">FAILED MISTAKES REPEATED</div>
            <div className="text-2xl font-bold font-mono text-amber-300 mt-1">
              0 Repeated
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              Blacklisted approaches enforced
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Shield className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-command flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-mono">CONSOLIDATED PATTERNS</div>
            <div className="text-2xl font-bold font-mono text-emerald-300 mt-1">
              Observation Net
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              Auto-synthesizes microservice rules
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Brain className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Interactive Horizontal Timeline Track */}
      <div className="p-6 rounded-2xl glass-command space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>PROGRESSIVE LEARNING PATHWAY</span>
          </span>
          <span className="text-xs text-slate-400 font-mono">Click any milestone node to inspect</span>
        </div>

        {/* The Timeline Track */}
        <div className="relative pt-6 pb-2">
          {/* Base track line */}
          <div className="absolute top-11 left-8 right-8 h-1 bg-white/[0.08] z-0 rounded-full" />
          {/* Animated beam progression line */}
          <div
            className="absolute top-11 left-8 h-1 bg-gradient-to-r from-amber-500 via-emerald-400 to-emerald-500 z-0 transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            style={{ width: `${(selectedNode / (learningMilestones.length - 1)) * 88}%` }}
          />

          {/* Nodes */}
          <div className="grid grid-cols-4 gap-2 relative z-10">
            {learningMilestones.map((m, idx) => {
              const Icon = m.icon;
              const isSelected = selectedNode === idx;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedNode(idx)}
                  className="flex flex-col items-center text-center group cursor-pointer"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                      isSelected
                        ? `btn-3d-gold scale-110 text-white shadow-[0_0_20px_rgba(245,158,11,0.5)]`
                        : `bg-[#0e141f] border-white/[0.1] text-slate-400 group-hover:border-emerald-500/50 group-hover:text-slate-200`
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="mt-3.5 space-y-1">
                    <span className="text-xs font-bold font-mono block text-white">
                      Incident #{m.id}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold block ${m.badgeColor}`}
                    >
                      {m.stage}
                    </span>
                    <span className="text-[11px] text-slate-400 hidden sm:block font-mono">
                      {m.mttr}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Milestone Detail Card */}
      <div className="glass-command-hero rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-500/30">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${current.badgeColor}`}>
                {current.stage}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Service: <strong className="text-slate-200">{current.service}</strong>
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-emerald-400 font-mono font-bold">{current.mttr}</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1.5 font-sans">
              {current.title}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {current.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2.5 py-1 rounded-xl bg-black/40 text-amber-300 border border-amber-500/40 font-bold">
              {current.tag}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-3">
            <div>
              <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider block">
                Incident Narrative
              </span>
              <p className="text-slate-300 leading-relaxed mt-1 font-sans text-xs">
                {current.description}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#060a10] border border-white/[0.08] text-[11px]">
              <span className="text-amber-300 font-bold font-mono flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-amber-400" />
                <span>Cognitive Evolution</span>
              </span>
              <p className="text-slate-300 mt-1 leading-relaxed font-sans">
                {current.whatLearned}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-[#060a10] border border-white/[0.08] text-[11px]">
              <span className="text-emerald-400 font-bold font-mono flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hindsight Memory Delta</span>
              </span>
              <p className="text-slate-300 mt-1 leading-relaxed font-mono">
                {current.retainedFact}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-[11px]">
              <span className="text-emerald-400 font-bold font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Measured Engineering Impact</span>
              </span>
              <p className="text-emerald-200 mt-1 font-mono font-semibold">
                {current.metrics}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
