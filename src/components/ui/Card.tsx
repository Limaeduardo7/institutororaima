import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'elevated';
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function Card({ children, className = '', variant = 'default', style, onClick }: CardProps) {
  const baseClasses = 'rounded-lg shadow-md overflow-hidden';
  const variantClasses = {
    default: 'glass-card',
    glass: 'glass-card',
    elevated: 'glass-card shadow-xl'
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${onClick ? 'cursor-pointer' : ''}`} 
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`px-6 pb-4 ${className}`}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
}