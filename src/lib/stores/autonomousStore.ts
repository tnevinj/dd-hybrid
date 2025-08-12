'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UnifiedWorkspaceDataService } from '@/lib/data/unified-workspace-data';

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
  activeProjectType: 'dashboard' | 'portfolio' | 'due-diligence' | 'workspace' | 'deal-screening' | 'deal-structuring';
  
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
  refreshProjectsFromUnifiedData: () => void;
  setDealScreeningProjects: (projects: Project[]) => void;
  setDealStructuringProjects: (projects: Project[]) => void;
  
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

// Generate initial projects from unified data source
const getInitialProjects = (): Record<string, Project[]> => {
  const autonomousProjects = UnifiedWorkspaceDataService.getAutonomousProjects();
  const portfolioAssets = UnifiedWorkspaceDataService.getPortfolioAssetsAsProjects();
  
  // Group projects by type for different sections
  const projectsByType: Record<string, Project[]> = {
    dashboard: [],
    portfolio: portfolioAssets, // Use actual portfolio assets as projects
    'due-diligence': [],
    workspace: autonomousProjects, // Main workspace projects
    'deal-screening': [],
    'deal-structuring': []
  };
  
  // Add some derived projects for other sections based on workspace projects
  autonomousProjects.forEach(project => {
    // Skip adding workspace projects to portfolio since we now use actual assets
    if (project.metadata.stage === 'growth' || project.metadata.stage === 'buyout') {
      projectsByType['due-diligence'].push({
        ...project,
        type: 'company',
        name: project.name.replace('Due Diligence', 'DD').replace('Investment Committee', 'Acquisition DD')
      });
    }
  });
  
  // Add dashboard and screening projects
  projectsByType.dashboard = [
    {
      id: '5',
      name: 'Q4 Performance Review',
      type: 'report',
      status: 'active',
      lastActivity: new Date(),
      priority: 'high',
      unreadMessages: 3,
      metadata: { progress: 75 }
    }
  ];
  
  // Deal screening projects will be loaded dynamically from API
  projectsByType['deal-screening'] = [];
  
  return projectsByType;
};

const initialProjects = getInitialProjects();

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

      refreshProjectsFromUnifiedData: () =>
        set(() => ({
          projects: getInitialProjects()
        })),

      setDealScreeningProjects: (projects) =>
        set((state) => ({
          projects: {
            ...state.projects,
            'deal-screening': projects
          }
        })),

      setDealStructuringProjects: (projects) =>
        set((state) => ({
          projects: {
            ...state.projects,
            'deal-structuring': projects
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
      name: 'autonomous-store-unified-v2', // Changed name to force refresh with new data
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