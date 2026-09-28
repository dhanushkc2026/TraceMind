import React, { useState, useEffect } from 'react';
import {
  Flame,
  Terminal,
  Sparkles,
  AlertCircle,
  Tag,
  Zap,
  Loader2,
  FileCode,
  Brain,
  Snowflake,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { IncidentSeverity } from '../types';

interface NewIncidentViewProps {
  onAnalyze: (payload: {
    title: string;
    service: string;
    severity: IncidentSeverity;
    errorMessage: string;
    logs: string;
    symptoms: string[];
  }) => Promise<any>;
  isLoading: boolean;
  initialPreset?: 'cold_db' | 'warm_db' | null;
}

export const NewIncidentView: React.FC<NewIncidentViewProps> = ({
  onAnalyze,
  isLoading,
  initialPreset,
}) => {
  const [title, setTitle] = useState(
    'PaymentService - Database Connection Pool Exhaustion on Checkout Flow'
  );
  const [service, setService] = useState('PaymentService');
  const [severity, setSeverity] = useState<IncidentSeverity>('CRITICAL');
  const [errorMessage, setErrorMessage] = useState(
    'java.sql.SQLTransientConnectionException: HikariPool-1 - Connection is not available, request timed out after 30000ms.'
  );
  const [logs, setLogs] = useState(
    `2026-09-28 09:14:58 ERROR [PaymentController] - Failed to acquire DB connection from pool
java.sql.SQLTransientConnectionException: HikariPool-1 - Connection is not available, request timed out after 30000ms.
    at com.zaxxer.hikari.pool.HikariPool.createTimeoutException(HikariPool.java:696)
    at com.zaxxer.hikari.pool.HikariPool.getConnection(HikariPool.java:197)
    at com.zaxxer.hikari.pool.HikariPool.getConnection(HikariPool.java:162)
2026-09-28 09:15:01 WARN [HikariPool-1] - Pool stats: total=10, active=10, idle=0, waiting=120
2026-09-28 09:15:04 ERROR [TransactionManager] - Rollback transaction failed due to connection failure`
  );
  const [symptomsInput, setSymptomsInput] = useState(
    '504 Gateway Timeouts, 120 blocked worker threads, HikariPool starvation on checkout API'
  );

  // Sync state whenever initialPreset prop changes
  useEffect(() => {
    if (initialPreset === 'cold_db') {
      setTitle('PaymentService - Database Connection Pool Exhaustion on Checkout Flow');
      setService('PaymentService');
      setSeverity('CRITICAL');
      setErrorMessage(
        'java.sql.SQLTransientConnectionException: HikariPool-1 - Connection is not available, request timed out after 30000ms.'
      );
      setLogs(
`2026-09-28 09:14:58 ERROR [PaymentController] - Failed to acquire DB connection from pool
java.sql.SQLTransientConnectionException: HikariPool-1 - Connection is not available, request timed out after 30000ms.
    at com.zaxxer.hikari.pool.HikariPool.createTimeoutException(HikariPool.java:696)
    at com.zaxxer.hikari.pool.HikariPool.getConnection(HikariPool.java:197)
2026-09-28 09:15:01 WARN [HikariPool-1] - Pool stats: total=10, active=10, idle=0, waiting=120
2026-09-28 09:15:04 ERROR [TransactionManager] - Rollback transaction failed due to connection failure`
      );
      setSymptomsInput(
        '504 Gateway Timeouts, 120 blocked worker threads, HikariPool starvation on checkout API'
      );
    } else if (initialPreset === 'warm_db') {
      setTitle('OrderService 504 Gateway Timeout during Checkout Surge');
      setService('OrderService');
      setSeverity('CRITICAL');
      setErrorMessage(
        'java.sql.SQLTransientConnectionException: HikariPool-1 - Connection is not available, request timed out after 30002ms.'
      );
      setLogs(
`2026-09-28 11:20:14 ERROR [OrderController] - Failed to acquire DB connection from pool
java.sql.SQLTransientConnectionException: HikariPool-1 - Connection is not available, request timed out after 30002ms.
    at com.zaxxer.hikari.pool.HikariPool.createTimeoutException(HikariPool.java:696)
2026-09-28 11:20:17 WARN [HikariPool-1] - Pool stats: total=10, active=10, idle=0, waiting=142
2026-09-28 11:20:20 ERROR [TransactionManager] - Rollback transaction failed due to connection failure`
      );
      setSymptomsInput(
        '504 Gateway Timeouts, 142 blocked worker threads, 30s latency spike on checkout API'
      );
    }
  }, [initialPreset]);

  const presets = [
    {
      name: '❄️ Cold Start: PaymentService DB Timeout',
      badge: '0 MEMORY (COLD)',
      service: 'PaymentService',
      title: 'PaymentService - Database Connection Pool Exhaustion on Checkout Flow',
      severity: 'CRITICAL' as IncidentSeverity,
      errorMessage:
        'java.sql.SQLTransientConnectionException: HikariPool-1 - Connection is not available, request timed out after 30000ms.',
      logs: `2026-09-28 09:14:58 ERROR [PaymentController] - Failed to acquire DB connection from pool
java.sql.SQLTransientConnectionException: HikariPool-1 - Connection is not available, request timed out after 30000ms.
    at com.zaxxer.hikari.pool.HikariPool.createTimeoutException(HikariPool.java:696)
2026-09-28 09:15:01 WARN [HikariPool-1] - Pool stats: total=10, active=10, idle=0, waiting=120`,
      symptoms:
        '504 Gateway Timeouts, 120 blocked worker threads, HikariPool starvation on checkout API',
    },
    {
      name: '🔥 Warm Recall: OrderService DB Timeout',
      badge: 'RECALL 94% MATCH',
      service: 'OrderService',
      title: 'OrderService 504 Gateway Timeout during Checkout Surge',
      severity: 'CRITICAL' as IncidentSeverity,
      errorMessage:
        'java.sql.SQLTransientConnectionException: HikariPool-1 - Connection is not available, request timed out after 30002ms.',
      logs: `2026-09-28 11:20:14 ERROR [OrderController] - Failed to acquire DB connection from pool
java.sql.SQLTransientConnectionException: HikariPool-1 - Connection is not available, request timed out after 30002ms.
    at com.zaxxer.hikari.pool.HikariPool.createTimeoutException(HikariPool.java:696)
2026-09-28 11:20:17 WARN [HikariPool-1] - Pool stats: total=10, active=10, idle=0, waiting=142`,
      symptoms:
        '504 Gateway Timeouts, 142 blocked worker threads, 30s latency spike on checkout API',
    },
    {
      name: '🔑 Auth JWT Secret Mismatch',
      badge: 'PRE-SEEDED PRECEDENT',
      service: 'AuthService',
      title: 'Global 401 Unauthorized Cascade after Secret Rotation',
      severity: 'HIGH' as IncidentSeverity,
      errorMessage:
        'SignatureVerificationException: Signature length not correct or secret key invalid',
      logs: `2026-09-28 14:21:40 WARN [TokenVerifier] Invalid JWT signature received for sub=usr_88291
2026-09-28 14:22:05 ERROR [AuthFilter] 401 Unauthorized spike: 2,120 failures in 60s`,
      symptoms:
        'Sudden logout of all active mobile and web users, 401 response cascade',
    },
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setTitle(p.title);
    setService(p.service);
    setSeverity(p.severity);
    setErrorMessage(p.errorMessage);
    setLogs(p.logs);
    setSymptomsInput(p.symptoms);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !service || !errorMessage) return;

    const symptomsList = symptomsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    await onAnalyze({
      title,
      service,
      severity,
      errorMessage,
      logs,
      symptoms: symptomsList,
    });
  };

  const isColdTest = service === 'PaymentService';

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 uppercase">
            Active Incident Triage
          </span>
          <span className="text-slate-400 text-xs">· Grounded on Hindsight Memory</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-1.5 font-sans">
          Trigger Incident Analysis
        </h1>
        <p className="text-slate-400 text-xs mt-0.5">
          Enter live incident telemetry. TraceMind cross-references Hindsight persistent memory to identify matching historical root causes and battle-tested fixes.
        </p>
      </div>

      {/* Mode Callout Banner */}
      {isColdTest ? (
        <div className="p-4 rounded-2xl glass-command-gold flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-600/60 flex items-center justify-center shrink-0 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
            <Snowflake className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-xs">
            <div className="font-bold text-amber-300 font-mono flex items-center gap-2">
              <span>TRUE COLD START MODE ACTIVE (0 MEMORIES IN HINDSIGHT)</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 text-[10px] font-bold border border-amber-500/40">
                Incident #1
              </span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed font-sans">
              TraceMind has <strong>ZERO historical precedents</strong> for database connection pool exhaustion in its persistent memory bank. When you click Analyze, TraceMind will perform independent <strong>first-principles SRE reasoning</strong> (MTTR: 38m). After confirming the fix, it will be retained into Hindsight for future incidents.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl glass-command-hero flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-600/60 flex items-center justify-center shrink-0 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-xs">
            <div className="font-bold text-emerald-300 font-mono flex items-center gap-2">
              <span>WARM HINDSIGHT RECALL MODE (PRECEDENT MATCH)</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-[10px] font-bold border border-emerald-500/40">
                Incident #2
              </span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed font-sans">
              OrderService is experiencing the exact same Hikari connection starvation. TraceMind will query Hindsight, recall the PaymentService precedent with ~94% relevance, warn against restarting pods, and prescribe the proven pool fix (MTTR: 3.2m).
            </p>
          </div>
        </div>
      )}

      {/* Preset Selector */}
      <div className="p-4 rounded-2xl glass-command space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-semibold font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Hackathon Benchmark Presets</span>
          </span>
          <span className="text-[11px] text-emerald-400 font-mono">1-Click Telemetry Pre-fill</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="p-3 rounded-xl bg-[#090d14] hover:bg-[#0f1522] text-left border border-white/[0.08] hover:border-emerald-500/50 transition-all text-xs group cursor-pointer shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 group-hover:text-amber-300 transition-colors">
                  {p.name}
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-1.5 font-mono text-[10px] text-emerald-400">
                <span className="px-1.5 py-0.5 rounded bg-black/40 border border-white/[0.08]">
                  {p.badge}
                </span>
                <span className="text-slate-400">· {p.service}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Incident Input Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider text-[11px]">
              Incident Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d14] border border-white/[0.1] text-white text-xs font-medium focus:outline-none focus:border-emerald-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider text-[11px]">
              Affected Microservice
            </label>
            <input
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d14] border border-white/[0.1] text-white text-xs font-mono font-medium focus:outline-none focus:border-amber-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider text-[11px]">
              Severity
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d14] border border-white/[0.1] text-white text-xs font-mono focus:outline-none focus:border-emerald-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
            >
              <option value="CRITICAL">CRITICAL (P0 - Service Down)</option>
              <option value="HIGH">HIGH (P1 - Core Flow Degraded)</option>
              <option value="MEDIUM">MEDIUM (P2 - Partial Impact)</option>
              <option value="LOW">LOW (P3 - Minor Issue)</option>
            </select>
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider text-[11px]">
              Observed Symptoms (Comma-separated)
            </label>
            <input
              type="text"
              value={symptomsInput}
              onChange={(e) => setSymptomsInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d14] border border-white/[0.1] text-white text-xs font-mono focus:outline-none focus:border-emerald-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider text-[11px] flex items-center justify-between">
            <span>Primary Error Message / Exception Signature</span>
            <span className="text-[10px] text-slate-500 font-mono lowercase">
              (Primary indexing key for Hindsight Recall)
            </span>
          </label>
          <input
            type="text"
            value={errorMessage}
            onChange={(e) => setErrorMessage(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d14] border border-white/[0.1] text-rose-300 text-xs font-mono focus:outline-none focus:border-rose-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider text-[11px] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Production Logs & Stacktrace</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono lowercase">
              (Fed to Gemini SRE reasoning engine)
            </span>
          </label>
          <textarea
            rows={7}
            value={logs}
            onChange={(e) => setLogs(e.target.value)}
            className="w-full p-3.5 rounded-xl bg-[#06080d] border border-white/[0.1] text-slate-300 text-xs font-mono leading-relaxed focus:outline-none focus:border-emerald-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
          />
        </div>

        <div className="pt-2 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
            <Brain className="w-4 h-4 text-emerald-400" />
            <span>
              {isColdTest ? 'Analyzing with 0 memories (Cold Start)' : 'Querying Hindsight Persistent Memory'}
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-3d-emerald px-6 py-3 rounded-xl text-white font-bold font-mono text-xs shadow-xl flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running Hindsight SRE Agent...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Analyze Incident</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
