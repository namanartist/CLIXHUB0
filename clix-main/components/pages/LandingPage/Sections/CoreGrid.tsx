import React from 'react';
import { Monitor, ArrowUpRight, Award, Cpu, CreditCard } from 'lucide-react';

interface CoreGridProps {
  onNavigate?: (page: string) => void;
}

export const CoreGrid: React.FC<CoreGridProps> = ({ onNavigate }) => (
  <section className="py-24 md:py-32 px-6 md:px-8 relative overflow-hidden">
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-16 space-y-4">
        <span className="uni-badge">Campus services</span>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--text-main)] max-w-3xl">
          Everything your university life needs, in one place.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          type="button"
          onClick={() => onNavigate?.('clubs')}
          className="uni-glass uni-glass-hover rounded-2xl p-8 text-left min-h-[280px] flex flex-col justify-between group"
        >
          <div className="w-14 h-14 rounded-2xl uni-btn-primary flex items-center justify-center text-white group-hover:scale-105 transition-transform">
            <Monitor size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-[var(--text-main)] mb-3">Club directory</h3>
            <p className="text-[var(--text-secondary)] font-medium leading-relaxed mb-4">
              Browse all MITS clubs, view leadership, and join recruitment cycles.
            </p>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary inline-flex items-center gap-2">
              Open directory <ArrowUpRight size={14} />
            </span>
          </div>
        </button>

        <div className="uni-glass rounded-2xl p-8 flex flex-col justify-between min-h-[280px]">
          <div className="w-14 h-14 rounded-2xl bg-[var(--primary-soft)] text-primary flex items-center justify-center">
            <Award size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-[var(--text-main)] mb-3">Verified certificates</h3>
            <p className="text-[var(--text-secondary)] font-medium leading-relaxed">
              Issue and verify event certificates with institutional records.
            </p>
          </div>
        </div>

        <div className="uni-glass rounded-2xl p-8 flex flex-col justify-between min-h-[220px] relative overflow-hidden">
          <Cpu size={120} className="absolute -right-4 -top-4 text-[var(--text-secondary)] opacity-[0.06]" />
          <h3 className="text-xl font-black text-[var(--text-main)] relative z-10">Recruitment</h3>
          <p className="text-[var(--text-secondary)] font-medium relative z-10">
            Track applications, interviews, and club onboarding in one workflow.
          </p>
        </div>

        <div className="uni-glass rounded-2xl p-8 flex items-center gap-6 min-h-[220px]">
          <div className="w-16 h-16 rounded-2xl bg-[var(--primary-soft)] text-primary flex items-center justify-center shrink-0">
            <CreditCard size={28} />
          </div>
          <div>
            <h3 className="text-xl font-black text-[var(--text-main)] mb-2">Events & payments</h3>
            <p className="text-[var(--text-secondary)] font-medium text-sm">
              Register for events, manage tickets, and complete fee verification online.
            </p>
          </div>
        </div>

        <div className="uni-glass rounded-2xl p-8 flex items-center gap-6 min-h-[220px] md:col-span-2">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 text-blue-500 flex items-center justify-center shrink-0 border border-blue-500/20">
            <Monitor size={28} />
          </div>
          <div>
            <h3 className="text-xl font-black text-[var(--text-main)] mb-2">User Registry & Live Sync</h3>
            <p className="text-[var(--text-secondary)] font-medium text-sm">
              Search and govern credentials for Students, Faculty members, and Admins with sub-second real-time database synchronization.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);
