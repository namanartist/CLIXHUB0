import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

/** Ambient university campus background — glass panels sit on top */
export const UniversityBackground: React.FC<Props> = ({ children, className = '' }) => (
  <div className={`uni-shell relative min-h-full ${className}`}>
    <div className="uni-bg-ambient" aria-hidden />
    <div className="uni-bg-grid" aria-hidden />
    <div className="relative z-[1]">{children}</div>
  </div>
);

export default UniversityBackground;
