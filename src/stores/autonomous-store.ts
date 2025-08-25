/**
 * Autonomous Mode Store - Project management, chat sessions, and autonomous-specific state
 * Extracted from the massive navigation store for better separation of concerns
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types for autonomous functionality
export interface Project {
  id: string
  name: string
  type: 'portfolio' | 'deal' | 'company' | 'report' | 'analysis' | 'dashboard' | 'workspace' | 'exit'
  status: 'active' | 'completed' | 'draft' | 'review'
  lastActivity: Date
  priority: 'high' | 'medium' | 'low'
  unreadMessages?: number
  metadata?: Record<string, any>
}

export interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface ChatSession {
  id: string
  projectId: string
  messages: ChatMessage[]
  lastActivity: Date
  title?: string
}

interface AutonomousState {
  // Project management
  projects: Record<string, Project[]>
  selectedProject: Project | null
  activeProjectType: string
  
  // Chat functionality
  chatSessions: Record<string, ChatSession>
  activeChatSession: string | null
  
  // UI state
  sidebarCollapsed: boolean
  contextPanelCollapsed: boolean
  
  // Settings
  autoExecuteActions: boolean
  notificationsEnabled: boolean
  preferredResponseLength: 'short' | 'medium' | 'long'
}

interface AutonomousActions {
  // Project management
  setActiveProjectType: (type: string) => void
  selectProject: (project: Project) => void
  updateProject: (projectId: string, updates: Partial<Project>) => void
  addProject: (projectType: string, project: Project) => void
  setProjectsForType: (projectType: string, projects: Project[]) => void
  
  // Chat session management
  createChatSession: (projectId: string) => string
  deleteChatSession: (sessionId: string) => void
  setActiveChatSession: (sessionId: string | null) => void
  updateChatSession: (sessionId: string, updates: Partial<ChatSession>) => void
  
  // UI actions
  toggleSidebar: () => void
  toggleContextPanel: () => void
  
  // Settings
  toggleAutoExecute: () => void
  toggleNotifications: () => void
  setResponseLength: (length: AutonomousState['preferredResponseLength']) => void
  
  // Utility actions
  clearAllSessions: () => void
  exportChatHistory: (sessionId: string) => string
  
  // Data loading
  loadProjectsForType: (projectType: string) => Promise<void>
  initializeProjects: () => void
  
  // Portfolio specific
  setPortfolioProjects: (projects: Project[]) => void
  
  // Exit specific
  setExitProjects: (projects: Project[]) => void
}

type AutonomousStore = AutonomousState & AutonomousActions

// Generate initial projects structure with mock data
const getInitialProjects = (): Record<string, Project[]> => {
  return {
    dashboard: [],
    portfolio: [],
    'due-diligence': [
      {
        id: 'dd-techcorp-2024',
        name: 'TechCorp Series B Due Diligence',
        type: 'company',
        status: 'active',
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        priority: 'high',
        unreadMessages: 3,
        metadata: {
          value: '$45M',
          progress: 67,
          team: ['Sarah Chen', 'Mike Rodriguez', 'Dr. Kim'],
          sector: 'Technology',
          dealType: 'Growth Equity',
          stage: 'Commercial Due Diligence'
        }
      },
      {
        id: 'dd-healthcare-direct',
        name: 'HealthTech Direct Investment DD',
        type: 'company',
        status: 'active',
        lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        priority: 'high',
        unreadMessages: 1,
        metadata: {
          value: '$28M',
          progress: 45,
          team: ['Emma Thompson', 'David Park'],
          sector: 'Healthcare',
          dealType: 'Direct Investment',
          stage: 'Financial Due Diligence'
        }
      },
      {
        id: 'dd-infrastructure-coinvest',
        name: 'Infrastructure Co-Investment DD',
        type: 'company',
        status: 'review',
        lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        priority: 'medium',
        metadata: {
          value: '$67M',
          progress: 89,
          team: ['James Wilson', 'Lisa Chang', 'Alex Kumar'],
          sector: 'Infrastructure',
          dealType: 'Co-Investment',
          stage: 'Legal Due Diligence'
        }
      },
      {
        id: 'dd-fintech-secondary',
        name: 'FinTech Secondary Purchase DD',
        type: 'company',
        status: 'completed',
        lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        priority: 'low',
        metadata: {
          value: '$35M',
          progress: 100,
          team: ['Rachel Green', 'Tom Martinez'],
          sector: 'Financial Services',
          dealType: 'Secondary',
          stage: 'Completed'
        }
      },
      {
        id: 'dd-cleantech-venture',
        name: 'CleanTech Venture Due Diligence',
        type: 'company',
        status: 'draft',
        lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        priority: 'medium',
        metadata: {
          value: '$22M',
          progress: 15,
          team: ['Sophie Davis'],
          sector: 'Clean Technology',
          dealType: 'Venture Capital',
          stage: 'Initial Assessment'
        }
      }
    ],
    workspace: [],
    'deal-screening': [],
    'deal-structuring': [],
    'advanced-analytics': []
  }
}

export const useAutonomousStore = create<AutonomousStore>()(
  persist(
    (set, get) => ({
      // Initial state
      projects: getInitialProjects(),
      selectedProject: null,
      activeProjectType: 'dashboard',
      chatSessions: {},
      activeChatSession: null,
      sidebarCollapsed: false,
      contextPanelCollapsed: false,
      autoExecuteActions: false,
      notificationsEnabled: true,
      preferredResponseLength: 'medium',

      // Project management
      setActiveProjectType: (type) =>
        set((state) => ({
          activeProjectType: type,
          selectedProject: null,
          activeChatSession: null
        })),

      selectProject: (project) =>
        set((state) => {
          // Create or find existing chat session for this project
          const existingSessionId = Object.keys(state.chatSessions).find(
            sessionId => state.chatSessions[sessionId].projectId === project.id
          )

          let activeChatSession = existingSessionId
          let chatSessions = state.chatSessions

          if (!existingSessionId) {
            // Create new chat session
            const newSessionId = `session-${project.id}-${Date.now()}`
            activeChatSession = newSessionId
            chatSessions = {
              ...state.chatSessions,
              [newSessionId]: {
                id: newSessionId,
                projectId: project.id,
                messages: [],
                lastActivity: new Date()
              }
            }
          }

          return {
            selectedProject: project,
            activeChatSession,
            chatSessions
          }
        }),

      updateProject: (projectId, updates) =>
        set((state) => {
          const updatedProjects = { ...state.projects }
          
          // Find and update the project across all project types
          Object.keys(updatedProjects).forEach(projectType => {
            updatedProjects[projectType] = updatedProjects[projectType].map(project =>
              project.id === projectId ? { ...project, ...updates } : project
            )
          })

          return { projects: updatedProjects }
        }),

      addProject: (projectType, project) =>
        set((state) => {
          const existingProjects = state.projects[projectType] || []
          const projectExists = existingProjects.some(p => p.id === project.id)
          
          if (projectExists) {
            return state // Don't add duplicate
          }
          
          return {
            projects: {
              ...state.projects,
              [projectType]: [...existingProjects, project]
            }
          }
        }),

      setProjectsForType: (projectType, projects) =>
        set((state) => ({
          projects: {
            ...state.projects,
            [projectType]: projects
          }
        })),

      // Chat session management
      createChatSession: (projectId) => {
        const sessionId = `session-${projectId}-${Date.now()}`
        set((state) => ({
          chatSessions: {
            ...state.chatSessions,
            [sessionId]: {
              id: sessionId,
              projectId,
              messages: [],
              lastActivity: new Date()
            }
          },
          activeChatSession: sessionId
        }))
        return sessionId
      },

      deleteChatSession: (sessionId) =>
        set((state) => {
          const { [sessionId]: deleted, ...remainingSessions } = state.chatSessions
          return {
            chatSessions: remainingSessions,
            activeChatSession: state.activeChatSession === sessionId ? null : state.activeChatSession
          }
        }),

      setActiveChatSession: (sessionId) =>
        set({ activeChatSession: sessionId }),

      updateChatSession: (sessionId, updates) =>
        set((state) => ({
          chatSessions: {
            ...state.chatSessions,
            [sessionId]: {
              ...state.chatSessions[sessionId],
              ...updates,
              lastActivity: new Date()
            }
          }
        })),

      // UI actions
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      toggleContextPanel: () =>
        set((state) => ({ contextPanelCollapsed: !state.contextPanelCollapsed })),

      // Settings
      toggleAutoExecute: () =>
        set((state) => ({ autoExecuteActions: !state.autoExecuteActions })),

      toggleNotifications: () =>
        set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),

      setResponseLength: (length) =>
        set({ preferredResponseLength: length }),

      // Utility actions
      clearAllSessions: () =>
        set({ chatSessions: {}, activeChatSession: null }),

      exportChatHistory: (sessionId) => {
        const session = get().chatSessions[sessionId]
        if (!session) return ''
        
        const exportData = {
          sessionId,
          projectId: session.projectId,
          messages: session.messages,
          exportedAt: new Date().toISOString()
        }
        
        return JSON.stringify(exportData, null, 2)
      },

      // Data loading (placeholder implementations)
      loadProjectsForType: async (projectType: string) => {
        try {
          const response = await fetch(`/api/${projectType}`)
          if (response.ok) {
            const data = await response.json()
            const projects: Project[] = (data.data || []).map((item: any) => ({
              id: item.id,
              name: item.name,
              type: item.type || 'analysis',
              status: item.status || 'active',
              lastActivity: new Date(item.updatedAt || new Date()),
              priority: item.priority || 'medium',
              metadata: item.metadata || {}
            }))
            
            get().setProjectsForType(projectType, projects)
          }
        } catch (error) {
          console.error(`Failed to load ${projectType} projects:`, error)
        }
      },

      // Load dashboard projects from SQLite backend
      loadDashboardProjects: async () => {
        try {
          // Fetch investments for dashboard module
          const response = await fetch('/api/investments?module=dashboard')
          if (response.ok) {
            const investments = await response.json()
            const projects: Project[] = investments.map((investment: any) => ({
              id: investment.id,
              name: investment.name,
              type: 'dashboard',
              status: investment.status || 'active',
              lastActivity: new Date(investment.lastUpdated || new Date()),
              priority: investment.riskRating === 'high' || investment.riskRating === 'critical' ? 'high' : 
                       investment.riskRating === 'medium' ? 'medium' : 'low',
              unreadMessages: 0,
              metadata: {
                value: investment.currentValue || investment.targetValue || 0,
                progress: investment.status === 'active' ? 100 : 
                         investment.status === 'due_diligence' ? 75 :
                         investment.status === 'structuring' ? 50 : 25,
                team: ['Investment Team'],
                sector: investment.sector || 'Multi-Sector',
                investmentType: investment.investmentType,
                riskRating: investment.riskRating
              }
            }))
            
            get().setProjectsForType('dashboard', projects)
          } else {
            throw new Error(`API failed with status: ${response.status}`)
          }
        } catch (error) {
          console.error('Failed to load dashboard projects:', error)
          throw error // Re-throw to let components handle errors
        }
      },

      // Load workspace projects from SQLite backend
      loadWorkspaceProjects: async () => {
        try {
          // Fetch investments for workspace module
          const response = await fetch('/api/investments?module=workspace')
          if (response.ok) {
            const investments = await response.json()
            const projects: Project[] = investments.map((investment: any) => ({
              id: investment.id,
              name: investment.name,
              type: 'workspace',
              status: investment.status || 'active',
              lastActivity: new Date(investment.lastUpdated || new Date()),
              priority: investment.riskRating === 'high' || investment.riskRating === 'critical' ? 'high' : 
                       investment.riskRating === 'medium' ? 'medium' : 'low',
              unreadMessages: 0,
              metadata: {
                value: investment.currentValue || investment.targetValue || 0,
                progress: investment.status === 'active' ? 100 : 
                         investment.status === 'due_diligence' ? 75 :
                         investment.status === 'structuring' ? 50 : 25,
                team: ['Analysis Team'],
                sector: investment.sector || 'Multi-Sector',
                investmentType: investment.investmentType,
                riskRating: investment.riskRating,
                workspaceId: investment.workspaceId
              }
            }))
            
            get().setProjectsForType('workspace', projects)
          } else {
            throw new Error(`API failed with status: ${response.status}`)
          }
        } catch (error) {
          console.error('Failed to load workspace projects:', error)
          throw error // Re-throw to let components handle errors
        }
      },

      // Load due diligence projects from SQLite backend
      loadDueDiligenceProjects: async () => {
        try {
          // Fetch investments for due diligence module
          const response = await fetch('/api/investments?module=due-diligence')
          if (response.ok) {
            const investments = await response.json()
            const projects: Project[] = investments.map((investment: any) => ({
              id: investment.id,
              name: investment.name,
              type: 'company',
              status: investment.status || 'active',
              lastActivity: new Date(investment.lastUpdated || new Date()),
              priority: investment.riskRating === 'high' || investment.riskRating === 'critical' ? 'high' : 
                       investment.riskRating === 'medium' ? 'medium' : 'low',
              unreadMessages: 0,
              metadata: {
                value: investment.currentValue || investment.targetValue || 0,
                progress: investment.status === 'active' ? 100 : 
                         investment.status === 'due_diligence' ? 75 :
                         investment.status === 'structuring' ? 50 : 25,
                team: ['Due Diligence Team'],
                sector: investment.sector || 'Multi-Sector',
                investmentType: investment.investmentType,
                riskRating: investment.riskRating,
                dueDiligenceProjectId: investment.dueDiligenceProjectId
              }
            }))
            
            get().setProjectsForType('due-diligence', projects)
          } else {
            throw new Error(`API failed with status: ${response.status}`)
          }
        } catch (error) {
          console.error('Failed to load due diligence projects:', error)
          throw error // Re-throw to let components handle errors
        }
      },

      // Load portfolio projects from SQLite backend
      loadPortfolioProjects: async () => {
        try {
          // Fetch investments for portfolio module
          const response = await fetch('/api/investments?module=portfolio')
          if (response.ok) {
            const investments = await response.json()
            const projects: Project[] = investments.map((investment: any) => ({
              id: investment.id,
              name: investment.name,
              type: 'portfolio',
              status: investment.status || 'active',
              lastActivity: new Date(investment.lastUpdated || new Date()),
              priority: investment.riskRating === 'high' || investment.riskRating === 'critical' ? 'high' : 
                       investment.riskRating === 'medium' ? 'medium' : 'low',
              unreadMessages: 0,
              metadata: {
                value: investment.currentValue || investment.targetValue || 0,
                progress: investment.status === 'active' ? 100 : 
                         investment.status === 'due_diligence' ? 75 :
                         investment.status === 'structuring' ? 50 : 25,
                team: ['Portfolio Management'],
                sector: investment.sector || 'Multi-Sector',
                investmentType: investment.investmentType,
                riskRating: investment.riskRating,
                performance: investment.expectedReturn ? `${investment.expectedReturn}%` : 'N/A'
              }
            }))
            
            get().setProjectsForType('portfolio', projects)
          } else {
            throw new Error(`API failed with status: ${response.status}`)
          }
        } catch (error) {
          console.error('Failed to load portfolio projects:', error)
          throw error // Re-throw to let components handle errors
        }
      },

      // Initialize projects with mock data (useful for clearing cache)
      initializeProjects: () => {
        set({ projects: getInitialProjects() })
      },

      // Portfolio specific setter
      setPortfolioProjects: (projects: Project[]) => {
        get().setProjectsForType('portfolio', projects)
      },

      // Exit specific setter
      setExitProjects: (projects: Project[]) => {
        get().setProjectsForType('exit', projects)
      }
    }),
    {
      name: 'autonomous-storage',
      partialize: (state) => ({
        projects: state.projects,
        chatSessions: state.chatSessions,
        autoExecuteActions: state.autoExecuteActions,
        notificationsEnabled: state.notificationsEnabled,
        preferredResponseLength: state.preferredResponseLength
      })
    }
  )
)
