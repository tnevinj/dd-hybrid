/**
 * Unified Workspace Data Source
 * Single source of truth for all workspace and portfolio mock data across all modes
 */

import { Portfolio, UnifiedAsset, TraditionalAsset, RealEstateAsset, InfrastructureAsset } from '@/types/portfolio';
import { generateEnterprisePortfolioAssets, generateEnterprisePortfolio } from './unified-workspace-portfolio-assets';

export interface UnifiedWorkspaceProject {
  // Core identifiers
  id: string;
  name: string;
  
  // Project classification
  type: 'due-diligence' | 'ic-preparation' | 'deal-screening' | 'portfolio-monitoring' | 'reporting';
  displayType: string; // Human-readable type for UI
  
  // Status information
  status: 'active' | 'review' | 'draft' | 'completed' | 'on-hold';
  displayStatus: string; // Human-readable status for UI
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  // Progress and activity
  progress: number; // 0-100
  lastActivity: Date;
  lastActivityDisplay: string; // Human-readable last activity
  deadline?: Date;
  
  // Team and collaboration
  teamMembers: string[]; // Array of team member names
  teamSize: number; // Computed from teamMembers.length
  workProducts: number; // Number of work products/deliverables
  unreadMessages?: number; // For notifications
  
  // Business context
  metadata: {
    dealValue?: number;
    sector?: string;
    geography?: string;
    stage?: string;
    riskRating?: 'low' | 'medium' | 'high';
    confidenceScore?: number;
  };
  
  // AI enhancements (for assisted/autonomous modes)
  aiData?: {
    optimizationScore?: number;
    prediction?: number;
    efficiency?: number;
    insights?: Array<{ summary: string; confidence?: number }>;
    suggestions?: Array<{
      label: string;
      action: string;
      description: string;
    }>;
  };
}

// Unified workspace projects data
export const UNIFIED_WORKSPACE_PROJECTS: UnifiedWorkspaceProject[] = [
  {
    id: '1',
    name: 'TechCorp Due Diligence',
    type: 'due-diligence',
    displayType: 'Due Diligence',
    status: 'active',
    displayStatus: 'Active',
    priority: 'high',
    progress: 75,
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    lastActivityDisplay: '2 hours ago',
    teamMembers: ['Sarah Chen', 'Mike Rodriguez', 'Alex Johnson', 'Lisa Park'],
    teamSize: 4,
    workProducts: 8,
    unreadMessages: 4,
    metadata: {
      dealValue: 50000000,
      sector: 'Technology',
      geography: 'North America',
      stage: 'growth',
      riskRating: 'medium',
      confidenceScore: 0.85,
      workProductId: 'wp-1',
      workProductTitle: 'TechCorp Due Diligence Report'
    },
    aiData: {
      optimizationScore: 9.2,
      prediction: 85,
      efficiency: 30,
      insights: [
        { summary: 'Team velocity increased 25% with AI document analysis', confidence: 0.92 },
        { summary: 'Risk assessment automation saved 12 hours this week', confidence: 0.88 }
      ],
      suggestions: [
        { 
          label: 'Optimize', 
          action: 'OPTIMIZE_WORKSPACE_WORKFLOW', 
          description: 'Thando suggests workflow optimization for DD process' 
        },
        { 
          label: 'Automate', 
          action: 'AUTO_TASKS', 
          description: 'Automate routine DD checklist items' 
        }
      ]
    }
  },
  {
    id: '2',
    name: 'HealthCo Investment Committee',
    type: 'ic-preparation',
    displayType: 'IC Preparation',
    status: 'review',
    displayStatus: 'Review',
    priority: 'high',
    progress: 90,
    lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    lastActivityDisplay: '1 day ago',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    teamMembers: ['Jennifer Park', 'David Kim', 'Michael Chang', 'Emma Wilson', 'Robert Singh', 'Ana Garcia'],
    teamSize: 6,
    workProducts: 12,
    unreadMessages: 6,
    metadata: {
      dealValue: 125000000,
      sector: 'Healthcare',
      geography: 'North America',
      stage: 'buyout',
      riskRating: 'low',
      confidenceScore: 0.94,
      workProductId: 'wp-2',
      workProductTitle: 'HealthCo Investment Committee Memo'
    },
    aiData: {
      optimizationScore: 8.8,
      prediction: 95,
      efficiency: 40,
      insights: [
        { summary: 'IC deck auto-generated based on DD findings', confidence: 0.96 },
        { summary: 'Financial model validation shows 98% accuracy', confidence: 0.99 }
      ],
      suggestions: [
        { 
          label: 'Review', 
          action: 'AI_REVIEW', 
          description: 'AI final review recommendations for IC presentation' 
        }
      ]
    }
  },
  {
    id: '3',
    name: 'RetailCo Deal Screening',
    type: 'deal-screening',
    displayType: 'Screening',
    status: 'active',
    displayStatus: 'Active',
    priority: 'medium',
    progress: 45,
    lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    lastActivityDisplay: '3 hours ago',
    teamMembers: ['Tom Anderson', 'Maria Rodriguez', 'James Lee'],
    teamSize: 3,
    workProducts: 5,
    unreadMessages: 3,
    metadata: {
      dealValue: 35000000,
      sector: 'Retail',
      geography: 'Europe',
      stage: 'growth',
      riskRating: 'medium',
      confidenceScore: 0.72
    },
    aiData: {
      optimizationScore: 7.5,
      prediction: 60,
      efficiency: 20,
      insights: [
        { summary: 'Market analysis completed using AI data synthesis', confidence: 0.85 },
        { summary: 'Comparable company matching confidence: 85%', confidence: 0.85 }
      ],
      suggestions: [
        { 
          label: 'Accelerate', 
          action: 'ACCELERATE_SCREENING', 
          description: 'Speed up screening process with AI-powered analysis' 
        }
      ]
    }
  },
  {
    id: '4',
    name: 'Manufacturing Portfolio Review',
    type: 'portfolio-monitoring',
    displayType: 'Monitoring',
    status: 'draft',
    displayStatus: 'Draft',
    priority: 'low',
    progress: 20,
    lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    lastActivityDisplay: '1 week ago',
    teamMembers: ['Kevin Zhang', 'Sophie Miller'],
    teamSize: 2,
    workProducts: 3,
    unreadMessages: 0,
    metadata: {
      dealValue: 80000000,
      sector: 'Manufacturing',
      geography: 'North America',
      stage: 'mature',
      riskRating: 'low',
      confidenceScore: 0.65
    },
    aiData: {
      optimizationScore: 6.8,
      prediction: 35,
      efficiency: 10,
      insights: [
        { summary: 'Portfolio performance tracking shows steady growth', confidence: 0.78 },
        { summary: 'ESG compliance improvements recommended', confidence: 0.82 }
      ],
      suggestions: [
        { 
          label: 'Update', 
          action: 'UPDATE_PORTFOLIO_METRICS', 
          description: 'Update portfolio performance metrics and analysis' 
        }
      ]
    }
  }
];

