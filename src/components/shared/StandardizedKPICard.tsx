import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LucideIcon,
  TrendingUp, 
  TrendingDown, 
  Minus,
  Brain,
  Sparkles,
  Zap,
  Clock,
  Target
} from 'lucide-react';
import { 
  COLORS, 
  AI_ELEMENTS, 
  COMPONENTS,
  formatCurrency, 
  formatPercentage,
  formatDuration 
} from '@/lib/design-system';

interface StandardizedKPICardProps {
  // Core content
  title: string;
  value: string | number;
  
  // Mode and theming
  mode?: 'traditional' | 'assisted';
  
  // Icon (optional)
  icon?: LucideIcon;
  iconColor?: string;
  
  // AI Enhancement (for assisted mode)
  isAIEnhanced?: boolean;
  aiInsight?: string;
  aiConfidence?: number;
  
  // Trend indicator
  trend?: 'up' | 'down' | 'stable' | 'none';
  trendValue?: string;
  trendLabel?: string;
  
  // Formatting
  valueType?: 'currency' | 'percentage' | 'duration' | 'count' | 'score';
  subtitle?: string;
  
  // Status indicator
  status?: 'positive' | 'negative' | 'neutral' | 'warning';
  
  // Custom styling
  className?: string;
}

const TrendIcon: React.FC<{ trend: 'up' | 'down' | 'stable' }> = ({ trend }) => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case 'down':
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    case 'stable':
      return <Minus className="h-4 w-4 text-gray-500" />;
    default:
      return null;
  }
};

const formatValue = (value: string | number, type?: string): string => {
  if (typeof value === 'string') return value;
  
  switch (type) {
    case 'currency':
      return formatCurrency(value);
    case 'percentage':
      return formatPercentage(value);
    case 'duration':
      return formatDuration(value);
    case 'score':
      return `${value}/10`;
    case 'count':
    default:
      return value.toString();
  }
};

export const StandardizedKPICard: React.FC<StandardizedKPICardProps> = ({
  title,
  value,
  mode = 'traditional',
  icon: IconComponent,
  iconColor,
  isAIEnhanced = false,
  aiInsight,
  aiConfidence,
  trend = 'none',
  trendValue,
  trendLabel,
  valueType = 'count',
  subtitle,
  status = 'neutral',
  className = '',
}) => {
  // Determine theme colors
  const isAssisted = mode === 'assisted' || isAIEnhanced;
  const cardClasses = isAssisted 
    ? COMPONENTS.card.assisted.base 
    : COMPONENTS.card.traditional.base;
  
  // Status-based styling
  const getStatusStyling = () => {
    switch (status) {
      case 'positive':
        return 'border-l-4 border-l-green-500';
      case 'negative':
        return 'border-l-4 border-l-red-500';
      case 'warning':
        return 'border-l-4 border-l-yellow-500';
      default:
        return isAssisted ? 'border-l-4 border-l-blue-500' : '';
    }
  };

  // AI-specific icon color
  const getIconColor = () => {
    if (iconColor) return iconColor;
    if (isAssisted) return 'text-blue-600';
    return 'text-gray-600';
  };

  const formattedValue = formatValue(value, valueType);

  return (
    <Card className={`${cardClasses} ${getStatusStyling()} ${className}`}>
      <CardContent className="p-6">
        {/* Header with icon and AI indicator */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {IconComponent && (
              <IconComponent className={`h-5 w-5 ${getIconColor()}`} />
            )}
            <p className={`text-sm font-medium ${
              isAssisted ? 'text-blue-700' : 'text-gray-600'
            }`}>
              {title}
            </p>
          </div>
          
          {/* AI Enhancement Indicator */}
          {isAIEnhanced && (
            <Badge className="bg-blue-100 text-blue-800 border border-blue-300">
              <Brain className="h-3 w-3 mr-1" />
              AI
            </Badge>
          )}
        </div>

        {/* Main Value */}
        <p className={`text-3xl font-bold mb-2 ${
          isAssisted ? 'text-blue-900' : 'text-gray-900'
        }`}>
          {formattedValue}
        </p>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs text-gray-500 mb-2">{subtitle}</p>
        )}

        {/* Trend and Additional Info */}
        <div className="flex items-center justify-between">
          {/* Trend Indicator */}
          {trend !== 'none' && (
            <div className="flex items-center space-x-1">
              <TrendIcon trend={trend} />
              {trendValue && (
                <span className={`text-sm ${
                  trend === 'up' ? 'text-green-600' : 
                  trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {trendValue}
                </span>
              )}
              {trendLabel && (
                <span className="text-xs text-gray-500">{trendLabel}</span>
              )}
            </div>
          )}

          {/* AI Confidence */}
          {aiConfidence && (
            <div className="flex items-center space-x-1">
              <Target className="h-3 w-3 text-blue-500" />
              <span className="text-xs text-blue-600">{aiConfidence}% confidence</span>
            </div>
          )}
        </div>

        {/* AI Insight */}
        {aiInsight && (
          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
            <div className="flex items-center space-x-1 mb-1">
              <Sparkles className="h-3 w-3 text-blue-600" />
              <span className="text-xs font-medium text-blue-800">AI Insight</span>
            </div>
            <p className="text-xs text-blue-700">{aiInsight}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Specialized KPI Cards for common use cases

export const EfficiencyKPICard: React.FC<{
  title: string;
  value: number;
  mode?: 'traditional' | 'assisted';
  timeSaved?: string;
  className?: string;
}> = ({ title, value, mode = 'traditional', timeSaved, className }) => (
  <StandardizedKPICard
    title={title}
    value={value}
    valueType="percentage"
    mode={mode}
    icon={mode === 'assisted' ? Zap : Clock}
    status="positive"
    trend="up"
    trendValue={timeSaved}
    trendLabel={mode === 'assisted' ? 'AI optimized' : 'improved'}
    isAIEnhanced={mode === 'assisted'}
    className={className}
  />
);

export const PerformanceKPICard: React.FC<{
  title: string;
  value: number;
  mode?: 'traditional' | 'assisted';
  benchmark?: string;
  valueType?: 'currency' | 'percentage' | 'count';
  className?: string;
}> = ({ title, value, mode = 'traditional', benchmark, valueType = 'percentage', className }) => (
  <StandardizedKPICard
    title={title}
    value={value}
    valueType={valueType}
    mode={mode}
    icon={TrendingUp}
    status="positive"
    trend="up"
    trendValue={benchmark}
    trendLabel="vs benchmark"
    isAIEnhanced={mode === 'assisted'}
    className={className}
  />
);

export const AIScoreKPICard: React.FC<{
  title: string;
  score: number;
  confidence?: number;
  insight?: string;
  className?: string;
}> = ({ title, score, confidence, insight, className }) => (
  <StandardizedKPICard
    title={title}
    value={score}
    valueType="percentage"
    mode="assisted"
    icon={Brain}
    iconColor="text-blue-600"
    status="positive"
    isAIEnhanced={true}
    aiConfidence={confidence}
    aiInsight={insight}
    className={className}
  />
);

export default StandardizedKPICard;