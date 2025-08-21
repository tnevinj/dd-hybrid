/**
 * User Preferences Store - User settings, preferences, and configuration
 * Extracted from the massive navigation store for better separation of concerns
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserPreferences } from '@/types/navigation'

interface PreferencesState {
  preferences: UserPreferences
}

interface PreferencesActions {
  updatePreferences: (preferences: Partial<UserPreferences>) => void
  resetPreferences: () => void
}

type PreferencesStore = PreferencesState & PreferencesActions

const defaultPreferences: UserPreferences = {
  navigationMode: 'traditional',
  aiAdoptionLevel: 0,
  aiPermissions: {
    suggestions: true,
    autoComplete: false,
    proactiveActions: false,
    autonomousExecution: false,
    dataAnalysis: true,
    reportGeneration: false,
    meetingScheduling: false,
    documentProcessing: false,
  },
  uiDensity: 'comfortable',
  showAIHints: true,
  autoSaveEnabled: true,
  notificationSettings: {
    emailNotifications: true,
    pushNotifications: false,
    aiRecommendations: true,
    deadlineReminders: true,
    teamUpdates: true,
  }
}

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set, get) => ({
      // Initial state
      preferences: defaultPreferences,

      // Actions
      updatePreferences: (preferences: Partial<UserPreferences>) => {
        set((state) => ({
          preferences: { ...state.preferences, ...preferences }
        }))
      },

      resetPreferences: () => {
        set({ preferences: defaultPreferences })
      }
    }),
    {
      name: 'preferences-storage'
    }
  )
)