'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2,
  FileText,
  MessageSquare,
  Plus,
  Eye,
  Edit,
  Download,
  Upload,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreHorizontal
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { 
  GPCompany, 
  GPDealSubmission, 
  GPDocument,
  GPCommunication,
  GPMetrics,
  GPOnboardingProgress 
} from '@/types/gp-portal';

interface GPTraditionalDashboardProps {
  data: {
    companies: GPCompany[];
    activeDeals: GPDealSubmission[];
    metrics: GPMetrics;
    onboardingProgress: GPOnboardingProgress[];
    recentActivity: any[];
  };
  onViewDetails: (type: string, id: string) => void;
}

export function GPTraditionalDashboard({ data, onViewDetails }: GPTraditionalDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      'DRAFT': 'bg-gray-100 text-gray-800',
      'SUBMITTED': 'bg-blue-100 text-blue-800',
      'UNDER_REVIEW': 'bg-yellow-100 text-yellow-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'PENDING': 'bg-orange-100 text-orange-800',
      'VERIFIED': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
      'LOW': 'text-green-600',
      'MEDIUM': 'text-yellow-600',
      'HIGH': 'text-orange-600',
      'CRITICAL': 'text-red-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="deals">Deal Submissions</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>Your submission and approval metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <div className="flex items-center space-x-2">
                    <Progress value={data.metrics.successRate * 100} className="flex-1" />
                    <span className="text-sm font-medium">{Math.round(data.metrics.successRate * 100)}%</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{data.metrics.approvedDeals}</p>
                  <p className="text-sm text-gray-600">Approved Deals</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{data.metrics.averageProcessingTime}</p>
                  <p className="text-sm text-gray-600">Avg Days to Review</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Submissions Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Deal Submissions</span>
                  <Button size="sm" onClick={() => onViewDetails('deals', 'all')}>
                    <Plus className="h-4 w-4 mr-1" />
                    New Submission
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.activeDeals.slice(0, 3).map((deal) => (
                    <div key={deal.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{deal.dealName}</p>
                        <p className="text-sm text-gray-600">{deal.targetCompanyName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(deal.status)}>
                            {deal.status.replace('_', ' ')}
                          </Badge>
                          <span className={`text-xs ${getPriorityColor(deal.priority)}`}>
                            {deal.priority}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {deal.proposedInvestment ? formatCurrency(deal.proposedInvestment) : 'TBD'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {formatDate(deal.createdAt)}
                        </p>
                        <Button size="sm" variant="outline" className="mt-1">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {data.activeDeals.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No active deal submissions</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Onboarding Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.onboardingProgress.map((progress, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">Company Verification</p>
                        <span className="text-sm text-gray-600">
                          {progress.progressPercentage}% complete
                        </span>
                      </div>
                      <Progress value={progress.progressPercentage} />
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Step: {progress.currentStep.replace('_', ' ')}</span>
                        <span>{progress.estimatedTimeRemaining} days remaining</span>
                      </div>
                    </div>
                  ))}
                  {data.onboardingProgress.length === 0 && (
                    <div className="text-center py-4">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Onboarding completed</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="companies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Your Companies</span>
                <Button onClick={() => onViewDetails('company', 'new')}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Company
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.companies.map((company) => (
                  <div key={company.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Building2 className="h-5 w-5 text-gray-400" />
                          <h3 className="font-semibold">{company.name}</h3>
                          <Badge className={getStatusColor(company.onboardingStatus)}>
                            {company.onboardingStatus}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(company.verificationStatus)}>
                            {company.verificationStatus}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{company.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Sector: {company.sector || 'Not specified'}</span>
                          <span>Geography: {company.geography || 'Not specified'}</span>
                          <span>Founded: {company.foundedYear || 'Not specified'}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline" onClick={() => onViewDetails('company', company.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Company Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                      <div className="text-center">
                        <p className="text-lg font-semibold text-blue-600">{company.deals?.length || 0}</p>
                        <p className="text-xs text-gray-600">Deal Submissions</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-green-600">{company.documents?.length || 0}</p>
                        <p className="text-xs text-gray-600">Documents</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-purple-600">{company.communications?.length || 0}</p>
                        <p className="text-xs text-gray-600">Communications</p>
                      </div>
                    </div>
                  </div>
                ))}
                {data.companies.length === 0 && (
                  <div className="text-center py-12">
                    <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No companies registered yet</p>
                    <Button onClick={() => onViewDetails('company', 'new')}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Your First Company
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Deal Submissions</span>
                <Button onClick={() => onViewDetails('deal', 'new')}>
                  <Plus className="h-4 w-4 mr-1" />
                  New Submission
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.activeDeals.map((deal) => (
                  <div key={deal.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{deal.dealName}</h3>
                          <Badge className={getStatusColor(deal.status)}>
                            {deal.status.replace('_', ' ')}
                          </Badge>
                          <span className={`text-sm ${getPriorityColor(deal.priority)}`}>
                            {deal.priority} Priority
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Target: {deal.targetCompanyName}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Type: {deal.dealType}</span>
                          <span>Stage: {deal.submissionStage}</span>
                          <span>Created: {formatDate(deal.createdAt)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-blue-600 mb-1">
                          {deal.proposedInvestment ? formatCurrency(deal.proposedInvestment) : 'TBD'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Valuation: {deal.targetValuation ? formatCurrency(deal.targetValuation) : 'TBD'}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline" onClick={() => onViewDetails('deal', deal.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Deal Progress */}
                    <div className="flex items-center gap-2 pt-3 border-t">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {deal.documents?.length || 0} documents uploaded
                      </span>
                      <MessageSquare className="h-4 w-4 text-gray-400 ml-4" />
                      <span className="text-sm text-gray-600">
                        {deal.communications?.length || 0} communications
                      </span>
                      {deal.assignedAnalyst && (
                        <>
                          <div className="h-4 w-px bg-gray-300 mx-2" />
                          <span className="text-sm text-gray-600">
                            Assigned to: {deal.assignedAnalyst}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {data.activeDeals.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No deal submissions yet</p>
                    <Button onClick={() => onViewDetails('deal', 'new')}>
                      <Plus className="h-4 w-4 mr-1" />
                      Submit Your First Deal
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Document Center</span>
                <Button>
                  <Upload className="h-4 w-4 mr-1" />
                  Upload Documents
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Mock document categories */}
                {[
                  { category: 'Financial Statements', count: 12, icon: DollarSign },
                  { category: 'Legal Documents', count: 8, icon: FileText },
                  { category: 'Operational Reports', count: 15, icon: TrendingUp },
                  { category: 'Technical Documentation', count: 6, icon: Building2 },
                  { category: 'Marketing Materials', count: 4, icon: MessageSquare },
                  { category: 'Compliance Documents', count: 10, icon: CheckCircle }
                ].map((category, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <category.icon className="h-8 w-8 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-800">{category.count}</span>
                      </div>
                      <h3 className="font-medium text-gray-900">{category.category}</h3>
                      <p className="text-sm text-gray-600">Documents uploaded</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Recent Documents */}
              <div className="mt-6">
                <h3 className="font-semibold mb-4">Recent Documents</h3>
                <div className="space-y-2">
                  {[
                    { name: 'Q4_2024_Financial_Statements.pdf', category: 'Financial', date: new Date(), size: '2.4 MB' },
                    { name: 'Investment_Thesis_TechStartup.docx', category: 'Strategy', date: new Date(), size: '1.8 MB' },
                    { name: 'Due_Diligence_Checklist.xlsx', category: 'Legal', date: new Date(), size: '856 KB' }
                  ].map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-gray-600">{doc.category} • {doc.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{formatDate(doc.date)}</span>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default GPTraditionalDashboard;