import React from 'react';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import MobileNav from '../MobileNav';
import { UniversityBackground } from '../ui/UniversityBackground';
import { User, Club, Role } from '../../types';
import { useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: User;
  clubs: Club[];
  activeContext: string;
  activeTab: string;
  isDarkMode: boolean;
  onLogout: () => void;
  onContextChange: (id: string) => void;
  setActiveTab: (tab: string) => void;
  onSwitchRole: (role: Role) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  onToggleTheme: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  user,
  clubs,
  activeContext,
  activeTab,
  isDarkMode,
  onLogout,
  onContextChange,
  setActiveTab,
  onSwitchRole,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onToggleTheme
}) => {
  const navigate = useNavigate();
  const userRole = user?.globalRole || Role.STUDENT;
  const clubRole = user?.clubMemberships.find(m => m.clubId === activeContext)?.role || null;

  return (
    <div className="flex flex-col h-screen text-[var(--text-main)] overflow-hidden uni-shell">
      <Navbar
        user={user}
        clubs={clubs}
        activeContext={activeContext}
        onLogout={onLogout}
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onGoHome={() => onContextChange('Global')}
        onOpenProfile={() => { onContextChange('Global'); setActiveTab('profile'); }}
        onOpenDeveloper={() => navigate('/developer-profile')}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          user={user}
          clubs={clubs}
          activeContext={activeContext}
          onContextChange={onContextChange}
          userRole={userRole}
          clubRole={clubRole}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isDarkMode={isDarkMode}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          onSwitchRole={onSwitchRole}
        />

        <main className="flex-1 flex flex-col overflow-hidden relative">
          <UniversityBackground className="flex-1 overflow-y-auto custom-scrollbar pb-24 md:pb-0">
            <div className="uni-page max-w-[1600px] mx-auto w-full min-h-full">
              {children}
            </div>
          </UniversityBackground>
        </main>
      </div>

      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isDarkMode={isDarkMode}
        activeContext={activeContext}
        userRole={userRole}
        clubRole={clubRole}
      />
    </div>
  );
};
