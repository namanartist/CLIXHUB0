import React, { useMemo } from 'react';
import { Menu } from 'lucide-react';
import { Role, ClubRole } from '../types';
import { getMobileNavTabs } from '../lib/mobileNavConfig';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onToggleMenu: () => void;
  isDarkMode: boolean;
  activeContext: string;
  userRole: Role;
  clubRole: ClubRole | null;
}

/** Telegram-style bottom tab bar — tabs adapt to Global vs Club scope */
const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  setActiveTab,
  onToggleMenu,
  activeContext,
  userRole,
  clubRole,
}) => {
  const isGlobalAdmin =
    userRole === Role.SUPER_ADMIN || userRole === Role.FACULTY || userRole === Role.DEAN;

  const tabs = useMemo(
    () => getMobileNavTabs(activeContext, userRole, clubRole, isGlobalAdmin),
    [activeContext, userRole, clubRole, isGlobalAdmin]
  );

  const scopeLabel =
    activeContext === 'Global' ? 'University' : 'Club';

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] border-t border-[var(--border-color)] bg-[var(--bg-surface)]/95 backdrop-blur-xl safe-area-pb">
      <p className="text-center text-[9px] font-semibold uppercase tracking-widest text-[var(--text-secondary)] py-0.5 border-b border-[var(--border-color)]/50">
        {scopeLabel} scope
      </p>
      <div className="flex items-stretch h-14 max-w-lg mx-auto">
        {tabs.map(tab => {
          const active = tab.matchTabs.includes(activeTab);
          const Icon = tab.icon;
          return (
            <button
              key={`${activeContext}-${tab.id}`}
              type="button"
              onClick={() => setActiveTab(tab.tabId)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
                active ? 'text-primary' : 'text-[var(--text-secondary)]'
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              <span className={`text-[11px] font-medium ${active ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={onToggleMenu}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[var(--text-secondary)]"
        >
          <Menu size={22} />
          <span className="text-[11px] font-medium">Menu</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileNav;
