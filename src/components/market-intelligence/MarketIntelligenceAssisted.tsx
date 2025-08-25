import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, TrendingUp, Target, Zap, AlertTriangle } from 'lucide-react';

export const MarketIntelligenceAssisted: React.FC<{ metrics: any }> = ({ metrics }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Market Intelligence</h1>
          <div className="flex items-center space-x-2 mt-2">
            <Badge className="bg-blue-100 text-blue-800 border border-blue-300 flex items-center space-x-1">
              <Brain className="h-3 w-3" />
              <span>AI-Assisted Mode</span>
            </Badge>
            <p className="text-gray-600">Enhanced with artificial intelligence</p>
          </div>
        </div>
        <Button className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4" />
          <span>AI Insights</span>
        </Button>
      </div>

      {/* AI Insights Panel */}
      <Card className="mb-6 border-2 border-blue-200">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-blue-900">AI Market Insights</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg border bg-green-50 border-green-200">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-900">Technology Sector Opportunity</h4>
              <Button size="sm" variant="outline">Execute</Button>
            </div>
            <p className="text-sm text-gray-700 mb-2">AI detected 23% growth opportunity in AI/ML sector. Recommend increasing allocation.</p>
            <p className="text-xs text-gray-500 italic">Confidence: 89%</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-yellow-50 border-yellow-200">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-900">Market Volatility Alert</h4>
              <Button size="sm" variant="outline">Review</Button>
            </div>
            <p className="text-sm text-gray-700 mb-2">Elevated volatility detected in healthcare sector. Risk assessment recommended.</p>
            <p className="text-xs text-gray-500 italic">Confidence: 94%</p>
          </div>
        </CardContent>
      </Card>

      {/* AI-Enhanced KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-blue-700 font-medium">AI Predictions</p>
            </div>
            <p className="text-3xl font-bold text-blue-900">187</p>
            <div className="flex items-center text-blue-600 text-sm mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              96% accuracy
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-green-600" />
              <p className="text-sm text-green-700 font-medium">Opportunities</p>
            </div>
            <p className="text-3xl font-bold text-green-900">34</p>
            <div className="flex items-center text-green-600 text-sm mt-1">
              <Sparkles className="h-4 w-4 mr-1" />
              AI-identified
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-blue-700 font-medium">Real-time</p>
            </div>
            <p className="text-3xl font-bold text-blue-900">Live</p>
            <div className="flex items-center text-blue-600 text-sm mt-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-1 animate-pulse"></div>
              Streaming data
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <p className="text-sm text-orange-700 font-medium">Risk Alerts</p>
            </div>
            <p className="text-3xl font-bold text-orange-900">7</p>
            <div className="flex items-center text-orange-600 text-sm mt-1">
              <Brain className="h-4 w-4 mr-1" />
              AI-monitored
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Market Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
              AI-Powered Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded bg-white">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Tech Sector Deep Dive</h4>
                  <Badge className="bg-green-100 text-green-800">AI Score: 94%</Badge>
                </div>
                <p className="text-sm text-gray-600">AI analysis of 847 tech companies, 23 growth vectors identified</p>
                <div className="flex items-center mt-2 text-green-600 text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  Completed in 2.3 minutes (vs 4 hours manual)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Predictive Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded">
                <h4 className="font-medium">Q2 Market Forecast</h4>
                <p className="text-sm text-gray-600">AI predicts 12% growth in sustainable tech</p>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="outline">High Confidence</Badge>
                  <span className="text-xs text-gray-500">Updated 5min ago</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Performance Summary */}
      <Card className="mt-6 bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-1">AI Market Intelligence Performance</h3>
              <p className="text-blue-700">Enhanced market analysis capabilities</p>
            </div>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-green-600">15.2h</p>
                <p className="text-sm text-gray-600">Time Saved</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">96%</p>
                <p className="text-sm text-gray-600">Prediction Accuracy</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">127</p>
                <p className="text-sm text-gray-600">Insights Generated</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketIntelligenceAssisted;