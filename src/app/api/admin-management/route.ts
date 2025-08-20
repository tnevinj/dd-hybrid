import { NextRequest, NextResponse } from 'next/server';
import {
  Organization,
  OrganizationUser,
  User,
  Role,
  Permission,
  AuditLog,
  UserSession,
  OrganizationInvitation,
  AdminAnalytics,
  AdminAIInsight,
  SecurityAlert,
  OrganizationSize,
  OrganizationStatus,
  SubscriptionTier,
  SubscriptionStatus,
  BillingCycle,
  OrganizationUserStatus,
  PermissionCategory,
  PermissionRiskLevel,
  AuditAction,
  AuditRiskLevel,
  InvitationStatus,
} from '@/types/admin-management';

// Mock data for Organizations
const mockOrganizations: Organization[] = [
  {
    id: 'org-1',
    name: 'Meridian Capital Partners',
    displayName: 'Meridian Capital',
    description: 'Mid-market private equity firm focused on technology investments',
    website: 'https://meridian-capital.com',
    industry: 'Private Equity',
    size: OrganizationSize.LARGE,
    status: OrganizationStatus.ACTIVE,
    subscriptionTier: SubscriptionTier.ENTERPRISE,
    subscriptionStatus: SubscriptionStatus.ACTIVE,
    billingCycle: BillingCycle.YEARLY,
    subscriptionStart: new Date('2023-01-15'),
    subscriptionEnd: new Date('2024-01-15'),
    settings: {
      allowGuestAccess: false,
      requireMFA: true,
      sessionTimeout: 480,
      autoLogout: true,
      dataRetentionDays: 2555
    },
    branding: {
      primaryColor: '#1E40AF',
      logo: '/logos/meridian-capital.svg',
      favicon: '/favicons/meridian.ico'
    },
    users: [],
    roles: [],
    permissions: [],
    auditLogs: [],
    sessions: [],
    invitations: [],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'org-2',
    name: 'Alpine Growth Ventures',
    displayName: 'Alpine Growth',
    description: 'Early-stage venture capital fund investing in SaaS startups',
    website: 'https://alpine-growth.com',
    industry: 'Venture Capital',
    size: OrganizationSize.MEDIUM,
    status: OrganizationStatus.ACTIVE,
    subscriptionTier: SubscriptionTier.PROFESSIONAL,
    subscriptionStatus: SubscriptionStatus.ACTIVE,
    billingCycle: BillingCycle.MONTHLY,
    subscriptionStart: new Date('2023-06-01'),
    subscriptionEnd: new Date('2024-06-01'),
    settings: {
      allowGuestAccess: true,
      requireMFA: false,
      sessionTimeout: 240,
      autoLogout: false,
      dataRetentionDays: 1095
    },
    users: [],
    roles: [],
    permissions: [],
    auditLogs: [],
    sessions: [],
    invitations: [],
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: 'org-3',
    name: 'Brookstone Family Office',
    displayName: 'Brookstone FO',
    description: 'Multi-family office managing $2B+ in assets',
    website: 'https://brookstone-fo.com',
    industry: 'Family Office',
    size: OrganizationSize.SMALL,
    status: OrganizationStatus.TRIAL,
    subscriptionTier: SubscriptionTier.BASIC,
    subscriptionStatus: SubscriptionStatus.TRIAL,
    billingCycle: BillingCycle.MONTHLY,
    trialEnd: new Date('2024-02-15'),
    settings: {
      allowGuestAccess: false,
      requireMFA: true,
      sessionTimeout: 360,
      autoLogout: true,
      dataRetentionDays: 730
    },
    users: [],
    roles: [],
    permissions: [],
    auditLogs: [],
    sessions: [],
    invitations: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-25'),
  },
];

// Mock data for Users
const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'sarah.chen@meridian-capital.com',
    name: 'Sarah Chen',
    navigationMode: 'assisted',
    aiAdoptionLevel: 7,
    aiPermissions: {
      suggestions: true,
      autoComplete: true,
      proactiveActions: true,
      autonomousExecution: false,
      dataAnalysis: true,
      reportGeneration: true,
      meetingScheduling: false,
      documentProcessing: true
    },
    createdAt: new Date('2023-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'user-2',
    email: 'michael.rodriguez@alpine-growth.com',
    name: 'Michael Rodriguez',
    navigationMode: 'traditional',
    aiAdoptionLevel: 3,
    aiPermissions: {
      suggestions: true,
      autoComplete: false,
      proactiveActions: false,
      autonomousExecution: false,
      dataAnalysis: true,
      reportGeneration: false,
      meetingScheduling: false,
      documentProcessing: false
    },
    createdAt: new Date('2023-06-05'),
    updatedAt: new Date('2024-01-15'),
  },
];

// Mock data for Organization Users
const mockOrganizationUsers: OrganizationUser[] = [
  {
    id: 'ou-1',
    organizationId: 'org-1',
    userId: 'user-1',
    status: OrganizationUserStatus.ACTIVE,
    joinedAt: new Date('2023-01-20'),
    roleIds: ['role-1', 'role-2'],
    customPermissions: { 'portfolio.export': true },
    preferences: { dashboardLayout: 'grid', theme: 'dark' },
    lastActivity: new Date('2024-01-25'),
    organization: mockOrganizations[0],
    user: mockUsers[0],
  },
  {
    id: 'ou-2',
    organizationId: 'org-2',
    userId: 'user-2',
    status: OrganizationUserStatus.ACTIVE,
    joinedAt: new Date('2023-06-05'),
    roleIds: ['role-3'],
    lastActivity: new Date('2024-01-24'),
    organization: mockOrganizations[1],
    user: mockUsers[1],
  },
];

// Mock data for Roles
const mockRoles: Role[] = [
  {
    id: 'role-1',
    name: 'fund_manager',
    displayName: 'Fund Manager',
    description: 'Full access to fund operations and portfolio management',
    organizationId: 'org-1',
    isSystem: true,
    isDefault: false,
    childRoles: [],
    permissions: [],
    userCount: 3,
    organization: mockOrganizations[0],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-12-01'),
  },
  {
    id: 'role-2',
    name: 'investment_analyst',
    displayName: 'Investment Analyst',
    description: 'Access to deal analysis and portfolio monitoring',
    organizationId: 'org-1',
    isSystem: true,
    isDefault: true,
    parentRoleId: 'role-1',
    childRoles: [],
    permissions: [],
    userCount: 8,
    organization: mockOrganizations[0],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-11-15'),
  },
  {
    id: 'role-3',
    name: 'partner',
    displayName: 'General Partner',
    description: 'Executive access to all fund operations',
    organizationId: 'org-2',
    isSystem: true,
    isDefault: false,
    childRoles: [],
    permissions: [],
    userCount: 2,
    organization: mockOrganizations[1],
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2023-10-20'),
  },
];

// Mock data for Permissions
const mockPermissions: Permission[] = [
  {
    id: 'perm-1',
    name: 'fund.read',
    displayName: 'View Funds',
    description: 'Permission to view fund information',
    category: PermissionCategory.FUND_MANAGEMENT,
    module: 'fund-management',
    isSystem: true,
    riskLevel: PermissionRiskLevel.LOW,
    requiresApproval: false,
    rolePermissions: [],
    orgPermissions: [],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: 'perm-2',
    name: 'portfolio.write',
    displayName: 'Edit Portfolio',
    description: 'Permission to modify portfolio data',
    category: PermissionCategory.PORTFOLIO_MANAGEMENT,
    module: 'portfolio-management',
    isSystem: true,
    riskLevel: PermissionRiskLevel.MEDIUM,
    requiresApproval: false,
    rolePermissions: [],
    orgPermissions: [],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: 'perm-3',
    name: 'system.admin',
    displayName: 'System Administrator',
    description: 'Full system administrative access',
    category: PermissionCategory.SYSTEM,
    module: 'admin',
    isSystem: true,
    riskLevel: PermissionRiskLevel.CRITICAL,
    requiresApproval: true,
    rolePermissions: [],
    orgPermissions: [],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
];

// Mock data for Audit Logs
const mockAuditLogs: AuditLog[] = [
  {
    id: 'audit-1',
    organizationId: 'org-1',
    userId: 'user-1',
    action: AuditAction.LOGIN,
    entity: 'User',
    entityId: 'user-1',
    entityData: { loginMethod: 'email', mfaUsed: true },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    sessionId: 'session-123',
    riskLevel: AuditRiskLevel.LOW,
    flagged: false,
    organization: mockOrganizations[0],
    user: mockUsers[0],
    createdAt: new Date('2024-01-25T09:30:00Z'),
  },
  {
    id: 'audit-2',
    organizationId: 'org-1',
    userId: 'user-1',
    action: AuditAction.UPDATE,
    entity: 'PortfolioCompany',
    entityId: 'pc-456',
    entityData: { valuation: 150000000 },
    previousData: { valuation: 120000000 },
    metadata: { reason: 'quarterly_revaluation' },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    sessionId: 'session-123',
    riskLevel: AuditRiskLevel.MEDIUM,
    flagged: false,
    organization: mockOrganizations[0],
    user: mockUsers[0],
    createdAt: new Date('2024-01-25T10:15:00Z'),
  },
  {
    id: 'audit-3',
    organizationId: 'org-2',
    userId: 'user-2',
    action: AuditAction.DATA_EXPORT,
    entity: 'LPReport',
    entityData: { reportType: 'quarterly', format: 'pdf' },
    metadata: { recipientEmail: 'lp@pension-fund.com' },
    ipAddress: '203.0.113.45',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sessionId: 'session-789',
    riskLevel: AuditRiskLevel.HIGH,
    flagged: true,
    organization: mockOrganizations[1],
    user: mockUsers[1],
    createdAt: new Date('2024-01-24T16:45:00Z'),
  },
];

// Mock data for User Sessions
const mockUserSessions: UserSession[] = [
  {
    id: 'session-1',
    userId: 'user-1',
    organizationId: 'org-1',
    sessionToken: 'token-abc123',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    location: { country: 'US', city: 'San Francisco', region: 'CA' },
    device: { type: 'desktop', os: 'macOS', browser: 'Chrome' },
    isActive: true,
    lastActivity: new Date('2024-01-25T10:30:00Z'),
    loginAt: new Date('2024-01-25T09:00:00Z'),
    riskScore: 0.1,
    isCompromised: false,
    user: mockUsers[0],
    organization: mockOrganizations[0],
    createdAt: new Date('2024-01-25T09:00:00Z'),
    updatedAt: new Date('2024-01-25T10:30:00Z'),
  },
  {
    id: 'session-2',
    userId: 'user-2',
    organizationId: 'org-2',
    sessionToken: 'token-xyz789',
    ipAddress: '203.0.113.45',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    location: { country: 'US', city: 'New York', region: 'NY' },
    device: { type: 'desktop', os: 'Windows', browser: 'Chrome' },
    isActive: true,
    lastActivity: new Date('2024-01-24T17:00:00Z'),
    loginAt: new Date('2024-01-24T08:30:00Z'),
    riskScore: 0.7,
    isCompromised: false,
    user: mockUsers[1],
    organization: mockOrganizations[1],
    createdAt: new Date('2024-01-24T08:30:00Z'),
    updatedAt: new Date('2024-01-24T17:00:00Z'),
  },
];

// Mock data for Organization Invitations
const mockOrganizationInvitations: OrganizationInvitation[] = [
  {
    id: 'inv-1',
    organizationId: 'org-3',
    email: 'alex.thompson@brookstone-fo.com',
    roleIds: ['role-4'],
    invitedById: 'user-3',
    invitedBy: { 
      id: 'user-3', 
      email: 'admin@brookstone-fo.com',
      name: 'Amanda Brookstone',
      navigationMode: 'traditional',
      aiAdoptionLevel: 2,
      aiPermissions: {},
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    message: 'Welcome to Brookstone Family Office platform',
    status: InvitationStatus.PENDING,
    expiresAt: new Date('2024-02-10'),
    token: 'inv-token-abc123',
    attempts: 0,
    organization: mockOrganizations[2],
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
  },
];

// Mock Analytics Data
const mockAnalytics: AdminAnalytics = {
  totalOrganizations: mockOrganizations.length,
  activeUsers: 147,
  totalAuditEvents: 2847,
  securityIncidents: 3,
  subscriptionRevenue: 89750,
  organizationGrowth: [
    {
      date: '2024-01-01',
      newOrganizations: 2,
      totalOrganizations: 15,
      subscriptionTier: SubscriptionTier.BASIC,
    },
    {
      date: '2024-01-15',
      newOrganizations: 1,
      totalOrganizations: 16,
      subscriptionTier: SubscriptionTier.ENTERPRISE,
    },
    {
      date: '2024-01-25',
      newOrganizations: 1,
      totalOrganizations: 17,
      subscriptionTier: SubscriptionTier.PROFESSIONAL,
    },
  ],
  userActivity: [
    {
      organizationId: 'org-1',
      organizationName: 'Meridian Capital Partners',
      activeUsers: 23,
      totalSessions: 156,
      averageSessionDuration: 127.5,
      lastActivity: new Date('2024-01-25T10:30:00Z'),
    },
    {
      organizationId: 'org-2',
      organizationName: 'Alpine Growth Ventures',
      activeUsers: 15,
      totalSessions: 89,
      averageSessionDuration: 95.2,
      lastActivity: new Date('2024-01-24T17:00:00Z'),
    },
  ],
  securityMetrics: [
    {
      date: '2024-01-20',
      totalEvents: 234,
      highRiskEvents: 12,
      flaggedEvents: 3,
      suspiciousSessions: 2,
      blockedAttempts: 15,
    },
    {
      date: '2024-01-25',
      totalEvents: 198,
      highRiskEvents: 8,
      flaggedEvents: 1,
      suspiciousSessions: 1,
      blockedAttempts: 9,
    },
  ],
  subscriptionMetrics: [
    {
      tier: SubscriptionTier.ENTERPRISE,
      count: 5,
      revenue: 49750,
      churn: 0.05,
      growth: 0.15,
    },
    {
      tier: SubscriptionTier.PROFESSIONAL,
      count: 8,
      revenue: 32000,
      churn: 0.08,
      growth: 0.22,
    },
    {
      tier: SubscriptionTier.BASIC,
      count: 4,
      revenue: 8000,
      churn: 0.12,
      growth: 0.08,
    },
  ],
};

// Mock AI Insights
const mockAIInsights: AdminAIInsight[] = [
  {
    id: 'insight-1',
    type: 'security',
    title: 'Unusual Login Patterns Detected',
    description: 'User "michael.rodriguez@alpine-growth.com" has shown unusual login patterns with sessions from multiple geographic locations within short time frames.',
    confidence: 89,
    impact: 'high',
    urgency: 'medium',
    actionable: true,
    suggestedAction: 'Consider requiring MFA verification for this user and reviewing recent session activity.',
    relatedEntity: 'User',
    relatedEntityId: 'user-2',
  },
  {
    id: 'insight-2',
    type: 'optimization',
    title: 'Subscription Tier Optimization Opportunity',
    description: 'Organization "Brookstone Family Office" is currently on trial but showing usage patterns that suggest they would benefit from Professional tier features.',
    confidence: 94,
    impact: 'medium',
    urgency: 'low',
    actionable: true,
    suggestedAction: 'Reach out with targeted Professional tier benefits and offer extended trial with premium features.',
    relatedEntity: 'Organization',
    relatedEntityId: 'org-3',
  },
  {
    id: 'insight-3',
    type: 'performance',
    title: 'High System Resource Usage',
    description: 'Database queries from portfolio analytics modules are consuming 35% more resources than baseline, potentially affecting system performance.',
    confidence: 76,
    impact: 'medium',
    urgency: 'high',
    actionable: true,
    suggestedAction: 'Review and optimize database queries in portfolio analytics module, consider implementing query caching.',
  },
];

// Mock Security Alerts
const mockSecurityAlerts: SecurityAlert[] = [
  {
    id: 'alert-1',
    organizationId: 'org-2',
    type: 'suspicious_login',
    severity: 'high',
    title: 'Multiple Failed Login Attempts',
    description: 'User account michael.rodriguez@alpine-growth.com has had 8 failed login attempts in the past hour from IP 203.0.113.45.',
    userId: 'user-2',
    ipAddress: '203.0.113.45',
    detectedAt: new Date('2024-01-25T11:45:00Z'),
    status: 'open',
    metadata: { attemptCount: 8, timeWindow: '1h', lastAttempt: '2024-01-25T11:45:00Z' },
  },
  {
    id: 'alert-2',
    organizationId: 'org-1',
    type: 'permission_escalation',
    severity: 'medium',
    title: 'Role Permission Changes',
    description: 'Investment Analyst role permissions were modified to include system-level access permissions.',
    detectedAt: new Date('2024-01-24T14:30:00Z'),
    status: 'investigating',
    metadata: { roleId: 'role-2', permissionsAdded: ['system.admin'], modifiedBy: 'user-1' },
  },
  {
    id: 'alert-3',
    organizationId: 'org-1',
    type: 'data_breach',
    severity: 'critical',
    title: 'Large Data Export Detected',
    description: 'User sarah.chen@meridian-capital.com exported complete portfolio dataset (15GB) outside normal business hours.',
    userId: 'user-1',
    sessionId: 'session-123',
    detectedAt: new Date('2024-01-23T23:15:00Z'),
    status: 'resolved',
    metadata: { exportSize: '15GB', exportTime: '23:15', dataTypes: ['portfolio', 'financial', 'lp_data'] },
  },
];

// Add users to organizations (for proper relationships)
mockOrganizations[0].users = [mockOrganizationUsers[0]];
mockOrganizations[1].users = [mockOrganizationUsers[1]];
mockOrganizations[2].users = [];

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 150));

    const data = {
      organizations: mockOrganizations,
      users: mockOrganizationUsers,
      roles: mockRoles,
      permissions: mockPermissions,
      auditLogs: mockAuditLogs,
      sessions: mockUserSessions,
      invitations: mockOrganizationInvitations,
      analytics: mockAnalytics,
      aiInsights: mockAIInsights,
      securityAlerts: mockSecurityAlerts,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching admin management data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin management data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Creating new admin entity:', body);

    // Here you would typically save to database
    // For now, just return a success response

    return NextResponse.json(
      { 
        message: 'Admin entity created successfully',
        id: `new-${Date.now()}`,
        ...body
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating admin entity:', error);
    return NextResponse.json(
      { error: 'Failed to create admin entity' },
      { status: 500 }
    );
  }
}