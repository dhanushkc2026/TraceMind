import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  Search,
  Cpu,
  Layers,
  CheckCircle2,
  XCircle,
  Tag,
  ArrowRight,
  Shield,
  Activity,
  Loader2,
  Database,
  Radio,
} from 'lucide-react';
import { HindsightMemoryUnit, HindsightStats } from '../types';
import { api } from '../services/api';

interface MemoryBankViewProps {
  memories: HindsightMemoryUnit[];
  stats: HindsightStats | null;
}

export const MemoryBankView: React.FC<MemoryBankViewProps> = ({ memories, stats }) => {
  const [activeNetwork, setActiveNetwork] = useState<'all' | 'experience' | 'observation' | 'world'>('all');
  const [activeSourceFilter, setActiveSourceFilter] = useState<'all' | 'seed' | 'live'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Live recall tester state
  const [testQuery, setTestQuery] = useState('PaymentService Hikari connection timeout 504');
  const [testService, setTestService] = useState('PaymentService');
  const [isTestingRecall, setIsTestingRecall] = useState(false);
  const [recallTestResults, setRecallTestResults] = useState<{
    results: HindsightMemoryUnit[];
    maxSimilarity: number;
  } | null>(null);

  const filteredMemories = memories.filter((mem) => {
    const isSeed = mem.isDemoSeed || mem.id.includes('seed');
    const matchesSource =
      activeSourceFilter === 'all' ||
      (activeSourceFilter === 'seed' && isSeed) ||
      (activeSourceFilter === 'live' && !isSeed);

    const matchesNetwork =
      activeNetwork === 'all' || mem.type === activeNetwork;

    const matchesSearch =
      mem.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.rootCause.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSource && matchesNetwork && matchesSearch;
  });

  const handleRunRecallTest = async () => {
    setIsTestingRecall(true);
    try {
      const res = await api.testRecall({
        service: testService,
        query: testQuery,
        symptoms: ['504 Gateway Timeout', 'pool starvation'],
      });
      setRecallTestResults(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTestingRecall(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 uppercase">
            Hindsight Architecture
          </span>
          <span className="text-slate-400 text-xs">· Bank: {stats?.bankId || 'tracemind-sre-prod'}</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-1.5 font-sans">
          Hindsight Persistent Memory Bank
        </h1>
        <p className="text-slate-400 text-xs mt-0.5">
          Inspect stored memories across the Experience, Observation, and World networks. Run interactive recall tests against the live memory graph.
        </p>
      </div>

      {/* Network Overview Stat Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveNetwork('all')}
          className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
            activeNetwork === 'all'
              ? 'glass-command-hero'
              : 'glass-command hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] text-slate-400 font-mono">TOTAL UNITS</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {memories.length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-mono">All memory networks</div>
        </button>

        <button
          onClick={() => setActiveNetwork('experience')}
          className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
            activeNetwork === 'experience'
              ? 'glass-command-gold'
              : 'glass-command hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] text-slate-400 font-mono">EXPERIENCE NETWORK</div>
          <div className="text-2xl font-bold font-mono text-amber-300 mt-1">
            {memories.filter((m) => m.type === 'experience').length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-mono">First-person resolutions</div>
        </button>

        <button
          onClick={() => setActiveNetwork('observation')}
          className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
            activeNetwork === 'observation'
              ? 'glass-command-hero'
              : 'glass-command hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] text-slate-400 font-mono">OBSERVATION NETWORK</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {memories.filter((m) => m.type === 'observation').length}
          </div>
          <div className="text-[10px] text-emerald-400/80 mt-0.5 font-mono">Consolidated patterns</div>
        </button>

        <div className="p-4 rounded-2xl glass-command">
          <div className="text-[11px] text-slate-400 font-mono">DAEMON STATUS</div>
          <div className="text-sm font-bold font-mono text-emerald-300 mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
            <span>{stats?.hindsightClientStatus || 'ACTIVE'}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Vectorize SDK ready</div>
        </div>
      </div>

      {/* Live Hindsight Recall Simulator Component */}
      <div className="p-5 rounded-2xl glass-command-gold space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-white text-sm font-sans">Live Hindsight Recall Simulator</h3>
          </div>
          <span className="text-[10px] font-mono text-amber-300 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40">
            HYBRID 4-STRATEGY TEST
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-slate-300 font-medium font-mono text-[11px]">Service Name</label>
            <input
              type="text"
              value={testService}
              onChange={(e) => setTestService(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#090d14] border border-white/[0.1] text-white font-mono text-xs focus:outline-none focus:border-amber-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-slate-300 font-medium font-mono text-[11px]">Natural Language Error Query</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-[#090d14] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-amber-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
              />
              <button
                type="button"
                onClick={handleRunRecallTest}
                disabled={isTestingRecall}
                className="btn-3d-gold px-4 py-2 rounded-xl text-white font-semibold text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer font-mono"
              >
                {isTestingRecall ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Search className="w-3.5 h-3.5" />
                )}
                <span>Run Recall</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recall Test Results */}
        {recallTestResults && (
          <div className="p-3.5 rounded-xl bg-[#070a10] border border-amber-500/30 space-y-2 mt-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-amber-300 font-semibold">
                Recall Result: {recallTestResults.results.length} memories retrieved
              </span>
              <span className="text-amber-400 font-bold">
                Max Relevance: {recallTestResults.maxSimilarity}%
              </span>
            </div>

            <div className="space-y-2 pt-1">
              {recallTestResults.results.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-xl bg-[#0b0f17] border border-white/[0.08] flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono text-amber-300 font-semibold mr-2">{m.incidentId}</span>
                    <span className="text-slate-200 font-sans">{m.content}</span>
                  </div>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0 ml-3 font-bold">
                    {m.similarityScore}% match
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Memory Units List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter memory units by content, service, or tags..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#090d14] border border-white/[0.1] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>

            <div className="flex items-center gap-1 bg-[#090d14] p-1 rounded-xl border border-white/[0.08] text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setActiveSourceFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeSourceFilter === 'all'
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setActiveSourceFilter('seed')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeSourceFilter === 'seed'
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Demo Seed
              </button>
              <button
                type="button"
                onClick={() => setActiveSourceFilter('live')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeSourceFilter === 'live'
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Live Retained
              </button>
            </div>
          </div>

          <div className="text-slate-400 font-mono text-xs">
            Showing {filteredMemories.length} of {memories.length} memory units
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMemories.map((mem) => {
            const isSeed = mem.isDemoSeed || mem.id.includes('seed');
            return (
              <div
                key={mem.id}
                className={`p-5 rounded-2xl border space-y-3 shadow-md transition-all hover:translate-y-[-2px] ${
                  mem.type === 'observation'
                    ? 'glass-command-hero'
                    : isSeed
                    ? 'glass-command'
                    : 'glass-command-gold'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-amber-300 font-bold">{mem.incidentId}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        mem.type === 'observation'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-white/[0.05] text-slate-300 border border-white/[0.08]'
                      }`}
                    >
                      {mem.type} network
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold ${
                        isSeed
                          ? 'bg-amber-950/70 text-amber-300 border border-amber-800/60'
                          : 'bg-emerald-950/90 text-emerald-300 border border-emerald-700/80 animate-pulse'
                      }`}
                    >
                      {isSeed ? 'Demo Seed Data' : 'Live Retained Memory'}
                    </span>
                  </div>

                  <span className="font-mono text-slate-400 text-[11px] flex items-center gap-1.5">
                    <span>{mem.service}</span>
                    {mem.mttrMinutes && (
                      <span className="text-emerald-400 font-bold">· {mem.mttrMinutes}m MTTR</span>
                    )}
                  </span>
                </div>

                <p className="text-slate-200 text-xs leading-relaxed font-sans font-medium">
                  {mem.content}
                </p>

                <div className="p-3 rounded-xl bg-[#06080d] border border-white/[0.08] text-xs space-y-1.5">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">ROOT CAUSE</span>
                    <p className="text-slate-300 text-[11px]">{mem.rootCause}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-400 font-mono block">SUCCESSFUL RESOLUTION</span>
                    <p className="text-emerald-200 text-[11px] font-mono">{mem.successfulResolution}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {mem.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.04] text-slate-400 border border-white/[0.08]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
