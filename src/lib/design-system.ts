/**
 * DD-Hybrid Design System Constants
 * Centralized styling and theming constants for consistent UI across traditional and assisted modes
 */

// =============================================================================
// COLOR SYSTEM
// =============================================================================

export const COLORS = {
  // Traditional Mode (Investment Banking Professional theme)
  traditional: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      600: '#1e40af',
      700: '#1e3a8a',
      800: '#1e3a8a',
      900: '#1e3a8a',
    },
    accent: {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fef08a',
      300: '#fde047',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    surface: {
      background: '#f8fafc',
      card: '#ffffff',
      border: '#e5e7eb',
      hover: '#f3f4f6',
    },
    text: {
      primary: '#111827',
      secondary: '#374151',
      muted: '#6b7280',
    }
  },

  // Assisted Mode (Enhanced Investment Banking theme)
  assisted: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      600: '#1e40af',
      700: '#1e3a8a',
      800: '#1e3a8a',
      900: '#1e3a8a',
    },
    accent: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    surface: {
      background: '#f8fafc',
      card: '#ffffff',
      cardAccent: 'linear-gradient(to right, #eff6ff, #f0fdf4)',
      border: '#bfdbfe',
      borderAccent: '#93c5fd',
      hover: '#eff6ff',
    },
    text: {
      primary: '#111827',
      secondary: '#1e3a8a',
      accent: '#166534',
      muted: '#6b7280',
    }
  },

  // Status colors (consistent across both modes)
  status: {
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
    },
    info: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
    },
    neutral: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
    }
  }
} as const;

// =============================================================================
// STATUS SYSTEM
// =============================================================================

export const STATUS = {
  // General statuses (consistent across modules)
  general: [
    'draft',
    'pending',
    'under_review',
    'approved', 
    'rejected',
    'completed',
    'in_progress',
    'cancelled',
    'expired'
  ] as const,

  // Priority levels (consistent across modules)
  priority: [
    'low',
    'medium', 
    'high',
    'critical'
  ] as const,

  // Risk levels (consistent across modules)
  risk: [
    'low',
    'medium',
    'high',
    'critical'
  ] as const,

  // Investment Committee specific
  investmentCommittee: [
    'submitted',
    'under_review',
    'scheduled',
    'presented',
    'approved',
    'rejected',
    'deferred'
  ] as const,

  // Deal Screening specific
  dealScreening: [
    'new',
    'screening',
    'analyzed',
    'approved',
    'rejected',
    'on_hold'
  ] as const,

  // Due Diligence specific
  dueDiligence: [
    'not_started',
    'in_progress',
    'pending_review',
    'completed',
    'approved',
    'flagged'
  ] as const,

  // Legal Management specific
  legal: [
    'draft',
    'under_review',
    'legal_review',
    'approved',
    'executed',
    'expired',
    'terminated'
  ] as const,

  // Fund Operations specific
  fundOperations: [
    'pending',
    'processing',
    'completed',
    'failed',
    'cancelled'
  ] as const
} as const;

// =============================================================================
// STATUS COLOR MAPPING
// =============================================================================

export const getStatusColor = (status: string, mode: 'traditional' | 'assisted' = 'traditional') => {
  const baseColors = COLORS.status;
  const normalizedStatus = status.toLowerCase().replace(/[_\s]/g, '_');
  
  switch (normalizedStatus) {
    case 'approved':
    case 'completed':
    case 'executed':
    case 'compliant':
      return `bg-green-100 text-green-800 border-green-200`;
    
    case 'under_review':
    case 'in_progress':
    case 'processing':
    case 'pending_review':
    case 'legal_review':
      return `bg-yellow-100 text-yellow-800 border-yellow-200`;
    
    case 'draft':
    case 'pending':
    case 'new':
    case 'not_started':
    case 'submitted':
      return `bg-blue-100 text-blue-800 border-blue-200`;
    
    case 'rejected':
    case 'failed':
    case 'overdue':
    case 'expired':
    case 'terminated':
      return `bg-red-100 text-red-800 border-red-200`;
    
    case 'cancelled':
    case 'deferred':
    case 'on_hold':
      return `bg-gray-100 text-gray-800 border-gray-200`;
    
    default:
      return `bg-gray-100 text-gray-800 border-gray-200`;
  }
};

export const getPriorityColor = (priority: string) => {
  const normalizedPriority = priority.toLowerCase();
  
  switch (normalizedPriority) {
    case 'critical':
      return `bg-red-100 text-red-800 border-red-200`;
    case 'high':
      return `bg-orange-100 text-orange-800 border-orange-200`;
    case 'medium':
      return `bg-yellow-100 text-yellow-800 border-yellow-200`;
    case 'low':
      return `bg-green-100 text-green-800 border-green-200`;
    default:
      return `bg-gray-100 text-gray-800 border-gray-200`;
  }
};

