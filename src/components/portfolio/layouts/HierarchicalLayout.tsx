'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ModuleGroup, ModuleConfig } from '@/lib/portfolio-modules';

// Dynamic module component imports
const moduleComponents = {
  PortfolioOverview: React.lazy(() => import('../common/PortfolioOverview').then(m => ({ default: m.PortfolioOverview }))),
  PortfolioPerformance: React.lazy(() => import('../common/PortfolioPerformance').then(m => ({ default: m.PortfolioPerformance }))),
  VirtualizedAssetGrid: React.lazy(() => import('../common/VirtualizedAssetGrid').then(m => ({ default: m.VirtualizedAssetGrid }))),
  ProfessionalAnalytics: React.lazy(() => import('../common/ProfessionalAnalytics').then(m => ({ default: m.ProfessionalAnalytics }))),
  ProfessionalReporting: React.lazy(() => import('../common/ProfessionalReporting').then(m => ({ default: m.ProfessionalReporting }))),
  RiskManagement: React.lazy(() => import('../common/RiskManagement').then(m => ({ default: m.RiskManagement }))),
  PortfolioOptimization: React.lazy(() => import('../common/PortfolioOptimization').then(m => ({ default: m.PortfolioOptimization }))),
  MarketIntelligence: React.lazy(() => import('../common/MarketIntelligence').then(m => ({ default: m.MarketIntelligence }))),
  CapitalManagement: React.lazy(() => import('../common/CapitalManagement').then(m => ({ default: m.CapitalManagement }))),
  TeamCollaboration: React.lazy(() => import('../common/TeamCollaboration').then(m => ({ default: m.TeamCollaboration }))),
  CustomDashboard: React.lazy(() => import('../common/CustomDashboard').then(m => ({ default: m.CustomDashboard }))),
  TraditionalAssetsView: React.lazy(() => import('../asset-types/TraditionalAssetsView').then(m => ({ default: m.TraditionalAssetsView }))),
  RealEstateAssetsView: React.lazy(() => import('../asset-types/RealEstateAssetsView').then(m => ({ default: m.RealEstateAssetsView }))),
  InfrastructureAssetsView: React.lazy(() => import('../asset-types/InfrastructureAssetsView').then(m => ({ default: m.InfrastructureAssetsView }))),
};

interface HierarchicalLayoutProps {
  groups: ModuleGroup[];
  onViewAsset?: (assetId: string) => void;
  onEditAsset?: (assetId: string) => void;
  onCreateAsset?: () => void;
  className?: string;
}

interface ModuleGroupCardProps {
  group: ModuleGroup;
  onViewAsset?: (assetId: string) => void;
  onEditAsset?: (assetId: string) => void;
  onCreateAsset?: () => void;
}

function ModuleGroupCard({ group, onViewAsset, onEditAsset, onCreateAsset }: ModuleGroupCardProps) {
  const [isOpen, setIsOpen] = useState(group.defaultOpen ?? true);
  const [activeModule, setActiveModule] = useState<string | null>(
    group.modules.length > 0 ? group.modules[0].id : null
  );

  const toggleOpen = () => {
    if (group.collapsible) {
      setIsOpen(!isOpen);
    }
  };

  const renderModule = (module: ModuleConfig) => {
    const ModuleComponent = moduleComponents[module.component as keyof typeof moduleComponents];
    
    if (!ModuleComponent) {
      return (
        <div className="p-4 text-center text-gray-500">
          Module "{module.component}" not found
        </div>
      );
    }

    return (
      <React.Suspense 
        fallback={
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-500">Loading {module.label}...</p>
          </div>
        }
      >
        <ModuleComponent
          onViewAsset={onViewAsset}
          onEditAsset={onEditAsset}
          onCreateAsset={onCreateAsset}
        />
      </React.Suspense>
    );
  };

  return (
    <Card className="mb-6">
      <CardHeader className={`${group.collapsible ? 'cursor-pointer' : ''} pb-3`} onClick={toggleOpen}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{group.icon}</span>
            <div>
              <CardTitle className="text-lg">{group.title}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {group.modules.length} module{group.modules.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {group.modules.some(m => m.aiFeatures) && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                AI-Enhanced
              </Badge>
            )}
            {group.collapsible && (
              <Button variant="ghost" size="sm">
                {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="pt-0">
          {group.modules.length === 1 ? (
            // Single module - render directly
            <div className="border-t pt-4">
              {renderModule(group.modules[0])}
            </div>
          ) : (
            // Multiple modules - render with tabs
            <div className="border-t pt-4">
              <div className="flex flex-wrap gap-2 mb-4 border-b">
                {group.modules.map(module => (
                  <button
                    key={module.id}
                    onClick={() => setActiveModule(module.id)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeModule === module.id
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{module.icon}</span>
                    {module.label}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                {group.modules
                  .filter(module => module.id === activeModule)
                  .map(module => (
                    <div key={module.id}>
                      {module.description && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
                          <p className="text-sm text-gray-600">{module.description}</p>
                          {module.aiFeatures && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {module.aiFeatures.map(feature => (
                                <Badge key={feature} variant="outline" className="text-xs">
                                  {feature.replace('-', ' ')}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      {renderModule(module)}
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export function HierarchicalLayout({ 
  groups, 
  onViewAsset, 
  onEditAsset, 
  onCreateAsset, 
  className = "" 
}: HierarchicalLayoutProps) {
  if (groups.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No modules available</h3>
          <p className="text-gray-500">No modules are configured for this mode.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {groups.map(group => (
        <ModuleGroupCard
          key={group.id}
          group={group}
          onViewAsset={onViewAsset}
          onEditAsset={onEditAsset}
          onCreateAsset={onCreateAsset}
        />
      ))}
    </div>
  );
}

export default HierarchicalLayout;