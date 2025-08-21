'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  RefreshCw,
  ArrowLeft,
  Settings,
  Bug
} from 'lucide-react';
import { GlobalErrorBoundary } from './GlobalErrorBoundary';

interface ModuleErrorBoundaryProps {
  children: React.ReactNode;
  moduleName: string;
  fallbackComponent?: React.ComponentType<{
    error: Error;
    resetError: () => void;
    moduleName: string;
  }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  enableReporting?: boolean;
}

interface ModuleErrorFallbackProps {
  error: Error;
  resetError: () => void;
  moduleName: string;
}

const ModuleErrorFallback: React.FC<ModuleErrorFallbackProps> = ({
  error,
  resetError,
  moduleName
}) => {
  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  const getModuleIcon = (module: string) => {
    // You can customize icons based on module
    return AlertTriangle;
  };

  const getModuleColor = (module: string) => {
    // You can customize colors based on module
    const colors = {
      'deal-screening': 'bg-blue-100 text-blue-800 border-blue-200',
      'due-diligence': 'bg-green-100 text-green-800 border-green-200',
      'portfolio': 'bg-purple-100 text-purple-800 border-purple-200',
      'fund-operations': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'investment-committee': 'bg-red-100 text-red-800 border-red-200',
      'deal-structuring': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    
    return colors[module as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getModuleDisplayName = (module: string) => {
    return module
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getErrorSuggestion = (error: Error, module: string) => {
    if (error.name === 'ChunkLoadError') {
      return 'This appears to be a loading issue. Try refreshing the page or clearing your browser cache.';
    }
    
    if (error.message.includes('Network')) {
      return 'This appears to be a network connectivity issue. Please check your internet connection and try again.';
    }
    
    if (module === 'autonomous') {
      return 'There was an issue with the AI system. You can try switching to Assisted mode or Traditional mode.';
    }
    
    if (module.includes('portfolio') || module.includes('fund')) {
      return 'There was an issue loading financial data. The system may be temporarily unavailable.';
    }
    
    return 'An unexpected error occurred in this module. Please try again or contact support if the problem persists.';
  };

  const ModuleIcon = getModuleIcon(moduleName);
  const moduleColor = getModuleColor(moduleName);
  const moduleDisplayName = getModuleDisplayName(moduleName);
  const suggestion = getErrorSuggestion(error, moduleName);

  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <ModuleIcon className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900">
                {moduleDisplayName} Error
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={moduleColor} variant="outline">
                  {moduleDisplayName}
                </Badge>
                <Badge variant="destructive" className="text-xs">
                  {error.name}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Error Message */}
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error.message}</p>
          </div>
          
          {/* Suggestion */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">{suggestion}</p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={resetError} 
              className="flex items-center space-x-2 flex-1"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry {moduleDisplayName}</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleGoBack}
              className="flex items-center space-x-2 flex-1"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Go Back</span>
            </Button>
          </div>
          
          {/* Alternative Actions */}
          {moduleName.includes('autonomous') && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 mb-2">
                <strong>Alternative:</strong> Try switching to a different mode:
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // Logic to switch to assisted mode
                    if (typeof window !== 'undefined') {
                      const url = new URL(window.location.href);
                      url.searchParams.set('mode', 'assisted');
                      window.location.href = url.toString();
                    }
                  }}
                >
                  Switch to Assisted Mode
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // Logic to switch to traditional mode
                    if (typeof window !== 'undefined') {
                      const url = new URL(window.location.href);
                      url.searchParams.set('mode', 'traditional');
                      window.location.href = url.toString();
                    }
                  }}
                >
                  Switch to Traditional Mode
                </Button>
              </div>
            </div>
          )}
          
          <div className="text-center pt-2">
            <p className="text-xs text-gray-500">
              If this problem continues, please contact support with error code above.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const ModuleErrorBoundary: React.FC<ModuleErrorBoundaryProps> = ({
  children,
  moduleName,
  fallbackComponent: CustomFallback,
  onError,
  enableReporting = true
}) => {
  return (
    <GlobalErrorBoundary
      fallbackComponent={
        CustomFallback || 
        ((props) => (
          <ModuleErrorFallback
            error={props.error}
            resetError={props.resetError}
            moduleName={moduleName}
          />
        ))
      }
      onError={onError}
      enableReporting={enableReporting}
      moduleContext={moduleName}
      level="module"
    >
      {children}
    </GlobalErrorBoundary>
  );
};

export default ModuleErrorBoundary;