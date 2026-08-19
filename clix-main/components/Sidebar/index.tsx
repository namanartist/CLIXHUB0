import React from 'react';
import { ClubRole, Role, User, Club } from '../../types';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNav } from './SidebarNav';
import { SidebarFooter } from './SidebarFooter';

interface SidebarProps {
  user: User;
  clubs: Club[];
  activeContext: string;
  onContextChange: (id: string) => void;
  userRole: Role;
  clubRole: ClubRole | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSwitchRole?: (role: Role) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  user, clubs, activeContext, onContextChange, userRole, clubRole, activeTab, setActiveTab, isOpen, onClose, isDarkMode, onSwitchRole
}) => {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-md z-[60] transition-opacity duration-500 animate-in fade-in"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-[88vw] max-w-[320px] sm:w-80 flex flex-col p-3 sm:p-6
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:relative md:h-screen
        transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
      `}>
        <div className="w-full h-full rounded-[2rem] sm:rounded-[3rem] flex flex-col overflow-hidden uni-glass-strong shadow-glass-lg">
          <SidebarHeader 
            user={user} 
            clubs={clubs} 
            activeContext={activeContext} 
            onContextChange={onContextChange} 
            isDarkMode={isDarkMode} 
            onClose={onClose}
            onSwitchRole={onSwitchRole}
          />
          <SidebarNav 
            user={user}
            clubs={clubs}
            activeContext={activeContext} 
            userRole={userRole} 
            clubRole={clubRole} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isDarkMode={isDarkMode} 
            onClose={onClose} 
            onContextChange={onContextChange}
          />
          <SidebarFooter 
            user={user} 
            isDarkMode={isDarkMode} 
            onContextChange={onContextChange} 
            setActiveTab={setActiveTab} 
            onClose={onClose} 
          />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
