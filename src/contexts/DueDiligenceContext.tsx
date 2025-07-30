'use client'

import React, { createContext, useContext, useReducer, useCallback } from 'react'
import { 
  DueDiligenceProject, 
  DueDiligenceFinding, 
  DueDiligenceRisk,
  DueDiligenceTask,
  DueDiligenceDocument,
  DueDiligenceInterview,
  DueDiligenceDashboardMetrics,
  AIInsight
} from '@/types/due-diligence'

// Context State Type
interface DueDiligenceState {
  // Data
  projects: DueDiligenceProject[]
  currentProject?: DueDiligenceProject
  findings: DueDiligenceFinding[]
  risks: DueDiligenceRisk[]
  tasks: DueDiligenceTask[]
  documents: DueDiligenceDocument[]
  interviews: DueDiligenceInterview[]
  insights: AIInsight[]
  
  // UI State
  selectedProjectId?: string
  activeTab: DDTab
  filters: DDFilters
  sortBy: DDSortBy
  searchQuery: string
  
  // Loading and error states
  loading: boolean
  error?: string
  
  // Dashboard metrics
  metrics?: DueDiligenceDashboardMetrics
}

// Action Types
type DueDiligenceAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | undefined }
  | { type: 'SET_PROJECTS'; payload: DueDiligenceProject[] }
  | { type: 'SET_CURRENT_PROJECT'; payload: DueDiligenceProject | undefined }
  | { type: 'SELECT_PROJECT'; payload: string }
  | { type: 'SET_ACTIVE_TAB'; payload: DDTab }
  | { type: 'SET_FILTERS'; payload: DDFilters }
  | { type: 'SET_SORT_BY'; payload: DDSortBy }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FINDINGS'; payload: DueDiligenceFinding[] }
  | { type: 'ADD_FINDING'; payload: DueDiligenceFinding }
  | { type: 'UPDATE_FINDING'; payload: DueDiligenceFinding }
  | { type: 'DELETE_FINDING'; payload: string }
  | { type: 'SET_RISKS'; payload: DueDiligenceRisk[] }
  | { type: 'ADD_RISK'; payload: DueDiligenceRisk }
  | { type: 'UPDATE_RISK'; payload: DueDiligenceRisk }
  | { type: 'DELETE_RISK'; payload: string }
  | { type: 'SET_TASKS'; payload: DueDiligenceTask[] }
  | { type: 'ADD_TASK'; payload: DueDiligenceTask }
  | { type: 'UPDATE_TASK'; payload: DueDiligenceTask }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_DOCUMENTS'; payload: DueDiligenceDocument[] }
  | { type: 'ADD_DOCUMENT'; payload: DueDiligenceDocument }
  | { type: 'UPDATE_DOCUMENT'; payload: DueDiligenceDocument }
  | { type: 'DELETE_DOCUMENT'; payload: string }
  | { type: 'SET_INTERVIEWS'; payload: DueDiligenceInterview[] }
  | { type: 'ADD_INTERVIEW'; payload: DueDiligenceInterview }
  | { type: 'UPDATE_INTERVIEW'; payload: DueDiligenceInterview }
  | { type: 'DELETE_INTERVIEW'; payload: string }
  | { type: 'SET_INSIGHTS'; payload: AIInsight[] }
  | { type: 'ADD_INSIGHT'; payload: AIInsight }
  | { type: 'DISMISS_INSIGHT'; payload: string }
  | { type: 'SET_METRICS'; payload: DueDiligenceDashboardMetrics }

// Supporting Types
export type DDTab = 
  | 'overview'
  | 'tasks' 
  | 'findings'
  | 'risks'
  | 'documents'
  | 'interviews'
  | 'analytics'

export interface DDFilters {
  status?: string[]
  priority?: string[]
  assignedTo?: string[]
  category?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
}

export interface DDSortBy {
  field: string
  direction: 'asc' | 'desc'
}

// Context Type
interface DueDiligenceContextType {
  state: DueDiligenceState
  
  // Project actions
  setProjects: (projects: DueDiligenceProject[]) => void
  selectProject: (projectId: string | undefined) => void
  setCurrentProject: (project: DueDiligenceProject | undefined) => void
  
  // UI actions
  setActiveTab: (tab: DDTab) => void
  setFilters: (filters: DDFilters) => void
  setSortBy: (sortBy: DDSortBy) => void
  setSearchQuery: (query: string) => void
  
  // Data actions
  addFinding: (finding: DueDiligenceFinding) => void
  updateFinding: (finding: DueDiligenceFinding) => void
  deleteFinding: (id: string) => void
  
