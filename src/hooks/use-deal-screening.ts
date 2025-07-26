import { useState, useEffect, useCallback } from 'react';
import {
  DealOpportunity,
  DealScreeningResult,
  AIRecommendation,
  DealScore,
  UseDealScreeningOptions,
  DealScreeningActions,
  DealScreeningState,
  AutomatedAction,
  PendingApproval
} from '@/types/deal-screening';

const API_BASE = '/api/deal-screening';

export function useDealScreening(options: UseDealScreeningOptions = {}) {
  const {
    mode = 'traditional',
    autoLoad = true,
    enableAI = true
  } = options;

  // State
  const [state, setState] = useState<Partial<DealScreeningState>>({
    templates: [],
    activeTemplate: null,
    opportunities: [],
    activeOpportunity: null,
    screeningResults: [],
    historicalDeals: [],
    comparisonList: [],
    navigationState: {
      mode,
      showAIPanel: mode !== 'traditional',
      activeOpportunityId: undefined,
      activeView: 'dashboard',
      sidebarCollapsed: false,
    },
    aiState: {
      recommendations: [],
      processingTasks: [],
      automatedActions: [],
      pendingApprovals: [],
    },
    isLoading: false,
    error: null,
    metrics: {
      totalOpportunities: 0,
      activeScreenings: 0,
      completedScreenings: 0,
      averageScreeningTime: 0,
      conversionRate: 0,
      aiEfficiencyGains: 0,
    },
  });

  // API calls
  const fetchOpportunities = useCallback(async (filters?: Record<string, string>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE}/opportunities?${params}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch opportunities');
      }
      
      setState(prev => ({
        ...prev,
        opportunities: data.data,
        isLoading: false,
        metrics: {
          ...prev.metrics!,
          totalOpportunities: data.data.length,
          activeScreenings: data.data.filter((o: DealOpportunity) => o.status === 'screening').length,
          completedScreenings: data.data.filter((o: DealOpportunity) => ['approved', 'rejected', 'closed'].includes(o.status)).length,
        }
      }));
      
      return data.data;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }));
      throw error;
    }
  }, []);

  const fetchOpportunity = useCallback(async (id: string, includeAI = false) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const params = new URLSearchParams({
        includeAI: includeAI.toString(),
        includeSimilar: 'true'
      });
      
      const response = await fetch(`${API_BASE}/opportunities/${id}?${params}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch opportunity');
      }
      
      setState(prev => ({
        ...prev,
        activeOpportunity: data.data,
        isLoading: false,
        navigationState: {
          ...prev.navigationState!,
          activeOpportunityId: id,
        }
      }));
      
      return data.data;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }));
      throw error;
    }
  }, []);

  const fetchAIRecommendations = useCallback(async (opportunityId?: string) => {
    if (!enableAI) return [];
    
    try {
      const params = new URLSearchParams();
      if (opportunityId) params.set('opportunityId', opportunityId);
      
      const response = await fetch(`${API_BASE}/ai/recommendations?${params}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch AI recommendations');
      }
      
      setState(prev => ({
        ...prev,
        aiState: {
          ...prev.aiState!,
          recommendations: data.data,
        }
      }));
      
      return data.data;
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      return [];
    }
  }, [enableAI]);

  const fetchScreeningData = useCallback(async (opportunityId: string) => {
    try {
      const response = await fetch(`${API_BASE}/opportunities/${opportunityId}/screen`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch screening data');
      }
      
      setState(prev => ({
        ...prev,
        screeningResults: data.data.screeningResults,
      }));
      
      return data.data;
    } catch (error) {
      console.error('Error fetching screening data:', error);
      throw error;
    }
  }, []);

  // Actions
  const actions: DealScreeningActions = {
    createOpportunity: useCallback(async (opportunityData: Partial<DealOpportunity>) => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        const response = await fetch(`${API_BASE}/opportunities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            ...opportunityData, 
            enableAI: enableAI && mode !== 'traditional' 
          }),
        });
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to create opportunity');
        }
        
        // Refresh opportunities list
        await fetchOpportunities();
        
        setState(prev => ({ ...prev, isLoading: false }));
        return data.data;
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }));
        throw error;
      }
    }, [enableAI, mode, fetchOpportunities]),

    updateOpportunity: useCallback(async (id: string, updates: Partial<DealOpportunity>) => {
      try {
        const response = await fetch(`${API_BASE}/opportunities/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to update opportunity');
        }
        
        setState(prev => ({
          ...prev,
          opportunities: prev.opportunities!.map(opp => 
            opp.id === id ? data.data : opp
          ),
          activeOpportunity: prev.activeOpportunity?.id === id ? data.data : prev.activeOpportunity,
        }));
        
        return data.data;
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }));
        throw error;
      }
    }, []),

    deleteOpportunity: useCallback(async (id: string) => {
      try {
        const response = await fetch(`${API_BASE}/opportunities/${id}`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to delete opportunity');
        }
        
        setState(prev => ({
          ...prev,
          opportunities: prev.opportunities!.filter(opp => opp.id !== id),
          activeOpportunity: prev.activeOpportunity?.id === id ? null : prev.activeOpportunity,
        }));
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }));
        throw error;
      }
    }, []),

    startScreening: useCallback(async (opportunityId: string, templateId: string) => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        const response = await fetch(`${API_BASE}/opportunities/${opportunityId}/screen`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            templateId, 
            mode: state.navigationState?.mode || 'traditional',
            scores: [] // Initial empty scores
          }),
        });
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to start screening');
        }
        
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          screeningResults: [...(prev.screeningResults || []), data.data.screeningResult]
        }));
        
        return data.data.screeningResult;
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }));
        throw error;
      }
    }, [state.navigationState?.mode]),

    updateScreeningScore: useCallback(async (resultId: string, scores: DealScore[]) => {
      try {
        const response = await fetch(`${API_BASE}/opportunities/${state.activeOpportunity?.id}/screen`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            screeningResultId: resultId,
            updates: { criteriaScores: scores }
          }),
        });
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to update screening');
        }
        
        setState(prev => ({
          ...prev,
          screeningResults: prev.screeningResults!.map(result => 
            result.id === resultId ? data.data.screeningResult : result
          ),
        }));
        
        return data.data.screeningResult;
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }));
        throw error;
      }
    }, [state.activeOpportunity?.id]),

    completeScreening: useCallback(async (resultId: string, notes: string) => {
      try {
        const response = await fetch(`${API_BASE}/opportunities/${state.activeOpportunity?.id}/screen`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            screeningResultId: resultId,
            updates: { notes },
            autoComplete: true
          }),
        });
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to complete screening');
        }
        
        setState(prev => ({
          ...prev,
          screeningResults: prev.screeningResults!.map(result => 
            result.id === resultId ? data.data.screeningResult : result
          ),
          activeOpportunity: data.data.updatedOpportunity,
        }));
        
        return data.data.screeningResult;
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }));
        throw error;
      }
    }, [state.activeOpportunity?.id]),

    generateAIRecommendations: useCallback(async (opportunityId: string) => {
      return await fetchAIRecommendations(opportunityId);
    }, [fetchAIRecommendations]),

    executeAutomation: useCallback(async (actionId: string) => {
      try {
        // Find the action in automatedActions
        const action = state.aiState?.automatedActions?.find(a => a.id === actionId);
        if (!action) {
          throw new Error('Action not found');
        }
        
        // Update action status to processing
        setState(prev => ({
          ...prev,
          aiState: {
            ...prev.aiState!,
            automatedActions: prev.aiState!.automatedActions.map(a => 
              a.id === actionId ? { ...a, status: 'processing' } : a
            ),
            processingTasks: [...prev.aiState!.processingTasks, actionId]
          }
        }));
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Complete the action
        setState(prev => ({
          ...prev,
          aiState: {
            ...prev.aiState!,
            automatedActions: prev.aiState!.automatedActions.map(a => 
              a.id === actionId ? { 
                ...a, 
                status: 'completed',
                completedAt: new Date().toISOString(),
                result: { success: true, message: 'Automation completed successfully' }
              } : a
            ),
            processingTasks: prev.aiState!.processingTasks.filter(id => id !== actionId)
          }
        }));
        
        return {
          id: actionId,
          status: 'completed',
          result: { success: true }
        };
      } catch (error) {
        // Mark action as failed
        setState(prev => ({
          ...prev,
          aiState: {
            ...prev.aiState!,
            automatedActions: prev.aiState!.automatedActions.map(a => 
              a.id === actionId ? { 
                ...a, 
                status: 'failed',
                result: { error: error instanceof Error ? error.message : 'Unknown error' }
              } : a
            ),
            processingTasks: prev.aiState!.processingTasks.filter(id => id !== actionId)
          }
        }));
        throw error;
      }
    }, [state.aiState?.automatedActions]),

    approveAIAction: useCallback(async (approvalId: string) => {
      setState(prev => ({
        ...prev,
        aiState: {
          ...prev.aiState!,
          pendingApprovals: prev.aiState!.pendingApprovals.filter(p => p.id !== approvalId)
        }
      }));
    }, []),

    switchMode: useCallback((newMode: 'traditional' | 'assisted' | 'autonomous') => {
      setState(prev => ({
        ...prev,
        navigationState: {
          ...prev.navigationState!,
          mode: newMode,
          showAIPanel: newMode !== 'traditional',
        }
      }));
      
      // Fetch AI recommendations for non-traditional modes
      if (newMode !== 'traditional' && enableAI) {
        fetchAIRecommendations(state.navigationState?.activeOpportunityId);
      }
    }, [enableAI, fetchAIRecommendations, state.navigationState?.activeOpportunityId]),

    setActiveOpportunity: useCallback((opportunityId: string | null) => {
      setState(prev => ({
        ...prev,
        navigationState: {
          ...prev.navigationState!,
          activeOpportunityId: opportunityId || undefined,
        },
        activeOpportunity: opportunityId 
          ? prev.opportunities!.find(opp => opp.id === opportunityId) || null
          : null,
      }));
      
      // Fetch AI recommendations for the active opportunity
      if (opportunityId && enableAI && state.navigationState?.mode !== 'traditional') {
        fetchAIRecommendations(opportunityId);
      }
    }, [enableAI, fetchAIRecommendations, state.navigationState?.mode]),

    toggleAIPanel: useCallback(() => {
      setState(prev => ({
        ...prev,
        navigationState: {
          ...prev.navigationState!,
          showAIPanel: !prev.navigationState!.showAIPanel,
        }
      }));
    }, []),
  };

  // Load initial data
  useEffect(() => {
    if (autoLoad) {
      fetchOpportunities();
      if (enableAI && mode !== 'traditional') {
        fetchAIRecommendations();
      }
    }
  }, [autoLoad, enableAI, mode, fetchOpportunities, fetchAIRecommendations]);

  return {
    // State
    ...state,
    
    // Actions
    ...actions,
    
    // Utility functions
    fetchOpportunities,
    fetchOpportunity,
    fetchAIRecommendations,
    fetchScreeningData,
    
    // Computed values
    isTraditionalMode: state.navigationState?.mode === 'traditional',
    isAssistedMode: state.navigationState?.mode === 'assisted',
    isAutonomousMode: state.navigationState?.mode === 'autonomous',
    hasAICapabilities: enableAI && state.navigationState?.mode !== 'traditional',
  };
}