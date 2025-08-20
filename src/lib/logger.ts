/**
 * Structured Logging Service
 * 
 * Professional logging system with different levels, structured data,
 * and environment-based configuration to replace console logging.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogContext {
  [key: string]: any
  userId?: string
  sessionId?: string
  module?: string
  component?: string
  action?: string
  metadata?: Record<string, any>
}

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: LogContext
  error?: Error
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isClient = typeof window !== 'undefined'
  
  // Log level hierarchy: debug < info < warn < error
  private logLevels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  }
  
  // Current minimum log level (configurable via environment)
  private minLevel: LogLevel = (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) || 
    (this.isDevelopment ? 'debug' : 'info')

  private shouldLog(level: LogLevel): boolean {
    return this.logLevels[level] >= this.logLevels[this.minLevel]
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`
    
    if (context?.module || context?.component) {
      const location = [context.module, context.component].filter(Boolean).join('/')
      return `${prefix} [${location}] ${message}`
    }
    
    return `${prefix} ${message}`
  }

  private createLogEntry(level: LogLevel, message: string, context?: LogContext, error?: Error): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error
    }
  }

  private outputLog(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return

    const formattedMessage = this.formatMessage(entry.level, entry.message, entry.context)
    
    // In production, you might want to send to a logging service
    // For now, we'll use console but in a structured way
    if (this.isDevelopment) {
      switch (entry.level) {
        case 'debug':
          console.debug(formattedMessage, entry.context)
          break
        case 'info':
          console.info(formattedMessage, entry.context)
          break
        case 'warn':
          console.warn(formattedMessage, entry.context, entry.error)
          break
        case 'error':
          console.error(formattedMessage, entry.context, entry.error)
          break
      }
    } else {
      // In production, send structured logs to external service
      // For now, still using console but could be replaced with:
      // - Sentry for error tracking
      // - LogRocket for user sessions
      // - Datadog for metrics
      // - Custom logging endpoint
      
      if (entry.level === 'error' || entry.level === 'warn') {
        console[entry.level](formattedMessage, {
          context: entry.context,
          error: entry.error?.stack || entry.error
        })
      }
    }
    
    // Store logs for potential debugging (client-side only)
    if (this.isClient && this.isDevelopment) {
      this.storeLogInMemory(entry)
    }
  }

  private logBuffer: LogEntry[] = []
  private maxBufferSize = 100

  private storeLogInMemory(entry: LogEntry): void {
    this.logBuffer.push(entry)
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift() // Remove oldest entry
    }
  }

  // Public API methods
  debug(message: string, context?: LogContext): void {
    this.outputLog(this.createLogEntry('debug', message, context))
  }

  info(message: string, context?: LogContext): void {
    this.outputLog(this.createLogEntry('info', message, context))
  }

  warn(message: string, context?: LogContext, error?: Error): void {
    this.outputLog(this.createLogEntry('warn', message, context, error))
  }

  error(message: string, context?: LogContext, error?: Error): void {
    this.outputLog(this.createLogEntry('error', message, context, error))
  }

  // Convenience methods for common scenarios
  apiCall(method: string, url: string, status?: number, duration?: number): void {
    this.info(`API ${method} ${url}`, {
      module: 'api',
      action: 'http_request',
      metadata: { method, url, status, duration }
    })
  }

  componentMount(componentName: string, props?: Record<string, any>): void {
    this.debug(`Component mounted: ${componentName}`, {
      module: 'ui',
      component: componentName,
      action: 'mount',
      metadata: props
    })
  }

  userAction(action: string, data?: Record<string, any>, userId?: string): void {
    this.info(`User action: ${action}`, {
      module: 'user',
      action,
      userId,
      metadata: data
    })
  }

  stateChange(storeName: string, action: string, data?: Record<string, any>): void {
    this.debug(`State change in ${storeName}: ${action}`, {
      module: 'store',
      component: storeName,
      action: 'state_change',
      metadata: data
    })
  }

  // Error boundary logging
  errorBoundary(error: Error, errorInfo: any, componentStack?: string): void {
    this.error('Error Boundary caught error', {
      module: 'error_boundary',
      action: 'catch_error',
      metadata: { 
        componentStack,
        errorInfo 
      }
    }, error)
  }

  // Performance logging
  performance(name: string, duration: number, metadata?: Record<string, any>): void {
    this.debug(`Performance: ${name} took ${duration}ms`, {
      module: 'performance',
      action: 'measurement',
      metadata: { name, duration, ...metadata }
    })
  }

  // Get buffered logs (for debugging)
  getRecentLogs(): LogEntry[] {
    return [...this.logBuffer]
  }

  // Clear log buffer
  clearLogs(): void {
    this.logBuffer = []
  }
}

// Export singleton instance
export const logger = new Logger()

// Development helper to access logger from browser console
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  ;(window as any).logger = logger
}