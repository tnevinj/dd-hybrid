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