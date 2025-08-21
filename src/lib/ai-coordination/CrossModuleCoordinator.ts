/**
 * Cross-Module AI Coordination System
 * 
 * This module provides intelligent coordination between different modules,
 * enabling AI to understand relationships between deal screening, due diligence,
 * portfolio management, fund operations, etc., and make cross-module recommendations.
 */

import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAIStateStore, AIRecommendation } from '@/lib/ai-state-manager';

// Cross-module relationship types
export interface ModuleRelationship {
  id: string;
  sourceModule: string;
  targetModule: string;
  relationshipType: 'workflow' | 'data_dependency' | 'decision_dependency' | 'temporal' | 'business_logic';
  strength: number; // 0-1, how strong the relationship is
  description: string;
  triggers: string[]; // What events in source module trigger actions in target module
  conditions?: Record<string, any>; // Conditions that must be met
}

// Cross-module insight interface
export interface CrossModuleInsight {
  id: string;
  title: string;
  description: string;
  affectedModules: string[];
  insightType: 'opportunity' | 'risk' | 'inefficiency' | 'optimization' | 'trend';
  priority: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-1
  estimatedImpact: string;
  recommendations: CrossModuleRecommendation[];
  dataPoints: Array<{
    module: string;
    metric: string;
    value: any;
    trend?: 'up' | 'down' | 'stable';
  }>;
  timestamp: Date;
  expiresAt?: Date;
}

// Cross-module recommendation interface
export interface CrossModuleRecommendation {
  id: string;
  title: string;
  description: string;
  affectedModules: string[];
  actions: Array<{
    module: string;
    action: string;
    description: string;
    parameters?: Record<string, any>;
    order: number; // Execution order for coordinated actions
  }>;
  estimatedBenefit: string;
  riskLevel: 'low' | 'medium' | 'high';
  coordinationRequired: boolean;
  dependencies?: string[]; // IDs of other recommendations that must be executed first
}

// Module state interface for coordination
export interface ModuleCoordinationState {
  moduleId: string;
  isActive: boolean;
  currentContext: Record<string, any>;
  activeWorkflows: string[];
  pendingCoordinations: string[];
  lastActivity: Date;
  capabilities: {
    canInitiateWorkflows: boolean;
    canReceiveWorkflows: boolean;
    canProvideData: boolean;
    canConsumeData: boolean;
    autonomyLevel: 'manual' | 'assisted' | 'autonomous';
  };
}

// Workflow coordination interface
export interface WorkflowCoordination {
  id: string;
  name: string;
  description: string;
  initiatorModule: string;
  participantModules: string[];
  steps: Array<{
    id: string;
    module: string;
    action: string;
    description: string;
    requiredInputs: string[];
    expectedOutputs: string[];
    isOptional: boolean;
    estimatedDuration?: number; // in minutes
  }>;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  currentStep: number;
  startedAt?: Date;
  completedAt?: Date;
  metadata: Record<string, any>;
}

// Cross-module coordinator state
interface CrossModuleCoordinatorState {
  // Module relationships
  relationships: ModuleRelationship[];
  moduleStates: Record<string, ModuleCoordinationState>;
  
  // Insights and recommendations
  crossModuleInsights: CrossModuleInsight[];
  crossModuleRecommendations: CrossModuleRecommendation[];
  
  // Workflow coordination
  activeWorkflows: WorkflowCoordination[];
  workflowHistory: WorkflowCoordination[];
  
  // Analysis and patterns
  detectedPatterns: Array<{
    id: string;
    pattern: string;
    modules: string[];
    frequency: number;
    confidence: number;
    lastSeen: Date;
  }>;
  
  // Configuration
  coordinationEnabled: boolean;
  analysisInterval: number; // How often to run cross-module analysis (ms)
  lastAnalysis: Date | null;
}

interface CrossModuleCoordinatorActions {
  // Module management
  registerModule: (moduleId: string, capabilities: ModuleCoordinationState['capabilities']) => void;
  updateModuleState: (moduleId: string, state: Partial<ModuleCoordinationState>) => void;
  deactivateModule: (moduleId: string) => void;
  
  // Relationship management
  addRelationship: (relationship: Omit<ModuleRelationship, 'id'>) => string;
  removeRelationship: (relationshipId: string) => void;
  updateRelationship: (relationshipId: string, updates: Partial<ModuleRelationship>) => void;
  
  // Insight and recommendation management
  generateCrossModuleInsights: () => Promise<CrossModuleInsight[]>;
  addCrossModuleInsight: (insight: Omit<CrossModuleInsight, 'id' | 'timestamp'>) => string;
  dismissCrossModuleInsight: (insightId: string) => void;
  
  // Workflow coordination
  initiateWorkflow: (workflow: Omit<WorkflowCoordination, 'id' | 'status' | 'currentStep'>) => string;
  advanceWorkflow: (workflowId: string, stepResult?: any) => boolean;
  cancelWorkflow: (workflowId: string, reason: string) => void;
  completeWorkflow: (workflowId: string, result?: any) => void;
  
  // Analysis and pattern detection
  analyzeModuleInteractions: () => void;
  detectPatterns: () => void;
  
  // Utility
  getModuleRelationships: (moduleId: string) => ModuleRelationship[];
  getActiveWorkflowsForModule: (moduleId: string) => WorkflowCoordination[];
  getInsightsForModule: (moduleId: string) => CrossModuleInsight[];
  exportCoordinationData: () => any;
  clearOldData: () => void;
}

type CrossModuleCoordinatorStore = CrossModuleCoordinatorState & CrossModuleCoordinatorActions;

// Default module relationships based on common PE workflows
const defaultRelationships: Omit<ModuleRelationship, 'id'>[] = [
  {
    sourceModule: 'deal-screening',
    targetModule: 'due-diligence',
    relationshipType: 'workflow',
    strength: 0.9,
    description: 'Screened deals flow to due diligence process',
    triggers: ['deal_approved_for_dd', 'deal_flagged_for_review']
  },
  {
    sourceModule: 'due-diligence',
    targetModule: 'investment-committee',
    relationshipType: 'workflow',
    strength: 0.85,
    description: 'Completed due diligence reports go to investment committee',
    triggers: ['dd_completed', 'dd_red_flags_identified']
  },
  {
    sourceModule: 'investment-committee',
    targetModule: 'deal-structuring',
    relationshipType: 'workflow',
    strength: 0.8,
    description: 'Approved investments move to deal structuring',
    triggers: ['investment_approved', 'conditional_approval']
  },
  {
    sourceModule: 'deal-structuring',
    targetModule: 'portfolio',
    relationshipType: 'workflow',
    strength: 0.9,
    description: 'Completed deals become portfolio companies',
    triggers: ['deal_closed', 'investment_completed']
  },
  {
    sourceModule: 'portfolio',
    targetModule: 'fund-operations',
    relationshipType: 'data_dependency',
    strength: 0.7,
    description: 'Portfolio performance impacts fund operations and reporting',
    triggers: ['valuation_updated', 'exit_event', 'distribution_declared']
  },
  {
    sourceModule: 'deal-screening',
    targetModule: 'portfolio',
    relationshipType: 'business_logic',
    strength: 0.6,
    description: 'Deal screening criteria should align with portfolio strategy',
    triggers: ['sector_focus_changed', 'strategy_updated']
  }
];

