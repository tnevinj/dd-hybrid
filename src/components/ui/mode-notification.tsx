import React from 'react';
import { cn } from '@/lib/utils';

interface ModeNotificationProps {
  mode: 'traditional' | 'assisted' | 'autonomous';
  title: string;
  description: string;
  className?: string;
}

const modeStyles = {
  traditional: {
    container: 'bg-gray-50 border-gray-200',
    title: 'text-gray-800',
    description: 'text-gray-600'
  },
  assisted: {
    container: 'bg-purple-50 border-purple-200',
    title: 'text-purple-800',
    description: 'text-purple-600'
  },
  autonomous: {
    container: 'bg-green-50 border-green-200',
    title: 'text-green-800',
    description: 'text-green-600'
  }
};

export function ModeNotification({ mode, title, description, className }: ModeNotificationProps) {
  const styles = modeStyles[mode];

  return (
    <div 
      className={cn(
        'fixed bottom-5 right-5 max-w-sm z-50 border rounded-lg p-4 shadow-lg',
        styles.container,
        className
      )}
    >
      <h4 className={cn('font-medium', styles.title)}>
        {title}
      </h4>
      <p className={cn('text-sm mt-1', styles.description)}>
        {description}
      </p>
    </div>
  );
}