  addRisk: (risk: DueDiligenceRisk) => void
  updateRisk: (risk: DueDiligenceRisk) => void
  deleteRisk: (id: string) => void
  
  addTask: (task: DueDiligenceTask) => void
  updateTask: (task: DueDiligenceTask) => void
  deleteTask: (id: string) => void
  
  addDocument: (document: DueDiligenceDocument) => void
  updateDocument: (document: DueDiligenceDocument) => void
  deleteDocument: (id: string) => void
  
  addInterview: (interview: DueDiligenceInterview) => void
  updateInterview: (interview: DueDiligenceInterview) => void
  deleteInterview: (id: string) => void
  
  addInsight: (insight: AIInsight) => void
  dismissInsight: (id: string) => void
  
  // Utility functions
  getFilteredProjects: () => DueDiligenceProject[]
  getFilteredFindings: () => DueDiligenceFinding[]
  getFilteredRisks: () => DueDiligenceRisk[]
  getFilteredTasks: () => DueDiligenceTask[]
  getFilteredDocuments: () => DueDiligenceDocument[]
  
  // Loading and error
  setLoading: (loading: boolean) => void
  setError: (error: string | undefined) => void
}

// Initial State
const initialState: DueDiligenceState = {
  projects: [],
  findings: [],
  risks: [],
  tasks: [],
  documents: [],
  interviews: [],
  insights: [],
  activeTab: 'overview',
  filters: {},
  sortBy: { field: 'updatedAt', direction: 'desc' },
  searchQuery: '',
  loading: false
}

// Reducer
function dueDiligenceReducer(state: DueDiligenceState, action: DueDiligenceAction): DueDiligenceState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
      
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
      
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload, loading: false }
      
    case 'SET_CURRENT_PROJECT':
      return { ...state, currentProject: action.payload }
      
    case 'SELECT_PROJECT':
      const selectedProject = action.payload ? state.projects.find(p => p.id === action.payload) : undefined
      return { 
        ...state, 
        selectedProjectId: action.payload || undefined,
        currentProject: selectedProject
      }
      
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload }
      
    case 'SET_FILTERS':
      return { ...state, filters: action.payload }
      
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload }
      
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload }
      
    case 'SET_FINDINGS':
      return { ...state, findings: action.payload }
      
    case 'ADD_FINDING':
      return { ...state, findings: [...state.findings, action.payload] }
      
    case 'UPDATE_FINDING':
      return {
        ...state,
        findings: state.findings.map(f => 
          f.id === action.payload.id ? action.payload : f
        )
      }
      
    case 'DELETE_FINDING':
      return {
        ...state,
        findings: state.findings.filter(f => f.id !== action.payload)
      }
      
    case 'SET_RISKS':
      return { ...state, risks: action.payload }
      
    case 'ADD_RISK':
      return { ...state, risks: [...state.risks, action.payload] }
      
    case 'UPDATE_RISK':
      return {
        ...state,
        risks: state.risks.map(r => 
          r.id === action.payload.id ? action.payload : r
        )
      }
      
    case 'DELETE_RISK':
      return {
        ...state,
        risks: state.risks.filter(r => r.id !== action.payload)
      }
      
    case 'SET_TASKS':
      return { ...state, tasks: action.payload }
      
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] }
      
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t => 
          t.id === action.payload.id ? action.payload : t
        )
      }
      
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== action.payload)
      }
      
    case 'SET_DOCUMENTS':
      return { ...state, documents: action.payload }
      
    case 'ADD_DOCUMENT':
      return { ...state, documents: [...state.documents, action.payload] }
      
    case 'UPDATE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.map(d => 
          d.id === action.payload.id ? action.payload : d
        )
      }
      
    case 'DELETE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter(d => d.id !== action.payload)
      }
      
    case 'SET_INTERVIEWS':
      return { ...state, interviews: action.payload }
      
    case 'ADD_INTERVIEW':
      return { ...state, interviews: [...state.interviews, action.payload] }
      
    case 'UPDATE_INTERVIEW':
      return {
        ...state,
        interviews: state.interviews.map(i => 
          i.id === action.payload.id ? action.payload : i
        )
      }
      
    case 'DELETE_INTERVIEW':
      return {
        ...state,
        interviews: state.interviews.filter(i => i.id !== action.payload)
      }
      
    case 'SET_INSIGHTS':
      return { ...state, insights: action.payload }
      
    case 'ADD_INSIGHT':
      return { ...state, insights: [...state.insights, action.payload] }
      
    case 'DISMISS_INSIGHT':
      return {
        ...state,
        insights: state.insights.map(i => 
          i.id === action.payload ? { ...i, dismissed: true } : i
        )
      }
      
    case 'SET_METRICS':
      return { ...state, metrics: action.payload }
      
    default:
      return state
  }
}

