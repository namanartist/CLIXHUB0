import React, { useState } from 'react';
import { Club } from '../../types';
import { Search, Globe, Users, ArrowUpRight, Zap, ArrowRight, Activity, Target, ShieldCheck } from 'lucide-react';

const DirectoryHero: React.FC<any> = ({ isDarkMode, clubCount }) => (
  <section className="relative pt-48 pb-32 px-8 overflow-hidden bg-transparent">
    <div className="absolute inset-0 bg-grid-white opacity-5" />
    <div className="max-w-7xl mx-auto text-center relative z-10 space-y-10">
      <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-cyan-400/30 bg-cyan-400/5 backdrop-blur-md mb-8 animate-in slide-in-from-top-4 duration-1000">
        <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span></span>
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400">Club Ecosystem Nexus</span>
      </div>
      <h1 className="text-6xl md:text-9xl font-black tracking-[-0.05em] leading-none mb-6 uppercase italic text-[var(--text-main)]">Join Your <br/><span className="text-emphasis">Community.</span></h1>
      <p className="text-xl md:text-2xl text-[var(--text-main)]/40 max-w-3xl mx-auto leading-relaxed mb-10 font-medium italic">"{clubCount}+ student-led communities. Specialized wings in Tech, Culture, and Social Impact. Your journey starts here."</p>
    </div>
  </section>
);

const DirectoryFilters: React.FC<any> = ({ isDarkMode, searchTerm, setSearchTerm, categories, selectedCategory, setSelectedCategory }) => (
  <section className="py-12 px-8 sticky top-0 z-40 backdrop-blur-3xl bg-transparent/80 border-b border-[var(--border-color)]">
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-center justify-between">
      <div className="relative flex-1 w-full max-w-xl group">
        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] opacity-50 group-focus-within:text-cyan-400 transition-all" size={20} />
        <input type="text" placeholder="Locate Community Node..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full rounded-[2rem] pl-20 pr-8 h-18 bg-white/2 border border-[var(--border-color)] text-sm font-black uppercase tracking-widest text-[var(--text-main)] outline-none focus:border-cyan-400/50 transition-all" />
      </div>
      <div className="flex gap-3 p-3 bg-white/2 border border-[var(--border-color)] rounded-[2.5rem] overflow-x-auto no-scrollbar max-w-full">
        {categories.map((cat: string) => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-cyan-500 text-black shadow-2xl shadow-cyan-500/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>{cat}</button>
        ))}
      </div>
    </div>
  </section>
);

const ClubGrid: React.FC<any> = ({ filteredClubs, handleClubClick }) => (
  <section className="py-32 px-8 bg-transparent">
    <div className="max-w-7xl mx-auto space-y-20">
      <div className="flex items-end justify-between"><div className="space-y-4"><p className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400">Directory Matrix</p><h2 className="text-5xl md:text-7xl font-black text-[var(--text-main)] italic tracking-tighter uppercase leading-none">{filteredClubs.length} Sectors <span className="opacity-20">Online</span></h2></div></div>
      {filteredClubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredClubs.map((club: Club) => (
            <div key={club.id} onClick={() => handleClubClick(club.id)} className="group relative p-12 uni-pill-card rounded-[4rem] border border-[var(--border-color)] transition-all hover:scale-[1.02] hover:border-cyan-400/30 cursor-pointer overflow-hidden shadow-2xl min-h-[450px] flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-12 opacity-0 group-hover:opacity-10 transition-all pointer-events-none"><Zap size={200} /></div>
              <div className="relative z-10 space-y-10">
                <div className="flex items-start justify-between">
                  <div className="w-24 h-24 rounded-[2.5rem] bg-[var(--primary-soft)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-main)] font-black text-4xl italic shadow-2xl group-hover:scale-110 transition-transform" style={{ color: club.themeColor }}>{club.name[0]}</div>
                  <div className="px-5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={14}/> Verified</div>
                </div>
                <div className="space-y-4">
                   <div className="flex items-center gap-3"><span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">{club.category} Sector</span><div className="w-1 h-1 rounded-full bg-slate-700" /><span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">MITS_CORE</span></div>
                   <h3 className="text-4xl font-black text-[var(--text-main)] italic tracking-tighter uppercase leading-none group-hover:text-cyan-400 transition-colors">{club.name}</h3>
                   <p className="text-lg font-medium leading-relaxed text-[var(--text-main)]/40 italic">"{club.tagline || `The official institutional node for ${club.category} advancement.`}"</p>
                </div>
              </div>
              <div className="pt-10 border-t border-[var(--border-color)] flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3"><Users className="text-[var(--text-secondary)] opacity-50" size={20} /><span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-main)]/30 italic">Active Community</span></div>
                <button className="p-5 bg-white text-black rounded-2xl shadow-2xl group-hover:bg-cyan-400 transition-colors"><ArrowUpRight size={24} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-40 text-center space-y-8 opacity-20"><Globe size={120} className="mx-auto" /><p className="text-3xl font-black uppercase tracking-[0.5em] italic">No Nodes Detected</p></div>
      )}
    </div>
  </section>
);

interface Props {
  clubs: Club[];
  onEnterClub: (id: string) => void;
  isDarkMode: boolean;
  onBack?: () => void;
}

const ClubDirectoryPublic: React.FC<Props> = ({ clubs, onEnterClub, isDarkMode, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Technical', 'Cultural', 'Social', 'Sports'];
  const filteredClubs = clubs.filter(club => (selectedCategory === 'All' || club.category === selectedCategory) && club.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-transparent animate-in fade-in duration-700">
      <DirectoryHero isDarkMode={isDarkMode} clubCount={clubs.length} />
      <DirectoryFilters isDarkMode={isDarkMode} searchTerm={searchTerm} setSearchTerm={setSearchTerm} categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      <ClubGrid filteredClubs={filteredClubs} handleClubClick={onEnterClub} />
    </div>
  );
};

export default ClubDirectoryPublic;
