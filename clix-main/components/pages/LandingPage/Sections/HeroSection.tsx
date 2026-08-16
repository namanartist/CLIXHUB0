import React from 'react';
import { ArrowRight, MousePointer2 } from 'lucide-react';
import InstallAppButton from '../../../InstallAppButton';

interface HeroSectionProps {
  onRegister: () => void;
  onNavigate?: (page: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onRegister, onNavigate }) => (
  <section className="relative min-h-[92vh] pt-32 md:pt-40 pb-20 md:pb-24 px-6 md:px-8 overflow-hidden landing-hero-canvas">
    <div className="max-w-[1200px] mx-auto text-center relative z-10">
      <div className="reveal inline-flex items-center gap-3 px-5 py-2.5 rounded-full uni-glass mb-10">
        <span className="uni-badge uni-badge-gold">Clix Hub</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Official Campus Portal</span>
      </div>

      <h1 className="reveal landing-hero-title font-black mb-6 md:mb-8 text-[var(--text-main)]">
        Club Lifecycle & Experience Hub, <br />
        <span className="text-emphasis">one secure hub.</span>
      </h1>

      <p className="reveal text-base md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 font-medium text-[var(--text-secondary)]">
        Clubs, events, certificates, recruitment, and faculty oversight — built for MITS with institutional-grade security and glass-clear transparency.
      </p>

      <div className="reveal flex flex-col sm:flex-row items-center justify-center gap-4">
        <button onClick={onRegister} type="button" className="btn-premium uni-btn-primary px-10 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider flex items-center gap-3">
          Student Login <ArrowRight size={18} />
        </button>
        <button onClick={() => onNavigate?.('platform')} type="button" className="px-10 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider uni-glass uni-glass-hover flex items-center gap-3 text-[var(--text-main)]">
          <MousePointer2 size={18} /> Explore Features
        </button>
        <InstallAppButton variant="hero" />
      </div>
    </div>

    <div className="mt-20 md:mt-24 max-w-[1200px] mx-auto relative reveal">
      <div className="landing-preview-strip">
        {['Live clubs', 'Verified events', 'Smart tickets', 'Certificates', 'Dean approvals'].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </div>
  </section>
);
