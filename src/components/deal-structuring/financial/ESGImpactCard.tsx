'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Target,
  TrendingUp,
  Users,
  TreePine,
  Building,
  Globe,
  Heart,
  Zap,
  Droplet,
  Recycle,
  GraduationCap,
  Shield,
  HandHeart,
  Factory,
  PieChart,
  BarChart3,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  AlertTriangle,
  CheckCircle,
  Star,
  Calendar,
  Download,
  Plus,
  Eye,
  Edit,
  Map,
  Filter,
  Calculator
} from 'lucide-react';

interface ESGImpactCardProps {
  dealId: string;
  mode?: string;
  onResultsChange?: (results: any) => void;
}

interface ImpactDimension {
  id: string;
  name: string;
  category: 'environmental' | 'social' | 'governance';
  description: string;
  measurementUnit: string;
  baseline: number;
  current: number;
  target: number;
  targetDate: Date;
  trend: 'improving' | 'stable' | 'declining';
  impact: 'positive' | 'negative' | 'neutral';
  confidence: 'high' | 'medium' | 'low';
  stakeholders: string[];
  sdgAlignment: number[];
  lastMeasured: Date;
}

interface StakeholderGroup {
  id: string;
  name: string;
  type: 'primary' | 'secondary';
  size: number;
  influence: 'high' | 'medium' | 'low';
  interest: 'high' | 'medium' | 'low';
  impactAreas: string[];
  engagementLevel: number;
  satisfactionScore: number;
  risks: string[];
  opportunities: string[];
}

interface ImpactMetrics {
  totalBeneficiaries: number;
  directBeneficiaries: number;
  indirectBeneficiaries: number;
  co2Avoided: number;
  waterSaved: number;
  wasteReduced: number;
  jobsCreated: number;
  livesImproved: number;
  biodiversityProtected: number;
  energySaved: number;
  costPerBeneficiary: number;
  returnOnImpact: number;
  socialReturnOnInvestment: number;
}

interface ESGResults {
  impactMetrics: ImpactMetrics;
  overallScore: {
    environmental: number;
    social: number;
    governance: number;
    composite: number;
  };
  performanceIndicators: {
    carbonIntensity: number;
    waterEfficiency: number;
    employeeTurnover: number;
    diversityIndex: number;
    governanceScore: number;
    stakeholderSatisfaction: number;
  };
  riskAssessment: {
    climateRisk: 'low' | 'medium' | 'high';
    socialRisk: 'low' | 'medium' | 'high';
    governanceRisk: 'low' | 'medium' | 'high';
    overallRisk: 'low' | 'medium' | 'high';
  };
  benchmarkComparison: {
    industryAverage: number;
    topQuartile: number;
    ranking: number;
    percentile: number;
  };
  recommendations: string[];
}

