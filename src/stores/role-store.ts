import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole } from '@/types/roles';
import { ROLE_DEFINITIONS, getRoleBasedNavigation } from '@/types/roles';
import type { RoleBasedNavigationItem } from '@/types/roles';

interface RoleState {
  currentRole: UserRole;
  navigationItems: RoleBasedNavigationItem[];
}

interface RoleActions {
  setRole: (role: UserRole) => void;
  updateNavigationItems: () => void;
}

type RoleStore = RoleState & RoleActions;

// Create a mock user object for the current role
const createMockUser = (role: UserRole) => ({
  id: 'demo-user',
  email: 'demo@example.com',
  name: 'Demo User',
  role,
  permissions: ROLE_DEFINITIONS[role].permissions,
  preferences: {
    defaultDashboard: ROLE_DEFINITIONS[role].defaultModules[0] || 'dashboard',
    favoriteModules: ROLE_DEFINITIONS[role].defaultModules.slice(0, 3),
    notificationSettings: {
      email: true,
      push: false,
      dealUpdates: true,
      portfolioAlerts: false,
      complianceReminders: false
    },
    uiPreferences: {
      density: 'comfortable' as const,
      theme: 'light' as const,
      sidebarCollapsed: false
    }
  },
  lastLogin: new Date(),
  isActive: true
});

export const useRoleStore = create<RoleStore>()(
  persist(
    (set, get) => ({
      // Initial state - default to investment director as a good demo role
      currentRole: 'investment_director',
      navigationItems: getRoleBasedNavigation(createMockUser('investment_director')),

      // Actions
      setRole: (role: UserRole) => {
        const mockUser = createMockUser(role);
        const navigationItems = getRoleBasedNavigation(mockUser);
        
        set({ 
          currentRole: role,
          navigationItems
        });
      },

      updateNavigationItems: () => {
        const { currentRole } = get();
        const mockUser = createMockUser(currentRole);
        const navigationItems = getRoleBasedNavigation(mockUser);
        
        set({ navigationItems });
      }
    }),
    {
      name: 'role-storage',
      partialize: (state) => ({
        currentRole: state.currentRole
      })
    }
  )
);

// Utility hook for getting current role info
export const useCurrentRole = () => {
  const { currentRole, navigationItems } = useRoleStore();
  const roleDefinition = ROLE_DEFINITIONS[currentRole];
  const mockUser = createMockUser(currentRole);
  
  return {
    currentRole,
    roleDefinition,
    navigationItems,
    user: mockUser,
    hasPermission: (permission: string) => mockUser.permissions.includes(permission as any),
    canAccessModule: (moduleId: string) => roleDefinition.defaultModules.includes(moduleId)
  };
};
