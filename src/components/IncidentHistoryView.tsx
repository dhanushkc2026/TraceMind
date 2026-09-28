import React, { useState } from 'react';
import {
  Search,
  Filter,
  Layers,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { Incident } from '../types';

interface IncidentHistoryViewProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
}

export const IncidentHistoryView: React.FC<IncidentHistoryViewProps> = ({
  incidents,
  onSelectIncident,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('ALL');
  const [selectedOutcome, setSelectedOutcome] = useState('ALL');

  const services = Array.from(new Set(incidents.map((i) => i.service)));

  const filtered = incidents.filter((inc) => {
    const matchesSearch =
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.errorMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inc.rootCause && inc.rootCause.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inc.successfulResolution &&
        inc.successfulResolution.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesService =
      selectedService === 'ALL' || inc.service.toLowerCase() === selectedService.toLowerCase();

    const matchesOutcome =
      selectedOutcome === 'ALL' ||
      (selectedOutcome === 'RESOLVED' && inc.status === 'RESOLVED') ||
      (selectedOutcome === 'INVESTIGATING' && inc.status !== 'RESOLVED');

    return matchesSearch && matchesService && matchesOutcome;
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 uppercase">
            Production Records
          </span>
          <span className="text-slate-400 text-xs">· Retained in Hindsight</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-1.5 font-sans">
          Incident History & Post-Mortem Archive
        </h1>
        <p className="text-slate-400 text-xs mt-0.5">
          Search all historical production incidents, verified root causes, effective resolutions, and team feedback.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-2xl glass-command flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by service, error, root cause, resolution, or ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#090d14] border border-white/[0.1] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#090d14] border border-white/[0.1] text-slate-300 focus:outline-none focus:border-emerald-500 font-mono text-xs"
          >
            <option value="ALL">All Services ({services.length})</option>
            {services.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={selectedOutcome}
            onChange={(e) => setSelectedOutcome(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#090d14] border border-white/[0.1] text-slate-300 focus:outline-none focus:border-emerald-500 text-xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="RESOLVED">Resolved Only</option>
            <option value="INVESTIGATING">Active / Investigating</option>
          </select>
        </div>
      </div>

      {/* Incident List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl glass-command space-y-2">
            <Layers className="w-8 h-8 text-slate-600 mx-auto" />
            <div className="text-slate-300 font-semibold text-sm">No incidents match filters</div>
            <p className="text-slate-500 text-xs">
              Try adjusting your search query or reset the service filter.
            </p>
          </div>
        ) : (
          filtered.map((inc) => (
            <div
              key={inc.id}
              onClick={() => onSelectIncident(inc)}
              className="p-5 rounded-2xl glass-command hover:border-emerald-500/40 transition-all cursor-pointer space-y-3 group shadow-md hover:translate-y-[-1px]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-amber-300 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    {inc.id}
                  </span>
                  <h3 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                    {inc.title}
                  </h3>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
                      inc.severity === 'CRITICAL'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800/70'
                        : 'bg-amber-950 text-amber-300 border border-amber-800/70'
                    }`}
                  >
                    {inc.severity}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold ${
                      inc.isDemoSeed
                        ? 'bg-amber-950/70 text-amber-300 border border-amber-800/60'
                        : 'bg-emerald-950/90 text-emerald-300 border border-emerald-700/80 animate-pulse'
                    }`}
                  >
                    {inc.isDemoSeed ? 'Demo Seed Data' : 'Live Retained'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  {inc.mttrMinutes && (
                    <span className="text-emerald-400 font-bold">
                      {inc.mttrMinutes}m MTTR
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(inc.timestamp).toLocaleDateString()}</span>
                  </span>
                  <span
                    className={`flex items-center gap-1 font-semibold ${
                      inc.status === 'RESOLVED' ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {inc.status === 'RESOLVED' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span>{inc.status}</span>
                  </span>
                </div>
              </div>

              {/* Service & Error */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 block font-mono">SERVICE</span>
                  <span className="font-mono text-slate-200 font-semibold">{inc.service}</span>
                </div>

                <div className="md:col-span-2">
                  <span className="text-[11px] text-slate-400 block font-mono">ERROR SIGNATURE</span>
                  <span className="font-mono text-rose-300 line-clamp-1">{inc.errorMessage}</span>
                </div>
              </div>

              {/* Root Cause & Resolution Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-white/[0.06] text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 font-mono block">ROOT CAUSE</span>
                  <p className="text-slate-300 line-clamp-2 mt-0.5 font-sans">
                    {inc.rootCause || inc.analysis?.likelyRootCause || 'Investigating underlying cause.'}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] text-emerald-400 font-mono font-bold block flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>VERIFIED RESOLUTION</span>
                  </span>
                  <p className="text-emerald-200 font-mono text-[11px] line-clamp-2 mt-0.5">
                    {inc.successfulResolution ||
                      inc.resolutionAttempted ||
                      inc.analysis?.recommendedAction ||
                      'Pending resolution confirmation.'}
                  </p>
                </div>
              </div>

              {/* Footer row: Hindsight tag badge */}
              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  {inc.hindsightMemoryId && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg font-mono text-[10px] bg-black/40 text-amber-300 border border-white/[0.08]">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Hindsight Ref: {inc.hindsightMemoryId}</span>
                    </span>
                  )}
                  {inc.runbookUsed && (
                    <span className="font-mono text-slate-400 hidden sm:inline">
                      Runbook: {inc.runbookUsed}
                    </span>
                  )}
                </div>

                <span className="text-emerald-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-mono text-[11px]">
                  <span>Open Full Triage</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
