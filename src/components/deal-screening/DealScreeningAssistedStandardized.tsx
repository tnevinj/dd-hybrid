import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Brain,
  Sparkles,
  Zap,
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
  Calendar,
  Eye,
  User
} from 'lucide-react';

// Import standardized components
import { 
  StandardizedKPICard, 
  AIScoreKPICard, 
  EfficiencyKPICard, 
  PerformanceKPICard 
} from '@/components/shared/StandardizedKPICard';
import { 
  StandardizedAIPanel, 
  QuickAIInsights, 
  AIProcessingStatus 
} from '@/components/shared/StandardizedAIPanel';
import { StandardizedSearchFilter } from '@/components/shared/StandardizedSearchFilter';
import { 
  StandardizedLoading, 
  AIAnalysisLoading, 
  NoResultsEmpty, 
  NoDataEmpty 
} from '@/components/shared/StandardizedStates';

// Import design system utilities
import { 
  getStatusColor, 
  getPriorityColor, 
  formatCurrency, 
  COMPONENTS, 
  TYPOGRAPHY,
  getAIScoreColor
} from '@/lib/design-system';

// Import consistent mock data
import { generateModuleData } from '@/lib/mock-data-generator';

interface DealScreeningAssistedStandardizedProps {
  opportunities?: any[];
  aiRecommendations?: any[];
  metrics?: any;
  isLoading?: boolean;
  onCreateOpportunity?: () => void;
  onViewOpportunity?: (id: string) => void;
  onScreenOpportunity?: (id: string) => void;
  onExecuteAIAction?: (actionId: string) => void;
  onDismissRecommendation?: (id: string) => void;
}

export const DealScreeningAssistedStandardized: React.FC<DealScreeningAssistedStandardizedProps> = ({
  opportunities: propOpportunities,
  aiRecommendations: propRecommendations,
  metrics: propMetrics,
  isLoading = false,
  onCreateOpportunity = () => {},
  onViewOpportunity = () => {},
  onScreenOpportunity = () => {},
  onExecuteAIAction = () => {},
  onDismissRecommendation = () => {},
}) => {
  // Use consistent mock data if no props provided
  const moduleData = generateModuleData('deal_screening');
  const opportunities = propOpportunities || moduleData.opportunities;
  const metrics = propMetrics || moduleData.metrics;
  const aiRecommendations = propRecommendations || moduleData.recommendations;

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
    }
  ];

  const sortOptions = [
    { key: 'companyName', label: 'Company' },
    { key: 'status', label: 'Status' },
    { key: 'dealSize', label: 'Deal Size' },
    { key: 'aiScore', label: 'AI Score' },
    { key: 'submittedDate', label: 'Submitted Date' }
  ];

  // AI search suggestions
  const aiSuggestions = [
    'High-score opportunities',
    'Technology sector deals',
    'Growth stage investments',
    'Ready for screening'
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

    // Apply sorting with AI-enhanced options
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
        case 'aiScore':
          aValue = a.aiScore || 0;
          bValue = b.aiScore || 0;
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
      <AIAnalysisLoading
        analysisType="deal opportunities"
        itemsProcessed={89}
        totalItems={156}
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
            <Badge className="bg-blue-100 text-blue-800 border border-blue-300 flex items-center space-x-1">
              <Brain className="h-3 w-3" />
              <span>AI-Assisted Mode</span>
            </Badge>
          </div>
          <p className={`${TYPOGRAPHY.body.base} text-blue-700 mt-1`}>
            Enhanced with AI-powered deal analysis and automated screening
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={onCreateOpportunity} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700">
            <Sparkles className="h-4 w-4" />
            <span>AI-Sourced Deal</span>
          </Button>
        </div>
      </div>

      {/* AI Insights Panel */}
      {aiRecommendations && aiRecommendations.length > 0 && (
        <StandardizedAIPanel
          recommendations={aiRecommendations}
          metrics={{
            timeSaved: metrics.timeSaved || 12.4,
            accuracy: metrics.aiAccuracy || 91,
            tasksAutomated: 45,
            efficiency: metrics.efficiency || 60
          }}
          title="AI Deal Screening Insights"
          moduleContext="Deal Screening"
          onExecuteAction={onExecuteAIAction}
          onDismissRecommendation={onDismissRecommendation}
          className="mb-6"
        />
      )}

      {/* AI-Enhanced KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <AIScoreKPICard
          title="AI Deal Score"
          score={89}
          confidence={91}
          insight="High-potential opportunities identified"
          className="border-blue-200"
        />
        
        <StandardizedKPICard
          title="Auto-Screened"
          value={78}
          valueType="percentage"
          mode="assisted"
          icon={Zap}
          status="positive"
          trend="up"
          trendValue="45 deals"
          trendLabel="AI completed"
          isAIEnhanced={true}
        />
        
        <StandardizedKPICard
          title="Time Saved"
          value={12.4}
          valueType="duration"
          mode="assisted"
          icon={Clock}
          status="positive"
          trend="up"
          trendValue="vs manual"
          isAIEnhanced={true}
        />
        
        <EfficiencyKPICard
          title="Screening Efficiency"
          value={60}
          mode="assisted"
          timeSaved="12.4h saved today"
          className="border-blue-200"
        />
      </div>

      {/* Smart Screening Assistant */}
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <Target className="h-5 w-5 mr-2" />
            Smart Screening Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AIProcessingStatus
              status="complete"
              className="border-none shadow-none"
            />
            
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">High-Value Deals</span>
              </div>
              <p className="text-lg font-bold text-gray-900">12 identified</p>
              <p className="text-xs text-gray-600">AI scored &gt;85%</p>
            </div>
            
            <QuickAIInsights
              insights={[
                "Deal analysis: 100% complete",
                "Market timing optimal",
                "15 priority opportunities"
              ]}
              className="border-blue-200"
            />
          </div>
        </CardContent>
      </Card>

      {/* AI-Enhanced Search and Filter */}
      <StandardizedSearchFilter
        mode="assisted"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search deals with AI assistance..."
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
        aiSuggestions={aiSuggestions}
        smartFilterEnabled={true}
        onSmartFilter={() => console.log('Smart filter activated')}
        totalResults={opportunities.length}
        filteredResults={filteredOpportunities.length}
        className="mb-6"
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* AI-Enhanced Opportunities List */}
        <div className="lg:col-span-3">
          <Card className={COMPONENTS.card.assisted.base}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-blue-900">AI-Enhanced Deal Analysis</CardTitle>
                  <p className="text-sm text-blue-700 mt-1">Deals ranked by AI scoring and market analysis</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    AI analysis complete
                  </Badge>
                  <Button onClick={onCreateOpportunity} className="bg-blue-600 hover:bg-blue-700">
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Screen
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredOpportunities.length === 0 ? (
                searchTerm || Object.values(filters).some(f => f) ? (
                  <NoResultsEmpty
                    mode="assisted"
                    searchTerm={searchTerm}
                    onClearFilters={() => {
                      setSearchTerm('');
                      setFilters({ status: '', sector: '', stage: '', region: '' });
                    }}
                  />
                ) : (
                  <NoDataEmpty
                    mode="assisted"
                    dataType="deal opportunities"
                    onCreateNew={onCreateOpportunity}
                  />
                )
              ) : (
                <div className="space-y-4">
                  {/* AI Processing Status */}
                  <div className="flex items-center space-x-4 mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-800 font-medium">
                      AI analysis complete for {filteredOpportunities.length} opportunities
                    </span>
                    <div className="flex items-center space-x-1 ml-auto">
                      <Zap className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-600">Estimated time saved: 12.4 hours</span>
                    </div>
                  </div>

                  {filteredOpportunities.map((opportunity) => (
                    <div key={opportunity.id} className={`border rounded-lg p-6 transition-shadow ${COMPONENTS.card.assisted.accent} ${COMPONENTS.card.assisted.hover}`}>
                      {/* AI Enhancement Indicator */}
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-blue-100 text-blue-800 border border-blue-300 text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          AI Enhanced
                        </Badge>
                      </div>

                      <div className="flex items-start justify-between mb-4 pt-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">{opportunity.companyName}</h3>
                            <Badge className={`${getStatusColor(opportunity.status)} border`}>
                              {opportunity.status.replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline" className="text-blue-700 border-blue-300">
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

                      {/* AI Score Bar */}
                      {opportunity.aiScore && (
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-blue-600 font-medium">AI Deal Score</span>
                            <span className="text-sm font-semibold text-blue-800">{opportunity.aiScore}%</span>
                          </div>
                          <div className="w-full h-3 bg-gray-200 rounded-full">
                            <div 
                              className={getAIScoreColor(opportunity.aiScore)}
                              style={{ width: `${opportunity.aiScore}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* AI Insights */}
                      <div className="mb-4 space-y-2">
                        <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                          <div className="flex items-center space-x-2">
                            <Brain className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-blue-800 font-medium">Market Fit: {opportunity.marketFitScore}%</span>
                          </div>
                        </div>
                        <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                          <div className="flex items-center space-x-2">
                            <Target className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-blue-800 font-medium">Team Strength: {opportunity.teamScore}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Key Metrics with AI Enhancement */}
                      <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-50 rounded-lg mb-4 border border-blue-200">
                        <div className="text-center">
                          <p className="text-sm text-blue-600 mb-1">AI-Verified Revenue</p>
                          <p className="text-lg font-semibold text-green-600">{formatCurrency((opportunity.revenue || 0) * 1000000)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-blue-600 mb-1">Growth Rate</p>
                          <p className="text-lg font-semibold text-blue-600">{opportunity.growthRate?.toFixed(1)}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-blue-600 mb-1">EBITDA Margin</p>
                          <p className="text-lg font-semibold text-orange-600">{opportunity.ebitdaMargin?.toFixed(1)}%</p>
                        </div>
                      </div>

                      {/* Key Highlights with AI Enhancement */}
                      {opportunity.keyHighlights && (
                        <div className="mb-4">
                          <h5 className="font-medium text-blue-900 mb-2">AI-Generated Highlights</h5>
                          <div className="flex flex-wrap gap-2">
                            {opportunity.keyHighlights.map((highlight: string, index: number) => (
                              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs border border-blue-300">
                                <Sparkles className="h-3 w-3 mr-1 inline" />
                                {highlight}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* AI-Enhanced Action Buttons */}
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => onViewOpportunity(opportunity.id)} className="border-blue-300 text-blue-700">
                            <Brain className="h-4 w-4 mr-1" />
                            AI Analysis
                          </Button>
                          <Button size="sm" variant="outline" className="border-blue-300 text-blue-700">
                            <FileText className="h-4 w-4 mr-1" />
                            Smart Docs
                          </Button>
                          <Button size="sm" variant="outline" className="border-blue-300 text-blue-700">
                            <BarChart3 className="h-4 w-4 mr-1" />
                            AI Financials
                          </Button>
                        </div>
                        
                        {opportunity.status === 'NEW' && (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => onScreenOpportunity(opportunity.id)}>
                            <Sparkles className="h-4 w-4 mr-1" />
                            AI Screen
                          </Button>
                        )}
                        
                        {opportunity.status === 'SCREENING' && (
                          <div className="flex space-x-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              AI Recommends
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              Override AI
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

        {/* AI-Enhanced Sidebar */}
        <div className="space-y-6">
          {/* AI Pipeline Analytics */}
          <Card className={COMPONENTS.card.assisted.base}>
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">AI Pipeline Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AIScoreKPICard
                  title="Pipeline Health"
                  score={89}
                  confidence={94}
                  insight="Strong deal flow detected"
                  className="border-none shadow-none bg-blue-50"
                />
                
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { status: 'HIGH_SCORE', count: opportunities.filter(o => (o.aiScore || 0) > 80).length, color: 'green', label: 'High AI Score' },
                    { status: 'SCREENING', count: opportunities.filter(o => o.status === 'SCREENING').length, color: 'blue', label: 'AI Screening' },
                    { status: 'APPROVED', count: opportunities.filter(o => o.status === 'APPROVED').length, color: 'blue', label: 'AI Approved' }
                  ].map((item) => (
                    <div key={item.status} className={`p-2 bg-${item.color}-50 border border-${item.color}-200 rounded text-center`}>
                      <p className={`text-lg font-bold text-${item.color}-900`}>{item.count}</p>
                      <p className={`text-xs text-${item.color}-700`}>{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Performance Summary */}
          <Card className={`${COMPONENTS.card.assisted.base} bg-gradient-to-r from-blue-50 to-blue-50`}>
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">AI Assistant Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">12.4h</p>
                  <p className="text-sm text-gray-600">Time Saved Today</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2 bg-white/70 rounded border">
                    <p className="text-lg font-bold text-blue-600">91%</p>
                    <p className="text-xs text-gray-600">Screening Accuracy</p>
                  </div>
                  <div className="text-center p-2 bg-white/70 rounded border">
                    <p className="text-lg font-bold text-blue-600">45</p>
                    <p className="text-xs text-gray-600">Auto-Screened</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <QuickAIInsights
            insights={[
              "Technology sector outperforming",
              "Growth stage deals trending up",
              "AI identifies 12 priority deals"
            ]}
            className="border-blue-200"
          />
        </div>
      </div>
    </div>
  );
};

export default DealScreeningAssistedStandardized;