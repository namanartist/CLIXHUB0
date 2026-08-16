import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Layers, Command, GraduationCap, Shield } from 'lucide-react';
import { Club, User, Role } from '../../types';

interface PerspectiveSwitcherProps {
  user: User;
  clubs: Club[];
  activeContext: string;
  onContextChange: (id: string) => void;
  isDarkMode: boolean;
  onSwitchRole?: (role: Role) => void;
}

export function getBaseRole(user: User): Role {
  if (!user) return Role.STUDENT;
  const userId = user.id || '';
  const userEmail = user.email || '';
  if (userId.includes('admin') || userEmail === 'admin@mitsgwl.ac.in') return Role.SUPER_ADMIN;
  if (userId.includes('dean') || userEmail === 'dean.sw@mitsgwl.ac.in') return Role.DEAN;
  if (userId.includes('faculty') || userEmail.includes('faculty') || user.designation || userEmail === 'priya.verma@mitsgwl.ac.in') return Role.FACULTY;
  return Role.STUDENT;
}

export const PerspectiveSwitcher: React.FC<PerspectiveSwitcherProps> = ({
  user, clubs = [], activeContext, onContextChange, isDarkMode, onSwitchRole
}) => {
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  const currentClub = (clubs || []).find(c => c?.id === activeContext);
  const baseRole = user ? getBaseRole(user) : Role.STUDENT;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setIsSwitcherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePerspectiveSelect = (id: string) => {
    onContextChange(id);
    setIsSwitcherOpen(false);
  };

  // Determine active display name and icon
  const getContextDisplay = () => {
    if (!user) {
      return {
        title: 'Guest Mainframe',
        subtitle: 'Offline Mode',
        bg: '#2563eb',
        icon: <Command size={20} />
      };
    }
    if (user.globalRole === Role.STUDENT && baseRole !== Role.STUDENT) {
      return {
        title: 'Student View',
        subtitle: 'Scoped as Student',
        bg: '#2563eb',
        icon: <Layers size={20} />
      };
    }
    if (activeContext === 'Global') {
      return {
        title: user.globalRole === Role.SUPER_ADMIN ? 'System Administration' :
               user.globalRole === Role.DEAN ? 'Dean Operations' :
               user.globalRole === Role.FACULTY ? 'Faculty Mainframe' : 'Student Mainframe',
        subtitle: 'Global Operations',
        bg: '#2563eb',
        icon: <Command size={20} />
      };
    }
    return {
      title: currentClub?.name || 'Club Domain',
      subtitle: 'Organisation Scope',
      bg: currentClub?.themeColor || '#2563eb',
      icon: <span className="font-black text-lg">{currentClub?.name?.[0] || 'C'}</span>
    };
  };

  const currentDetails = getContextDisplay();

  return (
    <div className="relative" ref={switcherRef}>
      <button
        onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
        className={`w-full p-4 rounded-3xl transition-all flex items-center gap-4 group border ${isDarkMode
          ? 'bg-white/5 border-white/5 hover:bg-white/10 text-white'
          : 'bg-slate-500/5 hover:bg-white hover:shadow-xl border-transparent text-[#1B2559]'
          }`}
      >
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg transition-transform group-hover:scale-105 overflow-hidden flex-shrink-0"
          style={{ backgroundColor: currentDetails.bg }}>
          {currentDetails.icon}
        </div>
        <div className="flex-1 text-left min-w-0">
          <h3 className="text-[8px] font-black uppercase tracking-widest text-[var(--text-secondary)] leading-none mb-1">
            {currentDetails.subtitle}
          </h3>
          <p className="text-xs font-black truncate">{currentDetails.title}</p>
        </div>
        <ChevronDown size={14} className={`text-[var(--text-secondary)] transition-transform duration-300 flex-shrink-0 ${isSwitcherOpen ? 'rotate-180' : ''}`} />
      </button>

      {isSwitcherOpen && (
        <div className={`absolute left-0 right-0 top-full mt-3 z-[100] border rounded-[2rem] shadow-[0_32px_64px_rgba(0,0,0,0.3)] overflow-hidden p-2 animate-in fade-in slide-in-from-top-4 duration-300 backdrop-blur-3xl bg-[var(--bg-surface)] border-[var(--border-color)]`}>
          <div className="space-y-1 max-h-[350px] overflow-y-auto custom-scrollbar p-1">
            <p className="text-[8px] font-black uppercase tracking-widest text-[var(--text-secondary)] px-3 py-2">Select Scope</p>
            
            <button
              onClick={() => handlePerspectiveSelect('Global')}
              className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all hover:bg-[var(--primary-soft)] text-[var(--text-main)] ${activeContext === 'Global' ? 'bg-[var(--primary-soft)]' : ''}`}
            >
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                <Layers size={16} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-left">Global Ops</span>
            </button>

            {user && (user.clubMemberships || []).map((m) => {
              const c = (clubs || []).find(cl => cl?.id === m?.clubId);
              if (!c) return null;
              return (
                <button
                  key={c.id}
                  onClick={() => handlePerspectiveSelect(c.id)}
                  className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all hover:bg-[var(--primary-soft)] text-[var(--text-main)] ${activeContext === c.id ? 'bg-[var(--primary-soft)]' : ''}`}
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-md shadow-black/10 flex-shrink-0" style={{ backgroundColor: c.themeColor || '#2563eb' }}>
                    {c.name ? c.name[0] : 'C'}
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest truncate text-left">{c.name || 'Club'}</span>
                </button>
              );
            })}

            {/* Role Switcher completely disabled for all institutional staff per security protocols */}
          </div>
        </div>
      )}
    </div>
  );
};
