'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUnifiedPortfolio } from '../contexts/UnifiedPortfolioContext';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface TeamMember {
  id: string;
  name: string;
  role: 'partner' | 'principal' | 'vice_president' | 'associate' | 'analyst' | 'operations';
  email: string;
  avatar?: string;
  permissions: string[];
  lastActive: string;
  status: 'online' | 'offline' | 'away';
}

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'due_diligence' | 'analysis' | 'reporting' | 'monitoring' | 'compliance' | 'fundraising';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'blocked';
  assignedTo: string[];
  createdBy: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
  comments: Comment[];
  relatedAssets?: string[];
  estimatedHours?: number;
  actualHours?: number;
}

interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: string;
  isInternal: boolean;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  type: 'investment_process' | 'quarterly_review' | 'due_diligence' | 'exit_process' | 'compliance';
  stages: WorkflowStage[];
  estimatedDuration: number; // days
  isActive: boolean;
}

interface WorkflowStage {
  id: string;
  name: string;
  description: string;
  assignedRoles: string[];
  requiredApprovals: number;
  estimatedDays: number;
  dependencies: string[];
  deliverables: string[];
  isGate: boolean;
}

interface WorkflowInstance {
  id: string;
  templateId: string;
  templateName: string;
  relatedAsset?: string;
  currentStage: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  progress: number;
  assignedTeam: string[];
  urgency: 'low' | 'medium' | 'high';
}

interface Notification {
  id: string;
  type: 'task_assigned' | 'approval_required' | 'deadline_approaching' | 'workflow_updated' | 'mention';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionRequired: boolean;
  relatedId?: string;
  severity: 'info' | 'warning' | 'error';
}

