// Role-based access control types
export type UserRole = 
  | 'senior_partner'
  | 'investment_director' 
  | 'principal'
  | 'associate'
  | 'analyst'
  | 'fund_operations'
  | 'portfolio_operations'
  | 'legal_compliance'
  | 'ir_lp_relations'
  | 'general_partner'
  | 'limited_partner'
  | 'portfolio_company'
  | 'admin';

export type Permission = 
  | 'view_all_deals'
  | 'create_deals'
  | 'approve_deals'
  | 'view_portfolio'
  | 'manage_portfolio'
  | 'view_financials'
  | 'manage_financials'
  | 'view_lp_data'
  | 'manage_lp_relations'
  | 'view_compliance'
  | 'manage_compliance'
  | 'view_operations'
  | 'manage_operations'
  | 'admin_access'
  | 'submit_deals'
  | 'view_own_deals'
  | 'view_reports'
  | 'manage_documents';

export interface RoleDefinition {
  role: UserRole;
  name: string;
  description: string;
  permissions: Permission[];
  defaultModules: string[];
  dashboardLayout: 'executive' | 'investment' | 'operations' | 'external';
  category: 'internal' | 'external';
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: Permission[];
  preferences: UserRolePreferences;
  lastLogin?: Date;
  isActive: boolean;
}

export interface UserRolePreferences {
  defaultDashboard: string;
  favoriteModules: string[];
  notificationSettings: {
    email: boolean;
    push: boolean;
    dealUpdates: boolean;
    portfolioAlerts: boolean;
    complianceReminders: boolean;
  };
  uiPreferences: {
    density: 'compact' | 'comfortable' | 'spacious';
    theme: 'light' | 'dark' | 'auto';
    sidebarCollapsed: boolean;
  };
}

export interface RoleBasedNavigationItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  description?: string;
  requiredPermissions: Permission[];
  allowedRoles: UserRole[];
  category: 'primary' | 'secondary' | 'admin';
  badge?: string | number;
  children?: RoleBasedNavigationItem[];
}

export interface DashboardConfig {
  layout: 'executive' | 'investment' | 'operations' | 'external';
  widgets: DashboardWidget[];
  columns: number;
  allowCustomization: boolean;
}

export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'list' | 'table' | 'activity' | 'notification';
  title: string;
  size: 'small' | 'medium' | 'large' | 'full';
  position: { row: number; col: number };
  requiredPermissions: Permission[];
  dataSource: string;
  refreshInterval?: number;
  customizable: boolean;
}

// Role configuration constants
export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  senior_partner: {
    role: 'senior_partner',
    name: 'Senior Partner / Managing Director',
    description: 'Strategic oversight and final decision authority',
    permissions: [
      'view_all_deals', 'approve_deals', 'view_portfolio', 'manage_portfolio',
      'view_financials', 'manage_financials', 'view_lp_data', 'manage_lp_relations',
      'view_compliance', 'view_operations', 'admin_access'
    ],
    defaultModules: [
      'dashboard', 'investment-committee', 'portfolio', 'lp-portal', 
      'fund-operations', 'advanced-analytics'
    ],
    dashboardLayout: 'executive',
    category: 'internal'
  },
  investment_director: {
    role: 'investment_director',
    name: 'Investment Director',
    description: 'Deal leadership and investment committee presentations',
    permissions: [
      'view_all_deals', 'create_deals', 'view_portfolio', 'manage_portfolio',
      'view_financials', 'view_lp_data', 'view_compliance'
    ],
    defaultModules: [
      'dashboard', 'deal-screening', 'due-diligence', 'deal-structuring',
      'investment-committee', 'portfolio', 'market-intelligence'
    ],
    dashboardLayout: 'investment',
    category: 'internal'
  },
  principal: {
    role: 'principal',
    name: 'Principal / VP',
    description: 'Deal execution and analysis leadership',
    permissions: [
      'view_all_deals', 'create_deals', 'view_portfolio', 'view_financials',
      'view_compliance'
    ],
    defaultModules: [
      'dashboard', 'deal-screening', 'due-diligence', 'deal-structuring',
      'portfolio', 'market-intelligence', 'advanced-analytics'
    ],
    dashboardLayout: 'investment',
    category: 'internal'
  },
  associate: {
    role: 'associate',
    name: 'Associate',
    description: 'Deal support and analysis',
    permissions: [
      'view_all_deals', 'create_deals', 'view_portfolio', 'view_financials'
    ],
    defaultModules: [
      'dashboard', 'deal-screening', 'due-diligence', 'deal-structuring',
      'portfolio', 'market-intelligence'
    ],
    dashboardLayout: 'investment',
    category: 'internal'
  },
  analyst: {
    role: 'analyst',
    name: 'Analyst',
    description: 'Research, modeling, and due diligence support',
    permissions: [
      'view_all_deals', 'view_portfolio', 'view_financials'
    ],
    defaultModules: [
      'dashboard', 'deal-screening', 'due-diligence', 'market-intelligence',
      'advanced-analytics', 'workspaces'
    ],
    dashboardLayout: 'investment',
    category: 'internal'
  },
  fund_operations: {
    role: 'fund_operations',
    name: 'Fund Operations Manager',
    description: 'Fund administration and reporting',
    permissions: [
      'view_all_deals', 'view_portfolio', 'view_financials', 'manage_financials',
      'view_operations', 'manage_operations', 'view_compliance', 'manage_compliance'
    ],
    defaultModules: [
      'dashboard', 'fund-operations', 'portfolio', 'legal-management',
      'workflow-automation', 'advanced-analytics'
    ],
    dashboardLayout: 'operations',
    category: 'internal'
  },
  portfolio_operations: {
    role: 'portfolio_operations',
    name: 'Portfolio Operations',
    description: 'Portfolio company support and monitoring',
    permissions: [
      'view_portfolio', 'manage_portfolio', 'view_financials', 'view_operations'
    ],
    defaultModules: [
      'dashboard', 'portfolio', 'workflow-automation', 'knowledge-management'
    ],
    dashboardLayout: 'operations',
    category: 'internal'
  },
  legal_compliance: {
    role: 'legal_compliance',
    name: 'Legal & Compliance',
    description: 'Legal review and regulatory compliance',
    permissions: [
      'view_all_deals', 'view_compliance', 'manage_compliance', 'manage_documents'
    ],
    defaultModules: [
      'dashboard', 'legal-management', 'due-diligence', 'workflow-automation'
    ],
    dashboardLayout: 'operations',
    category: 'internal'
  },
  ir_lp_relations: {
    role: 'ir_lp_relations',
    name: 'IR & LP Relations',
    description: 'Limited partner communications and relations',
    permissions: [
      'view_portfolio', 'view_financials', 'view_lp_data', 'manage_lp_relations',
      'view_reports'
    ],
    defaultModules: [
      'dashboard', 'lp-portal', 'portfolio', 'fund-operations', 'lpgp-relationship'
    ],
    dashboardLayout: 'operations',
    category: 'internal'
  },
  general_partner: {
    role: 'general_partner',
    name: 'General Partner',
    description: 'External GP with deal submission access',
    permissions: [
      'submit_deals', 'view_own_deals', 'manage_documents', 'view_reports'
    ],
    defaultModules: [
      'gp-portal', 'knowledge-management'
    ],
    dashboardLayout: 'external',
    category: 'external'
  },
  limited_partner: {
    role: 'limited_partner',
    name: 'Limited Partner',
    description: 'External LP with investment monitoring access',
    permissions: [
      'view_reports', 'view_portfolio'
    ],
    defaultModules: [
      'lp-portal', 'portfolio'
    ],
    dashboardLayout: 'external',
    category: 'external'
  },
  portfolio_company: {
    role: 'portfolio_company',
    name: 'Portfolio Company Executive',
    description: 'Portfolio company reporting and support access',
    permissions: [
      'view_reports', 'manage_documents'
    ],
    defaultModules: [
      'portfolio', 'knowledge-management'
    ],
    dashboardLayout: 'external',
    category: 'external'
  },
  admin: {
    role: 'admin',
    name: 'System Administrator',
    description: 'Full system administration access',
    permissions: [
      'admin_access', 'view_all_deals', 'manage_portfolio', 'manage_financials',
      'manage_operations', 'manage_compliance', 'manage_lp_relations'
    ],
    defaultModules: [
      'admin-management', 'dashboard', 'workflow-automation'
    ],
    dashboardLayout: 'operations',
    category: 'internal'
  }
};

// Permission checking utilities
export const hasPermission = (user: User, permission: Permission): boolean => {
  return user.permissions.includes(permission);
};

export const hasAnyPermission = (user: User, permissions: Permission[]): boolean => {
  return permissions.some(permission => user.permissions.includes(permission));
};

export const hasAllPermissions = (user: User, permissions: Permission[]): boolean => {
  return permissions.every(permission => user.permissions.includes(permission));
};

export const canAccessModule = (user: User, moduleId: string): boolean => {
  const roleDefinition = ROLE_DEFINITIONS[user.role];
  return roleDefinition.defaultModules.includes(moduleId);
};

export const getAllNavigationItems = (): RoleBasedNavigationItem[] => {
  // Unified navigation items - all modules accessible to everyone
  return [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'Home',
      href: '/dashboard',
      requiredPermissions: [],
      allowedRoles: [],
      category: 'primary'
    },
    {
      id: 'deal-screening',
      label: 'Deal Screening',
      icon: 'Search',
      href: '/deal-screening',
      requiredPermissions: [],
      allowedRoles: [],
      category: 'primary'
    },
    {
      id: 'due-diligence',
      label: 'Due Diligence',
      icon: 'FileText',
      href: '/due-diligence',
      requiredPermissions: [],
      allowedRoles: [],
      category: 'primary'
    },
    {
      id: 'deal-structuring',
      label: 'Deal Structuring',
      icon: 'PieChart',
      href: '/deal-structuring',
      requiredPermissions: [],
      allowedRoles: [],
      category: 'primary'
    },
    {
      id: 'investment-committee',
      label: 'Investment Committee',
      icon: 'Users',
      href: '/investment-committee',
      requiredPermissions: [],
      allowedRoles: [],
      category: 'primary'
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      icon: 'PieChart',
      href: '/portfolio',
      requiredPermissions: [],
      allowedRoles: [],
      category: 'primary'
    },
    {
      id: 'exits',
      label: 'Exit Management',
      icon: 'TrendingUp',
      href: '/exits',
      requiredPermissions: [],
      allowedRoles: [],
      category: 'primary'
    },
    {
      id: 'fund-operations',
      label: 'Fund Operations',
      icon: 'Building',
      href: '/fund-operations',
      requiredPermissions: [],
      allowedRoles: [],
      category: 'primary'
    },
    {
      id: 'market-intelligence',
      label: 'Market Intelligence',
      icon: 'TrendingUp',
      href: '/market-intelligence',
      requiredPermissions: [],
      allowedRoles: [],
      category: 'primary'
    },
    {
      id: 'gp-portal',
      label: 'GP Portal',
      icon: 'Shield',
      href: '/gp-portal',
      requiredPermissions: [],
      allowedRoles: [],
      category: 'primary'
    },
    {
      id: 'lp-portal',
      label: 'LP Portal',
      icon: 'Users',
      href: '/lp-portal',
      requiredPermissions: [],
      allowedRoles: [],
      category: 'primary'
    },
    {
      id: 'legal-management',
      label: 'Legal Management',
      icon: 'FileText',
      href: '/legal-management',
      requiredPermissions: [],
      allowedRoles: [],
      category: 'secondary'
    },
    {
      id: 'knowledge-management',
      label: 'Knowledge Management',
      icon: 'Brain',
      href: '/knowledge-management',
      requiredPermissions: [],
      allowedRoles: [],
      category: 'secondary'
    },
    {
      id: 'workflow-automation',
      label: 'Workflow Automation',
      icon: 'Zap',
      href: '/workflow-automation',
      requiredPermissions: [],
      allowedRoles: [],
      category: 'secondary'
    },
    {
      id: 'advanced-analytics',
      label: 'Advanced Analytics',
      icon: 'BarChart',
      href: '/advanced-analytics',
      requiredPermissions: [],
      allowedRoles: [],
      category: 'secondary'
    },
    {
      id: 'lpgp-relationship',
      label: 'LP-GP Relationship',
      icon: 'Users',
      href: '/lpgp-relationship',
      requiredPermissions: [],
      allowedRoles: [],
      category: 'secondary'
    },
    {
      id: 'admin-management',
      label: 'Admin Management',
      icon: 'Settings',
      href: '/admin-management',
      requiredPermissions: [],
      allowedRoles: [],
      category: 'admin'
    },
    {
      id: 'workspaces',
      label: 'Workspaces',
      icon: 'Layout',
      href: '/workspaces',
      requiredPermissions: [],
      allowedRoles: [],
      category: 'primary'
    },
    {
      id: 'role-demo',
      label: 'Access Control',
      icon: 'Users',
      href: '/role-demo',
      requiredPermissions: [],
      allowedRoles: [],
      category: 'secondary'
    }
  ];
};

// Keep for backward compatibility, but return all items
export const getRoleBasedNavigation = (): RoleBasedNavigationItem[] => {
  return getAllNavigationItems();
};
