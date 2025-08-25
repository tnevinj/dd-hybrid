import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  AlertTriangle,
  Search,
  FileText,
  Plus,
  RefreshCw,
  Brain,
  Sparkles,
  CheckCircle,
  XCircle,
  Clock,
  Database,
  Wifi,
  WifiOff,
  ShieldAlert,
  Info,
  Lightbulb
} from 'lucide-react';
import { COMPONENTS } from '@/lib/design-system';

// =============================================================================
// LOADING STATES
// =============================================================================

interface StandardizedLoadingProps {
  mode?: 'traditional' | 'assisted';
  message?: string;
  submessage?: string;
  showProgress?: boolean;
  progress?: number;
  size?: 'small' | 'medium' | 'large';
  variant?: 'spinner' | 'pulse' | 'skeleton';
  className?: string;
}

export const StandardizedLoading: React.FC<StandardizedLoadingProps> = ({
  mode = 'traditional',
  message = "Loading...",
  submessage,
  showProgress = false,
  progress = 0,
  size = 'medium',
  variant = 'spinner',
  className = ""
}) => {
  const isAssisted = mode === 'assisted';
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12', 
    large: 'h-16 w-16'
  };
  const containerPadding = {
    small: 'p-4',
    medium: 'p-8',
    large: 'p-12'
  };
  
  const spinnerColor = isAssisted ? 'border-blue-600' : 'border-gray-600';
  
  return (
    <div className={`flex flex-col items-center justify-center ${containerPadding[size]} ${className}`}>
      {variant === 'spinner' && (
        <>
          <div className={`animate-spin rounded-full border-b-2 ${spinnerColor} ${sizeClasses[size]} mb-4`}></div>
          {isAssisted && (
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="h-4 w-4 text-blue-600 animate-pulse" />
              <Badge className="bg-blue-100 text-blue-800 border-blue-300">AI Processing</Badge>
            </div>
          )}
        </>
      )}
      
      {variant === 'pulse' && (
        <div className={`animate-pulse bg-gradient-to-r ${
          isAssisted ? 'from-blue-300 to-blue-300' : 'from-gray-300 to-gray-400'
        } rounded ${sizeClasses[size]} mb-4`}></div>
      )}
      
      <h3 className={`text-xl font-semibold mb-2 ${
        isAssisted ? 'text-blue-900' : 'text-gray-700'
      }`}>
        {message}
      </h3>
      
      {submessage && (
        <p className="text-gray-600 text-center max-w-md">{submessage}</p>
      )}
      
      {showProgress && (
        <div className="w-full max-w-md mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                isAssisted ? 'bg-blue-600' : 'bg-gray-600'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Specialized loading components
export const AIAnalysisLoading: React.FC<{
  analysisType?: string;
  itemsProcessed?: number;
  totalItems?: number;
  className?: string;
}> = ({ analysisType = "data", itemsProcessed, totalItems, className }) => (
  <StandardizedLoading
    mode="assisted"
    message={`AI is analyzing ${analysisType}...`}
    submessage={
      itemsProcessed !== undefined && totalItems !== undefined
        ? `Processing ${itemsProcessed} of ${totalItems} items`
        : "This may take a few moments"
    }
    showProgress={itemsProcessed !== undefined && totalItems !== undefined}
    progress={itemsProcessed && totalItems ? Math.round((itemsProcessed / totalItems) * 100) : 0}
    className={className}
  />
);

export const DataSyncLoading: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`flex items-center justify-center p-4 ${className}`}>
    <div className="flex items-center space-x-2">
      <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
      <span className="text-sm text-gray-600">Syncing data...</span>
    </div>
  </div>
);

// =============================================================================
// EMPTY STATES  
// =============================================================================

interface StandardizedEmptyProps {
  mode?: 'traditional' | 'assisted';
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  suggestions?: string[];
  showSearchTips?: boolean;
  className?: string;
}

export const StandardizedEmpty: React.FC<StandardizedEmptyProps> = ({
  mode = 'traditional',
  title,
  description,
  icon: IconComponent = Search,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  suggestions = [],
  showSearchTips = false,
  className = ""
}) => {
  const isAssisted = mode === 'assisted';
  const cardClasses = isAssisted ? COMPONENTS.card.assisted.base : COMPONENTS.card.traditional.base;
  
  return (
    <Card className={`${cardClasses} ${className}`}>
      <CardContent className="text-center py-12">
        <div className={`mx-auto mb-4 ${isAssisted ? 'text-blue-400' : 'text-gray-400'}`}>
          <IconComponent className="h-12 w-12 mx-auto" />
        </div>
        
        <h3 className={`text-lg font-semibold mb-2 ${
          isAssisted ? 'text-blue-900' : 'text-gray-900'
        }`}>
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
        
        {/* AI Suggestions */}
        {isAssisted && suggestions.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">AI Suggestions</span>
            </div>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <p key={index} className="text-sm text-blue-700">• {suggestion}</p>
              ))}
            </div>
          </div>
        )}
        
        {/* Search Tips */}
        {showSearchTips && (
          <div className="mb-6 text-left max-w-md mx-auto">
            <h4 className="font-medium text-gray-900 mb-2">Search Tips:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Try using different keywords</li>
              <li>• Check your spelling</li>
              <li>• Use broader search terms</li>
              {isAssisted && <li>• Let AI suggest related terms</li>}
            </ul>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
          {onAction && actionLabel && (
            <Button 
              onClick={onAction}
              className={isAssisted ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-800'}
            >
              <Plus className="h-4 w-4 mr-2" />
              {actionLabel}
            </Button>
          )}
          
          {onSecondaryAction && secondaryActionLabel && (
            <Button 
              variant="outline" 
              onClick={onSecondaryAction}
              className={isAssisted ? 'border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700'}
            >
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Specialized empty state components
export const NoResultsEmpty: React.FC<{
  mode?: 'traditional' | 'assisted';
  searchTerm?: string;
  onClearFilters?: () => void;
  className?: string;
}> = ({ mode = 'traditional', searchTerm, onClearFilters, className }) => (
  <StandardizedEmpty
    mode={mode}
    title="No results found"
    description={
      searchTerm 
        ? `No items match your search for "${searchTerm}"`
        : "No items match your current filters"
    }
    icon={Search}
    actionLabel="Clear Filters"
    onAction={onClearFilters}
    showSearchTips={!!searchTerm}
    suggestions={mode === 'assisted' ? [
      "Try AI-powered smart search",
      "Let AI suggest similar items",
      "Use AI to expand your search criteria"
    ] : []}
    className={className}
  />
);

export const NoDataEmpty: React.FC<{
  mode?: 'traditional' | 'assisted';
  dataType: string;
  onCreateNew?: () => void;
  className?: string;
}> = ({ mode = 'traditional', dataType, onCreateNew, className }) => (
  <StandardizedEmpty
    mode={mode}
    title={`No ${dataType} yet`}
    description={`You haven't created any ${dataType} yet. Get started by creating your first one.`}
    icon={FileText}
    actionLabel={`Create ${dataType}`}
    onAction={onCreateNew}
    suggestions={mode === 'assisted' ? [
      `AI can help you create ${dataType} quickly`,
      "Get AI-powered templates and suggestions",
      "Auto-populate fields with smart defaults"
    ] : []}
    className={className}
  />
);

// =============================================================================
// ERROR STATES
// =============================================================================

interface StandardizedErrorProps {
  mode?: 'traditional' | 'assisted';
  title: string;
  description: string;
  errorCode?: string;
  errorType?: 'network' | 'permission' | 'validation' | 'server' | 'unknown';
  onRetry?: () => void;
  onSupport?: () => void;
  showDetails?: boolean;
  errorDetails?: string;
  className?: string;
}

export const StandardizedError: React.FC<StandardizedErrorProps> = ({
  mode = 'traditional',
  title,
  description,
  errorCode,
  errorType = 'unknown',
  onRetry,
  onSupport,
  showDetails = false,
  errorDetails,
  className = ""
}) => {
  const [detailsExpanded, setDetailsExpanded] = React.useState(false);
  const isAssisted = mode === 'assisted';
  const cardClasses = isAssisted ? COMPONENTS.card.assisted.base : COMPONENTS.card.traditional.base;
  
  const getErrorIcon = () => {
    switch (errorType) {
      case 'network':
        return WifiOff;
      case 'permission':
        return ShieldAlert;
      case 'validation':
        return AlertTriangle;
      case 'server':
        return Database;
      default:
        return XCircle;
    }
  };
  
  const ErrorIcon = getErrorIcon();
  
  return (
    <Card className={`${cardClasses} border-red-200 ${className}`}>
      <CardContent className="text-center py-12">
        <div className="text-red-500 mb-4">
          <ErrorIcon className="h-12 w-12 mx-auto" />
        </div>
        
        <h3 className="text-lg font-semibold text-red-900 mb-2">{title}</h3>
        <p className="text-red-700 mb-4 max-w-md mx-auto">{description}</p>
        
        {errorCode && (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300 mb-4">
            Error Code: {errorCode}
          </Badge>
        )}
        
        {/* AI Error Analysis (Assisted Mode) */}
        {isAssisted && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Brain className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">AI Error Analysis</span>
            </div>
            <p className="text-sm text-blue-700">
              {errorType === 'network' ? 
                "AI suggests checking your internet connection and trying again." :
                errorType === 'permission' ?
                "AI recommends contacting your administrator for access rights." :
                "AI is analyzing this error pattern to provide better solutions."
              }
            </p>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 mb-4">
          {onRetry && (
            <Button 
              onClick={onRetry}
              className={isAssisted ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-800'}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
          
          {onSupport && (
            <Button 
              variant="outline" 
              onClick={onSupport}
              className="border-gray-300 text-gray-700"
            >
              Contact Support
            </Button>
          )}
        </div>
        
        {/* Error Details */}
        {showDetails && errorDetails && (
          <div className="text-left">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDetailsExpanded(!detailsExpanded)}
              className="text-gray-600 hover:text-gray-900 mb-2"
            >
              <Info className="h-4 w-4 mr-1" />
              {detailsExpanded ? 'Hide' : 'Show'} Technical Details
            </Button>
            
            {detailsExpanded && (
              <div className="p-3 bg-gray-100 border rounded text-sm text-left font-mono text-gray-700 overflow-x-auto">
                {errorDetails}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Specialized error components
export const NetworkError: React.FC<{
  mode?: 'traditional' | 'assisted';
  onRetry?: () => void;
  className?: string;
}> = ({ mode = 'traditional', onRetry, className }) => (
  <StandardizedError
    mode={mode}
    title="Connection Error"
    description="Unable to connect to the server. Please check your internet connection and try again."
    errorType="network"
    onRetry={onRetry}
    className={className}
  />
);

export const PermissionError: React.FC<{
  mode?: 'traditional' | 'assisted';
  resource: string;
  onSupport?: () => void;
  className?: string;
}> = ({ mode = 'traditional', resource, onSupport, className }) => (
  <StandardizedError
    mode={mode}
    title="Access Denied"
    description={`You don't have permission to access ${resource}. Please contact your administrator.`}
    errorType="permission"
    onSupport={onSupport}
    className={className}
  />
);

export const ValidationError: React.FC<{
  mode?: 'traditional' | 'assisted';
  validationMessage: string;
  onRetry?: () => void;
  className?: string;
}> = ({ mode = 'traditional', validationMessage, onRetry, className }) => (
  <StandardizedError
    mode={mode}
    title="Validation Error"
    description={validationMessage}
    errorType="validation"
    onRetry={onRetry}
    className={className}
  />
);

// =============================================================================
// SUCCESS STATES
// =============================================================================

interface StandardizedSuccessProps {
  mode?: 'traditional' | 'assisted';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  autoHide?: boolean;
  duration?: number;
  onHide?: () => void;
  className?: string;
}

export const StandardizedSuccess: React.FC<StandardizedSuccessProps> = ({
  mode = 'traditional',
  title,
  description,
  actionLabel,
  onAction,
  autoHide = false,
  duration = 5000,
  onHide,
  className = ""
}) => {
  const isAssisted = mode === 'assisted';
  
  React.useEffect(() => {
    if (autoHide && onHide) {
      const timer = setTimeout(onHide, duration);
      return () => clearTimeout(timer);
    }
  }, [autoHide, duration, onHide]);
  
  return (
    <Card className={`border-green-200 bg-green-50 ${className}`}>
      <CardContent className="text-center py-8">
        <div className="text-green-600 mb-4">
          <CheckCircle className="h-12 w-12 mx-auto" />
        </div>
        
        <h3 className="text-lg font-semibold text-green-900 mb-2">{title}</h3>
        <p className="text-green-700 mb-4 max-w-md mx-auto">{description}</p>
        
        {isAssisted && (
          <div className="mb-4">
            <Badge className="bg-blue-100 text-blue-800 border-blue-300">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Optimized
            </Badge>
          </div>
        )}
        
        {onAction && actionLabel && (
          <Button 
            onClick={onAction}
            className={isAssisted ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default {
  StandardizedLoading,
  AIAnalysisLoading,
  DataSyncLoading,
  StandardizedEmpty,
  NoResultsEmpty,
  NoDataEmpty,
  StandardizedError,
  NetworkError,
  PermissionError,
  ValidationError,
  StandardizedSuccess,
};