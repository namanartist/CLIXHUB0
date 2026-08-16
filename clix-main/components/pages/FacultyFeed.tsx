import React from 'react';
import { User, Club } from '../../types';
import { ShieldCheck, Globe, ArrowRight, Zap, Users, Calendar, Settings } from 'lucide-react';

interface FacultyHeroProps {
  user: User;
  managedClubsCount: number;
}

const FacultyHero: React.FC<FacultyHeroProps> = ({ user, managedClubsCount }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  
  return (
    <header className="relative p-8 md:p-12 rounded-[2.5rem] overflow-hidden border border-[var(--border-color)] shadow-[var(--glass-premium-shadow)] uni-glass-strong">
      {/* Background orb decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="uni-bg-orb uni-bg-orb--navy opacity-10" />
        <div className="uni-bg-grid opacity-20" />
      </div>

      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <ShieldCheck size={200} className="text-[var(--primary)]" />
      </div>

      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1 bg-[var(--primary-soft)] text-[var(--primary)] rounded-full text-[10px] font-black uppercase tracking-[0.25em] border border-[var(--border-color)]">
            Institutional Authority
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-secondary)]">{greeting}, Professor</p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--text-main)] tracking-tight font-display">
            {user.name}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] font-medium max-w-2xl mt-2 leading-relaxed">
            Authenticated as Faculty Coordinator. Actively overseeing and directing <strong>{managedClubsCount}</strong> student councils.
          </p>
        </div>
      </div>
    </header>
  );
};

interface CouncilPortfolioProps {
  managedClubs: Club[];
  onManageClub: (id: string) => void;
}

const CouncilPortfolio: React.FC<CouncilPortfolioProps> = ({ managedClubs, onManageClub }) => (
  <section className="space-y-6">
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center">
          <Globe size={18} />
        </div>
        <h2 className="text-lg font-bold text-[var(--text-main)] tracking-tight">Council Portfolio</h2>
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
        {managedClubs.length} Under Supervision
      </span>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {managedClubs.map(club => (
        <div 
          key={club.id} 
          className="uni-pill-card border border-[var(--border-color)] p-6 sm:p-8 flex flex-col sm:flex-row gap-6 hover:border-[var(--primary)]/35 transition-all group shadow-xl"
        >
          <div 
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-lg group-hover:scale-105 transition-transform shrink-0" 
            style={{ backgroundColor: club.themeColor }}
          >
            {club.name[0]}
          </div>
          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[9px] font-black uppercase tracking-widest text-[var(--primary)] px-2 py-0.5 bg-[var(--primary-soft)] rounded-lg">
                  {club.category}
                </span>
                <span className="text-[9px] font-mono text-[var(--text-secondary)]">
                  {club.subdomain}
                </span>
              </div>
              <h3 className="text-xl font-black text-[var(--text-main)] leading-snug truncate">
                {club.name}
              </h3>
              <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed italic line-clamp-1">
                {club.tagline || 'Leading student engagement and initiative.'}
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex gap-3">
              <button 
                onClick={() => onManageClub(club.id)} 
                className="flex-1 py-3 bg-[var(--primary)] text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:opacity-90 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Settings size={14} /> Enter Panel
              </button>
              <button className="p-3 bg-[var(--primary-soft)] text-[var(--text-secondary)] rounded-xl hover:text-[var(--text-main)] transition-all shrink-0">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {managedClubs.length === 0 && (
        <div className="col-span-2 p-16 border-2 border-dashed border-[var(--border-color)] rounded-[2rem] text-center space-y-4">
          <ShieldCheck size={48} className="mx-auto text-[var(--text-secondary)] opacity-20 animate-pulse" />
          <div className="space-y-1">
            <h3 className="text-base font-black opacity-40 uppercase tracking-widest text-[var(--text-main)]">No Assigned Councils</h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto font-medium">
              Please contact the Student Affairs Cell to bind your Faculty ID.
            </p>
          </div>
        </div>
      )}
    </div>
  </section>
);

const StrategicPulse: React.FC = () => (
  <section className="relative overflow-hidden p-8 rounded-[2.5rem] border border-[var(--border-color)] shadow-[var(--glass-premium-shadow)] bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-transparent flex flex-col md:flex-row items-center justify-between gap-6">
    <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none">
      <Zap size={120} />
    </div>
    <div className="relative z-10 text-center md:text-left space-y-1">
      <h3 className="text-lg font-black tracking-tight text-[var(--text-main)] uppercase">Strategic Integrity Pulse</h3>
      <p className="text-xs text-[var(--text-secondary)] font-medium max-w-xl">
        All coordinator approvals utilize digital certificate signing workflows. Real-time auditing is active on all active club mainframes.
      </p>
    </div>
    <button className="px-6 py-3.5 bg-[var(--primary)] text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl shadow-blue-500/10 hover:-translate-y-0.5 active:scale-95 transition-all shrink-0">
      Launch Auditor Panel
    </button>
  </section>
);

interface Props { 
  user: User; 
  clubs: Club[]; 
  onManageClub: (clubId: string) => void; 
}

const FacultyFeed: React.FC<Props> = ({ user, clubs, onManageClub }) => {
  // Safe filtering: check if user is a designated coordinator or Coordinator Names contains user name
  const managedClubs = (clubs || []).filter(c => 
    c && (
      c.facultyCoordinatorId === user?.id || 
      c.facultyCoordinatorNames?.includes(user?.name || '') ||
      // Fallback search
      (user?.clubMemberships || []).some(m => m?.clubId === c.id && m?.role === 'President')
    )
  );

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      <FacultyHero user={user} managedClubsCount={managedClubs.length} />
      <CouncilPortfolio managedClubs={managedClubs} onManageClub={onManageClub} />
      <StrategicPulse />
    </div>
  );
};

export default FacultyFeed;
