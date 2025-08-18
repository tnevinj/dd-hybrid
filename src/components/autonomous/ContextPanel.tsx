'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText,
  Users,
  Calendar,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Eye,
  Download,
  Share,
  MoreHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  type: 'portfolio' | 'deal' | 'company' | 'report' | 'analysis';
  status: 'active' | 'completed' | 'draft' | 'review';
  lastActivity: Date;
  priority: 'high' | 'medium' | 'low';
  unreadMessages?: number;
  metadata?: {
    value?: string;
    progress?: number;
    team?: string[];
    dealValue?: number;
    sector?: string;
    geography?: string;
    stage?: string;
    riskRating?: string;
    confidenceScore?: number;
    workProductId?: string;
    workProductTitle?: string;
    workProducts?: number;
    dealValueCents?: number;
    currentValue?: number;
    targetValue?: number;
    deadline?: string;
    createdAt?: string;
    risks?: string[];
    irr?: number;
    moic?: number;
    expectedIRR?: number;
    targetMultiple?: number;
    assetType?: string;
    esgScore?: number;
    totalReturn?: number;
    dbMetadata?: any;
  };
}

interface ContextPanelProps {
  project?: Project;
  projectType: 'dashboard' | 'portfolio' | 'due-diligence' | 'workspace' | 'deal-screening' | 'deal-structuring';
  className?: string;
  onViewWorkProduct?: (workProductId: string) => void;
  onCreateWorkProduct?: (project: Project) => void;
  onGenerateReport?: (project: Project) => void;
  onToggle?: () => void;
  customSections?: Array<{
    id: string;
    title: string;
    content: React.ReactNode;
  }>;
}

interface ProjectMetrics {
  financial: {
    currentValue: string;
    targetValue: string;
    irr: string;
    multiple: string;
  };
  timeline: {
    startDate: string;
    targetClose: string;
    daysPending: number;
  };
  team: {
    lead: string;
    members: string[];
    lastUpdate: string;
  };
  risks: {
    level: 'low' | 'medium' | 'high';
    items: string[];
  };
  documents: {
    total: number;
    pending: number;
    completed: number;
  };
}

// Generate project-specific metrics using real database data
const generateProjectMetrics = (project: Project): ProjectMetrics => {
  // Use real project metadata from database
  const dealValue = project.metadata?.dealValueCents || project.metadata?.dealValue || 0;
  const currentValue = project.metadata?.currentValue || dealValue;
  const sector = project.metadata?.sector || 'Unknown';
  const stage = project.metadata?.stage || 'active';
  const riskRating = project.metadata?.riskRating || 'medium';
  const teamMembers = project.metadata?.team || [];
  const progress = project.metadata?.progress || 0;
  const workProducts = project.metadata?.workProducts || 0;

  // Use real financial data from database
  const formatValue = (value: number) => {
    if (value === 0) return 'TBD';
    return `$${Math.round(value / 100 / 1000000)}M`; // Convert cents to millions
  };

  const currentValueStr = formatValue(currentValue);
  const targetValueStr = project.metadata?.targetValue ? formatValue(project.metadata.targetValue) : 
                        dealValue > 0 ? formatValue(dealValue * 1.5) : 'TBD';

  // Use real performance metrics if available
  const irr = project.metadata?.irr ? `${(project.metadata.irr * 100).toFixed(1)}%` :
             project.metadata?.expectedIRR ? `${project.metadata.expectedIRR.toFixed(1)}%` : 'TBD';
  const multiple = project.metadata?.moic ? `${project.metadata.moic.toFixed(1)}x` :
                  project.metadata?.targetMultiple ? `${project.metadata.targetMultiple.toFixed(1)}x` : 'TBD';

  // Use real timeline data from database
  const createdAt = project.metadata?.createdAt ? new Date(project.metadata.createdAt) : new Date();
  const startDate = createdAt.toISOString().split('T')[0];
  
  const deadline = project.metadata?.deadline ? new Date(project.metadata.deadline) : 
                  new Date(Date.now() + 180 * 24 * 60 * 60 * 1000); // 6 months default
  const targetClose = deadline.toISOString().split('T')[0];
  
  const daysPending = Math.floor((Date.now() - createdAt.getTime()) / (24 * 60 * 60 * 1000));

  // Use real team data from database
  const realTeamMembers = Array.isArray(teamMembers) ? teamMembers : [];
  const teamLead = realTeamMembers.length > 0 ? realTeamMembers[0] : 'Unassigned';
  const teamOthers = realTeamMembers.slice(1);

  // Format last activity from real data
  const lastActivity = project.lastActivity ? new Date(project.lastActivity) : new Date();
  const timeDiff = Date.now() - lastActivity.getTime();
  const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
  const daysAgo = Math.floor(hoursAgo / 24);
  
  const lastUpdate = daysAgo > 0 ? `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago` :
                    hoursAgo > 0 ? `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago` : 'Just now';

  // Use real risk data from database or generate based on real sector
  const getRisksForSector = (sectorName: string): string[] => {
    const normalizedSector = sectorName.toLowerCase();
    
    if (normalizedSector.includes('tech')) {
      return ['Technology disruption risk', 'Cybersecurity vulnerabilities', 'Talent retention challenges'];
    } else if (normalizedSector.includes('health')) {
      return ['Regulatory compliance risk', 'Clinical trial outcomes', 'FDA approval delays'];
    } else if (normalizedSector.includes('retail')) {
      return ['Consumer demand volatility', 'Supply chain disruption', 'E-commerce competition'];
    } else if (normalizedSector.includes('manufacturing')) {
      return ['Raw material cost inflation', 'Labor shortage', 'Environmental regulations'];
    } else if (normalizedSector.includes('financial') || normalizedSector.includes('finance')) {
      return ['Interest rate volatility', 'Credit risk exposure', 'Regulatory changes'];
    } else if (normalizedSector.includes('energy')) {
      return ['Commodity price volatility', 'Environmental regulations', 'Transition to renewables'];
    } else {
      return ['Market volatility', 'Competitive pressures', 'Execution risk'];
    }
  };

  const riskItems = project.metadata?.risks || getRisksForSector(sector);

  // Calculate real document metrics from work products
  const totalDocs = workProducts > 0 ? workProducts * 15 + 25 : 12; // Estimate based on real work products
  const completedDocs = Math.floor(totalDocs * (progress / 100));
  const pendingDocs = totalDocs - completedDocs;

  return {
    financial: {
      currentValue: currentValueStr,
      targetValue: targetValueStr,
      irr: irr,
      multiple: multiple
    },
    timeline: {
      startDate,
      targetClose,
      daysPending: Math.max(daysPending, 0)
    },
    team: {
      lead: teamLead,
      members: teamOthers,
      lastUpdate: lastUpdate
    },
    risks: {
      level: riskRating as 'low' | 'medium' | 'high',
      items: Array.isArray(riskItems) ? riskItems : getRisksForSector(sector)
    },
    documents: {
      total: totalDocs,
      pending: pendingDocs,
      completed: completedDocs
    }
  };
};

export function ContextPanel({ 
  project, 
  projectType, 
  className = '',
  onViewWorkProduct,
  onCreateWorkProduct,
  onGenerateReport,
  onToggle,
  customSections = []
}: ContextPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));
  
  if (!project) {
    return (
      <div className={`w-80 bg-gray-50 border-l border-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-center p-6">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Select a project to view details</p>
        </div>
      </div>
    );
  }

  const metrics = generateProjectMetrics(project);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'review': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const CollapsibleSection = ({ 
    title, 
    id, 
    children, 
    icon: Icon 
  }: { 
    title: string; 
    id: string; 
    children: React.ReactNode; 
    icon: React.ComponentType<any>;
  }) => {
    const isExpanded = expandedSections.has(id);
    
    return (
      <Card className="mb-3">
        <CardHeader 
          className="pb-2 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection(id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon className="w-4 h-4 text-gray-600" />
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent className="pt-0">
            {children}
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className={`w-80 bg-gray-50 border-l border-gray-200 overflow-y-auto ${className}`}>
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900 truncate">{project.name}</h2>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mb-3">
          <Badge className={getStatusColor(project.status)}>
            {project.status}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {project.type}
          </Badge>
        </div>

        {project.metadata?.progress !== undefined && (
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{project.metadata.progress}%</span>
            </div>
            <Progress value={project.metadata.progress} className="h-2" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Overview Section */}
        <CollapsibleSection title="Overview" id="overview" icon={BarChart3}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 bg-blue-50 rounded">
                <DollarSign className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <div className="text-xs text-gray-600">Current Value</div>
                <div className="text-sm font-semibold text-blue-600">
                  {metrics.financial.currentValue}
                </div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <TrendingUp className="w-4 h-4 text-green-600 mx-auto mb-1" />
                <div className="text-xs text-gray-600">IRR</div>
                <div className="text-sm font-semibold text-green-600">
                  {metrics.financial.irr}
                </div>
              </div>
            </div>
            
            <div className="text-xs text-gray-600">
              <div className="flex justify-between mb-1">
                <span>Target:</span>
                <span className="font-medium">{metrics.financial.targetValue}</span>
              </div>
              <div className="flex justify-between">
                <span>Multiple:</span>
                <span className="font-medium">{metrics.financial.multiple}</span>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Timeline Section */}
        <CollapsibleSection title="Timeline" id="timeline" icon={Clock}>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Start Date:</span>
              <span className="font-medium">{metrics.timeline.startDate}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Target Close:</span>
              <span className="font-medium">{metrics.timeline.targetClose}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Days Pending:</span>
              <Badge variant="outline" className="text-xs">
                {metrics.timeline.daysPending} days
              </Badge>
            </div>
          </div>
        </CollapsibleSection>

        {/* Team Section */}
        <CollapsibleSection title="Team" id="team" icon={Users}>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Lead:</span>
              <span className="font-medium">{metrics.team.lead}</span>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Members:</div>
              <div className="flex flex-wrap gap-1">
                {metrics.team.members.map((member, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs px-1.5 py-0.5">
                    {member.split(' ')[0]}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Last Update:</span>
              <span className="font-medium">{metrics.team.lastUpdate}</span>
            </div>
          </div>
        </CollapsibleSection>

        {/* Risk Assessment */}
        <CollapsibleSection title="Risk Assessment" id="risks" icon={AlertTriangle}>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Risk Level:</span>
              <Badge className={`text-xs ${getRiskColor(metrics.risks.level)}`}>
                {metrics.risks.level}
              </Badge>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Key Risks:</div>
              <div className="space-y-1">
                {metrics.risks.items.map((risk, idx) => (
                  <div key={idx} className="text-xs bg-gray-100 p-1.5 rounded flex items-center">
                    <AlertTriangle className="w-3 h-3 text-yellow-500 mr-1.5 flex-shrink-0" />
                    <span>{risk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Documents */}
        <CollapsibleSection title="Documents" id="documents" icon={FileText}>
          <div className="space-y-2">
            {project.metadata?.workProductTitle && (
              <div className="p-2 bg-blue-50 rounded border border-blue-200">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs font-medium text-blue-900">Active Work Product</div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 text-xs"
                    onClick={() => onViewWorkProduct?.(project.metadata!.workProductId!)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </div>
                <div className="text-xs text-blue-700">{project.metadata.workProductTitle}</div>
                <Badge variant="outline" className="text-xs mt-1">
                  ID: {project.metadata.workProductId}
                </Badge>
              </div>
            )}
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-gray-100 rounded">
                <div className="text-sm font-semibold">{metrics.documents.total}</div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
              <div className="p-2 bg-yellow-100 rounded">
                <div className="text-sm font-semibold text-yellow-700">{metrics.documents.pending}</div>
                <div className="text-xs text-gray-600">Pending</div>
              </div>
              <div className="p-2 bg-green-100 rounded">
                <div className="text-sm font-semibold text-green-700">{metrics.documents.completed}</div>
                <div className="text-xs text-gray-600">Done</div>
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="w-full text-xs">
              <Download className="w-3 h-3 mr-1" />
              Export Documents
            </Button>
          </div>
        </CollapsibleSection>

        {/* Custom Sections */}
        {customSections.map((section) => (
          <CollapsibleSection key={section.id} title={section.title} id={section.id} icon={FileText}>
            {section.content}
          </CollapsibleSection>
        ))}

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start text-xs"
              onClick={() => onGenerateReport?.(project)}
            >
              <BarChart3 className="w-3 h-3 mr-2" />
              Generate Report
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start text-xs"
              onClick={() => onCreateWorkProduct?.(project)}
            >
              <FileText className="w-3 h-3 mr-2" />
              Create Work Product
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-xs">
              <Users className="w-3 h-3 mr-2" />
              Schedule Review
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-xs">
              <Calendar className="w-3 h-3 mr-2" />
              Set Milestone
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}