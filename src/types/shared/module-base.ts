/**
 * Base module types and interfaces
 * Provides consistent structure for all business modules
 */

import type { HybridMode } from '@/components/shared'
import type { BaseModuleAIState, BaseAIActionHandlers, BaseModuleMetrics } from './module-ai'

/**
 * Standard module configuration
 */
export interface ModuleConfig {
  id: string
  name: string
  description: string
  icon: string
  aiEnhanced: boolean
  complexity: 'low' | 'medium' | 'high' | 'enterprise'
  supportedModes: HybridMode[]
}

/**
 * Module context for navigation and AI systems
 */
export type ModuleContext = 
  | 'dashboard'
  | 'advanced-analytics'
  | 'deal-screening' 
  | 'deal-structuring'
  | 'due-diligence'
  | 'portfolio'
  | 'portfolio-management'
  | 'fund-operations'
  | 'investment-committee'
  | 'legal-management'
  | 'market-intelligence'
  | 'gp-portal'
  | 'lp-portal'
  | 'knowledge-management'
  | 'lpgp-relationship'
  | 'workflow-automation'
  | 'admin-management'

/**
 * Module registry for configuration management
 */
export const MODULE_CONFIGS: Record<ModuleContext, ModuleConfig> = {
  dashboard: {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Overview of all activities and insights',
    icon: 'Home',
    aiEnhanced: true,
    complexity: 'low',
    supportedModes: ['traditional', 'assisted', 'autonomous']
  },
  'advanced-analytics': {
    id: 'advanced-analytics',
    name: 'Advanced Analytics',
    description: 'Predictive modeling, risk correlation, and scenario planning',
    icon: 'BarChart3',
    aiEnhanced: true,
    complexity: 'enterprise',
    supportedModes: ['traditional', 'assisted', 'autonomous']
  },
  'deal-screening': {
    id: 'deal-screening',
    name: 'Deal Screening',
    description: 'AI-powered deal opportunity screening and analysis',
    icon: 'Search',
    aiEnhanced: true,
    complexity: 'high',
    supportedModes: ['traditional', 'assisted', 'autonomous']
  },
  'deal-structuring': {
    id: 'deal-structuring',
    name: 'Deal Structuring',
    description: 'Financial modeling and deal structuring workflows',
    icon: 'PieChart',
    aiEnhanced: true,
    complexity: 'enterprise',
    supportedModes: ['traditional', 'assisted', 'autonomous']
  },
  'due-diligence': {
    id: 'due-diligence',
    name: 'Due Diligence',
    description: 'Comprehensive due diligence workflows',
    icon: 'FileText',
    aiEnhanced: true,
    complexity: 'high',
    supportedModes: ['traditional', 'assisted', 'autonomous']
  },
  portfolio: {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Comprehensive portfolio management with analytics, optimization, risk management, and team collaboration',
    icon: 'PieChart',
    aiEnhanced: true,
    complexity: 'high',
    supportedModes: ['traditional', 'assisted', 'autonomous']
  },
  'portfolio-management': {
    id: 'portfolio-management',
    name: 'Portfolio Management',
    description: 'Enhanced portfolio analytics, ESG reporting, and performance tracking',
    icon: 'BarChart',
    aiEnhanced: true,
    complexity: 'high',
    supportedModes: ['traditional', 'assisted', 'autonomous']
  },
  'fund-operations': {
    id: 'fund-operations',
    name: 'Fund Operations',
    description: 'NAV tracking, expense management, and operational workflows',
    icon: 'Building',
    aiEnhanced: true,
    complexity: 'medium',
    supportedModes: ['traditional', 'assisted', 'autonomous']
  },
  'investment-committee': {
    id: 'investment-committee',
    name: 'Investment Committee',
    description: 'Meeting management, voting systems, and decision tracking',
    icon: 'Users',
    aiEnhanced: true,
    complexity: 'medium',
    supportedModes: ['traditional', 'assisted', 'autonomous']
  },
  'legal-management': {
    id: 'legal-management',
    name: 'Legal Management',
    description: 'Document center, compliance monitoring, and risk assessment',
    icon: 'Shield',
    aiEnhanced: true,
    complexity: 'high',
    supportedModes: ['traditional', 'assisted', 'autonomous']
  },
  'market-intelligence': {
    id: 'market-intelligence',
    name: 'Market Intelligence',
    description: 'AFME dashboard, currency monitoring, and geopolitical analysis',
    icon: 'TrendingUp',
    aiEnhanced: true,
    complexity: 'enterprise',
    supportedModes: ['traditional', 'assisted', 'autonomous']
  },
  'gp-portal': {
    id: 'gp-portal',
    name: 'GP Portal',
    description: 'General Partner interface and tools',
    icon: 'Building2',
    aiEnhanced: true,
    complexity: 'medium',
    supportedModes: ['traditional', 'assisted', 'autonomous']
  },
  'lp-portal': {
    id: 'lp-portal',
    name: 'LP Portal',
    description: 'Limited Partner interface and reporting',
    icon: 'Users',
    aiEnhanced: true,
    complexity: 'medium',
    supportedModes: ['traditional', 'assisted', 'autonomous']
  },
  'knowledge-management': {
    id: 'knowledge-management',
    name: 'Knowledge Center',
    description: 'Institutional memory, expert networks, and pattern recognition',
    icon: 'Brain',
    aiEnhanced: true,
    complexity: 'high',
    supportedModes: ['traditional', 'assisted', 'autonomous']
  },
  'lpgp-relationship': {
    id: 'lpgp-relationship',
    name: 'LP Relationships',
    description: 'CRM, communication center, and strategic relationship planning',
    icon: 'Users',
    aiEnhanced: true,
    complexity: 'low',
    supportedModes: ['traditional', 'assisted', 'autonomous']
  },
  'workflow-automation': {
    id: 'workflow-automation',
    name: 'Workflow Automation',
    description: 'Document workflows, approval processes, and automation',
    icon: 'Zap',
    aiEnhanced: true,
    complexity: 'medium',
    supportedModes: ['traditional', 'assisted', 'autonomous']
  },
  'admin-management': {
    id: 'admin-management',
    name: 'Administration',
    description: 'Multi-org support, RBAC, audit logging, and system administration',
    icon: 'Shield',
    aiEnhanced: true,
    complexity: 'low',
    supportedModes: ['traditional', 'assisted', 'autonomous']
  }
}

/**
 * Base module state interface
 */
export interface BaseModuleState<TModule extends ModuleContext> {
  moduleId: TModule
  currentMode: HybridMode
  isLoading: boolean
  aiState: BaseModuleAIState
  metrics: BaseModuleMetrics
}

/**
 * Module component interface that all hybrid modules should implement
 */
export interface ModuleComponentInterface<TModule extends ModuleContext> {
  moduleId: TModule
  currentMode: HybridMode
  state: BaseModuleState<TModule>
  actionHandlers: BaseAIActionHandlers
  onModeSwitch: (mode: HybridMode) => void
}