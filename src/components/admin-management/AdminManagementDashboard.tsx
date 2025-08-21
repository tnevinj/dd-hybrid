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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin & Organization Management</h1>
          <p className="text-muted-foreground">
            Comprehensive system administration with multi-org support and RBAC
          </p>
        </div>
      </div>

      {renderNavigationControls()}

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
          <Card>
            <CardHeader>
              <CardTitle>Permission Management</CardTitle>
              <CardDescription>Configure system permissions and access control</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Permission management interface coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          {renderAuditTab()}
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Center</CardTitle>
              <CardDescription>Monitor security events and system health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Security monitoring dashboard coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Traditional Admin Management Content Component
function TraditionalAdminContent({ 
  organizations, 
  users, 
  auditLogs 
}: { 
  organizations: Organization[], 
  users: OrganizationUser[], 
  auditLogs: AuditLog[] 
}) {
  return (
    <div className="space-y-6">
      {/* Standard Organization Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Organization Management
          </CardTitle>
          <CardDescription>Manage organizations and their settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {organizations.slice(0, 6).map((org) => (
              <div key={org.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{org.name}</h4>
                  <Badge variant={org.status === 'ACTIVE' ? 'default' : 'secondary'}>
                    {org.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Users:</span>
                    <span>{org.userCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tier:</span>
                    <span>{org.subscriptionTier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span>{new Date(org.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.slice(0, 8).map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.firstName} {user.lastName}</div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{user.role}</Badge>
                  <Badge variant={user.status === 'ACTIVE' ? 'default' : 'secondary'}>
                    {user.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audit Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="font-medium">{log.action}</div>
                  <div className="text-sm text-gray-600">{log.description}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                    <span>by {log.performedBy}</span>
                    <span>•</span>
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Assisted Admin Management Content Component  
function AssistedAdminContent({
  organizations,
  users,
  auditLogs,
  analytics
}: {
  organizations: Organization[],
  users: OrganizationUser[],
  auditLogs: AuditLog[],
  analytics: AdminAnalytics
}) {
  // AI-powered admin insights
  const adminInsights = React.useMemo(() => {
    return {
      userManagementSuggestions: [
        {
          type: 'USER_ONBOARDING',
          title: 'Streamline User Onboarding',
          description: '23% of new users take >5 days to complete setup. AI suggests automated onboarding workflow.',
          impact: 'Reduce onboarding time by 60%',
          confidence: 0.85,
          actionable: true
        },
        {
          type: 'ROLE_OPTIMIZATION',
          title: 'Role Permission Optimization',
          description: 'Detected 12 users with over-privileged access. Review and optimize role assignments.',
          impact: 'Improve security posture by 25%',
          confidence: 0.78,
          actionable: true
        }
      ],
      securityAlerts: [
        {
          severity: 'HIGH',
          title: 'Unusual Login Pattern Detected',
          description: 'Multiple failed login attempts from new geographic locations detected for 3 accounts',
          recommendation: 'Enable MFA for affected accounts and review access patterns',
          affectedUsers: ['user1@example.com', 'user2@example.com', 'user3@example.com']
        },
        {
          severity: 'MEDIUM', 
          title: 'Dormant Account Alert',
          description: '18 user accounts have been inactive for >90 days',
          recommendation: 'Review and disable inactive accounts to reduce security surface',
          affectedUsers: []
        }
      ],
      complianceInsights: [
        {
          area: 'Data Retention',
          status: 'ATTENTION_NEEDED',
          description: 'Several audit logs approaching retention limit. Archive or extend retention policy.',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          priority: 'HIGH'
        },
        {
          area: 'Access Review',
          status: 'COMPLIANT',
          description: 'Quarterly access review completed. Next review due in 78 days.',
          dueDate: new Date(Date.now() + 78 * 24 * 60 * 60 * 1000),
          priority: 'LOW'
        }
      ]
    };
  }, []);

  // Usage analytics with AI predictions
  const usageAnalytics = React.useMemo(() => {
    return {
      userGrowthTrend: 'POSITIVE',
      predictedChurn: 2.3,
      engagementScore: 84.2,
      featureAdoption: [
        { feature: 'AI Assistant', adoption: 76, trend: 'UP' },
        { feature: 'Autonomous Mode', adoption: 43, trend: 'UP' },
        { feature: 'Advanced Analytics', adoption: 58, trend: 'STABLE' },
        { feature: 'API Integration', adoption: 31, trend: 'UP' }
      ]
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* AI Admin Insights Dashboard */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-blue-600" />
              AI Admin Intelligence
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {adminInsights.userManagementSuggestions.length + adminInsights.securityAlerts.length} Insights
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 text-blue-800">Management Suggestions</h4>
              <div className="space-y-3">
                {adminInsights.userManagementSuggestions.map((suggestion, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">{suggestion.title}</h5>
                      <Badge variant="outline" className="text-blue-700">
                        {Math.round(suggestion.confidence * 100)}% confident
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                    <div className="text-sm">
                      <strong className="text-blue-700">Impact:</strong> {suggestion.impact}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3 text-blue-800">Security Intelligence</h4>
              <div className="space-y-3">
                {adminInsights.securityAlerts.map((alert, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border ${
                    alert.severity === 'HIGH' ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">{alert.title}</h5>
                      <Badge className={
                        alert.severity === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                      }>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                    <div className="text-sm">
                      <strong>Recommendation:</strong> {alert.recommendation}
                    </div>
                    {alert.affectedUsers.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        Affected: {alert.affectedUsers.length} user(s)
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Analytics Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2 text-indigo-600" />
            AI-Enhanced Usage Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">+{usageAnalytics.userGrowthTrend === 'POSITIVE' ? '12' : '0'}%</div>
              <div className="text-sm text-green-700">User Growth (30d)</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-600">{usageAnalytics.predictedChurn}%</div>
              <div className="text-sm text-red-700">Predicted Churn</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{usageAnalytics.engagementScore}</div>
              <div className="text-sm text-blue-700">Engagement Score</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Feature Adoption Trends</h4>
            <div className="space-y-3">
              {usageAnalytics.featureAdoption.map((feature, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="font-medium">{feature.feature}</div>
                    <Badge className={
                      feature.trend === 'UP' ? 'bg-green-100 text-green-800' :
                      feature.trend === 'DOWN' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {feature.trend}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-lg font-bold">{feature.adoption}%</div>
                    <div className="w-16">
                      <Progress value={feature.adoption} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-purple-600" />
            Compliance Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {adminInsights.complianceInsights.map((insight, idx) => (
              <div key={idx} className={`p-3 rounded-lg border ${
                insight.status === 'ATTENTION_NEEDED' ? 'bg-amber-50 border-amber-200' : 
                'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium">{insight.area}</h5>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      insight.status === 'ATTENTION_NEEDED' ? 'bg-amber-100 text-amber-800' :
                      'bg-green-100 text-green-800'
                    }>
                      {insight.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className={
                      insight.priority === 'HIGH' ? 'border-red-200 text-red-700' :
                      insight.priority === 'MEDIUM' ? 'border-yellow-200 text-yellow-700' :
                      'border-gray-200 text-gray-700'
                    }>
                      {insight.priority}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                <div className="text-xs text-gray-500">
                  Due: {insight.dueDate.toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Traditional Content Enhanced */}
      <TraditionalAdminContent organizations={organizations} users={users} auditLogs={auditLogs} />
    </div>
  );
}

// Autonomous Admin Management Content Component
function AutonomousAdminContent({
  organizations,
  users,
  auditLogs,
  analytics
}: {
  organizations: Organization[],
  users: OrganizationUser[],
  auditLogs: AuditLog[],
  analytics: AdminAnalytics
}) {
  // Autonomous operations state
  const [autonomousActions, setAutonomousActions] = React.useState([
    {
      id: 'auto-security-1',
      type: 'security' as const,
      title: 'Auto-Disabled Compromised Account',
      description: 'Detected unusual login patterns for user@example.com. Account automatically disabled and admin notified.',
      status: 'completed' as const,
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      impact: 'Prevented potential security breach',
      confidence: 0.95,
      rollbackable: true
    },
    {
      id: 'auto-cleanup-1',
      type: 'maintenance' as const,
      title: 'Automated Data Cleanup',
      description: 'Automatically archived 2,847 old audit logs and optimized database performance.',
      status: 'completed' as const,
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      impact: 'Freed 1.2GB storage, improved query speed by 18%',
      confidence: 0.99,
      rollbackable: false
    },
    {
      id: 'auto-scaling-1',
      type: 'optimization' as const,
      title: 'Auto-Scaling Adjustment',
      description: 'Detected increased user activity. Automatically scaled infrastructure to maintain performance.',
      status: 'in_progress' as const,
      timestamp: new Date(Date.now() - 1800000), // 30 min ago
      impact: 'Maintained <200ms response times during peak load',
      confidence: 0.92,
      rollbackable: true
    }
  ]);

  // Pending autonomous actions
  const [pendingActions, setPendingActions] = React.useState([
    {
      id: 'pending-policy-1',
      type: 'policy' as const,
      title: 'Password Policy Enhancement',
      description: 'AI recommends implementing stricter password requirements based on recent security trends.',
      estimatedImpact: 'Reduce password-related breaches by 45%',
      riskLevel: 'Low' as const,
      affectedUsers: 127,
      implementationTime: '15 minutes'
    },
    {
      id: 'pending-roles-1',
      type: 'access' as const,
      title: 'Role Permission Optimization',
      description: 'Detected over-privileged accounts. Recommend automated role rightsizing for 23 users.',
      estimatedImpact: 'Reduce security surface by 30%',
      riskLevel: 'Medium' as const,
      affectedUsers: 23,
      implementationTime: '5 minutes'
    }
  ]);

  // Real-time system monitoring
  const [systemMetrics] = React.useState({
    systemHealth: 96.8,
    activeUsers: 1247,
    securityScore: 87.3,
    performanceIndex: 94.1,
    automatedActions: 156,
    preventedIncidents: 8,
    lastCheck: new Date(Date.now() - 60000) // 1 min ago
  });

  const executeAutonomousAction = (actionId: string) => {
    setPendingActions(prev => prev.filter(a => a.id !== actionId));
    alert(`Executing Admin Management Autonomous Action ${actionId}:\n\n• AI-powered administrative task automation\n• Intelligent user management and permission optimization\n• Automated compliance monitoring and reporting\n• Cross-system integration and data synchronization\n• Smart resource allocation and performance monitoring\n• Predictive analytics for administrative efficiency\n• Automated audit trail and security verification`);
  };

  const rollbackAction = (actionId: string) => {
    setAutonomousActions(prev => 
      prev.map(action => 
        action.id === actionId 
          ? { ...action, status: 'rolled_back' as const }
          : action
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Autonomous Operations Command Center */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-purple-600" />
              Autonomous Admin Control Center
            </div>
            <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50">
              {autonomousActions.filter(a => a.status === 'in_progress').length} Active Operations
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-white rounded-lg border border-green-200">
              <div className="text-xl font-bold text-green-600">{systemMetrics.systemHealth}%</div>
              <div className="text-xs text-green-700">System Health</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
              <div className="text-xl font-bold text-blue-600">{systemMetrics.activeUsers}</div>
              <div className="text-xs text-blue-700">Active Users</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-orange-200">
              <div className="text-xl font-bold text-orange-600">{systemMetrics.automatedActions}</div>
              <div className="text-xs text-orange-700">Auto Actions (24h)</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-red-200">
              <div className="text-xl font-bold text-red-600">{systemMetrics.preventedIncidents}</div>
              <div className="text-xs text-red-700">Prevented Incidents</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Recent Autonomous Actions</h4>
            {autonomousActions.map(action => (
              <div 
                key={action.id}
                className={`p-3 border rounded-lg ${
                  action.status === 'completed' ? 'border-green-200 bg-green-50' :
                  action.status === 'in_progress' ? 'border-blue-200 bg-blue-50' :
                  'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      {action.status === 'completed' && <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />}
                      {action.status === 'in_progress' && <Clock className="h-4 w-4 text-blue-600 mr-2" />}
                      <h5 className="font-medium">{action.title}</h5>
                      <Badge size="sm" className={`ml-2 ${
                        action.type === 'security' ? 'bg-red-100 text-red-800' :
                        action.type === 'maintenance' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {action.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{action.description}</p>
                    <div className="text-xs text-gray-500 space-x-4">
                      <span>Impact: {action.impact}</span>
                      <span>Confidence: {Math.round(action.confidence * 100)}%</span>
                      <span>{new Date(action.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {action.rollbackable && action.status === 'completed' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 border-red-200"
                        onClick={() => rollbackAction(action.id)}
                      >
                        Rollback
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Autonomous Actions */}
      {pendingActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Crown className="h-5 w-5 mr-2 text-amber-600" />
              Pending Autonomous Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingActions.map(action => (
                <div key={action.id} className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-amber-800">{action.title}</h4>
                      <p className="text-sm text-amber-700 mt-1">{action.description}</p>
                    </div>
                    <Badge className={`${
                      action.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                      action.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {action.riskLevel} Risk
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-4">
                    <div>
                      <span className="font-medium">Affected Users:</span>
                      <p className="text-amber-600">{action.affectedUsers}</p>
                    </div>
                    <div>
                      <span className="font-medium">Implementation:</span>
                      <p className="text-amber-600">{action.implementationTime}</p>
                    </div>
                    <div>
                      <span className="font-medium">Impact:</span>
                      <p className="text-amber-600">{action.estimatedImpact}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-amber-600 hover:bg-amber-700"
                      onClick={() => executeAutonomousAction(action.id)}
                    >
                      Execute
                    </Button>
                    <Button size="sm" variant="outline">
                      Review Details
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-red-600"
                      onClick={() => setPendingActions(prev => prev.filter(a => a.id !== action.id))}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Real-time System Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-600" />
              Real-time System Monitor
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Last check: {systemMetrics.lastCheck.toLocaleTimeString()}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-green-50 rounded text-sm">
              <span>✓ User authentication system: Optimal</span>
              <span className="text-gray-500">2m ago</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded text-sm">
              <span>ℹ Database optimization: Completed (+18% performance)</span>
              <span className="text-gray-500">5m ago</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-orange-50 rounded text-sm">
              <span>⚠ Rate limiting: 3 requests blocked (suspicious activity)</span>
              <span className="text-gray-500">8m ago</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Assisted Content */}
      <AssistedAdminContent organizations={organizations} users={users} auditLogs={auditLogs} analytics={analytics} />
    </div>
  );
}