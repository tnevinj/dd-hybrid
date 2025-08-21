'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useNavigationStoreRefactored } from '@/stores/navigation-store-refactored';

export interface AutonomousModeOptions {
  autoDetect?: boolean;
  redirectOnModeChange?: boolean;
  preserveParams?: boolean;
}

/**
 * Hook for managing autonomous mode state with URL integration
 * 
 * Features:
 * - Auto-detects mode from URL query parameters (?mode=autonomous)
 * - Persists mode changes to URL
 * - Syncs URL state with navigation store
 * - Supports deep linking to autonomous views
 */
export function useAutonomousMode(options: AutonomousModeOptions = {}) {
  const { 
    autoDetect = true, 
    redirectOnModeChange = false, 
    preserveParams = true 
  } = options;
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { currentMode, setMode } = useNavigationStoreRefactored();

  const urlMode = searchParams.get('mode');
  const isAutonomousFromURL = urlMode === 'autonomous';
  const isAutonomousFromStore = currentMode.mode === 'autonomous';

  // Navigate to autonomous mode for current page
  const navigateToAutonomous = () => {
    const params = new URLSearchParams(searchParams);
    params.set('mode', 'autonomous');
    
    const newURL = `${pathname}?${params.toString()}`;
    router.push(newURL);
  };

  // Navigate away from autonomous mode
  const exitAutonomous = (targetMode: 'traditional' | 'assisted' = 'assisted') => {
    const params = new URLSearchParams(searchParams);
    
    if (preserveParams) {
      params.delete('mode'); // Remove mode param but keep others
    } else {
      // Clear all params
      params.forEach((_, key) => params.delete(key));
    }
    
    const newURL = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    
    // Update navigation store first
    setMode({
      ...currentMode,
      mode: targetMode,
    });
    
    router.push(newURL);
  };

  // Navigate to different module in autonomous mode
  const navigateToModule = (modulePath: string, preserveProject = true) => {
    const params = new URLSearchParams(searchParams);
    params.set('mode', 'autonomous');
    
    // Preserve project context if specified
    if (preserveProject) {
      const projectId = searchParams.get('project');
      if (projectId) {
        params.set('project', projectId);
      }
    }
    
    const newURL = `${modulePath}?${params.toString()}`;
    router.push(newURL);
  };

  // Sync URL mode with navigation store
  useEffect(() => {
    if (!autoDetect) return;

    // URL has mode=autonomous but store doesn't match
    if (isAutonomousFromURL && !isAutonomousFromStore) {
      setMode({
        ...currentMode,
        mode: 'autonomous',
        aiPermissions: {
          suggestions: true,
          autoComplete: true,
          proactiveActions: true,
          autonomousExecution: true,
        },
      });
    }
    // Store has autonomous mode but URL doesn't match
    else if (isAutonomousFromStore && !isAutonomousFromURL && redirectOnModeChange) {
      navigateToAutonomous();
    }
  }, [
    urlMode, 
    isAutonomousFromURL, 
    isAutonomousFromStore, 
    autoDetect, 
    redirectOnModeChange,
    currentMode,
    setMode
  ]);

  return {
    // State
    isAutonomous: isAutonomousFromURL || isAutonomousFromStore,
    urlMode,
    storeMode: currentMode.mode,
    
    // Actions
    navigateToAutonomous,
    exitAutonomous,
    navigateToModule,
    
    // Utils
    buildAutonomousURL: (path: string, additionalParams?: Record<string, string>) => {
      const params = new URLSearchParams();
      params.set('mode', 'autonomous');
      
      if (additionalParams) {
        Object.entries(additionalParams).forEach(([key, value]) => {
          params.set(key, value);
        });
      }
      
      return `${path}?${params.toString()}`;
    },
  };
}

export default useAutonomousMode;