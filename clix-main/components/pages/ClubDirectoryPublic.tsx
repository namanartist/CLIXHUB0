import React, { useState } from 'react';
import { Club } from '../../types';
import {
  Search,
  Globe,
  Users,
  ArrowUpRight,
  Zap,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Link as LinkIcon,
  Copy,
  Check,
  UserPlus,
  ExternalLink,
  Filter,
  Compass,
  Building2,
  Calendar
} from 'lucide-react';
import { getClubSubdomainSlug, getClubSubdomainUrl, copyClubSubdomainUrl } from '../../lib/subdomain';

interface Props {
  clubs: Club[];
  onEnterClub: (id: string) => void;
  isDarkMode: boolean;
  onBack?: () => void;
}

const ClubDirectoryPublic: React.FC<Props> = ({ clubs, onEnterClub, isDarkMode, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [recruitingOnly, setRecruitingOnly] = useState(false);
  const [copiedSubdomain, setCopiedSubdomain] = useState<string | null>(null);

  const categories = ['All', 'Technical', 'Cultural', 'Social', 'Sports', 'Media'];

  const filteredClubs = clubs.filter(club => {
    const matchesCategory = selectedCategory === 'All' || club.category === selectedCategory;
    const matchesSearch =
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (club.tagline && club.tagline.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (club.category && club.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (club.subdomain && club.subdomain.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRecruiting = !recruitingOnly || club.recruitmentActive;
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
    <div className="min-h-screen bg-transparent text-[var(--text-main)] pb-24 animate-in fade-in duration-500">
      {/* Hero Header */}
      <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-xl shadow-lg shadow-blue-500/10">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
            </span>
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-400">
              Campus Club Ecosystem
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[1.05] uppercase">
            Discover <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">Communities</span>
          </h1>

          <p className="text-sm sm:text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto font-medium leading-relaxed">
            Every club at MITS Gwalior is powered by a dedicated subdomain micro-site, real-time recruitment, event passes, and leadership governance.
          </p>

          {/* Subdomain Accessibility Banner */}
          <div className="max-w-xl mx-auto mt-6 p-3 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex items-center justify-center gap-3 text-xs text-[var(--text-secondary)]">
            <Globe className="text-cyan-400 shrink-0" size={16} />
            <span>
              Subdomain Access:{' '}
              <span className="text-white font-mono font-bold bg-white/10 px-2 py-0.5 rounded-md">
                [clubname].clixmits.vercel.app
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* Sticky Filter & Search Bar */}
      <section className="sticky top-20 z-30 px-4 sm:px-8 py-4 backdrop-blur-2xl bg-[#030712]/80 border-y border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Field */}
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-blue-400 transition-colors" size={18} />
            <input
              type="text"
              aria-label="Search clubs"
              placeholder="Search by name, sector, or subdomain..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-[var(--border-color)] text-xs sm:text-sm font-medium text-[var(--text-main)] outline-none focus:border-blue-500/50 transition-all placeholder:text-[var(--text-secondary)]"
            />
          </div>

          {/* Category Chips & Recruitment Toggle */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-white/[0.04] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-white hover:bg-white/[0.08]'
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
                  : 'bg-white/[0.04] text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10'
              }`}
            >
              <Sparkles size={12} /> Recruiting
            </button>
          </div>
        </div>
      </section>

      {/* Clubs Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 sm:pt-14 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">
            Showing {filteredClubs.length} of {clubs.length} verified organizations
          </p>
        </div>

        {filteredClubs.length === 0 ? (
          <div className="p-16 rounded-3xl border border-dashed border-white/10 text-center space-y-4">
            <Globe size={44} className="text-slate-500 mx-auto" />
            <h3 className="text-xl font-black text-[var(--text-main)]">No Clubs Match Your Filter</h3>
            <p className="text-xs text-[var(--text-secondary)]">Try clearing search terms or selecting another category.</p>
            <button
              type="button"
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setRecruitingOnly(false); }}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-black uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredClubs.map(club => {
              const slug = getClubSubdomainSlug(club);
              const subdomainUrl = getClubSubdomainUrl(club);
              const isCopied = copiedSubdomain === club.id;
              const accentColor = club.themeColor || '#0099FF';

              return (
                <div
                  key={club.id}
                  onClick={() => onEnterClub(club.id)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={e => e.key === 'Enter' && onEnterClub(club.id)}
                  className="group relative rounded-3xl p-6 sm:p-7 border border-[var(--border-color)] bg-slate-900/60 backdrop-blur-xl hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden"
                >
                  {/* Top Ambient Glow */}
                  <div
                    className="absolute -top-24 -right-24 w-48 h-48 rounded-full opacity-20 blur-3xl pointer-events-none group-hover:opacity-40 transition-opacity"
                    style={{ backgroundColor: accentColor }}
                  />

                  <div className="space-y-5 relative z-10">
                    {/* Header Row: Logo, Badges */}
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl group-hover:scale-105 transition-transform border border-white/20 shrink-0"
                        style={{ backgroundColor: accentColor }}
                      >
                        {club.name[0]}
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                          <ShieldCheck size={12} /> Verified
                        </span>
                        {club.recruitmentActive && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[9px] font-black uppercase tracking-wider animate-pulse">
                            <Sparkles size={10} /> Hiring
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title & Tagline */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                          {club.category}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-[10px] font-bold text-[var(--text-secondary)]">MITS Campus</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight group-hover:text-blue-400 transition-colors">
                        {club.name}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                        {club.tagline || club.description || 'Active campus student community at MITS Gwalior.'}
                      </p>
                    </div>

                    {/* Subdomain Accessibility Box */}
                    <div
                      onClick={e => e.stopPropagation()}
                      className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Globe size={14} className="text-cyan-400 shrink-0" />
                        <span className="font-mono text-[11px] font-bold text-slate-300 truncate">
                          {slug}.clixmits.vercel.app
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={e => handleCopySubdomain(e, club)}
                          title="Copy subdomain URL"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                        >
                          {isCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        </button>

                        <button
                          type="button"
                          onClick={e => handleOpenSubdomain(e, club)}
                          title="Open club website"
                          className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white transition-all"
                        >
                          <ExternalLink size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Stats & Leadership snippet */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[11px]">
                      <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                        <Users size={13} className="text-blue-400" />
                        <span className="font-bold text-white">{club.membersCount || 40}+</span> Members
                      </div>
                      <div className="flex items-center gap-1.5 text-[var(--text-secondary)] justify-end">
                        <Building2 size={13} className="text-amber-400" />
                        <span className="truncate max-w-[110px] text-right font-medium">{club.leadership?.President || 'Student Led'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-5 mt-4 border-t border-white/10 flex items-center justify-between relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Enter Portal <ArrowRight size={13} />
                    </span>

                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        onEnterClub(club.id);
                      }}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider transition-colors shadow-lg"
                    >
                      View Club
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default ClubDirectoryPublic;
