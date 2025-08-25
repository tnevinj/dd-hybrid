import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  User,
  Eye,
  Target,
  TrendingUp,
  BarChart3,
  Activity,
  DollarSign,
  MapPin,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar
} from 'lucide-react';

// Import standardized components
import { 
  StandardizedKPICard, 
  EfficiencyKPICard, 
  PerformanceKPICard 
} from '@/components/shared/StandardizedKPICard';
import { StandardizedSearchFilter } from '@/components/shared/StandardizedSearchFilter';
import { 
  StandardizedLoading, 
  NoResultsEmpty, 
  NoDataEmpty 
} from '@/components/shared/StandardizedStates';

// Import design system utilities
import { 
  getStatusColor, 
  getPriorityColor, 
  formatCurrency, 
  COMPONENTS, 
  TYPOGRAPHY 
} from '@/lib/design-system';

// Import consistent mock data
import { generateModuleData } from '@/lib/mock-data-generator';

interface DealScreeningTraditionalStandardizedProps {
  opportunities?: any[];
  metrics?: any;
  isLoading?: boolean;
  onCreateOpportunity?: () => void;
  onViewOpportunity?: (id: string) => void;
  onScreenOpportunity?: (id: string) => void;
}

export const DealScreeningTraditionalStandardized: React.FC<DealScreeningTraditionalStandardizedProps> = ({
  opportunities: propOpportunities,
  metrics: propMetrics,
  isLoading = false,
  onCreateOpportunity = () => {},
  onViewOpportunity = () => {},
  onScreenOpportunity = () => {},
}) => {
  // Use consistent mock data if no props provided
  const moduleData = generateModuleData('deal_screening');
  const opportunities = propOpportunities || moduleData.opportunities;
  const metrics = propMetrics || moduleData.metrics;

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    sector: '',
    stage: '',
    region: ''
  });
  const [sortBy, setSortBy] = useState('submittedDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter configurations using design system
  const filterConfigs = [
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      placeholder: 'All Statuses',
      options: [
        { value: 'NEW', label: 'New' },
        { value: 'SCREENING', label: 'Screening' },
        { value: 'ANALYZED', label: 'Analyzed' },
        { value: 'APPROVED', label: 'Approved' },
        { value: 'REJECTED', label: 'Rejected' },
        { value: 'ON_HOLD', label: 'On Hold' }
      ]
    },
    {
      key: 'sector',
      label: 'Sector',
      type: 'select' as const,
      placeholder: 'All Sectors',
      options: [
        { value: 'Technology', label: 'Technology' },
        { value: 'Healthcare', label: 'Healthcare' },
        { value: 'Financial Services', label: 'Financial Services' },
        { value: 'Energy', label: 'Energy' },
        { value: 'Consumer Goods', label: 'Consumer Goods' }
      ]
    },
    {
      key: 'stage',
      label: 'Stage',
      type: 'select' as const,
      placeholder: 'All Stages',
      options: [
        { value: 'SEED', label: 'Seed' },
        { value: 'SERIES_A', label: 'Series A' },
        { value: 'GROWTH', label: 'Growth' },
        { value: 'BUYOUT', label: 'Buyout' }
      ]
    }
  ];

  const sortOptions = [
    { key: 'companyName', label: 'Company' },
    { key: 'status', label: 'Status' },
    { key: 'dealSize', label: 'Deal Size' },
    { key: 'submittedDate', label: 'Submitted Date' }
  ];

  // Apply filtering and sorting
  const filteredOpportunities = useMemo(() => {
    let result = [...opportunities];
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(opp => 
        opp.companyName?.toLowerCase().includes(lowerSearchTerm) ||
        opp.sector?.toLowerCase().includes(lowerSearchTerm) ||
        opp.region?.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Apply filters
    if (filters.status) {
      result = result.filter(opp => opp.status === filters.status);
    }
    if (filters.sector) {
      result = result.filter(opp => opp.sector === filters.sector);
    }
    if (filters.stage) {
      result = result.filter(opp => opp.stage === filters.stage);
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'companyName':
          aValue = a.companyName || '';
          bValue = b.companyName || '';
          break;
        case 'dealSize':
          aValue = a.dealSize || 0;
          bValue = b.dealSize || 0;
          break;
        case 'submittedDate':
          aValue = a.submittedDate ? new Date(a.submittedDate).getTime() : 0;
          bValue = b.submittedDate ? new Date(b.submittedDate).getTime() : 0;
          break;
        default:
          aValue = a[sortBy] || '';
          bValue = b[sortBy] || '';
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    return result;
  }, [opportunities, searchTerm, filters, sortBy, sortOrder]);

  if (isLoading) {
    return (
      <StandardizedLoading
        mode="traditional"
        message="Loading Deal Screening Data..."
        submessage="Preparing opportunity pipeline and screening analytics"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className={TYPOGRAPHY.headings.h1}>Deal Screening</h1>
            <Badge className="bg-gray-100 text-gray-800 border border-gray-300 flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>Traditional Mode</span>
            </Badge>
          </div>
          <p className={`${TYPOGRAPHY.body.base} text-gray-600 mt-1`}>
            Complete manual control over deal sourcing and initial screening processes
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={onCreateOpportunity} className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-800">
            <Plus className="h-4 w-4" />
            <span>New Opportunity</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StandardizedKPICard
          title="Total Deals"
          value={metrics.totalDeals || 0}
          mode="traditional"
          icon={FileText}
          subtitle={`${metrics.activeDeals || 0} active`}
          trend="up"
          trendLabel="this month"
        />
        
        <StandardizedKPICard
          title="Screening Pipeline"
          value={opportunities.filter(o => o.status === 'SCREENING').length}
          mode="traditional"
          icon={Target}
          subtitle="Under review"
          status="positive"
        />
        
        <StandardizedKPICard
          title="Conversion Rate"
          value={metrics.conversionRate || 0}
          valueType="percentage"
          mode="traditional"
          icon={TrendingUp}
          status="positive"
          trend="up"
          trendValue="+3%"
          trendLabel="vs last quarter"
        />
        
        <EfficiencyKPICard
          title="Screening Time"
          value={100 - ((metrics.averageScreeningTime || 10) * 8)}
          mode="traditional"
          timeSaved="vs industry avg"
          className="border-gray-200"
        />
      </div>

      {/* Search and Filter */}
      <StandardizedSearchFilter
        mode="traditional"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search deals, companies, sectors..."
        filters={filters}
        onFiltersChange={setFilters}
        filterConfigs={filterConfigs}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(field, order) => {
          setSortBy(field);
          setSortOrder(order);
        }}
        sortOptions={sortOptions}
        totalResults={opportunities.length}
        filteredResults={filteredOpportunities.length}
        className="mb-6"
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Opportunities List */}
        <div className="lg:col-span-3">
          <Card className={COMPONENTS.card.traditional.base}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-gray-900">Deal Opportunities</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Track opportunities through the screening process</p>
                </div>
                <Button onClick={onCreateOpportunity} className="bg-gray-700 hover:bg-gray-800">
                  <Target className="h-4 w-4 mr-2" />
                  Screen Deal
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {filteredOpportunities.length === 0 ? (
                searchTerm || Object.values(filters).some(f => f) ? (
                  <NoResultsEmpty
                    mode="traditional"
                    searchTerm={searchTerm}
                    onClearFilters={() => {
                      setSearchTerm('');
                      setFilters({ status: '', sector: '', stage: '', region: '' });
                    }}
                  />
                ) : (
                  <NoDataEmpty
                    mode="traditional"
                    dataType="deal opportunities"
                    onCreateNew={onCreateOpportunity}
                  />
                )
              ) : (
                <div className="space-y-4">
                  {filteredOpportunities.map((opportunity) => (
                    <div key={opportunity.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">{opportunity.companyName}</h3>
                            <Badge className={`${getStatusColor(opportunity.status)} border`}>
                              {opportunity.status.replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline" className="text-gray-700">
                              {opportunity.sector}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {opportunity.region}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {opportunity.submittedDate?.toLocaleDateString?.() || 'N/A'}
                            </span>
                            <span className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {opportunity.contactPerson}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">{formatCurrency(opportunity.dealSize || 0)}</p>
                          <p className="text-sm text-gray-500">{opportunity.stage}</p>
                        </div>
                      </div>

                      {/* Key Metrics */}
                      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-500 mb-1">Revenue</p>
                          <p className="text-lg font-semibold text-green-600">{formatCurrency((opportunity.revenue || 0) * 1000000)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500 mb-1">Growth Rate</p>
                          <p className="text-lg font-semibold text-blue-600">{opportunity.growthRate?.toFixed(1)}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500 mb-1">EBITDA Margin</p>
                          <p className="text-lg font-semibold text-orange-600">{opportunity.ebitdaMargin?.toFixed(1)}%</p>
                        </div>
                      </div>

                      {/* Key Highlights */}
                      {opportunity.keyHighlights && (
                        <div className="mb-4">
                          <h5 className="font-medium text-gray-900 mb-2">Key Highlights</h5>
                          <div className="flex flex-wrap gap-2">
                            {opportunity.keyHighlights.map((highlight: string, index: number) => (
                              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {highlight}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => onViewOpportunity(opportunity.id)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4 mr-1" />
                            Documents
                          </Button>
                          <Button size="sm" variant="outline">
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Financials
                          </Button>
                        </div>
                        
                        {opportunity.status === 'NEW' && (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => onScreenOpportunity(opportunity.id)}>
                            <Target className="h-4 w-4 mr-1" />
                            Start Screening
                          </Button>
                        )}
                        
                        {opportunity.status === 'SCREENING' && (
                          <div className="flex space-x-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              Pass
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pipeline Overview */}
          <Card className={COMPONENTS.card.traditional.base}>
            <CardHeader>
              <CardTitle className="text-lg">Pipeline Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <StandardizedKPICard
                  title="Deal Flow"
                  value={opportunities.length}
                  mode="traditional"
                  icon={Activity}
                  subtitle="Total opportunities"
                  className="border-none shadow-none bg-blue-50"
                />
                
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { status: 'NEW', count: opportunities.filter(o => o.status === 'NEW').length, color: 'blue' },
                    { status: 'SCREENING', count: opportunities.filter(o => o.status === 'SCREENING').length, color: 'yellow' },
                    { status: 'ANALYZED', count: opportunities.filter(o => o.status === 'ANALYZED').length, color: 'blue' },
                    { status: 'APPROVED', count: opportunities.filter(o => o.status === 'APPROVED').length, color: 'green' }
                  ].map((item) => (
                    <div key={item.status} className={`p-2 bg-${item.color}-50 border border-${item.color}-200 rounded text-center`}>
                      <p className={`text-lg font-bold text-${item.color}-900`}>{item.count}</p>
                      <p className={`text-xs text-${item.color}-700`}>{item.status.replace('_', ' ')}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sector Breakdown */}
          <Card className={COMPONENTS.card.traditional.base}>
            <CardHeader>
              <CardTitle className="text-lg">Sector Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from(new Set(opportunities.map(o => o.sector))).map((sector) => {
                  const count = opportunities.filter(o => o.sector === sector).length;
                  const percentage = ((count / opportunities.length) * 100).toFixed(0);
                  
                  return (
                    <div key={sector} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{sector}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{count}</span>
                        <span className="text-xs text-gray-500">({percentage}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className={COMPONENTS.card.traditional.base}>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: 'New opportunity added', company: 'TechCorp Alpha', time: '2h ago' },
                  { action: 'Screening completed', company: 'HealthTech Solutions', time: '4h ago' },
                  { action: 'Deal approved', company: 'FinServ Innovations', time: '1d ago' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-600">{activity.company} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Traditional Process Notice */}
      <div className="mt-6 p-4 bg-gray-100 border border-gray-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <User className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Traditional Deal Screening Process</h4>
            <p className="text-sm text-gray-600">
              You have full manual control over deal sourcing and screening processes. All opportunity evaluations, 
              financial analysis, and screening decisions are performed manually without AI assistance. 
              Use the search, filter, and sort tools to organize deals according to your criteria.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealScreeningTraditionalStandardized;