'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Globe,
  Calculator,
  Download,
  AlertCircle,
  CheckCircle,
  Zap,
  DollarSign,
  Target,
  Activity,
  BarChart3,
  Settings,
  Shield,
  Percent,
  Building,
  Gavel,
  TrendingDown,
  TrendingUp,
  FileText,
  Lock,
  Unlock,
  MapPin,
  Flag,
  Briefcase,
  PieChart,
  LineChart,
  BookOpen,
  Users,
  AlertTriangle
} from 'lucide-react';

interface TaxOptimizationCardProps {
  dealId: string;
  mode?: string;
  onResultsChange?: (results: any) => void;
}

interface Jurisdiction {
  id: string;
  name: string;
  country: string;
  corporateRate: number;
  withholdingRate: number;
  treatyNetwork: 'excellent' | 'good' | 'limited';
  treatyCount: number;
  advantages: string[];
  disadvantages: string[];
  regulatoryComplexity: 'low' | 'medium' | 'high';
  economicSubstance: boolean;
  bepsCompliance: 'full' | 'partial' | 'limited';
  recommendationScore: number;
}

interface TaxTreaty {
  countries: string[];
  dividendRate: number;
  interestRate: number;
  royaltyRate: number;
  benefits: string[];
  limitations: string[];
  effectiveDate: Date;
}

interface StructureOption {
  id: string;
  name: string;
  description: string;
  jurisdictions: string[];
  estimatedTaxRate: number;
  annualSavings: number;
  implementationCost: number;
  complexityScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  advantages: string[];
  risks: string[];
  timeline: string;
  maintenanceCost: number;
}

interface TaxResults {
  recommendedStructure: StructureOption;
  alternativeStructures: StructureOption[];
  taxSavingsAnalysis: {
    currentStructureTax: number;
    optimizedStructureTax: number;
    annualSavings: number;
    cumulativeSavings: number;
    savingsPercentage: number;
    paybackPeriod: number;
  };
  jurisdictionRanking: Array<{
    jurisdiction: string;
    score: number;
    rank: number;
    strengths: string[];
    concerns: string[];
  }>;
  complianceAssessment: {
    bepsCompliance: number;
    economicSubstance: number;
    transferPricing: number;
    overallCompliance: number;
    criticalRisks: string[];
    recommendations: string[];
  };
  treatyOptimization: {
    applicableTreaties: number;
    withholdingReduction: number;
    doubleTraxationRelief: number;
    optimalTreatyPath: string[];
  };
}