const ESGImpactCard: React.FC<ESGImpactCardProps> = ({ 
  dealId, 
  mode = 'traditional',
  onResultsChange 
}) => {
  const [dimensions] = useState<ImpactDimension[]>([
    {
      id: 'carbon-reduction',
      name: 'Carbon Emissions Reduction',
      category: 'environmental',
      description: 'Reduction in greenhouse gas emissions from operations',
      measurementUnit: 'tonnes CO2e',
      baseline: 5000,
      current: 3500,
      target: 2500,
      targetDate: new Date('2025-12-31'),
      trend: 'improving',
      impact: 'positive',
      confidence: 'high',
      stakeholders: ['Employees', 'Regulators', 'Community'],
      sdgAlignment: [13, 7, 11],
      lastMeasured: new Date()
    },
    {
      id: 'water-conservation',
      name: 'Water Conservation',
      category: 'environmental',
      description: 'Reduction in water consumption through efficiency measures',
      measurementUnit: 'million liters',
      baseline: 100,
      current: 75,
      target: 50,
      targetDate: new Date('2025-12-31'),
      trend: 'improving',
      impact: 'positive',
      confidence: 'medium',
      stakeholders: ['Community', 'Regulators'],
      sdgAlignment: [6, 14, 15],
      lastMeasured: new Date()
    },
    {
      id: 'job-creation',
      name: 'Local Job Creation',
      category: 'social',
      description: 'Number of direct and indirect jobs created in local communities',
      measurementUnit: 'full-time jobs',
      baseline: 0,
      current: 150,
      target: 300,
      targetDate: new Date('2026-12-31'),
      trend: 'improving',
      impact: 'positive',
      confidence: 'high',
      stakeholders: ['Employees', 'Community', 'Government'],
      sdgAlignment: [8, 1, 10],
      lastMeasured: new Date()
    },
    {
      id: 'diversity-inclusion',
      name: 'Diversity & Inclusion',
      category: 'social',
      description: 'Improvement in workplace diversity and inclusion metrics',
      measurementUnit: 'diversity index (0-100)',
      baseline: 45,
      current: 68,
      target: 80,
      targetDate: new Date('2025-12-31'),
      trend: 'improving',
      impact: 'positive',
      confidence: 'high',
      stakeholders: ['Employees', 'Society'],
      sdgAlignment: [5, 10, 16],
      lastMeasured: new Date()
    },
    {
      id: 'governance-transparency',
      name: 'Governance Transparency',
      category: 'governance',
      description: 'Improvement in governance transparency and accountability',
      measurementUnit: 'transparency score (0-100)',
      baseline: 60,
      current: 82,
      target: 90,
      targetDate: new Date('2025-12-31'),
      trend: 'improving',
      impact: 'positive',
      confidence: 'high',
      stakeholders: ['Investors', 'Regulators', 'Public'],
      sdgAlignment: [16, 17],
      lastMeasured: new Date()
    }
  ]);

  const [stakeholders] = useState<StakeholderGroup[]>([
    {
      id: 'employees',
      name: 'Employees',
      type: 'primary',
      size: 500,
      influence: 'high',
      interest: 'high',
      impactAreas: ['Job Security', 'Skills Development', 'Workplace Diversity'],
      engagementLevel: 85,
      satisfactionScore: 78,
      risks: ['Skills gap', 'Job displacement from automation'],
      opportunities: ['Career advancement', 'New skill development']
    },
    {
      id: 'community',
      name: 'Local Community',
      type: 'primary',
      size: 50000,
      influence: 'medium',
      interest: 'high',
      impactAreas: ['Environmental Quality', 'Economic Development', 'Social Infrastructure'],
      engagementLevel: 72,
      satisfactionScore: 68,
      risks: ['Environmental degradation', 'Gentrification'],
      opportunities: ['Job creation', 'Infrastructure development']
    },
    {
      id: 'investors',
      name: 'Investors',
      type: 'primary',
      size: 25,
      influence: 'high',
      interest: 'high',
      impactAreas: ['Financial Returns', 'ESG Performance', 'Risk Management'],
      engagementLevel: 90,
      satisfactionScore: 82,
      risks: ['ESG non-compliance', 'Reputational damage'],
      opportunities: ['Enhanced returns', 'Portfolio diversification']
    },
    {
      id: 'suppliers',
      name: 'Supply Chain Partners',
      type: 'secondary',
      size: 150,
      influence: 'medium',
      interest: 'medium',
      impactAreas: ['Business Growth', 'Sustainability Standards', 'Fair Practices'],
      engagementLevel: 65,
      satisfactionScore: 74,
      risks: ['Compliance costs', 'Supply chain disruption'],
      opportunities: ['Business expansion', 'Capability building']
    }
  ]);

  const [results, setResults] = useState<ESGResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Calculate impact metrics
  const impactMetrics = useMemo((): ImpactMetrics => {
    const totalBeneficiaries = 75000;
    const directBeneficiaries = Math.floor(totalBeneficiaries * 0.6);
    const indirectBeneficiaries = totalBeneficiaries - directBeneficiaries;

    const carbonDimension = dimensions.find(d => d.id === 'carbon-reduction');
    const co2Avoided = carbonDimension ? carbonDimension.baseline - carbonDimension.current : 0;

    const waterDimension = dimensions.find(d => d.id === 'water-conservation');
    const waterSaved = waterDimension ? (waterDimension.baseline - waterDimension.current) * 1000000 : 0;

    const jobDimension = dimensions.find(d => d.id === 'job-creation');
    const jobsCreated = jobDimension ? jobDimension.current : 0;

    const totalInvestment = 7200000;
    const costPerBeneficiary = totalBeneficiaries > 0 ? totalInvestment / totalBeneficiaries : 0;

    return {
      totalBeneficiaries,
      directBeneficiaries,
      indirectBeneficiaries,
      co2Avoided,
      waterSaved,
      wasteReduced: 50000,
      jobsCreated,
      livesImproved: directBeneficiaries,
      biodiversityProtected: 1200,
      energySaved: 2500000,
      costPerBeneficiary,
      returnOnImpact: 2.5,
      socialReturnOnInvestment: 4.2
    };
  }, [dimensions]);

  const runAnalysis = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const analysisResults: ESGResults = {
        impactMetrics,
        overallScore: {
          environmental: 78,
          social: 72,
          governance: 85,
          composite: 78
        },
        performanceIndicators: {
          carbonIntensity: 2.8,
          waterEfficiency: 85,
          employeeTurnover: 12,
          diversityIndex: 68,
          governanceScore: 82,
          stakeholderSatisfaction: 76
        },
        riskAssessment: {
          climateRisk: 'medium',
          socialRisk: 'low',
          governanceRisk: 'low',
          overallRisk: 'low'
        },
        benchmarkComparison: {
          industryAverage: 65,
          topQuartile: 80,
          ranking: 15,
          percentile: 78
        },
        recommendations: [
          'Accelerate renewable energy adoption to improve environmental score',
          'Enhance stakeholder engagement programs in underperforming areas',
          'Implement advanced water management systems',
          'Strengthen diversity recruitment and retention programs',
          'Expand community investment initiatives'
        ]
      };
      
      setResults(analysisResults);
      setIsCalculating(false);
      
      if (onResultsChange) {
        onResultsChange(analysisResults);
      }
    }, 2500);
  };

  const filteredDimensions = useMemo(() => {
    return dimensions.filter(dimension => {
      if (selectedCategory !== 'all' && dimension.category !== selectedCategory) return false;
      return true;
    });
  }, [dimensions, selectedCategory]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case 'declining': return <ArrowDownRight className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getImpactIcon = (category: string) => {
    switch (category) {
      case 'environmental': return <TreePine className="h-4 w-4 text-green-600" />;
      case 'social': return <Heart className="h-4 w-4 text-red-600" />;
      case 'governance': return <Building className="h-4 w-4 text-purple-600" />;
      default: return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const calculateProgress = (current: number, baseline: number, target: number) => {
    if (target === baseline) return 100;
    return Math.min(100, Math.max(0, ((current - baseline) / (target - baseline)) * 100));
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">ESG Impact Assessment</h3>
              <p className="text-sm text-gray-600">Environmental, social, and governance impact measurement and analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {results && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <CheckCircle className="h-3 w-3 mr-1" />
                Assessed
              </Badge>
            )}
            <Badge variant="secondary" className="px-3 py-1">
              {impactMetrics.totalBeneficiaries.toLocaleString()} Beneficiaries
            </Badge>
            {mode !== 'traditional' && (
              <Button variant="outline" size="sm">
                <Zap className="h-4 w-4 mr-1" />
                AI Insights
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
            onClick={() => setActiveTab('dimensions')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'dimensions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-1" />
            Dimensions
          </button>
          <button
            onClick={() => setActiveTab('stakeholders')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'stakeholders'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="h-4 w-4 inline mr-1" />
            Stakeholders
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'metrics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <PieChart className="h-4 w-4 inline mr-1" />
            Metrics
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'results'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <LineChart className="h-4 w-4 inline mr-1" />
            Results
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Impact Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-blue-600">
                  {impactMetrics.totalBeneficiaries.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Beneficiaries</div>
                <div className="text-xs text-gray-500 mt-1">
                  {impactMetrics.directBeneficiaries.toLocaleString()} direct
                </div>
              </Card>

              <Card className="p-4 text-center">
                <TreePine className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-green-600">
                  {impactMetrics.co2Avoided.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">CO₂ Avoided</div>
                <div className="text-xs text-gray-500 mt-1">tonnes CO₂e</div>
              </Card>

              <Card className="p-4 text-center">
                <HandHeart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-red-600">
                  {impactMetrics.jobsCreated}
                </div>
                <div className="text-sm text-gray-600">Jobs Created</div>
                <div className="text-xs text-gray-500 mt-1">full-time equivalent</div>
              </Card>

              <Card className="p-4 text-center">
                <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-purple-600">
                  {impactMetrics.socialReturnOnInvestment}x
                </div>
                <div className="text-sm text-gray-600">SROI</div>
                <div className="text-xs text-gray-500 mt-1">social return</div>
              </Card>
            </div>

            {/* Impact Categories Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TreePine className="h-4 w-4 text-green-600" />
                  Environmental Impact
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Carbon Reduction</span>
                    <span className="font-medium text-green-600">-30%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Water Conservation</span>
                    <span className="font-medium text-green-600">-25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Renewable Energy</span>
                    <span className="font-medium text-green-600">+65%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Biodiversity Protected</span>
                    <span className="font-medium text-green-600">1.2k hectares</span>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-600" />
                  Social Impact
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Direct Jobs</span>
                    <span className="font-medium text-red-600">{impactMetrics.jobsCreated}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Lives Improved</span>
                    <span className="font-medium text-red-600">{impactMetrics.livesImproved.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Diversity Index</span>
                    <span className="font-medium text-red-600">68/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Community Investment</span>
                    <span className="font-medium text-red-600">$2.5M</span>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Building className="h-4 w-4 text-purple-600" />
                  Governance Impact
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Transparency Score</span>
                    <span className="font-medium text-purple-600">82/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Ethics Compliance</span>
                    <span className="font-medium text-purple-600">94%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Board Independence</span>
                    <span className="font-medium text-purple-600">85%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Stakeholder Engagement</span>
                    <span className="font-medium text-purple-600">86/100</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* SDG Alignment */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                UN SDG Alignment
              </h3>
              <div className="flex flex-wrap gap-2">
                {[1, 3, 5, 6, 7, 8, 10, 11, 13, 14, 15, 16, 17].map(sdg => (
                  <Badge key={sdg} variant="outline" className="text-sm">
                    SDG {sdg}
                  </Badge>
                ))}
              </div>
              <div className="mt-3 text-sm text-gray-600">
                This initiative directly contributes to 13 UN Sustainable Development Goals across environmental, social, and governance dimensions.
              </div>
            </Card>
          </div>
        )}

        {/* Dimensions Tab */}
        {activeTab === 'dimensions' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
              <select 
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="environmental">Environmental</option>
                <option value="social">Social</option>
                <option value="governance">Governance</option>
              </select>
            </div>

            {/* Dimensions List */}
            <div className="space-y-4">
              {filteredDimensions.map(dimension => (
                <Card key={dimension.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getImpactIcon(dimension.category)}
                        <h4 className="font-medium">{dimension.name}</h4>
                        <Badge variant="outline">{dimension.category}</Badge>
                        <Badge variant={dimension.impact === 'positive' ? "default" : "outline"}>
                          {dimension.impact}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(dimension.trend)}
                          <span className="text-sm">{dimension.trend}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{dimension.description}</p>
                      
                      {/* Progress Visualization */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>Progress toward target</span>
                          <span className="font-medium">
                            {dimension.current} / {dimension.target} {dimension.measurementUnit}
                          </span>
                        </div>
                        <Progress 
                          value={calculateProgress(dimension.current, dimension.baseline, dimension.target)} 
                          className="h-2" 
                        />
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>Baseline: {dimension.baseline}</span>
                          <span>Target: {dimension.target} by {dimension.targetDate.getFullYear()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge variant="outline" className={getConfidenceColor(dimension.confidence)}>
                        {dimension.confidence} confidence
                      </Badge>
                    </div>
                  </div>

                  {/* Stakeholders and SDGs */}
                  <div className="border-t pt-3 mt-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Affected Stakeholders</h5>
                        <div className="flex flex-wrap gap-1">
                          {dimension.stakeholders.map(stakeholder => (
                            <Badge key={stakeholder} variant="secondary" className="text-xs">
                              {stakeholder}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">SDG Alignment</h5>
                        <div className="flex flex-wrap gap-1">
                          {dimension.sdgAlignment.map(sdg => (
                            <Badge key={sdg} variant="outline" className="text-xs">
                              SDG {sdg}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Stakeholders Tab */}
        {activeTab === 'stakeholders' && (
          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Stakeholder Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stakeholders.map(stakeholder => (
                  <Card key={stakeholder.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{stakeholder.name}</h4>
                        <div className="text-sm text-gray-600">
                          {stakeholder.size.toLocaleString()} {stakeholder.type === 'primary' ? 'primary' : 'secondary'} stakeholder
                        </div>
                      </div>
                      <Badge variant="outline">
                        {stakeholder.influence} influence
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Interest Level</div>
                          <Badge variant="outline">{stakeholder.interest}</Badge>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Type</div>
                          <Badge variant="outline">{stakeholder.type}</Badge>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Engagement Level</div>
                        <Progress value={stakeholder.engagementLevel} className="h-2" />
                        <div className="text-xs text-gray-500 mt-1">{stakeholder.engagementLevel}%</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Satisfaction Score</div>
                        <Progress value={stakeholder.satisfactionScore} className="h-2" />
                        <div className="text-xs text-gray-500 mt-1">{stakeholder.satisfactionScore}%</div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium mb-2">Impact Areas</div>
                        <div className="flex flex-wrap gap-1">
                          {stakeholder.impactAreas.map(area => (
                            <Badge key={area} variant="outline" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium mb-1 text-red-600">Key Risks</div>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {stakeholder.risks.slice(0, 2).map((risk, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <AlertTriangle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                                {risk}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="text-sm font-medium mb-1 text-green-600">Opportunities</div>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {stakeholder.opportunities.slice(0, 2).map((opportunity, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                {opportunity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Metrics Tab */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            {/* Key Impact Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <TreePine className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">
                  {impactMetrics.co2Avoided.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Tonnes CO₂ Avoided</div>
              </Card>

              <Card className="p-4 text-center">
                <Droplet className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">
                  {(impactMetrics.waterSaved / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-gray-600">Liters Water Saved</div>
              </Card>

              <Card className="p-4 text-center">
                <HandHeart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-600">
                  {impactMetrics.jobsCreated}
                </div>
                <div className="text-sm text-gray-600">Jobs Created</div>
              </Card>

              <Card className="p-4 text-center">
                <Globe className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">
                  {impactMetrics.biodiversityProtected.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Hectares Protected</div>
              </Card>
            </div>

            {/* Financial Impact Metrics */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Financial Impact Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    ${impactMetrics.costPerBeneficiary.toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-600">Cost per Beneficiary</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {impactMetrics.returnOnImpact}x
                  </div>
                  <div className="text-sm text-gray-600">Return on Impact</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {impactMetrics.socialReturnOnInvestment}x
                  </div>
                  <div className="text-sm text-gray-600">Social ROI</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    ${(impactMetrics.energySaved * 0.12).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Energy Cost Savings</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            {!results ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Run the ESG impact assessment to see detailed results</p>
                <Button onClick={runAnalysis} disabled={isCalculating}>
                  <Calculator className="h-4 w-4 mr-2" />
                  {isCalculating ? 'Calculating...' : 'Run ESG Assessment'}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Overall Scores */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">ESG Scores</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{results.overallScore.environmental}</div>
                      <div className="text-sm text-gray-600">Environmental</div>
                      <Progress value={results.overallScore.environmental} className="mt-2" />
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">{results.overallScore.social}</div>
                      <div className="text-sm text-gray-600">Social</div>
                      <Progress value={results.overallScore.social} className="mt-2" />
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">{results.overallScore.governance}</div>
                      <div className="text-sm text-gray-600">Governance</div>
                      <Progress value={results.overallScore.governance} className="mt-2" />
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{results.overallScore.composite}</div>
                      <div className="text-sm text-gray-600">Composite</div>
                      <Progress value={results.overallScore.composite} className="mt-2" />
                    </div>
                  </div>
                </Card>

                {/* Risk Assessment */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Risk Assessment</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className={`p-3 rounded-lg ${getRiskColor(results.riskAssessment.climateRisk)}`}>
                        <TreePine className="h-6 w-6 mx-auto mb-2" />
                        <div className="font-medium capitalize">{results.riskAssessment.climateRisk}</div>
                        <div className="text-sm">Climate Risk</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`p-3 rounded-lg ${getRiskColor(results.riskAssessment.socialRisk)}`}>
                        <Heart className="h-6 w-6 mx-auto mb-2" />
                        <div className="font-medium capitalize">{results.riskAssessment.socialRisk}</div>
                        <div className="text-sm">Social Risk</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`p-3 rounded-lg ${getRiskColor(results.riskAssessment.governanceRisk)}`}>
                        <Building className="h-6 w-6 mx-auto mb-2" />
                        <div className="font-medium capitalize">{results.riskAssessment.governanceRisk}</div>
                        <div className="text-sm">Governance Risk</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`p-3 rounded-lg ${getRiskColor(results.riskAssessment.overallRisk)}`}>
                        <Shield className="h-6 w-6 mx-auto mb-2" />
                        <div className="font-medium capitalize">{results.riskAssessment.overallRisk}</div>
                        <div className="text-sm">Overall Risk</div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Benchmark Comparison */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Industry Benchmark</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gray-600">{results.benchmarkComparison.industryAverage}</div>
                      <div className="text-sm text-gray-600">Industry Average</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{results.benchmarkComparison.topQuartile}</div>
                      <div className="text-sm text-gray-600">Top Quartile</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">#{results.benchmarkComparison.ranking}</div>
                      <div className="text-sm text-gray-600">Industry Ranking</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{results.benchmarkComparison.percentile}th</div>
                      <div className="text-sm text-gray-600">Percentile</div>
                    </div>
                  </div>
                </Card>

                {/* Recommendations */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Key Recommendations</h3>
                  <div className="space-y-3">
                    {results.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-blue-800">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Calculate Button */}
        {activeTab !== 'results' && (
          <div className="flex justify-center">
            <Button onClick={runAnalysis} disabled={isCalculating} className="px-8">
              <Calculator className="h-4 w-4 mr-2" />
              {isCalculating ? 'Running Assessment...' : 'Run ESG Assessment'}
            </Button>
          </div>
        )}

        {/* AI Insights for non-traditional modes */}
        {mode !== 'traditional' && results && (
          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-l-green-500">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-green-900 mb-2">AI ESG Analysis Insights</h5>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Environmental performance is strong with 78/100 score - focus on renewable energy acceleration</li>
                  <li>• Social impact initiatives show measurable community benefits with 150 jobs created</li>
                  <li>• Governance transparency at 82/100 exceeds industry average - maintain leadership position</li>
                  <li>• Overall risk profile is low with composite ESG score in 78th percentile</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Warning */}
        <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong>Note:</strong> ESG impact assessment requires comprehensive data collection and stakeholder engagement. 
            Results should be validated through third-party verification and continuous monitoring systems.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ESGImpactCard;