import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  MoreVertical,
  TrendingUp,
  BarChart3,
  Activity,
  ArrowUp,
  ArrowDown,
  User,
  Users,
  Calendar,
  DollarSign,
  MapPin,
  FileText,
  Clock,
  Target,
  AlertCircle,
  Zap,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { DealOpportunity } from '@/types/deal-screening';
import { ComparativeValuationAnalysis } from './ComparativeValuationAnalysis';

interface DealScreeningTraditionalProps {
  opportunities: DealOpportunity[];
  metrics: any;
  isLoading: boolean;
  onCreateOpportunity: () => void;
  onViewOpportunity: (id: string) => void;
  onScreenOpportunity: (id: string) => void;
}

export const DealScreeningTraditional: React.FC<DealScreeningTraditionalProps> = ({
  opportunities = [],
  metrics = {
    totalOpportunities: 32,
    activeScreenings: 18,
    completedScreenings: 14,
    averageScreeningTime: '12 days',
    conversionRate: '42%',
    teamMembers: 8,
    documentsReviewed: 156,
  },
  isLoading = false,
  onCreateOpportunity,
  onViewOpportunity,
  onScreenOpportunity,
}) => {
  // Local state for traditional mode - manual controls only
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOpportunities, setFilteredOpportunities] = useState(opportunities);
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'sector' | 'askPrice' | 'expectedIRR'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedFilters, setSelectedFilters] = useState({
    status: '',
    sector: '',
    assetType: '',
    geography: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Apply filtering and sorting
  useEffect(() => {
    let result = [...opportunities];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(opportunity => 
        opportunity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (opportunity.description && opportunity.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        opportunity.sector.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply filters
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(opportunity => 
          opportunity[key as keyof DealOpportunity] === value
        );
      }
    });

    // Apply sorting
    result.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    setFilteredOpportunities(result);
  }, [opportunities, searchTerm, selectedFilters, sortBy, sortOrder]);

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'screening':
      case 'analyzed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'new':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    } else {
      return `$${value.toFixed(0)}`;
    }
  };

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    setSelectedFilters({
      status: '',
      sector: '',
      assetType: '',
      geography: '',
    });
    setSearchTerm('');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-700">Loading Deal Screening Data...</h3>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header - Traditional/Manual Theme */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">Deal Screening Dashboard</h1>
            <Badge className="bg-gray-100 text-gray-800 border border-gray-300 flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>Traditional Mode</span>
            </Badge>
          </div>
          <p className="text-gray-600 mt-1">Full manual control over deal evaluation and screening</p>
        </div>
        <Button onClick={onCreateOpportunity} className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-800">
          <Plus className="h-4 w-4" />
          <span>New Opportunity</span>
        </Button>
      </div>
      
      {/* KPI Cards - Manual Metrics Only */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="h-5 w-5 text-gray-600" />
              <p className="text-sm text-gray-600 font-medium">Total Opportunities</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metrics.totalOpportunities}</p>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              Updated manually
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="h-5 w-5 text-gray-600" />
              <p className="text-sm text-gray-600 font-medium">Active Screenings</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metrics.activeScreenings}</p>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <Clock className="h-4 w-4 mr-1" />
              Manual review
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-gray-600" />
              <p className="text-sm text-gray-600 font-medium">Completed</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metrics.completedScreenings}</p>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <Target className="h-4 w-4 mr-1" />
              Manual process
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 font-medium mb-2">Avg. Review Time</p>
            <p className="text-3xl font-bold text-gray-900">{metrics.averageScreeningTime}</p>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <User className="h-4 w-4 mr-1" />
              Human analysis
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 font-medium mb-2">Team Members</p>
            <p className="text-3xl font-bold text-gray-900">{metrics.teamMembers}</p>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <Users className="h-4 w-4 mr-1" />
              Active analysts
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 font-medium mb-2">Success Rate</p>
            <p className="text-3xl font-bold text-gray-900">{metrics.conversionRate}</p>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <FileText className="h-4 w-4 mr-1" />
              Expert judgment
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manual Controls Section */}
      <Card className="mb-6 border-gray-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-gray-900">Manual Search & Filter Controls</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-gray-600">
                {filteredOpportunities.length} of {opportunities.length} shown
              </Badge>
              {(searchTerm || Object.values(selectedFilters).some(v => v)) && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-gray-600 border-gray-300"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Row */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search opportunities, sectors, descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-gray-500"
              />
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 border-gray-300 text-gray-700"
            >
              <Filter className="h-4 w-4" />
              <span>Advanced Filters</span>
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={selectedFilters.status}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="new">New</option>
                  <option value="screening">Screening</option>
                  <option value="analyzed">Analyzed</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
                <select
                  value={selectedFilters.sector}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, sector: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">All Sectors</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Financial Services">Financial Services</option>
                  <option value="Energy">Energy</option>
                  <option value="Consumer">Consumer</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type</label>
                <select
                  value={selectedFilters.assetType}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, assetType: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">All Types</option>
                  <option value="fund">Fund</option>
                  <option value="direct">Direct</option>
                  <option value="co-investment">Co-Investment</option>
                  <option value="gp-led">GP-Led</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Geography</label>
                <select
                  value={selectedFilters.geography}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, geography: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">All Regions</option>
                  <option value="North America">North America</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia">Asia</option>
                  <option value="Africa">Africa</option>
                </select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Sorting Controls */}
      <Card className="mb-6 border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900">Sort & Organize</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(['name', 'status', 'sector', 'askPrice', 'expectedIRR'] as const).map((field) => (
              <Button
                key={field}
                variant={sortBy === field ? "default" : "outline"}
                size="sm"
                onClick={() => handleSort(field)}
                className={`flex items-center space-x-2 ${
                  sortBy === field 
                    ? 'bg-gray-700 text-white' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="capitalize">
                  {field === 'askPrice' ? 'Price' : 
                   field === 'expectedIRR' ? 'IRR' : field}
                </span>
                {sortBy === field && (
                  sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Opportunities Table View - Traditional/Manual Style */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Investment Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOpportunities.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No opportunities found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Opportunity</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Sector</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Ask Price</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Expected IRR</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOpportunities.map((opportunity) => (
                    <tr key={opportunity.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">{opportunity.name}</div>
                          <div className="text-sm text-gray-600 line-clamp-1">{opportunity.description}</div>
                          <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {opportunity.geography || 'N/A'}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date().getFullYear()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={`${getStatusColor(opportunity.status)} border`}>
                          {opportunity.status.charAt(0).toUpperCase() + opportunity.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-900 font-medium">{opportunity.sector}</span>
                        <div className="text-xs text-gray-500 mt-1">Direct Investment</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900">{formatCurrency(opportunity.askPrice)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-semibold ${
                          opportunity.expectedIRR > 20 ? 'text-green-600' : 'text-gray-900'
                        }`}>
                          {opportunity.expectedIRR}%
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onViewOpportunity(opportunity.id)}
                            className="text-gray-700 border-gray-300"
                          >
                            View
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => onScreenOpportunity(opportunity.id)}
                            className="bg-gray-700 hover:bg-gray-800 text-white"
                          >
                            Screen
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Process Notice */}
      <div className="mt-6 p-4 bg-gray-100 border border-gray-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <User className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Traditional Manual Process</h4>
            <p className="text-sm text-gray-600">
              You have full control over the deal screening process. All decisions, analysis, and evaluations 
              are performed manually without AI assistance. Use the search, filter, and sort tools above to 
              organize opportunities according to your preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealScreeningTraditional;
