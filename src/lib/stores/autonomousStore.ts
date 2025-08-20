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
    sector?: string;
    stage?: string;
    geography?: string;
    riskRating?: string;
    dealValueCents?: number;
    currentValue?: number;
    targetValue?: number;
    deadline?: string;
    createdAt?: string;
    workProducts?: number;
    risks?: string[];
    irr?: number;
    moic?: number;
    expectedIRR?: number;
    targetMultiple?: number;
    assetType?: string;
    esgScore?: number;
    totalReturn?: number;
    dbMetadata?: any;
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
  setProjectsForType: (projectType: string, projects: Project[]) => void;
  refreshProjectsFromUnifiedData: () => void;
  setDealScreeningProjects: (projects: Project[]) => void;
  setDealStructuringProjects: (projects: Project[]) => void;
  
  // Real data loading methods
  loadWorkspaceProjects: () => Promise<void>;
  loadPortfolioProjects: () => Promise<void>;
  loadDashboardProjects: () => Promise<void>;
  loadDueDiligenceProjects: () => Promise<void>;
  
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

// Generate initial empty projects structure - data will be loaded dynamically from APIs
const getInitialProjects = (): Record<string, Project[]> => {
  // Return empty structure - real data will be loaded by individual components
  return {
    dashboard: [],
    portfolio: [],
    'due-diligence': [],
    workspace: [],
    'deal-screening': [],
    'deal-structuring': []
  };
};

const initialProjects = getInitialProjects();

