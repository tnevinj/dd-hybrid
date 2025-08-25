import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RoleBasedNavigationItem } from '@/types/roles';
import { getAllNavigationItems } from '@/types/roles';

interface NavigationState {
  navigationItems: RoleBasedNavigationItem[];
}

interface NavigationActions {
  updateNavigationItems: () => void;
}

type NavigationStore = NavigationState & NavigationActions;

export const useNavigationStore = create<NavigationStore>()(
  persist(
    (set, get) => ({
      // Initial state - all navigation items
      navigationItems: getAllNavigationItems(),

      // Actions
      updateNavigationItems: () => {
        const navigationItems = getAllNavigationItems();
        set({ navigationItems });
      }
    }),
    {
      name: 'navigation-storage',
      partialize: (state) => ({
        navigationItems: state.navigationItems
      })
    }
  )
);

// Utility hook for getting navigation info
export const useNavigation = () => {
  const { navigationItems } = useNavigationStore();
  
  return {
    navigationItems,
    hasPermission: () => true, // All permissions granted
    canAccessModule: () => true // All modules accessible
  };
};
