import React from 'react';
import { UserCog } from 'lucide-react';
import { User } from '../../types';

interface SidebarFooterProps {
  user: User;
  isDarkMode: boolean;
  onContextChange: (id: string) => void;
  setActiveTab: (tab: string) => void;
  onClose: () => void;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  user, isDarkMode, onContextChange, setActiveTab, onClose
}) => {
  return (
    <div className={`p-6 mt-auto border-t transition-all ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
      <div className={`p-6 rounded-[2rem] border transition-all ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-500/5 border-transparent'}`}>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 p-[2px] shadow-lg shadow-blue-500/20">
            <div className={`w-full h-full rounded-2xl overflow-hidden ${isDarkMode ? 'bg-[#0d121d]' : 'bg-white'}`}>
              {user?.photoUrl ? <img src={user.photoUrl} className="w-full h-full object-cover" /> : <div className={`w-full h-full flex items-center justify-center text-xs font-black ${isDarkMode ? 'text-white' : 'text-blue-600'}`}>{user?.name?.[0] || 'U'}</div>}
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black tracking-tight truncate text-[var(--text-main)]">{user?.name || 'User'}</p>
            <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest leading-none mt-1">Authenticated</p>
          </div>
        </div>
        <button
          onClick={() => { onContextChange('Global'); setActiveTab('profile'); onClose(); }}
          className={`w-full group py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isDarkMode
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-white text-blue-600 shadow-xl shadow-blue-500/5 hover:bg-blue-600 hover:text-white border border-blue-500/10'
            }`}
        >
          <UserCog size={16} className="transition-transform group-hover:rotate-45" /> Profile Settings
        </button>

        {/* Premium Attribution branding */}
        <div className="mt-4 pt-4 text-center border-t border-[var(--border-color)] opacity-60 hover:opacity-100 transition-opacity">
          <p className="text-[8px] font-black uppercase tracking-[0.25em] text-[var(--text-secondary)]">
            Developed by <span className="text-primary font-extrabold">Naman Lahariya</span>
          </p>
        </div>
      </div>
    </div>
  );
};
