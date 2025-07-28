'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Building2,
  TrendingUp,
  Calculator,
  Download,
  AlertCircle,
  CheckCircle,
  Zap,
  Target,
  BarChart3,
  DollarSign
} from 'lucide-react';

interface CapitalStructureCardProps {
  dealId: string;
  mode?: string;
  onResultsChange?: (results: any) => void;
}

interface CapitalStructureResults {
  currentAnalysis: {
    currentWACC: number;
    leverageRatio: number;
    interestCoverageRatio: number;
    impliedCreditRating: string;
  };
  optimalStructure?: {
    optimalWACC: number;
    recommendedLeverage: number;
    projectedCreditRating: string;
    impactAnalysis: {
      waccImprovement: number;
    };
    recommendedActions: Array<{
      action: string;
      instrument: string;
      amount: number;
      rationale: string;
      timeline: string;
    }>;
  };
  keyInsights: {
    currentStructureAssessment: string[];
    optimizationOpportunities: string[];
  };
}

const CapitalStructureCard: React.FC<CapitalStructureCardProps> = ({ 
  dealId, 
  mode = 'traditional',
  onResultsChange 
}) => {
  const [inputs, setInputs] = useState({
    companyName: 'Target Company',
    industry: 'Technology',
    currentDebt: 500,
    currentEquity: 2500,
    ebitda: 200,
    interestRate: 6.5,
    taxRate: 25,
    riskFreeRate: 4.5,
    marketRiskPremium: 6.5,
    beta: 1.15
  });

  const [results, setResults] = useState<CapitalStructureResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const runAnalysis = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      // Mock capital structure analysis
      const analysisResults: CapitalStructureResults = {
        currentAnalysis: {
          currentWACC: 0.087,
          leverageRatio: 2.5,
          interestCoverageRatio: 3.1,
          impliedCreditRating: 'BBB'
        },
        optimalStructure: {
          optimalWACC: 0.076,
          recommendedLeverage: 4.2,
          projectedCreditRating: 'BBB-',
          impactAnalysis: {
            waccImprovement: 0.011
          },
          recommendedActions: [
            {
              action: 'issue_term_loan',
              instrument: 'Term Loan B',
              amount: 200000000,
              rationale: 'Optimize debt mix and reduce WACC',
              timeline: '6-9 months'
            }
          ]
        },
        keyInsights: {
          currentStructureAssessment: [
            'Conservative leverage profile',
            'Strong interest coverage',
            'Opportunity for optimization'
          ],
          optimizationOpportunities: [
            'Increase leverage to 4.0-4.5x',
            'Refinance at lower rates',
            'Optimize maturity profile'
          ]
        }
      };
      
      setResults(analysisResults);
      setIsCalculating(false);
      
      if (onResultsChange) {
        onResultsChange(analysisResults);
      }
    }, 2000);
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(0)}M`;
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Building2 className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Capital Structure Analysis</h3>
              <p className="text-sm text-gray-600">Optimize debt/equity mix and minimize WACC</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {results && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <CheckCircle className="h-3 w-3 mr-1" />
                Analyzed
              </Badge>
            )}
            {mode !== 'traditional' && (
              <Button variant="outline" size="sm">
                <Zap className="h-4 w-4 mr-1" />
                AI Optimize
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Input Parameters */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Company & Financial Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <Input
                value={inputs.companyName}
                onChange={(e) => setInputs(prev => ({ ...prev, companyName: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <Input
                value={inputs.industry}
                onChange={(e) => setInputs(prev => ({ ...prev, industry: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Debt ($M)</label>
              <Input
                type="number"
                value={inputs.currentDebt}
                onChange={(e) => setInputs(prev => ({ ...prev, currentDebt: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Equity ($M)</label>
              <Input
                type="number"
                value={inputs.currentEquity}
                onChange={(e) => setInputs(prev => ({ ...prev, currentEquity: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">EBITDA ($M)</label>
              <Input
                type="number"
                value={inputs.ebitda}
                onChange={(e) => setInputs(prev => ({ ...prev, ebitda: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
              <Input
                type="number"
                step="0.1"
                value={inputs.interestRate}
                onChange={(e) => setInputs(prev => ({ ...prev, interestRate: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
              <Input
                type="number"
                step="1"
                value={inputs.taxRate}
                onChange={(e) => setInputs(prev => ({ ...prev, taxRate: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Risk-Free Rate (%)</label>
              <Input
                type="number"
                step="0.1"
                value={inputs.riskFreeRate}
                onChange={(e) => setInputs(prev => ({ ...prev, riskFreeRate: Number(e.target.value) }))}
              />
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="flex justify-center">
          <Button 
            onClick={runAnalysis} 
            disabled={isCalculating}
            className="px-8"
          >
            <Calculator className="h-4 w-4 mr-2" />
            {isCalculating ? 'Running Analysis...' : 'Run Capital Structure Analysis'}
          </Button>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Analysis Results</h4>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>

            {/* Current Structure Analysis */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Current Capital Structure</h5>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatPercentage(results.currentAnalysis.currentWACC)}
                    </div>
                    <div className="text-sm text-gray-600">Current WACC</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {results.currentAnalysis.leverageRatio.toFixed(1)}x
                    </div>
                    <div className="text-sm text-gray-600">Leverage Ratio</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {results.currentAnalysis.interestCoverageRatio.toFixed(1)}x
                    </div>
                    <div className="text-sm text-gray-600">Interest Coverage</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <DollarSign className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      {results.currentAnalysis.impliedCreditRating}
                    </div>
                    <div className="text-sm text-gray-600">Credit Rating</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Optimal Structure */}
            {results.optimalStructure && (
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Optimal Capital Structure</h5>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formatPercentage(results.optimalStructure.optimalWACC)}
                      </div>
                      <div className="text-sm text-gray-600">Optimal WACC</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {results.optimalStructure.recommendedLeverage.toFixed(1)}x
                      </div>
                      <div className="text-sm text-gray-600">Target Leverage</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {(results.optimalStructure.impactAnalysis.waccImprovement * 100).toFixed(0)}bps
                      </div>
                      <div className="text-sm text-gray-600">WACC Improvement</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {results.optimalStructure.projectedCreditRating}
                      </div>
                      <div className="text-sm text-gray-600">Target Rating</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recommended Actions */}
                <div>
                  <h6 className="font-medium text-gray-900 mb-3">Recommended Actions</h6>
                  <div className="space-y-3">
                    {results.optimalStructure.recommendedActions.map((action, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">
                              {action.action.replace(/_/g, ' ')}
                            </Badge>
                            <span className="font-medium">{action.instrument}</span>
                          </div>
                          <p className="text-sm text-gray-600">{action.rationale}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(action.amount / 1000000)}</div>
                          <div className="text-sm text-gray-500">{action.timeline}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Key Insights */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Key Insights</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h6 className="text-sm font-medium text-gray-700 mb-2">Current Structure Assessment</h6>
                  <div className="space-y-2">
                    {results.keyInsights.currentStructureAssessment.map((insight, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span className="text-sm text-gray-600">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h6 className="text-sm font-medium text-gray-700 mb-2">Optimization Opportunities</h6>
                  <div className="space-y-2">
                    {results.keyInsights.optimizationOpportunities.map((opportunity, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span className="text-sm text-gray-600">{opportunity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights for non-traditional modes */}
            {mode !== 'traditional' && (
              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-l-purple-500">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-purple-900 mb-2">AI Analysis</h5>
                    <ul className="text-sm text-purple-800 space-y-1">
                      <li>• Current structure is conservative with opportunity for leverage optimization</li>
                      <li>• Recommended increase to 4.2x leverage could reduce WACC by 110bps</li>
                      <li>• Strong interest coverage provides buffer for additional debt capacity</li>
                      <li>• Market conditions favorable for refinancing existing instruments</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Warning */}
        <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong>Note:</strong> Capital structure optimization should consider market conditions, 
            covenant restrictions, and company-specific factors. Results are based on current inputs and assumptions.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CapitalStructureCard;