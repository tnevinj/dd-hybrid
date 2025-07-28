'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  BarChart3,
  Target,
  Brain,
  Zap,
  MessageSquare,
  Download,
  Share,
  Edit
} from 'lucide-react';
import { DealStructuringProject } from '@/types/deal-structuring';
import { useViewContext } from '@/hooks/use-view-context';
import ScalableFinancialWorkspace from './financial/ScalableFinancialWorkspace';

interface DealStructuringDetailProps {
  dealId: string;
}

const DealStructuringDetail: React.FC<DealStructuringDetailProps> = ({ dealId }) => {
  const router = useRouter();
  const { viewMode } = useViewContext();
  const [deal, setDeal] = useState<DealStructuringProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        setLoading(true);
        // Mock data for now - replace with actual API call
        const mockDeal: DealStructuringProject = {
          id: dealId,
          name: dealId === '1' ? 'TechCorp Secondary' : dealId === '2' ? 'GreenEnergy Fund II' : 'HealthTech Acquisition',
          type: dealId === '1' ? 'SINGLE_ASSET_CONTINUATION' : dealId === '2' ? 'MULTI_ASSET_CONTINUATION' : 'LBO_STRUCTURE',
          stage: dealId === '1' ? 'STRUCTURING' : dealId === '2' ? 'DUE_DILIGENCE' : 'INVESTMENT_COMMITTEE',
          targetValue: dealId === '1' ? 150000000 : dealId === '2' ? 200000000 : 100000000,
          currentValuation: dealId === '1' ? 145000000 : undefined,
          progress: dealId === '1' ? 75 : dealId === '2' ? 45 : 90,
          team: [
            { id: '1', name: 'Sarah Chen', role: 'Lead Analyst', email: 'sarah.chen@firm.com' },
            { id: '2', name: 'Michael Park', role: 'Vice President', email: 'michael.park@firm.com' },
            { id: '3', name: 'Emma Rodriguez', role: 'Director', email: 'emma.rodriguez@firm.com' }
          ],
          lastUpdated: new Date(),
          keyMetrics: {
            irr: dealId === '1' ? 18.5 : dealId === '2' ? 22.1 : 25.3,
            multiple: dealId === '1' ? 2.3 : dealId === '2' ? 2.8 : 3.1,
            paybackPeriod: dealId === '1' ? 4.2 : dealId === '2' ? 3.8 : 3.2,
            leverage: dealId === '1' ? 3.5 : dealId === '2' ? 2.9 : 4.2,
            equityContribution: dealId === '1' ? 45000000 : dealId === '2' ? 70000000 : 25000000
          },
          riskLevel: dealId === '1' ? 'medium' : dealId === '2' ? 'low' : 'high',
          nextMilestone: dealId === '1' ? 'Financial Model Review' : dealId === '2' ? 'Management Presentation' : 'IC Vote',
          aiRecommendations: viewMode !== 'traditional' ? [
            {
              id: 'rec-1',
              type: 'suggestion',
              priority: 'high',
              title: 'Model Update Recommended',
              description: 'Latest market data suggests updating discount rate assumptions by 50bps.',
              actions: [
                { label: 'Update Model', action: 'UPDATE_DCF_MODEL' },
                { label: 'Review Data', action: 'REVIEW_MARKET_DATA' }
              ],
              confidence: 0.92
            }
          ] : undefined
        };

        setDeal(mockDeal);
      } catch (err) {
        setError('Failed to load deal details');
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, [dealId, viewMode]);

  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary'; 
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error || 'Deal not found'}</p>
          <Button variant="outline" onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{deal.name}</h1>
              <Badge variant={getRiskBadgeVariant(deal.riskLevel)}>
                {deal.riskLevel} risk
              </Badge>
              <Badge variant="outline">
                {deal.stage.replace(/_/g, ' ')}
              </Badge>
            </div>
            <p className="text-gray-600">
              {deal.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} • {formatCurrency(deal.targetValue)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Deal
          </Button>
        </div>
      </div>

      {/* AI Insights for Assisted/Autonomous modes */}
      {viewMode !== 'traditional' && deal.aiRecommendations && (
        <Card className="border-l-4 border-l-blue-500 bg-blue-50/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-blue-900">AI Insights for {deal.name}</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {deal.aiRecommendations.map((rec) => (
              <div key={rec.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                  <div className="flex gap-2">
                    {rec.actions.map((action, idx) => (
                      <Button key={idx} size="sm" variant="outline">
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {Math.round(rec.confidence * 100)}% confident
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="text-xl font-semibold">Deal Progress</h2>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{deal.progress}%</span>
              </div>
              <Progress value={deal.progress} className="h-3" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{deal.stage.replace(/_/g, ' ')}</div>
                <div className="text-sm text-gray-600">Current Stage</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{deal.nextMilestone}</div>
                <div className="text-sm text-gray-600">Next Milestone</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{deal.team.length}</div>
                <div className="text-sm text-gray-600">Team Members</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Key Metrics</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">IRR</span>
              <span className="font-semibold">{formatPercentage(deal.keyMetrics.irr || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Multiple</span>
              <span className="font-semibold">{deal.keyMetrics.multiple?.toFixed(1)}x</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Payback Period</span>
              <span className="font-semibold">{deal.keyMetrics.paybackPeriod?.toFixed(1)} years</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Leverage</span>
              <span className="font-semibold">{deal.keyMetrics.leverage?.toFixed(1)}x</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Equity Contribution</span>
              <span className="font-semibold">{formatCurrency(deal.keyMetrics.equityContribution || 0)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: FileText },
            { id: 'financials', label: 'Financial Models', icon: BarChart3 },
            { id: 'team', label: 'Team', icon: Users },
            { id: 'timeline', label: 'Timeline', icon: Calendar },
            { id: 'documents', label: 'Documents', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {activeTab === 'overview' && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Deal Overview</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Investment Thesis</h4>
                  <p className="text-gray-600">
                    {deal.name} represents a compelling secondary opportunity in the {deal.type.toLowerCase().replace(/_/g, ' ')} space. 
                    The investment offers attractive risk-adjusted returns with strong downside protection.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Key Highlights</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Strong management team with proven track record</li>
                    <li>• Attractive entry valuation at current market conditions</li>
                    <li>• Clear path to value creation through operational improvements</li>
                    <li>• Diversified revenue streams reducing concentration risk</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'financials' && (
            <div className="space-y-4">
              <ScalableFinancialWorkspace 
                dealId={dealId} 
                dealName={deal.name}
              />
            </div>
          )}

          {activeTab === 'team' && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Deal Team</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deal.team.map((member) => (
                    <div key={member.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{member.name}</h4>
                        <p className="text-sm text-gray-600">{member.role}</p>
                        {member.email && (
                          <p className="text-xs text-gray-500">{member.email}</p>
                        )}
                      </div>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Message
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Quick Actions</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Generate IC Memo
              </Button>
              <Button className="w-full" size="sm" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Review
              </Button>
              <Button className="w-full" size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Models
              </Button>
              {viewMode !== 'traditional' && (
                <Button className="w-full" size="sm" variant="outline">
                  <Zap className="h-4 w-4 mr-2" />
                  Run AI Analysis
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Recent Activity</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Model updated</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-yellow-500 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Review scheduled</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-blue-500 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Documents uploaded</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DealStructuringDetail;