export function TeamCollaboration() {
  const { state } = useUnifiedPortfolio();
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [selectedTaskFilter, setSelectedTaskFilter] = useState<string>('all');

  // Mock team members
  const teamMembers: TeamMember[] = useMemo(() => [
    {
      id: 'member-1',
      name: 'Sarah Chen',
      role: 'partner',
      email: 'sarah.chen@fund.com',
      permissions: ['full_access', 'approve_investments', 'manage_team'],
      lastActive: '2024-01-15T10:30:00Z',
      status: 'online'
    },
    {
      id: 'member-2',
      name: 'Michael Rodriguez',
      role: 'principal',
      email: 'michael.rodriguez@fund.com',
      permissions: ['investment_analysis', 'portfolio_management', 'due_diligence'],
      lastActive: '2024-01-15T09:45:00Z',
      status: 'online'
    },
    {
      id: 'member-3',
      name: 'Emily Zhang',
      role: 'vice_president',
      email: 'emily.zhang@fund.com',
      permissions: ['portfolio_monitoring', 'reporting', 'risk_analysis'],
      lastActive: '2024-01-15T08:15:00Z',
      status: 'away'
    },
    {
      id: 'member-4',
      name: 'David Kim',
      role: 'associate',
      email: 'david.kim@fund.com',
      permissions: ['data_analysis', 'research', 'reporting'],
      lastActive: '2024-01-14T17:30:00Z',
      status: 'offline'
    },
    {
      id: 'member-5',
      name: 'Lisa Thompson',
      role: 'operations',
      email: 'lisa.thompson@fund.com',
      permissions: ['compliance', 'reporting', 'data_management'],
      lastActive: '2024-01-15T11:00:00Z',
      status: 'online'
    }
  ], []);

  // Mock tasks
  const tasks: Task[] = useMemo(() => [
    {
      id: 'task-1',
      title: 'Q4 2024 Portfolio Valuation Review',
      description: 'Complete quarterly valuation analysis for all portfolio companies',
      type: 'analysis',
      priority: 'high',
      status: 'in_progress',
      assignedTo: ['member-2', 'member-3'],
      createdBy: 'member-1',
      dueDate: '2024-01-31',
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-14T15:30:00Z',
      estimatedHours: 40,
      actualHours: 28,
      relatedAssets: ['asset-1', 'asset-2', 'asset-3'],
      comments: [
        {
          id: 'comment-1',
          authorId: 'member-2',
          authorName: 'Michael Rodriguez',
          content: 'Completed analysis for TechCorp. Waiting on management presentation from remaining companies.',
          timestamp: '2024-01-14T15:30:00Z',
          isInternal: true
        }
      ]
    },
    {
      id: 'task-2',
      title: 'Due Diligence: Green Energy Solutions',
      description: 'Comprehensive due diligence for potential new investment',
      type: 'due_diligence',
      priority: 'urgent',
      status: 'review',
      assignedTo: ['member-2', 'member-4'],
      createdBy: 'member-1',
      dueDate: '2024-01-20',
      createdAt: '2024-01-05T10:00:00Z',
      updatedAt: '2024-01-15T09:00:00Z',
      estimatedHours: 80,
      actualHours: 72,
      comments: [
        {
          id: 'comment-2',
          authorId: 'member-4',
          authorName: 'David Kim',
          content: 'Financial model and market analysis complete. Ready for partner review.',
          timestamp: '2024-01-15T09:00:00Z',
          isInternal: true
        }
      ]
    },
    {
      id: 'task-3',
      title: 'LP Quarterly Report Generation',
      description: 'Prepare comprehensive quarterly report for limited partners',
      type: 'reporting',
      priority: 'medium',
      status: 'todo',
      assignedTo: ['member-3', 'member-5'],
      createdBy: 'member-1',
      dueDate: '2024-02-05',
      createdAt: '2024-01-12T14:00:00Z',
      updatedAt: '2024-01-12T14:00:00Z',
      estimatedHours: 24,
      comments: []
    },
    {
      id: 'task-4',
      title: 'ESG Compliance Audit',
      description: 'Annual ESG compliance review for all portfolio companies',
      type: 'compliance',
      priority: 'medium',
      status: 'in_progress',
      assignedTo: ['member-5'],
      createdBy: 'member-1',
      dueDate: '2024-01-25',
      createdAt: '2024-01-08T11:00:00Z',
      updatedAt: '2024-01-13T16:45:00Z',
      estimatedHours: 32,
      actualHours: 18,
      comments: []
    }
  ], []);

  // Mock workflow templates
  const workflowTemplates: WorkflowTemplate[] = useMemo(() => [
    {
      id: 'template-1',
      name: 'New Investment Process',
      description: 'Complete investment evaluation and approval workflow',
      type: 'investment_process',
      estimatedDuration: 45,
      isActive: true,
      stages: [
        {
          id: 'stage-1',
          name: 'Initial Screening',
          description: 'Preliminary investment screening and fit assessment',
          assignedRoles: ['associate', 'analyst'],
          requiredApprovals: 1,
          estimatedDays: 3,
          dependencies: [],
          deliverables: ['Initial screening memo', 'Market sizing analysis'],
          isGate: false
        },
        {
          id: 'stage-2',
          name: 'Due Diligence',
          description: 'Comprehensive due diligence process',
          assignedRoles: ['principal', 'associate'],
          requiredApprovals: 1,
          estimatedDays: 21,
          dependencies: ['stage-1'],
          deliverables: ['Due diligence report', 'Financial model', 'Risk assessment'],
          isGate: true
        },
        {
          id: 'stage-3',
          name: 'Investment Committee',
          description: 'Investment committee review and approval',
          assignedRoles: ['partner', 'principal'],
          requiredApprovals: 2,
          estimatedDays: 7,
          dependencies: ['stage-2'],
          deliverables: ['IC presentation', 'Investment memo'],
          isGate: true
        },
        {
          id: 'stage-4',
          name: 'Documentation & Closing',
          description: 'Legal documentation and transaction closing',
          assignedRoles: ['operations', 'principal'],
          requiredApprovals: 1,
          estimatedDays: 14,
          dependencies: ['stage-3'],
          deliverables: ['Legal documents', 'Closing checklist'],
          isGate: false
        }
      ]
    }
  ], []);

  // Mock workflow instances
  const workflowInstances: WorkflowInstance[] = useMemo(() => [
    {
      id: 'workflow-1',
      templateId: 'template-1',
      templateName: 'New Investment Process',
      relatedAsset: 'GreenTech Solutions',
      currentStage: 'Due Diligence',
      status: 'active',
      startDate: '2024-01-05',
      expectedEndDate: '2024-02-19',
      progress: 65,
      assignedTeam: ['member-1', 'member-2', 'member-4'],
      urgency: 'high'
    },
    {
      id: 'workflow-2',
      templateId: 'template-1',
      templateName: 'New Investment Process',
      relatedAsset: 'Healthcare AI Inc',
      currentStage: 'Investment Committee',
      status: 'active',
      startDate: '2023-12-15',
      expectedEndDate: '2024-01-29',
      progress: 85,
      assignedTeam: ['member-1', 'member-2'],
      urgency: 'medium'
    }
  ], []);

  // Mock notifications
  const notifications: Notification[] = useMemo(() => [
    {
      id: 'notif-1',
      type: 'approval_required',
      title: 'Investment Committee Approval Required',
      message: 'Healthcare AI Inc investment requires your approval',
      timestamp: '2024-01-15T09:30:00Z',
      isRead: false,
      actionRequired: true,
      relatedId: 'workflow-2',
      severity: 'warning'
    },
    {
      id: 'notif-2',
      type: 'deadline_approaching',
      title: 'Task Deadline Approaching',
      message: 'Due Diligence: Green Energy Solutions due in 5 days',
      timestamp: '2024-01-15T08:00:00Z',
      isRead: false,
      actionRequired: true,
      relatedId: 'task-2',
      severity: 'warning'
    },
    {
      id: 'notif-3',
      type: 'task_assigned',
      title: 'New Task Assigned',
      message: 'You have been assigned to LP Quarterly Report Generation',
      timestamp: '2024-01-12T14:00:00Z',
      isRead: true,
      actionRequired: false,
      relatedId: 'task-3',
      severity: 'info'
    }
  ], []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-blue-100 text-blue-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      case 'todo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'partner': return 'bg-blue-100 text-blue-800';
      case 'principal': return 'bg-blue-100 text-blue-800';
      case 'vice_president': return 'bg-indigo-100 text-indigo-800';
      case 'associate': return 'bg-green-100 text-green-800';
      case 'analyst': return 'bg-yellow-100 text-yellow-800';
      case 'operations': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (selectedTaskFilter === 'all') return true;
    if (selectedTaskFilter === 'my_tasks') return task.assignedTo.includes('member-1'); // Current user
    if (selectedTaskFilter === 'overdue') {
      return new Date(task.dueDate) < new Date() && task.status !== 'completed';
    }
    return task.status === selectedTaskFilter;
  });

  const taskMetrics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const overdue = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length;
    
    return { total, completed, inProgress, overdue };
  }, [tasks]);

  return (
    <div className="space-y-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Team Collaboration Dashboard</h3>
            <Button size="sm">Team Settings</Button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{taskMetrics.inProgress}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  of {taskMetrics.total} total tasks
                </p>
                <Progress value={(taskMetrics.inProgress / taskMetrics.total) * 100} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Overdue Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{taskMetrics.overdue}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Require attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {workflowInstances.filter(w => w.status === 'active').length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Investment processes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Team Members Online</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {teamMembers.filter(m => m.status === 'online').length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  of {teamMembers.length} team members
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Activity Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'To Do', value: tasks.filter(t => t.status === 'todo').length, fill: '#94a3b8' },
                        { name: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length, fill: '#3b82f6' },
                        { name: 'Review', value: tasks.filter(t => t.status === 'review').length, fill: '#8b5cf6' },
                        { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length, fill: '#10b981' },
                        { name: 'Blocked', value: tasks.filter(t => t.status === 'blocked').length, fill: '#ef4444' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Workflow Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflowInstances.map((workflow) => (
                    <div key={workflow.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{workflow.relatedAsset}</h4>
                          <p className="text-sm text-gray-600">{workflow.currentStage}</p>
                        </div>
                        <Badge className={workflow.urgency === 'high' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                          {workflow.urgency}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{workflow.progress}%</span>
                      </div>
                      <Progress value={workflow.progress} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">
                        Due: {formatDate(workflow.expectedEndDate)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Team Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: '2 hours ago', user: 'Michael Rodriguez', action: 'completed due diligence analysis', item: 'GreenTech Solutions' },
                  { time: '4 hours ago', user: 'Emily Zhang', action: 'updated task status', item: 'Q4 Portfolio Review' },
                  { time: '1 day ago', user: 'David Kim', action: 'submitted financial model', item: 'Healthcare AI Inc' },
                  { time: '2 days ago', user: 'Sarah Chen', action: 'approved workflow stage', item: 'New Investment Process' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                        <span className="font-medium"> {activity.item}</span>
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Task Management</h3>
            <div className="flex items-center space-x-4">
              <select
                value={selectedTaskFilter}
                onChange={(e) => setSelectedTaskFilter(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md"
              >
                <option value="all">All Tasks</option>
                <option value="my_tasks">My Tasks</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">In Review</option>
                <option value="overdue">Overdue</option>
              </select>
              <Button size="sm">New Task</Button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">{task.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline">
                          {task.type.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm text-gray-600">Due Date</div>
                      <div className={`font-medium ${
                        new Date(task.dueDate) < new Date() && task.status !== 'completed' 
                          ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {formatDate(task.dueDate)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-600">Assigned To:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {task.assignedTo.map(memberId => {
                          const member = teamMembers.find(m => m.id === memberId);
                          return member ? (
                            <Badge key={memberId} variant="outline" className="text-xs">
                              {member.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Progress:</span>
                      {task.estimatedHours && task.actualHours && (
                        <div className="mt-1">
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>{task.actualHours}h of {task.estimatedHours}h</span>
                            <span>{Math.round((task.actualHours / task.estimatedHours) * 100)}%</span>
                          </div>
                          <Progress 
                            value={(task.actualHours / task.estimatedHours) * 100} 
                            className="h-2 mt-1" 
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Comments:</span>
                      <div className="text-sm font-medium mt-1">
                        {task.comments.length} comment{task.comments.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  {task.comments.length > 0 && (
                    <div className="border-t pt-4">
                      <h5 className="font-medium mb-2">Recent Comments</h5>
                      <div className="space-y-2">
                        {task.comments.slice(-2).map((comment) => (
                          <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-medium text-sm">{comment.authorName}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(comment.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Workflows Tab */}
        <TabsContent value="workflows" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Workflow Management</h3>
            <Button size="sm">Create Workflow</Button>
          </div>

          {/* Active Workflows */}
          <Card>
            <CardHeader>
              <CardTitle>Active Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflowInstances.filter(w => w.status === 'active').map((workflow) => (
                  <div key={workflow.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold">{workflow.relatedAsset}</h4>
                        <p className="text-sm text-gray-600">{workflow.templateName}</p>
                        <p className="text-sm text-gray-600">Current Stage: {workflow.currentStage}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={workflow.urgency === 'high' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                          {workflow.urgency} priority
                        </Badge>
                        <div className="text-sm text-gray-600 mt-1">
                          Due: {formatDate(workflow.expectedEndDate)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-600">Progress:</span>
                        <div className="flex justify-between text-sm mt-1">
                          <span>{workflow.progress}% Complete</span>
                        </div>
                        <Progress value={workflow.progress} className="h-2 mt-1" />
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Team:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {workflow.assignedTeam.map(memberId => {
                            const member = teamMembers.find(m => m.id === memberId);
                            return member ? (
                              <Badge key={memberId} variant="outline" className="text-xs">
                                {member.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Started:</span>
                        <div className="text-sm font-medium mt-1">
                          {formatDate(workflow.startDate)}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">View Details</Button>
                      <Button size="sm" variant="outline">Update Status</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Workflow Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Workflow Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflowTemplates.map((template) => (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{template.name}</h4>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                      <Badge className={template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {template.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-600">Type:</span>
                        <div className="font-medium capitalize">
                          {template.type.replace('_', ' ')}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Duration:</span>
                        <div className="font-medium">
                          {template.estimatedDuration} days
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Stages:</span>
                        <div className="font-medium">
                          {template.stages.length} stages
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Use Template</Button>
                      <Button size="sm" variant="outline">Edit Template</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Team Management</h3>
            <Button size="sm">Invite Member</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium text-blue-600">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{member.name}</h4>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      member.status === 'online' ? 'bg-green-400' :
                      member.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'
                    }`}></div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Badge className={getRoleColor(member.role)}>
                        {member.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>

                    <div>
                      <span className="text-sm text-gray-600">Last Active:</span>
                      <div className="text-sm font-medium">
                        {new Date(member.lastActive).toLocaleDateString()}
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-gray-600">Current Tasks:</span>
                      <div className="text-sm font-medium">
                        {tasks.filter(task => task.assignedTo.includes(member.id) && task.status !== 'completed').length}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">Message</Button>
                    <Button size="sm" variant="outline" className="flex-1">View Profile</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <Button size="sm">Mark All Read</Button>
          </div>

          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card key={notification.id} className={`${!notification.isRead ? 'border-l-4 border-l-blue-500' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge className={getSeverityColor(notification.severity)}>
                          {notification.severity}
                        </Badge>
                        <Badge variant="outline">
                          {notification.type.replace('_', ' ')}
                        </Badge>
                        {!notification.isRead && (
                          <Badge className="bg-blue-100 text-blue-800">New</Badge>
                        )}
                      </div>
                      <h4 className="font-semibold mb-1">{notification.title}</h4>
                      <p className="text-sm text-gray-700">{notification.message}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm text-gray-500">
                        {new Date(notification.timestamp).toLocaleDateString()}
                      </div>
                      {notification.actionRequired && (
                        <Button size="sm" className="mt-2">
                          Take Action
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}