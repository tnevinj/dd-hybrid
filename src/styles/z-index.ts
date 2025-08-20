/**
 * Standardized Z-Index System for DD-Hybrid
 * 
 * This provides a centralized way to manage z-index values across the application
 * to prevent stacking conflicts and ensure proper layering.
 */

export const ZIndex = {
  // Base content layers
  BASE: 0,
  BELOW: -1,
  
  // UI Components
  TOOLTIP: 10,
  DROPDOWN: 20,
  STICKY: 30,
  
  // Fixed Elements
  FIXED_HEADER: 40,
  FLOATING_BUTTON: 45,
  
  // Overlays and Modals
  OVERLAY: 50,
  MODAL: 60,
  MODAL_CONTENT: 70,
  
  // Notifications and Alerts
  NOTIFICATION: 80,
  TOAST: 90,
  
  // Critical System Elements
  LOADING: 100,
  SYSTEM_MODAL: 110,
} as const;

export type ZIndexValue = typeof ZIndex[keyof typeof ZIndex];

/**
 * Utility function to get z-index class names for Tailwind CSS
 */
export const getZIndexClass = (level: ZIndexValue): string => {
  const zIndexMap: Record<ZIndexValue, string> = {
    [-1]: '-z-10',
    [0]: 'z-0',
    [10]: 'z-10',
    [20]: 'z-20',
    [30]: 'z-30',
    [40]: 'z-40',
    [45]: 'z-40', // Tailwind doesn't have z-45, use z-40
    [50]: 'z-50',
    [60]: 'z-50', // Use z-50 for modals as Tailwind max
    [70]: 'z-50',
    [80]: 'z-50',
    [90]: 'z-50',
    [100]: 'z-50',
    [110]: 'z-50',
  };
  
  return zIndexMap[level] || 'z-0';
};

/**
 * CSS-in-JS style object for z-index values
 */
export const getZIndexStyle = (level: ZIndexValue): { zIndex: number } => ({
  zIndex: level,
});