// Context
const DueDiligenceContext = createContext<DueDiligenceContextType | undefined>(undefined)

// Provider Component
export function DueDiligenceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(dueDiligenceReducer, initialState)

  // Initialize with sample projects for demo purposes
  React.useEffect(() => {
    const sampleProjects: DueDiligenceProject[] = [
      {
        id: '1',
        dealId: 'DEAL-001',
        name: 'TechCorp Acquisition',
        description: 'Due diligence for strategic technology acquisition',
        status: 'in-progress',
        stage: 'detailed',
        type: 'buyout',
        priority: 'high',
        startDate: new Date('2025-07-15'),
        targetDate: new Date('2025-08-15'),
        assignedToId: 'user-1',
        createdAt: new Date('2025-07-15'),
        updatedAt: new Date('2025-07-30')
      },
      {
        id: '2',
        dealId: 'DEAL-002',
        name: 'RetailCo Investment Review',
        description: 'Commercial due diligence for retail chain investment',
        status: 'active',
        stage: 'preliminary',
        type: 'growth',
        priority: 'critical',
        startDate: new Date('2025-07-10'),
        targetDate: new Date('2025-08-10'),
        assignedToId: 'user-2',
        createdAt: new Date('2025-07-10'),
        updatedAt: new Date('2025-07-29')
      },
      {
        id: '3',
        dealId: 'DEAL-003',
        name: 'HealthCo Merger Analysis',
        description: 'Healthcare sector merger due diligence',
        status: 'completed',
        stage: 'final',
        type: 'buyout',
        priority: 'medium',
        startDate: new Date('2025-06-20'),
        targetDate: new Date('2025-07-20'),
        completedDate: new Date('2025-07-18'),
        assignedToId: 'user-3',
        createdAt: new Date('2025-06-20'),
        updatedAt: new Date('2025-07-18')
      },
      {
        id: '4',
        dealId: 'DEAL-004',
        name: 'FinTech Startup DD',
        description: 'Early-stage fintech due diligence',
        status: 'planning',
        stage: 'initial',
        type: 'venture',
        priority: 'medium',
        startDate: new Date('2025-07-25'),
        targetDate: new Date('2025-08-25'),
        assignedToId: 'user-4',
        createdAt: new Date('2025-07-25'),
        updatedAt: new Date('2025-07-28')
      }
    ]
    
    dispatch({ type: 'SET_PROJECTS', payload: sampleProjects })
  }, [])
  
  // Actions
  const setProjects = useCallback((projects: DueDiligenceProject[]) => {
    dispatch({ type: 'SET_PROJECTS', payload: projects })
  }, [])
  
  const selectProject = useCallback((projectId: string | undefined) => {
    if (projectId === undefined) {
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: undefined })
      dispatch({ type: 'SELECT_PROJECT', payload: '' })
    } else {
      dispatch({ type: 'SELECT_PROJECT', payload: projectId })
    }
  }, [])
  
  const setCurrentProject = useCallback((project: DueDiligenceProject | undefined) => {
    dispatch({ type: 'SET_CURRENT_PROJECT', payload: project })
  }, [])
  
  const setActiveTab = useCallback((tab: DDTab) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab })
  }, [])
  
  const setFilters = useCallback((filters: DDFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters })
  }, [])
  
  const setSortBy = useCallback((sortBy: DDSortBy) => {
    dispatch({ type: 'SET_SORT_BY', payload: sortBy })
  }, [])
  
  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query })
  }, [])
  
  // Data manipulation actions
  const addFinding = useCallback((finding: DueDiligenceFinding) => {
    dispatch({ type: 'ADD_FINDING', payload: finding })
  }, [])
  
  const updateFinding = useCallback((finding: DueDiligenceFinding) => {
    dispatch({ type: 'UPDATE_FINDING', payload: finding })
  }, [])
  
  const deleteFinding = useCallback((id: string) => {
    dispatch({ type: 'DELETE_FINDING', payload: id })
  }, [])
  
  const addRisk = useCallback((risk: DueDiligenceRisk) => {
    dispatch({ type: 'ADD_RISK', payload: risk })
  }, [])
  
  const updateRisk = useCallback((risk: DueDiligenceRisk) => {
    dispatch({ type: 'UPDATE_RISK', payload: risk })
  }, [])
  
  const deleteRisk = useCallback((id: string) => {
    dispatch({ type: 'DELETE_RISK', payload: id })
  }, [])
  
  const addTask = useCallback((task: DueDiligenceTask) => {
    dispatch({ type: 'ADD_TASK', payload: task })
  }, [])
  
  const updateTask = useCallback((task: DueDiligenceTask) => {
    dispatch({ type: 'UPDATE_TASK', payload: task })
  }, [])
  
  const deleteTask = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id })
  }, [])
  
  const addDocument = useCallback((document: DueDiligenceDocument) => {
    dispatch({ type: 'ADD_DOCUMENT', payload: document })
  }, [])
  
  const updateDocument = useCallback((document: DueDiligenceDocument) => {
    dispatch({ type: 'UPDATE_DOCUMENT', payload: document })
  }, [])
  
  const deleteDocument = useCallback((id: string) => {
    dispatch({ type: 'DELETE_DOCUMENT', payload: id })
  }, [])
  
  const addInterview = useCallback((interview: DueDiligenceInterview) => {
    dispatch({ type: 'ADD_INTERVIEW', payload: interview })
  }, [])
  
  const updateInterview = useCallback((interview: DueDiligenceInterview) => {
    dispatch({ type: 'UPDATE_INTERVIEW', payload: interview })
  }, [])
  
  const deleteInterview = useCallback((id: string) => {
    dispatch({ type: 'DELETE_INTERVIEW', payload: id })
  }, [])
  
  const addInsight = useCallback((insight: AIInsight) => {
    dispatch({ type: 'ADD_INSIGHT', payload: insight })
  }, [])
  
  const dismissInsight = useCallback((id: string) => {
    dispatch({ type: 'DISMISS_INSIGHT', payload: id })
  }, [])
  
  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }, [])
  
  const setError = useCallback((error: string | undefined) => {
    dispatch({ type: 'SET_ERROR', payload: error })
  }, [])
  
  // Utility functions
  const getFilteredProjects = useCallback((): DueDiligenceProject[] => {
    let filtered = state.projects
    
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase()
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      )
    }
    
    if (state.filters.status && state.filters.status.length > 0) {
      filtered = filtered.filter(p => state.filters.status!.includes(p.status))
    }
    
    if (state.filters.priority && state.filters.priority.length > 0) {
      filtered = filtered.filter(p => state.filters.priority!.includes(p.priority))
    }
    
    // Sort
    filtered.sort((a, b) => {
      const aValue = a[state.sortBy.field as keyof DueDiligenceProject]
      const bValue = b[state.sortBy.field as keyof DueDiligenceProject]
      
      if (!aValue || !bValue) return 0
      
      if (state.sortBy.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
    
    return filtered
  }, [state.projects, state.searchQuery, state.filters, state.sortBy])
  
  const getFilteredFindings = useCallback((): DueDiligenceFinding[] => {
    return state.findings.filter(f => 
      !state.selectedProjectId || f.projectId === state.selectedProjectId
    )
  }, [state.findings, state.selectedProjectId])
  
  const getFilteredRisks = useCallback((): DueDiligenceRisk[] => {
    return state.risks.filter(r => 
      !state.selectedProjectId || r.projectId === state.selectedProjectId
    )
  }, [state.risks, state.selectedProjectId])
  
  const getFilteredTasks = useCallback((): DueDiligenceTask[] => {
    return state.tasks.filter(t => 
      !state.selectedProjectId || t.projectId === state.selectedProjectId
    )
  }, [state.tasks, state.selectedProjectId])
  
  const getFilteredDocuments = useCallback((): DueDiligenceDocument[] => {
    return state.documents.filter(d => 
      !state.selectedProjectId || d.projectId === state.selectedProjectId
    )
  }, [state.documents, state.selectedProjectId])
  
  const contextValue: DueDiligenceContextType = {
    state,
    setProjects,
    selectProject,
    setCurrentProject,
    setActiveTab,
    setFilters,
    setSortBy,
    setSearchQuery,
    addFinding,
    updateFinding,
    deleteFinding,
    addRisk,
    updateRisk,
    deleteRisk,
    addTask,
    updateTask,
    deleteTask,
    addDocument,
    updateDocument,
    deleteDocument,
    addInterview,
    updateInterview,
    deleteInterview,
    addInsight,
    dismissInsight,
    getFilteredProjects,
    getFilteredFindings,
    getFilteredRisks,
    getFilteredTasks,
    getFilteredDocuments,
    setLoading,
    setError
  }
  
  return (
    <DueDiligenceContext.Provider value={contextValue}>
      {children}
    </DueDiligenceContext.Provider>
  )
}

// Hook
export function useDueDiligence() {
  const context = useContext(DueDiligenceContext)
  if (context === undefined) {
    throw new Error('useDueDiligence must be used within a DueDiligenceProvider')
  }
  return context
}