export const getRiskColor = (risk: string) => {
  const normalizedRisk = risk.toLowerCase();
  
  switch (normalizedRisk) {
    case 'critical':
    case 'high':
      return `bg-red-100 text-red-800 border-red-200`;
    case 'medium':
      return `bg-yellow-100 text-yellow-800 border-yellow-200`;
    case 'low':
      return `bg-green-100 text-green-800 border-green-200`;
    default:
      return `bg-gray-100 text-gray-800 border-gray-200`;
  }
};

// =============================================================================
// AI VISUAL LANGUAGE
// =============================================================================

export const AI_ELEMENTS = {
  // AI Icons (standardized)
  icons: {
    primary: 'Brain',      // Main AI indicator
    secondary: 'Sparkles', // AI enhancement indicator  
    automation: 'Zap',     // Automation indicator
    insights: 'Lightbulb', // Insights and recommendations
    analysis: 'Target',    // AI analysis indicator
    efficiency: 'Clock',   // Time/efficiency savings
  },

  // AI Badges and Labels
  badges: {
    enhanced: {
      traditional: 'bg-blue-100 text-blue-800 border border-blue-300',
      assisted: 'bg-green-100 text-green-800 border border-green-300',
    },
    score: {
      traditional: 'bg-gray-100 text-gray-800 border border-gray-300',
      assisted: 'bg-blue-100 text-blue-800 border border-blue-300',
    },
    automated: {
      traditional: 'bg-green-100 text-green-800 border border-green-300',
      assisted: 'bg-blue-100 text-blue-800 border border-blue-300',
    }
  },

  // AI Score Colors (based on confidence/score ranges)
  scoreColors: {
    high: 'bg-green-500',      // 80-100%
    medium: 'bg-yellow-500',   // 50-79%
    low: 'bg-red-500',         // 0-49%
  },

  // AI Recommendation Priorities
  recommendationColors: {
    critical: 'bg-red-50 border-red-200',
    high: 'bg-yellow-50 border-yellow-200', 
    medium: 'bg-blue-50 border-blue-200',
    low: 'bg-gray-50 border-gray-200',
  }
} as const;

// =============================================================================
// COMPONENT STYLES
// =============================================================================

