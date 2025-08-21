'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, Building2, MessageSquare, Calendar, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, Clock, BarChart3, PieChart, Activity,
  Phone, Mail, Video, Heart, Target, Brain, Zap, Shield, Globe,
  DollarSign, Award, Star, ArrowUpRight, ArrowDownRight, Search,
  Filter, Plus, Edit, Eye, Send, Bell, Settings, LineChart,
  UserPlus, Handshake, ThumbsUp, AlertCircle, Lightbulb
} from 'lucide-react';

import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import type { 
  LPOrganization, LPContact, Communication, Meeting, Task,
  RelationshipStatus, RelationshipTier, NavigationMode
} from '@/types/lpgp-relationship';

import {
  IntelligentInsight, Priority, DataQualityIndicator, RiskLevel
} from '@/types/shared-intelligence';

import { dataSyncService } from '@/lib/data-sync-service';
import { formatCurrency, formatDate } from '@/lib/utils';

// Enhanced interfaces for relationship intelligence
interface RelationshipIntelligence {
  relationshipHealth: RelationshipHealthScore;
  commitmentProbability: CommitmentPrediction;
  engagementAnalytics: EngagementAnalytics;
  communicationInsights: CommunicationInsights;
  riskAssessment: RelationshipRiskAssessment;
  opportunities: RelationshipOpportunity[];
  benchmarkComparison: RelationshipBenchmark;
}

interface RelationshipHealthScore {
  overallScore: number; // 0-100
  components: {
    communication: number;
    engagement: number;
    satisfaction: number;
    commitment: number;
    trust: number;
  };
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  factors: HealthFactor[];
  recommendations: HealthRecommendation[];
}

interface CommitmentPrediction {
  nextFundProbability: number; // 0-1
  projectedCommitment: {
    low: number;
    expected: number;
    high: number;
  };
  timeframe: string;
  confidence: number;
  influencingFactors: CommitmentFactor[];
  competitiveThreats: CompetitiveRisk[];
}

interface EngagementAnalytics {
  engagementScore: number; // 0-100
  frequency: {
    meetings: number; // per quarter
    communications: number; // per month
    events: number; // per year
  };
  responseRate: number; // 0-1
  initiationRate: number; // 0-1 (how often LP initiates contact)
  preferredChannels: ChannelPreference[];
  optimalTiming: TimingInsights;
}

interface CommunicationInsights {
  sentimentAnalysis: {
    overall: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
    trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
    score: number; // -1 to 1
  };
  topics: TopicAnalysis[];
  concerns: string[];
  interests: string[];
  communicationGaps: CommunicationGap[];
}

interface RelationshipRiskAssessment {
  overallRisk: RiskLevel;
  riskFactors: RelationshipRiskFactor[];
  earlyWarningSignals: WarningSignal[];
  mitigation: RiskMitigation[];
  competitorActivity: CompetitorActivity[];
}

interface RelationshipOpportunity {
  type: 'COMMITMENT_INCREASE' | 'REFERRAL' | 'CO_INVESTMENT' | 'ADVISORY' | 'CROSS_SELL';
  description: string;
  potentialValue: number;
  probability: number;
  timeframe: string;
  requiredActions: string[];
  owner: string;
  priority: Priority;
}

interface RelationshipBenchmark {
  industry: {
    healthScore: number;
    engagementFreq: number;
    commitmentGrowth: number;
    retentionRate: number;
  };
  peers: {
    healthScore: number;
    engagementFreq: number;
    commitmentGrowth: number;
    retentionRate: number;
  };
  percentileRank: number;
}

// Supporting interfaces
interface HealthFactor {
  factor: string;
  impact: number; // -1 to 1
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  description: string;
}

interface HealthRecommendation {
  area: string;
  recommendation: string;
  priority: Priority;
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  timeline: string;
}

interface CommitmentFactor {
  factor: string;
  weight: number; // 0-1
  currentValue: number;
  historicalTrend: 'POSITIVE' | 'NEGATIVE' | 'STABLE';
  description: string;
}

interface CompetitiveRisk {
  competitor: string;
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
  mitigation: string;
}

interface ChannelPreference {
  channel: 'EMAIL' | 'PHONE' | 'VIDEO' | 'MEETING' | 'EVENT';
  preference: number; // 0-1
  effectiveness: number; // 0-1
  usage: number; // frequency
}

interface TimingInsights {
  bestDayOfWeek: string;
  bestTimeOfDay: string;
  seasonalPatterns: string[];
  avoidDates: string[];
}

interface TopicAnalysis {
  topic: string;
  frequency: number;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  importance: number; // 0-1
  trend: 'INCREASING' | 'STABLE' | 'DECREASING';
}

interface CommunicationGap {
  area: string;
  lastContact: Date;
  recommendedFrequency: string;
  gapSeverity: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface RelationshipRiskFactor {
  factor: string;
  risk: RiskLevel;
  probability: number; // 0-1
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
  indicators: string[];
}

interface WarningSignal {
  signal: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  detected: Date;
  description: string;
  suggestedAction: string;
}

interface RiskMitigation {
  risk: string;
  mitigation: string;
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
  effectiveness: number; // 0-1
  timeline: string;
}

interface CompetitorActivity {
  competitor: string;
  activity: string;
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  date: Date;
  source: string;
  confidence: number; // 0-1
}

interface EnhancedLPGPDashboardProps {
  navigationMode?: NavigationMode;
  onModeChange?: (mode: NavigationMode) => void;
}

export function EnhancedLPGPDashboard({ 
  navigationMode = 'traditional', 
  onModeChange 
}: EnhancedLPGPDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLP, setSelectedLP] = useState<string>('');
  const [lpOrganizations, setLPOrganizations] = useState<LPOrganization[]>([]);
  const [contacts, setContacts] = useState<LPContact[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dataQuality, setDataQuality] = useState<DataQualityIndicator | null>(null);
  const [insights, setInsights] = useState<IntelligentInsight[]>([]);
  const [relationshipIntelligence, setRelationshipIntelligence] = useState<RelationshipIntelligence | null>(null);

  useEffect(() => {
    loadLPGPData();
    initializeDataSync();
  }, []);

  const initializeDataSync = () => {
    dataSyncService.subscribe({
      id: 'lpgp-dashboard',
      subscriberModule: 'LPGPRelationship',
      entityTypes: ['LP_ORGANIZATION', 'CONTACT'],
      eventTypes: ['UPDATE', 'CREATE'],
      callback: handleDataUpdate
    });
  };

  const handleDataUpdate = async (event: any) => {
    if (event.entityType === 'LP_ORGANIZATION' && event.entityId === selectedLP) {
      await loadLPGPData();
      await loadRelationshipIntelligence();
    }
  };

  const loadLPGPData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/lpgp-relationship?type=enhanced&mode=' + navigationMode);
      const result = await response.json();
      
      if (result.success && result.data) {
        setLPOrganizations(result.data.lpOrganizations);
        setContacts(result.data.contacts);
        setCommunications(result.data.communications);
        setMeetings(result.data.meetings);
        setTasks(result.data.tasks);
        setDataQuality(result.data.dataQuality);
        
        if (result.data.lpOrganizations.length > 0 && !selectedLP) {
          setSelectedLP(result.data.lpOrganizations[0].id);
        }
        
        // Load AI insights for assisted and autonomous modes
        if (navigationMode !== 'traditional') {
          setInsights(result.data.insights || []);
        }
      }
    } catch (error) {
      console.error('Failed to load LP/GP relationship data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRelationshipIntelligence = async () => {
    if (!selectedLP) return;
    
    try {
      const response = await fetch(`/api/lpgp-relationship/${selectedLP}/intelligence`);
      const result = await response.json();
      
      if (result.success) {
        setRelationshipIntelligence(result.data);
      }
    } catch (error) {
      console.error('Failed to load relationship intelligence:', error);
    }
  };

  useEffect(() => {
    if (selectedLP) {
      loadRelationshipIntelligence();
    }
  }, [selectedLP]);

  const currentLP = lpOrganizations.find(lp => lp.id === selectedLP);
  const currentContacts = contacts.filter(c => c.lpOrganizationId === selectedLP);

  const renderRelationshipHealthDashboard = () => {
    if (!relationshipIntelligence || navigationMode === 'traditional') return null;

    const health = relationshipIntelligence.relationshipHealth;
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Relationship Health Score
            <Badge variant={
              health.overallScore >= 80 ? 'default' :
              health.overallScore >= 60 ? 'secondary' :
              'destructive'
            }>
              {health.overallScore}/100
            </Badge>
            <Badge variant="outline" className="text-xs">
              {health.trend === 'IMPROVING' && <TrendingUp className="h-3 w-3 mr-1 text-green-600" />}
              {health.trend === 'DECLINING' && <TrendingDown className="h-3 w-3 mr-1 text-red-600" />}
              {health.trend}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Health Components */}
            <div>
              <h4 className="font-semibold mb-4">Health Components</h4>
              <div className="space-y-3">
                {Object.entries(health.components).map(([component, score]) => (
                  <div key={component} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{component}:</span>
                    <div className="flex items-center gap-2 flex-1 max-w-32">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            score >= 80 ? 'bg-green-500' :
                            score >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-8">{score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Factors and Recommendations */}
            <div>
              <h4 className="font-semibold mb-4">Key Recommendations</h4>
              <div className="space-y-3">
                {health.recommendations.slice(0, 3).map((rec, index) => (
                  <div key={index} className="p-3 border rounded-lg bg-blue-50">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-sm text-blue-800">{rec.area}</h5>
                      <Badge variant={rec.priority === 'HIGH' ? 'destructive' : 'outline'} className="text-xs">
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-blue-700">{rec.recommendation}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-blue-600">
                      <span>Effort: {rec.effort}</span>
                      <span>Impact: {rec.impact}</span>
                      <span>Timeline: {rec.timeline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCommitmentPrediction = () => {
    if (!relationshipIntelligence || navigationMode === 'traditional') return null;

    const commitment = relationshipIntelligence.commitmentProbability;
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Commitment Prediction
            <Badge variant="outline">
              {Math.round(commitment.nextFundProbability * 100)}% Probability
            </Badge>
            <Badge variant="outline" className="text-xs">
              {Math.round(commitment.confidence * 100)}% Confidence
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Commitment Projections */}
            <div>
              <h4 className="font-semibold mb-3">Projected Commitment</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Conservative:</span>
                  <span className="font-medium">{formatCurrency(commitment.projectedCommitment.low)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Expected:</span>
                  <span className="font-medium text-blue-600">{formatCurrency(commitment.projectedCommitment.expected)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Optimistic:</span>
                  <span className="font-medium">{formatCurrency(commitment.projectedCommitment.high)}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Timeframe:</span>
                    <span className="font-medium">{commitment.timeframe}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Influencing Factors */}
            <div>
              <h4 className="font-semibold mb-3">Key Factors</h4>
              <div className="space-y-2">
                {commitment.influencingFactors.slice(0, 4).map((factor, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{factor.factor}:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${factor.weight * 100}%` }}
                        ></div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {factor.historicalTrend}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitive Threats */}
            <div>
              <h4 className="font-semibold mb-3">Competitive Risks</h4>
              <div className="space-y-3">
                {commitment.competitiveThreats.map((threat, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{threat.competitor}</span>
                      <Badge variant={
                        threat.threatLevel === 'HIGH' ? 'destructive' :
                        threat.threatLevel === 'MEDIUM' ? 'secondary' :
                        'outline'
                      }>
                        {threat.threatLevel}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{threat.description}</p>
                    <p className="text-xs text-blue-600"><strong>Mitigation:</strong> {threat.mitigation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderEngagementAnalytics = () => {
    if (!relationshipIntelligence || navigationMode === 'traditional') return null;

    const engagement = relationshipIntelligence.engagementAnalytics;
    
    // Sample engagement data for chart
    const engagementData = [
      { month: 'Jan', meetings: 3, emails: 12, calls: 5, score: 78 },
      { month: 'Feb', meetings: 2, emails: 15, calls: 8, score: 82 },
      { month: 'Mar', meetings: 4, emails: 18, calls: 6, score: 85 },
      { month: 'Apr', meetings: 5, emails: 14, calls: 7, score: 88 },
      { month: 'May', meetings: 3, emails: 16, calls: 9, score: 84 },
      { month: 'Jun', meetings: 6, emails: 20, calls: 4, score: 92 }
    ];

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Engagement Analytics
            <Badge variant="outline">{engagement.engagementScore}/100</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Engagement Trends */}
            <div>
              <h4 className="font-semibold mb-3">Engagement Trends</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#8884d8" name="Score" />
                  <Line type="monotone" dataKey="meetings" stroke="#82ca9d" name="Meetings" />
                  <Line type="monotone" dataKey="emails" stroke="#ffc658" name="Emails" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Engagement Metrics */}
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Communication Frequency</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Meetings/Quarter:</span>
                    <span className="font-medium">{engagement.frequency.meetings}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Communications/Month:</span>
                    <span className="font-medium">{engagement.frequency.communications}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Events/Year:</span>
                    <span className="font-medium">{engagement.frequency.events}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Response Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Response Rate:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={engagement.responseRate * 100} className="w-16 h-2" />
                      <span className="font-medium">{Math.round(engagement.responseRate * 100)}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Initiation Rate:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={engagement.initiationRate * 100} className="w-16 h-2" />
                      <span className="font-medium">{Math.round(engagement.initiationRate * 100)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Preferred Channels</h4>
                <div className="space-y-2">
                  {engagement.preferredChannels.slice(0, 4).map((channel, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm flex items-center gap-2">
                        {channel.channel === 'EMAIL' && <Mail className="h-3 w-3" />}
                        {channel.channel === 'PHONE' && <Phone className="h-3 w-3" />}
                        {channel.channel === 'VIDEO' && <Video className="h-3 w-3" />}
                        {channel.channel === 'MEETING' && <Users className="h-3 w-3" />}
                        {channel.channel}
                      </span>
                      <div className="flex items-center gap-2">
                        <Progress value={channel.preference * 100} className="w-12 h-2" />
                        <span className="text-xs">{Math.round(channel.effectiveness * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCommunicationInsights = () => {
    if (!relationshipIntelligence || navigationMode === 'traditional') return null;

    const comms = relationshipIntelligence.communicationInsights;
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Communication Insights
            <Badge variant={
              comms.sentimentAnalysis.overall === 'POSITIVE' ? 'default' :
              comms.sentimentAnalysis.overall === 'NEUTRAL' ? 'secondary' :
              'destructive'
            }>
              {comms.sentimentAnalysis.overall}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {comms.sentimentAnalysis.trend === 'IMPROVING' && <TrendingUp className="h-3 w-3 mr-1 text-green-600" />}
              {comms.sentimentAnalysis.trend === 'DECLINING' && <TrendingDown className="h-3 w-3 mr-1 text-red-600" />}
              {comms.sentimentAnalysis.trend}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Topic Analysis */}
            <div>
              <h4 className="font-semibold mb-3">Discussion Topics</h4>
              <div className="space-y-2">
                {comms.topics.slice(0, 5).map((topic, index) => (
                  <div key={index} className="p-2 border rounded">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{topic.topic}</span>
                      <Badge variant={
                        topic.sentiment === 'POSITIVE' ? 'default' :
                        topic.sentiment === 'NEUTRAL' ? 'secondary' :
                        'destructive'
                      } className="text-xs">
                        {topic.sentiment}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span>Freq: {topic.frequency}</span>
                      <span>Impact: {Math.round(topic.importance * 100)}%</span>
                      <span>{topic.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Concerns and Interests */}
            <div>
              <div className="mb-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Key Concerns
                </h4>
                <div className="space-y-2">
                  {comms.concerns.slice(0, 4).map((concern, index) => (
                    <div key={index} className="p-2 border rounded bg-orange-50 border-orange-200">
                      <span className="text-sm text-orange-800">{concern}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Star className="h-4 w-4 text-green-500" />
                  Interests
                </h4>
                <div className="space-y-2">
                  {comms.interests.slice(0, 4).map((interest, index) => (
                    <div key={index} className="p-2 border rounded bg-green-50 border-green-200">
                      <span className="text-sm text-green-800">{interest}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Communication Gaps */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Communication Gaps
              </h4>
              <div className="space-y-3">
                {comms.communicationGaps.map((gap, index) => (
                  <div key={index} className={`p-3 border rounded ${
                    gap.gapSeverity === 'HIGH' ? 'bg-red-50 border-red-200' :
                    gap.gapSeverity === 'MEDIUM' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{gap.area}</span>
                      <Badge variant={
                        gap.gapSeverity === 'HIGH' ? 'destructive' :
                        gap.gapSeverity === 'MEDIUM' ? 'secondary' :
                        'outline'
                      } className="text-xs">
                        {gap.gapSeverity}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">
                      Last contact: {formatDate(gap.lastContact.toString())}
                    </p>
                    <p className="text-xs text-gray-600">
                      Recommended: {gap.recommendedFrequency}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderRelationshipRisk = () => {
    if (!relationshipIntelligence || navigationMode === 'traditional') return null;

    const risk = relationshipIntelligence.riskAssessment;
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Relationship Risk Assessment
            <Badge variant={
              risk.overallRisk === RiskLevel.LOW || risk.overallRisk === RiskLevel.VERY_LOW ? 'default' :
              risk.overallRisk === RiskLevel.MEDIUM ? 'secondary' :
              'destructive'
            }>
              {risk.overallRisk}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Factors */}
            <div>
              <h4 className="font-semibold mb-3">Risk Factors</h4>
              <div className="space-y-3">
                {risk.riskFactors.slice(0, 4).map((factor, index) => (
                  <div key={index} className="p-3 border rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{factor.factor}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          factor.risk === RiskLevel.LOW || factor.risk === RiskLevel.VERY_LOW ? 'default' :
                          factor.risk === RiskLevel.MEDIUM ? 'secondary' :
                          'destructive'
                        } className="text-xs">
                          {factor.risk}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(factor.probability * 100)}%
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{factor.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {factor.indicators.slice(0, 2).map((indicator, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">{indicator}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Warning Signals and Mitigation */}
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Early Warning Signals
                </h4>
                <div className="space-y-2">
                  {risk.earlyWarningSignals.map((signal, index) => (
                    <Alert key={index} className={
                      signal.severity === 'CRITICAL' ? 'border-red-200 bg-red-50' :
                      signal.severity === 'HIGH' ? 'border-orange-200 bg-orange-50' :
                      'border-yellow-200 bg-yellow-50'
                    }>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle className="text-sm">{signal.signal}</AlertTitle>
                      <AlertDescription className="text-xs">
                        <p>{signal.description}</p>
                        <p className="mt-1"><strong>Action:</strong> {signal.suggestedAction}</p>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Mitigation Strategies</h4>
                <div className="space-y-3">
                  {risk.mitigation.slice(0, 3).map((mitigation, index) => (
                    <div key={index} className="p-3 border rounded bg-green-50">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-sm text-green-800">{mitigation.risk}</h5>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(mitigation.effectiveness * 100)}% effective
                        </Badge>
                      </div>
                      <p className="text-xs text-green-700 mb-2">{mitigation.mitigation}</p>
                      <div className="flex items-center gap-4 text-xs text-green-600">
                        <span>Effort: {mitigation.effort}</span>
                        <span>Timeline: {mitigation.timeline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderOpportunities = () => {
    if (!relationshipIntelligence || navigationMode === 'traditional') return null;

    const opportunities = relationshipIntelligence.opportunities;
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Growth Opportunities
            <Badge variant="outline">{opportunities.length} identified</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opportunities.map((opp, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-sm">{opp.type.replace(/_/g, ' ')}</h4>
                    <p className="text-xs text-gray-600 mt-1">{opp.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={opp.priority === Priority.HIGH ? 'destructive' : 'outline'} className="text-xs">
                      {opp.priority}
                    </Badge>
                    <span className="text-xs text-blue-600">{Math.round(opp.probability * 100)}%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Potential Value:</span>
                    <span className="font-medium">{formatCurrency(opp.potentialValue)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Timeframe:</span>
                    <span className="font-medium">{opp.timeframe}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Owner:</span>
                    <span className="font-medium">{opp.owner}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-xs text-gray-600 mb-2">Required Actions:</p>
                  <div className="flex flex-wrap gap-1">
                    {opp.requiredActions.slice(0, 2).map((action, idx) => (
                      <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{action}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const calculateAggregateMetrics = () => {
    const totalLPs = lpOrganizations.length;
    const activeLPs = lpOrganizations.filter(lp => lp.relationshipStatus === RelationshipStatus.ACTIVE_LP).length;
    const totalCommitments = lpOrganizations.reduce((sum, lp) => sum + lp.totalCommitments, 0);
    const totalContacts = contacts.length;
    const pendingTasks = tasks.filter(task => task.status === 'PENDING' || task.status === 'IN_PROGRESS').length;

    return {
      totalLPs,
      activeLPs,
      totalCommitments,
      totalContacts,
      pendingTasks,
      upcomingMeetings: meetings.filter(m => new Date(m.scheduledStart) > new Date()).length,
      overdueFollowUps: tasks.filter(task => task.dueDate && new Date(task.dueDate) < new Date()).length
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const aggregateMetrics = calculateAggregateMetrics();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enhanced LP/GP Relationships</h1>
          <p className="text-gray-600">
            AI-powered relationship intelligence with predictive commitment analytics
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Navigation Mode Switcher */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['traditional', 'assisted', 'autonomous'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => onModeChange?.(mode)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  navigationMode === mode
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
                {mode !== 'traditional' && <Brain className="ml-1 h-3 w-3 inline" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total LPs</p>
                <p className="text-2xl font-bold text-gray-900">{aggregateMetrics.totalLPs}</p>
                <p className="text-sm text-gray-600">{aggregateMetrics.activeLPs} active</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Commitments</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(aggregateMetrics.totalCommitments)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Contacts</p>
                <p className="text-2xl font-bold text-gray-900">{aggregateMetrics.totalContacts}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{aggregateMetrics.pendingTasks}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* LP Selector */}
      <div className="flex items-center gap-4">
        <Select value={selectedLP} onValueChange={setSelectedLP}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select LP Organization" />
          </SelectTrigger>
          <SelectContent>
            {lpOrganizations.map(lp => (
              <SelectItem key={lp.id} value={lp.id}>{lp.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Intelligence Dashboards */}
      {selectedLP && (
        <div className="space-y-6">
          {renderRelationshipHealthDashboard()}
          {renderCommitmentPrediction()}
          {renderEngagementAnalytics()}
          {renderCommunicationInsights()}
          {renderRelationshipRisk()}
          {renderOpportunities()}
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Overview content would go here */}
        </TabsContent>

        {/* Other tab contents would be enhanced versions of existing components */}
      </Tabs>
    </div>
  );
}