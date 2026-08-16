import React from 'react';
import { Download, CheckCircle2 } from 'lucide-react';
import { usePwaInstall } from '../lib/pwa';

interface InstallAppButtonProps {
  variant?: 'nav' | 'hero';
}

const InstallAppButton: React.FC<InstallAppButtonProps> = ({ variant = 'nav' }) => {
  const { canInstall, install, isInstalled } = usePwaInstall();

  if (isInstalled) {
    return (
      <span className={variant === 'hero' ? 'app-install-hero is-installed' : 'app-install-nav is-installed'}>
        <CheckCircle2 size={variant === 'hero' ? 18 : 16} />
        Installed
      </span>
    );
  }

  if (!canInstall) return null;

  return (
    <button
      type="button"
      onClick={install}
      className={variant === 'hero' ? 'app-install-hero' : 'app-install-nav'}
      aria-label="Install Clix Hub as an app"
    >
      <Download size={variant === 'hero' ? 18 : 16} />
      <span>{variant === 'hero' ? 'Install App' : 'Install'}</span>
    </button>
  );
};

export default InstallAppButton;
