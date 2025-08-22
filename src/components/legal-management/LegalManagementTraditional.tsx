import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModuleHeader, ProcessNotice, MetricCard } from '@/components/shared/ModeIndicators';
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  MoreVertical,
  Calendar,
  FileText,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  Download,
  User,
  Scale,
  Gavel,
  Users,
  BookOpen
} from 'lucide-react';

interface LegalDocument {
  id: string;
  title: string;
  category: string;
  status: string;
  priority: string;
  deadline?: Date;
  assignedTo?: string;
  lastModified: Date;
  confidentiality: string;
  complianceStatus: string;
}

interface LegalWorkflow {
  id: string;
  name: string;
  status: string;
  priority: string;
  assignedTo: string;
  progress: number;
  deadline: Date;
}

interface LegalManagementTraditionalProps {
  documents: LegalDocument[];
  workflows: LegalWorkflow[];
  metrics: any;
  isLoading: boolean;
  onCreateDocument: () => void;
  onViewDocument: (id: string) => void;
  onManageCompliance: () => void;
}

export const LegalManagementTraditional: React.FC<LegalManagementTraditionalProps> = ({
  documents = [],
  workflows = [],
  metrics = {
    totalDocuments: 847,
    activeDocuments: 156,
    pendingReview: 23,
    overdueDocuments: 8,
    complianceAlerts: 5,
    completedWorkflows: 142,
    activeWorkflows: 28,
    complianceScore: 94,
    documentAccuracy: 98.5
  },
  isLoading = false,
  onCreateDocument,
  onViewDocument,
  onManageCompliance,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('documents');
  const [sortBy, setSortBy] = useState<'title' | 'status' | 'deadline' | 'priority'>('deadline');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedFilters, setSelectedFilters] = useState({
    category: '',
    status: '',
    priority: '',
    confidentiality: ''
  });

  // Mock data for demonstration
  const [mockDocuments] = useState<LegalDocument[]>([
    {
      id: 'doc-1',
      title: 'Portfolio Company Service Agreement - TechCorp',
      category: 'Contracts',
      status: 'Under Review',
      priority: 'High',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      assignedTo: 'Sarah Johnson',
      lastModified: new Date(),
      confidentiality: 'Confidential',
      complianceStatus: 'Compliant'
    },
    {
      id: 'doc-2',
      title: 'Fund Formation Documents - Growth Fund IV',
      category: 'Fund Documents',
      status: 'Draft',
      priority: 'Critical',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      assignedTo: 'Michael Chen',
      lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      confidentiality: 'Highly Confidential',
      complianceStatus: 'Under Review'
    },
    {
      id: 'doc-3',
      title: 'Regulatory Compliance Report - Q4 2023',
      category: 'Compliance',
      status: 'Approved',
      priority: 'Medium',
      assignedTo: 'Rachel Martinez',
      lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      confidentiality: 'Internal',
      complianceStatus: 'Compliant'
    }
  ]);

  const [mockWorkflows] = useState<LegalWorkflow[]>([
    {
      id: 'wf-1',
      name: 'Contract Review Process - HealthTech Deal',
      status: 'In Progress',
      priority: 'High',
      assignedTo: 'Legal Team Alpha',
      progress: 65,
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'wf-2',
      name: 'ESG Compliance Assessment',
      status: 'Pending',
      priority: 'Medium',
      assignedTo: 'Compliance Team',
      progress: 30,
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'wf-3',
      name: 'Fund Documentation Update',
      status: 'Completed',
      priority: 'Low',
      assignedTo: 'Document Team',
      progress: 100,
      deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'compliant':
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'under review':
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'draft':
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue':
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const isOverdue = (deadline?: Date) => {
    if (!deadline) return false;
    return deadline < new Date();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-700">Loading Legal Management Data...</h3>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="container mx-auto max-w-7xl">
        <ModuleHeader
          title="Legal Management"
          description="Complete manual control over legal documents, compliance, and workflows"
          mode="traditional"
          actions={
            <div className="flex space-x-2">
              <Button onClick={onCreateDocument} className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-800">
                <Plus className="h-4 w-4" />
                <span>New Document</span>
              </Button>
              <Button onClick={onManageCompliance} variant="outline" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Compliance</span>
              </Button>
            </div>
          }
        />
      
      {/* KPI Cards - Traditional Focus */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-5 w-5 text-gray-600" />
              <p className="text-sm text-gray-600 font-medium">Total Documents</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metrics.totalDocuments}</p>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <BookOpen className="h-4 w-4 mr-1" />
              {metrics.activeDocuments} active
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-5 w-5 text-gray-600" />
              <p className="text-sm text-gray-600 font-medium">Pending Review</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metrics.pendingReview}</p>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <Eye className="h-4 w-4 mr-1" />
              Manual review required
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-gray-600" />
              <p className="text-sm text-gray-600 font-medium">Overdue Items</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metrics.overdueDocuments}</p>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              Immediate attention needed
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-gray-600" />
              <p className="text-sm text-gray-600 font-medium">Compliance</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metrics.complianceScore}%</p>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <Scale className="h-4 w-4 mr-1" />
              Manual monitoring
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-5 w-5 text-gray-600" />
              <p className="text-sm text-gray-600 font-medium">Active Workflows</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metrics.activeWorkflows}</p>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <Gavel className="h-4 w-4 mr-1" />
              {metrics.completedWorkflows} completed
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          {/* Enhanced Document Management */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Document List */}
            <div className="lg:col-span-3">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Document Repository</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search documents, contracts, legal opinions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-gray-300 focus:border-gray-500"
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <select
                        value={selectedFilters.category}
                        onChange={(e) => setSelectedFilters(prev => ({ ...prev, category: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="">All Categories</option>
                        <option value="Contracts">Contracts</option>
                        <option value="Fund Documents">Fund Documents</option>
                        <option value="Compliance">Compliance</option>
                        <option value="Legal Opinions">Legal Opinions</option>
                        <option value="Due Diligence">Due Diligence</option>
                        <option value="Regulatory">Regulatory</option>
                      </select>
                      
                      <select
                        value={selectedFilters.status}
                        onChange={(e) => setSelectedFilters(prev => ({ ...prev, status: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="">All Statuses</option>
                        <option value="Draft">Draft</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Executed">Executed</option>
                      </select>
                    </div>
                  </div>

                  {/* Enhanced Documents Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Document</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Risk Level</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Deadline</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            id: 'doc-1',
                            title: 'Master Service Agreement - TechCorp Alpha',
                            category: 'Contracts',
                            status: 'Under Review',
                            riskLevel: 'Medium',
                            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                            assignedTo: 'Sarah Johnson',
                            lastModified: new Date(),
                            contractValue: '$2.3M',
                            keyTerms: ['Termination clause', 'IP ownership', 'Liability cap'],
                            riskFactors: ['Unlimited liability exposure', 'Broad indemnification']
                          },
                          {
                            id: 'doc-2',
                            title: 'Limited Partnership Agreement - Growth Fund IV',
                            category: 'Fund Documents',
                            status: 'Draft',
                            riskLevel: 'High',
                            deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                            assignedTo: 'Michael Chen',
                            lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                            contractValue: '$500M Fund',
                            keyTerms: ['Management fee', 'Carry structure', 'Investment restrictions'],
                            riskFactors: ['Key person provisions', 'Clawback mechanisms']
                          },
                          {
                            id: 'doc-3',
                            title: 'Subscription Agreement - Healthcare REIT',
                            category: 'Investment Documents',
                            status: 'Approved',
                            riskLevel: 'Low',
                            deadline: null,
                            assignedTo: 'Rachel Martinez',
                            lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                            contractValue: '$45M',
                            keyTerms: ['Subscription amount', 'Representations', 'Transfer restrictions'],
                            riskFactors: ['Market risk disclosure', 'Liquidity constraints']
                          },
                          {
                            id: 'doc-4',
                            title: 'ESG Compliance Certification',
                            category: 'Compliance',
                            status: 'Executed',
                            riskLevel: 'Low',
                            deadline: null,
                            assignedTo: 'Compliance Team',
                            lastModified: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                            contractValue: 'N/A',
                            keyTerms: ['ESG criteria', 'Reporting requirements', 'Monitoring'],
                            riskFactors: ['Regulatory changes', 'Measurement standards']
                          }
                        ].map((document) => (
                          <tr key={document.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div>
                                <div className="font-semibold text-gray-900 mb-1">{document.title}</div>
                                <div className="text-sm text-gray-600 mb-1">
                                  Value: {document.contractValue} • Assigned: {document.assignedTo}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Modified: {formatDate(document.lastModified)}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge variant="outline">{document.category}</Badge>
                            </td>
                            <td className="py-4 px-4">
                              <Badge className={`${getStatusColor(document.status)} border`}>
                                {document.status}
                              </Badge>
                            </td>
                            <td className="py-4 px-4">
                              <Badge className={`${
                                document.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                                document.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              } border`}>
                                {document.riskLevel}
                              </Badge>
                            </td>
                            <td className="py-4 px-4">
                              {document.deadline ? (
                                <div className={`text-sm ${isOverdue(document.deadline) ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                                  {formatDate(document.deadline)}
                                  {isOverdue(document.deadline) && (
                                    <div className="flex items-center mt-1">
                                      <AlertTriangle className="h-3 w-3 text-red-500 mr-1" />
                                      <span className="text-xs text-red-500">Overdue</span>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400">No deadline</span>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => onViewDocument(document.id)}
                                  className="text-gray-700 border-gray-300"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm"
                                  variant="outline"
                                  className="text-gray-700 border-gray-300"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm"
                                  variant="outline"
                                  className="text-gray-700 border-gray-300"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Document Analytics Sidebar */}
            <div className="space-y-6">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg">Document Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Total Documents</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-900">847</p>
                      <p className="text-xs text-blue-700">+23 this month</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Contracts</span>
                        <span className="font-medium">234</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Fund Docs</span>
                        <span className="font-medium">156</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Compliance</span>
                        <span className="font-medium">189</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Due Diligence</span>
                        <span className="font-medium">145</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Legal Opinions</span>
                        <span className="font-medium">123</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg">Contract Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-red-800">High Risk Contracts</span>
                      </div>
                      <p className="text-lg font-bold text-red-900">12</p>
                      <p className="text-xs text-red-700">Require immediate review</p>
                    </div>
                    
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">Expiring Soon</span>
                      </div>
                      <p className="text-lg font-bold text-yellow-900">8</p>
                      <p className="text-xs text-yellow-700">Within 90 days</p>
                    </div>
                    
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Fully Executed</span>
                      </div>
                      <p className="text-lg font-bold text-green-900">145</p>
                      <p className="text-xs text-green-700">No action required</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button className="w-full justify-start" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      New Contract
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Shield className="h-4 w-4 mr-2" />
                      Run Compliance Check
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Registry
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">Legal Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockWorkflows.map((workflow) => (
                  <div key={workflow.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getStatusColor(workflow.status)} border`}>
                          {workflow.status}
                        </Badge>
                        <Badge className={`${getPriorityColor(workflow.priority)} border`}>
                          {workflow.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Assigned To</p>
                        <p className="font-medium">{workflow.assignedTo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Progress</p>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${workflow.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{workflow.progress}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Deadline</p>
                        <p className={`font-medium ${isOverdue(workflow.deadline) ? 'text-red-600' : 'text-gray-900'}`}>
                          {formatDate(workflow.deadline)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit Workflow
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          {/* Enhanced Compliance Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Regulatory Compliance Tracker</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { 
                        regulation: 'SEC Investment Adviser Rule 206(4)-8', 
                        status: 'Compliant', 
                        lastReview: '2024-01-10', 
                        nextReview: '2024-04-10',
                        riskLevel: 'Low',
                        description: 'Custody of client funds and securities'
                      },
                      { 
                        regulation: 'GDPR Data Protection Compliance', 
                        status: 'Under Review', 
                        lastReview: '2023-12-15', 
                        nextReview: '2024-02-15',
                        riskLevel: 'Medium',
                        description: 'EU data protection and privacy regulations'
                      },
                      { 
                        regulation: 'Dodd-Frank Volcker Rule', 
                        status: 'Compliant', 
                        lastReview: '2024-01-05', 
                        nextReview: '2024-07-05',
                        riskLevel: 'Low',
                        description: 'Proprietary trading restrictions'
                      },
                      { 
                        regulation: 'AIFMD Reporting Requirements', 
                        status: 'Action Required', 
                        lastReview: '2023-11-20', 
                        nextReview: '2024-01-25',
                        riskLevel: 'High',
                        description: 'Alternative Investment Fund Managers Directive'
                      }
                    ].map((item, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{item.regulation}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge className={`${
                              item.status === 'Compliant' ? 'bg-green-100 text-green-800' :
                              item.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            } border`}>
                              {item.status}
                            </Badge>
                            <Badge className={`${
                              item.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                              item.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            } border`}>
                              {item.riskLevel} Risk
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Last Review:</span>
                            <span className="ml-2 font-medium">{item.lastReview}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Next Review:</span>
                            <span className={`ml-2 font-medium ${
                              new Date(item.nextReview) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'text-red-600' : 'text-gray-900'
                            }`}>
                              {item.nextReview}
                            </span>
                          </div>
                        </div>
                        {item.status === 'Action Required' && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                              <span className="text-sm font-medium text-red-800">Action Required</span>
                            </div>
                            <p className="text-sm text-red-700 mt-1">
                              Quarterly reporting deadline approaching. Submit Form ADV amendments by January 30, 2024.
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Compliance Summary Sidebar */}
            <div className="space-y-6">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg">Compliance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-800">Overall Score</span>
                      </div>
                      <p className="text-2xl font-bold text-green-900">94.2%</p>
                      <p className="text-sm text-green-700">Above industry average</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">SEC Compliance</span>
                        <span className="text-sm">98%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '98%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Data Protection</span>
                        <span className="text-sm">87%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">International</span>
                        <span className="text-sm">92%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { task: 'Form ADV Amendment', date: '2024-01-30', urgent: true },
                      { task: 'GDPR Annual Review', date: '2024-02-15', urgent: false },
                      { task: 'Quarterly SEC Filing', date: '2024-03-01', urgent: false },
                      { task: 'Anti-Money Laundering Report', date: '2024-03-15', urgent: false }
                    ].map((deadline, index) => (
                      <div key={index} className={`p-3 border rounded-lg ${
                        deadline.urgent ? 'border-red-200 bg-red-50' : 'border-gray-200'
                      }`}>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-medium ${
                            deadline.urgent ? 'text-red-800' : 'text-gray-900'
                          }`}>
                            {deadline.task}
                          </span>
                          {deadline.urgent && (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <p className={`text-xs mt-1 ${
                          deadline.urgent ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {deadline.date}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg">Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        <span className="text-sm font-medium text-green-800">Low Risk Areas</span>
                      </div>
                      <p className="text-xs text-green-700 ml-5">Securities regulations, custody rules</p>
                    </div>
                    
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                        <span className="text-sm font-medium text-yellow-800">Medium Risk Areas</span>
                      </div>
                      <p className="text-xs text-yellow-700 ml-5">Data protection, cross-border transactions</p>
                    </div>
                    
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                        <span className="text-sm font-medium text-red-800">High Risk Areas</span>
                      </div>
                      <p className="text-xs text-red-700 ml-5">AIFMD reporting, emerging regulations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {/* Enhanced Legal Reports Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Available Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: 'Compliance Status Report',
                      description: 'Comprehensive overview of regulatory compliance across all areas',
                      frequency: 'Monthly',
                      lastGenerated: '2024-01-15',
                      status: 'Current',
                      icon: Shield
                    },
                    {
                      name: 'Contract Analysis Summary',
                      description: 'Analysis of contract terms, risks, and key obligations',
                      frequency: 'Quarterly',
                      lastGenerated: '2024-01-01',
                      status: 'Current',
                      icon: FileText
                    },
                    {
                      name: 'Legal Risk Assessment',
                      description: 'Identification and evaluation of legal risks across portfolio',
                      frequency: 'Quarterly',
                      lastGenerated: '2023-12-20',
                      status: 'Update Available',
                      icon: AlertTriangle
                    },
                    {
                      name: 'Regulatory Changes Impact',
                      description: 'Analysis of recent regulatory changes and their impact',
                      frequency: 'As Needed',
                      lastGenerated: '2024-01-08',
                      status: 'Current',
                      icon: Scale
                    },
                    {
                      name: 'Document Workflow Analysis',
                      description: 'Efficiency metrics for document review and approval processes',
                      frequency: 'Monthly',
                      lastGenerated: '2024-01-12',
                      status: 'Current',
                      icon: Users
                    }
                  ].map((report, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <report.icon className="h-5 w-5 text-gray-600" />
                          <h4 className="font-semibold text-gray-900">{report.name}</h4>
                        </div>
                        <Badge className={`${
                          report.status === 'Current' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {report.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                      <div className="flex justify-between items-center text-sm">
                        <div>
                          <span className="text-gray-500">Frequency: </span>
                          <span className="font-medium">{report.frequency}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Last: </span>
                          <span className="font-medium">{report.lastGenerated}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Latest
                        </Button>
                        <Button size="sm" className="bg-gray-700 hover:bg-gray-800">
                          Generate New
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg">Custom Report Builder</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                      <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                        <option>Compliance Analysis</option>
                        <option>Risk Assessment</option>
                        <option>Contract Review</option>
                        <option>Regulatory Impact</option>
                        <option>Custom Analysis</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input type="date" className="p-2 border border-gray-300 rounded-md text-sm" />
                        <input type="date" className="p-2 border border-gray-300 rounded-md text-sm" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Include Sections</label>
                      <div className="space-y-2">
                        {[
                          'Executive Summary',
                          'Compliance Status',
                          'Risk Analysis',
                          'Action Items',
                          'Recommendations',
                          'Appendices'
                        ].map((section, index) => (
                          <label key={index} className="flex items-center space-x-2">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="text-sm">{section}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <Button className="w-full bg-gray-700 hover:bg-gray-800">
                      Generate Custom Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        title: 'Q4 2023 Compliance Review',
                        type: 'Compliance',
                        date: '2024-01-15',
                        pages: 24,
                        status: 'Final'
                      },
                      {
                        title: 'Fund Formation Legal Analysis',
                        type: 'Legal Analysis',
                        date: '2024-01-10',
                        pages: 31,
                        status: 'Draft'
                      },
                      {
                        title: 'Regulatory Changes Impact Assessment',
                        type: 'Risk Assessment',
                        date: '2024-01-08',
                        pages: 18,
                        status: 'Final'
                      },
                      {
                        title: 'Contract Risk Analysis - HealthTech',
                        type: 'Contract Analysis',
                        date: '2024-01-05',
                        pages: 15,
                        status: 'Final'
                      }
                    ].map((report, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium text-sm">{report.title}</h4>
                          <Badge className={report.status === 'Final' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {report.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-600">
                          <span>{report.type} • {report.pages} pages</span>
                          <span>{report.date}</span>
                        </div>
                        <div className="flex space-x-2 mt-2">
                          <Button size="sm" variant="outline" className="text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

        <ProcessNotice 
          mode="traditional"
          title="Traditional Legal Management"
          description="You have full manual control over legal document management and compliance monitoring. All document reviews, workflow approvals, and compliance assessments are performed manually without AI assistance. Use the search, filter, and sort tools to organize documents according to your requirements."
        />
      </div>
    </div>
  );
};

export default LegalManagementTraditional;
