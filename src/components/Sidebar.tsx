import React from 'react';
import {
  LayoutDashboard,
  Flame,
  Clock,
  BrainCircuit,
  BarChart3,
  Settings,
  Sparkles,
  Layers,
  RotateCcw,
  Shield,
  Zap,
  LogOut,
} from 'lucide-react';
import { HindsightStats, AuthUser } from '../types';

export type ActiveTab =
  | 'dashboard'
  | 'new-incident'
  | 'analysis'
  | 'timeline'
  | 'history'
  | 'memory'
  | 'analytics'
  | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  stats: HindsightStats | null;
  hasActiveIncident: boolean;
  onResetDemo: (mode: 'cold_demo' | 'warm_production') => void;
  currentUser?: AuthUser | null;
  onSignOut?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  stats,
  hasActiveIncident,
  onResetDemo,
  currentUser,
  onSignOut,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Command Dashboard', icon: LayoutDashboard },
    { id: 'new-incident', label: 'Trigger Incident', icon: Flame },
    {
      id: 'analysis',
      label: 'Incident Analysis',
      icon: BrainCircuit,
      highlight: hasActiveIncident,
    },
    { id: 'timeline', label: 'Memory Timeline', icon: Clock },
    { id: 'history', label: 'Incident History', icon: Layers },
    {
      id: 'memory',
      label: 'Hindsight Memory Bank',
      icon: Sparkles,
      count: stats?.totalMemories,
    },
    { id: 'analytics', label: 'SRE Analytics', icon: BarChart3 },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0a0d14]/95 border-r border-white/[0.08] flex flex-col justify-between h-screen select-none shrink-0 shadow-[10px_0_30px_rgba(0,0,0,0.6)] backdrop-blur-xl z-20">
      <div>
        {/* Brand Header with Glowing Emerald/Gold 3D Core */}
        <div className="p-5 border-b border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent">
          <div className="flex items-center gap-3">
            {/* 3D Glowing Core */}
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-800 to-slate-950 p-[1px] shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center justify-center">
              <div className="w-full h-full rounded-xl bg-[#090e15] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-radial from-amber-400/20 via-transparent to-transparent opacity-60" />
                <BrainCircuit className="w-5 h-5 text-emerald-400 relative z-10" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white font-sans">
                  Trace<span className="text-emerald-400">Mind</span>
                </span>
                <span className="text-[9px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-400/30 text-amber-300">
                  AI SRE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight">
                Hindsight Memory Engine
              </p>
            </div>
          </div>
        </div>

        {/* Hindsight Status Bar */}
        <div className="mx-3.5 my-3 p-3 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-900/60 border border-emerald-500/20 shadow-[0_4px_15px_rgba(0,0,0,0.4)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
            </span>
            <span className="text-slate-200 font-medium font-mono text-[11px]">
              Memory Core
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            {stats?.hindsightClientStatus === 'CONNECTED' ? 'DAEMON LIVE' : 'EMBEDDED ACTIVE'}
          </span>
        </div>

        {/* Navigation Items with 3D Tactile Indicators */}
        <nav className="px-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as ActiveTab)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-950/70 to-slate-900/80 text-white border border-emerald-500/40 shadow-[0_4px_15px_rgba(16,185,129,0.15)] font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1 rounded-lg transition-colors ${
                    isActive ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </div>

                {item.count !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isActive 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.count}
                  </span>
                )}

                {item.highlight && !isActive && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 shadow-[0_0_8px_#f59e0b]"></span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / User Profile & Demo Mode Reset Controls */}
      <div className="p-3.5 border-t border-white/[0.06] space-y-2 bg-[#080b11]/90">
        {currentUser && (
          <div className="p-2 rounded-xl bg-[#090d14] border border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-[10px] shrink-0 font-mono">
                {currentUser.name.charAt(0)}
              </div>
              <div className="truncate">
                <span className="text-[11px] font-bold text-white block truncate leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[9px] font-mono text-emerald-400 block truncate">
                  {currentUser.role}
                </span>
              </div>
            </div>
            {onSignOut && (
              <button
                onClick={onSignOut}
                title="Sign Out / Return to Login Page"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        <div className="text-[10px] font-mono text-slate-400 px-1 flex items-center justify-between">
          <span className="tracking-wider uppercase">Memory State Reset</span>
          <RotateCcw className="w-3 h-3 text-slate-400" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onResetDemo('cold_demo')}
            title="Wipes pool memory to simulate initial cold start"
            className="btn-3d-graphite py-1.5 px-2 rounded-lg text-[11px] font-mono font-semibold text-amber-300/90 text-center cursor-pointer"
          >
            ❄️ Cold Start
          </button>
          <button
            onClick={() => onResetDemo('warm_production')}
            title="Injects PaymentService memory for instant warm recall"
            className="btn-3d-graphite py-1.5 px-2 rounded-lg text-[11px] font-mono font-semibold text-emerald-400 text-center cursor-pointer"
          >
            🔥 Warm Mode
          </button>
        </div>
      </div>
    </aside>
  );
};
