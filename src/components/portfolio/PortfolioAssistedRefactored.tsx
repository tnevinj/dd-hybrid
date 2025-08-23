/**
 * Refactored Portfolio Assisted Component  
 * Uses new standardized AssistedModeProps interface with AI recommendations integration
 */

'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, Sparkles, X, TrendingUp, Shield, Zap } from 'lucide-react'
import { PortfolioAssistedContainer } from './containers/PortfolioAssistedContainer'
import type { AssistedModeProps } from '@/types/shared'

export function PortfolioAssistedRefactored({
  metrics,
  isLoading = false,
  aiRecommendations,
  onExecuteAIAction,
  onDismissRecommendation,
  onSwitchMode
}: AssistedModeProps) {

  // AI-Enhanced Portfolio event handlers
  const handleCreateAsset = () => {
    // AI-assisted asset creation would integrate with the UnifiedPortfolioContext
    // This would trigger AI-powered asset creation workflow
    console.log('AI-Assisted Asset Creation triggered');
  }

  const handleViewAsset = (id: string) => {
    // AI-enhanced asset analysis would use real data from context
    console.log(`AI-Enhanced Asset Analysis for Asset ${id}`);
  }

  const handleEditAsset = (id: string) => {
    // AI-powered asset management would use real data from context
    console.log(`AI-Powered Asset Management for Asset ${id}`);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-700">AI is analyzing portfolio data...</h3>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* AI-Enhanced Mode Indicator */}
      <div className="bg-white border-b border-purple-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <Badge className="bg-purple-100 text-purple-800 border border-purple-300 flex items-center space-x-1">
            <Brain className="h-3 w-3" />
            <span>AI-Assisted Mode</span>
          </Badge>
          
          {/* AI-Enhanced Metrics */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="text-gray-600">
              <span className="font-medium">AI Efficiency:</span> 
              <span className="text-purple-600 ml-1">{metrics.aiEfficiencyGains}%</span>
            </div>
            <div className="text-gray-600">
              <span className="font-medium">Risk Score:</span> 
              <span className="text-green-600 ml-1">{metrics.riskScore || 'Low'}</span>
            </div>
            <div className="text-gray-600">
              <span className="font-medium">Predicted Growth:</span> 
              <span className="text-blue-600 ml-1">{metrics.predictedGrowth || 15.2}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* AI Recommendations Panel */}
        {aiRecommendations && aiRecommendations.length > 0 && (
          <div className="mb-6">
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-600" />
                  Portfolio AI Recommendations ({aiRecommendations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiRecommendations.slice(0, 4).map((rec) => (
                    <div key={rec.id} className="p-4 bg-white border rounded-lg shadow-sm">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-gray-900">{rec.title}</h4>
                            <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                              {rec.priority}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                          
                          {/* Recommendation Type Indicator */}
                          <div className="flex items-center space-x-2 mb-3">
                            {rec.type === 'suggestion' && <TrendingUp className="h-4 w-4 text-blue-500" />}
                            {rec.type === 'automation' && <Zap className="h-4 w-4 text-purple-500" />}
                            {rec.type === 'warning' && <Shield className="h-4 w-4 text-red-500" />}
                            {rec.type === 'insight' && <Sparkles className="h-4 w-4 text-green-500" />}
                            <span className="text-xs text-gray-500 capitalize">{rec.type}</span>
                            <span className="text-xs text-gray-500">
                              • {Math.round(rec.confidence * 100)}% confidence
                            </span>
                            {rec.actions[0]?.estimatedImpact && (
                              <span className="text-xs text-gray-500">
                                • {rec.actions[0].estimatedImpact} impact
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {rec.actions?.map((action) => (
                            <Button
                              key={action.id}
                              size="sm"
                              variant={action.primary ? 'default' : 'outline'}
                              onClick={() => onExecuteAIAction(action.action)}
                              disabled={isLoading}
                            >
                              {action.label}
                            </Button>
                          ))}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDismissRecommendation(rec.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* AI-Enhanced Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-800">AI Optimization</p>
                  <p className="text-lg font-bold text-purple-900">{metrics.aiOptimizationScore || 8.7}/10</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">Predicted Growth</p>
                  <p className="text-lg font-bold text-green-900">{metrics.predictedGrowth || 15.2}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Time Saved</p>
                  <p className="text-lg font-bold text-blue-900">{metrics.timeSavedHours || 24}h</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-orange-800">Risk Score</p>
                  <p className="text-lg font-bold text-orange-900">{metrics.riskScore || 2.1}/5</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Use existing container architecture with AI enhancements */}
        <PortfolioAssistedContainer
          onViewAsset={handleViewAsset}
          onEditAsset={handleEditAsset}
          onCreateAsset={handleCreateAsset}
        />
      </div>
    </div>
  )
}

export default PortfolioAssistedRefactored
