/**
 * Unified Store Composition - Provides backward compatibility
 * Composes the separated stores into a unified interface to maintain existing API
 */

import { useNavigationStoreRefactored } from './navigation-store-refactored'
import { useAIStore } from './ai-store'
import { useAutonomousStore } from './autonomous-store'
import { usePreferencesStore } from './preferences-store'

/**
 * Composed hook that provides the same interface as the original navigation store
 * This maintains backward compatibility while using the new separated stores
 */
export function useComposedNavigationStore() {
  const navigation = useNavigationStoreRefactored()
  const ai = useAIStore()
  const autonomous = useAutonomousStore()
  const preferences = usePreferencesStore()

  return {
    // Navigation state and actions
    ...navigation,
    
    // AI state and actions
    ...ai,
    
    // Autonomous state and actions
    ...autonomous,
    
    // Preferences state and actions
    ...preferences,
    
    // Cross-module intelligence (simplified implementation)
    generateCrossModuleInsights: (currentModule: string) => {
      console.log('Cross-module insights generation for:', currentModule)
      // Simplified implementation - could be enhanced later
    },
    
    getCrossModuleMetrics: () => {
      return {}
    }
  }
}

// Individual store exports for direct access when needed
export { useNavigationStoreRefactored } from './navigation-store-refactored'
export { useAIStore } from './ai-store'
export { useAutonomousStore } from './autonomous-store'
export { usePreferencesStore } from './preferences-store'

// Type exports
export type { Project, ChatSession, ChatMessage } from './autonomous-store'