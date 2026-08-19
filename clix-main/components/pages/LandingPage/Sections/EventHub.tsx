import React from 'react';
import { Activity, Calendar } from 'lucide-react';
import { Event } from '@/types';

interface EventHubProps {
  isDarkMode: boolean;
  upcomingEvents: Event[];
  onNavigate?: (page: string) => void;
  onLogin: () => void;
}

export const EventHub: React.FC<EventHubProps> = ({ isDarkMode, upcomingEvents, onNavigate, onLogin }) => (
  <section className={`py-40 border-y glass ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
    <div className="max-w-[1400px] mx-auto px-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
         <div className="space-y-4">
            <div className="flex items-center gap-3">
               <Activity size={16} className="text-primary animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Live Operations</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight">Events Infrastructure.</h2>
         </div>
         <button onClick={() => onNavigate?.('events')} className="px-8 py-4 rounded-2xl glass border-[var(--border-color)] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all">
            Explore All Events
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {upcomingEvents.map(event => (
          <div key={event.id} className="bento-card group flex flex-col justify-between min-h-[400px]">
            <div>
               <div className="flex justify-between items-center mb-10">
                  <span className="px-4 py-2 rounded-xl bg-primary-soft text-primary text-[9px] font-black uppercase tracking-widest border border-primary/20">{event.type}</span>
                  <div className="flex flex-col items-end">
                     <span className="text-4xl font-black text-primary leading-none">{new Date(event.date).getDate()}</span>
                     <span className="text-[10px] font-black uppercase text-[var(--text-secondary)]">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                  </div>
               </div>
               <h3 className="text-2xl font-black tracking-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">{event.title}</h3>
               <p className="text-[var(--text-secondary)] font-medium line-clamp-3 leading-relaxed">{event.description}</p>
            </div>
            <button onClick={onLogin} className="w-full mt-10 py-5 bg-[var(--text-main)] text-[var(--bg-main)] rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary transition-all">
               Secure Pass
            </button>
          </div>
        ))}
        {upcomingEvents.length === 0 && (
          <div className="col-span-full py-32 text-center glass border-2 border-dashed rounded-[3rem]">
            <Calendar size={60} className="mx-auto mb-6 text-[var(--text-secondary)] opacity-30" />
            <p className="text-xs font-black uppercase tracking-[0.5em] text-[var(--text-secondary)]">Subsystem Quiet: No Upcoming Sequences</p>
          </div>
        )}
      </div>
    </div>
  </section>
);
