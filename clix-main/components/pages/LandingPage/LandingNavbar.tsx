import React from 'react';
import { GraduationCap, ArrowRight, Globe, Calendar, Activity, Award, Sun, Moon, Menu, X, Terminal, Shield } from 'lucide-react';

interface LandingNavbarProps {
  isDarkMode: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (val: boolean) => void;
  onLogin: () => void;
  onRegister: () => void;
  onNavigate?: (page: string) => void;
  onToggleTheme?: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  isDarkMode,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onLogin,
  onRegister,
  onNavigate,
  onToggleTheme,
}) => (
  <header className="fixed top-0 left-0 right-0 z-50 px-3 md:px-6 pt-3 pb-2 pointer-events-none">
    <nav className="uni-header-pill pointer-events-auto max-w-[1500px] mx-auto h-14 md:h-16 px-4 md:px-6 flex items-center justify-between gap-3">
      <button
        type="button"
        className="flex items-center gap-3 min-w-0"
        onClick={() => onNavigate?.('dashboard')}
      >
        <img
          src="/image.png"
          alt="CLIX Logo"
          className="w-10 h-10 rounded-2xl object-cover shrink-0 shadow-sm border border-[var(--border-color)]"
        />
        <div className="text-left min-w-0 hidden sm:block">
          <p className="text-sm font-bold text-[var(--text-main)] leading-tight">Clix Hub</p>
          <p className="text-[9px] uppercase tracking-wider text-[var(--text-secondary)]">Club Lifecycle & Experience Hub</p>
        </div>
      </button>

      <div className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-[var(--primary-soft)] border border-[var(--border-color)]">
        {[
          { label: 'Clubs', action: () => onNavigate?.('clubs') },
          { label: 'Events', action: () => onNavigate?.('events') },
          { label: 'Live feed', action: () => onNavigate?.('live-feed') },
          { label: 'Propose', action: () => onNavigate?.('proposal-workflow') },
          { label: 'Verify', action: () => onNavigate?.('verify-cert') },
          { label: 'Developer', action: () => onNavigate?.('developers') },
        ].map(item => (
          <button
            key={item.label}
            type="button"
            onClick={item.action}
            className="uni-pill px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] transition-colors"
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {onToggleTheme && (
          <button
            type="button"
            onClick={onToggleTheme}
            className="w-10 h-10 uni-pill flex items-center justify-center bg-[var(--primary-soft)] text-[var(--text-secondary)] hidden sm:flex"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        )}
        <button
          type="button"
          onClick={onLogin}
          className="hidden sm:flex uni-pill px-5 py-2.5 uni-btn-primary text-white text-sm font-semibold items-center gap-2"
        >
          Sign in <ArrowRight size={16} />
        </button>
        <button
          type="button"
          className="lg:hidden w-10 h-10 uni-pill flex items-center justify-center bg-[var(--primary-soft)] text-[var(--text-main)]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </nav>

    {isMobileMenuOpen && (
      <div className="lg:hidden pointer-events-auto max-w-[1500px] mx-auto mt-2 uni-pill-card p-4 space-y-1 animate-in slide-in-from-top-2">
        {[
          { label: 'Clubs', action: () => onNavigate?.('clubs'), icon: Globe },
          { label: 'Events', action: () => onNavigate?.('events'), icon: Calendar },
          { label: 'Live feed', action: () => onNavigate?.('live-feed'), icon: Activity },
          { label: 'Propose', action: () => onNavigate?.('proposal-workflow'), icon: Shield },
          { label: 'Verify credentials', action: () => onNavigate?.('verify-cert'), icon: Award },
          { label: 'Developer', action: () => onNavigate?.('developers'), icon: Terminal },
        ].map(item => (
          <button
            key={item.label}
            type="button"
            onClick={() => { item.action(); setIsMobileMenuOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-[var(--text-main)] hover:bg-[var(--primary-soft)] text-sm font-medium"
          >
            <item.icon size={18} className="text-primary" />
            {item.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => { onLogin(); setIsMobileMenuOpen(false); }}
          className="w-full mt-2 uni-pill py-3 uni-btn-primary text-white font-semibold text-sm"
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => { onRegister(); setIsMobileMenuOpen(false); }}
          className="w-full uni-pill py-3 border border-[var(--border-color)] text-sm font-medium"
        >
          Create account
        </button>
      </div>
    )}
  </header>
);
