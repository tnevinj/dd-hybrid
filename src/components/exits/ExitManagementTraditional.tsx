'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Users, 
  FileText, 
  BarChart3, 
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  ArrowRight
} from 'lucide-react';
import type { HybridMode } from '@/components/shared';
import { ExitProcessWorkflow } from './ExitProcessWorkflow';
import { ExitAnalyticsDashboard } from './ExitAnalyticsDashboard';

interface ExitManagementTraditionalProps {
  onSwitchMode?: (mode: HybridMode) => void;
}

interface ExitOpportunity {
  id: string;
  companyName: string;
  sector: string;
  currentValuation: number;
  targetExitValue: number;
  exitStrategy: string;
  targetDate: string;
  preparationStage: 'planning' | 'preparation' | 'execution';
  progress: number;
  lastUpdate: string;
  keyMetrics: {
    irr: number;
    moic: number;
    holdingPeriod: number;
  };
  status: 'active' | 'on-hold' | 'completed';
}

export function ExitManagementTraditional({ onSwitchMode }: ExitManagementTraditionalProps) {
  const [exitOpportunities, setExitOpportunities] = useState<ExitOpportunity[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<ExitOpportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('pipeline');

  useEffect(() => {
    // Load exit opportunities data
    const loadExitData = async () => {
      try {
        // Mock data for now - will be replaced with API call
        const mockData: ExitOpportunity[] = [
          {
            id: '1',
            companyName: 'TechCorp Solutions',
            sector: 'Technology',
            currentValuation: 85000000,
            targetExitValue: 120000000,
            exitStrategy: 'Strategic Sale',
            targetDate: '2024-Q3',
            preparationStage: 'preparation',
            progress: 65,
            lastUpdate: '2024-01-15',
            keyMetrics: {
              irr: 22.5,
              moic: 2.8,
              holdingPeriod: 4.2
            },
            status: 'active'
          },
          {
            id: '2',
            companyName: 'GreenEnergy Dynamics',
            sector: 'Energy',
            currentValuation: 150000000,
            targetExitValue: 200000000,
            exitStrategy: 'IPO',
            targetDate: '2025-Q1',
            preparationStage: 'planning',
            progress: 35,
            lastUpdate: '2024-01-12',
            keyMetrics: {
              irr: 18.7,
              moic: 3.2,
              holdingPeriod: 5.1
            },
            status: 'active'
          },
          {
            id: '3',
            companyName: 'HealthTech Innovations',
            sector: 'Healthcare',
            currentValuation: 45000000,
            targetExitValue: 75000000,
            exitStrategy: 'Management Buyout',
            targetDate: '2024-Q4',
            preparationStage: 'execution',
            progress: 85,
            lastUpdate: '2024-01-18',
            keyMetrics: {
              irr: 25.3,
              moic: 2.1,
              holdingPeriod: 3.8
            },
            status: 'active'
          }
        ];
        
        setExitOpportunities(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load exit data:', error);
        setLoading(false);
      }
    };

    loadExitData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'preparation': return 'bg-yellow-100 text-yellow-800';
      case 'execution': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (stage: string) => {
    switch (stage) {
      case 'planning': return <Clock className="h-4 w-4" />;
      case 'preparation': return <AlertCircle className="h-4 w-4" />;
      case 'execution': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  // Calculate summary metrics
  const totalPipelineValue = exitOpportunities.reduce((sum, opp) => sum + opp.targetExitValue, 0);
  const avgIRR = exitOpportunities.reduce((sum, opp) => sum + opp.keyMetrics.irr, 0) / exitOpportunities.length || 0;
  const avgMOIC = exitOpportunities.reduce((sum, opp) => sum + opp.keyMetrics.moic, 0) / exitOpportunities.length || 0;
  const activeOpportunities = exitOpportunities.filter(opp => opp.status === 'active').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exit management data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPipelineValue)}</div>
            <p className="text-xs text-muted-foreground">
              Across {activeOpportunities} active opportunities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average IRR</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgIRR.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Projected across portfolio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average MOIC</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgMOIC.toFixed(1)}x</div>
            <p className="text-xs text-muted-foreground">
              Multiple on invested capital
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Exits</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOpportunities}</div>
            <p className="text-xs text-muted-foreground">
              In various stages of preparation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pipeline">Exit Pipeline</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="processes">Processes</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Exit Pipeline</h3>
              <p className="text-sm text-gray-600">Manage and track all exit opportunities</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Exit Opportunity
            </Button>
          </div>

          <div className="space-y-4">
            {exitOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div>
                        <CardTitle className="text-lg">{opportunity.companyName}</CardTitle>
                        <CardDescription className="flex items-center space-x-2">
                          <span>{opportunity.sector}</span>
                          <span>•</span>
                          <span>{opportunity.exitStrategy}</span>
                          <span>•</span>
                          <span>Target: {opportunity.targetDate}</span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStageColor(opportunity.preparationStage)}>
                        {getStatusIcon(opportunity.preparationStage)}
                        <span className="ml-1 capitalize">{opportunity.preparationStage}</span>
                      </Badge>
                      <Button variant="outline" size="sm">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">Current Valuation</p>
                      <p className="text-lg font-semibold">{formatCurrency(opportunity.currentValuation)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">Target Exit Value</p>
                      <p className="text-lg font-semibold">{formatCurrency(opportunity.targetExitValue)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">Expected Return</p>
                      <div className="flex space-x-4">
                        <span className="text-sm font-medium">{opportunity.keyMetrics.irr}% IRR</span>
                        <span className="text-sm font-medium">{opportunity.keyMetrics.moic}x MOIC</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Exit Preparation Progress</span>
                      <span>{opportunity.progress}%</span>
                    </div>
                    <Progress value={opportunity.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <ExitAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="processes" className="space-y-6">
          {selectedOpportunity ? (
            <ExitProcessWorkflow 
              exitOpportunityId={selectedOpportunity.id} 
              mode="traditional" 
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Exit Process Workflows
                </CardTitle>
                <CardDescription>
                  Select an exit opportunity to view and manage process workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Select an exit opportunity above to view process workflows</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Exit Documentation
              </CardTitle>
              <CardDescription>
                Manage exit-related documents and templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Document management coming soon</p>
                <p className="text-sm text-gray-500">
                  This will include exit memorandums, valuation reports, legal documents, and compliance materials
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}