import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const pad = { sm: 'p-4', md: 'p-6', lg: 'p-8' };

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  onClick,
}) => {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`uni-pill-card ${pad[padding]} ${hover ? 'uni-glass-hover' : ''} ${onClick ? 'text-left w-full' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
};

export default GlassCard;
