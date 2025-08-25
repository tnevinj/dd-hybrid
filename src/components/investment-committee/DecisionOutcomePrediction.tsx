'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Vote,
  Brain,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  BarChart3,
  Activity,
  Zap,
  Eye,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Calendar,
  FileText,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Minus
} from 'lucide-react';
import { formatCurrency, formatPercentage, formatDate } from '@/lib/utils';

interface ProposalPrediction {
  proposalId: string;
  proposalTitle: string;
  targetCompany: string;
  requestedAmount: number;
  prediction: {
    outcome: 'APPROVE' | 'REJECT' | 'DEFER';
    confidence: number;
    approvalProbability: number;
    rejectionProbability: number;
    deferralProbability: number;
  };
  votingPattern: {
    expectedVotes: {
      memberId: string;
      memberName: string;
      predictedVote: 'FOR' | 'AGAINST' | 'ABSTAIN';
      confidence: number;
      historicalAlignment: number;
    }[];
    quorumMet: boolean;
    majorityThreshold: number;
    consensusLevel: number;
  };
  riskFactors: {
    factor: string;
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
    description: string;
    mitigationSuggestion: string;
  }[];
  influencingFactors: {
    factor: string;
    weight: number;
    score: number;
    description: string;
  }[];
  timeToDecision: {
    predicted: number; // days
    confidence: number;
    driverFactors: string[];
  };
}

interface MeetingEfficiencyPrediction {
  meetingId: string;
  meetingDate: Date;
  prediction: {
    duration: number; // minutes
    confidence: number;
    attendanceRate: number;
    decisionEfficiency: number; // percentage of proposals decided
    consensusLevel: number; // 0-100
  };
  agendaOptimization: {
    recommendedOrder: string[];
    timeAllocation: { proposalId: string; minutes: number }[];
    riskProposals: string[];
    complexityScores: { proposalId: string; score: number }[];
  };
  attendancePrediction: {
    memberAttendance: {
      memberId: string;
      memberName: string;
      attendanceProbability: number;
      votingImpact: number;
    }[];
    quorumRisk: number; // 0-100
    criticalAbsences: string[];
  };
}

interface DecisionPatternAnalysis {
  memberAnalysis: {
    memberId: string;
    memberName: string;
    votingPatterns: {
      approvalRate: number;
      sectorPreferences: { sector: string; approvalRate: number }[];
      riskTolerance: number; // 0-100
      consistencyScore: number; // 0-100
      influenceScore: number; // 0-100
    };
    predictedInfluence: number;
    keyMotivators: string[];
  }[];
  committeeConsensus: {
    overallAgreement: number; // 0-100
    polarizedTopics: string[];
    unanimousDecisionProbability: number;
    fracturedVoteRisk: number;
  };
  historicalPerformance: {
    decisionAccuracy: number; // How often predictions matched actual outcomes
    timeAccuracy: number; // How close time predictions were
    modelConfidence: number;
    lastUpdated: Date;
  };
}

interface DecisionOutcomePredictionProps {
  committeeId: string;
  navigationMode?: 'traditional' | 'assisted' | 'autonomous';
}

