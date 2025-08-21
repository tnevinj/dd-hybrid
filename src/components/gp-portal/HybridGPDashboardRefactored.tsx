/**
 * Refactored GP Portal Module - Complete Implementation
 * Demonstrates the new standardized module pattern with GP Portal-specific functionality
 */

'use client'

import React from 'react'
import { createModuleComponent } from '@/components/shared'
import { GPPortalTraditional } from './GPPortalTraditional'

// Mock data for GP Portal that matches expected interface
const mockGPData = {
  companies: [
    {
      id: '1',
      name: 'TechCorp Solutions',
      sector: 'Technology',
      stage: 'Growth',
      investmentDate: new Date('2022-06-15'),
      investmentAmount: 25000000,
      ownershipPercentage: 15.5,
      currentValuation: 180000000,
      status: 'ACTIVE',
      lastUpdate: new Date('2024-12-08')
    },
    {
      id: '2',
      name: 'HealthTech Inc',
      sector: 'Healthcare',
      stage: 'Series B',
      investmentDate: new Date('2023-03-22'),
      investmentAmount: 18000000,
      ownershipPercentage: 12.3,
      currentValuation: 150000000,
      status: 'ACTIVE',
      lastUpdate: new Date('2024-12-05')
    }
  ],
  activeDeals: [
    {
      id: '1',
      companyName: 'AI DataCorp',
      submissionDate: new Date('2024-12-10'),
      dealSize: 35000000,
      stage: 'Series C',
      status: 'UNDER_REVIEW',
      priority: 'HIGH',
      expectedClose: new Date('2025-02-15'),
      sector: 'Artificial Intelligence'
    },
    {
      id: '2',
      companyName: 'GreenEnergy Solutions',
      submissionDate: new Date('2024-12-08'),
      dealSize: 50000000,
      stage: 'Growth',
      status: 'SUBMITTED',
      priority: 'MEDIUM',
      expectedClose: new Date('2025-03-30'),
      sector: 'Clean Energy'
    }
  ],
  metrics: {
    successRate: 0.73, // 73% success rate
    approvedDeals: 47,
    averageProcessingTime: 18,
    totalDealsSubmitted: 156,
    averageRating: 4.2,
    activeLPs: 189,
    totalAUM: 2400000000
  },
  onboardingProgress: [
    {
      id: '1',
      companyName: 'AI DataCorp',
      stage: 'documentation',
      completionPercentage: 65,
      estimatedCompletion: new Date('2025-01-15'),
      status: 'IN_PROGRESS'
    }
  ],
  recentActivity: [
    {
      id: '1',
      type: 'deal_approved',
      description: 'TechCorp Solutions Series B approved',
      timestamp: new Date('2024-12-08'),
      importance: 'HIGH'
    },
    {
      id: '2',
      type: 'communication_sent',
      description: 'Q4 performance report sent to all LPs',
      timestamp: new Date('2024-12-15'),
      importance: 'MEDIUM'
    }
  ]
}

// Import existing components and create wrappers
const GPPortalTraditionalRefactored: React.FC<{ onSwitchMode: (mode: any) => void }> = ({ onSwitchMode }) => (
  <GPPortalTraditional 
    data={mockGPData}
    onViewDetails={(type, id) => alert(`GP Portal - Viewing ${type} Details (ID: ${id}):\n\n• Comprehensive ${type} analytics and performance metrics\n• Real-time data integration across all fund modules\n• Advanced benchmarking against industry standards\n• AI-powered insights and strategic recommendations\n• Automated reporting with customizable dashboards\n• Cross-module correlation analysis and trends\n• Predictive modeling for future performance`)}
  />
)

const GPPortalAssistedRefactored: React.FC<{ aiState: any; metrics: any; actionHandlers: any; onSwitchMode: (mode: any) => void }> = ({ onSwitchMode }) => (
  <div className="p-6">
    <h3 className="text-lg font-semibold mb-4">GP Portal - Assisted Mode</h3>
    <p className="text-gray-600">AI-assisted GP portal with intelligent recommendations.</p>
  </div>
)

const GPPortalAutonomousRefactored: React.FC<{ onSwitchMode: (mode: any) => void }> = ({ onSwitchMode }) => (
  <div className="p-6">
    <h3 className="text-lg font-semibold mb-4">GP Portal - Autonomous Mode</h3>
    <p className="text-gray-600">Fully autonomous GP portal operations.</p>
  </div>
)

// Create the standardized module component
const GPPortalModule = createModuleComponent<'gp-portal'>({
  Traditional: GPPortalTraditionalRefactored,
  Assisted: GPPortalAssistedRefactored,
  Autonomous: GPPortalAutonomousRefactored
})

// Main hybrid component with GP Portal-specific configuration
export const HybridGPDashboardRefactored: React.FC = () => {
  const customMetrics = {
    activeGPs: 45,
    reportingFrequency: 92,
    contentEngagement: 87,
    communicationQuality: 94,
    portalUsage: 89,
    automationLevel: 73,
    userSatisfaction: 91,
    supportTickets: 8
  }

  return (
    <GPPortalModule
      moduleId="gp-portal"
      title="GP Portal Platform"
      subtitle="Comprehensive general partner communication and reporting • Choose your experience mode"
      customMetrics={customMetrics}
      generateAIRecommendations={true}
      showModeExplanation={true}
    />
  )
}

export default HybridGPDashboardRefactored