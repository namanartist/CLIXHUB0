import React from 'react';
import { Download, X, Smartphone, Monitor, CheckCircle2, Share, ShieldCheck, Sparkles, Image as ImageIcon } from 'lucide-react';
import { usePwaInstall } from '../../lib/pwa';

interface AppDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppDownloadModal: React.FC<AppDownloadModalProps> = ({ isOpen, onClose }) => {
  const { canInstall, install, isInstalled, isIOS, isAndroid } = usePwaInstall();

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (canInstall) {
      const success = await install();
      if (success) {
        onClose();
      }
    }
  };

  const handleDownloadLogo = () => {
    const a = document.createElement('a');
    a.href = '/image.png';
    a.download = 'clix-hub-logo.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose}>
      <div
        className="w-full max-w-lg uni-pill-card p-6 sm:p-8 space-y-6 shadow-2xl relative bg-[var(--bg-surface)] border border-[var(--border-color)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--primary-soft)] text-[var(--text-secondary)] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* App Header Info with Dual Logo */}
        <div className="flex items-center gap-4 pt-1">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-primary/30 overflow-hidden shadow-xl flex items-center justify-center p-1.5">
              <img src="/image.png" alt="Clix Hub App Logo" className="w-full h-full object-contain" />
            </div>
            <img
              src="/mitslogo.jpg"
              alt="MITS Seal"
              className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 absolute -bottom-1 -right-1 shadow-md object-contain bg-white"
            />
          </div>
          <div>
            <span className="uni-badge flex items-center gap-1">
              <Sparkles size={11} className="text-primary" /> Official Progressive App
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[var(--text-main)] mt-1 tracking-tight">
              Download Clix Hub
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">Madhav Institute of Technology & Science</p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="p-3 rounded-2xl bg-[var(--primary-soft)] border border-[var(--border-color)]">
            <Smartphone className="mx-auto text-primary mb-1" size={20} />
            <p className="text-[11px] font-bold text-[var(--text-main)]">Mobile & Desktop</p>
            <p className="text-[9px] text-[var(--text-secondary)]">Universal Support</p>
          </div>
          <div className="p-3 rounded-2xl bg-[var(--primary-soft)] border border-[var(--border-color)]">
            <ShieldCheck className="mx-auto text-emerald-500 mb-1" size={20} />
            <p className="text-[11px] font-bold text-[var(--text-main)]">Instant Launch</p>
            <p className="text-[9px] text-[var(--text-secondary)]">Zero Lag</p>
          </div>
          <div className="p-3 rounded-2xl bg-[var(--primary-soft)] border border-[var(--border-color)]">
            <CheckCircle2 className="mx-auto text-blue-500 mb-1" size={20} />
            <p className="text-[11px] font-bold text-[var(--text-main)]">Offline Ready</p>
            <p className="text-[9px] text-[var(--text-secondary)]">Cached Passes</p>
          </div>
        </div>

        {/* Primary Action Button if Install Prompt is ready */}
        {canInstall ? (
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleInstallClick}
              className="w-full h-13 uni-pill uni-btn-primary text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Download size={20} /> Install App to Device Now
            </button>
            <p className="text-[11px] text-center text-[var(--text-secondary)]">
              Installs a dedicated standalone app icon with official logo on your home screen or desktop.
            </p>
          </div>
        ) : isInstalled ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-center space-y-1">
            <CheckCircle2 size={24} className="mx-auto" />
            <p className="font-bold text-sm">Clix Hub is Already Installed!</p>
            <p className="text-xs opacity-80">You are running the official standalone application with full features.</p>
          </div>
        ) : null}

        {/* Platform-Specific Step-by-Step Instructions */}
        <div className="space-y-3 pt-2 border-t border-[var(--border-color)]">
          <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">
            Easy Installation Instructions
          </h4>

          {isIOS ? (
            <div className="p-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)]">
                <Share size={16} className="text-primary" /> For iPhone & iPad (Safari):
              </div>
              <ol className="text-xs text-[var(--text-secondary)] space-y-1.5 list-decimal list-inside pl-1">
                <li>Tap the <strong>Share</strong> icon in the bottom Safari toolbar (square with arrow).</li>
                <li>Scroll down and select <strong className="text-[var(--text-main)]">"Add to Home Screen"</strong>.</li>
                <li>Tap <strong>Add</strong> in the top-right corner to place the official icon on your home screen.</li>
              </ol>
            </div>
          ) : isAndroid ? (
            <div className="p-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)]">
                <Smartphone size={16} className="text-primary" /> For Android (Chrome / Edge / Firefox):
              </div>
              <ol className="text-xs text-[var(--text-secondary)] space-y-1.5 list-decimal list-inside pl-1">
                <li>Tap the <strong>three dots (⋮)</strong> menu in your browser.</li>
                <li>Select <strong className="text-[var(--text-main)]">"Install app"</strong> or <strong className="text-[var(--text-main)]">"Add to Home Screen"</strong>.</li>
                <li>Confirm to download the application with logo icon to your launcher.</li>
              </ol>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)]">
                <Monitor size={16} className="text-primary" /> For Desktop (Chrome, Edge, Brave, Opera):
              </div>
              <ol className="text-xs text-[var(--text-secondary)] space-y-1.5 list-decimal list-inside pl-1">
                <li>Look for the <strong className="text-[var(--text-main)]">Install App (⭳)</strong> icon on the right side of the address bar.</li>
                <li>Click <strong>Install</strong> to add Clix Hub to your desktop / taskbar.</li>
                <li>Or open browser menu (⋮) → select <strong>"Install Clix Hub..."</strong></li>
              </ol>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDownloadLogo}
            className="flex-1 py-2.5 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] hover:text-primary transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ImageIcon size={14} /> Download App Logo
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[var(--primary-soft)] text-xs font-bold text-[var(--text-main)] hover:bg-primary hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppDownloadModal;
