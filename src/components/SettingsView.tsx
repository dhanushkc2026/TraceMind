import React, { useState } from 'react';
import {
  Settings,
  Sparkles,
  Server,
  Key,
  Shield,
  RotateCcw,
  CheckCircle2,
  Cpu,
  Layers,
  Terminal,
  Loader2,
  Brain,
  Snowflake,
} from 'lucide-react';
import { HindsightStats } from '../types';

interface SettingsViewProps {
  stats: HindsightStats | null;
  onResetDemo: (mode: 'cold_demo' | 'warm_production') => void;
  isResetting: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  stats,
  onResetDemo,
  isResetting,
}) => {
  const [bankId, setBankId] = useState(stats?.bankId || 'tracemind-sre-prod');
  const [hindsightBaseUrl, setHindsightBaseUrl] = useState('http://localhost:8888');

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 uppercase">
            Platform Configuration
          </span>
          <span className="text-slate-400 text-xs">· SRE Agent Infrastructure</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-1.5 font-sans">
          TraceMind Engine Settings & Diagnostics
        </h1>
        <p className="text-slate-400 text-xs mt-0.5">
          Configure Hindsight persistent memory connectivity, manage memory banks, and test hackathon demo scenarios.
        </p>
      </div>

      {/* Demo Scenario Controller */}
      <div className="p-6 rounded-2xl glass-command-gold space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base font-sans">
              Hackathon Demonstration State Switcher
            </h3>
          </div>
          <span className="text-[10px] font-mono text-amber-300 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 font-bold">
            DEMO PRESET
          </span>
        </div>

        <p className="text-slate-300 text-xs leading-relaxed max-w-2xl font-sans">
          Instantly simulate the difference between an agent without historical memory and an agent with accumulated Hindsight memory:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Cold State Button */}
          <div className="p-4 rounded-xl bg-[#090d14] border border-amber-600/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300 text-xs flex items-center gap-1.5 font-mono">
                <Snowflake className="w-4 h-4 text-amber-400" />
                <span>Interaction 1: Cold Memory</span>
              </span>
              <span className="text-[10px] font-mono text-amber-400 font-bold">0 Pool Precedents</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
              Clears database timeout memories. TraceMind performs a fresh first-principles analysis. You confirm the resolution to teach the agent!
            </p>
            <button
              onClick={() => onResetDemo('cold_demo')}
              disabled={isResetting}
              className="btn-3d-gold w-full py-2.5 px-3 rounded-xl text-white text-xs font-bold font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {isResetting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RotateCcw className="w-3.5 h-3.5" />
              )}
              <span>Switch to Cold Memory</span>
            </button>
          </div>

          {/* Warm State Button */}
          <div className="p-4 rounded-xl bg-[#090d14] border border-emerald-500/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-300 text-xs flex items-center gap-1.5 font-mono">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Interaction 2: Warm Memory</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">Production Ready</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
              Restores accumulated Hindsight memories. TraceMind instantly recalls past precedents, warns against repeating failed pod restarts, and prescribes verified fixes.
            </p>
            <button
              onClick={() => onResetDemo('warm_production')}
              disabled={isResetting}
              className="btn-3d-emerald w-full py-2.5 px-3 rounded-xl text-white text-xs font-bold font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {isResetting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              <span>Switch to Warm Memory</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hindsight Settings */}
      <div className="p-6 rounded-2xl glass-command space-y-5 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-white text-sm font-sans">Hindsight Persistent Memory Layer</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded font-mono text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/60 font-bold">
            {stats?.hindsightClientStatus === 'CONNECTED' ? 'REMOTE DAEMON ACTIVE' : 'EMBEDDED ENGINE ACTIVE'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 font-mono text-[11px]">Hindsight Memory Bank ID</label>
            <input
              type="text"
              value={bankId}
              onChange={(e) => setBankId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#090d14] border border-white/[0.1] text-slate-200 font-mono text-xs focus:outline-none focus:border-emerald-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 font-mono text-[11px]">Hindsight Host Endpoint</label>
            <input
              type="text"
              value={hindsightBaseUrl}
              onChange={(e) => setHindsightBaseUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#090d14] border border-white/[0.1] text-slate-200 font-mono text-xs focus:outline-none focus:border-emerald-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
