// Admin & Organization Management Types

export interface Organization {
  id: string;
  name: string;
  displayName?: string;
  description?: string;
  website?: string;
  industry?: string;
  size: OrganizationSize;
  status: OrganizationStatus;
  
  // Subscription & Billing
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: SubscriptionStatus;
  billingCycle: BillingCycle;
  subscriptionStart?: Date;
  subscriptionEnd?: Date;
  trialEnd?: Date;
  
  // Organization Settings
  settings?: Record<string, any>;
  branding?: Record<string, any>;
  integrations?: Record<string, any>;
  
  // Contact Information
  primaryContactId?: string;
  primaryContact?: User;
  billingAddress?: Record<string, any>;
  
  // Relationships
  users: OrganizationUser[];
  roles: Role[];
  permissions: OrganizationPermission[];
  auditLogs: AuditLog[];
  sessions: UserSession[];
  invitations: OrganizationInvitation[];
  
  createdAt: Date;
  updatedAt: Date;
  createdById?: string;
  createdBy?: User;
}

export interface OrganizationUser {
  id: string;
  organizationId: string;
  userId: string;
  status: OrganizationUserStatus;
  joinedAt: Date;
  leftAt?: Date;
  
  // Role Assignment
  roleIds: string[];
  customPermissions?: Record<string, any>;
  
  // User-specific org settings
  preferences?: Record<string, any>;
  lastActivity?: Date;
  
  organization: Organization;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Navigation preferences
  navigationMode: string;
  aiAdoptionLevel: number;
  aiPermissions: Record<string, any>;
}

export interface Role {
  id: string;
  name: string;
  displayName?: string;
  description?: string;
  organizationId: string;
  isSystem: boolean;
  isDefault: boolean;
  
  // Role Hierarchy
  parentRoleId?: string;
  parentRole?: Role;
  childRoles: Role[];
  
  // Permissions
  permissions: RolePermission[];
  
  // Usage
  userCount: number;
  
  organization: Organization;
  createdAt: Date;
  updatedAt: Date;
  createdById?: string;
}

export interface Permission {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  category: PermissionCategory;
  module: string;
  isSystem: boolean;
  
  // Permission metadata
  riskLevel: PermissionRiskLevel;
  requiresApproval: boolean;
  
  // Relationships
  rolePermissions: RolePermission[];
  orgPermissions: OrganizationPermission[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  granted: boolean;
  conditions?: Record<string, any>;
  
  role: Role;
  permission: Permission;
  
  createdAt: Date;
  grantedById?: string;
}

export interface OrganizationPermission {
  id: string;
  organizationId: string;
  permissionId: string;
  enabled: boolean;
  configuration?: Record<string, any>;
  
  organization: Organization;
  permission: Permission;
}

export interface AuditLog {
  id: string;
  organizationId: string;
  userId?: string;
  action: AuditAction;
  entity: string;
  entityId?: string;
  entityData?: Record<string, any>;
  previousData?: Record<string, any>;
  metadata?: Record<string, any>;
  
  // Request Context
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  
  // Risk Assessment
  riskLevel: AuditRiskLevel;
  flagged: boolean;
  
  organization: Organization;
  user?: User;
  
  createdAt: Date;
}

export interface UserSession {
  id: string;
  userId: string;
  organizationId: string;
  sessionToken: string;
  
  // Session Details
  ipAddress?: string;
  userAgent?: string;
  location?: Record<string, any>;
  device?: Record<string, any>;
  
  // Session Status
  isActive: boolean;
  lastActivity: Date;
  loginAt: Date;
  logoutAt?: Date;
  
  // Security
  riskScore: number;
  isCompromised: boolean;
  
  user: User;
  organization: Organization;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationInvitation {
  id: string;
  organizationId: string;
  email: string;
  roleIds: string[];
  
  // Invitation Details
  invitedById: string;
  invitedBy: User;
  message?: string;
  
  // Status
  status: InvitationStatus;
  expiresAt: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
  
  // Security
  token: string;
  attempts: number;
  
  organization: Organization;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface SystemConfiguration {
  id: string;
  key: string;
  value: Record<string, any>;
  category: string;
  description?: string;
  isPublic: boolean;
  
  createdAt: Date;
  updatedAt: Date;
  updatedById?: string;
}

// Enums
export enum OrganizationSize {
  STARTUP = 'STARTUP',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  ENTERPRISE = 'ENTERPRISE'
}

export enum OrganizationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  TRIAL = 'TRIAL'
}

export enum SubscriptionTier {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
  CUSTOM = 'CUSTOM'
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELLED = 'CANCELLED',
  PAUSED = 'PAUSED',
  TRIAL = 'TRIAL'
}

export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY'
}

export enum OrganizationUserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  INVITED = 'INVITED',
  SUSPENDED = 'SUSPENDED'
}

export enum PermissionCategory {
  FUND_MANAGEMENT = 'FUND_MANAGEMENT',
  PORTFOLIO_MANAGEMENT = 'PORTFOLIO_MANAGEMENT',
  INVESTOR_RELATIONS = 'INVESTOR_RELATIONS',
  COMPLIANCE = 'COMPLIANCE',
  REPORTING = 'REPORTING',
  ADMINISTRATION = 'ADMINISTRATION',
  SYSTEM = 'SYSTEM'
}

export enum PermissionRiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  INVITE = 'INVITE',
  PERMISSION_CHANGE = 'PERMISSION_CHANGE',
  ROLE_CHANGE = 'ROLE_CHANGE',
  CONFIGURATION_CHANGE = 'CONFIGURATION_CHANGE',
  DATA_EXPORT = 'DATA_EXPORT',
  BULK_OPERATION = 'BULK_OPERATION'
}

export enum AuditRiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

// Dashboard Analytics Interfaces
export interface AdminAnalytics {
  totalOrganizations: number;
  activeUsers: number;
  totalAuditEvents: number;
  securityIncidents: number;
  subscriptionRevenue: number;
  organizationGrowth: OrganizationGrowthMetric[];
  userActivity: UserActivityMetric[];
  securityMetrics: SecurityMetric[];
  subscriptionMetrics: SubscriptionMetric[];
}

export interface OrganizationGrowthMetric {
  date: string;
  newOrganizations: number;
  totalOrganizations: number;
  subscriptionTier: SubscriptionTier;
}

export interface UserActivityMetric {
  organizationId: string;
  organizationName: string;
  activeUsers: number;
  totalSessions: number;
  averageSessionDuration: number;
  lastActivity: Date;
}

export interface SecurityMetric {
  date: string;
  totalEvents: number;
  highRiskEvents: number;
  flaggedEvents: number;
  suspiciousSessions: number;
  blockedAttempts: number;
}

export interface SubscriptionMetric {
  tier: SubscriptionTier;
  count: number;
  revenue: number;
  churn: number;
  growth: number;
}

// Navigation Mode Interface
export interface AdminNavigationMode {
  mode: 'traditional' | 'assisted' | 'autonomous';
  aiSuggestions?: boolean;
  autoRemediation?: boolean;
  smartAlerts?: boolean;
}

// AI Assistant Interfaces
export interface AdminAIInsight {
  id: string;
  type: 'security' | 'performance' | 'optimization' | 'compliance' | 'billing';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  urgency: 'low' | 'medium' | 'high';
  actionable: boolean;
  suggestedAction?: string;
  relatedEntity?: string;
  relatedEntityId?: string;
}

export interface SecurityAlert {
  id: string;
  organizationId: string;
  type: 'suspicious_login' | 'permission_escalation' | 'unusual_activity' | 'data_breach' | 'failed_attempts';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  detectedAt: Date;
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  metadata?: Record<string, any>;
}