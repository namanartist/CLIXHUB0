import React, { Component, ReactNode, ErrorInfo } from 'react';
import { RefreshCw, Home, Copy, Check, Terminal, ShieldAlert } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
  showTrace: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  // @ts-ignore
  state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    copied: false,
    showTrace: false,
  };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  // @ts-ignore
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[CLIX Error Boundary] Caught error:', error, errorInfo);
    (this as any).setState({ errorInfo });
  }

  handleCopyError = () => {
    const errorText = `[CLIX Hub Error Report]\nMessage: ${this.state.error?.message || 'Unknown Error'}\nStack:\n${this.state.error?.stack || 'No stack trace'}\nComponent Stack:\n${this.state.errorInfo?.componentStack || 'No component stack'}`;
    navigator.clipboard.writeText(errorText);
    (this as any).setState({ copied: true });
    setTimeout(() => {
      (this as any).setState({ copied: false });
    }, 2500);
  };

  handleResetSession = () => {
    try {
      localStorage.removeItem('clix_theme');
      sessionStorage.clear();
      window.location.href = '/';
    } catch {
      window.location.reload();
    }
  };

  // @ts-ignore
  render() {
    const { hasError, error, errorInfo, copied, showTrace } = (this as any).state as State;
    const { fallback, children } = (this as any).props as Props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#030712] text-slate-100 font-sans">
          <div className="w-full max-w-xl rounded-3xl border border-rose-500/20 bg-[#090e1c]/95 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-rose-950/40 space-y-6 animate-in zoom-in-95">
            {/* Header with Alert Icon */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/10">
                <ShieldAlert size={26} />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/25 text-rose-300 text-[10px] font-black uppercase tracking-wider">
                  Runtime Problem Detected
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Application Encountered an Issue
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
                  CLIX Hub captured a runtime exception before it could destabilize your session.
                </p>
              </div>
            </div>

            {/* Error Message Box */}
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.06] p-4 space-y-2">
              <p className="text-[11px] font-black uppercase tracking-widest text-rose-400">
                Error Cause
              </p>
              <p className="text-sm font-semibold text-rose-100 font-mono break-words leading-snug">
                {error?.message || 'An unexpected runtime state error occurred.'}
              </p>
            </div>

            {/* Diagnostic Trace Toggle */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => (this as any).setState({ showTrace: !showTrace })}
                className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
              >
                <Terminal size={14} className="text-blue-400" />
                {showTrace ? 'Hide Technical Diagnostics' : 'Show Technical Diagnostics & Stack'}
              </button>

              {showTrace && (
                <div className="rounded-xl border border-white/10 bg-black/70 p-3 text-[10px] font-mono text-slate-300 max-h-48 overflow-y-auto space-y-2 select-text">
                  <div>
                    <strong className="text-rose-400">Error Stack:</strong>
                    <pre className="whitespace-pre-wrap mt-1 text-slate-400">{error?.stack || 'No stack trace available'}</pre>
                  </div>
                  {errorInfo?.componentStack && (
                    <div className="border-t border-white/10 pt-2">
                      <strong className="text-blue-400">Component Hierarchy:</strong>
                      <pre className="whitespace-pre-wrap mt-1 text-slate-400">{errorInfo.componentStack}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Recovery Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-95"
              >
                <RefreshCw size={14} /> Reload Workspace
              </button>

              <button
                type="button"
                onClick={() => (window.location.href = '/')}
                className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Home size={14} /> Return to Home
              </button>

              <button
                type="button"
                onClick={this.handleCopyError}
                className="w-full py-2.5 px-4 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-medium text-xs flex items-center justify-center gap-2 transition-all"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                {copied ? 'Details Copied!' : 'Copy Error Details'}
              </button>

              <button
                type="button"
                onClick={this.handleResetSession}
                className="w-full py-2.5 px-4 rounded-xl border border-rose-500/20 hover:bg-rose-500/10 text-rose-300 font-medium text-xs flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCw size={14} /> Reset Local Cache
              </button>
            </div>
          </div>
        </div>
      );
    }

    return children || null;
  }
}

export default ErrorBoundary;