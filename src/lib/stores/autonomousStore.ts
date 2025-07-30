'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Project {
  id: string;
  name: string;
  type: 'portfolio' | 'deal' | 'company' | 'report' | 'analysis';
  status: 'active' | 'completed' | 'draft' | 'review';
  lastActivity: Date;
  priority: 'high' | 'medium' | 'low';
  unreadMessages?: number;
  metadata?: {
    value?: string;
    progress?: number;
    team?: string[];
  };
}

interface ChatSession {
  id: string;
  projectId: string;
  messages: Array<{
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    actions?: any[];
  }>;
  lastActivity: Date;
}

interface AutonomousState {
  // Project management
  projects: Record<string, Project[]>;
  selectedProject: Project | null;
  activeProjectType: 'dashboard' | 'portfolio' | 'due-diligence' | 'workspace' | 'deal-screening';
  
  // Chat sessions
  chatSessions: Record<string, ChatSession>;
  activeChatSession: string | null;
  
  // UI state
  sidebarCollapsed: boolean;
  contextPanelCollapsed: boolean;
  
  // Settings
  autoExecuteActions: boolean;
  notificationsEnabled: boolean;
  preferredResponseLength: 'short' | 'medium' | 'detailed';
}

interface AutonomousActions {
  // Project actions
  setActiveProjectType: (type: AutonomousState['activeProjectType']) => void;
  selectProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  addProject: (projectType: string, project: Project) => void;
  
  // Chat session actions
  createChatSession: (projectId: string) => string;
  deleteChatSession: (sessionId: string) => void;
  setActiveChatSession: (sessionId: string | null) => void;
  updateChatSession: (sessionId: string, updates: Partial<ChatSession>) => void;
  
  // UI actions
  toggleSidebar: () => void;
  toggleContextPanel: () => void;
  
  // Settings actions
  toggleAutoExecute: () => void;
  toggleNotifications: () => void;
  setResponseLength: (length: AutonomousState['preferredResponseLength']) => void;
  
  // Utility actions
  clearAllSessions: () => void;
  exportChatHistory: (sessionId: string) => string;
}

type AutonomousStore = AutonomousState & AutonomousActions;

// Mock initial projects data
const initialProjects: Record<string, Project[]> = {
  dashboard: [
    {
      id: 'dash-1',
      name: 'Q4 Performance Review',
      type: 'report',
      status: 'active',
      lastActivity: new Date(),
      priority: 'high',
      unreadMessages: 3,
      metadata: { progress: 75 }
    },
    {
      id: 'dash-2',
      name: 'Market Analysis Dashboard',
      type: 'analysis',
      status: 'active',
      lastActivity: new Date(Date.now() - 86400000),
      priority: 'medium',
      metadata: { progress: 90 }
    }
  ],
  portfolio: [
    {
      id: 'port-1',
      name: 'Growth Equity Portfolio Performance',
      type: 'portfolio',
      status: 'active',
      lastActivity: new Date(),
      priority: 'high',
      unreadMessages: 5,
      metadata: { value: '$1.2B', progress: 85 }
    },
    {
      id: 'port-2',
      name: 'Healthcare Sector Analysis',
      type: 'analysis',
      status: 'active',
      lastActivity: new Date(Date.now() - 3600000),
      priority: 'medium',
      metadata: { value: '$850M', progress: 70 }
    },
    {
      id: 'port-3',
      name: 'Infrastructure Asset Optimization',
      type: 'portfolio',
      status: 'review',
      lastActivity: new Date(Date.now() - 7200000),
      priority: 'medium',
      unreadMessages: 2,
      metadata: { value: '$2.1B', progress: 90 }
    }
  ],
  'due-diligence': [
    {
      id: 'dd-1',
      name: 'GreenTech Energy Due Diligence',
      type: 'company',
      status: 'active',
      lastActivity: new Date(),
      priority: 'high',
      unreadMessages: 8,
      metadata: { progress: 65, team: ['Legal', 'Financial', 'Technical', 'ESG'] }
    },
    {
      id: 'dd-2',
      name: 'FinCorp Acquisition DD',
      type: 'company',
      status: 'active',
      lastActivity: new Date(Date.now() - 3600000),
      priority: 'high',
      unreadMessages: 12,
      metadata: { progress: 40, team: ['Legal', 'Financial', 'Regulatory'] }
    },
    {
      id: 'dd-3',
      name: 'MedDevice Startup Assessment',
      type: 'company',
      status: 'review',
      lastActivity: new Date(Date.now() - 86400000),
      priority: 'medium',
      unreadMessages: 3,
      metadata: { progress: 85, team: ['Technical', 'Market Research'] }
    }
  ],
  workspace: [
    {
      id: 'work-1',
      name: 'TechCorp Due Diligence',
      type: 'report',
      status: 'active',
      lastActivity: new Date(),
      priority: 'high',
      unreadMessages: 4,
      metadata: { progress: 75, team: ['Legal', 'Financial', 'Technical', 'Commercial'] }
    },
    {
      id: 'work-2',
      name: 'HealthCo Investment Committee',
      type: 'report',
      status: 'review',
      lastActivity: new Date(Date.now() - 86400000),
      priority: 'high',
      unreadMessages: 6,
      metadata: { progress: 90, team: ['IC Members', 'Portfolio Team'] }
    },
    {
      id: 'work-3',
      name: 'RetailCo Deal Screening',
      type: 'analysis',
      status: 'active',
      lastActivity: new Date(Date.now() - 10800000),
      priority: 'medium',
      unreadMessages: 3,
      metadata: { progress: 45, team: ['Screening Team', 'Sector Analysts'] }
    },
    {
      id: 'work-4',
      name: 'Manufacturing Portfolio Review',
      type: 'report',
      status: 'draft',
      lastActivity: new Date(Date.now() - 604800000),
      priority: 'low',
      unreadMessages: 0,
      metadata: { progress: 20, team: ['Portfolio Managers'] }
    }
  ],
  'deal-screening': [
    {
      id: 'deal-1',
      name: 'SaaS Startup Pipeline',
      type: 'analysis',
      status: 'active',
      lastActivity: new Date(),
      priority: 'high',
      unreadMessages: 15,
      metadata: { progress: 30, team: ['Screening Team', 'Tech Analysts'] }
    },
    {
      id: 'deal-2',
      name: 'Healthcare Series B Opportunities',
      type: 'deal',
      status: 'active',
      lastActivity: new Date(Date.now() - 7200000),
      priority: 'medium',
      unreadMessages: 8,
      metadata: { progress: 60, team: ['Healthcare Team'] }
    },
    {
      id: 'deal-3',
      name: 'Secondary Market Screening',
      type: 'analysis',
      status: 'review',
      lastActivity: new Date(Date.now() - 86400000),
      priority: 'medium',
      unreadMessages: 4,
      metadata: { progress: 80, team: ['Secondary Team', 'Valuations'] }
    }
  ]
};

