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
  type: 'model' | 'analysis' | 'forecast' | 'research' | 'portfolio' | 'deal' | 'dd'
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
}

type AutonomousStore = AutonomousState & AutonomousActions

// Generate initial empty projects structure
const getInitialProjects = (): Record<string, Project[]> => {
  return {
    dashboard: [],
    portfolio: [],
    'due-diligence': [],
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