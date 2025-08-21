import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, BarChart3, Target, Zap, TrendingUp } from 'lucide-react';

export const AdvancedAnalyticsAssisted: React.FC<{ metrics: any }> = ({ metrics }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
          <div className="flex items-center space-x-2 mt-2">
            <Badge className="bg-purple-100 text-purple-800 border border-purple-300 flex items-center space-x-1">
              <Brain className="h-3 w-3" />
              <span>AI-Assisted Mode</span>
            </Badge>
            <p className="text-gray-600">Enhanced with artificial intelligence</p>
          </div>
        </div>
      </div>

      {/* AI-Enhanced KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <p className="text-sm text-purple-700 font-medium">AI Models</p>
            </div>
            <p className="text-3xl font-bold text-purple-900">47</p>
            <div className="flex items-center text-purple-600 text-sm mt-1">
              <Sparkles className="h-4 w-4 mr-1" />
              Self-optimizing
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-green-600" />
              <p className="text-sm text-green-700 font-medium">Predictions</p>
            </div>
            <p className="text-3xl font-bold text-green-900">2,341</p>
            <div className="flex items-center text-green-600 text-sm mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              94% accuracy
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-blue-700 font-medium">Processing Speed</p>
            </div>
            <p className="text-3xl font-bold text-blue-900">98x</p>
            <div className="flex items-center text-blue-600 text-sm mt-1">
              <Brain className="h-4 w-4 mr-1" />
              Faster than manual
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="h-5 w-5 text-orange-600" />
              <p className="text-sm text-orange-700 font-medium">Insights</p>
            </div>
            <p className="text-3xl font-bold text-orange-900">567</p>
            <div className="flex items-center text-orange-600 text-sm mt-1">
              <Sparkles className="h-4 w-4 mr-1" />
              Auto-generated
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI-Powered Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-purple-600" />
              AI-Powered Models
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded bg-white">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Deep Learning Portfolio Optimizer</h4>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <p className="text-sm text-gray-600">Neural network optimizing portfolio allocation</p>
                <div className="flex items-center mt-2 text-green-600 text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  Processing 2.4M data points continuously
                </div>
              </div>
              
              <div className="p-3 border rounded bg-white">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Predictive Risk Assessment</h4>
                  <Badge className="bg-purple-100 text-purple-800">AI Score: 97%</Badge>
                </div>
                <p className="text-sm text-gray-600">Machine learning risk prediction model</p>
                <div className="flex items-center mt-2 text-purple-600 text-xs">
                  <Brain className="h-3 w-3 mr-1" />
                  Accuracy improved 340% vs traditional methods
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Real-time Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded">
                <h4 className="font-medium">Market Sentiment Analysis</h4>
                <p className="text-sm text-gray-600">AI monitoring 10,000+ news sources</p>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="outline">Real-time</Badge>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="p-3 border rounded">
                <h4 className="font-medium">Performance Forecasting</h4>
                <p className="text-sm text-gray-600">12-month predictive modeling</p>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="outline">High Confidence</Badge>
                  <span className="text-xs text-gray-500">Updated 1min ago</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Performance Summary */}
      <Card className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-purple-900 mb-1">AI Analytics Performance</h3>
              <p className="text-purple-700">Advanced machine learning capabilities</p>
            </div>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-green-600">47.8h</p>
                <p className="text-sm text-gray-600">Time Saved</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-600">97%</p>
                <p className="text-sm text-gray-600">Model Accuracy</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">2.4M</p>
                <p className="text-sm text-gray-600">Data Points/Day</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedAnalyticsAssisted;