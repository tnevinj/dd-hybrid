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
  metadata?: {
    value?: string;
    progress?: number;
    team?: string[];
  };
}

interface ContextPanelProps {
  project?: Project;
  projectType: 'dashboard' | 'portfolio' | 'due-diligence' | 'workspace' | 'deal-screening';
  className?: string;
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

const mockMetrics: Record<string, ProjectMetrics> = {
  '1': {
    financial: {
      currentValue: '$50M',
      targetValue: '$75M',
      irr: '18.5%',
      multiple: '2.3x'
    },
    timeline: {
      startDate: '2024-01-15',
      targetClose: '2024-08-30',
      daysPending: 45
    },
    team: {
      lead: 'Sarah Chen',
      members: ['Mike Johnson', 'Lisa Wang', 'David Brown'],
      lastUpdate: '2 hours ago'
    },
    risks: {
      level: 'medium',
      items: ['Market volatility', 'Regulatory changes', 'Competition']
    },
    documents: {
      total: 156,
      pending: 23,
      completed: 133
    }
  }
};

export function ContextPanel({ project, projectType, className = '' }: ContextPanelProps) {
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

  const metrics = mockMetrics[project.id] || mockMetrics['1'];

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

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start text-xs">
              <BarChart3 className="w-3 h-3 mr-2" />
              Generate Report
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