export const COMPONENTS = {
  // Cards
  card: {
    traditional: {
      base: 'bg-white border border-gray-200 rounded-lg shadow-sm',
      hover: 'hover:shadow-md transition-shadow',
      focus: 'focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
    },
    assisted: {
      base: 'bg-white border border-blue-200 rounded-lg shadow-sm',
      hover: 'hover:shadow-md transition-shadow',
      focus: 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      accent: 'border-l-4 border-l-blue-500',
    }
  },

  // Buttons
  button: {
    traditional: {
      primary: 'bg-blue-700 hover:bg-blue-800 text-white',
      secondary: 'border-gray-300 text-gray-700 hover:bg-gray-50',
    },
    assisted: {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'border-blue-300 text-blue-700 hover:bg-blue-50',
    }
  },

  // Loading states
  loading: {
    traditional: 'border-b-2 border-gray-600',
    assisted: 'border-b-2 border-blue-600',
  }
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const TYPOGRAPHY = {
  headings: {
    h1: 'text-3xl font-bold text-gray-900',
    h2: 'text-2xl font-bold text-gray-900', 
    h3: 'text-xl font-semibold text-gray-900',
    h4: 'text-lg font-semibold text-gray-900',
    h5: 'text-base font-semibold text-gray-900',
  },
  body: {
    large: 'text-base text-gray-900',
    base: 'text-sm text-gray-700',
    small: 'text-xs text-gray-600',
    muted: 'text-sm text-gray-500',
  }
} as const;

// =============================================================================
// METRICS AND KPI STANDARDS
// =============================================================================

export const METRICS = {
  // Standard KPI categories across modules
  categories: [
    'performance',
    'efficiency', 
    'risk',
    'compliance',
    'automation',
    'accuracy'
  ] as const,

  // Standard performance indicators
  kpiTypes: {
    count: 'numeric',        // Simple count (e.g., "23 documents")
    percentage: 'percentage', // Percentage (e.g., "85%")
    currency: 'currency',    // Money values (e.g., "$2.3M")
    duration: 'duration',    // Time periods (e.g., "12 days")
    score: 'score',          // Scores out of 10 or 100
    trend: 'trend',          // Trending up/down/stable
  } as const,

  // AI Performance Metrics (consistent across modules)
  aiMetrics: {
    timeSaved: 'hours',      // Time saved in hours
    accuracy: 'percentage',   // AI accuracy percentage
    confidence: 'percentage', // AI confidence level
    automation: 'count',     // Number of automated tasks
    efficiency: 'percentage', // Efficiency improvement
  } as const
} as const;

// =============================================================================
// MOCK DATA STANDARDS
// =============================================================================

export const MOCK_DATA = {
  // Company names (realistic but generic)
  companies: [
    'TechCorp Alpha', 'HealthTech Solutions', 'FinServ Innovations',
    'GreenTech Manufacturing', 'DataFlow Systems', 'CloudCorp',
    'BioTech Ventures', 'AI Healthcare', 'NextGen Therapeutics',
    'Smart Energy Solutions', 'Digital Finance Corp', 'FutureTech Labs'
  ],

  // Sectors (consistent across modules)
  sectors: [
    'Technology', 'Healthcare', 'Financial Services', 'Energy',
    'Consumer Goods', 'Industrial', 'Real Estate', 'Telecommunications',
    'Media & Entertainment', 'Transportation', 'Education', 'Agriculture'
  ],

  // Geographic regions
  regions: [
    'North America', 'Europe', 'Asia', 'Asia Pacific', 
    'Latin America', 'Middle East', 'Africa', 'Global'
  ],

  // Team members (consistent across modules)
  teamMembers: [
    'Sarah Johnson', 'Michael Chen', 'Rachel Martinez', 'David Kim',
    'Alex Thompson', 'Emily Rodriguez', 'James Wilson', 'Lisa Park',
    'Robert Taylor', 'Jennifer Liu', 'Mark Anderson', 'Ashley Brown'
  ],

  // Standard metrics ranges for consistency
  ranges: {
    irr: { min: 8, max: 35 },           // IRR percentages
    multiple: { min: 1.2, max: 4.5 },  // Investment multiples  
    aiScore: { min: 65, max: 98 },     // AI confidence scores
    progress: { min: 0, max: 100 },    // Progress percentages
    risk: { min: 1, max: 10 },         // Risk scores
  }
} as const;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get theme-appropriate classes based on mode
 */
export const getThemeClasses = (mode: 'traditional' | 'assisted', element: keyof typeof COMPONENTS) => {
  return COMPONENTS[element][mode];
};

/**
 * Generate AI score color based on score value
 */
export const getAIScoreColor = (score: number): string => {
  if (score >= 80) return AI_ELEMENTS.scoreColors.high;
  if (score >= 50) return AI_ELEMENTS.scoreColors.medium;
  return AI_ELEMENTS.scoreColors.low;
};

/**
 * Format currency consistently across modules
 */
export const formatCurrency = (value: number): string => {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(1)}B`;
  } else if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  } else {
    return `$${value.toFixed(0)}`;
  }
};

/**
 * Format percentage consistently
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format duration consistently 
 */
export const formatDuration = (days: number): string => {
  if (days >= 365) {
    return `${(days / 365).toFixed(1)}y`;
  } else if (days >= 30) {
    return `${(days / 30).toFixed(1)}m`;
  } else {
    return `${days}d`;
  }
};

/**
 * Generate consistent random AI score for demos
 */
export const generateAIScore = (seed: string): number => {
  // Simple hash function for consistent "random" values based on seed
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to percentage in realistic range (65-98%)
  const normalized = Math.abs(hash) % 34; // 0-33 range
  return 65 + normalized; // 65-98 range
};

// =============================================================================
// CONSOLIDATED DESIGN SYSTEM EXPORT
// =============================================================================

export const DESIGN_SYSTEM = {
  colors: {
    traditional: {
      primary: '#4b5563',
      secondary: '#f3f4f6', 
      background: '#f9fafb',
      border: '#e5e7eb',
      text: '#111827',
      icon: '#6b7280'
    },
    ai: {
      primary: '#7c3aed',
      accent: '#ede9fe',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #f5f3ff 100%)',
      border: '#c4b5fd',
      muted: '#8b5cf6',
      success: '#10b981',
      successText: '#065f46',
      warning: '#f59e0b', 
      warningText: '#92400e',
      error: '#ef4444',
      errorText: '#991b1b',
      info: '#3b82f6',
      infoText: '#1e40af'
    },
    status: {
      success: { light: '#d1fae5', dark: '#065f46' },
      warning: { light: '#fef3c7', dark: '#92400e' },
      error: { light: '#fee2e2', dark: '#991b1b' },
      info: { light: '#dbeafe', dark: '#1e40af' }
    },
    priority: {
      high: { light: '#fee2e2', dark: '#991b1b' },
      medium: { light: '#fef3c7', dark: '#92400e' },
      low: { light: '#f3f4f6', dark: '#374151' }
    }
  }
} as const;

export default {
  COLORS,
  STATUS,
  AI_ELEMENTS,
  COMPONENTS,
  TYPOGRAPHY,
  METRICS,
  MOCK_DATA,
  getStatusColor,
  getPriorityColor,
  getRiskColor,
  getThemeClasses,
  getAIScoreColor,
  formatCurrency,
  formatPercentage,
  formatDuration,
  generateAIScore,
};
