import React, { useState } from 'react';
import {
  Brain,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Zap,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { MemoryCore3D } from './auth/MemoryCore3D';
import { authService } from '../services/auth-service';
import { AuthUser, ValidationErrors } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('sre-lead@cloudcorp.internal');
  const [password, setPassword] = useState('ProductionSRE@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authStepMessage, setAuthStepMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [authSuccessNotice, setAuthSuccessNotice] = useState<string | null>(null);

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);
    setAuthStepMessage('Verifying credentials...');

    try {
      const result = await authService.authenticate({
        email,
        password,
      });

      if (result.success && result.user) {
        setAuthSuccessNotice(`Welcome back, ${result.user.name}. Redirecting to Command Center...`);
        setTimeout(() => {
          onLoginSuccess(result.user!);
        }, 600);
      } else {
        setErrors(result.validationErrors || { general: result.error || 'Authentication failed.' });
        setIsLoading(false);
        setAuthStepMessage(null);
      }
    } catch {
      setErrors({ general: 'Connection error during authentication. Please retry or use Demo Access.' });
      setIsLoading(false);
      setAuthStepMessage(null);
    }
  };

  // Demo Environment Access handler
  const handleDemoAccess = async () => {
    setErrors({});
    setIsLoading(true);
    setAuthStepMessage('Initializing Demo Environment...');

    try {
      const result = await authService.authenticate({
        email: '',
        isDemoAccess: true,
      });

      if (result.success && result.user) {
        setAuthSuccessNotice('Demo Environment ready. Connecting to Hindsight Memory...');
        setTimeout(() => {
          onLoginSuccess(result.user!);
        }, 500);
      }
    } catch {
      setErrors({ general: 'Could not initialize demo environment.' });
      setIsLoading(false);
      setAuthStepMessage(null);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#080a0f] text-slate-100 font-sans overflow-x-hidden selection:bg-emerald-500/30">
      {/* Clean, Simple Header */}
      <header className="w-full h-16 shrink-0 px-6 sm:px-8 flex items-center justify-between border-b border-white/[0.08] bg-[#07090e]/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-400 p-[1.5px] shadow-[0_0_15px_rgba(16,185,129,0.25)]">
            <div className="w-full h-full bg-[#080a0f] rounded-[10px] flex items-center justify-center">
              <Brain className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-base font-extrabold text-white tracking-tight font-sans">
              Trace<span className="text-emerald-400">Mind</span> <span className="text-slate-300 font-semibold">SRE</span>
            </span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
              Hindsight Persistent Memory
            </span>
          </div>
        </div>
      </header>

      {/* Main Viewport Container */}
      <main className="flex-1 min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: TraceMind Explanation & 3D Memory-Core Behind Content */}
          <div className="relative lg:col-span-6 xl:col-span-7 space-y-6">
            {/* 3D Visual placed behind the left content with reduced opacity */}
            <div className="absolute -inset-4 sm:-inset-8 pointer-events-none overflow-hidden select-none -z-10 opacity-35">
              <MemoryCore3D />
            </div>

            <div className="space-y-3 relative z-10">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                TraceMind SRE
              </h1>
              <p className="text-base sm:text-lg text-amber-300 font-mono font-medium">
                “Your production history becomes your AI’s experience.”
              </p>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-sans relative z-10">
              TraceMind uses Hindsight persistent memory to retain verified incident knowledge and reuse proven resolutions during future outages.
            </p>

            {/* Three Capability Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 relative z-10">
              <div className="p-3.5 rounded-xl bg-[#090d14]/80 border border-emerald-500/30 text-center space-y-1 backdrop-blur-sm shadow-sm">
                <span className="text-[11px] font-mono font-bold text-emerald-400 block tracking-wide">
                  PERSISTENT MEMORY
                </span>
                <span className="text-xs text-slate-400 block leading-snug">
                  Retains verified fixes
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#090d14]/80 border border-amber-500/30 text-center space-y-1 backdrop-blur-sm shadow-sm">
                <span className="text-[11px] font-mono font-bold text-amber-300 block tracking-wide">
                  INCIDENT LEARNING
                </span>
                <span className="text-xs text-slate-400 block leading-snug">
                  Learns from resolved incidents
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#090d14]/80 border border-white/[0.1] text-center space-y-1 backdrop-blur-sm shadow-sm">
                <span className="text-[11px] font-mono font-bold text-white block tracking-wide">
                  AI-GROUNDED SRE
                </span>
                <span className="text-xs text-slate-400 block leading-snug">
                  Reuses proven operational knowledge
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Responsive Login Card */}
          <div className="lg:col-span-6 xl:col-span-5 w-full max-w-md mx-auto">
            <div className="glass-command-hero rounded-2xl sm:rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)] border border-emerald-500/30">
              {/* Top ambient specular line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

              {/* Login Card Header */}
              <div className="pb-4 border-b border-white/[0.08]">
                <h2 className="text-lg font-bold text-white font-sans tracking-tight">
                  Cluster Authentication
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Sign in to TraceMind Command Center
                </p>
              </div>

              {/* Success Notification */}
              {authSuccessNotice && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mt-4 p-3 rounded-xl bg-emerald-950/90 border border-emerald-400/80 text-emerald-200 text-xs font-mono flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-in fade-in duration-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{authSuccessNotice}</span>
                </div>
              )}

              {/* General Error Banner */}
              {errors.general && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs font-mono flex items-start gap-2 shadow-inner"
                >
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{errors.general}</span>
                </div>
              )}

              {/* Authentication Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-4 mt-5">
                {/* Work Email Field */}
                <div className="space-y-1.5 text-left">
                  <label
                    htmlFor="work-email"
                    className="block text-xs font-mono font-medium text-slate-300"
                  >
                    Work Email <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="work-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      disabled={isLoading}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      placeholder="sre-lead@enterprise.com"
                      aria-required="true"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#090d14] border text-xs text-white placeholder-slate-500 transition-all font-mono focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${
                        errors.email
                          ? 'border-rose-500 bg-rose-950/20'
                          : 'border-white/[0.1] hover:border-emerald-500/40 focus:border-emerald-400'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p id="email-error" role="alert" className="text-[11px] text-rose-400 font-mono flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="work-password"
                      className="block text-xs font-mono font-medium text-slate-300"
                    >
                      Password <span className="text-rose-400">*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="work-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      disabled={isLoading}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                      }}
                      placeholder="Enter cluster password"
                      aria-required="true"
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={errors.password ? 'password-error' : undefined}
                      className={`w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#090d14] border text-xs text-white placeholder-slate-500 transition-all font-mono focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${
                        errors.password
                          ? 'border-rose-500 bg-rose-950/20'
                          : 'border-white/[0.1] hover:border-emerald-500/40 focus:border-emerald-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      aria-pressed={showPassword}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p id="password-error" role="alert" className="text-[11px] text-rose-400 font-mono flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.password}</span>
                    </p>
                  )}
                </div>

                {/* Loading state indicator */}
                {isLoading && authStepMessage && (
                  <div className="p-2.5 rounded-xl bg-[#070a10] border border-emerald-500/30 flex items-center gap-2.5 text-xs font-mono text-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                    <span className="text-[11px] truncate">{authStepMessage}</span>
                  </div>
                )}

                {/* Sign in to Cluster button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-3d-emerald w-full py-2.5 px-4 rounded-xl text-white font-mono text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{isLoading ? 'Verifying Identity...' : 'Sign in to Cluster'}</span>
                  {!isLoading && <ArrowRight className="w-4 h-4 text-emerald-200" />}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="w-full border-t border-white/[0.08]" />
                <span className="absolute bg-[#0b1219] px-2.5 text-[10px] font-mono text-slate-400 lowercase">
                  or
                </span>
              </div>

              {/* Launch Demo Environment button */}
              <button
                type="button"
                onClick={handleDemoAccess}
                disabled={isLoading}
                className="btn-3d-gold w-full py-2.5 px-4 rounded-xl text-white font-mono text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_15px_rgba(245,158,11,0.2)] disabled:opacity-50"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Launch Demo Environment</span>
              </button>

              {/* Security Note */}
              <div className="mt-4 pt-3 border-t border-white/[0.06] text-center">
                <p className="text-[10px] font-mono text-slate-400">
                  Demo authentication • No real credentials required
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
