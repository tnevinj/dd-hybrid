'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Users, Building2, Calendar, CheckSquare, TrendingUp, AlertCircle,
  Phone, Mail, MapPin, DollarSign, Clock, Target, Briefcase, Star,
  Search, Filter, Plus, Eye, Edit, MessageSquare, Video, FileText,
  Bell, RotateCcw, Settings, ArrowUp, ArrowDown, Minus, Activity
} from 'lucide-react';

import {
  NavigationMode,
  LPGPRelationshipResponse,
  LPOrganization,
  LPContact,
  RelationshipSummary,
  RecentActivity,
  UpcomingActivity,
  FundraisingOpportunity,
  Communication,
  Meeting,
  Task,
  LPGPRelationshipStats,
  HybridModeContent,
  OrganizationType,
  RelationshipStatus,
  RelationshipTier,
  Priority,
  TaskStatus
} from '@/types/lpgp-relationship';

interface LPGPRelationshipDashboardProps {
  navigationMode: NavigationMode;
  onModeChange: (mode: NavigationMode) => void;
}

export function LPGPRelationshipDashboard({ navigationMode, onModeChange }: LPGPRelationshipDashboardProps) {
  const [data, setData] = useState<LPGPRelationshipResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const hybridContent: HybridModeContent = {
    traditional: {
      showAllContacts: true,
      enableManualScheduling: true,
      showDetailedReports: true,
      manualTaskAssignment: true,
    },
    assisted: {
      showRecommendedActions: true,
      smartScheduling: true,
      automatedReminders: true,
      relationshipInsights: true,
    },
    autonomous: {
      autoTaskCreation: true,
      intelligentScheduling: true,
      predictiveAnalytics: true,
      autoReportGeneration: true,
      adaptiveEngagement: true,
    },
  };

  useEffect(() => {
    fetchLPGPData();
  }, [navigationMode]);

  const fetchLPGPData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/lpgp-relationship');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching LPGP relationship data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRelationshipTierColor = (tier: RelationshipTier): string => {
    switch (tier) {
      case 'TIER_1': return 'bg-green-100 text-green-800';
      case 'TIER_2': return 'bg-blue-100 text-blue-800';
      case 'TIER_3': return 'bg-yellow-100 text-yellow-800';
      case 'PROSPECT': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRelationshipStatusColor = (status: RelationshipStatus): string => {
    switch (status) {
      case 'ACTIVE_LP': return 'default';
      case 'PROSPECT': return 'secondary';
      case 'FORMER_LP': return 'outline';
      case 'DECLINED': return 'destructive';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: Priority): string => {
    switch (priority) {
      case 'URGENT': return 'destructive';
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'default';
      case 'LOW': return 'secondary';
      default: return 'outline';
    }
  };

  const getHealthStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (date: Date | string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (date: Date | string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDaysUntil = (date: Date | string): number => {
    const now = new Date();
    const target = new Date(date);
    const diffTime = target.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (change < 0) return <ArrowDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  if (loading && !data) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load LPGP relationship data.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const renderModeSelector = () => (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Navigation Mode:</label>
        <Select value={navigationMode} onValueChange={onModeChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="traditional">Traditional</SelectItem>
            <SelectItem value="assisted">Assisted</SelectItem>
            <SelectItem value="autonomous">Autonomous</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={fetchLPGPData}
        disabled={loading}
      >
        <RotateCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active LPs</p>
              <p className="text-2xl font-bold">{data.stats.activeLPs}</p>
              <p className="text-xs text-muted-foreground">of {data.stats.totalLPs} total</p>
            </div>
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Commitments</p>
              <p className="text-2xl font-bold">{formatCurrency(data.stats.totalCommitments)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Upcoming Meetings</p>
              <p className="text-2xl font-bold">{data.stats.upcomingMeetings}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Tasks</p>
              <p className="text-2xl font-bold">{data.stats.pendingTasks}</p>
              {data.stats.overdueFollowUps > 0 && (
                <p className="text-xs text-red-600">{data.stats.overdueFollowUps} overdue</p>
              )}
            </div>
            <CheckSquare className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRelationshipSummaries = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Key Relationships
          {navigationMode === 'assisted' && (
            <Badge variant="outline">Insights Enabled</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.relationshipSummaries.slice(0, 6).map((summary) => (
            <div key={summary.lpOrganization.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold">{summary.lpOrganization.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {summary.lpOrganization.organizationType.replace('_', ' ')} • {summary.lpOrganization.headquarters}
                  </p>
                  {summary.primaryContact && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Primary: {summary.primaryContact.firstName} {summary.primaryContact.lastName}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getRelationshipTierColor(summary.lpOrganization.relationshipTier)}>
                    {summary.lpOrganization.relationshipTier.replace('_', ' ')}
                  </Badge>
                  <Badge variant={getRelationshipStatusColor(summary.lpOrganization.relationshipStatus)}>
                    {summary.lpOrganization.relationshipStatus.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Commitments:</span>
                  <span className="ml-1 font-medium">{formatCurrency(summary.lpOrganization.totalCommitments)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Health:</span>
                  <span className={`ml-1 font-medium ${getHealthStatusColor(summary.healthStatus)}`}>
                    {summary.healthStatus}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Score:</span>
                  <div className="flex items-center gap-1 mt-1">
                    <Progress value={summary.relationshipScore} className="flex-1 h-2" />
                    <span className="text-xs font-medium w-8">{summary.relationshipScore}/100</span>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Next Activity:</span>
                  <span className="ml-1 font-medium text-xs">
                    {summary.nextActivity ? formatDate(summary.nextActivity) : 'None scheduled'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {summary.lastActivity && (
                    <span>Last contact: {formatDate(summary.lastActivity)}</span>
                  )}
                  <span>AUM: {formatNumber(summary.lpOrganization.aum || 0)}</span>
                  <span>Funds: {summary.lpOrganization.numberOfFunds}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Calendar className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderUpcomingActivities = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Upcoming Activities
          {navigationMode === 'autonomous' && (
            <Badge variant="outline">Auto-Scheduled</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.upcomingActivities.slice(0, 8).map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  activity.type === 'MEETING' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'TASK' ? 'bg-orange-100 text-orange-600' :
                  activity.type === 'FOLLOW_UP' ? 'bg-green-100 text-green-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {activity.type === 'MEETING' ? <Video className="h-4 w-4" /> :
                   activity.type === 'TASK' ? <CheckSquare className="h-4 w-4" /> :
                   activity.type === 'FOLLOW_UP' ? <Phone className="h-4 w-4" /> :
                   <FileText className="h-4 w-4" />}
                </div>
                <div>
                  <p className="font-medium text-sm">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.lpOrganizationName && `${activity.lpOrganizationName} • `}
                    {activity.contactName}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {formatDateTime(activity.dueDate)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={getPriorityColor(activity.priority)} className="text-xs">
                    {activity.priority}
                  </Badge>
                  <span className={`text-xs ${
                    getDaysUntil(activity.dueDate) < 0 ? 'text-red-600' :
                    getDaysUntil(activity.dueDate) === 0 ? 'text-orange-600' :
                    'text-muted-foreground'
                  }`}>
                    {getDaysUntil(activity.dueDate) < 0 ? 'Overdue' :
                     getDaysUntil(activity.dueDate) === 0 ? 'Today' :
                     `${getDaysUntil(activity.dueDate)}d`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderFundraisingOpportunities = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Fundraising Pipeline
          {navigationMode === 'assisted' && (
            <Badge variant="outline">Predictive Analytics</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.fundraisingOpportunities.slice(0, 5).map((opportunity) => (
            <div key={opportunity.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold">{opportunity.lpOrganizationName}</h4>
                  <p className="text-sm text-muted-foreground">{opportunity.contactName}</p>
                  <p className="text-sm font-medium text-blue-600">{opportunity.fundName}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{formatCurrency(opportunity.potentialCommitment)}</p>
                  <Badge className={getRelationshipTierColor(opportunity.relationshipTier)}>
                    {opportunity.relationshipTier.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Stage: {opportunity.stage}</span>
                  <span>Expected: {formatDate(opportunity.expectedClose)}</span>
                  <span>Last activity: {formatDate(opportunity.lastActivity)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground">Probability:</span>
                    <Progress value={opportunity.probability * 100} className="w-16 h-2" />
                    <span className="text-xs font-medium">{(opportunity.probability * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderRecentActivities = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.recentActivities.slice(0, 10).map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
              <div className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${
                activity.type === 'COMMUNICATION' ? 'bg-blue-600' :
                activity.type === 'MEETING' ? 'bg-green-600' :
                activity.type === 'TASK' ? 'bg-orange-600' :
                'bg-purple-600'
              }`}></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">{activity.description}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  {activity.lpOrganizationName && (
                    <span>{activity.lpOrganizationName}</span>
                  )}
                  {activity.contactName && (
                    <span>• {activity.contactName}</span>
                  )}
                  <span>• {formatDateTime(activity.timestamp)}</span>
                  {activity.priority && (
                    <Badge variant={getPriorityColor(activity.priority)} className="text-xs">
                      {activity.priority}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderLPDirectory = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            LP Directory
            {navigationMode === 'assisted' && (
              <Badge variant="outline">Smart Sorted</Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search LPs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add LP
            </Button>
          </div>
        </div>
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Organization Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENSION_FUND">Pension Fund</SelectItem>
                <SelectItem value="SOVEREIGN_WEALTH">Sovereign Wealth</SelectItem>
                <SelectItem value="ENDOWMENT">Endowment</SelectItem>
                <SelectItem value="FAMILY_OFFICE">Family Office</SelectItem>
                <SelectItem value="INSURANCE">Insurance</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Relationship Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE_LP">Active LP</SelectItem>
                <SelectItem value="PROSPECT">Prospect</SelectItem>
                <SelectItem value="FORMER_LP">Former LP</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Relationship Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TIER_1">Tier 1</SelectItem>
                <SelectItem value="TIER_2">Tier 2</SelectItem>
                <SelectItem value="TIER_3">Tier 3</SelectItem>
                <SelectItem value="PROSPECT">Prospect</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="north-america">North America</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="asia">Asia</SelectItem>
                <SelectItem value="middle-east">Middle East</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.lpOrganizations.slice(0, 12).map((lp) => (
            <div key={lp.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold">{lp.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {lp.organizationType.replace('_', ' ')} • {lp.headquarters}
                  </p>
                  {lp.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {lp.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getRelationshipTierColor(lp.relationshipTier)}>
                    {lp.relationshipTier.replace('_', ' ')}
                  </Badge>
                  <Badge variant={getRelationshipStatusColor(lp.relationshipStatus)}>
                    {lp.relationshipStatus.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                <div>
                  <span className="font-medium">AUM:</span> {formatNumber(lp.aum || 0)}
                </div>
                <div>
                  <span className="font-medium">Commitments:</span> {formatCurrency(lp.totalCommitments)}
                </div>
                <div>
                  <span className="font-medium">Funds:</span> {lp.numberOfFunds}
                </div>
                <div>
                  <span className="font-medium">Invested:</span> {formatCurrency(lp.totalInvested)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {lp.website && (
                    <a href={lp.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                      Website
                    </a>
                  )}
                  {lp.lastInvestment && (
                    <span>Last investment: {formatDate(lp.lastInvestment)}</span>
                  )}
                  <span>Created: {formatDate(lp.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Calendar className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-600" />
            LP-GP Relationship Management
          </h1>
          <p className="text-muted-foreground">
            Communication center, strategic planning, and CRM
          </p>
        </div>
        {renderModeSelector()}
      </div>

      {renderStatsCards()}

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="lps">LP Directory</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              {renderRelationshipSummaries()}
              {renderUpcomingActivities()}
            </div>
            <div className="space-y-6">
              {renderFundraisingOpportunities()}
              {renderRecentActivities()}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="lps">
          {renderLPDirectory()}
        </TabsContent>

        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Contact Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Contact Management System</h3>
                <p>Comprehensive contact management with relationship tracking and communication history would be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Communication Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Mail className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Communication Hub</h3>
                <p>Integrated communication center with email, meeting scheduling, and interaction tracking would be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                Task Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <CheckSquare className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Task Management System</h3>
                <p>Advanced task management with automated reminders, escalations, and workflow integration would be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                LP Reporting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Automated Reporting System</h3>
                <p>Comprehensive LP reporting with automated generation, customization, and distribution would be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}