'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigationStoreRefactored } from '@/stores/navigation-store-refactored';
import { ComprehensiveRiskAssessment } from '@/components/deal-screening/ComprehensiveRiskAssessment';
import { DealOpportunity } from '@/types/deal-screening';
import {
  ArrowLeft,
  Shield,
  AlertTriangle,
  CheckCircle,
  Brain,
  FileText,
  Users
} from 'lucide-react';

export default function DealRiskAssessmentPage() {
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

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        setIsLoading(true);
        
        // Mock data that matches the dashboard opportunities
        const mockOpportunities: Record<string, any> = {
          '1': {
            id: '1',
            name: 'TechVenture Fund III',
            description: 'Institutional LP secondary sale of a technology-focused fund with strong track record.',
            source: 'broker',
            sourceDetails: 'Secondary market transaction',
            askPrice: 45000000,
            navPercentage: 0.85,
            expectedReturn: 0.185,
            expectedIRR: 18.5,
            expectedMultiple: 2.3,
            screeningStatus: 'in-progress',
            screeningScore: 82,
            aiScore: 87,
            aiConfidence: 0.92,
            aiInsights: [
              'Strong historical performance in technology sector',
              'Favorable pricing compared to market benchmarks'
            ],
            similarDeals: ['deal-2', 'deal-5'],
            lastContactDate: new Date('2024-01-10'),
            nextFollowUp: new Date('2024-01-24')
          },
          '2': {
            id: '2',
            name: 'Healthcare Direct Investment',
            description: 'Strategic partner direct investment in healthcare technology company.',
            source: 'proprietary',
            sourceDetails: 'Direct sourcing from industry contact',
            askPrice: 28000000,
            navPercentage: 0.92,
            expectedReturn: 0.221,
            expectedIRR: 22.1,
            expectedMultiple: 2.8,
            screeningStatus: 'in-progress',
            screeningScore: 94,
            aiScore: 93,
            aiConfidence: 0.95,
            aiInsights: [
              'High growth potential in healthcare technology',
              'Strong management team with proven track record'
            ],
            similarDeals: ['deal-1', 'deal-3'],
            lastContactDate: new Date('2024-01-12'),
            nextFollowUp: new Date('2024-01-26')
          },
          '3': {
            id: '3',
            name: 'Infrastructure Co-Investment',
            description: 'Fund manager co-investment opportunity in infrastructure assets.',
            source: 'referral',
            sourceDetails: 'Fund manager partnership',
            askPrice: 67000000,
            navPercentage: 0.78,
            expectedReturn: 0.158,
            expectedIRR: 15.8,
            expectedMultiple: 2.1,
            screeningStatus: 'in-progress',
            screeningScore: 71,
            aiScore: 76,
            aiConfidence: 0.85,
            aiInsights: [
              'Stable cash flow profile with long-term contracts',
              'Infrastructure assets provide inflation protection'
            ],
            similarDeals: ['deal-4'],
            lastContactDate: new Date('2024-01-08'),
            nextFollowUp: new Date('2024-01-22')
          }
        };
        
        const mockOpportunity = mockOpportunities[opportunityId];
        
        if (!mockOpportunity) {
          console.error('Opportunity not found');
          return;
        }
        
        setOpportunity(mockOpportunity);
      } catch (err) {
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
    router.push(`/deal-screening/opportunity/${opportunityId}`);
  };

  const handleSaveAssessment = (assessment: any) => {
    console.log('Risk assessment saved:', assessment);
    // In a real implementation, this would save to the database
    // and potentially trigger workflow actions
  };

  const handleGenerateAIInsights = async (opportunityId: string): Promise<string[]> => {
    // Mock AI insights generation
    return new Promise((resolve) => {
      setTimeout(() => {
        const insights = [
          "High market concentration risk in technology sector - recommend diversification strategy",
          "Strong management team with 15+ years average experience in venture capital",
          "Favorable NAV percentage at 85% indicates good pricing opportunity",
          "Expected IRR of 18.5% exceeds fund's target return threshold",
          "Consider co-investment structure to mitigate single-fund exposure"
        ];
        resolve(insights);
      }, 2000);
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Opportunity not found
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
              <li>
                <a href={`/deal-screening/opportunity/${opportunityId}`} className="hover:text-gray-700">
                  {opportunity.name}
                </a>
              </li>
              <li>/</li>
              <li className="font-medium text-gray-900">Comprehensive Risk Assessment</li>
            </ol>
          </nav>

          {/* Title and Actions */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{opportunity.name}</h1>
              <p className="text-gray-600 mt-1">Comprehensive Risk Assessment and Analysis</p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Mode Indicator */}
              <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full text-sm">
                {navigationMode === 'traditional' ? <FileText className="h-4 w-4" /> :
                 navigationMode === 'assisted' ? <Brain className="h-4 w-4" /> :
                 <Users className="h-4 w-4" />}
                <span className="capitalize">{navigationMode} Mode</span>
              </div>
              
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Opportunity
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
        {/* Mode-specific explanation */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">
                  {navigationMode === 'traditional' ? 'Manual Risk Assessment' :
                   navigationMode === 'assisted' ? 'AI-Assisted Risk Analysis' :
                   'Autonomous Risk Evaluation'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {navigationMode === 'traditional' ? 
                   'Complete manual control over risk factor evaluation and scoring. All assessments require your direct input and approval.' :
                   navigationMode === 'assisted' ? 
                   'AI provides intelligent risk insights and scoring suggestions while you maintain control over final decisions.' :
                   'AI autonomously evaluates risks with high confidence, requiring approval only for exceptional cases.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comprehensive Risk Assessment Component */}
        <ComprehensiveRiskAssessment
          opportunities={[opportunity]}
          onSaveAssessment={handleSaveAssessment}
          onGenerateAIInsights={handleGenerateAIInsights}
        />

        {/* Additional Risk Context */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                Key Risk Indicators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Source:</span>
                  <Badge variant="outline" className="capitalize">
                    {opportunity.source}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">NAV Percentage:</span>
                  <Badge variant={opportunity.navPercentage > 0.9 ? 'default' : 'secondary'}>
                    {(opportunity.navPercentage * 100).toFixed(0)}%
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expected IRR:</span>
                  <Badge variant={opportunity.expectedIRR > 20 ? 'default' : 'secondary'}>
                    {opportunity.expectedIRR}%
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Screening Score:</span>
                  <Badge variant={opportunity.screeningScore && opportunity.screeningScore >= 80 ? 'default' : 
                                 opportunity.screeningScore && opportunity.screeningScore >= 60 ? 'secondary' : 'destructive'}>
                    {opportunity.screeningScore || 'N/A'}/100
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                Risk Mitigation Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Consider staged investment to mitigate timing risk
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Implement sector diversification within portfolio
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Enhanced due diligence on management team stability
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Regular market condition monitoring and adjustment
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
