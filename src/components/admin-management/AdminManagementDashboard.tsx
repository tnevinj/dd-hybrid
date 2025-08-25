'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Shield,
  Users,
  Building2,
  Settings,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Activity,
  TrendingUp,
  Lock,
  UserCheck,
  Crown,
  Eye,
  FileText,
  Clock,
  Ban,
  UserPlus,
  Zap,
  Brain,
  Filter,
} from 'lucide-react';
import { ModuleHeader, ProcessNotice } from '@/components/shared/ModeIndicators';

import {
  Organization,
  OrganizationUser,
  Role,
  Permission,
  AuditLog,
  UserSession,
  OrganizationInvitation,
  AdminAnalytics,
  AdminAIInsight,
  SecurityAlert,
  OrganizationStatus,
  SubscriptionTier,
  PermissionCategory,
  AuditAction,
  AdminNavigationMode,
} from '@/types/admin-management';

interface AdminManagementDashboardProps {
  navigationMode: 'traditional' | 'assisted' | 'autonomous';
  onModeChange: (mode: 'traditional' | 'assisted' | 'autonomous') => void;
}

export function AdminManagementDashboard({
  navigationMode,
  onModeChange,
}: AdminManagementDashboardProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [users, setUsers] = useState<OrganizationUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [invitations, setInvitations] = useState<OrganizationInvitation[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [aiInsights, setAIInsights] = useState<AdminAIInsight[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await fetch('/api/admin-management');
      const data = await response.json();
      
      setOrganizations(data.organizations || []);
      setUsers(data.users || []);
      setRoles(data.roles || []);
      setPermissions(data.permissions || []);
      setAuditLogs(data.auditLogs || []);
      setSessions(data.sessions || []);
      setInvitations(data.invitations || []);
      setAnalytics(data.analytics || null);
      setAIInsights(data.aiInsights || []);
      setSecurityAlerts(data.securityAlerts || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-gray-100 text-gray-800',
      SUSPENDED: 'bg-red-100 text-red-800',
      TRIAL: 'bg-blue-100 text-blue-800',
      PENDING_VERIFICATION: 'bg-yellow-100 text-yellow-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      ACCEPTED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      EXPIRED: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRiskColor = (risk: string) => {
    const colors = {
      LOW: 'bg-green-100 text-green-600',
      MEDIUM: 'bg-yellow-100 text-yellow-600',
      HIGH: 'bg-orange-100 text-orange-600',
      CRITICAL: 'bg-red-100 text-red-600',
    };
    return colors[risk as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  const renderNavigationControls = () => (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Label htmlFor="nav-mode" className="text-sm font-medium">Navigation Mode:</Label>
        <Select value={navigationMode} onValueChange={onModeChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="traditional">Traditional</SelectItem>
            <SelectItem value="assisted">AI Assisted</SelectItem>
            <SelectItem value="autonomous">Autonomous</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {navigationMode === 'assisted' && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Brain className="w-3 h-3" />
          AI Insights Active
        </Badge>
      )}
      
      {navigationMode === 'autonomous' && (
        <Badge variant="outline" className="flex items-center gap-1">
          <Zap className="w-3 h-3" />
          Auto-remediation Enabled
        </Badge>
      )}
    </div>
  );

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Organizations</p>
                <p className="text-2xl font-bold">{analytics?.totalOrganizations || 0}</p>
              </div>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{analytics?.activeUsers || 0}</p>
              </div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Security Incidents</p>
                <p className="text-2xl font-bold">{analytics?.securityIncidents || 0}</p>
              </div>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">${analytics?.subscriptionRevenue?.toLocaleString() || 0}</p>
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      {securityAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Recent Security Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {securityAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getRiskColor(alert.severity.toUpperCase())}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(alert.detectedAt).toLocaleString()}
                      </span>
                    </div>
                    <h4 className="font-medium">{alert.title}</h4>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Investigate
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Organizations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Recent Organizations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.slice(0, 5).map((org) => (
                <TableRow key={org.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{org.name}</div>
                      <div className="text-sm text-muted-foreground">{org.industry}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(org.status)}>
                      {org.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      {org.subscriptionTier}
                    </div>
                  </TableCell>
                  <TableCell>{org.users.length}</TableCell>
                  <TableCell>
                    {new Date(org.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* AI Insights */}
      {(navigationMode === 'assisted' || navigationMode === 'autonomous') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Admin Insights
            </CardTitle>
            <CardDescription>
              Intelligent recommendations for system optimization and security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiInsights.slice(0, 3).map((insight) => (
                <div key={insight.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={insight.impact === 'high' ? 'destructive' : 
                                      insight.impact === 'medium' ? 'default' : 'secondary'}>
                          {insight.type.toUpperCase()}
                        </Badge>
                        <Badge variant={insight.urgency === 'high' ? 'destructive' : 'outline'}>
                          {insight.urgency} urgency
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {insight.confidence}% confidence
                        </span>
                      </div>
                      <h4 className="font-medium">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                      {insight.suggestedAction && (
                        <p className="text-sm text-blue-600 mt-2">
                          💡 {insight.suggestedAction}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderOrganizationsTab = () => (
    <div className="space-y-6">
      {/* Organization Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="TRIAL">Trial</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Organization
        </Button>
      </div>

      {/* Organizations Grid */}
      <div className="grid gap-4">
        {organizations.map((org) => (
          <Card key={org.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-lg">{org.name}</h4>
                    <Badge className={getStatusColor(org.status)}>
                      {org.status}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      {org.subscriptionTier}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{org.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Industry:</span>
                      <div className="font-medium">{org.industry || 'Not specified'}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Size:</span>
                      <div className="font-medium">{org.size}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Users:</span>
                      <div className="font-medium">{org.users.length}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created:</span>
                      <div className="font-medium">{new Date(org.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Users className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <FileText className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderUsersRolesTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{user.user.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.user.name || user.user.email}</div>
                      <div className="text-sm text-muted-foreground">{user.user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Roles Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Role Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roles.slice(0, 5).map((role) => (
                <div key={role.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-medium">{role.displayName || role.name}</div>
                      {role.isSystem && <Badge variant="outline">System</Badge>}
                      {role.isDefault && <Badge variant="secondary">Default</Badge>}
                    </div>
                    <div className="text-sm text-muted-foreground">{role.description}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {role.permissions.length} permissions • {role.userCount} users
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAuditTab = () => (
    <div className="space-y-6">
      {/* Audit Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Audit Log</h3>
        <div className="flex items-center gap-2">
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="LOGIN">Login</SelectItem>
              <SelectItem value="CREATE">Create</SelectItem>
              <SelectItem value="UPDATE">Update</SelectItem>
              <SelectItem value="DELETE">Delete</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">Export</Button>
        </div>
      </div>

      {/* Audit Log Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.slice(0, 10).map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {log.user?.name?.charAt(0) || 'S'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{log.user?.name || 'System'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.action}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{log.entity}</div>
                      {log.entityId && (
                        <div className="text-xs text-muted-foreground">{log.entityId}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRiskColor(log.riskLevel)}>
                      {log.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono">{log.ipAddress || 'N/A'}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 md:p-6 ${navigationMode === 'traditional' ? 'bg-gray-50' : ''}`}>
      <div className="container mx-auto max-w-7xl">
        <ModuleHeader
          title="Admin & Organization Management"
          description="Comprehensive system administration with multi-org support and RBAC"
          mode={navigationMode}
          actions={
            <Select value={navigationMode} onValueChange={onModeChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="traditional">Traditional</SelectItem>
                <SelectItem value="assisted">AI Assisted</SelectItem>
                <SelectItem value="autonomous">Autonomous</SelectItem>
              </SelectContent>
            </Select>
          }
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="users-roles">Users & Roles</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {renderOverviewTab()}
          </TabsContent>

          <TabsContent value="organizations" className="space-y-4">
            {renderOrganizationsTab()}
          </TabsContent>

          <TabsContent value="users-roles" className="space-y-4">
            {renderUsersRolesTab()}
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <div className="space-y-6">
              {/* Permission Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      System Administration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>User Management</span>
                        <Badge variant="outline">12 roles</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Organization Settings</span>
                        <Badge variant="outline">8 roles</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>System Configuration</span>
                        <Badge variant="destructive">3 roles</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Data & Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Portfolio Access</span>
                        <Badge variant="outline">15 roles</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Financial Reports</span>
                        <Badge variant="outline">10 roles</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Export Data</span>
                        <Badge variant="secondary">7 roles</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Security & Compliance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Audit Log Access</span>
                        <Badge variant="outline">5 roles</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Security Settings</span>
                        <Badge variant="destructive">2 roles</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Compliance Reports</span>
                        <Badge variant="outline">6 roles</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Permission Matrix */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    Role-Permission Matrix
                  </CardTitle>
                  <CardDescription>
                    Configure granular permissions for each role across all system modules
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 font-medium">Permission</th>
                          <th className="text-center p-2 font-medium">Super Admin</th>
                          <th className="text-center p-2 font-medium">Fund Manager</th>
                          <th className="text-center p-2 font-medium">Analyst</th>
                          <th className="text-center p-2 font-medium">LP User</th>
                          <th className="text-center p-2 font-medium">Read Only</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">Portfolio Management</td>
                          <td className="text-center p-2"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                          <td className="text-center p-2"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                          <td className="text-center p-2"><Eye className="w-4 h-4 text-blue-600 mx-auto" /></td>
                          <td className="text-center p-2"><Eye className="w-4 h-4 text-blue-600 mx-auto" /></td>
                          <td className="text-center p-2"><Eye className="w-4 h-4 text-blue-600 mx-auto" /></td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">Deal Screening</td>
                          <td className="text-center p-2"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                          <td className="text-center p-2"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                          <td className="text-center p-2"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                          <td className="text-center p-2"><Ban className="w-4 h-4 text-red-600 mx-auto" /></td>
                          <td className="text-center p-2"><Ban className="w-4 h-4 text-red-600 mx-auto" /></td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">Due Diligence</td>
                          <td className="text-center p-2"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                          <td className="text-center p-2"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                          <td className="text-center p-2"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                          <td className="text-center p-2"><Ban className="w-4 h-4 text-red-600 mx-auto" /></td>
                          <td className="text-center p-2"><Eye className="w-4 h-4 text-blue-600 mx-auto" /></td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">Financial Reports</td>
                          <td className="text-center p-2"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                          <td className="text-center p-2"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                          <td className="text-center p-2"><Eye className="w-4 h-4 text-blue-600 mx-auto" /></td>
                          <td className="text-center p-2"><Eye className="w-4 h-4 text-blue-600 mx-auto" /></td>
                          <td className="text-center p-2"><Eye className="w-4 h-4 text-blue-600 mx-auto" /></td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">User Management</td>
                          <td className="text-center p-2"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                          <td className="text-center p-2"><UserPlus className="w-4 h-4 text-orange-600 mx-auto" /></td>
                          <td className="text-center p-2"><Ban className="w-4 h-4 text-red-600 mx-auto" /></td>
                          <td className="text-center p-2"><Ban className="w-4 h-4 text-red-600 mx-auto" /></td>
                          <td className="text-center p-2"><Ban className="w-4 h-4 text-red-600 mx-auto" /></td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">System Configuration</td>
                          <td className="text-center p-2"><CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /></td>
                          <td className="text-center p-2"><Ban className="w-4 h-4 text-red-600 mx-auto" /></td>
                          <td className="text-center p-2"><Ban className="w-4 h-4 text-red-600 mx-auto" /></td>
                          <td className="text-center p-2"><Ban className="w-4 h-4 text-red-600 mx-auto" /></td>
                          <td className="text-center p-2"><Ban className="w-4 h-4 text-red-600 mx-auto" /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                      Full Access
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-blue-600" />
                      Read Only
                    </div>
                    <div className="flex items-center gap-1">
                      <UserPlus className="w-3 h-3 text-orange-600" />
                      Limited Access
                    </div>
                    <div className="flex items-center gap-1">
                      <Ban className="w-3 h-3 text-red-600" />
                      No Access
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Permission Changes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Permission Changes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>SA</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">Super Admin granted Portfolio Management access to Analyst role</div>
                          <div className="text-xs text-muted-foreground">2 hours ago • High impact change</div>
                        </div>
                      </div>
                      <Badge variant="outline">GRANTED</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>FM</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">Fund Manager removed Export Data permission from LP User role</div>
                          <div className="text-xs text-muted-foreground">1 day ago • Security enhancement</div>
                        </div>
                      </div>
                      <Badge variant="destructive">REVOKED</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>SA</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">New role "Compliance Officer" created with audit permissions</div>
                          <div className="text-xs text-muted-foreground">3 days ago • Role management</div>
                        </div>
                      </div>
                      <Badge variant="secondary">CREATED</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            {renderAuditTab()}
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="space-y-6">
              {/* Security Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Threat Level</p>
                        <p className="text-2xl font-bold text-green-600">LOW</p>
                      </div>
                      <Shield className="h-4 w-4 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
                        <p className="text-2xl font-bold">247</p>
                      </div>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Failed Logins (24h)</p>
                        <p className="text-2xl font-bold text-orange-600">12</p>
                      </div>
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Security Score</p>
                        <p className="text-2xl font-bold text-green-600">94%</p>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Security Alerts & Threats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      Active Security Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between p-3 border rounded-lg bg-red-50">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-red-100 text-red-800">CRITICAL</Badge>
                            <span className="text-xs text-muted-foreground">2 min ago</span>
                          </div>
                          <h4 className="font-medium text-sm">Multiple Failed Login Attempts</h4>
                          <p className="text-xs text-muted-foreground">IP: 192.168.1.100 • User: admin@techcorp.com</p>
                        </div>
                        <Button variant="destructive" size="sm">Block</Button>
                      </div>
                      
                      <div className="flex items-start justify-between p-3 border rounded-lg bg-yellow-50">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-yellow-100 text-yellow-800">MEDIUM</Badge>
                            <span className="text-xs text-muted-foreground">15 min ago</span>
                          </div>
                          <h4 className="font-medium text-sm">Unusual Access Pattern</h4>
                          <p className="text-xs text-muted-foreground">User accessing from new location • Singapore</p>
                        </div>
                        <Button variant="outline" size="sm">Review</Button>
                      </div>
                      
                      <div className="flex items-start justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-blue-100 text-blue-800">INFO</Badge>
                            <span className="text-xs text-muted-foreground">1 hour ago</span>
                          </div>
                          <h4 className="font-medium text-sm">Password Policy Update</h4>
                          <p className="text-xs text-muted-foreground">New complexity requirements applied</p>
                        </div>
                        <Button variant="ghost" size="sm">Dismiss</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-blue-600" />
                      Access Control Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Multi-Factor Authentication</span>
                        </div>
                        <Badge variant="outline" className="text-green-600">98% Enabled</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Password Compliance</span>
                        </div>
                        <Badge variant="outline" className="text-green-600">94% Compliant</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm">Session Management</span>
                        </div>
                        <Badge variant="outline" className="text-yellow-600">3 Stale Sessions</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">API Security</span>
                        </div>
                        <Badge variant="outline" className="text-green-600">All Secured</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Security Metrics & Compliance */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart className="w-5 h-5 text-blue-600" />
                      Security Metrics (30 Days)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Login Success Rate</span>
                          <span className="font-medium">97.8%</span>
                        </div>
                        <Progress value={97.8} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Threat Detection Accuracy</span>
                          <span className="font-medium">99.2%</span>
                        </div>
                        <Progress value={99.2} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Incident Response Time</span>
                          <span className="font-medium">2.3 min avg</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Compliance Score</span>
                          <span className="font-medium">96.5%</span>
                        </div>
                        <Progress value={96.5} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-600" />
                      Compliance Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <div>
                            <div className="font-medium text-sm">SOC 2 Type II</div>
                            <div className="text-xs text-muted-foreground">Last audit: Nov 2024</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-green-600">Compliant</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <div>
                            <div className="font-medium text-sm">GDPR</div>
                            <div className="text-xs text-muted-foreground">Data protection compliance</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-green-600">Compliant</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                          <div>
                            <div className="font-medium text-sm">ISO 27001</div>
                            <div className="text-xs text-muted-foreground">Certification renewal due</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-yellow-600">Action Required</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <div>
                            <div className="font-medium text-sm">PCI DSS</div>
                            <div className="text-xs text-muted-foreground">Payment security standards</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-green-600">Compliant</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Security Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Security Events
                  </CardTitle>
                  <CardDescription>
                    Real-time monitoring of security-related activities across the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Event Type</TableHead>
                        <TableHead>User/Source</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Risk Level</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(Date.now() - 2 * 60 * 1000).toLocaleTimeString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">Failed Login</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">AD</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">admin@techcorp.com</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">5 consecutive failed attempts from 192.168.1.100</span>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-red-100 text-red-600">CRITICAL</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-orange-600">Investigating</Badge>
                        </TableCell>
                      </TableRow>
                      
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(Date.now() - 15 * 60 * 1000).toLocaleTimeString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">New Location</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">JD</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">john.doe@fund.com</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">Login from Singapore (first time)</span>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-100 text-yellow-600">MEDIUM</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-blue-600">Verified</Badge>
                        </TableCell>
                      </TableRow>
                      
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(Date.now() - 45 * 60 * 1000).toLocaleTimeString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Permission Change</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">SA</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">System Admin</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">Role permissions updated for Analyst role</span>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-600">LOW</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-green-600">Completed</Badge>
                        </TableCell>
                      </TableRow>
                      
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleTimeString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">API Access</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">AP</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">API Client</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">High volume API requests detected</span>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-100 text-yellow-600">MEDIUM</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-green-600">Resolved</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* AI Security Insights */}
              {(navigationMode === 'assisted' || navigationMode === 'autonomous') && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      AI Security Intelligence
                    </CardTitle>
                    <CardDescription>
                      Machine learning-powered security analysis and threat prediction
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg bg-blue-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-blue-100 text-blue-800">PREDICTIVE</Badge>
                              <span className="text-sm text-muted-foreground">92% confidence</span>
                            </div>
                            <h4 className="font-medium">Potential Brute Force Attack Pattern</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              ML model detected unusual login patterns that may indicate coordinated attack attempt within next 2-4 hours
                            </p>
                            <p className="text-sm text-blue-600 mt-2">
                              💡 Recommend: Enable enhanced monitoring and consider temporary rate limiting
                            </p>
                          </div>
                          <Button variant="outline" size="sm">Apply Recommendation</Button>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg bg-green-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-green-100 text-green-800">OPTIMIZATION</Badge>
                              <span className="text-sm text-muted-foreground">87% confidence</span>
                            </div>
                            <h4 className="font-medium">Security Policy Optimization</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Analysis suggests adjusting session timeout policies could improve security by 15% without impacting user experience
                            </p>
                            <p className="text-sm text-green-600 mt-2">
                              💡 Recommend: Reduce session timeout to 4 hours for high-privilege users
                            </p>
                          </div>
                          <Button variant="outline" size="sm">Review Policy</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <ProcessNotice 
          mode={navigationMode}
          title="Admin & Organization Management"
          description="System administration and organization management operations"
        />
      </div>
    </div>
  );
}
