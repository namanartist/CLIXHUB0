import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

interface PublicLightShellProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Forces a clean light university theme on public routes (verify, register)
 * regardless of global dark mode.
 */
export const PublicLightShell: React.FC<PublicLightShellProps> = ({ children, className = '' }) => (
  <div className={`public-light-page min-h-screen ${className}`}>
    <div className="public-light-page__orb public-light-page__orb--navy" aria-hidden />
    <div className="public-light-page__orb public-light-page__orb--gold" aria-hidden />
    <header className="public-light-page__header">
      <Link to="/" className="public-light-page__brand">
        <img
          src="/image.png"
          alt="CLIX Logo"
          className="w-10 h-10 rounded-2xl object-cover shadow-sm border border-[var(--border-color)]"
        />
        <span>
          <strong>Clix Hub</strong>
          <small>Madhav Institute of Technology &amp; Science</small>
        </span>
      </Link>
    </header>
    <main className="public-light-page__main">{children}</main>
  </div>
);

export default PublicLightShell;
