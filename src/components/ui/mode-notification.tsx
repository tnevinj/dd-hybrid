import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface ModeNotificationProps {
  mode: 'traditional' | 'assisted' | 'autonomous';
  title: string;
  description: string;
  className?: string;
  onClose?: () => void;
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

export function ModeNotification({ mode, title, description, className, onClose }: ModeNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const styles = modeStyles[mode];

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div 
      className={cn(
        'fixed bottom-5 right-5 max-w-sm z-50 border rounded-lg p-4 shadow-lg',
        styles.container,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className={cn('font-medium', styles.title)}>
            {title}
          </h4>
          <p className={cn('text-sm mt-1', styles.description)}>
            {description}
          </p>
        </div>
        <button
          onClick={handleClose}
          className={cn(
            'ml-2 p-1 rounded-full hover:bg-black/5 transition-colors flex-shrink-0',
            mode === 'autonomous' ? 'hover:bg-green-200' : 
            mode === 'assisted' ? 'hover:bg-purple-200' : 'hover:bg-gray-200'
          )}
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}