export const useAutonomousStore = create<AutonomousStore>()(
  persist(
    (set, get) => ({
      // Initial state
      projects: getInitialProjects(),
      selectedProject: null,
      activeProjectType: 'dashboard',
      
      // Cross-module context
      globalSelectedProject: null,
      moduleProjects: {},
      crossModuleContext: {
        lastUsedProjects: {},
        navigationHistory: []
      },
      
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
        set((state) => {
          // Check if project already exists to avoid duplicates
          const existingProjects = state.projects[projectType] || [];
          const projectExists = existingProjects.some(p => p.id === project.id);
          
          if (projectExists) {
            return state; // Don't add duplicate
          }
          
          return {
            projects: {
              ...state.projects,
              [projectType]: [...existingProjects, project]
            }
          };
        }),

      setProjectsForType: (projectType, projects) =>
        set((state) => ({
          projects: {
            ...state.projects,
            [projectType]: projects
          }
        })),

      refreshProjectsFromUnifiedData: () => {
        console.warn('refreshProjectsFromUnifiedData called - this should be replaced with real API calls');
        set(() => ({
          projects: getInitialProjects()
        }));
      },

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
      },

      // Cross-module context actions
      setGlobalProject: (project) =>
        set((state) => ({
          globalSelectedProject: project,
          selectedProject: project,
        })),

      getProjectForModule: (module) => {
        const state = get();
        return state.moduleProjects[module] || state.globalSelectedProject;
      },

      setProjectForModule: (module, project) =>
        set((state) => ({
          moduleProjects: {
            ...state.moduleProjects,
            [module]: project
          },
          crossModuleContext: {
            ...state.crossModuleContext,
            lastUsedProjects: {
              ...state.crossModuleContext.lastUsedProjects,
              [module]: project?.id || null
            }
          }
        })),

      syncProjectAcrossModules: (project) =>
        set((state) => ({
          globalSelectedProject: project,
          selectedProject: project,
          moduleProjects: Object.keys(state.moduleProjects).reduce((acc, module) => {
            // Only sync if the project types are compatible
            const isCompatible = project.type === 'company' || project.type === 'deal' || project.type === 'analysis';
            acc[module] = isCompatible ? project : state.moduleProjects[module];
            return acc;
          }, {} as Record<string, Project | null>)
        })),

      addToNavigationHistory: (module, projectId) =>
        set((state) => {
          const newHistoryItem = {
            module,
            projectId,
            timestamp: new Date()
          };
          
          // Keep only the last 20 navigation items
          const updatedHistory = [newHistoryItem, ...state.crossModuleContext.navigationHistory]
            .slice(0, 20);
            
          return {
            crossModuleContext: {
              ...state.crossModuleContext,
              navigationHistory: updatedHistory
            }
          };
        }),

      getRecentProjectsForModule: (module) => {
        const state = get();
        const moduleHistory = state.crossModuleContext.navigationHistory
          .filter(item => item.module === module)
          .slice(0, 5); // Get last 5 projects for this module
          
        const allProjects = Object.values(state.projects).flat();
        return moduleHistory
          .map(item => allProjects.find(project => project.id === item.projectId))
          .filter(Boolean) as Project[];
      },

      // Real data loading implementations
      loadWorkspaceProjects: async () => {
        try {
          const response = await fetch('/api/workspaces');
          if (response.ok) {
            const data = await response.json();
            
            // Convert workspace data to Project format for compatibility
            const workspaceProjects: Project[] = data.data.map((workspace: any) => ({
              id: workspace.id,
              name: workspace.name,
              type: workspace.type as Project['type'],
              status: workspace.status as Project['status'],
              lastActivity: new Date(workspace.updatedAt),
              priority: workspace.priority || 'medium' as Project['priority'],
              metadata: {
                value: workspace.dealValue ? `$${Math.round(workspace.dealValue / 100 / 1000000)}M` : undefined,
                progress: workspace.progress || 0,
                team: workspace.team || [],
                sector: workspace.sector,
                stage: workspace.stage,
                geography: workspace.geography,
                riskRating: workspace.riskRating,
                dealValueCents: workspace.dealValue,
                currentValue: workspace.currentValue || workspace.dealValue,
                targetValue: workspace.targetValue,
                deadline: workspace.deadline,
                createdAt: workspace.createdAt,
                workProducts: workspace.workProducts || 0,
                risks: workspace.risks,
                irr: workspace.irr,
                moic: workspace.moic,
                expectedIRR: workspace.expectedIRR,
                targetMultiple: workspace.targetMultiple,
                dbMetadata: workspace.metadata || {}
              }
            }));

            set((state) => ({
              projects: {
                ...state.projects,
                workspace: workspaceProjects
              }
            }));
          }
        } catch (error) {
          console.error('Failed to load workspace projects:', error);
        }
      },

      loadPortfolioProjects: async () => {
        try {
          const response = await fetch('/api/portfolio');
          if (response.ok) {
            const data = await response.json();
            
            // Convert portfolio data to Project format
            const portfolioProjects: Project[] = data.data.flatMap((portfolio: any) => 
              portfolio.assets?.map((asset: any) => ({
                id: asset.id,
                name: asset.name,
                type: 'portfolio' as const,
                status: asset.status === 'active' ? 'active' : 
                       asset.status === 'exited' ? 'completed' : 'draft',
                lastActivity: new Date(asset.lastUpdated || asset.acquisitionDate),
                priority: asset.riskRating === 'high' ? 'high' : 
                         asset.riskRating === 'low' ? 'low' : 'medium',
                metadata: {
                  value: asset.currentValue ? `$${Math.round(asset.currentValue / 1000000)}M` : undefined,
                  progress: Math.round((asset.performance?.irr || 0) * 100),
                  team: asset.teamMembers || [],
                  sector: asset.sector,
                  assetType: asset.assetType,
                  riskRating: asset.riskRating,
                  esgScore: asset.esgMetrics?.overallScore,
                  currentValue: asset.currentValue,
                  dealValueCents: asset.acquisitionValue,
                  irr: asset.performance?.irr,
                  moic: asset.performance?.moic,
                  totalReturn: asset.performance?.totalReturn,
                  createdAt: asset.acquisitionDate,
                  workProducts: asset.workProducts || 0,
                  risks: asset.risks || []
                }
              })) || []
            );

            set((state) => ({
              projects: {
                ...state.projects,
                portfolio: portfolioProjects
              }
            }));
          }
        } catch (error) {
          console.error('Failed to load portfolio projects:', error);
        }
      },

      loadDashboardProjects: async () => {
        try {
          // Load dashboard metrics and convert to projects
          const [workspacesRes, portfolioRes] = await Promise.all([
            fetch('/api/workspaces'),
            fetch('/api/portfolio')
          ]);

          const dashboardProjects: Project[] = [];

          if (workspacesRes.ok) {
            const workspaceData = await workspacesRes.json();
            // Create summary projects for active workspaces
            const activeWorkspaces = workspaceData.data.filter((w: any) => w.status === 'active');
            
            if (activeWorkspaces.length > 0) {
              dashboardProjects.push({
                id: 'dashboard-active-workspaces',
                name: `Active Workspaces (${activeWorkspaces.length})`,
                type: 'report',
                status: 'active',
                lastActivity: new Date(),
                priority: 'high',
                metadata: {
                  progress: Math.round(activeWorkspaces.reduce((sum: number, w: any) => sum + (w.progress || 0), 0) / activeWorkspaces.length),
                  value: `$${Math.round(activeWorkspaces.reduce((sum: number, w: any) => sum + (w.dealValue || 0), 0) / 100 / 1000000)}M total`
                }
              });
            }
          }

          if (portfolioRes.ok) {
            const portfolioData = await portfolioRes.json();
            // Create summary project for portfolio performance
            dashboardProjects.push({
              id: 'dashboard-portfolio-performance',
              name: 'Portfolio Performance Review',
              type: 'analysis',
              status: 'active',
              lastActivity: new Date(),
              priority: 'medium',
              metadata: {
                progress: 85,
                value: portfolioData.data?.length ? `${portfolioData.data.length} portfolios` : undefined
              }
            });
          }

          set((state) => ({
            projects: {
              ...state.projects,
              dashboard: dashboardProjects
            }
          }));
        } catch (error) {
          console.error('Failed to load dashboard projects:', error);
        }
      },

      loadDueDiligenceProjects: async () => {
        try {
          // Load workspaces and filter for due diligence related ones
          const response = await fetch('/api/workspaces');
          if (response.ok) {
            const data = await response.json();
            
            // Filter and convert workspaces that are DD-related
            const ddProjects: Project[] = data.data
              .filter((workspace: any) => 
                workspace.type === 'due-diligence' || 
                workspace.stage === 'due-diligence' ||
                workspace.name.toLowerCase().includes('due diligence') ||
                workspace.name.toLowerCase().includes(' dd ')
              )
              .map((workspace: any) => ({
                id: workspace.id,
                name: workspace.name,
                type: 'company' as const,
                status: workspace.status as Project['status'],
                lastActivity: new Date(workspace.updatedAt),
                priority: workspace.priority || 'medium' as Project['priority'],
                metadata: {
                  value: workspace.dealValue ? `$${Math.round(workspace.dealValue / 100 / 1000000)}M` : undefined,
                  progress: workspace.progress || 0,
                  team: workspace.team || [],
                  sector: workspace.sector,
                  stage: workspace.stage,
                  geography: workspace.geography,
                  riskRating: workspace.riskRating,
                  dealValueCents: workspace.dealValue,
                  currentValue: workspace.currentValue || workspace.dealValue,
                  targetValue: workspace.targetValue,
                  deadline: workspace.deadline,
                  createdAt: workspace.createdAt,
                  workProducts: workspace.workProducts || 0,
                  risks: workspace.risks,
                  irr: workspace.irr,
                  moic: workspace.moic,
                  expectedIRR: workspace.expectedIRR,
                  targetMultiple: workspace.targetMultiple
                }
              }));

            set((state) => ({
              projects: {
                ...state.projects,
                'due-diligence': ddProjects
              }
            }));
          }
        } catch (error) {
          console.error('Failed to load due diligence projects:', error);
        }
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