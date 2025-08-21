'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Zap, 
  Target, 
  CheckCircle,
  AlertTriangle,
  BarChart3
} from 'lucide-react';

export interface AIMetric {
  id: string;
  label: string;
  value: number | string;
  previousValue?: number | string;
  unit?: string;
  format?: 'number' | 'percentage' | 'currency' | 'time' | 'text';
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  insight?: string;
  isGood?: boolean;
  icon?: string;
}

interface AIMetricsCardProps {
  title: string;
  metrics: AIMetric[];
  className?: string;
  showTrends?: boolean;
  showInsights?: boolean;
  compact?: boolean;
}

const formatValue = (value: number | string, format?: AIMetric['format'], unit?: string): string => {
  if (typeof value === 'string') return value;
  
  switch (format) {
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: value >= 1000000 ? 'compact' : 'standard',
        maximumFractionDigits: 1
      }).format(value);
    case 'time':
      return `${value}${unit || 'min'}`;
    case 'number':
      return value.toLocaleString();
    default:
      return `${value.toLocaleString()}${unit ? ' ' + unit : ''}`;
  }
};

const getTrendIcon = (trend: AIMetric['trend'], isGood?: boolean) => {
  if (trend === 'up') {
    return isGood ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingUp className="h-4 w-4 text-red-600" />
    );
  } else if (trend === 'down') {
    return isGood ? (
      <TrendingDown className="h-4 w-4 text-red-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-green-600" />
    );
  }
  return null;
};

const getTrendColor = (trend: AIMetric['trend'], isGood?: boolean): string => {
  if (trend === 'up') {
    return isGood ? 'text-green-600' : 'text-red-600';
  } else if (trend === 'down') {
    return isGood ? 'text-red-600' : 'text-green-600';
  }
  return 'text-gray-500';
};

const getMetricIcon = (iconName?: string) => {
  switch (iconName) {
    case 'clock': return <Clock className="h-4 w-4" />;
    case 'zap': return <Zap className="h-4 w-4" />;
    case 'target': return <Target className="h-4 w-4" />;
    case 'check': return <CheckCircle className="h-4 w-4" />;
    case 'alert': return <AlertTriangle className="h-4 w-4" />;
    case 'chart': return <BarChart3 className="h-4 w-4" />;
    default: return <BarChart3 className="h-4 w-4" />;
  }
};

export function AIMetricsCard({
  title,
  metrics,
  className = '',
  showTrends = true,
  showInsights = true,
  compact = false
}: AIMetricsCardProps) {
  if (metrics.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center text-gray-500">
          No metrics available
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className={compact ? "pb-3" : undefined}>
        <div className="flex items-center justify-between">
          <CardTitle className={compact ? "text-base" : "text-lg"}>{title}</CardTitle>
          <Badge variant="outline" className="text-xs">
            AI Enhanced
          </Badge>
        </div>
      </CardHeader>
      <CardContent className={compact ? "pt-0" : undefined}>
        <div className={`grid gap-4 ${compact ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
          {metrics.map((metric) => (
            <div key={metric.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">
                    {getMetricIcon(metric.icon)}
                  </span>
                  <span className={`font-medium ${compact ? 'text-sm' : 'text-base'} text-gray-700`}>
                    {metric.label}
                  </span>
                </div>
                {showTrends && metric.trend && (
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(metric.trend, metric.isGood)}
                    {metric.trendValue && (
                      <span className={`text-xs ${getTrendColor(metric.trend, metric.isGood)}`}>
                        {metric.trendValue > 0 ? '+' : ''}{metric.trendValue}%
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <div className={`font-semibold ${compact ? 'text-lg' : 'text-xl'} text-gray-900`}>
                  {formatValue(metric.value, metric.format, metric.unit)}
                </div>
                
                {metric.previousValue && (
                  <div className="text-xs text-gray-500">
                    Previous: {formatValue(metric.previousValue, metric.format, metric.unit)}
                  </div>
                )}
                
                {showInsights && metric.insight && (
                  <div className="text-xs text-blue-600 bg-blue-50 rounded px-2 py-1">
                    💡 {metric.insight}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}