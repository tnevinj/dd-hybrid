import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole, Permission, ROLE_DEFINITIONS } from '@/types/roles';
import { ROLE_DEFINITIONS as ROLES } from '@/types/roles';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  updateUserPreferences: (preferences: Partial<User['preferences']>) => void;
  switchRole: (role: UserRole) => void; // For demo/testing purposes
}

type AuthStore = AuthState & AuthActions;

// Mock user data for demonstration
const mockUsers: Record<string, User> = {
  'senior@example.com': {
    id: '1',
    email: 'senior@example.com',
    name: 'John Smith',
    role: 'senior_partner',
    permissions: ROLES.senior_partner.permissions,
    preferences: {
      defaultDashboard: 'dashboard',
      favoriteModules: ['investment-committee', 'portfolio', 'lp-portal'],
      notificationSettings: {
        email: true,
        push: true,
        dealUpdates: true,
        portfolioAlerts: true,
        complianceReminders: true
      },
      uiPreferences: {
        density: 'comfortable',
        theme: 'light',
        sidebarCollapsed: false
      }
    },
    lastLogin: new Date(),
    isActive: true
  },
  'director@example.com': {
    id: '2',
    email: 'director@example.com',
    name: 'Sarah Johnson',
    role: 'investment_director',
    permissions: ROLES.investment_director.permissions,
    preferences: {
      defaultDashboard: 'deal-screening',
      favoriteModules: ['deal-screening', 'due-diligence', 'investment-committee'],
      notificationSettings: {
        email: true,
        push: true,
        dealUpdates: true,
        portfolioAlerts: false,
        complianceReminders: false
      },
      uiPreferences: {
        density: 'compact',
        theme: 'light',
        sidebarCollapsed: false
      }
    },
    lastLogin: new Date(),
    isActive: true
  },
  'principal@example.com': {
    id: '3',
    email: 'principal@example.com',
    name: 'Michael Chen',
    role: 'principal',
    permissions: ROLES.principal.permissions,
    preferences: {
      defaultDashboard: 'deal-screening',
      favoriteModules: ['deal-screening', 'due-diligence', 'deal-structuring'],
      notificationSettings: {
        email: true,
        push: false,
        dealUpdates: true,
        portfolioAlerts: false,
        complianceReminders: false
      },
      uiPreferences: {
        density: 'comfortable',
        theme: 'light',
        sidebarCollapsed: false
      }
    },
    lastLogin: new Date(),
    isActive: true
  },
  'associate@example.com': {
    id: '4',
    email: 'associate@example.com',
    name: 'Emily Davis',
    role: 'associate',
    permissions: ROLES.associate.permissions,
    preferences: {
      defaultDashboard: 'deal-screening',
      favoriteModules: ['deal-screening', 'due-diligence', 'market-intelligence'],
      notificationSettings: {
        email: true,
        push: false,
        dealUpdates: true,
        portfolioAlerts: false,
        complianceReminders: false
      },
      uiPreferences: {
        density: 'comfortable',
        theme: 'light',
        sidebarCollapsed: false
      }
    },
    lastLogin: new Date(),
    isActive: true
  },
  'analyst@example.com': {
    id: '5',
    email: 'analyst@example.com',
    name: 'David Wilson',
    role: 'analyst',
    permissions: ROLES.analyst.permissions,
    preferences: {
      defaultDashboard: 'market-intelligence',
      favoriteModules: ['market-intelligence', 'advanced-analytics', 'due-diligence'],
      notificationSettings: {
        email: true,
        push: false,
        dealUpdates: true,
        portfolioAlerts: false,
        complianceReminders: false
      },
      uiPreferences: {
        density: 'compact',
        theme: 'light',
        sidebarCollapsed: false
      }
    },
    lastLogin: new Date(),
    isActive: true
  },
  'operations@example.com': {
    id: '6',
    email: 'operations@example.com',
    name: 'Lisa Rodriguez',
    role: 'fund_operations',
    permissions: ROLES.fund_operations.permissions,
    preferences: {
      defaultDashboard: 'fund-operations',
      favoriteModules: ['fund-operations', 'portfolio', 'workflow-automation'],
      notificationSettings: {
        email: true,
        push: true,
        dealUpdates: false,
        portfolioAlerts: true,
        complianceReminders: true
      },
      uiPreferences: {
        density: 'comfortable',
        theme: 'light',
        sidebarCollapsed: false
      }
    },
    lastLogin: new Date(),
    isActive: true
  },
  'legal@example.com': {
    id: '7',
    email: 'legal@example.com',
    name: 'Robert Taylor',
    role: 'legal_compliance',
    permissions: ROLES.legal_compliance.permissions,
    preferences: {
      defaultDashboard: 'legal-management',
      favoriteModules: ['legal-management', 'due-diligence', 'workflow-automation'],
      notificationSettings: {
        email: true,
        push: true,
        dealUpdates: false,
        portfolioAlerts: false,
        complianceReminders: true
      },
      uiPreferences: {
        density: 'comfortable',
        theme: 'light',
        sidebarCollapsed: false
      }
    },
    lastLogin: new Date(),
    isActive: true
  },
  'gp@example.com': {
    id: '8',
    email: 'gp@example.com',
    name: 'Jennifer Brown',
    role: 'general_partner',
    permissions: ROLES.general_partner.permissions,
    preferences: {
      defaultDashboard: 'gp-portal',
      favoriteModules: ['gp-portal'],
      notificationSettings: {
        email: true,
        push: false,
        dealUpdates: true,
        portfolioAlerts: false,
        complianceReminders: false
      },
      uiPreferences: {
        density: 'comfortable',
        theme: 'light',
        sidebarCollapsed: false
      }
    },
    lastLogin: new Date(),
    isActive: true
  },
  'lp@example.com': {
    id: '9',
    email: 'lp@example.com',
    name: 'Thomas Anderson',
    role: 'limited_partner',
    permissions: ROLES.limited_partner.permissions,
    preferences: {
      defaultDashboard: 'lp-portal',
      favoriteModules: ['lp-portal', 'portfolio'],
      notificationSettings: {
        email: true,
        push: false,
        dealUpdates: false,
        portfolioAlerts: true,
        complianceReminders: false
      },
      uiPreferences: {
        density: 'comfortable',
        theme: 'light',
        sidebarCollapsed: false
      }
    },
    lastLogin: new Date(),
    isActive: true
  },
  'admin@example.com': {
    id: '10',
    email: 'admin@example.com',
    name: 'System Administrator',
    role: 'admin',
    permissions: ROLES.admin.permissions,
    preferences: {
      defaultDashboard: 'admin-management',
      favoriteModules: ['admin-management', 'workflow-automation'],
      notificationSettings: {
        email: true,
        push: true,
        dealUpdates: true,
        portfolioAlerts: true,
        complianceReminders: true
      },
      uiPreferences: {
        density: 'compact',
        theme: 'light',
        sidebarCollapsed: false
      }
    },
    lastLogin: new Date(),
    isActive: true
  }
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock authentication - in real app, this would be an API call
          const user = mockUsers[email.toLowerCase()];
          
          if (user && password === 'password') { // Simple mock password
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false 
            });
          } else {
            throw new Error('Invalid credentials');
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
      },

      setUser: (user: User) => {
        set({ 
          user, 
          isAuthenticated: true 
        });
      },

      updateUserPreferences: (preferences: Partial<User['preferences']>) => {
        const { user } = get();
        if (user) {
          const updatedUser = {
            ...user,
            preferences: {
              ...user.preferences,
              ...preferences
            }
          };
          set({ user: updatedUser });
        }
      },

      switchRole: (role: UserRole) => {
        const { user } = get();
        if (user) {
          const roleDefinition = ROLES[role];
          const updatedUser = {
            ...user,
            role,
            permissions: roleDefinition.permissions,
            preferences: {
              ...user.preferences,
              defaultDashboard: roleDefinition.defaultModules[0] || 'dashboard',
              favoriteModules: roleDefinition.defaultModules.slice(0, 3)
            }
          };
          set({ user: updatedUser });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

// Utility functions for permission checking
export const usePermissions = () => {
  const user = useAuthStore(state => state.user);
  
  const hasPermission = (permission: Permission): boolean => {
    return user?.permissions.includes(permission) ?? false;
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => user?.permissions.includes(permission)) ?? false;
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => user?.permissions.includes(permission)) ?? false;
  };

  const canAccessModule = (moduleId: string): boolean => {
    if (!user) return false;
    const roleDefinition = ROLES[user.role];
    return roleDefinition.defaultModules.includes(moduleId);
  };

  return {
    user,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessModule
  };
};
