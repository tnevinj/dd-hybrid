'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  FileText,
  TrendingUp,
  Calculator,
  Download,
  AlertCircle,
  CheckCircle,
  Zap,
  Plus,
  Trash2,
  Star,
  Target,
  BarChart3,
  DollarSign
} from 'lucide-react';

interface TermSheetCardProps {
  dealId: string;
  mode?: string;
  onResultsChange?: (results: any) => void;
}

interface TermSheetProvision {
  id: string;
  name: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  marketPercentile: number;
}

interface TermSheetResults {
  summary: {
    overallAssessment: {
      marketCompetitiveness: string;
      buyerFriendliness: number;
      executionProbability: number;
      balanceScore: number;
    };
    economicTerms: {
      purchasePrice: number;
      netPresentValue: number;
      irr: number;
      multiple: number;
    };
  };
  keyInsights: {
    termStructureInsights: string[];
    negotiationInsights: string[];
    recommendations: {
      immediate: string[];
      strategic: string[];
    };
  };
}

const TermSheetCard: React.FC<TermSheetCardProps> = ({ 
  dealId, 
  mode = 'traditional',
  onResultsChange 
}) => {
  const [inputs, setInputs] = useState({
    dealName: 'Secondary Transaction Alpha',
    dealType: 'secondary',
    dealSize: 500,
    buyerName: 'Strategic Secondary Fund',
    sellerName: 'Limited Partner',
    marketConditions: 'neutral'
  });

  const [provisions, setProvisions] = useState<TermSheetProvision[]>([
    {
      id: 'purchase_price',
      name: 'Purchase Price',
      description: '$500M fixed price',
      priority: 'high',
      marketPercentile: 50
    },
    {
      id: 'closing_conditions',
      name: 'Closing Conditions',
      description: 'Standard conditions including due diligence, financing, and approvals',
      priority: 'medium',
      marketPercentile: 60
    }
  ]);

  const [results, setResults] = useState<TermSheetResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const runAnalysis = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      // Mock term sheet analysis results
      const analysisResults: TermSheetResults = {
        summary: {
          overallAssessment: {
            marketCompetitiveness: 'market',
            buyerFriendliness: 72,
            executionProbability: 85,
            balanceScore: 78
          },
          economicTerms: {
            purchasePrice: inputs.dealSize * 1000000,
            netPresentValue: inputs.dealSize * 1000000 * 0.97,
            irr: 0.165,
            multiple: 2.3
          }
        },
        keyInsights: {
          termStructureInsights: [
            'Purchase price reflects market conditions',
            'Closing conditions are balanced',
            'Strong execution probability'
          ],
          negotiationInsights: [
            'Buyer has moderate leverage',
            'Seller motivation supports deal',
            'Timeline is reasonable'
          ],
          recommendations: {
            immediate: [
              'Finalize due diligence scope',
              'Negotiate payment timing',
              'Confirm regulatory approvals'
            ],
            strategic: [
              'Consider NAV adjustment mechanisms',
              'Evaluate warranty insurance',
              'Structure for tax efficiency'
            ]
          }
        }
      };
      
      setResults(analysisResults);
      setIsCalculating(false);
      
      if (onResultsChange) {
        onResultsChange(analysisResults);
      }
    }, 2500);
  };

  const addProvision = () => {
    const newProvision: TermSheetProvision = {
      id: `provision_${provisions.length + 1}`,
      name: `New Provision ${provisions.length + 1}`,
      description: 'New term sheet provision',
      priority: 'medium',
      marketPercentile: 50
    };

    setProvisions(prev => [...prev, newProvision]);
  };

  const removeProvision = (provisionId: string) => {
    setProvisions(prev => prev.filter(provision => provision.id !== provisionId));
  };

  const updateProvision = (provisionId: string, field: keyof TermSheetProvision, value: any) => {
    setProvisions(prev => prev.map(provision => 
      provision.id === provisionId ? { ...provision, [field]: value } : provision
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(0)}M`;
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FileText className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Term Sheet Modeling & Analysis</h3>
              <p className="text-sm text-gray-600">Comprehensive term sheet analysis and negotiation guidance</p>
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
                AI Guidance
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Deal Setup */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Deal Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deal Name</label>
              <Input
                value={inputs.dealName}
                onChange={(e) => setInputs(prev => ({ ...prev, dealName: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deal Size ($M)</label>
              <Input
                type="number"
                value={inputs.dealSize}
                onChange={(e) => setInputs(prev => ({ ...prev, dealSize: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deal Type</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={inputs.dealType}
                onChange={(e) => setInputs(prev => ({ ...prev, dealType: e.target.value }))}
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="continuation">Continuation Fund</option>
                <option value="gp_led">GP-Led</option>
                <option value="lp_led">LP-Led</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Market Conditions</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={inputs.marketConditions}
                onChange={(e) => setInputs(prev => ({ ...prev, marketConditions: e.target.value }))}
              >
                <option value="favorable">Favorable</option>
                <option value="neutral">Neutral</option>
                <option value="challenging">Challenging</option>
                <option value="distressed">Distressed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buyer Name</label>
              <Input
                value={inputs.buyerName}
                onChange={(e) => setInputs(prev => ({ ...prev, buyerName: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seller Name</label>
              <Input
                value={inputs.sellerName}
                onChange={(e) => setInputs(prev => ({ ...prev, sellerName: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Provisions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Term Sheet Provisions</h4>
            <Button onClick={addProvision} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Add Provision
            </Button>
          </div>

          <div className="space-y-4">
            {provisions.map((provision) => (
              <Card key={provision.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {provision.priority === 'high' && <AlertCircle className="h-4 w-4 text-red-500" />}
                      {provision.priority === 'medium' && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                      {provision.priority === 'low' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                    <div>
                      <h5 className="font-medium">{provision.name}</h5>
                      <p className="text-sm text-gray-600">{provision.priority} priority</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={provision.marketPercentile > 75 ? 'destructive' : 
                              provision.marketPercentile > 25 ? 'secondary' : 'default'}
                    >
                      {provision.marketPercentile}th percentile
                    </Badge>
                    {provisions.length > 1 && (
                      <Button 
                        onClick={() => removeProvision(provision.id)}
                        size="sm"
                        variant="ghost"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provision Name</label>
                    <Input
                      value={provision.name}
                      onChange={(e) => updateProvision(provision.id, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      value={provision.priority}
                      onChange={(e) => updateProvision(provision.id, 'priority', e.target.value)}
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <Textarea
                    value={provision.description}
                    onChange={(e) => updateProvision(provision.id, 'description', e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Market Percentile</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={provision.marketPercentile}
                    onChange={(e) => updateProvision(provision.id, 'marketPercentile', Number(e.target.value))}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Calculate Button */}
        <div className="flex justify-center">
          <Button 
            onClick={runAnalysis} 
            disabled={isCalculating}
            className="px-6"
          >
            <Calculator className="h-4 w-4 mr-2" />
            {isCalculating ? 'Analyzing...' : 'Run Analysis'}
          </Button>
        </div>

        {/* Results */}
        {results ? (
          <div className="space-y-6">
            {/* Overall Assessment */}
            <Card>
              <CardHeader>
                <h5 className="font-medium text-gray-900">Overall Assessment</h5>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">Market Competitiveness</div>
                    <Badge variant={results.summary.overallAssessment.marketCompetitiveness === 'market' ? 'default' : 'secondary'}>
                      {results.summary.overallAssessment.marketCompetitiveness}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">Buyer Friendliness</div>
                    <div className="flex items-center justify-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(results.summary.overallAssessment.buyerFriendliness / 20) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="ml-1 text-sm">{results.summary.overallAssessment.buyerFriendliness}/100</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">Execution Probability</div>
                    <div className="text-lg font-semibold">{results.summary.overallAssessment.executionProbability}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">Balance Score</div>
                    <Progress value={results.summary.overallAssessment.balanceScore} className="w-full" />
                    <div className="text-sm mt-1">{results.summary.overallAssessment.balanceScore}/100</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Economic Terms Summary */}
            <Card>
              <CardHeader>
                <h5 className="font-medium text-gray-900">Economic Terms Summary</h5>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(results.summary.economicTerms.purchasePrice)}
                    </div>
                    <div className="text-sm text-gray-600">Purchase Price</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(results.summary.economicTerms.netPresentValue)}
                    </div>
                    <div className="text-sm text-gray-600">NPV</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {formatPercentage(results.summary.economicTerms.irr)}
                    </div>
                    <div className="text-sm text-gray-600">IRR</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <BarChart3 className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      {results.summary.economicTerms.multiple.toFixed(1)}x
                    </div>
                    <div className="text-sm text-gray-600">Multiple</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Insights */}
            <Card>
              <CardHeader>
                <h5 className="font-medium text-gray-900">Key Insights & Recommendations</h5>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-2">Term Structure Insights:</h6>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {results.keyInsights.termStructureInsights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-2">Negotiation Insights:</h6>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {results.keyInsights.negotiationInsights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-2">Immediate Actions:</h6>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {results.keyInsights.recommendations.immediate.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-2">Strategic Recommendations:</h6>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {results.keyInsights.recommendations.strategic.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-purple-500 mt-1">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights for non-traditional modes */}
            {mode !== 'traditional' && (
              <div className="p-4 bg-indigo-50 rounded-lg border-l-4 border-l-indigo-500">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-indigo-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-indigo-900 mb-2">AI Negotiation Guidance</h5>
                    <ul className="text-sm text-indigo-800 space-y-1">
                      <li>• Terms are balanced and market-standard with 85% execution probability</li>
                      <li>• Purchase price mechanism offers good downside protection</li>
                      <li>• Consider warranty insurance to reduce representation period</li>
                      <li>• Closing conditions could be streamlined for faster execution</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-1" />
                Export Analysis
              </Button>
              <Button>
                <FileText className="h-4 w-4 mr-1" />
                Generate Term Sheet
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Yet</h3>
            <p className="text-gray-500 mb-6">Configure your term sheet provisions and run the analysis to see detailed results, benchmarking, and negotiation guidance.</p>
          </div>
        )}

        {/* Warning */}
        <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong>Note:</strong> Term sheet analysis provides guidance based on market data and modeling assumptions. 
            Actual negotiations may vary based on specific deal dynamics and market conditions.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TermSheetCard;