const TaxOptimizationCard: React.FC<TaxOptimizationCardProps> = ({ 
  dealId, 
  mode = 'traditional',
  onResultsChange 
}) => {
  const [inputs, setInputs] = useState({
    dealSize: 100000000,
    currency: 'USD',
    investmentHorizon: 5,
    expectedReturns: 0.15,
    currentJurisdiction: 'USA',
    dealType: 'acquisition',
    hasExistingStructure: false
  });

  const [jurisdictions] = useState<Jurisdiction[]>([
    {
      id: 'lux',
      name: 'Luxembourg',
      country: 'Luxembourg',
      corporateRate: 24.94,
      withholdingRate: 0,
      treatyNetwork: 'excellent',
      treatyCount: 85,
      advantages: ['Extensive treaty network', 'EU membership', 'Strong fund industry', 'Participation exemption'],
      disadvantages: ['Higher corporate rate', 'Substance requirements', 'Regulatory complexity'],
      regulatoryComplexity: 'medium',
      economicSubstance: true,
      bepsCompliance: 'full',
      recommendationScore: 92
    },
    {
      id: 'ire',
      name: 'Ireland',
      country: 'Ireland',
      corporateRate: 12.5,
      withholdingRate: 0,
      treatyNetwork: 'excellent',
      treatyCount: 75,
      advantages: ['Low corporate rate', 'EU membership', 'English common law', 'Check-the-box election'],
      disadvantages: ['Controlled foreign company rules', 'Transfer pricing complexity'],
      regulatoryComplexity: 'medium',
      economicSubstance: true,
      bepsCompliance: 'full',
      recommendationScore: 89
    },
    {
      id: 'del',
      name: 'Delaware',
      country: 'USA',
      corporateRate: 21,
      withholdingRate: 0,
      treatyNetwork: 'excellent',
      treatyCount: 65,
      advantages: ['Strong legal system', 'Court of Chancery', 'Corporate flexibility', 'No state tax on non-Delaware income'],
      disadvantages: ['US worldwide taxation', 'Complex regulations', 'FATCA requirements'],
      regulatoryComplexity: 'high',
      economicSubstance: true,
      bepsCompliance: 'full',
      recommendationScore: 85
    },
    {
      id: 'cay',
      name: 'Cayman Islands',
      country: 'Cayman Islands',
      corporateRate: 0,
      withholdingRate: 0,
      treatyNetwork: 'limited',
      treatyCount: 12,
      advantages: ['No corporate tax', 'Regulatory flexibility', 'Investor familiarity', 'No exchange controls'],
      disadvantages: ['Limited treaty network', 'Economic substance law', 'Regulatory scrutiny'],
      regulatoryComplexity: 'low',
      economicSubstance: true,
      bepsCompliance: 'partial',
      recommendationScore: 78
    },
    {
      id: 'net',
      name: 'Netherlands',
      country: 'Netherlands',
      corporateRate: 25.8,
      withholdingRate: 0,
      treatyNetwork: 'excellent',
      treatyCount: 95,
      advantages: ['Largest treaty network', 'EU directives', 'Participation exemption', 'Advanced rulings'],
      disadvantages: ['Higher corporate rate', 'Withholding tax on royalties', 'Substance requirements'],
      regulatoryComplexity: 'medium',
      economicSubstance: true,
      bepsCompliance: 'full',
      recommendationScore: 87
    },
    {
      id: 'sin',
      name: 'Singapore',
      country: 'Singapore',
      corporateRate: 17,
      withholdingRate: 0,
      treatyNetwork: 'good',
      treatyCount: 85,
      advantages: ['Strategic Asian hub', 'Competitive tax rates', 'Strong regulatory framework', 'Political stability'],
      disadvantages: ['Distance from key markets', 'Higher operational costs', 'Limited EU benefits'],
      regulatoryComplexity: 'low',
      economicSubstance: true,
      bepsCompliance: 'full',
      recommendationScore: 82
    }
  ]);

  const [structureOptions] = useState<StructureOption[]>([
    {
      id: 'lux-hold',
      name: 'Luxembourg Holding Structure',
      description: 'Luxembourg holding company with participation exemption and extensive treaty benefits',
      jurisdictions: ['Luxembourg', 'Delaware'],
      estimatedTaxRate: 12.5,
      annualSavings: 8500000,
      implementationCost: 450000,
      complexityScore: 7,
      riskLevel: 'low',
      advantages: ['Strong treaty network', 'Participation exemption', 'EU benefits'],
      risks: ['Substance requirements', 'Regulatory changes'],
      timeline: '4-6 months',
      maintenanceCost: 180000
    },
    {
      id: 'ire-hold',
      name: 'Irish Holding Structure',
      description: 'Irish holding company with low corporate rate and check-the-box election',
      jurisdictions: ['Ireland', 'Delaware'],
      estimatedTaxRate: 15.2,
      annualSavings: 6200000,
      implementationCost: 380000,
      complexityScore: 6,
      riskLevel: 'low',
      advantages: ['Low corporate rate', 'EU membership', 'English common law'],
      risks: ['CFC rules', 'Transfer pricing'],
      timeline: '3-5 months',
      maintenanceCost: 150000
    },
    {
      id: 'net-hub',
      name: 'Netherlands Hub Structure',
      description: 'Netherlands hub with extensive treaty network and EU directive benefits',
      jurisdictions: ['Netherlands', 'Luxembourg', 'Delaware'],
      estimatedTaxRate: 11.8,
      annualSavings: 9200000,
      implementationCost: 520000,
      complexityScore: 8,
      riskLevel: 'medium',
      advantages: ['Largest treaty network', 'EU directives', 'Advanced rulings'],
      risks: ['Higher complexity', 'Substance requirements', 'Regulatory scrutiny'],
      timeline: '6-8 months',
      maintenanceCost: 220000
    }
  ]);

  const [results, setResults] = useState<TaxResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const runOptimization = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const optimizationResults: TaxResults = {
        recommendedStructure: structureOptions[0],
        alternativeStructures: structureOptions.slice(1),
        taxSavingsAnalysis: {
          currentStructureTax: 21000000,
          optimizedStructureTax: 12500000,
          annualSavings: 8500000,
          cumulativeSavings: 42500000,
          savingsPercentage: 40.5,
          paybackPeriod: 0.05
        },
        jurisdictionRanking: [
          {
            jurisdiction: 'Luxembourg',
            score: 92,
            rank: 1,
            strengths: ['Extensive treaty network', 'Participation exemption', 'Political stability'],
            concerns: ['Substance requirements', 'Higher corporate rate']
          },
          {
            jurisdiction: 'Ireland',
            score: 89,
            rank: 2,
            strengths: ['Low corporate rate', 'EU membership', 'English common law'],
            concerns: ['CFC rules', 'Transfer pricing complexity']
          },
          {
            jurisdiction: 'Netherlands',
            score: 87,
            rank: 3,
            strengths: ['Largest treaty network', 'EU benefits', 'Advanced rulings'],
            concerns: ['Higher tax rate', 'Complexity', 'Substance requirements']
          }
        ],
        complianceAssessment: {
          bepsCompliance: 95,
          economicSubstance: 88,
          transferPricing: 92,
          overallCompliance: 92,
          criticalRisks: ['Substance requirements in key jurisdictions', 'Transfer pricing documentation'],
          recommendations: ['Establish adequate substance', 'Implement robust transfer pricing policies', 'Regular compliance monitoring']
        },
        treatyOptimization: {
          applicableTreaties: 15,
          withholdingReduction: 85,
          doubleTraxationRelief: 95,
          optimalTreatyPath: ['US-Luxembourg', 'Luxembourg-Target jurisdiction']
        }
      };
      
      setResults(optimizationResults);
      setIsCalculating(false);
      
      if (onResultsChange) {
        onResultsChange(optimizationResults);
      }
    }, 4000);
  };

  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-50 text-green-700';
      case 'medium': return 'bg-yellow-50 text-yellow-700';
      case 'high': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Globe className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Tax Optimization</h3>
              <p className="text-sm text-gray-600">Multi-jurisdiction tax optimization and structure analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {results && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <CheckCircle className="h-3 w-3 mr-1" />
                Optimized
              </Badge>
            )}
            {mode !== 'traditional' && (
              <Button variant="outline" size="sm">
                <Zap className="h-4 w-4 mr-1" />
                AI Optimization
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Target className="h-4 w-4 inline mr-1" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('jurisdictions')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'jurisdictions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Flag className="h-4 w-4 inline mr-1" />
            Jurisdictions
          </button>
          <button
            onClick={() => setActiveTab('structures')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'structures'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Building className="h-4 w-4 inline mr-1" />
            Structures
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'compliance'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Shield className="h-4 w-4 inline mr-1" />
            Compliance
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'results'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-1" />
            Results
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Deal Parameters */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Deal Parameters</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deal Size ($M)</label>
                  <Input
                    type="number"
                    value={inputs.dealSize / 1000000}
                    onChange={(e) => setInputs(prev => ({ ...prev, dealSize: Number(e.target.value) * 1000000 }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Investment Horizon (years)</label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={inputs.investmentHorizon}
                    onChange={(e) => setInputs(prev => ({ ...prev, investmentHorizon: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Returns (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={inputs.expectedReturns * 100}
                    onChange={(e) => setInputs(prev => ({ ...prev, expectedReturns: Number(e.target.value) / 100 }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Jurisdiction</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={inputs.currentJurisdiction}
                    onChange={(e) => setInputs(prev => ({ ...prev, currentJurisdiction: e.target.value }))}
                  >
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="GER">Germany</option>
                    <option value="FRA">France</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deal Type</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={inputs.dealType}
                    onChange={(e) => setInputs(prev => ({ ...prev, dealType: e.target.value }))}
                  >
                    <option value="acquisition">Acquisition</option>
                    <option value="joint_venture">Joint Venture</option>
                    <option value="greenfield">Greenfield Investment</option>
                    <option value="restructuring">Restructuring</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={inputs.currency}
                    onChange={(e) => setInputs(prev => ({ ...prev, currency: e.target.value }))}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Key Metrics Preview */}
            {results && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center">
                  <TrendingDown className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(results.taxSavingsAnalysis.annualSavings)}
                  </div>
                  <div className="text-sm text-gray-600">Annual Savings</div>
                </Card>

                <Card className="p-4 text-center">
                  <Percent className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-blue-600">
                    {formatPercentage(results.taxSavingsAnalysis.savingsPercentage)}
                  </div>
                  <div className="text-sm text-gray-600">Tax Reduction</div>
                </Card>

                <Card className="p-4 text-center">
                  <Flag className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-purple-600">
                    {results.recommendedStructure.jurisdictions.length}
                  </div>
                  <div className="text-sm text-gray-600">Jurisdictions</div>
                </Card>

                <Card className="p-4 text-center">
                  <Shield className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-orange-600">
                    {results.complianceAssessment.overallCompliance}
                  </div>
                  <div className="text-sm text-gray-600">Compliance Score</div>
                </Card>
              </div>
            )}

            {/* Quick Analysis Summary */}
            <Card className="p-4">
              <h5 className="font-medium text-gray-900 mb-3">Analysis Summary</h5>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Deal size of {formatCurrency(inputs.dealSize)} qualifies for advanced tax optimization</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>{inputs.investmentHorizon}-year horizon provides significant optimization opportunities</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span>Current {inputs.currentJurisdiction} structure may not be optimal for tax efficiency</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Multiple jurisdiction options available for {inputs.dealType} structures</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Jurisdictions Tab */}
        {activeTab === 'jurisdictions' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {jurisdictions.map((jurisdiction) => (
                <Card key={jurisdiction.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <Flag className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">{jurisdiction.name}</h4>
                        <p className="text-sm text-gray-600">{jurisdiction.country}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Score: {jurisdiction.recommendationScore}</Badge>
                      <Badge variant={jurisdiction.treatyNetwork === 'excellent' ? "default" : "outline"}>
                        {jurisdiction.treatyNetwork} treaties
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-600">Corporate Rate:</span>
                      <div className="font-medium">{formatPercentage(jurisdiction.corporateRate)}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Withholding Rate:</span>
                      <div className="font-medium">{formatPercentage(jurisdiction.withholdingRate)}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Treaties:</span>
                      <div className="font-medium">{jurisdiction.treatyCount}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Complexity:</span>
                      <Badge variant="outline" className={
                        jurisdiction.regulatoryComplexity === 'low' ? 'text-green-600' :
                        jurisdiction.regulatoryComplexity === 'medium' ? 'text-yellow-600' : 'text-red-600'
                      }>
                        {jurisdiction.regulatoryComplexity}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h6 className="text-sm font-medium text-green-800 mb-2">Key Advantages</h6>
                      <ul className="text-sm space-y-1">
                        {jurisdiction.advantages.map((advantage, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h6 className="text-sm font-medium text-red-800 mb-2">Considerations</h6>
                      <ul className="text-sm space-y-1">
                        {jurisdiction.disadvantages.map((disadvantage, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertTriangle className="h-3 w-3 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{disadvantage}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span>Economic Substance: {jurisdiction.economicSubstance ? 'Required' : 'Not Required'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Gavel className="h-4 w-4 text-purple-600" />
                        <span>BEPS: {jurisdiction.bepsCompliance}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Structures Tab */}
        {activeTab === 'structures' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {structureOptions.map((structure, index) => (
                <Card key={structure.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{structure.name}</h4>
                      <p className="text-sm text-gray-600">{structure.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {index === 0 && <Badge variant="default">Recommended</Badge>}
                      <Badge variant="outline" className={getRiskColor(structure.riskLevel)}>
                        {structure.riskLevel} risk
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-600">Effective Tax Rate:</span>
                      <div className="font-medium text-green-600">{formatPercentage(structure.estimatedTaxRate)}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Annual Savings:</span>
                      <div className="font-medium text-green-600">{formatCurrency(structure.annualSavings)}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Implementation Cost:</span>
                      <div className="font-medium">${structure.implementationCost.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Timeline:</span>
                      <div className="font-medium">{structure.timeline}</div>
                    </div>
                  </div>

                  <div>
                    <h6 className="text-sm font-medium mb-2">Jurisdictions Involved:</h6>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {structure.jurisdictions.map((jurisdiction, idx) => (
                        <Badge key={idx} variant="outline" className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {jurisdiction}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h6 className="text-sm font-medium text-green-800 mb-2">Key Benefits</h6>
                      <ul className="text-sm space-y-1">
                        {structure.advantages.map((advantage, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h6 className="text-sm font-medium text-red-800 mb-2">Key Risks</h6>
                      <ul className="text-sm space-y-1">
                        {structure.risks.map((risk, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <AlertTriangle className="h-3 w-3 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t">
                    <div className="flex justify-between items-center text-sm">
                      <span>Complexity Score: {structure.complexityScore}/10</span>
                      <span>Annual Maintenance: ${structure.maintenanceCost.toLocaleString()}</span>
                    </div>
                    <Progress value={structure.complexityScore * 10} className="mt-2 h-2" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Compliance Tab */}
        {activeTab === 'compliance' && (
          <div className="space-y-6">
            <Card className="p-4">
              <h4 className="font-medium text-gray-900 mb-4">Compliance Framework</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Shield className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <h5 className="font-medium mb-2">BEPS Compliance</h5>
                  <p className="text-sm text-gray-600 mb-3">
                    Base Erosion and Profit Shifting regulations ensure substance and economic reality in tax structures.
                  </p>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500">Action 2: Hybrid Mismatches</div>
                    <div className="text-xs text-gray-500">Action 6: Treaty Shopping</div>
                    <div className="text-xs text-gray-500">Action 13: Documentation</div>
                  </div>
                </div>

                <div className="text-center">
                  <Building className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <h5 className="font-medium mb-2">Economic Substance</h5>
                  <p className="text-sm text-gray-600 mb-3">
                    Ensure adequate economic substance in key jurisdictions through business activities and management.
                  </p>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500">Local Management</div>
                    <div className="text-xs text-gray-500">Business Activities</div>
                    <div className="text-xs text-gray-500">Expenditure Requirements</div>
                  </div>
                </div>

                <div className="text-center">
                  <FileText className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                  <h5 className="font-medium mb-2">Transfer Pricing</h5>
                  <p className="text-sm text-gray-600 mb-3">
                    Arm's length pricing for intercompany transactions with comprehensive documentation.
                  </p>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500">Master File</div>
                    <div className="text-xs text-gray-500">Local File</div>
                    <div className="text-xs text-gray-500">CbC Reporting</div>
                  </div>
                </div>
              </div>
            </Card>

            {results && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h5 className="font-medium text-gray-900 mb-4">Compliance Scores</h5>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">BEPS Compliance</span>
                        <span className={`font-medium ${getComplianceColor(results.complianceAssessment.bepsCompliance)}`}>
                          {results.complianceAssessment.bepsCompliance}%
                        </span>
                      </div>
                      <Progress value={results.complianceAssessment.bepsCompliance} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Economic Substance</span>
                        <span className={`font-medium ${getComplianceColor(results.complianceAssessment.economicSubstance)}`}>
                          {results.complianceAssessment.economicSubstance}%
                        </span>
                      </div>
                      <Progress value={results.complianceAssessment.economicSubstance} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Transfer Pricing</span>
                        <span className={`font-medium ${getComplianceColor(results.complianceAssessment.transferPricing)}`}>
                          {results.complianceAssessment.transferPricing}%
                        </span>
                      </div>
                      <Progress value={results.complianceAssessment.transferPricing} className="h-2" />
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">Overall Compliance</span>
                        <span className={`font-bold text-lg ${getComplianceColor(results.complianceAssessment.overallCompliance)}`}>
                          {results.complianceAssessment.overallCompliance}%
                        </span>
                      </div>
                      <Progress value={results.complianceAssessment.overallCompliance} className="h-3" />
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h5 className="font-medium text-gray-900 mb-4">Critical Recommendations</h5>
                  <div className="space-y-3">
                    {results.complianceAssessment.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-blue-800">{recommendation}</span>
                      </div>
                    ))}
                  </div>

                  {results.complianceAssessment.criticalRisks.length > 0 && (
                    <div className="mt-4">
                      <h6 className="font-medium text-red-800 mb-2">Critical Risks</h6>
                      <div className="space-y-2">
                        {results.complianceAssessment.criticalRisks.map((risk, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-red-700">{risk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            {!results ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Run the tax optimization analysis to see detailed results</p>
                <Button onClick={runOptimization} disabled={isCalculating}>
                  <Calculator className="h-4 w-4 mr-2" />
                  {isCalculating ? 'Optimizing...' : 'Run Tax Optimization'}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Tax Savings Analysis */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Tax Savings Analysis</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">
                        {formatCurrency(results.taxSavingsAnalysis.currentStructureTax)}
                      </div>
                      <div className="text-sm text-gray-600">Current Annual Tax</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {formatCurrency(results.taxSavingsAnalysis.optimizedStructureTax)}
                      </div>
                      <div className="text-sm text-gray-600">Optimized Annual Tax</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {formatCurrency(results.taxSavingsAnalysis.annualSavings)}
                      </div>
                      <div className="text-sm text-gray-600">Annual Savings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">
                        {formatPercentage(results.taxSavingsAnalysis.savingsPercentage)}
                      </div>
                      <div className="text-sm text-gray-600">Savings Percentage</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">
                        {formatCurrency(results.taxSavingsAnalysis.cumulativeSavings)}
                      </div>
                      <div className="text-sm text-gray-600">5-Year Savings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {(results.taxSavingsAnalysis.paybackPeriod * 12).toFixed(0)} days
                      </div>
                      <div className="text-sm text-gray-600">Payback Period</div>
                    </div>
                  </div>
                </Card>

                {/* Recommended Structure */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Recommended Structure
                  </h3>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">{results.recommendedStructure.name}</h4>
                    <p className="text-sm text-green-800 mb-3">{results.recommendedStructure.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-green-700">Effective Rate:</span>
                        <div className="font-medium text-green-900">{formatPercentage(results.recommendedStructure.estimatedTaxRate)}</div>
                      </div>
                      <div>
                        <span className="text-green-700">Annual Savings:</span>
                        <div className="font-medium text-green-900">{formatCurrency(results.recommendedStructure.annualSavings)}</div>
                      </div>
                      <div>
                        <span className="text-green-700">Implementation:</span>
                        <div className="font-medium text-green-900">${results.recommendedStructure.implementationCost.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-green-700">Timeline:</span>
                        <div className="font-medium text-green-900">{results.recommendedStructure.timeline}</div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Jurisdiction Ranking */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Jurisdiction Ranking</h3>
                  <div className="space-y-3">
                    {results.jurisdictionRanking.map((jurisdiction, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="font-medium text-blue-600">#{jurisdiction.rank}</span>
                          </div>
                          <div>
                            <h5 className="font-medium">{jurisdiction.jurisdiction}</h5>
                            <div className="flex gap-2 mt-1">
                              {jurisdiction.strengths.slice(0, 2).map((strength, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs text-green-700">
                                  {strength}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{jurisdiction.score}</div>
                          <div className="text-xs text-gray-500">Score</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Treaty Optimization */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Treaty Optimization</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{results.treatyOptimization.applicableTreaties}</div>
                      <div className="text-sm text-gray-600">Applicable Treaties</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{formatPercentage(results.treatyOptimization.withholdingReduction)}</div>
                      <div className="text-sm text-gray-600">Withholding Reduction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{formatPercentage(results.treatyOptimization.doubleTraxationRelief)}</div>
                      <div className="text-sm text-gray-600">Double Tax Relief</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{results.treatyOptimization.optimalTreatyPath.length}</div>
                      <div className="text-sm text-gray-600">Treaty Steps</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h5 className="text-sm font-medium mb-2">Optimal Treaty Path:</h5>
                    <div className="flex items-center gap-2">
                      {results.treatyOptimization.optimalTreatyPath.map((step, index) => (
                        <React.Fragment key={index}>
                          <Badge variant="outline">{step}</Badge>
                          {index < results.treatyOptimization.optimalTreatyPath.length - 1 && (
                            <TrendingUp className="h-4 w-4 text-gray-400" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Calculate Button */}
        {activeTab !== 'results' && (
          <div className="flex justify-center">
            <Button onClick={runOptimization} disabled={isCalculating} className="px-8">
              <Calculator className="h-4 w-4 mr-2" />
              {isCalculating ? 'Running Optimization...' : 'Run Tax Optimization'}
            </Button>
          </div>
        )}

        {/* AI Insights for non-traditional modes */}
        {mode !== 'traditional' && results && (
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-l-blue-500">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-blue-900 mb-2">AI Tax Optimization Insights</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Luxembourg holding structure offers optimal balance of tax efficiency and treaty benefits</li>
                  <li>• Potential annual savings of {formatCurrency(results.taxSavingsAnalysis.annualSavings)} with {formatPercentage(results.taxSavingsAnalysis.savingsPercentage)} tax reduction</li>
                  <li>• High compliance score of {results.complianceAssessment.overallCompliance}% minimizes regulatory risk</li>
                  <li>• Implementation timeline of 4-6 months with manageable complexity</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Warning */}
        <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong>Important:</strong> Tax optimization structures require careful legal and regulatory analysis. 
            All recommendations should be validated with qualified tax advisors and legal counsel in relevant jurisdictions. 
            Regulatory requirements and tax laws are subject to change.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxOptimizationCard;