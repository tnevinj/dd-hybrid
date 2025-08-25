'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Simple breadcrumb implementation (no external component needed)
import {
  ArrowLeft,
  TrendingUp,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Brain,
  Bot,
  List,
  Settings,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  BarChart3
} from 'lucide-react';

import { DealOpportunity, AIRecommendation } from '@/types/deal-screening';
import { useNavigationStoreRefactored } from '@/stores/navigation-store-refactored';
import { ComparativeValuationAnalysis } from '@/components/deal-screening/ComparativeValuationAnalysis';

// Mode-aware opportunity detail components
const TraditionalOpportunityView: React.FC<{
  opportunity: DealOpportunity;
  onStartScreening: () => void;
  onViewWorkspace: () => void;
}> = ({ opportunity, onStartScreening, onViewWorkspace }) => (
  <Tabs defaultValue="overview" className="space-y-6">
    <TabsList className="grid w-full grid-cols-3">
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="valuation">Valuation Analysis</TabsTrigger>
      <TabsTrigger value="actions">Actions</TabsTrigger>
    </TabsList>

    <TabsContent value="overview" className="space-y-6">
      {/* Key Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Key Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{opportunity.expectedIRR}%</div>
              <div className="text-sm text-gray-600">Expected IRR</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{opportunity.expectedMultiple}x</div>
              <div className="text-sm text-gray-600">Expected Multiple</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{(opportunity.navPercentage * 100).toFixed(0)}%</div>
              <div className="text-sm text-gray-600">NAV Percentage</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">${(opportunity.askPrice / 1000000).toFixed(1)}M</div>
              <div className="text-sm text-gray-600">Ask Price</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="valuation" className="space-y-6">
      <ComparativeValuationAnalysis 
        opportunityId={opportunity.id}
        opportunityData={opportunity}
        navigationMode="traditional"
      />
    </TabsContent>

    <TabsContent value="actions" className="space-y-6">
      {/* Actions */}
      <div className="flex space-x-4">
        <Button onClick={onStartScreening} className="flex-1">
          <FileText className="h-4 w-4 mr-2" />
          Start Screening Process
        </Button>
        <Button variant="outline" onClick={onViewWorkspace}>
          <Users className="h-4 w-4 mr-2" />
          View Workspace
        </Button>
      </div>
    </TabsContent>
  </Tabs>
);

const AssistedOpportunityView: React.FC<{
  opportunity: DealOpportunity;
  onStartScreening: () => void;
  onViewWorkspace: () => void;
  aiRecommendations: AIRecommendation[];
  onExecuteRecommendation: (id: string) => void;
}> = ({ opportunity, onStartScreening, onViewWorkspace, aiRecommendations, onExecuteRecommendation }) => (
  <div className="space-y-6">
    {/* AI Insights Panel */}
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-blue-800">
          <Brain className="h-5 w-5" />
          <span>AI Insights</span>
          {opportunity.aiConfidence && (
            <Badge variant="secondary" className="ml-auto">
              {Math.round(opportunity.aiConfidence * 100)}% Confidence
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {aiRecommendations.length > 0 ? (
          aiRecommendations.map((rec) => (
            <div key={rec.id} className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}>
                  {rec.priority}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
              {rec.actions && rec.actions.length > 0 && (
                <div className="flex space-x-2">
                  {rec.actions.map((action, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      onClick={() => onExecuteRecommendation(rec.id)}
                    >
                      {action.label}
                      {action.timeEstimate && (
                        <span className="ml-1 text-xs text-gray-500">
                          (~{action.timeEstimate}min)
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>AI is analyzing this opportunity...</p>
          </div>
        )}
      </CardContent>
    </Card>

    {/* Key Metrics with AI enhancement */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>Enhanced Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{opportunity.expectedIRR}%</div>
            <div className="text-sm text-gray-600">Expected IRR</div>
            {opportunity.similarDeals && (
              <div className="text-xs text-blue-600 mt-1">
                Similar deals: {opportunity.expectedIRR + 2.3}% avg
              </div>
            )}
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{opportunity.expectedMultiple}x</div>
            <div className="text-sm text-gray-600">Expected Multiple</div>
            <div className="text-xs text-blue-600 mt-1">
              Risk-adjusted: {(opportunity.expectedMultiple * 0.9).toFixed(1)}x
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{(opportunity.navPercentage * 100).toFixed(0)}%</div>
            <div className="text-sm text-gray-600">NAV Percentage</div>
            <div className="text-xs text-green-600 mt-1">
              Favorable pricing
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">${(opportunity.askPrice / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-gray-600">Ask Price</div>
            <div className="text-xs text-blue-600 mt-1">
              Market range: $40-60M
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Enhanced Actions */}
    <div className="flex space-x-4">
      <Button onClick={onStartScreening} className="flex-1">
        <Brain className="h-4 w-4 mr-2" />
        AI-Assisted Screening
      </Button>
      <Button variant="outline" onClick={onViewWorkspace}>
        <Users className="h-4 w-4 mr-2" />
        Collaborative Workspace
      </Button>
    </div>
  </div>
);

const AutonomousOpportunityView: React.FC<{
  opportunity: DealOpportunity;
  onApproveAction: (action: string) => void;
  onRejectAction: (action: string) => void;
  autonomousActions: Array<{id: string, description: string, impact: string}>;
}> = ({ opportunity, onApproveAction, onRejectAction, autonomousActions }) => (
  <div className="space-y-6">
    {/* AI Status */}
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-green-800">
          <Bot className="h-5 w-5" />
          <span>Autonomous Analysis Complete</span>
          <Badge variant="outline" className="ml-auto bg-green-100 text-green-800">
            Processing Complete
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium">Initial screening completed automatically</span>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-800">Score: 87/100</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium">Risk assessment completed</span>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-800">Low Risk</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium">Comparative analysis ready</span>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-800">Top 15%</Badge>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Pending Decisions */}
    {autonomousActions.length > 0 && (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-yellow-800">
            <AlertCircle className="h-5 w-5" />
            <span>Pending Your Decision</span>
            <Badge variant="outline" className="ml-auto bg-yellow-100 text-yellow-800">
              {autonomousActions.length} action{autonomousActions.length !== 1 ? 's' : ''}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {autonomousActions.map((action) => (
            <div key={action.id} className="bg-white p-4 rounded-lg border border-yellow-200">
              <p className="text-sm text-gray-900 mb-3">{action.description}</p>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  onClick={() => onApproveAction(action.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Approve
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onRejectAction(action.id)}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )}

    {/* Comprehensive Analysis Summary */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>AI Analysis Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3 text-green-700">Strengths Identified</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Strong historical performance in similar deals</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Favorable pricing compared to market</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>High confidence in sector outlook</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-yellow-700">Areas for Review</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span>Verify latest financial statements</span>
              </li>
              <li className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span>Confirm management team stability</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currentMode, setCurrentModule } = useNavigationStoreRefactored();
  const navigationMode = currentMode.mode;
  
  // Set current module for navigation store
  useEffect(() => {
    setCurrentModule('deal-screening');
  }, [setCurrentModule]);
  
  const opportunityId = params?.id as string;
  const [opportunity, setOpportunity] = useState<DealOpportunity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock AI recommendations
  const [aiRecommendations] = useState<AIRecommendation[]>([
    {
      id: 'rec-1',
      type: 'suggestion',
      priority: 'high',
      title: 'Similar Deal Pattern Detected',
      description: 'This deal is 87% similar to your successful CloudCo investment from 2022. Consider applying the same screening template.',
      confidence: 0.87,
      category: 'comparison',
      actions: [
        { label: 'Apply CloudCo Template', action: 'APPLY_TEMPLATE' },
        { label: 'View Comparison', action: 'VIEW_COMPARISON', timeEstimate: 5 }
      ]
    },
    {
      id: 'rec-2',
      type: 'automation',
      priority: 'medium',
      title: 'Auto-Generate Initial DD Checklist',
      description: 'I can create a comprehensive due diligence checklist based on this opportunity type and sector.',
      confidence: 0.92,
      category: 'workflow',
      actions: [
        { label: 'Generate Checklist', action: 'GENERATE_CHECKLIST', timeEstimate: 10 }
      ]
    }
  ]);

  // Mock autonomous actions
  const [autonomousActions] = useState([
    {
      id: 'auto-1',
      description: 'Proceed with full due diligence based on positive screening results?',
      impact: 'high'
    },
    {
      id: 'auto-2',
      description: 'Schedule initial management presentation for next week?',
      impact: 'medium'
    }
  ]);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call
        // const response = await fetch(`/api/deal-screening/opportunities/${opportunityId}`);
        // const data = await response.json();
        
        // Mock data that matches the dashboard opportunities
        const mockOpportunities: Record<string, DealOpportunity> = {
          '1': {
            id: '1',
            name: 'TechVenture Fund III',
            description: 'Institutional LP secondary sale of a technology-focused fund with strong track record.',
            seller: 'Institutional LP',
            assetType: 'fund',
            vintage: '2020',
            sector: 'Technology',
            geography: 'North America',
            askPrice: 45000000,
            navPercentage: 0.85,
            expectedReturn: 0.185,
            expectedRisk: 0.15,
            expectedMultiple: 2.3,
            expectedIRR: 18.5,
            expectedHoldingPeriod: 4,
            scores: [],
            status: 'screening',
            aiConfidence: 0.87,
            similarDeals: ['deal-2', 'deal-5'],
            aiRecommendations,
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T14:20:00Z',
            additionalData: {},
          },
          '2': {
            id: '2',
            name: 'Healthcare Direct Investment',
            description: 'Strategic partner direct investment in healthcare technology company.',
            seller: 'Strategic Partner',
            assetType: 'direct',
            vintage: '2021',
            sector: 'Healthcare',
            geography: 'Europe',
            askPrice: 28000000,
            navPercentage: 0.92,
            expectedReturn: 0.221,
            expectedRisk: 0.12,
            expectedMultiple: 2.8,
            expectedIRR: 22.1,
            expectedHoldingPeriod: 3,
            scores: [],
            status: 'screening',
            aiConfidence: 0.93,
            similarDeals: ['deal-1', 'deal-3'],
            aiRecommendations,
            createdAt: '2024-01-16T11:30:00Z',
            updatedAt: '2024-01-16T15:20:00Z',
            additionalData: {},
          },
          '3': {
            id: '3',
            name: 'Infrastructure Co-Investment',
            description: 'Fund manager co-investment opportunity in infrastructure assets.',
            seller: 'Fund Manager',
            assetType: 'co-investment',
            vintage: '2022',
            sector: 'Infrastructure',
            geography: 'Asia',
            askPrice: 67000000,
            navPercentage: 0.78,
            expectedReturn: 0.158,
            expectedRisk: 0.18,
            expectedMultiple: 2.1,
            expectedIRR: 15.8,
            expectedHoldingPeriod: 6,
            scores: [],
            status: 'screening',
            aiConfidence: 0.76,
            similarDeals: ['deal-4'],
            aiRecommendations,
            createdAt: '2024-01-17T09:15:00Z',
            updatedAt: '2024-01-17T16:45:00Z',
            additionalData: {},
          }
        };
        
        const mockOpportunity = mockOpportunities[opportunityId];
        
        if (!mockOpportunity) {
          setError('Opportunity not found');
          return;
        }
        
        setOpportunity(mockOpportunity);
      } catch (err) {
        setError('Failed to load opportunity details');
        console.error('Error fetching opportunity:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (opportunityId) {
      fetchOpportunity();
    }
  }, [opportunityId]);

  const handleBack = () => {
    router.push('/deal-screening');
  };

  const handleStartScreening = () => {
    router.push(`/deal-screening/opportunity/${opportunityId}/screen`);
  };

  const handleViewWorkspace = () => {
    if (opportunity?.workspaceId) {
      router.push(`/workspaces/${opportunity.workspaceId}`);
    } else {
      // Create new workspace
      router.push(`/workspaces?create=true&opportunityId=${opportunityId}`);
    }
  };

  const handleExecuteRecommendation = (recommendationId: string) => {
    console.log('Executing recommendation:', recommendationId);
    // Implementation would depend on the specific recommendation
  };

  const handleApproveAction = (actionId: string) => {
    console.log('Approving autonomous action:', actionId);
  };

  const handleRejectAction = (actionId: string) => {
    console.log('Rejecting autonomous action:', actionId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'screening': return 'bg-yellow-100 text-yellow-800';
      case 'analyzed': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'traditional': return <List className="h-4 w-4" />;
      case 'assisted': return <Brain className="h-4 w-4" />;
      case 'autonomous': return <Bot className="h-4 w-4" />;
      default: return <List className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || 'Opportunity not found'}
          </h2>
          <Button onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Deal Screening
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <a href="/dashboard" className="hover:text-gray-700">Dashboard</a>
              </li>
              <li>/</li>
              <li>
                <a href="/deal-screening" className="hover:text-gray-700">Deal Screening</a>
              </li>
              <li>/</li>
              <li className="font-medium text-gray-900">Opportunity Detail</li>
            </ol>
          </nav>

          {/* Title and Actions */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{opportunity.name}</h1>
                  <Badge className={`${getStatusColor(opportunity.status)} font-medium`}>
                    {opportunity.status.charAt(0).toUpperCase() + opportunity.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{opportunity.geography}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Vintage {opportunity.vintage}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>{opportunity.sector}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Mode Indicator */}
              <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full text-sm">
                {getModeIcon(navigationMode)}
                <span className="capitalize">{navigationMode} Mode</span>
              </div>
              
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Description */}
          {opportunity.description && (
            <p className="mt-4 text-gray-600 max-w-3xl">{opportunity.description}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {navigationMode === 'traditional' && (
          <TraditionalOpportunityView
            opportunity={opportunity}
            onStartScreening={handleStartScreening}
            onViewWorkspace={handleViewWorkspace}
          />
        )}

        {navigationMode === 'assisted' && (
          <AssistedOpportunityView
            opportunity={opportunity}
            onStartScreening={handleStartScreening}
            onViewWorkspace={handleViewWorkspace}
            aiRecommendations={aiRecommendations}
            onExecuteRecommendation={handleExecuteRecommendation}
          />
        )}

        {navigationMode === 'autonomous' && (
          <AutonomousOpportunityView
            opportunity={opportunity}
            onApproveAction={handleApproveAction}
            onRejectAction={handleRejectAction}
            autonomousActions={autonomousActions}
          />
        )}
      </div>
    </div>
  );
}