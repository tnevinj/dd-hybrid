'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2,
  TrendingUp,
  DollarSign,
  Clock,
  FileText,
  MessageSquare,
  Plus,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  Database,
  GitBranch,
  Bot,
  Zap,
  Target,
  Sparkles
} from 'lucide-react';
import { useViewContext } from '@/hooks/use-view-context';
import { GPTraditionalDashboard } from './GPTraditionalDashboard';
import { GPAssistedDashboard } from './GPAssistedDashboard';
import { GPAutonomousDashboard } from './GPAutonomousDashboard';
import { HybridModeHeader } from '@/components/shared/HybridModeHeader';
import { ThandoAssistant } from '@/components/assistant/ThandoAssistant';
import type { 
  GPCompany, 
  GPDealSubmission, 
  GPMetrics, 
  GPOnboardingProgress,
  AISuggestion,
  PriorityAction 
} from '@/types/gp-portal';

interface HybridGPDashboardProps {
  className?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    navigationMode?: string;
  };
}

interface DashboardData {
  companies: GPCompany[];
  activeDeals: GPDealSubmission[];
  metrics: GPMetrics;
  onboardingProgress: GPOnboardingProgress[];
  recentActivity: any[];
}

export function HybridGPDashboard({ className, user }: HybridGPDashboardProps) {
  const { currentMode, setMode } = useViewContext();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demonstration - in real app this would come from API
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData: DashboardData = {
          companies: [
            {
              id: '1',
              name: 'TechStartup Alpha',
              description: 'AI-powered fintech solutions',
              sector: 'Technology',
              subsector: 'Fintech',
              primaryContactName: 'John Smith',
              primaryContactEmail: 'john@techstartup.com',
              onboardingStatus: 'UNDER_REVIEW',
              verificationStatus: 'PENDING',
              createdAt: new Date('2024-01-15'),
              lastUpdated: new Date(),
              deals: [],
              documents: [],
              communications: []
            },
            {
              id: '2',
              name: 'HealthTech Innovators',
              description: 'Digital health platform',
              sector: 'Healthcare',
              subsector: 'Digital Health',
              primaryContactName: 'Sarah Johnson',
              primaryContactEmail: 'sarah@healthtech.com',
              onboardingStatus: 'APPROVED',
              verificationStatus: 'VERIFIED',
              createdAt: new Date('2024-02-01'),
              lastUpdated: new Date(),
              deals: [],
              documents: [],
              communications: []
            }
          ],
          activeDeals: [
            {
              id: 'deal1',
              companyId: '1',
              dealName: 'Series B Funding Round',
              targetCompanyName: 'TechStartup Alpha',
              dealType: 'INVESTMENT',
              proposedInvestment: 10000000,
              targetValuation: 50000000,
              status: 'UNDER_REVIEW',
              submissionStage: 'DETAILED',
              priority: 'HIGH',
              sourceDate: new Date('2024-01-20'),
              createdAt: new Date('2024-01-20'),
              updatedAt: new Date()
            }
          ],
          metrics: {
            totalSubmissions: 15,
            activeSubmissions: 8,
            approvedDeals: 3,
            averageProcessingTime: 14, // days
            successRate: 0.67
          },
          onboardingProgress: [
            {
              currentStep: 'TRACK_RECORD',
              completedSteps: ['COMPANY_INFO', 'INVESTMENT_FOCUS'],
              totalSteps: 6,
              progressPercentage: 33,
              estimatedTimeRemaining: 5,
              blockers: []
            }
          ],
          recentActivity: []
        };
        
        setDashboardData(mockData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const modeConfig = useMemo(() => {
    const configs = {
      traditional: {
        title: 'GP Portal',
        description: 'Manage your deal submissions and company onboarding',
        icon: Building2,
        color: 'blue'
      },
      assisted: {
        title: 'GP Portal with AI Assistance',
        description: 'Streamlined workflows with intelligent recommendations',
        icon: Bot,
        color: 'purple'
      },
      autonomous: {
        title: 'Autonomous GP Experience',
        description: 'AI-powered deal management and automated workflows',
        icon: Sparkles,
        color: 'green'
      }
    };
    return configs[currentMode as keyof typeof configs] || configs.traditional;
  }, [currentMode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Loading GP Portal...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error || 'Failed to load data'}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Hybrid Mode Header */}
      <HybridModeHeader
        title={modeConfig.title}
        description={modeConfig.description}
        icon={modeConfig.icon}
        currentMode={currentMode}
        onModeChange={setMode}
      />

      {/* Quick Stats - Always visible */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Building2 className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.companies.length}</p>
              <p className="text-sm text-gray-600">Companies</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <FileText className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.metrics.activeSubmissions}</p>
              <p className="text-sm text-gray-600">Active Deals</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <CheckCircle className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.metrics.approvedDeals}</p>
              <p className="text-sm text-gray-600">Approved</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.metrics.averageProcessingTime}d</p>
              <p className="text-sm text-gray-600">Avg Processing</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mode-Specific Content */}
      {currentMode === 'traditional' && (
        <GPTraditionalDashboard 
          data={dashboardData}
          onViewDetails={(type, id) => {
            console.log(`View ${type} details for ${id}`);
          }}
        />
      )}

      {currentMode === 'assisted' && (
        <GPAssistedDashboard 
          data={dashboardData}
          onViewDetails={(type, id) => {
            console.log(`View ${type} details for ${id}`);
          }}
          onAcceptSuggestion={(suggestion) => {
            console.log('Accepting suggestion:', suggestion);
          }}
        />
      )}

      {currentMode === 'autonomous' && (
        <GPAutonomousDashboard 
          data={dashboardData}
          onExecuteAction={(action) => {
            console.log('Executing action:', action);
          }}
          onRequireDecision={(decision) => {
            console.log('Decision required:', decision);
          }}
        />
      )}

      {/* Thando Assistant - Available in all modes */}
      <ThandoAssistant
        context={{
          module: 'gp-portal',
          data: {
            companies: dashboardData.companies.length,
            activeDeals: dashboardData.metrics.activeSubmissions,
            mode: currentMode
          }
        }}
        suggestions={currentMode !== 'traditional' ? [
          'Review pending deal submissions',
          'Update company onboarding status',
          'Generate progress report',
          'Schedule follow-up meetings'
        ] : undefined}
      />
    </div>
  );
}

export default HybridGPDashboard;