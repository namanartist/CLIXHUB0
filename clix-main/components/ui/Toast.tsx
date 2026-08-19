import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X, Copy, Check } from 'lucide-react';

export type ToastType = 'error' | 'success' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  details?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastItem, 'id'>) => string;
  error: (title: string, messageOrDetails?: string, details?: string) => string;
  success: (title: string, message?: string) => string;
  warning: (title: string, message?: string) => string;
  info: (title: string, message?: string) => string;
  dismiss: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback((toast: Omit<ToastItem, 'id'>): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const duration = toast.duration ?? (toast.type === 'error' ? 8000 : 4500);
    const newToast: ToastItem = { ...toast, id, duration };

    setToasts(prev => [newToast, ...prev.slice(0, 4)]);

    if (duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }
    return id;
  }, [dismiss]);

  const error = useCallback((title: string, messageOrDetails?: string, details?: string) => {
    return showToast({
      type: 'error',
      title,
      message: messageOrDetails,
      details,
    });
  }, [showToast]);

  const success = useCallback((title: string, message?: string) => {
    return showToast({
      type: 'success',
      title,
      message,
    });
  }, [showToast]);

  const warning = useCallback((title: string, message?: string) => {
    return showToast({
      type: 'warning',
      title,
      message,
    });
  }, [showToast]);

  const info = useCallback((title: string, message?: string) => {
    return showToast({
      type: 'info',
      title,
      message,
    });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, error, success, warning, info, dismiss, clearAll }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastContainer: React.FC<{ toasts: ToastItem[]; onDismiss: (id: string) => void }> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 sm:top-6 right-3 sm:right-6 z-[9999] flex flex-col gap-2.5 max-w-[calc(100vw-1.5rem)] sm:max-w-md w-full pointer-events-none">
      {toasts.map(toast => (
        <ToastMessage key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  );
};

const ToastMessage: React.FC<{ toast: ToastItem; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleCopyDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `${toast.title}\n${toast.message || ''}\n${toast.details || ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStyle = () => {
    switch (toast.type) {
      case 'error':
        return {
          icon: <AlertCircle className="text-rose-400 shrink-0 mt-0.5" size={18} />,
          border: 'border-rose-500/30',
          bg: 'bg-[#1a0c16]/95 backdrop-blur-2xl shadow-2xl shadow-rose-950/40',
          titleColor: 'text-rose-200',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={18} />,
          border: 'border-emerald-500/30',
          bg: 'bg-[#091a14]/95 backdrop-blur-2xl shadow-2xl shadow-emerald-950/40',
          titleColor: 'text-emerald-200',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={18} />,
          border: 'border-amber-500/30',
          bg: 'bg-[#1a1609]/95 backdrop-blur-2xl shadow-2xl shadow-amber-950/40',
          titleColor: 'text-amber-200',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        };
      case 'info':
      default:
        return {
          icon: <Info className="text-sky-400 shrink-0 mt-0.5" size={18} />,
          border: 'border-sky-500/30',
          bg: 'bg-[#091424]/95 backdrop-blur-2xl shadow-2xl shadow-sky-950/40',
          titleColor: 'text-sky-200',
          badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
        };
    }
  };

  const style = getStyle();

  return (
    <div
      role="alert"
      className={`pointer-events-auto rounded-2xl border p-4 transition-all duration-300 animate-in slide-in-from-top-4 ${style.bg} ${style.border}`}
    >
      <div className="flex items-start gap-3">
        {style.icon}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className={`text-xs sm:text-sm font-bold leading-snug ${style.titleColor}`}>
              {toast.title}
            </h4>
            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${style.badge}`}>
              {toast.type}
            </span>
          </div>

          {toast.message && (
            <p className="text-xs text-slate-300 leading-relaxed break-words">
              {toast.message}
            </p>
          )}

          {toast.details && (
            <div className="pt-1.5">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 underline transition-colors"
              >
                {showDetails ? 'Hide Problem Details' : 'Show Problem Details'}
              </button>

              {showDetails && (
                <div className="mt-2 p-2.5 rounded-xl bg-black/60 border border-white/10 text-[10px] font-mono text-slate-300 max-h-32 overflow-y-auto break-all whitespace-pre-wrap">
                  {toast.details}
                </div>
              )}
            </div>
          )}

          {toast.type === 'error' && (
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyDetails}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-[10px] font-bold text-slate-300 flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                {copied ? 'Copied Details' : 'Copy Error Details'}
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
