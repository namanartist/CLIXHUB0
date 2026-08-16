import React from 'react';
import { Search, RefreshCcw } from 'lucide-react';

interface BoardHeaderProps {
  isPresident: boolean;
  onNewCycle?: () => void;
}

export const BoardHeader: React.FC<BoardHeaderProps> = ({ isPresident, onNewCycle }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
    <div>
      <h2 className="text-3xl font-black text-[var(--text-main)] tracking-tight">Recruitment Pipeline</h2>
      <p className="text-[#A3AED0] text-sm font-medium mt-1">Institutional Membership Flow • Automated Screening</p>
    </div>
    <div className="flex items-center gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3AED0]" size={16} />
        <input 
          type="text" 
          placeholder="Filter Roll No..." 
          className="pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--bg-surface)] glass border border-[var(--border-color)] text-[var(--text-main)] focus:border-primary transition-all text-sm w-64 outline-none shadow-sm"
        />
      </div>
      {isPresident && (
        <button 
          onClick={onNewCycle}
          className="px-6 py-2.5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2"
        >
          <RefreshCcw size={16} /> New Cycle
        </button>
      )}
    </div>
  </div>
);
