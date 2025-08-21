'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  RefreshCw,
  Home,
  Bug,
  Mail,
  ChevronDown,
  ChevronUp,
  Copy,
  Check
} from 'lucide-react';

interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
  errorBoundaryStack?: string;
}

interface ErrorDetails {
  message: string;
  stack?: string;
  name: string;
  timestamp: Date;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
  moduleContext?: string;
  additionalInfo?: Record<string, any>;
}

interface GlobalErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  retryCount: number;
  isCollapsed: boolean;
  isReporting: boolean;
  reportSent: boolean;
  copied: boolean;
}

interface GlobalErrorBoundaryProps {
  children: React.ReactNode;
  fallbackComponent?: React.ComponentType<{
    error: Error;
    errorInfo: ErrorInfo;
    resetError: () => void;
  }>;
  enableReporting?: boolean;
  maxRetries?: number;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  moduleContext?: string;
  level?: 'module' | 'component' | 'global';
}

export class GlobalErrorBoundary extends React.Component<
  GlobalErrorBoundaryProps,
  GlobalErrorBoundaryState
> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: GlobalErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
      isCollapsed: true,
      isReporting: false,
      reportSent: false,
      copied: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<GlobalErrorBoundaryState> {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, moduleContext } = this.props;
    
    this.setState({
      errorInfo
    });

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }

    // Log error details
    const errorDetails: ErrorDetails = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      timestamp: new Date(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'Unknown',
      moduleContext,
      additionalInfo: {
        componentStack: errorInfo.componentStack,
        retryCount: this.state.retryCount,
        level: this.props.level || 'component'
      }
    };

    console.error('Error Boundary Caught Error:', errorDetails);

    // Report error to monitoring service (if enabled)
    if (this.props.enableReporting) {
      this.reportError(errorDetails);
    }

    // Auto-retry for certain types of errors (with exponential backoff)
    if (this.shouldAutoRetry(error) && this.state.retryCount < (this.props.maxRetries || 3)) {
      const retryDelay = Math.min(1000 * Math.pow(2, this.state.retryCount), 10000);
      
      this.retryTimeoutId = setTimeout(() => {
        this.handleRetry();
      }, retryDelay);
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  shouldAutoRetry = (error: Error): boolean => {
    // Auto-retry for network errors, timeouts, etc.
    const retryableErrors = [
      'ChunkLoadError',
      'NetworkError',
      'TimeoutError',
      'AbortError'
    ];
    
    return retryableErrors.some(errorType => 
      error.name.includes(errorType) || 
      error.message.toLowerCase().includes(errorType.toLowerCase())
    );
  };

  reportError = async (errorDetails: ErrorDetails) => {
    if (this.state.isReporting) return;
    
    this.setState({ isReporting: true });
    
    try {
      // Send error report to your error tracking service
      // This is a placeholder - replace with your actual error reporting service
      const response = await fetch('/api/errors/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...errorDetails,
          errorId: this.state.errorId
        })
      });
      
      if (response.ok) {
        this.setState({ reportSent: true });
      }
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    } finally {
      this.setState({ isReporting: false });
    }
  };

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: prevState.retryCount + 1,
      isCollapsed: true,
      reportSent: false,
      copied: false
    }));
  };

  handleReset = () => {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
    
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
      isCollapsed: true,
      isReporting: false,
      reportSent: false,
      copied: false
    });
  };

  handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  handleToggleDetails = () => {
    this.setState(prevState => ({
      isCollapsed: !prevState.isCollapsed
    }));
  };

  handleCopyError = async () => {
    const { error, errorInfo, errorId } = this.state;
    
    if (!error) return;
    
    const errorText = `
Error ID: ${errorId}
Error: ${error.name}: ${error.message}
Stack: ${error.stack}
Component Stack: ${errorInfo?.componentStack}
Module: ${this.props.moduleContext || 'Unknown'}
Timestamp: ${new Date().toISOString()}
URL: ${typeof window !== 'undefined' ? window.location.href : 'Unknown'}
    `.trim();
    
    try {
      await navigator.clipboard.writeText(errorText);
      this.setState({ copied: true });
      
      setTimeout(() => {
        this.setState({ copied: false });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy error details:', err);
    }
  };

  getErrorSeverity = (error: Error): 'low' | 'medium' | 'high' | 'critical' => {
    const { moduleContext, level } = this.props;
    
    // Critical errors
    if (level === 'global' || error.name === 'ChunkLoadError') {
      return 'critical';
    }
    
    // High severity errors
    if (error.name.includes('TypeError') || error.name.includes('ReferenceError')) {
      return 'high';
    }
    
    // Module-specific context
    if (moduleContext === 'autonomous' || moduleContext === 'investment-committee') {
      return 'high';
    }
    
    return 'medium';
  };

  getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const { error, errorInfo, isCollapsed, isReporting, reportSent, copied, retryCount } = this.state;
    const { fallbackComponent: FallbackComponent, maxRetries = 3, level = 'component' } = this.props;

    // Use custom fallback component if provided
    if (FallbackComponent && error && errorInfo) {
      return (
        <FallbackComponent
          error={error}
          errorInfo={errorInfo}
          resetError={this.handleReset}
        />
      );
    }

    if (!error) {
      return null;
    }

    const severity = this.getErrorSeverity(error);
    const severityColor = this.getSeverityColor(severity);
    const canRetry = retryCount < maxRetries && this.shouldAutoRetry(error);

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Something went wrong
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {level === 'global' ? 'A critical error occurred' : 'An error occurred in this component'}
                  </p>
                </div>
              </div>
              <Badge className={severityColor}>
                {severity.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Error Message */}
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-medium text-red-900 mb-2">{error.name}</h3>
              <p className="text-sm text-red-800">{error.message}</p>
              {this.state.errorId && (
                <p className="text-xs text-red-600 mt-2 font-mono">
                  Error ID: {this.state.errorId}
                </p>
              )}
            </div>

            {/* Retry Info */}
            {retryCount > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  This error has occurred {retryCount} time{retryCount !== 1 ? 's' : ''}. 
                  {canRetry && ' Automatic retry will be attempted.'}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button onClick={this.handleRetry} className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4" />
                <span>Try Again</span>
              </Button>
              
              {level !== 'global' && (
                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="flex items-center space-x-2"
                >
                  <Home className="h-4 w-4" />
                  <span>Go to Homepage</span>
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={this.handleToggleDetails}
                className="flex items-center space-x-2"
              >
                {isCollapsed ? (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    <span>Show Details</span>
                  </>
                ) : (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    <span>Hide Details</span>
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={this.handleCopyError}
                className="flex items-center space-x-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy Error</span>
                  </>
                )}
              </Button>
            </div>

            {/* Error Reporting */}
            {this.props.enableReporting && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bug className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {reportSent ? 'Error report sent' : 'Help us improve by reporting this error'}
                    </span>
                  </div>
                  {!reportSent && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => this.reportError({
                        message: error.message,
                        stack: error.stack,
                        name: error.name,
                        timestamp: new Date(),
                        userAgent: navigator.userAgent,
                        url: window.location.href,
                        moduleContext: this.props.moduleContext,
                        additionalInfo: { componentStack: errorInfo?.componentStack }
                      })}
                      disabled={isReporting}
                      className="flex items-center space-x-2"
                    >
                      {isReporting ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        <Mail className="h-3 w-3" />
                      )}
                      <span>{isReporting ? 'Sending...' : 'Send Report'}</span>
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Detailed Error Info (Collapsible) */}
            {!isCollapsed && (
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Stack Trace</h4>
                  <pre className="text-xs text-gray-700 overflow-auto max-h-40 bg-white p-2 rounded border">
                    {error.stack}
                  </pre>
                </div>
                
                {errorInfo?.componentStack && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Component Stack</h4>
                    <pre className="text-xs text-gray-700 overflow-auto max-h-40 bg-white p-2 rounded border">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Environment Info</h4>
                  <div className="text-xs text-gray-700 space-y-1">
                    <p><strong>Module:</strong> {this.props.moduleContext || 'Unknown'}</p>
                    <p><strong>Level:</strong> {level}</p>
                    <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
                    <p><strong>URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Unknown'}</p>
                    <p><strong>User Agent:</strong> {typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default GlobalErrorBoundary;