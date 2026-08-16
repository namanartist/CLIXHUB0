import React from 'react';
import { Search } from 'lucide-react';

interface TicketsHeaderProps {
  isDarkMode: boolean;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  filter: 'active' | 'past';
  setFilter: (val: 'active' | 'past') => void;
}

export const TicketsHeader: React.FC<TicketsHeaderProps> = ({
  isDarkMode, searchTerm, setSearchTerm, filter, setFilter
}) => (
  <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
    <div>
      <h1 className={`text-4xl font-black tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-[#2B3674]'}`}>Digital Access Passes</h1>
      <p className="text-[var(--text-secondary)] font-medium text-lg">Secure, verifiable credentials for campus entry.</p>
    </div>
    
    <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className={`flex items-center px-4 py-3 rounded-2xl border transition-all ${isDarkMode ? 'bg-[#111C44] border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
            <Search size={18} className="text-[var(--text-secondary)]" />
            <input 
                type="text" 
                placeholder="Search event or ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`ml-3 bg-transparent outline-none text-sm font-bold w-full ${isDarkMode ? 'text-white' : 'text-[#2B3674]'}`}
            />
        </div>

        {/* Filter Toggle */}
        <div className={`p-1 rounded-2xl border flex ${isDarkMode ? 'bg-[#111C44] border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
            <button 
                onClick={() => setFilter('active')}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === 'active' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-slate-500'}`}
            >
                Active
            </button>
            <button 
                onClick={() => setFilter('past')}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === 'past' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-slate-500'}`}
            >
                History
            </button>
        </div>
    </div>
  </header>
);
