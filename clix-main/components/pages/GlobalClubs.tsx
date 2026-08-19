import React, { useState } from 'react';
import { Club } from '../../types';
import {
  Globe,
  Users,
  ExternalLink,
  ShieldCheck,
  Search,
  Zap,
  UserPlus,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Building2
} from 'lucide-react';
import { getClubSubdomainSlug, getClubSubdomainUrl, copyClubSubdomainUrl } from '../../lib/subdomain';

interface Props {
  clubs: Club[];
  isDarkMode: boolean;
  onEnterClub: (id: string) => void | Promise<void>;
  onBack?: () => void;
}

const GlobalClubs: React.FC<Props> = ({ clubs, isDarkMode, onEnterClub, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedSubdomain, setCopiedSubdomain] = useState<string | null>(null);
  const [recruitingOnly, setRecruitingOnly] = useState(false);

  const categories = ['All', 'Technical', 'Cultural', 'Social', 'Sports', 'Media'];

  const filteredClubs = clubs.filter(c => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.subdomain && c.subdomain.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.tagline && c.tagline.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRecruiting = !recruitingOnly || c.recruitmentActive;
    return matchesCategory && matchesSearch && matchesRecruiting;
  });

  const handleCopySubdomain = async (e: React.MouseEvent, club: Club) => {
    e.stopPropagation();
    const success = await copyClubSubdomainUrl(club);
    if (success) {
      setCopiedSubdomain(club.id);
      setTimeout(() => setCopiedSubdomain(null), 2200);
    }
  };

  const handleOpenSubdomain = (e: React.MouseEvent, club: Club) => {
    e.stopPropagation();
    const url = getClubSubdomainUrl(club);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="p-4 sm:p-8 md:p-10 max-w-7xl mx-auto space-y-8 sm:space-y-10 min-h-screen text-[var(--text-main)] animate-in fade-in duration-300">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[var(--border-color)] pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest">
            <Globe size={14} className="animate-pulse" /> Official Campus Registry
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[var(--text-main)] font-display">
            Institutional Organizations & <span className="text-primary italic">Clubs</span>
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium max-w-2xl">
            Explore verified student bodies, technical chapters, and specialized wings at MITS Gwalior with dedicated micro-site subdomains.
          </p>
        </div>
        <div className="bg-blue-600 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 flex items-center gap-2 self-start md:self-auto">
          <Globe size={16} /> {clubs.length} Registered Units
        </div>
      </header>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-blue-400 transition-colors" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search clubs, wings, or subdomains..."
            className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-[var(--text-main)] focus:outline-none focus:border-blue-500 font-medium placeholder:text-[var(--text-secondary)]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--text-main)]'
              }`}
            >
              {cat}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setRecruitingOnly(!recruitingOnly)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
              recruitingOnly
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                : 'bg-[var(--bg-surface)] text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10'
            }`}
          >
            <Sparkles size={12} /> Recruiting
          </button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredClubs.map(club => {
            const accent = club.themeColor || '#0099FF';
            const slug = getClubSubdomainSlug(club);
            const isCopied = copiedSubdomain === club.id;

            return (
              <div
                key={club.id}
                onClick={() => onEnterClub(club.id)}
                className={`p-6 sm:p-8 rounded-[2.5rem] border transition-all hover:scale-[1.02] group flex flex-col justify-between shadow-xl relative overflow-hidden cursor-pointer ${
                  isDarkMode ? 'bg-slate-900/80 border-slate-800 hover:border-blue-500/40' : 'bg-white border-slate-200 shadow-md'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-5">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl group-hover:scale-110 transition-transform border border-white/20"
                      style={{ backgroundColor: accent }}
                    >
                      {club.name[0]}
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                        <ShieldCheck size={12} /> Verified
                      </span>
                      {club.recruitmentActive && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[9px] font-black uppercase tracking-wider">
                          <UserPlus size={10} /> Hiring
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 mb-5">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                        {club.category} Wing
                      </span>
                      <h3 className="text-2xl font-black text-[var(--text-main)] tracking-tight group-hover:text-blue-400 transition-colors">
                        {club.name}
                      </h3>
                    </div>

                    {/* Subdomain Bar */}
                    <div
                      onClick={e => e.stopPropagation()}
                      className="p-2.5 rounded-xl bg-white/[0.04] border border-[var(--border-color)] flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Globe size={13} className="text-cyan-400 shrink-0" />
                        <span className="font-mono text-[11px] font-bold text-slate-300 truncate">
                          {slug}.clixhub.in
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={e => handleCopySubdomain(e, club)}
                          title="Copy subdomain URL"
                          className="p-1 rounded-md bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                        >
                          {isCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        </button>
                        <button
                          type="button"
                          onClick={e => handleOpenSubdomain(e, club)}
                          title="Visit subdomain micro-site"
                          className="p-1 rounded-md bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white transition-colors"
                        >
                          <ExternalLink size={12} />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-normal line-clamp-2">
                      {club.tagline || club.description || `Official ${club.category} student organization of MITS Gwalior.`}
                    </p>
                  </div>
                </div>

                <div className="pt-5 border-t border-[var(--border-color)] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] font-semibold">
                    <Users size={14} className="text-blue-400" />
                    <span className="text-[11px] font-bold text-[var(--text-main)]">{club.membersCount || 35}+ Members</span>
                  </div>

                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      onEnterClub(club.id);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-md hover:scale-105 transition-all flex items-center gap-1.5"
                    style={{ background: accent }}
                  >
                    Open Hub <ArrowRight size={13} />
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
