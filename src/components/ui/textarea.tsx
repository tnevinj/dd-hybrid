import React from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
          'placeholder:text-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'resize-none',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';