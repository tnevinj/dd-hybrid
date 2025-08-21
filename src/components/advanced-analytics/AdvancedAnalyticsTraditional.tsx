import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Calculator, Database, TrendingUp, User, PieChart } from 'lucide-react';

export const AdvancedAnalyticsTraditional: React.FC<{ metrics: any }> = ({ metrics }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
            <Badge className="bg-gray-100 text-gray-800 border border-gray-300 flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>Traditional Mode</span>
            </Badge>
          </div>
          <p className="text-gray-600 mt-1">Manual data analysis and statistical modeling</p>
        </div>
        <Button className="bg-gray-700 hover:bg-gray-800">
          <Calculator className="h-4 w-4 mr-2" />
          New Analysis
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="h-5 w-5 text-gray-600" />
              <p className="text-sm text-gray-600 font-medium">Total Analyses</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metrics.totalAnalyses}</p>
            <p className="text-sm text-gray-500 mt-1">Manual calculations</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <PieChart className="h-5 w-5 text-gray-600" />
              <p className="text-sm text-gray-600 font-medium">Active Models</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metrics.activeModels}</p>
            <p className="text-sm text-gray-500 mt-1">Statistical models</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Database className="h-5 w-5 text-gray-600" />
              <p className="text-sm text-gray-600 font-medium">Data Points</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{(metrics.dataPoints / 1e6).toFixed(1)}M</p>
            <p className="text-sm text-gray-500 mt-1">Manual processing</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-gray-600" />
              <p className="text-sm text-gray-600 font-medium">Reports</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metrics.predictiveInsights}</p>
            <p className="text-sm text-gray-500 mt-1">Generated manually</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Statistical Models</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded">
                <h4 className="font-medium">Portfolio Performance Model</h4>
                <p className="text-sm text-gray-600">Traditional regression analysis</p>
                <Badge className="mt-2" variant="outline">Active</Badge>
              </div>
              <div className="p-3 border rounded">
                <h4 className="font-medium">Risk Assessment Framework</h4>
                <p className="text-sm text-gray-600">Manual risk calculations</p>
                <Badge className="mt-2" variant="outline">In Development</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Analysis Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded">
                <h4 className="font-medium">Q1 Performance Analysis</h4>
                <p className="text-sm text-gray-600">Manual data processing required</p>
                <Badge className="mt-2" variant="outline">Pending</Badge>
              </div>
              <div className="p-3 border rounded">
                <h4 className="font-medium">Market Correlation Study</h4>
                <p className="text-sm text-gray-600">Statistical correlation analysis</p>
                <Badge className="mt-2" variant="outline">Assigned</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 p-4 bg-gray-100 border border-gray-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <User className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Traditional Analytics</h4>
            <p className="text-sm text-gray-600">
              Complete manual control over data analysis and statistical modeling. All calculations, 
              model development, and insights generation are performed using traditional analytical methods 
              without AI assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalyticsTraditional;