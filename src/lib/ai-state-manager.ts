/**
 * Centralized AI State Management System
 * 
 * This module provides standardized AI state management patterns across all modules
 * to ensure consistent behavior, recommendations, and autonomous actions.
 */

import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Base AI Recommendation Interface
export interface AIRecommendation {
  id: string;
  moduleContext: string;
  type: 'optimization' | 'risk' | 'compliance' | 'automation' | 'insight' | 'workflow';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  actions: AIAction[];
  confidence: number; // 0-1
  estimatedImpact?: string;
  estimatedTimeSaving?: number; // in hours
  riskLevel?: 'low' | 'medium' | 'high';
  timestamp: Date;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

// AI Action Interface
export interface AIAction {
  id: string;
  label: string;
  action: string;
  primary?: boolean;
  estimatedTimeSaving?: number; // in hours
  riskLevel?: 'low' | 'medium' | 'high';
  requiresApproval?: boolean;
  metadata?: Record<string, any>;
}

// AI Processing Task
export interface AIProcessingTask {
  id: string;
  moduleContext: string;
  type: string;
  description: string;
  progress: number; // 0-100
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  estimatedCompletion: Date;
  result?: any;
  error?: string;
  metadata?: Record<string, any>;
}

// AI Automated Action
export interface AIAutomatedAction {
  id: string;
  moduleContext: string;
  action: string;
  description: string;
  timestamp: Date;
  status: 'completed' | 'in_progress' | 'failed' | 'rolled_back';
  rollbackable: boolean;
  impact?: string;
  rollbackData?: any;
  metadata?: Record<string, any>;
}

// AI Pending Approval
export interface AIPendingApproval {
  id: string;
  moduleContext: string;
  action: string;
  description: string;
  risk: 'low' | 'medium' | 'high';
  impact: string[];
  estimatedBenefit?: string;
  requestedAt: Date;
  expiresAt?: Date;
  requesterContext?: Record<string, any>;
  metadata?: Record<string, any>;
}

// AI Learning Data Point
export interface AILearningData {
  id: string;
  moduleContext: string;
  event: string;
  outcome: 'positive' | 'negative' | 'neutral';
  userFeedback?: 'helpful' | 'not_helpful' | 'harmful';
  context: Record<string, any>;
  timestamp: Date;
}

// Module-specific AI State
export interface ModuleAIState {
  recommendations: AIRecommendation[];
  processingTasks: AIProcessingTask[];
  automatedActions: AIAutomatedAction[];
  pendingApprovals: AIPendingApproval[];
  learningData: AILearningData[];
  isActive: boolean;
  lastActivity: Date;
  configuration: {
    enableAutoActions: boolean;
    enableProactiveRecommendations: boolean;
    riskTolerance: 'low' | 'medium' | 'high';
    notificationsEnabled: boolean;
    maxPendingApprovals: number;
    autoExpireRecommendations: boolean;
  };
}

// Global AI State
interface GlobalAIState {
  modules: Record<string, ModuleAIState>;
  globalRecommendations: AIRecommendation[];
  crossModuleInsights: Array<{
    id: string;
    title: string;
    description: string;
    affectedModules: string[];
    confidence: number;
    timestamp: Date;
  }>;
  systemLearning: {
    userPreferences: Record<string, any>;
    commonPatterns: Array<{
      pattern: string;
      frequency: number;
      modules: string[];
    }>;
    efficacyMetrics: Record<string, {
      totalRecommendations: number;
      acceptedRecommendations: number;
      rejectedRecommendations: number;
      automatedActions: number;
      rollbacks: number;
      userSatisfactionScore: number;
    }>;
  };
  configuration: {
    globalAIEnabled: boolean;
    crossModuleInsightsEnabled: boolean;
    learningEnabled: boolean;
    privacyMode: boolean;
  };
}

// AI State Store Actions
interface AIStateActions {
  // Module Management
  initializeModule: (moduleName: string) => void;
  activateModule: (moduleName: string) => void;
  deactivateModule: (moduleName: string) => void;
  updateModuleConfiguration: (moduleName: string, config: Partial<ModuleAIState['configuration']>) => void;

  // Recommendation Management
  addRecommendation: (moduleName: string, recommendation: Omit<AIRecommendation, 'id' | 'timestamp'>) => string;
  dismissRecommendation: (moduleName: string, recommendationId: string) => void;
  acceptRecommendation: (moduleName: string, recommendationId: string) => void;
  expireOldRecommendations: (moduleName?: string) => void;

  // Action Management
  addProcessingTask: (moduleName: string, task: Omit<AIProcessingTask, 'id'>) => string;
  updateProcessingTask: (moduleName: string, taskId: string, updates: Partial<AIProcessingTask>) => void;
  completeProcessingTask: (moduleName: string, taskId: string, result?: any) => void;
  failProcessingTask: (moduleName: string, taskId: string, error: string) => void;

  addAutomatedAction: (moduleName: string, action: Omit<AIAutomatedAction, 'id' | 'timestamp'>) => string;
  rollbackAutomatedAction: (moduleName: string, actionId: string) => boolean;

  addPendingApproval: (moduleName: string, approval: Omit<AIPendingApproval, 'id' | 'requestedAt'>) => string;
  approvePendingAction: (moduleName: string, approvalId: string) => void;
  rejectPendingAction: (moduleName: string, approvalId: string) => void;
  expirePendingApprovals: (moduleName?: string) => void;

  // Learning Management
  recordLearningData: (moduleName: string, data: Omit<AILearningData, 'id' | 'timestamp'>) => void;
  recordUserFeedback: (moduleName: string, recommendationId: string, feedback: AILearningData['userFeedback']) => void;

  // Cross-module Insights
  generateCrossModuleInsights: () => void;
  clearExpiredData: () => void;

  // Analytics
  getModuleMetrics: (moduleName: string) => ModuleAIState['configuration'] & {
    activeRecommendations: number;
    activeProcessingTasks: number;
    pendingApprovals: number;
    efficacyScore: number;
  };
  getGlobalMetrics: () => {
    totalActiveModules: number;
    totalRecommendations: number;
    totalAutomatedActions: number;
    overallEfficacyScore: number;
    userSatisfactionScore: number;
  };

