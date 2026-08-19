import React, { useState } from 'react';
import { Club } from '../../types';
import { Globe, Users, ExternalLink, ShieldCheck, Search, Zap, UserPlus } from 'lucide-react';

interface Props {
  clubs: Club[];
  isDarkMode: boolean;
  onEnterClub: (id: string) => void | Promise<void>;
  onBack?: () => void;
}

const GlobalClubs: React.FC<Props> = ({ clubs, isDarkMode, onEnterClub, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Technical', 'Cultural', 'Social', 'Sports'];

  const filteredClubs = clubs.filter(c =>
    (selectedCategory === 'All' || c.category === selectedCategory) &&
    (c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (c.subdomain && c.subdomain.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 min-h-screen">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[var(--border-color)] pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
            <Globe size={14} className="animate-pulse" /> Official Campus Registry
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--text-main)] font-display">
            Institutional Organizations & <span className="text-primary italic">Clubs</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] font-medium max-w-2xl">
            Browse and explore verified student organizations, technical chapters, and cultural units at MITS Gwalior.
          </p>
        </div>
        <div className="bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 self-start md:self-auto">
          <Globe size={16} /> {clubs.length} Active Organizations
        </div>
      </header>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search clubs or subdomains..."
            className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl pl-11 pr-4 py-3 text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--text-main)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Clubs Grid */}
      {filteredClubs.length === 0 ? (
        <div className="p-16 rounded-3xl border border-dashed border-[var(--border-color)] text-center space-y-3">
          <Globe size={36} className="text-slate-500 mx-auto" />
          <p className="text-lg font-bold text-[var(--text-main)]">No Organizations Found</p>
          <p className="text-xs text-[var(--text-secondary)]">Try adjusting your search filter or category selection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredClubs.map(club => {
            const accent = club.themeColor || '#0099FF';
            const customDomain = `${club.subdomain || club.id}.xyz.com`;

            return (
              <div
                key={club.id}
                className={`p-8 rounded-[2.5rem] border transition-all hover:scale-[1.02] group flex flex-col justify-between shadow-xl relative overflow-hidden ${
                  isDarkMode ? 'bg-slate-900/80 border-slate-800 hover:border-blue-500/40' : 'bg-white border-slate-200 shadow-md'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div
                      onClick={() => onEnterClub(club.id)}
                      className="w-16 h-16 rounded-3xl flex items-center justify-center text-white font-black text-2xl shadow-xl cursor-pointer hover:scale-110 transition-transform border-2 border-white/20"
                      style={{ backgroundColor: accent }}
                    >
                      {club.name[0]}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 uppercase">
                        <ShieldCheck size={12} /> Verified
                      </span>
                      {club.recruitmentActive && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20 uppercase">
                          <UserPlus size={10} /> Recruitment Open
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <h3
                      onClick={() => onEnterClub(club.id)}
                      className="text-2xl font-black text-[var(--text-main)] tracking-tight cursor-pointer hover:text-blue-500 transition-colors"
                    >
                      {club.name}
                    </h3>
                    <p className="text-xs font-mono text-blue-400 font-bold">{customDomain}</p>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-light line-clamp-2">
                      {club.tagline || club.description || `Official ${club.category} student organization of MITS Gwalior.`}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-[var(--border-color)] flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] font-semibold">
                    <span className="flex items-center gap-1 text-slate-400"><Users size={14} /> Active</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">{club.category}</span>
                  </div>
                  <button
                    onClick={() => onEnterClub(club.id)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md hover:scale-105 transition flex items-center gap-1.5"
                    style={{ background: accent }}
                  >
                    Open Hub <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GlobalClubs;
