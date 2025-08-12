export type ModuleCategory = 'core' | 'standard' | 'advanced' | 'premium';
export type PortfolioMode = 'traditional' | 'assisted' | 'autonomous';

export interface ModuleConfig {
  id: string;
  label: string;
  component: string;
  icon: string;
  category: ModuleCategory;
  description: string;
  requiredAssetTypes?: string[];
  aiFeatures?: string[];
  order: number;
}

export interface ModuleGroup {
  id: string;
  title: string;
  icon: string;
  modules: ModuleConfig[];
  collapsible?: boolean;
  defaultOpen?: boolean;
}

// Define all available modules
export const PORTFOLIO_MODULES: ModuleConfig[] = [
  // Core Modules (All Modes)
  {
    id: 'overview',
    label: 'Portfolio Overview',
    component: 'PortfolioOverview',
    icon: '📊',
    category: 'core',
    description: 'High-level portfolio metrics and summary',
    order: 1
  },
  {
    id: 'performance',
    label: 'Performance Metrics',
    component: 'PortfolioPerformance',
    icon: '📈',
    category: 'core',
    description: 'Portfolio performance tracking and analysis',
    order: 2
  },
  {
    id: 'assets',
    label: 'Asset Management',
    component: 'VirtualizedAssetGrid',
    icon: '🏢',
    category: 'core',
    description: 'Comprehensive asset portfolio management',
    order: 3
  },

  // Standard Modules (Traditional + Assisted)
  {
    id: 'analytics',
    label: 'Analytics Dashboard',
    component: 'ProfessionalAnalytics',
    icon: '📊',
    category: 'standard',
    description: 'Professional analytics and insights',
    order: 4
  },
  {
    id: 'reporting',
    label: 'Report Generation',
    component: 'ProfessionalReporting',
    icon: '📄',
    category: 'standard',
    description: 'Generate professional portfolio reports',
    order: 5
  },

  // Advanced Modules (Assisted + Autonomous)
  {
    id: 'risk-management',
    label: 'Risk Management',
    component: 'RiskManagement',
    icon: '⚠️',
    category: 'advanced',
    description: 'Advanced risk assessment and mitigation',
    aiFeatures: ['risk-scoring', 'scenario-analysis'],
    order: 6
  },
  {
    id: 'optimization',
    label: 'Portfolio Optimization',
    component: 'PortfolioOptimization',
    icon: '🎯',
    category: 'advanced',
    description: 'AI-powered portfolio optimization',
    aiFeatures: ['allocation-optimization', 'rebalancing-suggestions'],
    order: 7
  },
  {
    id: 'market-intelligence',
    label: 'Market Intelligence',
    component: 'MarketIntelligence',
    icon: '🌐',
    category: 'advanced',
    description: 'Real-time market insights and trends',
    aiFeatures: ['market-analysis', 'trend-prediction'],
    order: 8
  },

  // Premium Modules (Autonomous Only)
  {
    id: 'capital-management',
    label: 'Capital Management',
    component: 'CapitalManagement',
    icon: '💰',
    category: 'premium',
    description: 'Advanced capital allocation and management',
    order: 9
  },
  {
    id: 'team-collaboration',
    label: 'Team Collaboration',
    component: 'TeamCollaboration',
    icon: '👥',
    category: 'premium',
    description: 'Team workflow and collaboration tools',
    order: 10
  },
  {
    id: 'custom-dashboard',
    label: 'Custom Dashboards',
    component: 'CustomDashboard',
    icon: '🎛️',
    category: 'premium',
    description: 'Fully customizable dashboard views',
    order: 11
  },

  // Asset Type Specific Modules
  {
    id: 'traditional-assets',
    label: 'Traditional Assets',
    component: 'TraditionalAssetsView',
    icon: '💼',
    category: 'core',
    description: 'Traditional investment portfolio management',
    requiredAssetTypes: ['traditional'],
    order: 12
  },
  {
    id: 'real-estate-assets',
    label: 'Real Estate',
    component: 'RealEstateAssetsView',
    icon: '🏠',
    category: 'core',
    description: 'Real estate portfolio management',
    requiredAssetTypes: ['real_estate'],
    order: 13
  },
  {
    id: 'infrastructure-assets',
    label: 'Infrastructure',
    component: 'InfrastructureAssetsView',
    icon: '🏗️',
    category: 'core',
    description: 'Infrastructure asset management',
    requiredAssetTypes: ['infrastructure'],
    order: 14
  }
];