export function DecisionOutcomePrediction({ 
  committeeId, 
  navigationMode = 'traditional' 
}: DecisionOutcomePredictionProps) {
  const [predictions, setPredictions] = useState<ProposalPrediction[]>([]);
  const [meetingPredictions, setMeetingPredictions] = useState<MeetingEfficiencyPrediction[]>([]);
  const [patternAnalysis, setPatternAnalysis] = useState<DecisionPatternAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('proposals');
  const [selectedProposal, setSelectedProposal] = useState<string>('');

  useEffect(() => {
    loadPredictionAnalysis();
  }, [committeeId]);

  const loadPredictionAnalysis = async () => {
    try {
      setLoading(true);
      
      // Mock prediction data - in production this would use ML models
      const mockPredictions: ProposalPrediction[] = [
        {
          proposalId: 'prop-1',
          proposalTitle: 'TechCorp Series C Investment',
          targetCompany: 'TechCorp Solutions',
          requestedAmount: 25000000,
          prediction: {
            outcome: 'APPROVE',
            confidence: 87,
            approvalProbability: 78,
            rejectionProbability: 15,
            deferralProbability: 7
          },
          votingPattern: {
            expectedVotes: [
              { memberId: 'm1', memberName: 'Sarah Johnson', predictedVote: 'FOR', confidence: 92, historicalAlignment: 85 },
              { memberId: 'm2', memberName: 'Michael Chen', predictedVote: 'FOR', confidence: 88, historicalAlignment: 72 },
              { memberId: 'm3', memberName: 'Emily Rodriguez', predictedVote: 'AGAINST', confidence: 75, historicalAlignment: 68 },
              { memberId: 'm4', memberName: 'David Kim', predictedVote: 'FOR', confidence: 83, historicalAlignment: 79 },
              { memberId: 'm5', memberName: 'Lisa Wang', predictedVote: 'FOR', confidence: 91, historicalAlignment: 88 }
            ],
            quorumMet: true,
            majorityThreshold: 60,
            consensusLevel: 73
          },
          riskFactors: [
            {
              factor: 'Market Timing Risk',
              impact: 'MEDIUM',
              description: 'Tech sector showing increased volatility',
              mitigationSuggestion: 'Consider staged investment approach'
            },
            {
              factor: 'Team Composition',
              impact: 'LOW',
              description: 'Strong management team with proven track record',
              mitigationSuggestion: 'Request additional board seat'
            }
          ],
          influencingFactors: [
            { factor: 'Financial Performance', weight: 25, score: 85, description: 'Strong revenue growth and margins' },
            { factor: 'Market Position', weight: 20, score: 78, description: 'Leading position in growing market' },
            { factor: 'Team Quality', weight: 20, score: 92, description: 'Experienced leadership team' },
            { factor: 'Valuation', weight: 15, score: 72, description: 'Premium pricing but justified' },
            { factor: 'Strategic Fit', weight: 20, score: 88, description: 'Aligns well with portfolio strategy' }
          ],
          timeToDecision: {
            predicted: 12,
            confidence: 84,
            driverFactors: ['Standard due diligence complete', 'No regulatory concerns', 'Strong member consensus']
          }
        },
        {
          proposalId: 'prop-2',
          proposalTitle: 'GreenEnergy Infrastructure Fund',
          targetCompany: 'GreenEnergy Partners',
          requestedAmount: 50000000,
          prediction: {
            outcome: 'DEFER',
            confidence: 73,
            approvalProbability: 35,
            rejectionProbability: 28,
            deferralProbability: 37
          },
          votingPattern: {
            expectedVotes: [
              { memberId: 'm1', memberName: 'Sarah Johnson', predictedVote: 'ABSTAIN', confidence: 65, historicalAlignment: 55 },
              { memberId: 'm2', memberName: 'Michael Chen', predictedVote: 'AGAINST', confidence: 82, historicalAlignment: 71 },
              { memberId: 'm3', memberName: 'Emily Rodriguez', predictedVote: 'FOR', confidence: 78, historicalAlignment: 82 },
              { memberId: 'm4', memberName: 'David Kim', predictedVote: 'AGAINST', confidence: 86, historicalAlignment: 73 },
              { memberId: 'm5', memberName: 'Lisa Wang', predictedVote: 'FOR', confidence: 71, historicalAlignment: 69 }
            ],
            quorumMet: true,
            majorityThreshold: 60,
            consensusLevel: 42
          },
          riskFactors: [
            {
              factor: 'Regulatory Uncertainty',
              impact: 'HIGH',
              description: 'Changing environmental regulations may impact returns',
              mitigationSuggestion: 'Await clarity on upcoming policy changes'
            },
            {
              factor: 'Technology Risk',
              impact: 'MEDIUM',
              description: 'Emerging technology with limited track record',
              mitigationSuggestion: 'Request additional technical due diligence'
            }
          ],
          influencingFactors: [
            { factor: 'ESG Alignment', weight: 30, score: 95, description: 'Strong environmental impact potential' },
            { factor: 'Financial Returns', weight: 25, score: 62, description: 'Moderate return expectations' },
            { factor: 'Risk Profile', weight: 20, score: 45, description: 'Higher risk due to regulatory uncertainty' },
            { factor: 'Portfolio Fit', weight: 15, score: 78, description: 'Diversifies portfolio sectors' },
            { factor: 'Management Team', weight: 10, score: 72, description: 'Experienced but new to this sector' }
          ],
          timeToDecision: {
            predicted: 28,
            confidence: 69,
            driverFactors: ['Additional due diligence required', 'Regulatory clarity needed', 'Member disagreement']
          }
        }
      ];

      const mockMeetingPrediction: MeetingEfficiencyPrediction = {
        meetingId: 'meeting-1',
        meetingDate: new Date('2024-04-15'),
        prediction: {
          duration: 135,
          confidence: 82,
          attendanceRate: 92,
          decisionEfficiency: 75,
          consensusLevel: 68
        },
        agendaOptimization: {
          recommendedOrder: ['prop-1', 'prop-2'],
          timeAllocation: [
            { proposalId: 'prop-1', minutes: 45 },
            { proposalId: 'prop-2', minutes: 75 }
          ],
          riskProposals: ['prop-2'],
          complexityScores: [
            { proposalId: 'prop-1', score: 6.2 },
            { proposalId: 'prop-2', score: 8.5 }
          ]
        },
        attendancePrediction: {
          memberAttendance: [
            { memberId: 'm1', memberName: 'Sarah Johnson', attendanceProbability: 95, votingImpact: 8.5 },
            { memberId: 'm2', memberName: 'Michael Chen', attendanceProbability: 88, votingImpact: 7.2 },
            { memberId: 'm3', memberName: 'Emily Rodriguez', attendanceProbability: 92, votingImpact: 6.8 },
            { memberId: 'm4', memberName: 'David Kim', attendanceProbability: 85, votingImpact: 7.5 },
            { memberId: 'm5', memberName: 'Lisa Wang', attendanceProbability: 98, votingImpact: 8.1 }
          ],
          quorumRisk: 12,
          criticalAbsences: []
        }
      };

      const mockPatternAnalysis: DecisionPatternAnalysis = {
        memberAnalysis: [
          {
            memberId: 'm1',
            memberName: 'Sarah Johnson',
            votingPatterns: {
              approvalRate: 72,
              sectorPreferences: [
                { sector: 'Technology', approvalRate: 85 },
                { sector: 'Healthcare', approvalRate: 78 },
                { sector: 'Energy', approvalRate: 45 }
              ],
              riskTolerance: 75,
              consistencyScore: 88,
              influenceScore: 92
            },
            predictedInfluence: 23,
            keyMotivators: ['Strong financial returns', 'Experienced management', 'Market leadership position']
          },
          {
            memberId: 'm2',
            memberName: 'Michael Chen',
            votingPatterns: {
              approvalRate: 68,
              sectorPreferences: [
                { sector: 'Financial Services', approvalRate: 82 },
                { sector: 'Technology', approvalRate: 71 },
                { sector: 'Consumer', approvalRate: 58 }
              ],
              riskTolerance: 65,
              consistencyScore: 81,
              influenceScore: 78
            },
            predictedInfluence: 19,
            keyMotivators: ['Proven business model', 'Strong unit economics', 'Regulatory compliance']
          }
        ],
        committeeConsensus: {
          overallAgreement: 73,
          polarizedTopics: ['ESG investments', 'Emerging markets', 'Early-stage ventures'],
          unanimousDecisionProbability: 28,
          fracturedVoteRisk: 15
        },
        historicalPerformance: {
          decisionAccuracy: 84,
          timeAccuracy: 78,
          modelConfidence: 87,
          lastUpdated: new Date('2024-03-20')
        }
      };

      setPredictions(mockPredictions);
      setMeetingPredictions([mockMeetingPrediction]);
      setPatternAnalysis(mockPatternAnalysis);
    } catch (error) {
      console.error('Error loading prediction analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'APPROVE': return 'bg-green-100 text-green-800';
      case 'REJECT': return 'bg-red-100 text-red-800';
      case 'DEFER': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVoteColor = (vote: string) => {
    switch (vote) {
      case 'FOR': return 'bg-green-100 text-green-800';
      case 'AGAINST': return 'bg-red-100 text-red-800';
      case 'ABSTAIN': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const renderProposalsTab = () => (
    <div className="space-y-6">
      {/* Prediction Summary */}
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl text-green-800">
            <Brain className="h-6 w-6" />
            Decision Outcome Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl font-bold text-green-600 mb-2">
                {predictions.filter(p => p.prediction.outcome === 'APPROVE').length}
              </div>
              <p className="text-sm text-green-700">Predicted Approvals</p>
              <p className="text-xs text-green-600 mt-1">Avg. {Math.round(predictions.filter(p => p.prediction.outcome === 'APPROVE').reduce((sum, p) => sum + p.prediction.confidence, 0) / Math.max(1, predictions.filter(p => p.prediction.outcome === 'APPROVE').length))}% confidence</p>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-red-600 mb-2">
                {predictions.filter(p => p.prediction.outcome === 'REJECT').length}
              </div>
              <p className="text-sm text-red-700">Predicted Rejections</p>
              <p className="text-xs text-red-600 mt-1">Risk mitigation available</p>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-yellow-600 mb-2">
                {predictions.filter(p => p.prediction.outcome === 'DEFER').length}
              </div>
              <p className="text-sm text-yellow-700">Predicted Deferrals</p>
              <p className="text-xs text-yellow-600 mt-1">Additional DD required</p>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {Math.round(predictions.reduce((sum, p) => sum + p.timeToDecision.predicted, 0) / predictions.length)} days
              </div>
              <p className="text-sm text-blue-700">Avg. Time to Decision</p>
              <p className="text-xs text-blue-600 mt-1">ML prediction</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Predictions */}
      <div className="space-y-4">
        {predictions.map((prediction, index) => (
          <Card key={index} className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{prediction.proposalTitle}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Target:</span>
                      <span className="font-medium">{prediction.targetCompany}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">{formatCurrency(prediction.requestedAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Predicted Outcome:</span>
                      <Badge className={getOutcomeColor(prediction.prediction.outcome)}>
                        {prediction.prediction.outcome}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-gray-700 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-500" />
                    Probability Analysis
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Approval</span>
                        <span className="font-medium">{prediction.prediction.approvalProbability}%</span>
                      </div>
                      <Progress value={prediction.prediction.approvalProbability} className="h-2 bg-green-200" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Rejection</span>
                        <span className="font-medium">{prediction.prediction.rejectionProbability}%</span>
                      </div>
                      <Progress value={prediction.prediction.rejectionProbability} className="h-2 bg-red-200" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Deferral</span>
                        <span className="font-medium">{prediction.prediction.deferralProbability}%</span>
                      </div>
                      <Progress value={prediction.prediction.deferralProbability} className="h-2 bg-yellow-200" />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-gray-700 flex items-center gap-2">
                    <Vote className="h-4 w-4 text-blue-500" />
                    Voting Pattern
                  </h4>
                  <div className="space-y-2">
                    {prediction.votingPattern.expectedVotes.slice(0, 3).map((vote, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{vote.memberName}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getVoteColor(vote.predictedVote)}>
                            {vote.predictedVote}
                          </Badge>
                          <span className="text-xs text-gray-500">{vote.confidence}%</span>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 border-t text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Consensus Level:</span>
                        <span className="font-medium">{prediction.votingPattern.consensusLevel}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-gray-700 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    Timeline & Risks
                  </h4>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="text-gray-600">Time to Decision:</span>
                      <div className="font-medium">{prediction.timeToDecision.predicted} days</div>
                      <div className="text-xs text-gray-500">{prediction.timeToDecision.confidence}% confidence</div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-gray-700">Risk Factors:</span>
                      {prediction.riskFactors.map((risk, idx) => (
                        <div key={idx} className="text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{risk.factor}</span>
                            <Badge variant="outline" className={
                              risk.impact === 'HIGH' ? 'bg-red-100 text-red-800' :
                              risk.impact === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }>
                              {risk.impact}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mt-1">{risk.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setSelectedProposal(selectedProposal === prediction.proposalId ? '' : prediction.proposalId)}
                  className="text-blue-700 border-blue-300 hover:bg-blue-50"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  {selectedProposal === prediction.proposalId ? 'Hide' : 'Show'} Detailed Analysis
                </Button>
              </div>
              
              {selectedProposal === prediction.proposalId && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="font-semibold mb-3">Influencing Factors Analysis</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {prediction.influencingFactors.map((factor, idx) => (
                      <div key={idx} className="bg-white p-3 rounded border">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-sm">{factor.factor}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{factor.score}/100</span>
                            <span className="text-xs text-gray-500">({factor.weight}% weight)</span>
                          </div>
                        </div>
                        <Progress value={factor.score} className="h-2 mb-2" />
                        <p className="text-xs text-gray-600">{factor.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderMeetingsTab = () => (
    <div className="space-y-6">
      {meetingPredictions.map((meeting, index) => (
        <Card key={index} className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl text-blue-800">
              <Calendar className="h-6 w-6" />
              Meeting Efficiency Prediction
            </CardTitle>
            <p className="text-blue-700">Meeting scheduled for {formatDate(meeting.meetingDate)}</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-2">{meeting.prediction.duration} min</div>
                <p className="text-sm text-blue-700">Predicted Duration</p>
                <p className="text-xs text-blue-600">{meeting.prediction.confidence}% confidence</p>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-green-600 mb-2">{meeting.prediction.attendanceRate}%</div>
                <p className="text-sm text-green-700">Expected Attendance</p>
                <p className="text-xs text-green-600">Quorum risk: {meeting.attendancePrediction.quorumRisk}%</p>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-2">{meeting.prediction.decisionEfficiency}%</div>
                <p className="text-sm text-blue-700">Decision Efficiency</p>
                <p className="text-xs text-blue-600">Proposals decided</p>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-orange-600 mb-2">{meeting.prediction.consensusLevel}%</div>
                <p className="text-sm text-orange-700">Consensus Level</p>
                <p className="text-xs text-orange-600">Agreement likelihood</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Attendance Prediction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {meeting.attendancePrediction.memberAttendance.map((member, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{member.memberName}</span>
                        <div className="flex items-center gap-3">
                          <Progress value={member.attendanceProbability} className="w-20 h-2" />
                          <span className="text-sm font-semibold w-10">{member.attendanceProbability}%</span>
                          <span className="text-xs text-gray-500">Impact: {member.votingImpact}/10</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Agenda Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">Recommended Order:</h5>
                      <div className="space-y-2">
                        {meeting.agendaOptimization.timeAllocation.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                            <span className="text-sm font-medium">Proposal {idx + 1}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{item.minutes} min</span>
                              {meeting.agendaOptimization.riskProposals.includes(item.proposalId) && (
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                  High Risk
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderPatternsTab = () => {
    if (!patternAnalysis) return null;

    return (
      <div className="space-y-6">
        {/* Committee Performance */}
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl text-blue-800">
              <Target className="h-6 w-6" />
              Committee Decision Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-2">{patternAnalysis.historicalPerformance.decisionAccuracy}%</div>
                <p className="text-sm text-blue-700">Prediction Accuracy</p>
                <p className="text-xs text-blue-600">Historical performance</p>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-2">{patternAnalysis.committeeConsensus.overallAgreement}%</div>
                <p className="text-sm text-blue-700">Overall Agreement</p>
                <p className="text-xs text-blue-600">Committee alignment</p>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-green-600 mb-2">{patternAnalysis.committeeConsensus.unanimousDecisionProbability}%</div>
                <p className="text-sm text-green-700">Unanimous Probability</p>
                <p className="text-xs text-green-600">Full consensus likelihood</p>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-orange-600 mb-2">{patternAnalysis.committeeConsensus.fracturedVoteRisk}%</div>
                <p className="text-sm text-orange-700">Fractured Vote Risk</p>
                <p className="text-xs text-orange-600">Split decision probability</p>
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Polarized Topics</h4>
              <div className="flex flex-wrap gap-2">
                {patternAnalysis.committeeConsensus.polarizedTopics.map((topic, idx) => (
                  <Badge key={idx} variant="outline" className="bg-red-100 text-red-800">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Member Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {patternAnalysis.memberAnalysis.map((member, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{member.memberName}</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {member.predictedInfluence}% Influence
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-gray-600">Approval Rate:</span>
                    <div className="text-lg font-semibold">{member.votingPatterns.approvalRate}%</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Risk Tolerance:</span>
                    <div className="text-lg font-semibold">{member.votingPatterns.riskTolerance}/100</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Consistency:</span>
                    <div className="text-lg font-semibold">{member.votingPatterns.consistencyScore}%</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Influence Score:</span>
                    <div className="text-lg font-semibold">{member.votingPatterns.influenceScore}/100</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h5 className="font-medium mb-2 text-gray-700">Sector Preferences:</h5>
                  <div className="space-y-2">
                    {member.votingPatterns.sectorPreferences.map((sector, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-sm">{sector.sector}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={sector.approvalRate} className="w-16 h-2" />
                          <span className="text-sm font-medium w-8">{sector.approvalRate}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium mb-2 text-gray-700">Key Motivators:</h5>
                  <div className="flex flex-wrap gap-1">
                    {member.keyMotivators.map((motivator, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {motivator}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 animate-pulse text-blue-600" />
          <span className="text-lg">Loading decision predictions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Brain className="h-7 w-7 text-blue-600" />
            Decision Outcome Prediction
          </h2>
          <p className="text-gray-600 mt-1">
            AI-powered predictions for investment committee decisions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800">
            ML Model Active
          </Badge>
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Analysis Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="proposals">Proposal Predictions</TabsTrigger>
          <TabsTrigger value="meetings">Meeting Efficiency</TabsTrigger>
          <TabsTrigger value="patterns">Member Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="proposals" className="mt-6">
          {renderProposalsTab()}
        </TabsContent>

        <TabsContent value="meetings" className="mt-6">
          {renderMeetingsTab()}
        </TabsContent>

        <TabsContent value="patterns" className="mt-6">
          {renderPatternsTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
}