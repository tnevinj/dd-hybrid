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
  MoreHorizontal,
  Calculator
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

interface GPPortalTraditionalProps {
  data: {
    companies: GPCompany[];
    activeDeals: GPDealSubmission[];
    metrics: GPMetrics;
    onboardingProgress: GPOnboardingProgress[];
    recentActivity: any[];
  };
  onViewDetails: (type: string, id: string) => void;
}

export function GPPortalTraditional({ data, onViewDetails }: GPPortalTraditionalProps) {
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
          {/* Enhanced Performance Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>GP Performance Dashboard</CardTitle>
                  <CardDescription>Comprehensive overview of your fund management metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-green-800">Deal Success Rate</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex-1">
                            <Progress value={data.metrics.successRate * 100} className="h-2" />
                          </div>
                          <span className="text-lg font-bold text-green-900">{Math.round(data.metrics.successRate * 100)}%</span>
                        </div>
                        <p className="text-sm text-green-700 mt-1">Above industry average of 68%</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-2xl font-bold text-blue-900">{data.metrics.approvedDeals}</p>
                          <p className="text-sm text-blue-700">Deals Approved</p>
                          <p className="text-xs text-blue-600 mt-1">+3 this quarter</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
                          <p className="text-2xl font-bold text-purple-900">$2.3B</p>
                          <p className="text-sm text-purple-700">Total AUM</p>
                          <p className="text-xs text-purple-600 mt-1">+12% YoY</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="h-5 w-5 text-orange-600" />
                          <span className="font-medium text-orange-800">Avg Processing Time</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-orange-900">{data.metrics.averageProcessingTime}</span>
                          <span className="text-sm text-orange-700">days</span>
                        </div>
                        <p className="text-sm text-orange-700 mt-1">5 days faster than Q3</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
                          <p className="text-2xl font-bold text-gray-900">4.2</p>
                          <p className="text-sm text-gray-700">Avg Rating</p>
                          <p className="text-xs text-gray-600 mt-1">/5.0 stars</p>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-2xl font-bold text-yellow-900">18</p>
                          <p className="text-sm text-yellow-700">Active LPs</p>
                          <p className="text-xs text-yellow-600 mt-1">2 new this month</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Performance Trend Chart Placeholder */}
                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-4">Performance Trends</h4>
                    <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Deal Flow & Performance Chart</p>
                        <p className="text-xs text-gray-500">Monthly deal submissions and approval rates</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Communication Hub Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Communication Hub</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-sm font-medium">New Messages</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-900">7</p>
                      <p className="text-xs text-blue-700">3 from Fund Operations team</p>
                    </div>
                    
                    <div className="space-y-2">
                      {[
                        { from: 'Investment Committee', subject: 'Q1 Performance Review', time: '2h ago', urgent: true },
                        { from: 'LP Relations', subject: 'Annual Report Request', time: '1d ago', urgent: false },
                        { from: 'Compliance', subject: 'Documentation Update', time: '2d ago', urgent: false }
                      ].map((message, index) => (
                        <div key={index} className={`p-2 border rounded text-xs ${
                          message.urgent ? 'border-red-200 bg-red-50' : 'border-gray-200'
                        }`}>
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium truncate">{message.from}</span>
                            {message.urgent && <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 ml-1 mt-1"></div>}
                          </div>
                          <p className="text-gray-600 truncate mb-1">{message.subject}</p>
                          <p className="text-gray-500">{message.time}</p>
                        </div>
                      ))}
                    </div>
                    
                    <Button className="w-full" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      View All Messages
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Upcoming Events</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { event: 'IC Meeting', date: 'Jan 25', time: '2:00 PM', type: 'meeting' },
                      { event: 'LP Call - Healthcare Fund', date: 'Jan 28', time: '10:00 AM', type: 'call' },
                      { event: 'Due Diligence Review', date: 'Feb 2', time: '9:00 AM', type: 'review' },
                      { event: 'Compliance Audit', date: 'Feb 5', time: 'All Day', type: 'audit' }
                    ].map((event, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="text-sm font-medium">{event.event}</h5>
                          <span className={`text-xs px-2 py-1 rounded ${
                            event.type === 'meeting' ? 'bg-blue-100 text-blue-800' :
                            event.type === 'call' ? 'bg-green-100 text-green-800' :
                            event.type === 'review' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {event.type}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          <p>{event.date} at {event.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full mt-4" variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Calendar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Enhanced Deal Pipeline and Reporting */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Deal Pipeline Status</span>
                  <Button size="sm" onClick={() => onViewDetails('deals', 'all')}>
                    <Plus className="h-4 w-4 mr-1" />
                    New Submission
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Pipeline Summary */}
                  <div className="grid grid-cols-4 gap-2 mb-4 text-center">
                    <div className="p-2 bg-blue-50 rounded">
                      <p className="text-xs text-blue-600">Submitted</p>
                      <p className="text-lg font-bold text-blue-900">12</p>
                    </div>
                    <div className="p-2 bg-yellow-50 rounded">
                      <p className="text-xs text-yellow-600">Under Review</p>
                      <p className="text-lg font-bold text-yellow-900">8</p>
                    </div>
                    <div className="p-2 bg-green-50 rounded">
                      <p className="text-xs text-green-600">Approved</p>
                      <p className="text-lg font-bold text-green-900">15</p>
                    </div>
                    <div className="p-2 bg-red-50 rounded">
                      <p className="text-xs text-red-600">Declined</p>
                      <p className="text-lg font-bold text-red-900">3</p>
                    </div>
                  </div>
                  
                  {/* Recent Submissions */}
                  <div className="space-y-3">
                    {data.activeDeals.slice(0, 3).map((deal) => (
                      <div key={deal.id} className="p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-medium">{deal.dealName}</p>
                            <p className="text-sm text-gray-600">{deal.targetCompanyName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {deal.proposedInvestment ? formatCurrency(deal.proposedInvestment) : 'TBD'}
                            </p>
                            <p className="text-xs text-gray-600">
                              {formatDate(deal.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(deal.status)}>
                              {deal.status.replace('_', ' ')}
                            </Badge>
                            <span className={`text-xs ${getPriorityColor(deal.priority)}`}>
                              {deal.priority}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {data.activeDeals.length === 0 && (
                      <p className="text-center text-gray-500 py-4">No active deal submissions</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>LP Reporting & Communications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* LP Summary */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-center">
                      <p className="text-2xl font-bold text-purple-900">18</p>
                      <p className="text-sm text-purple-700">Active LPs</p>
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-900">96%</p>
                      <p className="text-sm text-green-700">Satisfaction</p>
                    </div>
                  </div>
                  
                  {/* Recent Reports */}
                  <div>
                    <h5 className="font-medium mb-3">Recent Reports Generated</h5>
                    <div className="space-y-3">
                      {[
                        { title: 'Q4 2023 Performance Report', date: '2024-01-15', status: 'Delivered', recipients: 18 },
                        { title: 'Annual ESG Impact Report', date: '2024-01-10', status: 'In Review', recipients: 18 },
                        { title: 'Portfolio Update - December', date: '2024-01-05', status: 'Delivered', recipients: 16 }
                      ].map((report, index) => (
                        <div key={index} className="p-2 border rounded text-sm">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium">{report.title}</span>
                            <Badge className={report.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                              {report.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>{report.date}</span>
                            <span>{report.recipients} recipients</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Communication Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-4 border-t">
                    <Button size="sm" variant="outline" className="text-xs">
                      <FileText className="h-3 w-3 mr-1" />
                      Generate Report
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Send Update
                    </Button>
                  </div>
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
          {/* Enhanced Deal Management Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Deal List */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Deal Submission Workflow</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Track and manage your investment opportunities</p>
                    </div>
                    <Button onClick={() => onViewDetails('deal', 'new')}>
                      <Plus className="h-4 w-4 mr-1" />
                      New Submission
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.activeDeals.map((deal) => (
                      <div key={deal.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{deal.dealName}</h3>
                              <Badge className={getStatusColor(deal.status)}>
                                {deal.status.replace('_', ' ')}
                              </Badge>
                              <span className={`text-sm font-medium px-2 py-1 rounded ${getPriorityColor(deal.priority)}`}>
                                {deal.priority}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              <strong>Target:</strong> {deal.targetCompanyName} • 
                              <strong> Type:</strong> {deal.dealType} • 
                              <strong> Stage:</strong> {deal.submissionStage}
                            </p>
                            
                            {/* Deal Metrics */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Investment</p>
                                <p className="font-semibold text-blue-600">
                                  {deal.proposedInvestment ? formatCurrency(deal.proposedInvestment) : 'TBD'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Valuation</p>
                                <p className="font-semibold">
                                  {deal.targetValuation ? formatCurrency(deal.targetValuation) : 'TBD'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Multiple</p>
                                <p className="font-semibold text-green-600">2.3x</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">IRR Target</p>
                                <p className="font-semibold text-purple-600">18.5%</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Deal Progress & Actions */}
                        <div className="space-y-3">
                          {/* Progress Bar */}
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Submission Progress</span>
                              <span className="text-sm text-gray-600">75% Complete</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                          </div>
                          
                          {/* Status Details */}
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-600">
                                  {deal.documents?.length || 12} documents
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-600">
                                  {deal.communications?.length || 8} messages
                                </span>
                              </div>
                              {deal.assignedAnalyst && (
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-600">{deal.assignedAnalyst}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => onViewDetails('deal', deal.id)}>
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                              <Button size="sm" variant="outline">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Message
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </div>
                          </div>
                          
                          {/* Timeline/Next Steps */}
                          {deal.status === 'UNDER_REVIEW' && (
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <div className="flex items-center space-x-2 mb-1">
                                <Clock className="h-4 w-4 text-yellow-600" />
                                <span className="text-sm font-medium text-yellow-800">Next Step</span>
                              </div>
                              <p className="text-sm text-yellow-700">
                                Investment Committee review scheduled for January 30, 2024. 
                                Additional due diligence documents may be requested.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {data.activeDeals.length === 0 && (
                      <div className="text-center py-12">
                        <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No deal submissions yet</h3>
                        <p className="text-gray-600 mb-6">Start by submitting your first investment opportunity for review</p>
                        <Button onClick={() => onViewDetails('deal', 'new')} size="lg">
                          <Plus className="h-4 w-4 mr-2" />
                          Submit Your First Deal
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Deal Analytics Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Deal Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-2xl font-bold text-blue-900">73%</p>
                      <p className="text-sm text-blue-700">Approval Rate</p>
                      <p className="text-xs text-blue-600">Last 12 months</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center p-2 bg-green-50 rounded">
                        <p className="text-lg font-bold text-green-900">15</p>
                        <p className="text-xs text-green-700">Approved</p>
                      </div>
                      <div className="text-center p-2 bg-yellow-50 rounded">
                        <p className="text-lg font-bold text-yellow-900">8</p>
                        <p className="text-xs text-yellow-700">In Review</p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h5 className="font-medium mb-3">Average Metrics</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Deal Size</span>
                          <span className="font-medium">$12.3M</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Review Time</span>
                          <span className="font-medium">21 days</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Success Rate</span>
                          <span className="font-medium">73%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button className="w-full justify-start" variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Deal Templates
                    </Button>
                    <Button className="w-full justify-start" variant="outline" size="sm">
                      <Calculator className="h-4 w-4 mr-2" />
                      Valuation Tools
                    </Button>
                    <Button className="w-full justify-start" variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact IC
                    </Button>
                    <Button className="w-full justify-start" variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { action: 'Deal approved', deal: 'TechCorp Alpha', time: '2 hours ago', type: 'success' },
                      { action: 'Documents requested', deal: 'Healthcare REIT', time: '1 day ago', type: 'info' },
                      { action: 'IC review scheduled', deal: 'Growth Fund IV', time: '2 days ago', type: 'warning' }
                    ].map((activity, index) => (
                      <div key={index} className="text-sm">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'success' ? 'bg-green-500' :
                            activity.type === 'info' ? 'bg-blue-500' : 'bg-yellow-500'
                          }`}></div>
                          <span className="font-medium">{activity.action}</span>
                        </div>
                        <p className="text-gray-600 text-xs ml-4">{activity.deal} • {activity.time}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
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

export default GPPortalTraditional;