// Mode-specific module configurations
export const MODE_MODULE_ACCESS: Record<PortfolioMode, ModuleCategory[]> = {
  traditional: ['core', 'standard'],
  assisted: ['core', 'standard', 'advanced'],
  autonomous: ['core', 'standard', 'advanced', 'premium']
};

// Hierarchical module groupings by mode
export const getModuleGroups = (mode: PortfolioMode): ModuleGroup[] => {
  const allowedCategories = MODE_MODULE_ACCESS[mode];
  const availableModules = PORTFOLIO_MODULES.filter(module => 
    allowedCategories.includes(module.category)
  );

  switch (mode) {
    case 'traditional':
      return [
        {
          id: 'dashboard',
          title: 'Portfolio Dashboard',
          icon: '📊',
          defaultOpen: true,
          modules: availableModules.filter(m => 
            ['overview', 'performance', 'assets'].includes(m.id)
          )
        },
        {
          id: 'asset-management',
          title: 'Asset Management',
          icon: '🏢',
          defaultOpen: false,
          collapsible: true,
          modules: availableModules.filter(m => 
            m.requiredAssetTypes && m.requiredAssetTypes.length > 0
          )
        },
        {
          id: 'analytics-reports',
          title: 'Analytics & Reports',
          icon: '📈',
          defaultOpen: false,
          collapsible: true,
          modules: availableModules.filter(m => 
            ['analytics', 'reporting'].includes(m.id)
          )
        }
      ];

    case 'assisted':
      return [
        {
          id: 'ai-dashboard',
          title: 'AI-Enhanced Dashboard',
          icon: '🧠',
          defaultOpen: true,
          modules: availableModules.filter(m => 
            ['overview', 'performance', 'assets'].includes(m.id)
          )
        },
        {
          id: 'asset-management',
          title: 'Intelligent Asset Management',
          icon: '🏢',
          defaultOpen: false,
          collapsible: true,
          modules: availableModules.filter(m => 
            m.requiredAssetTypes && m.requiredAssetTypes.length > 0
          )
        },
        {
          id: 'advanced-analytics',
          title: 'Advanced Analytics',
          icon: '📊',
          defaultOpen: false,
          collapsible: true,
          modules: availableModules.filter(m => 
            ['analytics', 'risk-management', 'optimization', 'market-intelligence'].includes(m.id)
          )
        },
        {
          id: 'reports',
          title: 'Professional Reports',
          icon: '📄',
          defaultOpen: false,
          collapsible: true,
          modules: availableModules.filter(m => m.id === 'reporting')
        }
      ];

    case 'autonomous':
      return [
        {
          id: 'autonomous-dashboard',
          title: 'Autonomous Command Center',
          icon: '🤖',
          defaultOpen: true,
          modules: availableModules.filter(m => 
            ['overview', 'performance', 'assets'].includes(m.id)
          )
        },
        {
          id: 'asset-management',
          title: 'Asset Management',
          icon: '🏢',
          defaultOpen: false,
          collapsible: true,
          modules: availableModules.filter(m => 
            m.requiredAssetTypes && m.requiredAssetTypes.length > 0
          )
        },
        {
          id: 'ai-optimization',
          title: 'AI Optimization Suite',
          icon: '🎯',
          defaultOpen: false,
          collapsible: true,
          modules: availableModules.filter(m => 
            ['optimization', 'risk-management', 'market-intelligence'].includes(m.id)
          )
        },
        {
          id: 'enterprise',
          title: 'Enterprise Features',
          icon: '🏢',
          defaultOpen: false,
          collapsible: true,
          modules: availableModules.filter(m => 
            ['capital-management', 'team-collaboration', 'custom-dashboard'].includes(m.id)
          )
        },
        {
          id: 'analytics-reports',
          title: 'Analytics & Reports',
          icon: '📈',
          defaultOpen: false,
          collapsible: true,
          modules: availableModules.filter(m => 
            ['analytics', 'reporting'].includes(m.id)
          )
        }
      ];

    default:
      return [];
  }
};

// Helper function to get modules for a specific mode
export const getModulesForMode = (mode: PortfolioMode): ModuleConfig[] => {
  const allowedCategories = MODE_MODULE_ACCESS[mode];
  return PORTFOLIO_MODULES.filter(module => 
    allowedCategories.includes(module.category)
  ).sort((a, b) => a.order - b.order);
};

// Helper function to check if a module is available in a mode
export const isModuleAvailable = (moduleId: string, mode: PortfolioMode): boolean => {
  const availableModules = getModulesForMode(mode);
  return availableModules.some(module => module.id === moduleId);
};