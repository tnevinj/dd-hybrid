'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  PieChart,
  BarChart3,
  Banknote,
  Target,
  Bot,
  Sparkles
} from 'lucide-react';
import { useViewContext } from '@/hooks/use-view-context';
import { LPTraditionalDashboard } from './LPTraditionalDashboard';
import { LPAssistedDashboard } from './LPAssistedDashboard';
import { LPAutonomousDashboard } from './LPAutonomousDashboard';
import { HybridModeHeader } from '@/components/shared/HybridModeHeader';
import { ThandoAssistant } from '@/components/assistant/ThandoAssistant';
import { formatCurrency, formatPercentage, formatDate } from '@/lib/utils';
import type { 
  LPDashboardData,
  LPSummary,
  LPAlert,
  LPEntity,
  LPCommitment,
  LPCapitalCall,
  LPDistribution
} from '@/types/lp-portal';

interface HybridLPDashboardProps {
  className?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    navigationMode?: string;
  };
}

export function HybridLPDashboard({ className, user }: HybridLPDashboardProps) {
  const { currentMode, setMode } = useViewContext();
  const [dashboardData, setDashboardData] = useState<LPDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demonstration - in real app this would come from API
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData: LPDashboardData = {
          entity: {
            id: 'lp_1',
            name: 'University Endowment Fund',
            entityType: 'ENDOWMENT',
            jurisdiction: 'United States',
            aum: 2500000000, // $2.5B AUM
            primaryContactName: 'Sarah Mitchell',
            primaryContactEmail: 'sarah.mitchell@university.edu',
            onboardingStatus: 'APPROVED',
            verificationStatus: 'VERIFIED',
            kycStatus: 'APPROVED',
            accreditationStatus: 'ACCREDITED',
            createdAt: new Date('2020-01-15'),
            updatedAt: new Date(),
            commitments: [],
            capitalCalls: [],
            distributions: [],
            communications: [],
            documents: [],
            coInvestments: [],
            elections: []
          },
          
          commitments: [
            {
              id: 'commitment_1',
              lpEntityId: 'lp_1',
              fundName: 'Growth Equity Fund III',
              commitmentAmount: 50000000,
              currency: 'USD',
              commitmentDate: new Date('2022-03-15'),
              vintage: 2022,
              managementFee: 2.0,
              carriedInterest: 20.0,
              hurdle: 8.0,
              status: 'ACTIVE',
              calledAmount: 32000000,
              distributedAmount: 8500000,
              currentNAV: 41200000,
              irr: 18.5,
              moic: 1.55,
              dpi: 0.27,
              rvpi: 1.29,
              tvpi: 1.55,
              createdAt: new Date('2022-03-15'),
              updatedAt: new Date()
            },
            {
              id: 'commitment_2',
              lpEntityId: 'lp_1',
              fundName: 'Technology Fund IV',
              commitmentAmount: 75000000,
              currency: 'USD',
              commitmentDate: new Date('2023-06-20'),
              vintage: 2023,
              managementFee: 2.5,
              carriedInterest: 20.0,
              hurdle: 8.0,
              status: 'ACTIVE',
              calledAmount: 28000000,
              distributedAmount: 2100000,
              currentNAV: 29800000,
              irr: 12.3,
              moic: 1.14,
              dpi: 0.08,
              rvpi: 1.06,
              tvpi: 1.14,
              createdAt: new Date('2023-06-20'),
              updatedAt: new Date()
            }
          ],
          
          activeCapitalCalls: [
            {
              id: 'call_1',
              lpEntityId: 'lp_1',
              commitmentId: 'commitment_1',
              callNumber: 7,
              callAmount: 8500000,
              currency: 'USD',
              dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15), // 15 days from now
              purpose: 'Follow-on investment in portfolio companies',
              status: 'PENDING',
              autoAcknowledgment: false,
              createdAt: new Date(),
              updatedAt: new Date(),
              issuedAt: new Date()
            }
          ],
          
          recentDistributions: [
            {
              id: 'dist_1',
              lpEntityId: 'lp_1',
              commitmentId: 'commitment_1',
              distributionNumber: 3,
              distributionAmount: 4200000,
              currency: 'USD',
              distributionDate: new Date('2024-01-15'),
              distributionType: 'CAPITAL_RETURN',
              sourceDescription: 'Exit from TechCorp acquisition',
              status: 'RECEIVED',
              paymentDate: new Date('2024-01-18'),
              createdAt: new Date('2024-01-15'),
              updatedAt: new Date()
            }
          ],
          
          coInvestmentOpportunities: [
            {
              id: 'coinvest_1',
              lpEntityId: 'lp_1',
              opportunityName: 'Healthcare AI Series C',
              targetCompany: 'MedAI Solutions',
              description: 'Leading AI platform for medical diagnostics',
              sector: 'Healthcare Technology',
              geography: 'North America',
              minimumInvestment: 1000000,
              maximumInvestment: 10000000,
              currency: 'USD',
              offerDate: new Date('2024-01-10'),
              responseDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
              status: 'OFFERED',
              createdAt: new Date('2024-01-10'),
              updatedAt: new Date()
            }
          ],
          
          unreadDocuments: [
            {
              id: 'doc_1',
              lpEntityId: 'lp_1',
              name: 'Q4 2024 Performance Report',
              category: 'PERFORMANCE_REPORT',
              accessLevel: 'PRIVATE',
              downloadAllowed: true,
              viewOnly: false,
              status: 'AVAILABLE',
              readStatus: 'UNREAD',
              aiSummary: 'Strong performance with 18.5% IRR. Key highlights: successful exit from TechCorp, strong performance from growth equity positions.',
              publishedAt: new Date('2024-01-20'),
              createdAt: new Date('2024-01-20'),
              updatedAt: new Date('2024-01-20')
            }
          ],
          
          activeElections: [
            {
              id: 'election_1',
              lpEntityId: 'lp_1',
              title: 'Advisory Committee Member Selection',
              description: 'Vote for the LP representative on the fund advisory committee',
              electionType: 'ADVISORY_COMMITTEE',
              options: [
                { id: 'opt1', title: 'Candidate A', description: 'Experienced private equity professional' },
                { id: 'opt2', title: 'Candidate B', description: 'Technology industry expert' }
              ],
              allowMultipleSelect: false,
              startDate: new Date('2024-01-15'),
              endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), // 10 days from now
              announcementDate: new Date('2024-01-15'),
              status: 'ACTIVE',
              createdAt: new Date('2024-01-15'),
              updatedAt: new Date()
            }
          ],
          
          summary: {
            totalCommitments: 125000000,
            totalCalled: 60000000,
            totalDistributed: 10600000,
            currentNAV: 71000000,
            weightedAverageIRR: 15.8,
            averageMOIC: 1.35,
            activeCapitalCallsCount: 1,
            pendingResponsesCount: 2,
            unreadDocumentsCount: 3
          },
          
          alerts: [
            {
              id: 'alert_1',
              type: 'CAPITAL_CALL',
              title: 'Capital Call Due Soon',
              message: 'Growth Equity Fund III call #7 is due in 15 days',
              severity: 'WARNING',
              actionRequired: true,
              deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
              createdAt: new Date()
            },
            {
              id: 'alert_2',
              type: 'ELECTION',
              title: 'Advisory Committee Vote',
              message: 'Vote for LP representative on advisory committee',
              severity: 'INFO',
              actionRequired: true,
              deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
              createdAt: new Date()
            }
          ]
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
        title: 'LP Portal',
        description: 'Manage your fund commitments, capital calls, and investments',
        icon: PieChart,
        color: 'blue'
      },
      assisted: {
        title: 'LP Portal with AI Assistance',
        description: 'Smart insights and automated responses for better portfolio management',
        icon: Bot,
        color: 'purple'
      },
      autonomous: {
        title: 'Autonomous LP Experience',
        description: 'AI-powered investment management with intelligent decision support',
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
          <p className="text-gray-600">Loading LP Portal...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error || 'Failed to load data'}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  const getTrendIcon = (value: number, threshold: number = 0) => {
    if (value > threshold) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (value < threshold) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return <div className="h-4 w-4" />; // Placeholder
  };

  const getAlertColor = (severity: string) => {
    const colors = {
      'INFO': 'bg-blue-100 text-blue-800 border-blue-200',
      'WARNING': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'ERROR': 'bg-red-100 text-red-800 border-red-200',
      'CRITICAL': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[severity as keyof typeof colors] || colors.INFO;
  };

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

      {/* Key Performance Indicators - Always visible */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <DollarSign className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(dashboardData.summary.totalCommitments)}
              </p>
              <p className="text-sm text-gray-600">Total Commitments</p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-green-600">
                  {formatPercentage((dashboardData.summary.totalCalled / dashboardData.summary.totalCommitments) * 100)}
                </span>
                <span className="text-xs text-gray-500 ml-1">called</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(dashboardData.summary.weightedAverageIRR)}
              </p>
              <p className="text-sm text-gray-600">Weighted Avg IRR</p>
              <div className="flex items-center mt-1">
                {getTrendIcon(dashboardData.summary.weightedAverageIRR, 15)}
                <span className="text-xs text-gray-500 ml-1">vs 15% target</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Target className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.summary.averageMOIC.toFixed(2)}x
              </p>
              <p className="text-sm text-gray-600">Average MOIC</p>
              <div className="flex items-center mt-1">
                {getTrendIcon(dashboardData.summary.averageMOIC, 1)}
                <span className="text-xs text-gray-500 ml-1">multiple</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <AlertTriangle className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.summary.pendingResponsesCount}
              </p>
              <p className="text-sm text-gray-600">Pending Actions</p>
              <div className="flex items-center mt-1">
                <Clock className="h-3 w-3 text-orange-600 mr-1" />
                <span className="text-xs text-orange-600">Requires attention</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts - High visibility for important items */}
      {dashboardData.alerts.length > 0 && (
        <div className="space-y-2">
          {dashboardData.alerts.map((alert) => (
            <Card key={alert.id} className={`border-l-4 ${getAlertColor(alert.severity)}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">{alert.title}</h4>
                    <p className="text-sm mt-1">{alert.message}</p>
                    {alert.deadline && (
                      <div className="flex items-center mt-2 text-xs text-gray-600">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Due: {formatDate(alert.deadline)}</span>
                      </div>
                    )}
                  </div>
                  {alert.actionRequired && (
                    <Button size="sm" className="ml-4">
                      Take Action
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Mode-Specific Content */}
      {currentMode === 'traditional' && (
        <LPTraditionalDashboard 
          data={dashboardData}
          onRespond={(type, id) => {
            console.log(`Respond to ${type} with ID ${id}`);
          }}
          onViewDetails={(type, id) => {
            console.log(`View ${type} details for ${id}`);
          }}
        />
      )}

      {currentMode === 'assisted' && (
        <LPAssistedDashboard 
          data={dashboardData}
          onRespond={(type, id) => {
            console.log(`Respond to ${type} with ID ${id}`);
          }}
          onViewDetails={(type, id) => {
            console.log(`View ${type} details for ${id}`);
          }}
          onAcceptRecommendation={(recommendation) => {
            console.log('Accepting recommendation:', recommendation);
          }}
        />
      )}

      {currentMode === 'autonomous' && (
        <LPAutonomousDashboard 
          data={dashboardData}
          onExecuteAction={(action) => {
            console.log('Executing action:', action);
          }}
          onMakeDecision={(decision) => {
            console.log('Making decision:', decision);
          }}
        />
      )}

      {/* Thando Assistant - Available in all modes */}
      <ThandoAssistant
        context={{
          module: 'lp-portal',
          data: {
            totalCommitments: dashboardData.summary.totalCommitments,
            pendingActions: dashboardData.summary.pendingResponsesCount,
            irr: dashboardData.summary.weightedAverageIRR,
            mode: currentMode
          }
        }}
        suggestions={currentMode !== 'traditional' ? [
          'Review pending capital call',
          'Analyze portfolio performance',
          'Respond to co-investment opportunity',
          'Download quarterly reports'
        ] : undefined}
      />
    </div>
  );
}

export default HybridLPDashboard;