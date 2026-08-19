import React from 'react';
import { Search, Ticket } from 'lucide-react';

interface TicketsHeaderProps {
  isDarkMode: boolean;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  filter: 'all' | 'active' | 'past';
  setFilter: (val: 'all' | 'active' | 'past') => void;
  totalCount: number;
}

export const TicketsHeader: React.FC<TicketsHeaderProps> = ({
  isDarkMode, searchTerm, setSearchTerm, filter, setFilter, totalCount
}) => (
  <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="uni-badge flex items-center gap-1">
          <Ticket size={12} className="text-primary" /> Event Passes ({totalCount})
        </span>
      </div>
      <h1 className={`text-3xl sm:text-4xl font-black tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-[#2B3674]'}`}>
        Digital Access Passes
      </h1>
      <p className="text-[var(--text-secondary)] font-medium text-sm sm:text-base">
        Secure, verifiable credentials with quick Google Wallet integration for campus entry.
      </p>
    </div>
    
    <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className={`flex items-center px-4 py-2.5 rounded-2xl border transition-all ${isDarkMode ? 'bg-[#111C44] border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
            <Search size={16} className="text-[var(--text-secondary)]" />
            <input 
                type="text" 
                placeholder="Search event or ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`ml-3 bg-transparent outline-none text-xs sm:text-sm font-bold w-full sm:w-48 ${isDarkMode ? 'text-white' : 'text-[#2B3674]'}`}
            />
        </div>

        {/* Filter Toggle */}
        <div className={`p-1 rounded-2xl border flex ${isDarkMode ? 'bg-[#111C44] border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
            <button 
                type="button"
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${filter === 'all' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-slate-500'}`}
            >
                All
            </button>
            <button 
                type="button"
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${filter === 'active' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-slate-500'}`}
            >
                Active
            </button>
            <button 
                type="button"
                onClick={() => setFilter('past')}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${filter === 'past' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-400 hover:text-slate-500'}`}
            >
                History
            </button>
        </div>
    </div>
  </header>
);
