'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  TrendingDown,
  Bot,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Target,
  Zap,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface ModeKPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  iconBg?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
    period?: string;
  };
  mode: 'traditional' | 'assisted' | 'autonomous';
  aiInsight?: {
    text: string;
    type: 'optimization' | 'insight' | 'warning' | 'success';
  };
  progress?: {
    value: number;
    max?: number;
    label?: string;
  };
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'outline';
    className?: string;
  };
  className?: string;
  onClick?: () => void;
  compact?: boolean;
  showAIIndicator?: boolean;
}

const ModeKPICard: React.FC<ModeKPICardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-blue-600',
  iconBg = 'bg-blue-100',
  trend,
  mode,
  aiInsight,
  progress,
  badge,
  className = '',
  onClick,
  compact = false,
  showAIIndicator = true
}) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      // Try to format as currency if it's a large number
      if (val >= 1000000) {
        return formatCurrency(val);
      }
      // Try to format as percentage if it's between 0-100 and has decimals
      if (val > 0 && val <= 100 && val % 1 !== 0) {
        return formatPercentage(val);
      }
      // Otherwise format as regular number
      return val.toLocaleString();
    }
    return val;
  };

  const getAIInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization': return Target;
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle;
      default: return Info;
    }
  };

  const getAIInsightColor = (type: string) => {
    switch (type) {
      case 'optimization': return 'text-purple-600';
      case 'warning': return 'text-amber-600';
      case 'success': return 'text-green-600';
      default: return 'text-blue-600';
    }
  };

  const isAIEnhanced = mode !== 'traditional';

  return (
    <Card 
      className={`relative transition-all hover:shadow-md ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <CardContent className={compact ? 'p-4' : 'p-6'}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`${compact ? 'text-xl' : 'text-2xl'} font-bold text-gray-900 mt-1`}>
              {formatValue(value)}
            </p>
          </div>
          
          {Icon && (
            <div className={`${compact ? 'h-10 w-10' : 'h-12 w-12'} ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <Icon className={`${compact ? 'h-5 w-5' : 'h-6 w-6'} ${iconColor}`} />
            </div>
          )}
        </div>

        {/* Subtitle and trend */}
        <div className={`${compact ? 'mt-2' : 'mt-4'} space-y-2`}>
          {subtitle && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{subtitle}</span>
              {badge && (
                <Badge 
                  variant={badge.variant || 'outline'} 
                  className={`text-xs ${badge.className || ''}`}
                >
                  {badge.text}
                </Badge>
              )}
            </div>
          )}

          {trend && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {trend.isPositive ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {typeof trend.value === 'number' 
                    ? `${trend.isPositive ? '+' : ''}${formatPercentage(Math.abs(trend.value))}`
                    : trend.value
                  }
                  {trend.label && ` ${trend.label}`}
                </span>
              </div>
              {trend.period && (
                <span className="text-xs text-gray-500">{trend.period}</span>
              )}
            </div>
          )}

          {progress && (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{progress.label || 'Progress'}</span>
                <span className="text-sm text-gray-600">
                  {progress.value}{progress.max ? `/${progress.max}` : '%'}
                </span>
              </div>
              <Progress 
                value={progress.max ? (progress.value / progress.max) * 100 : progress.value} 
                className="h-2" 
              />
            </div>
          )}

          {aiInsight && isAIEnhanced && (
            <div className="flex items-start space-x-2 p-2 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                {React.createElement(getAIInsightIcon(aiInsight.type), {
                  className: `h-4 w-4 ${getAIInsightColor(aiInsight.type)} mt-0.5`
                })}
              </div>
              <p className={`text-xs ${getAIInsightColor(aiInsight.type)} flex-1`}>
                {aiInsight.text}
              </p>
            </div>
          )}
        </div>

        {/* AI Enhancement Indicators */}
        {isAIEnhanced && showAIIndicator && (
          <>
            {/* AI Enhanced Badge */}
            {!badge && (
              <div className="absolute top-2 right-2">
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                  <Bot className="h-3 w-3 mr-1" />
                  {mode === 'assisted' ? 'AI Enhanced' : 'AI Managed'}
                </Badge>
              </div>
            )}
            
            {/* AI Activity Indicator */}
            <div className="absolute top-2 left-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
          </>
        )}

        {/* Mode-specific enhancements */}
        {mode === 'autonomous' && (
          <div className="absolute bottom-2 right-2">
            <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModeKPICard;