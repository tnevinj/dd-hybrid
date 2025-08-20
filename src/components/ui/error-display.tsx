import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ErrorDisplayProps {
  title?: string
  message?: string
  error?: Error | string
  onRetry?: () => void
  onGoHome?: () => void
  className?: string
  variant?: 'default' | 'card' | 'inline'
}

export function ErrorDisplay({
  title = 'Something went wrong',
  message,
  error,
  onRetry,
  onGoHome,
  className,
  variant = 'default'
}: ErrorDisplayProps) {
  const errorMessage = React.useMemo(() => {
    if (message) return message
    if (error) {
      return typeof error === 'string' ? error : error.message
    }
    return 'An unexpected error occurred. Please try again.'
  }, [message, error])

  const content = (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="mb-4 p-3 bg-red-100 rounded-full">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {errorMessage}
      </p>
      
      <div className="flex space-x-3">
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </Button>
        )}
        
        {onGoHome && (
          <Button onClick={onGoHome} variant="default" className="flex items-center space-x-2">
            <Home className="h-4 w-4" />
            <span>Go Home</span>
          </Button>
        )}
      </div>
    </div>
  )

  if (variant === 'card') {
    return (
      <Card className={cn('max-w-md mx-auto', className)}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span>Error</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {content}
        </CardContent>
      </Card>
    )
  }

  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md', className)}>
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-medium">{title}</p>
          <p className="text-sm text-red-500">{errorMessage}</p>
        </div>
        {onRetry && (
          <Button onClick={onRetry} variant="ghost" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className={cn('flex items-center justify-center h-96', className)}>
      {content}
    </div>
  )
}

// Error state wrapper component
interface ErrorStateProps {
  error: Error | string | null
  title?: string
  message?: string
  onRetry?: () => void
  onClear?: () => void
  className?: string
  variant?: 'default' | 'card' | 'inline'
  children: React.ReactNode
}

export function ErrorState({
  error,
  title,
  message,
  onRetry,
  onClear,
  className,
  variant = 'default',
  children
}: ErrorStateProps) {
  const handleRetry = React.useCallback(() => {
    if (onClear) onClear()
    if (onRetry) onRetry()
  }, [onClear, onRetry])

  if (error) {
    return (
      <ErrorDisplay
        title={title}
        message={message}
        error={error}
        onRetry={handleRetry}
        className={className}
        variant={variant}
      />
    )
  }

  return <>{children}</>
}

// Simple error message component
export function ErrorMessage({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <div className={cn('flex items-center space-x-2 text-red-600', className)}>
      <AlertCircle className="h-4 w-4" />
      <span className="text-sm">{children}</span>
    </div>
  )
}