export const useAutonomousStore = create<AutonomousStore>()(
  persist(
    (set, get) => ({
      // Initial state
      projects: initialProjects,
      selectedProject: null,
      activeProjectType: 'dashboard',
      chatSessions: {},
      activeChatSession: null,
      sidebarCollapsed: false,
      contextPanelCollapsed: false,
      autoExecuteActions: false,
      notificationsEnabled: true,
      preferredResponseLength: 'medium',

      // Project actions
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
          );

          let activeChatSession = existingSessionId;
          let chatSessions = state.chatSessions;

          if (!existingSessionId) {
            // Create new chat session
            const newSessionId = `session-${project.id}-${Date.now()}`;
            activeChatSession = newSessionId;
            chatSessions = {
              ...state.chatSessions,
              [newSessionId]: {
                id: newSessionId,
                projectId: project.id,
                messages: [],
                lastActivity: new Date()
              }
            };
          }

          return {
            selectedProject: project,
            activeChatSession,
            chatSessions
          };
        }),

      updateProject: (projectId, updates) =>
        set((state) => {
          const updatedProjects = { ...state.projects };
          
          // Find and update the project across all project types
          Object.keys(updatedProjects).forEach(projectType => {
            updatedProjects[projectType] = updatedProjects[projectType].map(project =>
              project.id === projectId ? { ...project, ...updates } : project
            );
          });

          return { projects: updatedProjects };
        }),

      addProject: (projectType, project) =>
        set((state) => ({
          projects: {
            ...state.projects,
            [projectType]: [...(state.projects[projectType] || []), project]
          }
        })),

      // Chat session actions
      createChatSession: (projectId) => {
        const sessionId = `session-${projectId}-${Date.now()}`;
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
        }));
        return sessionId;
      },

      deleteChatSession: (sessionId) =>
        set((state) => {
          const { [sessionId]: deleted, ...remainingSessions } = state.chatSessions;
          return {
            chatSessions: remainingSessions,
            activeChatSession: state.activeChatSession === sessionId ? null : state.activeChatSession
          };
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

      // Settings actions
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
        const session = get().chatSessions[sessionId];
        if (!session) return '';
        
        const exportData = {
          sessionId,
          projectId: session.projectId,
          messages: session.messages,
          exportedAt: new Date().toISOString()
        };
        
        return JSON.stringify(exportData, null, 2);
      }
    }),
    {
      name: 'autonomous-store',
      // Only persist essential data, not UI state
      partialize: (state) => ({
        projects: state.projects,
        chatSessions: state.chatSessions,
        autoExecuteActions: state.autoExecuteActions,
        notificationsEnabled: state.notificationsEnabled,
        preferredResponseLength: state.preferredResponseLength
      })
    }
  )
);