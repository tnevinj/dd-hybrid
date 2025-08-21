'use client';

import React, { useState, useCallback } from 'react';
import { ContentAssembler } from './ContentAssembler';
import { TemplatePicker } from './TemplatePicker';
import { DataIntegrationService } from '@/lib/services/data-integration-service';
import { 
  SmartTemplate,
  ProjectContext,
  WorkProduct,
  ContentGenerationRequest 
} from '@/types/work-product';
import { useNavigationStoreRefactored } from '@/stores/navigation-store-refactored';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Database,
  Sparkles,
  Clock,
  TrendingUp
} from 'lucide-react';

interface ContentTransformationWorkflowProps {
  projectContext: ProjectContext;
  onSave: (workProduct: WorkProduct) => void;
  onCancel: () => void;
  initialTemplate?: SmartTemplate;
  className?: string;
}

type WorkflowStep = 'template-selection' | 'data-integration' | 'content-assembly' | 'validation';

interface DataIntegrationStatus {
  isComplete: boolean;
  quality: number;
  completeness: number;
  sources: string[];
  warnings: string[];
  lastUpdated: Date;
}

export function ContentTransformationWorkflow({
  projectContext,
  onSave,
  onCancel,
  initialTemplate,
  className = ''
}: ContentTransformationWorkflowProps) {
  const { currentMode } = useNavigationStoreRefactored();
  const navigationMode = currentMode?.mode || 'traditional';

  // Workflow state
  const [currentStep, setCurrentStep] = useState<WorkflowStep>(
    initialTemplate ? 'data-integration' : 'template-selection'
  );
  const [selectedTemplate, setSelectedTemplate] = useState<SmartTemplate | undefined>(initialTemplate);
  const [dataIntegrationStatus, setDataIntegrationStatus] = useState<DataIntegrationStatus | null>(null);
  const [isIntegratingData, setIsIntegratingData] = useState(false);

  // Handle template selection
  const handleTemplateSelect = useCallback(async (template: SmartTemplate) => {
    setSelectedTemplate(template);
    setCurrentStep('data-integration');
    
    // Start data integration process
    await initializeDataIntegration(template);
  }, [projectContext]);

  // Initialize data integration for the selected template
  const initializeDataIntegration = useCallback(async (template: SmartTemplate) => {
    setIsIntegratingData(true);
    
    try {
      // Integrate data using the DataIntegrationService
      const integrationResult = await DataIntegrationService.integrateProjectData(projectContext);
      
      setDataIntegrationStatus({
        isComplete: true,
        quality: integrationResult.metadata.dataQuality,
        completeness: integrationResult.metadata.completeness,
        sources: integrationResult.metadata.sources,
        warnings: integrationResult.metadata.dataQuality < 0.7 
          ? ['Some data sources may be incomplete. Content quality may be affected.']
          : [],
        lastUpdated: integrationResult.metadata.lastUpdated
      });

      // Auto-advance to content assembly if data quality is good
      if (integrationResult.metadata.dataQuality >= 0.7) {
        setTimeout(() => setCurrentStep('content-assembly'), 1500);
      }

    } catch (error) {
      console.error('Data integration failed:', error);
      setDataIntegrationStatus({
        isComplete: false,
        quality: 0.3,
        completeness: 0.3,
        sources: ['fallback'],
        warnings: [
          'Unable to connect to some data sources.',
          'Content will be generated with limited data context.'
        ],
        lastUpdated: new Date()
      });
    } finally {
      setIsIntegratingData(false);
    }
  }, [projectContext]);

  // Handle template change from ContentAssembler
  const handleTemplateChange = useCallback(() => {
    setCurrentStep('template-selection');
    setDataIntegrationStatus(null);
  }, []);

  // Handle proceeding to content assembly manually
  const handleProceedToAssembly = useCallback(() => {
    setCurrentStep('content-assembly');
  }, []);

  // Handle going back to previous step
  const handleGoBack = useCallback(() => {
    switch (currentStep) {
      case 'data-integration':
        setCurrentStep('template-selection');
        setDataIntegrationStatus(null);
        break;
      case 'content-assembly':
        setCurrentStep('data-integration');
        break;
      case 'validation':
        setCurrentStep('content-assembly');
        break;
    }
  }, [currentStep]);

  // Render step indicator
  const renderStepIndicator = () => {
    const steps = [
      { id: 'template-selection', name: 'Template', icon: Sparkles },
      { id: 'data-integration', name: 'Data', icon: Database },
      { id: 'content-assembly', name: 'Assembly', icon: TrendingUp },
    ];

    return (
      <div className="flex items-center justify-center mb-6">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
          const IconComponent = step.icon;

          return (
            <React.Fragment key={step.id}>
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                isActive 
                  ? 'bg-blue-100 text-blue-700'
                  : isCompleted 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
              }`}>
                <IconComponent className="w-4 h-4" />
                <span className="text-sm font-medium">{step.name}</span>
                {isCompleted && <CheckCircle className="w-4 h-4" />}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-px ${
                  isCompleted ? 'bg-green-300' : 'bg-gray-300'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  // Render template selection step
  const renderTemplateSelection = () => (
    <TemplatePicker
      projectContext={projectContext}
      onTemplateSelect={handleTemplateSelect}
      onCancel={onCancel}
    />
  );

  // Render data integration step
  const renderDataIntegration = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Data Integration</h1>
        <p className="text-gray-600">
          Connecting to real project data for accurate content generation
        </p>
      </div>

      {selectedTemplate && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedTemplate.name}</h3>
                <p className="text-gray-600">{selectedTemplate.description}</p>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {selectedTemplate.sections.length} sections
              </Badge>
            </div>

            {/* Data Integration Progress */}
            {isIntegratingData && (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Integrating Data Sources</h3>
                <p className="text-gray-600">Connecting to project database, financial models, and team data...</p>
              </div>
            )}

            {/* Data Integration Results */}
            {dataIntegrationStatus && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {Math.round(dataIntegrationStatus.quality * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Data Quality</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {Math.round(dataIntegrationStatus.completeness * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Completeness</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {dataIntegrationStatus.sources.length}
                    </div>
                    <div className="text-sm text-gray-600">Data Sources</div>
                  </div>
                </div>

                {/* Data Sources */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Connected Data Sources:</h4>
                  <div className="flex flex-wrap gap-2">
                    {dataIntegrationStatus.sources.map(source => (
                      <Badge key={source} variant="outline" className="text-xs">
                        {source.replace('-', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Warnings */}
                {dataIntegrationStatus.warnings.length > 0 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800 mb-1">Data Integration Warnings</h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          {dataIntegrationStatus.warnings.map((warning, index) => (
                            <li key={index}>• {warning}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success Status */}
                {dataIntegrationStatus.quality >= 0.7 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <h4 className="font-medium text-green-800">Data Integration Complete</h4>
                        <p className="text-sm text-green-700">
                          Ready to generate high-quality content with real project data.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleGoBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Templates
        </Button>
        
        {dataIntegrationStatus && (
          <Button 
            onClick={handleProceedToAssembly}
            disabled={isIntegratingData}
          >
            {dataIntegrationStatus.quality >= 0.7 ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Continue to Assembly
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 mr-2" />
                Continue (Limited Data)
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );

  // Render content assembly step
  const renderContentAssembly = () => (
    <>
      {selectedTemplate && (
        <ContentAssembler
          template={selectedTemplate}
          projectContext={projectContext}
          onSave={onSave}
          onCancel={() => {
            if (currentStep === 'content-assembly' && navigationMode !== 'traditional') {
              handleGoBack();
            } else {
              onCancel();
            }
          }}
          onTemplateChange={handleTemplateChange}
          className={className}
        />
      )}
    </>
  );

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Step Indicator - only show for non-traditional modes */}
      {navigationMode !== 'traditional' && currentStep !== 'content-assembly' && renderStepIndicator()}

      {/* Step Content */}
      {currentStep === 'template-selection' && renderTemplateSelection()}
      {currentStep === 'data-integration' && renderDataIntegration()}
      {currentStep === 'content-assembly' && renderContentAssembly()}
    </div>
  );
}

export default ContentTransformationWorkflow;