// Utility function to generate IDs
const generateId = () => `coord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Main Cross-Module Coordinator Store
export const useCrossModuleCoordinatorStore = create<CrossModuleCoordinatorStore>()(
  persist(
    (set, get) => ({
      // Initial state
      relationships: defaultRelationships.map(rel => ({
        ...rel,
        id: generateId()
      })),
      moduleStates: {},
      crossModuleInsights: [],
      crossModuleRecommendations: [],
      activeWorkflows: [],
      workflowHistory: [],
      detectedPatterns: [],
      coordinationEnabled: true,
      analysisInterval: 5 * 60 * 1000, // 5 minutes
      lastAnalysis: null,

      // Module management
      registerModule: (moduleId: string, capabilities: ModuleCoordinationState['capabilities']) => {
        set(state => ({
          moduleStates: {
            ...state.moduleStates,
            [moduleId]: {
              moduleId,
              isActive: true,
              currentContext: {},
              activeWorkflows: [],
              pendingCoordinations: [],
              lastActivity: new Date(),
              capabilities
            }
          }
        }));
      },

      updateModuleState: (moduleId: string, updates: Partial<ModuleCoordinationState>) => {
        set(state => ({
          moduleStates: {
            ...state.moduleStates,
            [moduleId]: {
              ...state.moduleStates[moduleId],
              ...updates,
              lastActivity: new Date()
            }
          }
        }));
      },

      deactivateModule: (moduleId: string) => {
        set(state => ({
          moduleStates: {
            ...state.moduleStates,
            [moduleId]: {
              ...state.moduleStates[moduleId],
              isActive: false
            }
          }
        }));
      },

      // Relationship management
      addRelationship: (relationship: Omit<ModuleRelationship, 'id'>) => {
        const id = generateId();
        set(state => ({
          relationships: [...state.relationships, { ...relationship, id }]
        }));
        return id;
      },

      removeRelationship: (relationshipId: string) => {
        set(state => ({
          relationships: state.relationships.filter(r => r.id !== relationshipId)
        }));
      },

      updateRelationship: (relationshipId: string, updates: Partial<ModuleRelationship>) => {
        set(state => ({
          relationships: state.relationships.map(r =>
            r.id === relationshipId ? { ...r, ...updates } : r
          )
        }));
      },

      // Insight and recommendation management
      generateCrossModuleInsights: async () => {
        const state = get();
        const aiState = useAIStateStore.getState();
        
        const insights: CrossModuleInsight[] = [];
        
        // Analyze module interactions to generate insights
        const activeModules = Object.keys(state.moduleStates).filter(
          moduleId => state.moduleStates[moduleId].isActive
        );
        
        // Example: Portfolio performance affecting fund operations
        if (activeModules.includes('portfolio') && activeModules.includes('fund-operations')) {
          const portfolioRecs = aiState.modules['portfolio']?.recommendations || [];
          const fundOpsRecs = aiState.modules['fund-operations']?.recommendations || [];
          
          if (portfolioRecs.length > 0 && fundOpsRecs.length > 0) {
            insights.push({
              id: generateId(),
              title: 'Portfolio-Fund Ops Optimization Opportunity',
              description: 'Strong portfolio performance could enable accelerated distribution timeline and improved LP relations.',
              affectedModules: ['portfolio', 'fund-operations'],
              insightType: 'opportunity',
              priority: 'medium',
              confidence: 0.75,
              estimatedImpact: 'Potential 15% improvement in LP satisfaction and 2-week acceleration in distribution processing',
              recommendations: [
                {
                  id: generateId(),
                  title: 'Coordinate Distribution Planning',
                  description: 'Align portfolio exit planning with fund distribution schedules',
                  affectedModules: ['portfolio', 'fund-operations'],
                  actions: [
                    {
                      module: 'portfolio',
                      action: 'UPDATE_EXIT_TIMELINE',
                      description: 'Update exit timeline based on fund requirements',
                      order: 1
                    },
                    {
                      module: 'fund-operations',
                      action: 'OPTIMIZE_DISTRIBUTION_SCHEDULE',
                      description: 'Optimize distribution schedule based on portfolio timeline',
                      order: 2
                    }
                  ],
                  estimatedBenefit: 'Improved cash flow predictability',
                  riskLevel: 'low',
                  coordinationRequired: true
                }
              ],
              dataPoints: [
                {
                  module: 'portfolio',
                  metric: 'avg_irr',
                  value: 18.5,
                  trend: 'up'
                },
                {
                  module: 'fund-operations',
                  metric: 'distribution_frequency',
                  value: 'quarterly',
                  trend: 'stable'
                }
              ],
              timestamp: new Date()
            });
          }
        }

        // Example: Due diligence quality affecting deal outcomes
        if (activeModules.includes('due-diligence') && activeModules.includes('portfolio')) {
          insights.push({
            id: generateId(),
            title: 'Due Diligence Quality Impact on Portfolio Performance',
            description: 'Analysis shows correlation between thorough due diligence assessments and portfolio company performance.',
            affectedModules: ['due-diligence', 'portfolio'],
            insightType: 'trend',
            priority: 'high',
            confidence: 0.88,
            estimatedImpact: 'Enhanced DD processes could improve portfolio IRR by 3-5%',
            recommendations: [
              {
                id: generateId(),
                title: 'Enhance DD Assessment Framework',
                description: 'Implement enhanced due diligence framework based on portfolio performance correlation',
                affectedModules: ['due-diligence'],
                actions: [
                  {
                    module: 'due-diligence',
                    action: 'UPDATE_ASSESSMENT_CRITERIA',
                    description: 'Add portfolio performance predictive factors to DD checklist',
                    order: 1
                  }
                ],
                estimatedBenefit: '3-5% improvement in portfolio IRR',
                riskLevel: 'low',
                coordinationRequired: false
              }
            ],
            dataPoints: [
              {
                module: 'due-diligence',
                metric: 'assessment_completeness',
                value: 85,
                trend: 'up'
              },
              {
                module: 'portfolio',
                metric: 'avg_performance',
                value: 'above_benchmark',
                trend: 'up'
              }
            ],
            timestamp: new Date()
          });
        }

        // Add insights to state
        set(state => ({
          crossModuleInsights: [...state.crossModuleInsights, ...insights],
          lastAnalysis: new Date()
        }));

        return insights;
      },

      addCrossModuleInsight: (insight: Omit<CrossModuleInsight, 'id' | 'timestamp'>) => {
        const id = generateId();
        const fullInsight: CrossModuleInsight = {
          ...insight,
          id,
          timestamp: new Date()
        };
        
        set(state => ({
          crossModuleInsights: [...state.crossModuleInsights, fullInsight]
        }));
        
        return id;
      },

      dismissCrossModuleInsight: (insightId: string) => {
        set(state => ({
          crossModuleInsights: state.crossModuleInsights.filter(i => i.id !== insightId)
        }));
      },

      // Workflow coordination
      initiateWorkflow: (workflow: Omit<WorkflowCoordination, 'id' | 'status' | 'currentStep'>) => {
        const id = generateId();
        const fullWorkflow: WorkflowCoordination = {
          ...workflow,
          id,
          status: 'pending',
          currentStep: 0,
          startedAt: new Date()
        };
        
        set(state => ({
          activeWorkflows: [...state.activeWorkflows, fullWorkflow]
        }));
        
        // Update module states to reflect participation
        workflow.participantModules.forEach(moduleId => {
          get().updateModuleState(moduleId, {
            activeWorkflows: [...(get().moduleStates[moduleId]?.activeWorkflows || []), id]
          });
        });
        
        return id;
      },

      advanceWorkflow: (workflowId: string, stepResult?: any) => {
        const state = get();
        const workflow = state.activeWorkflows.find(w => w.id === workflowId);
        
        if (!workflow || workflow.status !== 'in_progress') {
          return false;
        }
        
        const nextStep = workflow.currentStep + 1;
        
        if (nextStep >= workflow.steps.length) {
          // Workflow completed
          get().completeWorkflow(workflowId, stepResult);
          return true;
        }
        
        set(state => ({
          activeWorkflows: state.activeWorkflows.map(w =>
            w.id === workflowId
              ? { ...w, currentStep: nextStep, metadata: { ...w.metadata, stepResult } }
              : w
          )
        }));
        
        return true;
      },

      cancelWorkflow: (workflowId: string, reason: string) => {
        set(state => ({
          activeWorkflows: state.activeWorkflows.map(w =>
            w.id === workflowId
              ? { ...w, status: 'cancelled', metadata: { ...w.metadata, cancelReason: reason } }
              : w
          )
        }));
      },

      completeWorkflow: (workflowId: string, result?: any) => {
        const state = get();
        const workflow = state.activeWorkflows.find(w => w.id === workflowId);
        
        if (workflow) {
          const completedWorkflow: WorkflowCoordination = {
            ...workflow,
            status: 'completed',
            completedAt: new Date(),
            metadata: { ...workflow.metadata, result }
          };
          
          set(state => ({
            activeWorkflows: state.activeWorkflows.filter(w => w.id !== workflowId),
            workflowHistory: [...state.workflowHistory, completedWorkflow]
          }));
          
          // Update module states to remove this workflow
          workflow.participantModules.forEach(moduleId => {
            const moduleState = state.moduleStates[moduleId];
            if (moduleState) {
              get().updateModuleState(moduleId, {
                activeWorkflows: moduleState.activeWorkflows.filter(id => id !== workflowId)
              });
            }
          });
        }
      },

      // Analysis and pattern detection
      analyzeModuleInteractions: () => {
        // This would analyze module interaction patterns
        console.log('Analyzing module interactions...');
      },

      detectPatterns: () => {
        // This would detect patterns in cross-module usage
        console.log('Detecting usage patterns...');
      },

      // Utility
      getModuleRelationships: (moduleId: string) => {
        const state = get();
        return state.relationships.filter(
          r => r.sourceModule === moduleId || r.targetModule === moduleId
        );
      },

      getActiveWorkflowsForModule: (moduleId: string) => {
        const state = get();
        return state.activeWorkflows.filter(
          w => w.participantModules.includes(moduleId) || w.initiatorModule === moduleId
        );
      },

      getInsightsForModule: (moduleId: string) => {
        const state = get();
        return state.crossModuleInsights.filter(
          i => i.affectedModules.includes(moduleId)
        );
      },

      exportCoordinationData: () => {
        const state = get();
        return {
          relationships: state.relationships,
          insights: state.crossModuleInsights,
          workflows: [...state.activeWorkflows, ...state.workflowHistory],
          patterns: state.detectedPatterns
        };
      },

      clearOldData: () => {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 30); // 30 days ago
        
        set(state => ({
          crossModuleInsights: state.crossModuleInsights.filter(
            i => i.timestamp > cutoffDate && (!i.expiresAt || i.expiresAt > new Date())
          ),
          workflowHistory: state.workflowHistory.filter(
            w => w.completedAt && w.completedAt > cutoffDate
          )
        }));
      }
    }),
    {
      name: 'cross-module-coordinator',
      partialize: (state) => ({
        relationships: state.relationships,
        moduleStates: state.moduleStates,
        coordinationEnabled: state.coordinationEnabled,
        analysisInterval: state.analysisInterval,
        // Don't persist active workflows or temporary data
      })
    }
  )
);

// Hook for module-specific coordination
export const useModuleCoordination = (moduleId: string) => {
  const store = useCrossModuleCoordinatorStore();
  
  React.useEffect(() => {
    // Register module with default capabilities
    if (!store.moduleStates[moduleId]) {
      store.registerModule(moduleId, {
        canInitiateWorkflows: true,
        canReceiveWorkflows: true,
        canProvideData: true,
        canConsumeData: true,
        autonomyLevel: 'assisted'
      });
    }
    
    return () => {
      store.deactivateModule(moduleId);
    };
  }, [moduleId, store]);
  
  return {
    moduleState: store.moduleStates[moduleId],
    relationships: store.getModuleRelationships(moduleId),
    activeWorkflows: store.getActiveWorkflowsForModule(moduleId),
    insights: store.getInsightsForModule(moduleId),
    
    // Actions
    updateState: (updates: Partial<ModuleCoordinationState>) => 
      store.updateModuleState(moduleId, updates),
    
    initiateWorkflow: (workflow: Omit<WorkflowCoordination, 'id' | 'status' | 'currentStep' | 'initiatorModule'>) =>
      store.initiateWorkflow({ ...workflow, initiatorModule: moduleId }),
    
    generateInsights: () => store.generateCrossModuleInsights(),
    
    addRelationship: (relationship: Omit<ModuleRelationship, 'id' | 'sourceModule'>) =>
      store.addRelationship({ ...relationship, sourceModule: moduleId })
  };
};

export default useCrossModuleCoordinatorStore;