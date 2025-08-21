/**
 * Base Module Component for standardized mode implementation
 * Provides consistent structure and behavior across all hybrid modules
 */

'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useNavigationStoreRefactored } from '@/stores/navigation-store-refactored'
import { useModuleAI } from '@/hooks/useModuleAI'
import { ErrorBoundary, HybridModeHeader, HybridModeExplanation, type HybridMode } from '@/components/shared'
import { ModeNotification } from '@/components/ui/mode-notification'
import { UserNavigationMode } from '@/types/navigation'
import type { 
  ModuleContext, 
  BaseModuleMetrics,
  ModuleAIStateExtensions,
  TraditionalModeProps,
  AssistedModeProps,
  AutonomousModeProps
} from '@/types/shared'

export interface BaseModuleComponentProps<T extends keyof ModuleAIStateExtensions> {
  moduleId: ModuleContext
  title: string
  subtitle?: string
  customMetrics?: Partial<BaseModuleMetrics>
  generateAIRecommendations?: boolean
  showModeExplanation?: boolean
  className?: string
}

export interface ModeModeComponents<T extends keyof ModuleAIStateExtensions> {
  Traditional: React.ComponentType<TraditionalModeProps>
  Assisted: React.ComponentType<AssistedModeProps>  
  Autonomous: React.ComponentType<AutonomousModeProps>
}

/**
 * Base module component that standardizes the hybrid mode pattern
 */
export function createModuleComponent<T extends keyof ModuleAIStateExtensions>(
  components: ModeModeComponents<T>
) {
  return function BaseModuleComponent({
    moduleId,
    title,
    subtitle,
    customMetrics,
    generateAIRecommendations = true,
    showModeExplanation = true,
    className = ''
  }: BaseModuleComponentProps<T>) {
    const router = useRouter()
    const { currentMode, setMode, setCurrentModule } = useNavigationStoreRefactored()
    
    // Set current module for navigation store
    React.useEffect(() => {
      setCurrentModule(moduleId)
    }, [setCurrentModule, moduleId])
    
    // Use centralized AI management
    const { aiState, metrics, actionHandlers, isLoading, setLoading } = useModuleAI<T>({
      moduleId,
      currentMode: currentMode.mode as HybridMode,
      customMetrics,
      generateRecommendations: generateAIRecommendations
    })
    
    // Handle mode switching with context awareness
    const handleModeSwitch = (mode: HybridMode) => {
      const newMode: UserNavigationMode = {
        mode: mode,
        aiPermissions: {
          suggestions: true,
          autoComplete: mode !== 'traditional',
          proactiveActions: mode === 'assisted' || mode === 'autonomous',
          autonomousExecution: mode === 'autonomous',
        },
        preferredDensity: currentMode.preferredDensity
      }
      setMode(newMode)
    }
    
    const baseProps = {
      metrics,
      isLoading,
      onSwitchMode: handleModeSwitch
    }
    
    return (
      <div className={`${currentMode.mode === 'autonomous' ? 'w-full h-screen' : 'w-full min-h-screen'} ${className}`}>
        {/* Header with Mode Switcher - Hidden for autonomous mode */}
        {currentMode.mode !== 'autonomous' && (
          <HybridModeHeader
            currentMode={currentMode.mode as HybridMode}
            onModeChange={handleModeSwitch}
            moduleContext={moduleId as any}
            title={title}
            subtitle={subtitle}
            disabled={isLoading}
            className="sticky top-0 z-50"
          />
        )}
        
        {/* Mode Explanation Banner - Hidden for autonomous mode */}
        {currentMode.mode !== 'autonomous' && showModeExplanation && (
          <div className="p-4">
            <HybridModeExplanation
              currentMode={currentMode.mode as HybridMode}
              moduleContext={moduleId as any}
              statistics={{
                efficiency: metrics.aiEfficiencyGains,
                automation: metrics.automationLevel,
                accuracy: metrics.accuracyImprovement
              }}
            />
          </div>
        )}
        
        {/* Mode-specific Content */}
        {currentMode.mode === 'traditional' && (
          <ErrorBoundary
            onError={(error, errorInfo) => console.error(`${moduleId} Traditional View Error:`, error, errorInfo)}
          >
            <components.Traditional {...baseProps} />
          </ErrorBoundary>
        )}
        
        {currentMode.mode === 'assisted' && (
          <ErrorBoundary
            onError={(error, errorInfo) => console.error(`${moduleId} Assisted View Error:`, error, errorInfo)}
          >
            <components.Assisted 
              {...baseProps}
              aiRecommendations={aiState.recommendations}
              {...actionHandlers}
            />
          </ErrorBoundary>
        )}
        
        {currentMode.mode === 'autonomous' && (
          <ErrorBoundary
            onError={(error, errorInfo) => console.error(`${moduleId} Autonomous View Error:`, error, errorInfo)}
          >
            <components.Autonomous onSwitchMode={handleModeSwitch} />
          </ErrorBoundary>
        )}
        
        {/* Mode Transition Notification */}
        {currentMode.mode !== 'traditional' && (
          <ModeNotification
            mode={currentMode.mode as 'assisted' | 'autonomous'}
            title={`${title} ${currentMode.mode.charAt(0).toUpperCase() + currentMode.mode.slice(1)} Mode`}
            description={
              currentMode.mode === 'assisted'
                ? `AI is providing intelligent assistance and recommendations. ${metrics.aiEfficiencyGains}% efficiency improvement this month.`
                : `AI is operating autonomously with continuous optimization. ${metrics.aiEfficiencyGains}% efficiency improvement this month.`
            }
          />
        )}
      </div>
    )
  }
}