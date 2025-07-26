import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number; // 0-100
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export const Progress: React.FC<ProgressProps> = ({ 
  value, 
  className, 
  size = 'md',
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const variantClasses = {
    default: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600'
  };

  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizeClasses[size], className)}>
      <div
        className={cn('transition-all duration-300 ease-out rounded-full', sizeClasses[size], variantClasses[variant])}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
};