'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator,
  TrendingUp,
  BarChart3,
  Settings,
  Save,
  Share,
  Download,
  RefreshCw,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { useViewContext } from '@/hooks/use-view-context';
import DCFModelingCard from './DCFModelingCard';
import LBOModelingCard from './LBOModelingCard';
import { DCFResults, LBOResults } from '@/types/deal-structuring';

interface FinancialModelingWorkspaceProps {
  dealId: string;
  dealName: string;
}

const FinancialModelingWorkspace: React.FC<FinancialModelingWorkspaceProps> = ({ 
  dealId, 
  dealName 
}) => {
  const { viewMode } = useViewContext();
  const [activeModel, setActiveModel] = useState<'dcf' | 'lbo' | 'comparison'>('dcf');
  const [dcfResults, setDCFResults] = useState<DCFResults | null>(null);
  const [lboResults, setLBOResults] = useState<LBOResults | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const saveModels = async () => {
    // Mock save functionality
    setLastSaved(new Date());
    // In reality, would save to backend
  };

  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Models</h1>
          <p className="text-gray-600 mt-1">{dealName} - Valuation Analysis</p>
        </div>
        <div className="flex items-center gap-3">
          {lastSaved && (
            <span className="text-sm text-gray-500">
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <Button variant="outline" onClick={saveModels}>
            <Save className="h-4 w-4 mr-2" />
            Save All
          </Button>
          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Package
          </Button>
        </div>
      </div>

      {/* AI Model Insights - Only in Assisted/Autonomous modes */}
      {viewMode !== 'traditional' && (dcfResults || lboResults) && (
        <Card className="border-l-4 border-l-purple-500 bg-purple-50/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-purple-900">Cross-Model AI Analysis</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {dcfResults && lboResults && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-1">Valuation Comparison</div>
                  <div className="text-lg font-semibold">
                    DCF: {formatCurrency(dcfResults.equityValue)}
                  </div>
                  <div className="text-lg font-semibold">
                    LBO Exit: {formatCurrency(lboResults.exitEquityValue)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {Math.abs((dcfResults.equityValue - lboResults.exitEquityValue) / dcfResults.equityValue * 100).toFixed(1)}% variance
                  </div>
                </div>
                
                <div className="p-3 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-1">Return Analysis</div>
                  <div className="text-lg font-semibold">
                    DCF IRR: {formatPercentage(dcfResults.irr)}
                  </div>
                  <div className="text-lg font-semibold">
                    LBO IRR: {formatPercentage(lboResults.equityIRR)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    LBO premium: {((lboResults.equityIRR - dcfResults.irr) * 100).toFixed(1)}bps
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-1">Risk Assessment</div>
                  <div className="flex items-center gap-1">
                    {lboResults.peakLeverage > 5.0 ? (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    ) : (
                      <BarChart3 className="h-4 w-4 text-green-500" />
                    )}
                    <span className="text-lg font-semibold">
                      {lboResults.peakLeverage.toFixed(1)}x leverage
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {lboResults.peakLeverage > 5.0 ? 'High leverage risk' : 'Acceptable leverage'}
                  </div>
                </div>
              </div>
            )}
            
            {viewMode === 'autonomous' && (dcfResults || lboResults) && (
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <div className="text-sm font-medium text-blue-900 mb-2">AI Recommendation</div>
                <p className="text-sm text-blue-800">
                  Based on the financial analysis, this deal shows {lboResults && lboResults.equityIRR > 0.20 ? 'strong' : 'moderate'} return potential. 
                  Consider {lboResults && lboResults.peakLeverage > 5.0 ? 'reducing leverage' : 'optimizing capital structure'} to enhance risk-adjusted returns.
                </p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">
                    Run Optimization
                  </Button>
                  <Button size="sm" variant="outline">
                    Generate IC Memo
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Model Selection Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'dcf', label: 'DCF Valuation', icon: Calculator },
            { id: 'lbo', label: 'LBO Returns', icon: TrendingUp },
            { id: 'comparison', label: 'Model Comparison', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveModel(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeModel === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {((tab.id === 'dcf' && dcfResults) || (tab.id === 'lbo' && lboResults)) && (
                  <Badge variant="default" className="text-xs">Updated</Badge>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Model Content */}
      <div className="space-y-6">
        {activeModel === 'dcf' && (
          <DCFModelingCard 
            dealId={dealId} 
            mode={viewMode}
            onResultsChange={setDCFResults}
          />
        )}

        {activeModel === 'lbo' && (
          <LBOModelingCard 
            dealId={dealId} 
            mode={viewMode}
            onResultsChange={setLBOResults}
          />
        )}

        {activeModel === 'comparison' && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold">Model Comparison</h3>
              </div>
            </CardHeader>
            <CardContent>
              {!dcfResults && !lboResults ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Run DCF and LBO models to see comparison</p>
                  <div className="flex justify-center gap-3">
                    <Button variant="outline" onClick={() => setActiveModel('dcf')}>
                      <Calculator className="h-4 w-4 mr-2" />
                      Start with DCF
                    </Button>
                    <Button variant="outline" onClick={() => setActiveModel('lbo')}>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Start with LBO
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Valuation Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {dcfResults && (
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-3">DCF Valuation</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Enterprise Value</span>
                            <span className="font-medium">{formatCurrency(dcfResults.enterpriseValue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Equity Value</span>
                            <span className="font-medium">{formatCurrency(dcfResults.equityValue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Implied IRR</span>
                            <span className="font-medium">{formatPercentage(dcfResults.irr)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {lboResults && (
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-3">LBO Returns</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Exit Equity Value</span>
                            <span className="font-medium">{formatCurrency(lboResults.exitEquityValue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Equity Multiple</span>
                            <span className="font-medium">{lboResults.equityMultiple.toFixed(1)}x</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Equity IRR</span>
                            <span className="font-medium">{formatPercentage(lboResults.equityIRR)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Investment Decision Matrix */}
                  {dcfResults && lboResults && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Investment Decision Matrix</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm text-center">
                        <div>
                          <div className="text-gray-600">Valuation Method</div>
                          <div className="font-medium">
                            {dcfResults.equityValue > lboResults.exitEquityValue ? 'DCF Higher' : 'LBO Higher'}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">Return Expectation</div>
                          <div className="font-medium">
                            {lboResults.equityIRR > 0.20 ? 'Attractive' : 'Below Target'}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">Risk Level</div>
                          <div className="font-medium">
                            {lboResults.peakLeverage > 5.0 ? 'High' : 'Moderate'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Model Actions */}
      <div className="flex justify-center gap-4 pt-6 border-t">
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Model Settings
        </Button>
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
        {viewMode !== 'traditional' && (
          <Button variant="outline">
            <Zap className="h-4 w-4 mr-2" />
            AI Optimization
          </Button>
        )}
      </div>
    </div>
  );
};

export default FinancialModelingWorkspace;