  // Utility
  resetModule: (moduleName: string) => void;
  resetAllModules: () => void;
  exportModuleData: (moduleName: string) => ModuleAIState;
  importModuleData: (moduleName: string, data: ModuleAIState) => void;
}

type AIStateStore = GlobalAIState & AIStateActions;

// Default module configuration
const defaultModuleConfig: ModuleAIState['configuration'] = {
  enableAutoActions: false,
  enableProactiveRecommendations: true,
  riskTolerance: 'medium',
  notificationsEnabled: true,
  maxPendingApprovals: 5,
  autoExpireRecommendations: true,
};

// Default module state
const createDefaultModuleState = (): ModuleAIState => ({
  recommendations: [],
  processingTasks: [],
  automatedActions: [],
  pendingApprovals: [],
  learningData: [],
  isActive: false,
  lastActivity: new Date(),
  configuration: { ...defaultModuleConfig }
});

// Utility function to generate IDs
const generateId = () => `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Main AI State Store
export const useAIStateStore = create<AIStateStore>()(
  persist(
    (set, get) => ({
      // Initial State
      modules: {},
      globalRecommendations: [],
      crossModuleInsights: [],
      systemLearning: {
        userPreferences: {},
        commonPatterns: [],
        efficacyMetrics: {}
      },
      configuration: {
        globalAIEnabled: true,
        crossModuleInsightsEnabled: true,
        learningEnabled: true,
        privacyMode: false
      },

      // Module Management
      initializeModule: (moduleName: string) => {
        set(state => ({
          modules: {
            ...state.modules,
            [moduleName]: state.modules[moduleName] || createDefaultModuleState()
          }
        }));
      },

      activateModule: (moduleName: string) => {
        set(state => ({
          modules: {
            ...state.modules,
            [moduleName]: {
              ...state.modules[moduleName],
              isActive: true,
              lastActivity: new Date()
            }
          }
        }));
      },

      deactivateModule: (moduleName: string) => {
        set(state => ({
          modules: {
            ...state.modules,
            [moduleName]: {
              ...state.modules[moduleName],
              isActive: false
            }
          }
        }));
      },

      updateModuleConfiguration: (moduleName: string, config) => {
        set(state => ({
          modules: {
            ...state.modules,
            [moduleName]: {
              ...state.modules[moduleName],
              configuration: {
                ...state.modules[moduleName]?.configuration,
                ...config
              }
            }
          }
        }));
      },

      // Recommendation Management
      addRecommendation: (moduleName: string, recommendation) => {
        const id = generateId();
        const fullRecommendation: AIRecommendation = {
          ...recommendation,
          id,
          timestamp: new Date(),
          moduleContext: moduleName
        };

        set(state => ({
          modules: {
            ...state.modules,
            [moduleName]: {
              ...state.modules[moduleName],
              recommendations: [...(state.modules[moduleName]?.recommendations || []), fullRecommendation],
              lastActivity: new Date()
            }
          }
        }));

        return id;
      },

      dismissRecommendation: (moduleName: string, recommendationId: string) => {
        set(state => ({
          modules: {
            ...state.modules,
            [moduleName]: {
              ...state.modules[moduleName],
              recommendations: state.modules[moduleName]?.recommendations.filter(r => r.id !== recommendationId) || []
            }
          }
        }));
      },

      acceptRecommendation: (moduleName: string, recommendationId: string) => {
        const state = get();
        const module = state.modules[moduleName];
        const recommendation = module?.recommendations.find(r => r.id === recommendationId);
        
        if (recommendation) {
          // Record positive learning data
          get().recordLearningData(moduleName, {
            event: 'recommendation_accepted',
            outcome: 'positive',
            context: { recommendationId, type: recommendation.type, confidence: recommendation.confidence }
          });
          
          // Remove recommendation
          get().dismissRecommendation(moduleName, recommendationId);
        }
      },

      expireOldRecommendations: (moduleName?: string) => {
        const now = new Date();
        
        set(state => {
          const newModules = { ...state.modules };
          
          const modulesToProcess = moduleName ? [moduleName] : Object.keys(newModules);
          
          modulesToProcess.forEach(modName => {
            if (newModules[modName]?.configuration.autoExpireRecommendations) {
              newModules[modName] = {
                ...newModules[modName],
                recommendations: newModules[modName].recommendations.filter(r => 
                  !r.expiresAt || r.expiresAt > now
                )
              };
            }
          });
          
          return { modules: newModules };
        });
      },

      // Processing Task Management
      addProcessingTask: (moduleName: string, task) => {
        const id = generateId();
        const fullTask: AIProcessingTask = { ...task, id };

        set(state => ({
          modules: {
            ...state.modules,
            [moduleName]: {
              ...state.modules[moduleName],
              processingTasks: [...(state.modules[moduleName]?.processingTasks || []), fullTask],
              lastActivity: new Date()
            }
          }
        }));

        return id;
      },

      updateProcessingTask: (moduleName: string, taskId: string, updates) => {
        set(state => ({
          modules: {
            ...state.modules,
            [moduleName]: {
              ...state.modules[moduleName],
              processingTasks: state.modules[moduleName]?.processingTasks.map(t => 
                t.id === taskId ? { ...t, ...updates } : t
              ) || []
            }
          }
        }));
      },

      completeProcessingTask: (moduleName: string, taskId: string, result) => {
        get().updateProcessingTask(moduleName, taskId, { 
          status: 'completed', 
          progress: 100,
          result 
        });
      },

      failProcessingTask: (moduleName: string, taskId: string, error) => {
        get().updateProcessingTask(moduleName, taskId, { 
          status: 'failed',
          error 
        });
      },

      // Automated Action Management
      addAutomatedAction: (moduleName: string, action) => {
        const id = generateId();
        const fullAction: AIAutomatedAction = {
          ...action,
          id,
          timestamp: new Date(),
          moduleContext: moduleName
        };

        set(state => ({
          modules: {
            ...state.modules,
            [moduleName]: {
              ...state.modules[moduleName],
              automatedActions: [...(state.modules[moduleName]?.automatedActions || []), fullAction],
              lastActivity: new Date()
            }
          }
        }));

        return id;
      },

      rollbackAutomatedAction: (moduleName: string, actionId: string) => {
        const state = get();
        const module = state.modules[moduleName];
        const action = module?.automatedActions.find(a => a.id === actionId);
        
        if (action && action.rollbackable) {
          set(state => ({
            modules: {
              ...state.modules,
              [moduleName]: {
                ...state.modules[moduleName],
                automatedActions: state.modules[moduleName]?.automatedActions.map(a =>
                  a.id === actionId ? { ...a, status: 'rolled_back' } : a
                ) || []
              }
            }
          }));
          
          return true;
        }
        
        return false;
      },

      // Pending Approval Management
      addPendingApproval: (moduleName: string, approval) => {
        const id = generateId();
        const fullApproval: AIPendingApproval = {
          ...approval,
          id,
          requestedAt: new Date(),
          moduleContext: moduleName
        };

        set(state => ({
          modules: {
            ...state.modules,
            [moduleName]: {
              ...state.modules[moduleName],
              pendingApprovals: [...(state.modules[moduleName]?.pendingApprovals || []), fullApproval],
              lastActivity: new Date()
            }
          }
        }));

        return id;
      },

      approvePendingAction: (moduleName: string, approvalId: string) => {
        set(state => ({
          modules: {
            ...state.modules,
            [moduleName]: {
              ...state.modules[moduleName],
              pendingApprovals: state.modules[moduleName]?.pendingApprovals.filter(p => p.id !== approvalId) || []
            }
          }
        }));
        
        // Record positive learning data
        get().recordLearningData(moduleName, {
          event: 'approval_granted',
          outcome: 'positive',
          context: { approvalId }
        });
      },

      rejectPendingAction: (moduleName: string, approvalId: string) => {
        set(state => ({
          modules: {
            ...state.modules,
            [moduleName]: {
              ...state.modules[moduleName],
              pendingApprovals: state.modules[moduleName]?.pendingApprovals.filter(p => p.id !== approvalId) || []
            }
          }
        }));
        
        // Record learning data
        get().recordLearningData(moduleName, {
          event: 'approval_rejected',
          outcome: 'negative',
          context: { approvalId }
        });
      },

      expirePendingApprovals: (moduleName?: string) => {
        const now = new Date();
        
        set(state => {
          const newModules = { ...state.modules };
          
          const modulesToProcess = moduleName ? [moduleName] : Object.keys(newModules);
          
          modulesToProcess.forEach(modName => {
            newModules[modName] = {
              ...newModules[modName],
              pendingApprovals: newModules[modName]?.pendingApprovals.filter(p => 
                !p.expiresAt || p.expiresAt > now
              ) || []
            };
          });
          
          return { modules: newModules };
        });
      },

      // Learning Management
      recordLearningData: (moduleName: string, data) => {
        const learningData: AILearningData = {
          ...data,
          id: generateId(),
          timestamp: new Date(),
          moduleContext: moduleName
        };

        set(state => ({
          modules: {
            ...state.modules,
            [moduleName]: {
              ...state.modules[moduleName],
              learningData: [...(state.modules[moduleName]?.learningData || []), learningData]
            }
          }
        }));
      },

      recordUserFeedback: (moduleName: string, recommendationId: string, feedback) => {
        get().recordLearningData(moduleName, {
          event: 'user_feedback',
          outcome: feedback === 'helpful' ? 'positive' : feedback === 'harmful' ? 'negative' : 'neutral',
          userFeedback: feedback,
          context: { recommendationId }
        });
      },

      // Cross-module Insights
      generateCrossModuleInsights: () => {
        // Implementation for cross-module analysis would go here
        // This is a placeholder for more sophisticated AI analysis
        console.log('Generating cross-module insights...');
      },

      clearExpiredData: () => {
        get().expireOldRecommendations();
        get().expirePendingApprovals();
      },

      // Analytics
      getModuleMetrics: (moduleName: string) => {
        const module = get().modules[moduleName];
        if (!module) {
          return {
            ...defaultModuleConfig,
            activeRecommendations: 0,
            activeProcessingTasks: 0,
            pendingApprovals: 0,
            efficacyScore: 0
          };
        }

        const learningData = module.learningData;
        const positiveEvents = learningData.filter(d => d.outcome === 'positive').length;
        const totalEvents = learningData.length;
        const efficacyScore = totalEvents > 0 ? (positiveEvents / totalEvents) * 100 : 0;

        return {
          ...module.configuration,
          activeRecommendations: module.recommendations.length,
          activeProcessingTasks: module.processingTasks.filter(t => t.status === 'processing' || t.status === 'queued').length,
          pendingApprovals: module.pendingApprovals.length,
          efficacyScore
        };
      },

      getGlobalMetrics: () => {
        const state = get();
        const modules = Object.values(state.modules);
        
        const totalActiveModules = modules.filter(m => m.isActive).length;
        const totalRecommendations = modules.reduce((sum, m) => sum + m.recommendations.length, 0);
        const totalAutomatedActions = modules.reduce((sum, m) => sum + m.automatedActions.length, 0);
        
        const allLearningData = modules.flatMap(m => m.learningData);
        const positiveEvents = allLearningData.filter(d => d.outcome === 'positive').length;
        const totalEvents = allLearningData.length;
        const overallEfficacyScore = totalEvents > 0 ? (positiveEvents / totalEvents) * 100 : 0;
        
        const helpfulFeedback = allLearningData.filter(d => d.userFeedback === 'helpful').length;
        const totalFeedback = allLearningData.filter(d => d.userFeedback).length;
        const userSatisfactionScore = totalFeedback > 0 ? (helpfulFeedback / totalFeedback) * 100 : 0;

        return {
          totalActiveModules,
          totalRecommendations,
          totalAutomatedActions,
          overallEfficacyScore,
          userSatisfactionScore
        };
      },

      // Utility
      resetModule: (moduleName: string) => {
        set(state => ({
          modules: {
            ...state.modules,
            [moduleName]: createDefaultModuleState()
          }
        }));
      },

      resetAllModules: () => {
        set(state => ({
          modules: Object.keys(state.modules).reduce((acc, key) => {
            acc[key] = createDefaultModuleState();
            return acc;
          }, {} as Record<string, ModuleAIState>)
        }));
      },

      exportModuleData: (moduleName: string) => {
        return get().modules[moduleName] || createDefaultModuleState();
      },

      importModuleData: (moduleName: string, data) => {
        set(state => ({
          modules: {
            ...state.modules,
            [moduleName]: data
          }
        }));
      }
    }),
    {
      name: 'ai-state-store',
      partialize: (state) => ({
        modules: state.modules,
        systemLearning: state.systemLearning,
        configuration: state.configuration
        // Don't persist cross-module insights as they should be regenerated
      })
    }
  )
);

// Convenience hooks for common operations
export const useModuleAI = (moduleName: string) => {
  const store = useAIStateStore();
  
  React.useEffect(() => {
    store.initializeModule(moduleName);
    store.activateModule(moduleName);
    
    return () => {
      store.deactivateModule(moduleName);
    };
  }, [moduleName, store]);

  return {
    recommendations: store.modules[moduleName]?.recommendations || [],
    processingTasks: store.modules[moduleName]?.processingTasks || [],
    automatedActions: store.modules[moduleName]?.automatedActions || [],
    pendingApprovals: store.modules[moduleName]?.pendingApprovals || [],
    configuration: store.modules[moduleName]?.configuration || defaultModuleConfig,
    isActive: store.modules[moduleName]?.isActive || false,
    
    // Actions
    addRecommendation: (rec: Omit<AIRecommendation, 'id' | 'timestamp' | 'moduleContext'>) => 
      store.addRecommendation(moduleName, rec),
    dismissRecommendation: (id: string) => store.dismissRecommendation(moduleName, id),
    acceptRecommendation: (id: string) => store.acceptRecommendation(moduleName, id),
    
    addAutomatedAction: (action: Omit<AIAutomatedAction, 'id' | 'timestamp' | 'moduleContext'>) => 
      store.addAutomatedAction(moduleName, action),
    
    recordFeedback: (recommendationId: string, feedback: AILearningData['userFeedback']) => 
      store.recordUserFeedback(moduleName, recommendationId, feedback),
    
    getMetrics: () => store.getModuleMetrics(moduleName)
  };
};

export default useAIStateStore;