'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Target, Brain, Zap, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface RecommendationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  recommendations: any[];
  isLoading: boolean;
  mode?: 'traditional' | 'assisted' | 'autonomous';
}

/**
 * RecommendationPanel Component - Enhanced for DD-Hybrid
 * 
 * AI-powered recommendation panel with hybrid navigation support
 */
const RecommendationPanel: React.FC<RecommendationPanelProps> = ({
  isOpen,
  onClose,
  recommendations,
  isLoading,
  mode = 'traditional'
}) => {
  const getModeIcon = () => {
    switch (mode) {
      case 'autonomous':
        return <Zap className="h-4 w-4 text-blue-600" />;
      case 'assisted':
        return <Brain className="h-4 w-4 text-blue-600" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getModeColor = () => {
    switch (mode) {
      case 'autonomous':
        return 'border-blue-200 bg-blue-50';
      case 'assisted':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  // Sample recommendations for demonstration
  const sampleRecommendations = [
    {
      id: '1',
      type: 'opportunity',
      title: 'Portfolio Rebalancing Opportunity',
      description: 'Consider reducing Financial Services allocation from 24% to target 22% and increasing Healthcare exposure.',
      confidence: 0.87,
      impact: 'high'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Concentration Risk Alert',
      description: 'Monitor LP Stakes allocation approaching 50% limit. Consider diversification opportunities.',
      confidence: 0.92,
      impact: 'medium'
    },
    {
      id: '3',
      type: 'insight',
      title: 'Market Timing Analysis',
      description: 'Current market conditions favor secondary transactions in Technology sector based on valuation trends.',
      confidence: 0.76,
      impact: 'high'
    }
  ];

  const displayRecommendations = recommendations.length > 0 ? recommendations : sampleRecommendations;

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'insight':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getModeIcon()}
            AI Recommendations
            {mode !== 'traditional' && (
              <Badge variant="outline" className="text-xs capitalize">
                {mode} Mode
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Generating AI recommendations...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayRecommendations.map((rec) => (
                <Card key={rec.id} className={`p-4 ${getModeColor()}`}>
                  <div className="flex items-start gap-3">
                    {getRecommendationIcon(rec.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{rec.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={rec.impact === 'high' ? 'default' : 'secondary'}>
                            {rec.impact} impact
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {Math.round(rec.confidence * 100)}% confidence
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm">
                          Apply Recommendation
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {mode !== 'traditional' && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {getModeIcon()}
                <span className="text-sm font-medium">AI Enhancement Active</span>
              </div>
              <p className="text-xs text-gray-600">
                {mode === 'autonomous' 
                  ? 'Recommendations are continuously updated based on market conditions and portfolio changes.'
                  : 'Recommendations are generated based on your current context and historical performance.'
                }
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecommendationPanel;