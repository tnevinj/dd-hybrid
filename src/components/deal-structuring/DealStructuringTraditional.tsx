'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Plus,
  Filter
} from 'lucide-react';
import { useDealStructuring } from '@/hooks/use-deal-structuring';
import { DealStructuringProject } from '@/types/deal-structuring';

const DealStructuringTraditional: React.FC = () => {
  const { metrics, deals, activities, deadlines, isLoading, error } = useDealStructuring();
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary'; 
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'pending': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deal Structuring Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor and manage deal structuring activities</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Deal Structure
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Deals</p>
                <p className="text-2xl font-bold text-gray-900">{metrics?.activeDeals || 0}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {deals.filter(d => d.stage === 'STRUCTURING').length} in structuring
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(metrics?.totalValue || 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Across all active deals</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics?.averageProgress || 0}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Overall completion rate</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Deadlines</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics?.upcomingDeadlines || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Next 30 days</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Deals Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Active Deals</h2>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search deals..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {deals.map((deal) => (
                <Card key={deal.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{deal.name}</h3>
                        <p className="text-sm text-gray-600">
                          {deal.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} • {formatCurrency(deal.targetValue)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={getRiskBadgeVariant(deal.riskLevel)}>
                          {deal.riskLevel} risk
                        </Badge>
                        <Badge variant="outline">
                          {deal.stage.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{deal.progress}%</span>
                      </div>
                      <Progress value={deal.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                      <div>
                        <p className="font-medium text-gray-600">IRR</p>
                        <p className="text-gray-900">
                          {deal.keyMetrics.irr ? formatPercentage(deal.keyMetrics.irr) : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">Multiple</p>
                        <p className="text-gray-900">
                          {deal.keyMetrics.multiple ? `${deal.keyMetrics.multiple.toFixed(1)}x` : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">Team</p>
                        <p className="text-gray-900 flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {deal.team.length}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">Next Milestone</p>
                        <p className="text-gray-900 truncate">{deal.nextMilestone || 'TBD'}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        Updated {deal.lastUpdated.toLocaleDateString()}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.location.href = `/deal-structuring/${deal.id}`}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Recent Activities</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="flex gap-1">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.deal} • {activity.user}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {activity.date.toLocaleDateString()}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Upcoming Deadlines</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {deadlines.map((deadline) => (
                <div key={deadline.id} className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {deadline.title}
                      </p>
                      <p className="text-xs text-gray-500">{deadline.deal}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={deadline.priority === 'high' ? 'destructive' : 
                              deadline.priority === 'medium' ? 'secondary' : 'default'}
                      className="text-xs mb-1"
                    >
                      {deadline.priority}
                    </Badge>
                    <p className="text-xs text-gray-500 block">
                      {deadline.dueDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DealStructuringTraditional;