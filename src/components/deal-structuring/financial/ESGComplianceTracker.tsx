/**
 * ESG Compliance Tracker Component
 * 
 * Advanced ESG compliance monitoring and tracking interface for regulatory
 * adherence, framework alignment, and reporting requirements management.
 * Provides comprehensive compliance status tracking, deadline management,
 * and automated compliance alerts.
 * 
 * Features:
 * - Multi-framework compliance tracking (SASB, GRI, TCFD, EU Taxonomy)
 * - Regulatory requirement monitoring and deadlines
 * - Automated compliance alerts and notifications
 * - Gap analysis and remediation planning
 * - Audit trail and documentation management
 * - Progress tracking and milestone management
 * - Compliance risk assessment and scoring
 * - Integration with ESG reporting workflows
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText,
  Calendar,
  Bell,
  Target,
  TrendingUp,
  Users,
  Building,
  Globe,
  Flag,
  XCircle,
  Eye,
  Filter,
  Download,
  Plus,
  Edit,
  Search,
  BarChart3,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

enum ESGFramework {
  SASB = 'SASB',
  GRI = 'GRI',
  TCFD = 'TCFD',
  EU_TAXONOMY = 'EU Taxonomy',
  CDP = 'CDP',
  UNGC = 'UN Global Compact'
}

interface ComplianceItem {
  id: string;
  framework: ESGFramework;
  requirement: string;
  description: string;
  category: 'disclosure' | 'measurement' | 'reporting' | 'governance' | 'risk_management';
  status: 'compliant' | 'partial' | 'non_compliant' | 'not_applicable';
  priority: 'critical' | 'high' | 'medium' | 'low';
  dueDate?: Date;
  lastUpdate: Date;
  responsibleParty: string;
  evidence: ComplianceEvidence[];
  gaps: ComplianceGap[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  remediationPlan?: RemediationPlan;
}

interface ComplianceEvidence {
  id: string;
  type: 'document' | 'process' | 'system' | 'training' | 'audit';
  description: string;
  url?: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  uploadDate: Date;
  expiryDate?: Date;
}

interface ComplianceGap {
  id: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  deadline: Date;
}

interface RemediationPlan {
  id: string;
  description: string;
  actions: RemediationAction[];
  timeline: string;
  budget: number;
  responsibleParty: string;
  status: 'planned' | 'in_progress' | 'completed' | 'delayed';
  expectedCompletion: Date;
}

interface RemediationAction {
  id: string;
  action: string;
  deadline: Date;
  status: 'pending' | 'in_progress' | 'completed';
  assignee: string;
  dependencies: string[];
}

interface ComplianceAlert {
  id: string;
  type: 'deadline_approaching' | 'overdue' | 'gap_identified' | 'framework_update' | 'regulatory_change';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  actionRequired: string;
  deadline?: Date;
  acknowledged: boolean;
  createdAt: Date;
}

interface ComplianceMetrics {
  overallComplianceRate: number;
  frameworkCompliance: { [framework: string]: number };
  criticalGaps: number;
  overdueItems: number;
  upcomingDeadlines: number;
  riskScore: number;
  trendDirection: 'improving' | 'stable' | 'declining';
}

interface ESGComplianceTrackerProps {
  dealId: string;
  mode?: 'traditional' | 'assisted' | 'autonomous';
  entityId?: string;
  complianceData?: ComplianceItem[];
  alerts?: ComplianceAlert[];
  onUpdateCompliance?: (item: ComplianceItem) => void;
  onAcknowledgeAlert?: (alertId: string) => void;
  className?: string;
}

const ESGComplianceTracker: React.FC<ESGComplianceTrackerProps> = ({
  dealId,
  mode = 'traditional',
  entityId = 'entity-001',
  complianceData = [],
  alerts = [],
  onUpdateCompliance,
  onAcknowledgeAlert,
  className
}) => {
  // Sample compliance data
  const defaultComplianceData: ComplianceItem[] = [
    {
      id: 'sasb-1',
      framework: ESGFramework.SASB,
      requirement: 'Greenhouse Gas Emissions',
      description: 'Disclose Scope 1, 2, and 3 greenhouse gas emissions',
      category: 'disclosure',
      status: 'compliant',
      priority: 'critical',
      dueDate: new Date('2024-03-31'),
      lastUpdate: new Date(),
      responsibleParty: 'Sustainability Team',
      evidence: [
        {
          id: 'ev-1',
          type: 'document',
          description: 'Annual GHG Emissions Report',
          verificationStatus: 'verified',
          uploadDate: new Date(),
          expiryDate: new Date('2025-03-31')
        }
      ],
      gaps: [],
      riskLevel: 'low'
    },
    {
      id: 'gri-1',
      framework: ESGFramework.GRI,
      requirement: 'Energy Consumption',
      description: 'Report energy consumption within and outside organization',
      category: 'measurement',
      status: 'partial',
      priority: 'high',
      dueDate: new Date('2024-02-15'),
      lastUpdate: new Date(),
      responsibleParty: 'Operations Team',
      evidence: [
        {
          id: 'ev-2',
          type: 'system',
          description: 'Energy monitoring system data',
          verificationStatus: 'pending',
          uploadDate: new Date()
        }
      ],
      gaps: [
        {
          id: 'gap-1',
          description: 'Missing Scope 3 energy consumption data',
          impact: 'medium',
          recommendation: 'Implement supplier energy reporting',
          deadline: new Date('2024-02-15')
        }
      ],
      riskLevel: 'medium',
      remediationPlan: {
        id: 'plan-1',
        description: 'Implement comprehensive energy tracking',
        actions: [
          {
            id: 'action-1',
            action: 'Deploy energy monitoring systems',
            deadline: new Date('2024-01-31'),
            status: 'in_progress',
            assignee: 'IT Team',
            dependencies: []
          }
        ],
        timeline: '6 weeks',
        budget: 50000,
        responsibleParty: 'Operations Manager',
        status: 'in_progress',
        expectedCompletion: new Date('2024-02-15')
      }
    },
    {
      id: 'tcfd-1',
      framework: ESGFramework.TCFD,
      requirement: 'Climate Risk Assessment',
      description: 'Conduct climate-related risk and opportunity assessment',
      category: 'risk_management',
      status: 'non_compliant',
      priority: 'critical',
      dueDate: new Date('2024-04-30'),
      lastUpdate: new Date(),
      responsibleParty: 'Risk Management',
      evidence: [],
      gaps: [
        {
          id: 'gap-2',
          description: 'No formal climate risk assessment conducted',
          impact: 'high',
          recommendation: 'Engage climate risk consultants',
          deadline: new Date('2024-04-30')
        }
      ],
      riskLevel: 'critical'
    },
    {
      id: 'eu-tax-1',
      framework: ESGFramework.EU_TAXONOMY,
      requirement: 'Taxonomy Alignment Assessment',
      description: 'Assess and report taxonomy-aligned activities',
      category: 'reporting',
      status: 'partial',
      priority: 'high',
      dueDate: new Date('2024-06-30'),
      lastUpdate: new Date(),
      responsibleParty: 'Finance Team',
      evidence: [
        {
          id: 'ev-3',
          type: 'document',
          description: 'Preliminary taxonomy screening',
          verificationStatus: 'pending',
          uploadDate: new Date()
        }
      ],
      gaps: [
        {
          id: 'gap-3',
          description: 'Detailed technical screening criteria not assessed',
          impact: 'medium',
          recommendation: 'Complete detailed assessment',
          deadline: new Date('2024-06-30')
        }
      ],
      riskLevel: 'medium'
    }
  ];

  const defaultAlerts: ComplianceAlert[] = [
    {
      id: 'alert-1',
      type: 'deadline_approaching',
      severity: 'warning',
      title: 'GRI Energy Reporting Due Soon',
      message: 'Energy consumption disclosure deadline in 15 days',
      actionRequired: 'Complete Scope 3 energy data collection',
      deadline: new Date('2024-02-15'),
      acknowledged: false,
      createdAt: new Date()
    },
    {
      id: 'alert-2',
      type: 'gap_identified',
      severity: 'critical',
      title: 'Missing Climate Risk Assessment',
      message: 'TCFD climate risk assessment not started',
      actionRequired: 'Initiate climate risk assessment process',
      acknowledged: false,
      createdAt: new Date()
    },
    {
      id: 'alert-3',
      type: 'framework_update',
      severity: 'info',
      title: 'SASB Standards Update',
      message: 'New SASB standards released for financial services',
      actionRequired: 'Review and assess impact of new standards',
      acknowledged: true,
      createdAt: new Date()
    }
  ];

  // State management
  const [complianceItems] = useState<ComplianceItem[]>(complianceData.length > 0 ? complianceData : defaultComplianceData);
  const [complianceAlerts, setComplianceAlerts] = useState<ComplianceAlert[]>(alerts.length > 0 ? alerts : defaultAlerts);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFramework, setSelectedFramework] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyDue, setShowOnlyDue] = useState(false);

  // Calculate compliance metrics
  const complianceMetrics = useMemo((): ComplianceMetrics => {
    const total = complianceItems.length;
    const compliant = complianceItems.filter(item => item.status === 'compliant').length;
    const overallComplianceRate = total > 0 ? (compliant / total) * 100 : 0;

    const frameworkCompliance: { [framework: string]: number } = {};
    Object.values(ESGFramework).forEach(framework => {
      const frameworkItems = complianceItems.filter(item => item.framework === framework);
      const frameworkCompliant = frameworkItems.filter(item => item.status === 'compliant').length;
      frameworkCompliance[framework] = frameworkItems.length > 0 ? (frameworkCompliant / frameworkItems.length) * 100 : 0;
    });

    const criticalGaps = complianceItems.filter(item => 
      item.status === 'non_compliant' && item.priority === 'critical'
    ).length;

    const now = new Date();
    const overdueItems = complianceItems.filter(item => 
      item.dueDate && item.dueDate < now && item.status !== 'compliant'
    ).length;

    const upcomingDeadlines = complianceItems.filter(item => {
      if (!item.dueDate || item.status === 'compliant') return false;
      const daysUntilDue = Math.ceil((item.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilDue >= 0 && daysUntilDue <= 30;
    }).length;

    const riskScore = complianceItems.reduce((acc, item) => {
      const riskWeights = { low: 1, medium: 2, high: 3, critical: 4 };
      return acc + riskWeights[item.riskLevel];
    }, 0) / complianceItems.length;

    return {
      overallComplianceRate,
      frameworkCompliance,
      criticalGaps,
      overdueItems,
      upcomingDeadlines,
      riskScore,
      trendDirection: 'improving' // Would be calculated from historical data
    };
  }, [complianceItems]);

  // Filter compliance items
  const filteredItems = useMemo(() => {
    return complianceItems.filter(item => {
      if (selectedFramework !== 'all' && item.framework !== selectedFramework) return false;
      if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
      if (selectedPriority !== 'all' && item.priority !== selectedPriority) return false;
      if (searchTerm && !item.requirement.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !item.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (showOnlyDue) {
        if (!item.dueDate) return false;
        const now = new Date();
        const daysUntilDue = Math.ceil((item.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilDue > 30) return false;
      }
      return true;
    });
  }, [complianceItems, selectedFramework, selectedStatus, selectedPriority, searchTerm, showOnlyDue]);

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600';
      case 'partial': return 'text-yellow-600';
      case 'non_compliant': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant': return 'default';
      case 'partial': return 'secondary';
      case 'non_compliant': return 'destructive';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-800';
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getAlertIcon = (type: string, severity: string) => {
    if (severity === 'critical') return <XCircle className="h-4 w-4 text-red-600" />;
    if (severity === 'warning') return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <Bell className="h-4 w-4 text-blue-600" />;
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const now = new Date();
    return Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const acknowledgeAlert = (alertId: string) => {
    setComplianceAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
    onAcknowledgeAlert?.(alertId);
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <CardTitle>ESG Compliance Tracker</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1">
              {complianceMetrics.overallComplianceRate.toFixed(0)}% Compliant
            </Badge>
            {mode !== 'traditional' && (
              <Badge variant="outline">
                {mode}
              </Badge>
            )}
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export Report
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="remediation">Remediation</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Compliance Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Overall Compliance</span>
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {complianceMetrics.overallComplianceRate.toFixed(0)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {complianceItems.filter(i => i.status === 'compliant').length} of {complianceItems.length} items
                </div>
              </Card>

              <Card className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="text-sm text-gray-600">Critical Gaps</span>
                </div>
                <div className="text-3xl font-bold text-red-600">
                  {complianceMetrics.criticalGaps}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Requiring immediate attention
                </div>
              </Card>

              <Card className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span className="text-sm text-gray-600">Upcoming Due</span>
                </div>
                <div className="text-3xl font-bold text-orange-600">
                  {complianceMetrics.upcomingDeadlines}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Due within 30 days
                </div>
              </Card>

              <Card className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="text-sm text-gray-600">Overdue</span>
                </div>
                <div className="text-3xl font-bold text-red-600">
                  {complianceMetrics.overdueItems}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Past deadline
                </div>
              </Card>
            </div>

            {/* Framework Compliance Breakdown */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Framework Compliance Breakdown
              </h3>
              <div className="space-y-4">
                {Object.entries(complianceMetrics.frameworkCompliance).map(([framework, rate]) => (
                  <div key={framework}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{framework}</span>
                      <span className="text-sm">{rate.toFixed(0)}%</span>
                    </div>
                    <Progress value={rate} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Alerts */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Recent Alerts
              </h3>
              <div className="space-y-3">
                {complianceAlerts.slice(0, 3).map(alert => (
                  <div key={alert.id} className={`p-3 rounded-lg border ${alert.acknowledged ? 'bg-gray-50' : 'bg-white border-l-4 border-l-blue-500'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getAlertIcon(alert.type, alert.severity)}
                        <div>
                          <div className="font-medium text-sm">{alert.title}</div>
                          <div className="text-xs text-gray-600 mt-1">{alert.message}</div>
                          {alert.deadline && (
                            <div className="text-xs text-red-600 mt-1">
                              Due: {alert.deadline.toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      {!alert.acknowledged && (
                        <Button variant="outline" size="sm" onClick={() => acknowledgeAlert(alert.id)}>
                          Acknowledge
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search requirements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48"
                />
              </div>
              <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Frameworks</SelectItem>
                  <SelectItem value={ESGFramework.SASB}>SASB</SelectItem>
                  <SelectItem value={ESGFramework.GRI}>GRI</SelectItem>
                  <SelectItem value={ESGFramework.TCFD}>TCFD</SelectItem>
                  <SelectItem value={ESGFramework.EU_TAXONOMY}>EU Taxonomy</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="compliant">Compliant</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="non_compliant">Non-Compliant</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showOnlyDue"
                  checked={showOnlyDue}
                  onCheckedChange={(checked) => setShowOnlyDue(checked as boolean)}
                />
                <Label htmlFor="showOnlyDue" className="text-sm">Due soon</Label>
              </div>
            </div>

            {/* Requirements List */}
            <div className="space-y-4">
              {filteredItems.map(item => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{item.requirement}</h4>
                        <Badge variant="outline">{item.framework}</Badge>
                        <Badge variant={getStatusBadge(item.status) as any}>
                          {item.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Category: {item.category.replace('_', ' ')}</span>
                        <span>Responsible: {item.responsibleParty}</span>
                        <span>Risk: <span className={getRiskColor(item.riskLevel)}>{item.riskLevel}</span></span>
                        {item.dueDate && (
                          <span className={getDaysUntilDue(item.dueDate) < 0 ? 'text-red-600' : getDaysUntilDue(item.dueDate) <= 30 ? 'text-orange-600' : ''}>
                            Due: {item.dueDate.toLocaleDateString()}
                            {getDaysUntilDue(item.dueDate) < 0 && ' (Overdue)'}
                            {getDaysUntilDue(item.dueDate) >= 0 && getDaysUntilDue(item.dueDate) <= 30 && ` (${getDaysUntilDue(item.dueDate)} days)`}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Update
                      </Button>
                    </div>
                  </div>
                  
                  {/* Evidence and Gaps */}
                  {(item.evidence.length > 0 || item.gaps.length > 0) && (
                    <div className="border-t pt-3 mt-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {item.evidence.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              Evidence ({item.evidence.length})
                            </h5>
                            <div className="space-y-1">
                              {item.evidence.slice(0, 2).map(evidence => (
                                <div key={evidence.id} className="text-xs p-2 bg-gray-50 rounded flex items-center justify-between">
                                  <span>{evidence.description}</span>
                                  <Badge variant={evidence.verificationStatus === 'verified' ? 'default' : 'outline'} className="text-xs">
                                    {evidence.verificationStatus}
                                  </Badge>
                                </div>
                              ))}
                              {item.evidence.length > 2 && (
                                <div className="text-xs text-gray-500">+{item.evidence.length - 2} more items</div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {item.gaps.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3 text-red-600" />
                              Gaps ({item.gaps.length})
                            </h5>
                            <div className="space-y-1">
                              {item.gaps.slice(0, 2).map(gap => (
                                <div key={gap.id} className="text-xs p-2 bg-red-50 rounded">
                                  <div className="font-medium text-red-800">{gap.description}</div>
                                  <div className="text-red-600 mt-1">{gap.recommendation}</div>
                                </div>
                              ))}
                              {item.gaps.length > 2 && (
                                <div className="text-xs text-gray-500">+{item.gaps.length - 2} more gaps</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="space-y-4">
              {complianceAlerts.map(alert => (
                <Card key={alert.id} className={`p-4 ${alert.acknowledged ? 'opacity-60' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type, alert.severity)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{alert.title}</h4>
                          <Badge variant={alert.severity === 'critical' ? 'destructive' : alert.severity === 'warning' ? 'secondary' : 'outline'}>
                            {alert.severity}
                          </Badge>
                          <Badge variant="outline">
                            {alert.type.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                        <div className="text-sm font-medium text-blue-600 mb-2">
                          Action Required: {alert.actionRequired}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Created: {alert.createdAt.toLocaleDateString()}</span>
                          {alert.deadline && (
                            <span>Deadline: {alert.deadline.toLocaleDateString()}</span>
                          )}
                          {alert.acknowledged && (
                            <span className="text-green-600">Acknowledged</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!alert.acknowledged && (
                        <Button variant="outline" size="sm" onClick={() => acknowledgeAlert(alert.id)}>
                          Acknowledge
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="remediation" className="space-y-6">
            <div className="space-y-4">
              {complianceItems.filter(item => item.remediationPlan).map(item => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{item.requirement}</h4>
                      <p className="text-sm text-gray-600">{item.remediationPlan?.description}</p>
                    </div>
                    <Badge variant={item.remediationPlan?.status === 'completed' ? 'default' : 'outline'}>
                      {item.remediationPlan?.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium mb-2">Plan Details</h5>
                      <div className="space-y-1 text-sm">
                        <div>Timeline: {item.remediationPlan?.timeline}</div>
                        <div>Budget: ${item.remediationPlan?.budget.toLocaleString()}</div>
                        <div>Owner: {item.remediationPlan?.responsibleParty}</div>
                        <div>Expected Completion: {item.remediationPlan?.expectedCompletion.toLocaleDateString()}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium mb-2">Actions ({item.remediationPlan?.actions.length})</h5>
                      <div className="space-y-2">
                        {item.remediationPlan?.actions.slice(0, 3).map(action => (
                          <div key={action.id} className="text-sm p-2 bg-gray-50 rounded">
                            <div className="flex justify-between items-center">
                              <span>{action.action}</span>
                              <Badge variant={action.status === 'completed' ? 'default' : 'outline'} className="text-xs">
                                {action.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              Due: {action.deadline.toLocaleDateString()} | Assignee: {action.assignee}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                Audit trail functionality shows the complete history of compliance changes, 
                updates, and actions taken. This includes timestamps, responsible parties, 
                and detailed change logs for compliance accountability and reporting.
              </AlertDescription>
            </Alert>
            
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">GHG Emissions Report Submitted</div>
                    <div className="text-xs text-gray-600">SASB compliance updated to 'Compliant'</div>
                  </div>
                  <div className="text-xs text-gray-500">2 hours ago</div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                  <Edit className="h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Energy Monitoring System Updated</div>
                    <div className="text-xs text-gray-600">GRI energy consumption requirement progress updated</div>
                  </div>
                  <div className="text-xs text-gray-500">1 day ago</div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Climate Risk Assessment Gap Identified</div>
                    <div className="text-xs text-gray-600">TCFD requirement marked as non-compliant</div>
                  </div>
                  <div className="text-xs text-gray-500">3 days ago</div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ESGComplianceTracker;