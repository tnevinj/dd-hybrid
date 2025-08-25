'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  Filter,
  Star,
  Clock,
  Users,
  TrendingUp,
  Calculator,
  BarChart3,
  Globe,
  Leaf,
  Layers,
  Activity,
  DollarSign,
  Zap,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { 
  FinancialModel, 
  ModelCategory, 
  ModelComplexity, 
  ModelStatus,
  SkillLevel,
  ModelFilter 
} from '@/types/financial-modeling';
import { financialModelRegistry } from '@/services/financial-model-registry';
import { useViewContext } from '@/hooks/use-view-context';

interface ModelMarketplaceProps {
  dealId: string;
  onModelSelect: (modelId: string) => void;
  selectedModels: string[];
}

const ModelMarketplace: React.FC<ModelMarketplaceProps> = ({
  dealId,
  onModelSelect,
  selectedModels
}) => {
  const { viewMode } = useViewContext();
  const [models, setModels] = useState<FinancialModel[]>([]);
  const [filteredModels, setFilteredModels] = useState<FinancialModel[]>([]);
  const [popularModels, setPopularModels] = useState<FinancialModel[]>([]);
  const [recommendedModels, setRecommendedModels] = useState<FinancialModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ModelCategory | 'all'>('all');
  const [selectedComplexity, setSelectedComplexity] = useState<ModelComplexity | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ModelStatus | 'all'>('all');

  const iconMap: { [key: string]: React.ComponentType<any> } = {
    Calculator,
    TrendingUp,
    BarChart3,
    Globe,
    Leaf,
    Layers,
    Activity,
    DollarSign,
    BarChart: BarChart3
  };

  useEffect(() => {
    loadModels();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [models, searchTerm, selectedCategory, selectedComplexity, selectedStatus]);

  const loadModels = async () => {
    try {
      setLoading(true);
      const [allModels, popular, recommended] = await Promise.all([
        financialModelRegistry.getAllModels(),
        financialModelRegistry.getPopularModels(6),
        financialModelRegistry.getRecommendedModels(SkillLevel.ASSOCIATE, 6)
      ]);
      
      setModels(allModels);
      setPopularModels(popular);
      setRecommendedModels(recommended);
    } catch (error) {
      console.error('Failed to load financial models:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    const filter: ModelFilter = {
      searchTerm: searchTerm || undefined,
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      complexity: selectedComplexity !== 'all' ? selectedComplexity : undefined,
      status: selectedStatus !== 'all' ? selectedStatus : undefined
    };

    const filtered = await financialModelRegistry.searchModels(filter);
    setFilteredModels(filtered);
  };

  const getModelIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Calculator;
    return <IconComponent className="h-5 w-5" />;
  };

  const getComplexityColor = (complexity: ModelComplexity) => {
    switch (complexity) {
      case ModelComplexity.BASIC: return 'bg-green-100 text-green-800';
      case ModelComplexity.INTERMEDIATE: return 'bg-blue-100 text-blue-800';
      case ModelComplexity.ADVANCED: return 'bg-orange-100 text-orange-800';
      case ModelComplexity.EXPERT: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: ModelStatus) => {
    switch (status) {
      case ModelStatus.AVAILABLE: return 'bg-green-100 text-green-800';
      case ModelStatus.BETA: return 'bg-yellow-100 text-yellow-800';
      case ModelStatus.IN_DEVELOPMENT: return 'bg-blue-100 text-blue-800';
      case ModelStatus.PLANNED: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatEstimatedValue = (value: number) => {
    return `$${(value / 1000000).toFixed(1)}M`;
  };

  const isModelSelected = (modelId: string) => {
    return selectedModels.includes(modelId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Model Marketplace</h2>
          <p className="text-gray-600 mt-1">Choose financial models for your deal analysis</p>
        </div>
        {viewMode !== 'traditional' && (
          <Button variant="outline">
            <Zap className="h-4 w-4 mr-2" />
            AI Recommendations
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search models by name, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ModelCategory | 'all')}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Categories</option>
                <option value={ModelCategory.CORE}>Core Models</option>
                <option value={ModelCategory.VALUATION}>Valuation</option>
                <option value={ModelCategory.STRUCTURED_PRODUCTS}>Structured Products</option>
                <option value={ModelCategory.TAX_LEGAL}>Tax & Legal</option>
                <option value={ModelCategory.ESG}>ESG</option>
              </select>
              <select
                value={selectedComplexity}
                onChange={(e) => setSelectedComplexity(e.target.value as ModelComplexity | 'all')}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Levels</option>
                <option value={ModelComplexity.BASIC}>Basic</option>
                <option value={ModelComplexity.INTERMEDIATE}>Intermediate</option>
                <option value={ModelComplexity.ADVANCED}>Advanced</option>
                <option value={ModelComplexity.EXPERT}>Expert</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as ModelStatus | 'all')}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value={ModelStatus.AVAILABLE}>Available</option>
                <option value={ModelStatus.BETA}>Beta</option>
                <option value={ModelStatus.IN_DEVELOPMENT}>In Development</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access Sections */}
      {!searchTerm && selectedCategory === 'all' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Models */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-semibold">Most Popular</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {popularModels.slice(0, 4).map((model) => (
                <div key={model.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="text-blue-600">
                      {getModelIcon(model.icon)}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{model.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        {model.usageCount} uses
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={isModelSelected(model.id) ? "default" : "outline"}
                    onClick={() => onModelSelect(model.id)}
                    disabled={model.status !== ModelStatus.AVAILABLE}
                  >
                    {isModelSelected(model.id) ? 'Selected' : 'Select'}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recommended Models */}
          {viewMode !== 'traditional' && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">AI Recommended</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendedModels.slice(0, 4).map((model) => (
                  <div key={model.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="text-blue-600">
                        {getModelIcon(model.icon)}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{model.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <Star className="h-3 w-3" />
                          {model.averageRating.toFixed(1)} rating
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={isModelSelected(model.id) ? "default" : "outline"}
                      onClick={() => onModelSelect(model.id)}
                      disabled={model.status !== ModelStatus.AVAILABLE}
                    >
                      {isModelSelected(model.id) ? 'Selected' : 'Select'}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* All Models Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {searchTerm || selectedCategory !== 'all' ? 'Search Results' : 'All Models'}
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({filteredModels.length} models)
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModels.map((model) => (
            <Card key={model.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-blue-600">
                      {getModelIcon(model.icon)}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{model.name}</h4>
                      <div className="text-xs text-gray-500">v{model.version}</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge className={`text-xs ${getStatusColor(model.status)}`}>
                      {model.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={`text-xs ${getComplexityColor(model.complexity)}`}>
                      {model.complexity}
                    </Badge>
                  </div>
                </div>

                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {model.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {model.estimatedTimeToComplete}min
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {model.averageRating.toFixed(1)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {model.usageCount}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {model.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {model.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{model.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Value: {formatEstimatedValue(model.estimatedValue)}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-7"
                    >
                      <BookOpen className="h-3 w-3 mr-1" />
                      Learn
                    </Button>
                    <Button
                      size="sm"
                      variant={isModelSelected(model.id) ? "default" : "outline"}
                      className="text-xs h-7"
                      onClick={() => onModelSelect(model.id)}
                      disabled={model.status !== ModelStatus.AVAILABLE}
                    >
                      {isModelSelected(model.id) ? 'Selected' : 'Select'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredModels.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No models found matching your criteria.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedComplexity('all');
                setSelectedStatus('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelMarketplace;