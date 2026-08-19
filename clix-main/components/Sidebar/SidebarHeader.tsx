import React from 'react';
import { X } from 'lucide-react';
import { Club, User, Role } from '../../types';
import { PerspectiveSwitcher } from './PerspectiveSwitcher';

interface SidebarHeaderProps {
  user: User;
  clubs: Club[];
  activeContext: string;
  onContextChange: (id: string) => void;
  isDarkMode: boolean;
  onClose: () => void;
  onSwitchRole?: (role: Role) => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  user, clubs, activeContext, onContextChange, isDarkMode, onClose, onSwitchRole
}) => {
  return (
    <div className="p-8 pb-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3 text-[var(--text-main)]">
          <img
            src="/image.png"
            alt="CLIX Logo"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="w-10 h-10 rounded-2xl object-cover shadow-lg border border-[var(--border-color)] shrink-0"
          />
          <div>
            <span className="text-xl font-black tracking-tight font-display">Clix Hub</span>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] leading-none mt-1">
              University Portal
            </p>
          </div>
        </div>
        <button onClick={onClose} className="md:hidden p-2 hover:bg-[var(--primary-soft)] rounded-xl transition-all" type="button" aria-label="Close menu">
          <X size={20} className="text-[var(--text-secondary)]" />
        </button>
      </div>

      <PerspectiveSwitcher
        user={user}
        clubs={clubs}
        activeContext={activeContext}
        onContextChange={onContextChange}
        isDarkMode={isDarkMode}
        onSwitchRole={onSwitchRole}
      />
    </div>
  );
};
