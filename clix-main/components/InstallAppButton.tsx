import React, { useState } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';
import { usePwaInstall } from '../lib/pwa';
import { AppDownloadModal } from './common/AppDownloadModal';

interface InstallAppButtonProps {
  variant?: 'nav' | 'hero' | 'sidebar' | 'pill';
  className?: string;
}

const InstallAppButton: React.FC<InstallAppButtonProps> = ({ variant = 'nav', className = '' }) => {
  const { canInstall, install, isInstalled } = usePwaInstall();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = async () => {
    if (canInstall) {
      const ok = await install();
      if (!ok) {
        setIsModalOpen(true);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={
          className ||
          (variant === 'hero'
            ? 'h-12 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95'
            : variant === 'sidebar'
            ? 'w-full py-2.5 px-3.5 rounded-xl bg-[var(--primary-soft)] hover:bg-primary hover:text-white text-primary text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border border-primary/20'
            : 'h-9 px-3.5 rounded-full bg-[var(--primary-soft)] hover:bg-primary hover:text-white text-primary text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-primary/20 shadow-sm')
        }
        aria-label="Download or install Clix Hub App"
        title="Download / Install Clix Hub as an App"
      >
        {isInstalled ? (
          <>
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>App Installed</span>
          </>
        ) : (
          <>
            <Download size={15} />
            <span>Download App</span>
          </>
        )}
      </button>

      <AppDownloadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default InstallAppButton;
