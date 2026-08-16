import React from 'react';
import { UniversityBackground } from '../../ui/UniversityBackground';

interface LayoutProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onBack: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const PublicLayout: React.FC<LayoutProps> = ({ title, subtitle, icon, onBack, children, actions }) => (
  <div className="min-h-screen font-sans uni-shell text-[var(--text-main)]">
    <button
      type="button"
      onClick={onBack}
      className="fixed top-6 left-6 z-50 p-3 uni-pill uni-header-pill text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors"
      title="Back"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <section className="relative pt-28 pb-16 px-6">
      <div className="max-w-[1000px] mx-auto text-center relative z-10 uni-pill-card p-8 md:p-12">
        <span className="uni-badge mb-6">Clix Hub</span>
        {icon && (
          <div className="inline-flex items-center justify-center w-14 h-14 uni-pill bg-[var(--primary-soft)] text-primary mb-6">
            {icon}
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--text-main)] mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">{subtitle}</p>
        )}
        {actions && <div className="flex justify-center mt-8">{actions}</div>}
        <div className="uni-divider-gold mx-auto mt-8" />
      </div>
    </section>

    <UniversityBackground className="px-6 pb-20">
      <div className="max-w-[1200px] mx-auto">{children}</div>
    </UniversityBackground>
  </div>
);
