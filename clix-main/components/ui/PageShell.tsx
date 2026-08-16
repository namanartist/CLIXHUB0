import React from 'react';

interface PageShellProps {
  title: React.ReactNode;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

/** Standard university portal page header + glass content area */
export const PageShell: React.FC<PageShellProps> = ({
  title,
  subtitle,
  badge,
  children,
  actions,
}) => (
  <div className="space-y-8 animate-slide-up">
    <header className="uni-pill-card flex flex-col md:flex-row md:items-end justify-between gap-6 p-6 md:p-8">
      <div className="space-y-3">
        {badge && <span className="uni-badge">{badge}</span>}
        <h1 className="uni-text-display font-black tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="uni-text-subtitle max-w-2xl">{subtitle}</p>
        )}
        <div className="uni-divider-gold" />
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </header>
    <div className="space-y-6 uni-page-sections">{children}</div>
  </div>
);

export default PageShell;
