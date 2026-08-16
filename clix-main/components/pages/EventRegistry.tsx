import React, { useState, useMemo } from 'react';
import { Event, Club } from '../../types';
import { Calendar, MapPin, ArrowUpRight, Search } from 'lucide-react';

interface EventHeroProps {
  isDarkMode: boolean;
  eventCount: number;
}

const EventHero: React.FC<EventHeroProps> = ({ isDarkMode, eventCount }) => (
  <section className="relative pt-32 pb-24 px-6 overflow-hidden">
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className={`absolute top-20 right-1/3 w-[600px] h-[600px] rounded-full blur-[150px] animate-pulse ${isDarkMode ? 'bg-[#0099FF]/15' : 'bg-blue-200/40'}`} style={{ animationDuration: '4s' }} />
      <div className={`absolute -bottom-20 left-1/2 w-[800px] h-[400px] rounded-full blur-[120px] ${isDarkMode ? 'bg-blue-900/8' : 'bg-blue-50/30'}`} />
    </div>
    <div className="max-w-[1200px] mx-auto text-center relative z-10">
      <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border backdrop-blur-md mb-8" style={{ borderColor: isDarkMode ? 'rgba(34,211,238,0.3)' : 'rgba(34,211,238,0.2)', background: isDarkMode ? 'rgba(34,211,238,0.08)' : 'rgba(34,211,238,0.06)' }}>
        <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span></span>
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400">Campus Events Registry</span>
      </div>
      <h1 className="text-6xl md:text-7xl font-black tracking-[-0.04em] leading-[0.88] mb-6">
        <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>Discover</span><br />
        <span className="text-emphasis">Campus events</span>
      </h1>
      <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
        Explore {eventCount || 100}+ academic, cultural, and technical events. Register. Participate. Get verified credentials.
      </p>
    </div>
  </section>
);

interface EventFiltersProps {
  isDarkMode: boolean;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  filterType: 'All' | 'Upcoming' | 'Past';
  setFilterType: (val: 'All' | 'Upcoming' | 'Past') => void;
}

const EventFilters: React.FC<EventFiltersProps> = ({ isDarkMode, searchTerm, setSearchTerm, filterType, setFilterType }) => (
  <section className={`sticky top-0 z-40 backdrop-blur-2xl border-y ${isDarkMode ? 'bg-[#02040a]/80 border-white/5' : 'bg-white/80 border-slate-200'}`}>
    <div className="max-w-[1200px] mx-auto py-6 px-6">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="relative w-full md:w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
          <input type="text" placeholder="Search by title, club or domain..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`w-full pl-12 pr-6 py-4 rounded-2xl border outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all font-medium text-sm ${isDarkMode ? 'bg-white/[0.03] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
        </div>
        <div className={`flex p-1.5 rounded-2xl border ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-slate-100/50 border-slate-200'}`}>
          {['All', 'Upcoming', 'Past'].map((type) => (
            <button key={type} onClick={() => setFilterType(type as any)} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterType === type ? (isDarkMode ? 'bg-[#0099FF] text-white' : 'bg-white text-slate-900 shadow-md') : (isDarkMode ? 'text-slate-500 hover:text-white' : 'text-slate-500 hover:text-slate-900')}`}>{type}</button>
          ))}
        </div>
      </div>
    </div>
  </section>
);

interface EventGridProps {
  isDarkMode: boolean;
  filteredEvents: Event[];
  clubs: Club[];
}

const EventGrid: React.FC<EventGridProps> = ({ isDarkMode, filteredEvents, clubs }) => (
  <section className="py-24 px-6">
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-12">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0099FF] mb-3">Results</p>
        <h2 className={`text-3xl md:text-4xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{filteredEvents.length} Event{filteredEvents.length !== 1 ? 's' : ''} Found</h2>
      </div>
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => {
            const club = clubs.find(c => c.id === event.clubId);
            return (
              <div key={event.id} className={`group relative p-8 rounded-3xl border transition-all hover:scale-[1.02] hover:-translate-y-1 cursor-pointer ${isDarkMode ? 'bg-[#0d121d] border-white/10 hover:border-cyan-400/50 hover:shadow-2xl' : 'bg-white border-slate-200 hover:shadow-xl'}`}>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{club?.name || 'Clix Hub'}</div>
                    <h3 className={`text-2xl font-black tracking-tight group-hover:text-cyan-400 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{event.title}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border whitespace-nowrap ${event.type === 'Paid' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>{event.type}</span>
                </div>
                <p className={`text-sm font-medium line-clamp-2 mb-8 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{event.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className={`flex items-center gap-3 text-xs font-bold p-3 rounded-xl border ${isDarkMode ? 'bg-white/[0.02] text-slate-300 border-white/5' : 'bg-slate-50 text-slate-600 border-slate-100'}`}><Calendar size={14} className="text-cyan-400" /> {event.date}</div>
                  <div className={`flex items-center gap-3 text-xs font-bold p-3 rounded-xl border ${isDarkMode ? 'bg-white/[0.02] text-slate-300 border-white/5' : 'bg-slate-50 text-slate-600 border-slate-100'}`}><MapPin size={14} className="text-cyan-400" /> MITS Campus</div>
                </div>
                <button className={`w-full py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isDarkMode ? 'bg-[#0099FF] text-white hover:bg-[#007ACC] shadow-lg shadow-[#0099FF]/20' : 'bg-cyan-400 text-slate-900 hover:bg-cyan-500 shadow-lg shadow-cyan-400/20'}`}>Register Now <ArrowUpRight size={14} /></button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={`py-20 text-center space-y-4 rounded-3xl border ${isDarkMode ? 'bg-[#0d121d]/50 border-white/5' : 'bg-slate-50 border-slate-200'}`}><Calendar size={64} className="mx-auto text-slate-700" /><p className={`text-xl font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>No events found</p></div>
      )}
    </div>
  </section>
);

interface Props { events: Event[]; clubs: Club[]; onBack: () => void; isDarkMode?: boolean; }

const EventRegistry: React.FC<Props> = ({ events, clubs, onBack, isDarkMode = true }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Upcoming' | 'Past'>('Upcoming');

  const filteredEvents = useMemo(() => {
    const now = new Date();
    return events.filter(e => { const eventDate = new Date(e.date); if (filterType === 'Upcoming') return eventDate >= now; if (filterType === 'Past') return eventDate < now; return true; }).filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase())).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events, searchTerm, filterType]);

  return (
    <div className={`min-h-screen font-sans selection:bg-[#0099FF] selection:text-[var(--text-main)] ${isDarkMode ? 'bg-[#02040a] text-white' : 'bg-[#F4F7FE] text-[#2B3674]'}`}>
      <button onClick={onBack} className={`fixed top-8 left-8 z-50 p-3 rounded-xl transition-all ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`} title="Back"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
      <EventHero isDarkMode={isDarkMode} eventCount={events.length} />
      <EventFilters isDarkMode={isDarkMode} searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterType={filterType} setFilterType={setFilterType} />
      <EventGrid isDarkMode={isDarkMode} filteredEvents={filteredEvents} clubs={clubs} />
    </div>
  );
};

export default EventRegistry;
