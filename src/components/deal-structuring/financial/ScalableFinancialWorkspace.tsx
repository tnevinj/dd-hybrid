'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator,
  TrendingUp,
  BarChart3,
  Settings,
  Save,
  Share,
  Download,
  Plus,
  X,
  Maximize2,
  Minimize2,
  Grid3x3,
  List,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useViewContext } from '@/hooks/use-view-context';
import { FinancialModel, ModelStatus } from '@/types/financial-modeling';
import { financialModelRegistry } from '@/services/financial-model-registry';
import ModelMarketplace from './ModelMarketplace';
import DCFModelingCard from './DCFModelingCard';
import LBOModelingCard from './LBOModelingCard';
import WaterfallModelingCard from './WaterfallModelingCard';
import ComparableCompanyCard from './ComparableCompanyCard';
import CapitalStructureCard from './CapitalStructureCard';
import TermSheetCard from './TermSheetCard';
import FinancialStatementsCard from './FinancialStatementsCard';
import RevenueForecastCard from './RevenueForecastCard';
import WorkingCapitalCard from './WorkingCapitalCard';
import ProjectFinanceCard from './ProjectFinanceCard';
import EnhancedPreferredEquityCard from './EnhancedPreferredEquityCard';
import PMEAnalysisCard from './PMEAnalysisCard';
import ESGImpactCard from './ESGImpactCard';
import TaxOptimizationCard from './TaxOptimizationCard';
import PrecedentTransactionCard from './PrecedentTransactionCard';
import RevenueParticipationCard from './RevenueParticipationCard';

interface ScalableFinancialWorkspaceProps {
  dealId: string;
  dealName: string;
}

interface ActiveModel {
  id: string;
  model: FinancialModel;
  isExpanded: boolean;
  results?: any;
  lastCalculated?: Date;
}

const ScalableFinancialWorkspace: React.FC<ScalableFinancialWorkspaceProps> = ({ 
  dealId, 
  dealName 
}) => {
  const { viewMode } = useViewContext();
  const [view, setView] = useState<'marketplace' | 'workspace'>('marketplace');
  const [layout, setLayout] = useState<'grid' | 'tabs'>('grid');
  const [activeModels, setActiveModels] = useState<ActiveModel[]>([]);
  const [selectedModelTab, setSelectedModelTab] = useState<string>('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    // Load pre-selected models for the deal
    loadDefaultModels();
  }, [dealId]);

  const loadDefaultModels = async () => {
    // Pre-load core models for deal analysis
    const defaultModelIds = ['dcf-valuation', 'lbo-analysis', 'waterfall-modeling', 'capital-structure', 'financial-statements', 'revenue-forecast', 'working-capital', 'project-finance', 'enhanced-preferred-equity', 'pme-analysis', 'esg-impact', 'tax-optimization', 'comp-analysis', 'precedent-transactions', 'revenue-participation'];
    const models = await Promise.all(
      defaultModelIds.map(id => financialModelRegistry.getModel(id))
    );
    
    const validModels = models.filter(Boolean) as FinancialModel[];
    const initialActiveModels: ActiveModel[] = validModels.map(model => ({
      id: model.id,
      model,
      isExpanded: false
    }));
    
    setActiveModels(initialActiveModels);
    if (initialActiveModels.length > 0) {
      setSelectedModelTab(initialActiveModels[0].id);
      setView('workspace');
    }
  };

  const handleModelSelect = async (modelId: string) => {
    const existingIndex = activeModels.findIndex(am => am.id === modelId);
    
    if (existingIndex >= 0) {
      // Remove model if already selected
      const newActiveModels = activeModels.filter((_, index) => index !== existingIndex);
      setActiveModels(newActiveModels);
      
      // Update selected tab if removing current tab
      if (selectedModelTab === modelId) {
        setSelectedModelTab(newActiveModels.length > 0 ? newActiveModels[0].id : '');
      }
    } else {
      // Add new model
      const model = await financialModelRegistry.getModel(modelId);
      if (model && model.status === ModelStatus.AVAILABLE) {
        const newActiveModel: ActiveModel = {
          id: modelId,
          model,
          isExpanded: false
        };
        
        setActiveModels(prev => [...prev, newActiveModel]);
        setSelectedModelTab(modelId);
        setView('workspace');
        
        // Track usage
        await financialModelRegistry.incrementUsage(modelId);
      }
    }
    setHasUnsavedChanges(true);
  };

  const handleModelResults = (modelId: string, results: any) => {
    setActiveModels(prev => 
      prev.map(am => 
        am.id === modelId 
          ? { ...am, results, lastCalculated: new Date() }
          : am
      )
    );
    setHasUnsavedChanges(true);
  };

  const toggleModelExpansion = (modelId: string) => {
    setActiveModels(prev =>
      prev.map(am =>
        am.id === modelId
          ? { ...am, isExpanded: !am.isExpanded }
          : am
      )
    );
  };

  const removeModel = (modelId: string) => {
    const newActiveModels = activeModels.filter(am => am.id !== modelId);
    setActiveModels(newActiveModels);
    
    if (selectedModelTab === modelId) {
      setSelectedModelTab(newActiveModels.length > 0 ? newActiveModels[0].id : '');
    }
    setHasUnsavedChanges(true);
  };

  const saveWorkspace = async () => {
    // Mock save functionality
    setLastSaved(new Date());
    setHasUnsavedChanges(false);
    // In production, would save workspace state to backend
  };

  const renderModelComponent = (activeModel: ActiveModel) => {
    const { model } = activeModel;
    const commonProps = {
      dealId,
      mode: viewMode,
      onResultsChange: (results: any) => handleModelResults(model.id, results)
    };

    switch (model.id) {
      case 'dcf-valuation':
        return <DCFModelingCard {...commonProps} />;
      case 'lbo-analysis':
        return <LBOModelingCard {...commonProps} />;
      case 'waterfall-modeling':
        return <WaterfallModelingCard {...commonProps} />;
      case 'comp-analysis':
        return <ComparableCompanyCard {...commonProps} />;
      case 'capital-structure':
        return <CapitalStructureCard {...commonProps} />;
      case 'term-sheet':
        return <TermSheetCard {...commonProps} />;
      case 'financial-statements':
        return <FinancialStatementsCard {...commonProps} />;
      case 'revenue-forecast':
        return <RevenueForecastCard {...commonProps} />;
      case 'working-capital':
        return <WorkingCapitalCard {...commonProps} />;
      case 'project-finance':
        return <ProjectFinanceCard {...commonProps} />;
      case 'enhanced-preferred-equity':
        return <EnhancedPreferredEquityCard {...commonProps} />;
      case 'pme-analysis':
        return <PMEAnalysisCard {...commonProps} />;
      case 'esg-impact':
        return <ESGImpactCard {...commonProps} />;
      case 'tax-optimization':
        return <TaxOptimizationCard {...commonProps} />;
      case 'comp-analysis':
        return <ComparableCompanyCard {...commonProps} />;
      case 'precedent-transactions':
        return <PrecedentTransactionCard {...commonProps} />;
      case 'revenue-participation':
        return <RevenueParticipationCard {...commonProps} />;
      default:
        return (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">{model.name}</h3>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>Model component not yet implemented</p>
                <p className="text-sm mt-2">Coming in v{model.version}</p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  const getModelStatusIcon = (activeModel: ActiveModel) => {
    if (activeModel.results) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (activeModel.lastCalculated) {
      return <Clock className="h-4 w-4 text-yellow-500" />;
    } else {
      return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const selectedModelIds = activeModels.map(am => am.id);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Models</h1>
          <p className="text-gray-600 mt-1">{dealName} - Advanced Analysis</p>
        </div>
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <span className="text-sm text-amber-600 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Unsaved changes
            </span>
          )}
          {lastSaved && (
            <span className="text-sm text-gray-500">
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <Button variant="outline" onClick={saveWorkspace}>
            <Save className="h-4 w-4 mr-2" />
            Save Workspace
          </Button>
          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={view === 'marketplace' ? 'default' : 'outline'}
            onClick={() => setView('marketplace')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Models
          </Button>
          <Button
            variant={view === 'workspace' ? 'default' : 'outline'}
            onClick={() => setView('workspace')}
            disabled={activeModels.length === 0}
          >
            <Calculator className="h-4 w-4 mr-2" />
            Workspace ({activeModels.length})
          </Button>
        </div>

        {view === 'workspace' && activeModels.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant={layout === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLayout('grid')}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={layout === 'tabs' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLayout('tabs')}
            >
              <List className="h-4 w-4" />
            </Button>
            {viewMode !== 'traditional' && (
              <Button variant="outline" size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Cross-Model AI
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Content Area */}
      {view === 'marketplace' ? (
        <ModelMarketplace
          dealId={dealId}
          onModelSelect={handleModelSelect}
          selectedModels={selectedModelIds}
        />
      ) : (
        <div className="space-y-4">
          {activeModels.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Models Selected</h3>
                <p className="text-gray-500 mb-6">Choose financial models to start your analysis</p>
                <Button onClick={() => setView('marketplace')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Browse Models
                </Button>
              </CardContent>
            </Card>
          ) : layout === 'tabs' ? (
            /* Tab Layout */
            <div>
              <div className="border-b">
                <nav className="flex space-x-8">
                  {activeModels.map((activeModel) => (
                    <button
                      key={activeModel.id}
                      onClick={() => setSelectedModelTab(activeModel.id)}
                      className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm ${
                        selectedModelTab === activeModel.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {getModelStatusIcon(activeModel)}
                      {activeModel.model.name}
                      <Badge variant="outline" className="text-xs">
                        v{activeModel.model.version}
                      </Badge>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeModel(activeModel.id);
                        }}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </button>
                  ))}
                </nav>
              </div>
              
              <div className="pt-6">
                {selectedModelTab && (
                  renderModelComponent(activeModels.find(am => am.id === selectedModelTab)!)
                )}
              </div>
            </div>
          ) : (
            /* Grid Layout */
            <div className="space-y-6">
              {activeModels.map((activeModel) => (
                <div key={activeModel.id} className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getModelStatusIcon(activeModel)}
                      <h3 className="text-lg font-semibold">{activeModel.model.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        v{activeModel.model.version}
                      </Badge>
                      {activeModel.lastCalculated && (
                        <span className="text-xs text-gray-500">
                          Updated {activeModel.lastCalculated.toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleModelExpansion(activeModel.id)}
                      >
                        {activeModel.isExpanded ? (
                          <Minimize2 className="h-4 w-4" />
                        ) : (
                          <Maximize2 className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeModel(activeModel.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className={activeModel.isExpanded ? '' : 'max-h-96 overflow-hidden'}>
                    {renderModelComponent(activeModel)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cross-Model Insights for AI modes */}
          {viewMode !== 'traditional' && activeModels.length > 1 && (
            <Card className="border-l-4 border-l-blue-500 bg-blue-50/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900">Cross-Model Analysis</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">Active Models</div>
                    <div className="text-lg font-semibold">{activeModels.length}</div>
                    <div className="text-xs text-gray-500">
                      {activeModels.filter(am => am.results).length} with results
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">Validation Status</div>
                    <div className="text-lg font-semibold">
                      {activeModels.filter(am => am.results).length >= 2 ? 'Ready' : 'Incomplete'}
                    </div>
                    <div className="text-xs text-gray-500">Cross-validation</div>
                  </div>
                  <div className="p-3 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">AI Insights</div>
                    <div className="text-lg font-semibold">
                      {activeModels.filter(am => am.results).length >= 2 ? '3' : '0'}
                    </div>
                    <div className="text-xs text-gray-500">Available</div>
                  </div>
                </div>
                
                {activeModels.filter(am => am.results).length >= 2 && (
                  <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                    <div className="text-sm font-medium text-blue-900 mb-2">AI Analysis Ready</div>
                    <p className="text-sm text-blue-800 mb-3">
                      Multiple models have been calculated. AI can now provide cross-model validation and recommendations.
                    </p>
                    <Button size="sm" variant="outline">
                      Generate Cross-Model Report
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default ScalableFinancialWorkspace;