// Utility functions for data access and transformation
export class UnifiedWorkspaceDataService {
  /**
   * Get all workspace projects
   */
  static getAllProjects(): UnifiedWorkspaceProject[] {
    return UNIFIED_WORKSPACE_PROJECTS;
  }

  /**
   * Get projects for Traditional mode (simplified format)
   */
  static getTraditionalProjects() {
    return UNIFIED_WORKSPACE_PROJECTS.map(project => ({
      id: project.id.replace('workspace-proj-', ''), // Use simple numeric ID for UI
      name: project.name,
      type: project.displayType,
      status: project.displayStatus,
      workProducts: project.workProducts,
      teamMembers: project.teamSize, // Traditional mode uses number
      lastActivity: project.lastActivityDisplay,
      progress: project.progress
    }));
  }

  /**
   * Get projects for Assisted mode (enhanced format)
   */
  static getAssistedProjects() {
    return UNIFIED_WORKSPACE_PROJECTS.map(project => ({
      id: project.id.replace('workspace-proj-', ''), // Use simple numeric ID for UI
      name: project.name,
      type: project.displayType,
      status: project.displayStatus,
      workProducts: project.workProducts,
      teamMembers: project.teamSize,
      lastActivity: project.lastActivityDisplay,
      progress: project.progress,
      aiOptimizationScore: project.aiData?.optimizationScore || 5.0,
      aiPrediction: project.aiData?.prediction || project.progress + 10,
      aiEfficiency: project.aiData?.efficiency || 15,
      aiInsights: project.aiData?.insights || [],
      aiSuggestions: project.aiData?.suggestions || []
    }));
  }

  /**
   * Get projects for Autonomous store format (legacy workspace projects)
   */
  static getAutonomousProjects() {
    return UNIFIED_WORKSPACE_PROJECTS.map(project => ({
      id: project.id,
      name: project.name,
      type: project.type === 'ic-preparation' ? 'report' : 
            project.type === 'deal-screening' ? 'analysis' :
            project.type === 'portfolio-monitoring' ? 'portfolio' : 'report',
      status: project.status,
      lastActivity: project.lastActivity,
      priority: project.priority,
      unreadMessages: project.unreadMessages || 0,
      metadata: {
        progress: project.progress,
        team: project.teamMembers,
        ...project.metadata
      }
    }));
  }

  /**
   * Get portfolio assets formatted as autonomous "projects" for portfolio module
   */
  static getPortfolioAssetsAsProjects() {
    return generateEnterprisePortfolioAssets().map(asset => {
      // Convert asset status to project status
      const getProjectStatus = (assetStatus: string) => {
        switch (assetStatus) {
          case 'active': return 'active';
          case 'under_review': return 'review';
          case 'exited': return 'completed';
          case 'disposed': return 'completed';
          default: return 'active';
        }
      };

      // Convert risk rating to priority
      const getPriority = (riskRating: string) => {
        switch (riskRating) {
          case 'low': return 'low';
          case 'medium': return 'medium';
          case 'high': return 'high';
          case 'critical': return 'critical';
          default: return 'medium';
        }
      };

      // Calculate unread messages based on asset performance and risk
      const getUnreadMessages = (asset: any) => {
        let messages = 0;
        if (asset.performance.irr < 0.1) messages += 2; // Low performance
        if (asset.riskRating === 'high' || asset.riskRating === 'critical') messages += 3;
        if (asset.esgMetrics.overallScore < 7.0) messages += 1; // ESG concerns
        return messages;
      };

      return {
        id: asset.id,
        name: asset.name,
        type: 'portfolio' as const,
        status: getProjectStatus(asset.status),
        lastActivity: new Date(asset.lastUpdated),
        priority: getPriority(asset.riskRating),
        unreadMessages: getUnreadMessages(asset),
        metadata: {
          // Core asset information
          assetType: asset.assetType,
          currentValue: asset.currentValue,
          acquisitionValue: asset.acquisitionValue,
          location: asset.location,
          
          // Performance metrics
          irr: asset.performance.irr,
          moic: asset.performance.moic,
          totalReturn: asset.performance.totalReturn,
          
          // Risk and ESG
          riskRating: asset.riskRating,
          esgScore: asset.esgMetrics.overallScore,
          
          // Sector and classification
          sector: asset.sector,
          tags: asset.tags,
          
          // Asset-specific details based on type
          ...(asset.assetType === 'traditional' && {
            companyStage: asset.specificMetrics.companyStage,
            employeeCount: asset.specificMetrics.employeeCount,
            revenue: asset.specificMetrics.revenue,
            ownershipPercentage: asset.specificMetrics.ownershipPercentage
          }),
          ...(asset.assetType === 'real_estate' && {
            propertyType: asset.specificMetrics.propertyType,
            totalSqFt: asset.specificMetrics.totalSqFt,
            occupancyRate: asset.specificMetrics.occupancyRate,
            capRate: asset.specificMetrics.capRate
          }),
          ...(asset.assetType === 'infrastructure' && {
            assetCategory: asset.specificMetrics.assetCategory,
            capacityUtilization: asset.specificMetrics.capacityUtilization,
            availabilityRate: asset.specificMetrics.availabilityRate,
            contractedRevenue: asset.specificMetrics.contractedRevenue
          })
        }
      };
    });
  }

  /**
   * Get projects for Thando context format
   */
  static getThandoProjects() {
    return UNIFIED_WORKSPACE_PROJECTS.map(project => ({
      id: project.id, // Keep consistent with workspace API: '1', '2', etc.
      name: project.name,
      type: project.type,
      status: project.status,
      priority: project.priority,
      progress: project.progress,
      teamMembers: project.teamMembers,
      lastActivity: project.lastActivity,
      deadline: project.deadline,
      metadata: project.metadata
    }));
  }

  /**
   * Get workspace metrics (consistent across all modes)
   */
  static getWorkspaceMetrics() {
    const projects = UNIFIED_WORKSPACE_PROJECTS;
    const activeProjects = projects.filter(p => p.status === 'active');
    const completedProjects = projects.filter(p => p.status === 'completed');
    const totalTeamMembers = [...new Set(projects.flatMap(p => p.teamMembers))].length;
    const averageProgress = Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length);
    
    return {
      totalWorkspaces: projects.length,
      activeWorkspaces: activeProjects.length,
      completedWorkspaces: completedProjects.length,
      teamMembers: totalTeamMembers,
      averageProgress,
      projectsThisMonth: projects.filter(p => 
        p.lastActivity.getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
      ).length,
      // AI-specific metrics
      aiOptimizationScore: projects.reduce((sum, p) => sum + (p.aiData?.optimizationScore || 5), 0) / projects.length,
      predictedEfficiency: Math.round(projects.reduce((sum, p) => sum + (p.aiData?.efficiency || 10), 0) / projects.length)
    };
  }

  /**
   * Generate portfolio assets based on workspace projects using enterprise-grade data
   */
  static generatePortfolioAssets(): UnifiedAsset[] {
    return generateEnterprisePortfolioAssets();
  }

  /**
   * Generate unified portfolio based on workspace projects using enterprise-grade data
   */
  static generateUnifiedPortfolio(): Portfolio {
    return generateEnterprisePortfolio();
  }

  /**
   * Get portfolio data for portfolio components
   */
  static getUnifiedPortfolios(): Portfolio[] {
    return [this.generateUnifiedPortfolio()];
  }
}

// Export types for external use
export type { UnifiedWorkspaceProject };