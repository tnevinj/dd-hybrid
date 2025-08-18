'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, RefreshCw, Bug, FileX } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

export class ContentAssemblerErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details
    console.error('ContentAssembler Error Boundary caught an error:', error);
    console.error('Error Info:', errorInfo);
    
    this.setState({
      error,
      errorInfo,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });

    // Send error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // This would integrate with your error monitoring service
    // e.g., Sentry, LogRocket, etc.
    const errorReport = {
      errorId: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Example: Send to error monitoring service
    fetch('/api/errors/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorReport)
    }).catch(err => {
      console.error('Failed to log error to service:', err);
    });
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    });
  };

  private handleReportError = () => {
    const errorDetails = {
      errorId: this.state.errorId,
      message: this.state.error?.message,
      timestamp: new Date().toISOString()
    };

    // Copy error details to clipboard
    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
      .then(() => {
        alert('Error details copied to clipboard. Please share with support.');
      })
      .catch(() => {
        alert(`Error ID: ${this.state.errorId}\nPlease share this ID with support.`);
      });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[600px] p-6 bg-gray-50">
          <Card className="max-w-2xl w-full border-red-200 bg-red-50">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <CardTitle className="text-red-900">Content Assembler Error</CardTitle>
                  <p className="text-red-700 text-sm mt-1">
                    Something went wrong while loading the content assembler
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Error Details</h4>
                  <Badge variant="destructive" className="text-xs">
                    {this.state.errorId}
                  </Badge>
                </div>
                
                {this.state.error && (
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Message:</label>
                      <p className="text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded">
                        {this.state.error.message}
                      </p>
                    </div>
                    
                    {process.env.NODE_ENV === 'development' && this.state.error.stack && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Stack Trace:</label>
                        <pre className="text-xs text-gray-700 bg-gray-100 p-2 rounded overflow-auto max-h-32">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Troubleshooting Steps</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Try refreshing the page or clicking "Retry" below</li>
                  <li>• Check your internet connection</li>
                  <li>• Clear your browser cache and cookies</li>
                  <li>• Try using a different browser or incognito mode</li>
                  <li>• Contact support if the problem persists</li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <Button onClick={this.handleRetry} className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
                <Button 
                  variant="outline" 
                  onClick={this.handleReportError}
                  className="flex-1"
                >
                  <Bug className="w-4 h-4 mr-2" />
                  Report Error
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                >
                  <FileX className="w-4 h-4 mr-2" />
                  Reload Page
                </Button>
              </div>

              {process.env.NODE_ENV === 'development' && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-yellow-900 mb-2">Development Info</h4>
                  <p className="text-sm text-yellow-800">
                    This error boundary is only shown in development. In production, users would see
                    a more user-friendly error message with options to retry or contact support.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export const useContentAssemblerErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error: Error) => {
    console.error('ContentAssembler Error:', error);
    setError(error);
  }, []);

  // Reset error when component unmounts
  React.useEffect(() => {
    return () => setError(null);
  }, []);

  return {
    error,
    resetError,
    handleError,
    hasError: error !== null
  };
};

// Higher-order component version
export const withContentAssemblerErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>
) => {
  const WrappedComponent = (props: P) => (
    <ContentAssemblerErrorBoundary>
      <Component {...props} />
    </ContentAssemblerErrorBoundary>
  );

  WrappedComponent.displayName = `withContentAssemblerErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

export default ContentAssemblerErrorBoundary;