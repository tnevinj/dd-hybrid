/**
 * Refactored LP Portal Module - Complete Implementation
 * Demonstrates the new standardized module pattern with LP Portal-specific functionality
 */

'use client'

import React from 'react'
import { createModuleComponent } from '@/components/shared'
import { LPPortalTraditional } from './LPPortalTraditional'

// Mock data for LP Portal
const mockLPData = {
  summary: {
    totalCommitments: 250000000,
    totalCalled: 187500000,
    totalDistributed: 98750000,
    currentNAV: 156250000,
    weightedAverageIRR: 18.7,
    averageMOIC: 2.4
  },
  commitments: [
    {
      id: '1',
      fundName: 'Growth Fund III',
      vintage: 2020,
      commitmentAmount: 50000000,
      calledAmount: 37500000,
      distributedAmount: 12000000,
      currentNAV: 28750000,
      irr: 22.3,
      moic: 1.8,
      dpi: 0.32,
      rvpi: 0.77,
      tvpi: 1.09,
      status: 'ACTIVE',
      managementFee: 2.0,
      carriedInterest: 20.0,
      hurdle: 8.0,
      expectedFinalDate: new Date('2030-12-31')
    },
    {
      id: '2',
      fundName: 'Infrastructure Fund I',
      vintage: 2019,
      commitmentAmount: 75000000,
      calledAmount: 56250000,
      distributedAmount: 23500000,
      currentNAV: 42000000,
      irr: 16.8,
      moic: 1.6,
      dpi: 0.42,
      rvpi: 0.75,
      tvpi: 1.17,
      status: 'ACTIVE',
      managementFee: 1.75,
      carriedInterest: 20.0,
      hurdle: 7.0,
      expectedFinalDate: new Date('2029-06-30')
    }
  ],
  activeCapitalCalls: [
    {
      id: '1',
      commitmentId: '1',
      callNumber: 4,
      callAmount: 5000000,
      dueDate: new Date('2025-01-15'),
      purpose: 'New portfolio company acquisition - TechCorp Series B',
      status: 'PENDING'
    }
  ],
  recentDistributions: [
    {
      id: '1',
      commitmentId: '2',
      distributionNumber: 3,
      distributionAmount: 8750000,
      distributionType: 'REALIZED_GAIN',
      distributionDate: new Date('2024-12-01'),
      paymentDate: new Date('2024-12-05'),
      status: 'RECEIVED',
      sourceDescription: 'Portfolio company exit - InfraCorp acquisition by strategic buyer',
      taxWithheld: 875000
    }
  ],
  coInvestmentOpportunities: [
    {
      id: '1',
      opportunityName: 'HealthTech Co-Investment',
      targetCompany: 'MedDevice Solutions',
      sector: 'Healthcare Technology',
      geography: 'North America',
      minimumInvestment: 2000000,
      maximumInvestment: 10000000,
      responseDeadline: new Date('2024-12-30'),
      expectedClosingDate: new Date('2025-02-15'),
      status: 'OFFERED',
      description: 'Series C investment in leading medical device manufacturer'
    }
  ],
  activeElections: [
    {
      id: '1',
      title: 'Advisory Committee Member Election',
      description: 'Vote for new advisory committee members for Growth Fund III',
      electionType: 'ADVISORY_COMMITTEE',
      startDate: new Date('2024-12-01'),
      endDate: new Date('2024-12-31'),
      status: 'ACTIVE',
      options: ['John Smith', 'Sarah Johnson', 'Michael Chen']
    }
  ],
  unreadDocuments: [
    {
      id: '1',
      name: 'Q4 2024 Portfolio Report - Growth Fund III',
      category: 'PORTFOLIO_REPORT',
      publishedAt: new Date('2024-12-15'),
      readStatus: 'UNREAD',
      downloadAllowed: true,
      accessLevel: 'LP_ONLY',
      status: 'PUBLISHED',
      aiSummary: 'Strong Q4 performance with three new investments and one successful exit. NAV increased 8.2% quarter-over-quarter.'
    }
  ]
}

// Import existing components and create wrappers
const LPPortalTraditionalRefactored: React.FC<{ onSwitchMode: (mode: any) => void }> = ({ onSwitchMode }) => (
  <LPPortalTraditional 
    data={mockLPData}
    onRespond={(type, id) => alert(`LP Portal - Responding to ${type} (ID: ${id}):\n\n• Intelligent response framework with guided workflows\n• Automated document collection and validation\n• Smart notification system with priority routing\n• Integration with GP workflow and approval systems\n• Secure communication channels with audit trails\n• Real-time status tracking and updates\n• Compliance verification and regulatory checks`)}
    onViewDetails={(type, id) => alert(`LP Portal - Viewing ${type} Details (ID: ${id}):\n\n• Comprehensive ${type} analytics and investment insights\n• Real-time portfolio performance and risk metrics\n• Advanced benchmarking and peer comparisons\n• Interactive dashboards with drill-down capabilities\n• Automated ESG scoring and impact measurements\n• Predictive analytics for investment outcomes\n• Customizable reporting with export functionality`)}
  />
)

const LPPortalAssistedRefactored: React.FC<{ aiState: any; metrics: any; actionHandlers: any; onSwitchMode: (mode: any) => void }> = ({ onSwitchMode }) => (
  <div className="p-6">
    <h3 className="text-lg font-semibold mb-4">LP Portal - Assisted Mode</h3>
    <p className="text-gray-600">AI-enhanced limited partner portal with intelligent insights.</p>
  </div>
)

const LPPortalAutonomousRefactored: React.FC<{ onSwitchMode: (mode: any) => void }> = ({ onSwitchMode }) => (
  <div className="p-6">
    <h3 className="text-lg font-semibold mb-4">LP Portal - Autonomous Mode</h3>
    <p className="text-gray-600">Autonomous limited partner portal operations.</p>
  </div>
)

// Create the standardized module component
const LPPortalModule = createModuleComponent<'lp-portal'>({
  Traditional: LPPortalTraditionalRefactored,
  Assisted: LPPortalAssistedRefactored,
  Autonomous: LPPortalAutonomousRefactored
})

// Main hybrid component with LP Portal-specific configuration
export const HybridLPDashboardRefactored: React.FC = () => {
  const customMetrics = {
    activeLPs: 189,
    investorEngagement: 85,
    reportDelivery: 98,
    queryResolution: 94,
    portalAdoption: 91,
    communicationScore: 89,
    automationLevel: 76,
    satisfactionRating: 93
  }

  return (
    <LPPortalModule
      moduleId="lp-portal"
      title="LP Portal Platform"
      subtitle="Comprehensive limited partner communication and reporting • Choose your experience mode"
      customMetrics={customMetrics}
      generateAIRecommendations={true}
      showModeExplanation={true}
    />
  )
}

export default HybridLPDashboardRefactored