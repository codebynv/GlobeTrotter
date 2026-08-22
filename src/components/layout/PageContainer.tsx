import React from 'react';

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export function PageContainer({
  children,
  className = '',
  size = 'lg',
}: PageContainerProps) {
  const maxSizes = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className={`mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 ${maxSizes[size]} ${className}`}>
      {children}
    </div>
  );
}
