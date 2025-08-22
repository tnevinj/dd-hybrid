'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { ModuleHeader, ProcessNotice, MODE_DESCRIPTIONS } from '@/components/shared/ModeIndicators';
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
  Filter,
  FileText,
  Calculator,
  BarChart,
  Settings,
  BookOpen,
  Download,
  Upload
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Standardized Header */}
      <ModuleHeader
        title="Deal Structuring"
        description="Complete manual control over deal structuring and financial modeling"
        mode="traditional"
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center space-x-2 border-gray-300 text-gray-700">
              <BookOpen className="h-4 w-4" />
              <span>Templates</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2 border-gray-300 text-gray-700">
              <Calculator className="h-4 w-4" />
              <span>Tools</span>
            </Button>
            <Button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-800">
              <Plus className="h-4 w-4" />
              <span>New Deal Structure</span>
            </Button>
          </div>
        }
      />

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Deals</p>
                <p className="text-2xl font-bold text-gray-900">{metrics?.activeDeals || 0}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {deals.filter(d => d.stage === 'structuring').length} in structuring
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(metrics?.totalValue || 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Across all active deals</p>
              </div>
              <DollarSign className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics?.averageProgress || 0}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Overall completion rate</p>
              </div>
              <CheckCircle className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Manual Tools</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-xs text-gray-500 mt-1">Available templates</p>
              </div>
              <FileText className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Active Deals Section */}
        <div className="lg:col-span-2">
          <Card className="border-gray-200">
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
                <Card key={deal.id} className="border-l-4 border-l-gray-400">
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
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Calculator className="h-3 w-3 mr-1" />
                          Manual Model
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.location.href = `/deal-structuring/${deal.id}`}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Manual Tools */}
          <Card className="border-gray-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-gray-600" />
                <h3 className="text-lg font-semibold">Manual Tools</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">DCF Model Template</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  Standard discounted cash flow analysis template
                </p>
                <Button size="sm" className="h-6 text-xs bg-gray-700 hover:bg-gray-800">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">LBO Analysis</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  Leveraged buyout structure modeling
                </p>
                <Button size="sm" variant="outline" className="h-6 text-xs border-gray-300 text-gray-700">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <Settings className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">Risk Calculator</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  Manual risk assessment spreadsheet
                </p>
                <Button size="sm" variant="outline" className="h-6 text-xs border-gray-300 text-gray-700">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="border-gray-200">
            <CardHeader>
              <h3 className="text-lg font-semibold">Recent Activities</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="flex gap-1">
                    {activity.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {activity.status === 'in_progress' && <Clock className="h-4 w-4 text-yellow-500" />}
                    {activity.status === 'pending' && <AlertTriangle className="h-4 w-4 text-red-500" />}
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
          <Card className="border-gray-200">
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

      {/* Standardized Process Notice */}
      <ProcessNotice
        mode="traditional"
        title="Traditional Deal Structuring"
        description="You have complete manual control over deal structuring and financial modeling. All DCF models, LBO analyses, and risk assessments are performed manually without AI assistance. Use the templates and tools above to structure deals according to your investment strategy."
      />
    </div>
  );
};

export default DealStructuringTraditional;
