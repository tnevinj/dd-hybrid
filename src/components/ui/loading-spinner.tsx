import * as React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  title?: string
  description?: string
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-12 w-12', 
  lg: 'h-16 w-16'
}

export function LoadingSpinner({ 
  size = 'md', 
  className, 
  title = 'Loading...', 
  description 
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
          sizeClasses[size],
          className
        )}
      />
      {title && (
        <h3 className="mt-4 text-xl font-semibold text-gray-700">
          {title}
        </h3>
      )}
      {description && (
        <p className="mt-2 text-gray-600 text-center max-w-md">
          {description}
        </p>
      )}
    </div>
  )
}

// Loading state wrapper component
interface LoadingStateProps {
  isLoading: boolean
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children: React.ReactNode
}

export function LoadingState({ 
  isLoading, 
  title, 
  description, 
  size = 'md',
  className,
  children 
}: LoadingStateProps) {
  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center h-96', className)}>
        <LoadingSpinner 
          size={size} 
          title={title} 
          description={description} 
        />
      </div>
    )
  }

  return <>{children}</>
}

// Inline loading indicator
export function InlineLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600" />
      <span className="text-sm text-gray-600">Loading...</span>
    </div>
  )
}