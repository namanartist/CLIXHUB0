import React from 'react';
import { ShieldCheck, BookOpen } from 'lucide-react';

export const HeroSide: React.FC = () => (
  <div className="hidden lg:flex lg:w-[42%] flex-col justify-between p-12 xl:p-20 border-r border-[var(--glass-morphism-border)] uni-glass-strong relative overflow-hidden">
    <div className="uni-bg-orb uni-bg-orb--gold !w-64 !h-64 !top-0 !right-0 !left-auto opacity-60" aria-hidden />

    <div className="flex items-center gap-4 relative z-10 reveal">
      <img src="/image.png" alt="MITS Logo" className="w-14 h-14 rounded-2xl shadow-glass-lg" />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-[var(--text-main)]">Clix Hub</h1>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--uni-gold)]">MITS Gwalior</p>
      </div>
    </div>

    <div className="space-y-10 relative z-10">
      <div className="space-y-5 reveal">
        <span className="uni-badge uni-badge-gold">Secure sign-in</span>
        <h2 className="text-5xl xl:text-6xl font-black tracking-tight leading-[1.05] text-[var(--text-main)]">
          University portal for students & faculty
        </h2>
        <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-md">
          Access clubs, register for events, manage certificates, and collaborate across campus — all in one place.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 reveal">
        <div className="uni-glass rounded-2xl p-5 uni-glass-hover">
          <BookOpen className="text-primary mb-3" size={22} />
          <span className="uni-stat-value text-2xl block">40+</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Active clubs</span>
        </div>
        <div className="uni-glass rounded-2xl p-5 uni-glass-hover">
          <ShieldCheck className="text-[var(--uni-gold)] mb-3" size={22} />
          <span className="uni-stat-value text-2xl block">10k+</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Students</span>
        </div>
      </div>
    </div>

    <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-secondary)] opacity-60 relative z-10">
      Madhav Institute of Technology & Science
    </p>
  </div>
);
