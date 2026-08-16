import React from 'react';
import { Users, Globe, Calendar, Activity } from 'lucide-react';

interface StatsSectionProps {
  studentsCount: number;
  clubsCount: number;
  eventsCount: number;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ studentsCount, clubsCount, eventsCount }) => (
  <section id="stats-section" className="py-16 relative px-6 md:px-8 border-y border-[var(--border-color)]">
    <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
      {[
        { value: studentsCount.toLocaleString() + '+', label: 'Students', icon: Users },
        { value: clubsCount + '+', label: 'Clubs', icon: Globe },
        { value: eventsCount + '+', label: 'Events', icon: Calendar },
        { value: 'Live', label: 'Portal status', icon: Activity },
      ].map(stat => (
        <div key={stat.label} className="uni-glass rounded-2xl p-6 flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[var(--primary-soft)] text-primary flex items-center justify-center">
            <stat.icon size={22} strokeWidth={2.5} />
          </div>
          <p className="text-3xl font-black tracking-tight text-[var(--text-main)]">{stat.value}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">{stat.label}</p>
        </div>
      ))}
    </div>
  </section>
);
