'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InvestmentWorkspace } from '@/types/workspace';
import { WorkProductType } from '@/types/work-product';
import { 
  FileText,
  Download,
  Eye,
  Settings,
  TrendingUp,
  Shield,
  Calculator,
  PresentationChart,
  Wand2,
  Loader,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { useNavigationStore } from '@/stores/navigation-store';

interface ReportGeneratorProps {
  workspace: InvestmentWorkspace;
  onGenerateReport?: (type: WorkProductType, config: ReportConfig) => void;
  onPreviewReport?: (type: WorkProductType, config: ReportConfig) => void;
}

interface ReportConfig {
  includeExecutiveSummary: boolean;
  includeFinancialAnalysis: boolean;
  includeRiskAssessment: boolean;
  includeMarketAnalysis: boolean;
  includeRecommendations: boolean;
  includeAppendices: boolean;
  dataSourceIds: string[];
  customSections: string[];
  exportFormat: 'PDF' | 'DOCX' | 'HTML';
  template: 'standard' | 'detailed' | 'executive';
}

const reportTypes = [
  {
    type: 'DD_REPORT' as WorkProductType,
    title: 'Due Diligence Report',
    description: 'Comprehensive analysis report combining all workspace findings',
    icon: FileText,
    estimatedTime: '5-10 minutes',
    sections: ['Executive Summary', 'Investment Thesis', 'Financial Analysis', 'Market Analysis', 'Risk Assessment', 'Recommendations'],
    dataSources: ['Financial Analysis', 'Market Research', 'Risk Register', 'Management Interviews'],
    complexity: 'Comprehensive'
  },
  {
    type: 'IC_MEMO' as WorkProductType,
    title: 'Investment Committee Memo',
    description: 'Executive summary and recommendation for investment decision',
    icon: PresentationChart,
    estimatedTime: '3-5 minutes',
    sections: ['Investment Overview', 'Key Highlights', 'Risks & Mitigations', 'Recommendation'],
    dataSources: ['Financial Metrics', 'Risk Assessment', 'Strategic Analysis'],
    complexity: 'Executive'
  },
  {
    type: 'INVESTMENT_SUMMARY' as WorkProductType,
    title: 'Investment Summary',
    description: 'High-level overview with key metrics and rationale',
    icon: TrendingUp,
    estimatedTime: '2-3 minutes',
    sections: ['Overview', 'Financial Highlights', 'Investment Rationale'],
    dataSources: ['Key Metrics', 'Financial Data', 'Market Position'],
    complexity: 'Summary'
  },
  {
    type: 'RISK_ASSESSMENT' as WorkProductType,
    title: 'Risk Assessment Report',
    description: 'Detailed risk analysis with mitigation strategies',
    icon: Shield,
    estimatedTime: '4-6 minutes',
    sections: ['Risk Overview', 'Risk Categories', 'Impact Analysis', 'Mitigation Plans'],
    dataSources: ['Risk Register', 'Industry Analysis', 'Financial Stress Tests'],
    complexity: 'Analytical'
  }
];

export function ReportGenerator({ workspace, onGenerateReport, onPreviewReport }: ReportGeneratorProps) {
  const { navigationMode } = useNavigationStore();
  const [selectedType, setSelectedType] = useState<WorkProductType | null>(null);
  const [config, setConfig] = useState<ReportConfig>({
    includeExecutiveSummary: true,
    includeFinancialAnalysis: true,
    includeRiskAssessment: true,
    includeMarketAnalysis: true,
    includeRecommendations: true,
    includeAppendices: false,
    dataSourceIds: [],
    customSections: [],
    exportFormat: 'PDF',
    template: 'standard'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(navigationMode !== 'traditional');

  const selectedReportType = reportTypes.find(r => r.type === selectedType);

  const handleGenerate = async () => {
    if (!selectedType) return;
    
    setIsGenerating(true);
    try {
      await onGenerateReport?.(selectedType, config);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderAIInsights = () => {
    if (!showAIInsights || navigationMode === 'traditional') return null;

    return (
      <Card className="p-4 mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <div className="flex items-start gap-3">
          <Wand2 className="w-5 h-5 text-emerald-600 mt-1" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-emerald-900 mb-2">
              🤖 AI Report Generator
              {navigationMode === 'autonomous' && <Badge className="ml-2 bg-purple-100 text-purple-700">Autonomous</Badge>}
            </h3>
            
            {navigationMode === 'assisted' && (
              <div className="space-y-2">
                <div className="p-3 bg-white rounded border border-emerald-200">
                  <p className="text-sm text-gray-700">
                    💡 I recommend starting with a <strong>Due Diligence Report</strong> based on your workspace progress (65% complete).
                    I can populate it with all your existing analysis and findings.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedType('DD_REPORT')}
                    >
                      Select DD Report
                    </Button>
                    <Button size="sm" variant="ghost">View Data Sources</Button>
                  </div>
                </div>
                
                <div className="p-3 bg-white rounded border border-emerald-200">
                  <p className="text-sm text-gray-700">
                    ⚡ I can generate multiple reports simultaneously and ensure consistency across all documents.
                    Recommended: DD Report + Risk Assessment + IC Memo.
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">Generate Report Suite</Button>
                </div>
              </div>
            )}

            {navigationMode === 'autonomous' && (
              <div className="space-y-2">
                <div className="p-3 bg-white rounded border border-purple-200">
                  <p className="text-sm text-gray-700">
                    🔄 I've automatically selected optimal report configurations based on your workspace data.
                    Ready to generate: Due Diligence Report (recommended), Risk Assessment (supplementary).
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">Auto-Generate Reports</Button>
                </div>
                
                <div className="p-3 bg-white rounded border border-purple-200">
                  <p className="text-sm text-gray-700">
                    📊 All reports will be continuously updated as you add new evidence and analysis.
                    Current data completeness: 85% financial, 70% market, 90% risk.
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">Enable Auto-Updates</Button>
                </div>
              </div>
            )}
          </div>
          
          <Button variant="ghost" size="sm" onClick={() => setShowAIInsights(false)}>×</Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Generate Reports</h2>
          <p className="text-gray-600 mt-1">Create professional reports from your workspace data</p>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>{workspace.completedComponents}/{workspace.totalComponents} components complete</span>
        </div>
      </div>

      {renderAIInsights()}

      {/* Report Type Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Report Type</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {reportTypes.map((reportType) => {
            const Icon = reportType.icon;
            const isSelected = selectedType === reportType.type;
            
            return (
              <Card 
                key={reportType.type}
                className={`p-6 cursor-pointer transition-all ${
                  isSelected 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:shadow-md hover:border-blue-200'
                }`}
                onClick={() => setSelectedType(reportType.type)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <Icon className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        {reportType.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {reportType.description}
                      </p>
                    </div>
                  </div>
                  
                  <Badge className={
                    reportType.complexity === 'Summary' ? 'bg-green-100 text-green-700' :
                    reportType.complexity === 'Executive' ? 'bg-yellow-100 text-yellow-700' :
                    reportType.complexity === 'Analytical' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }>
                    {reportType.complexity}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 mb-2">INCLUDES:</h5>
                    <div className="flex flex-wrap gap-1">
                      {reportType.sections.slice(0, 3).map((section, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {section}
                        </Badge>
                      ))}
                      {reportType.sections.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{reportType.sections.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 mb-2">DATA SOURCES:</h5>
                    <div className="flex flex-wrap gap-1">
                      {reportType.dataSources.slice(0, 2).map((source, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                          {source}
                        </Badge>
                      ))}
                      {reportType.dataSources.length > 2 && (
                        <Badge variant="outline" className="text-xs bg-gray-50">
                          +{reportType.dataSources.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{reportType.estimatedTime}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreviewReport?.(reportType.type, config);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedType(reportType.type);
                      }}
                    >
                      Select
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Configuration Panel */}
      {selectedType && (
        <Card className="p-6 border-blue-200 bg-blue-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Configure "{selectedReportType?.title}"
            </h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedType(null)}
            >
              ×
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Content Sections */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Content Sections</h4>
              
              <div className="space-y-2">
                {[
                  { key: 'includeExecutiveSummary', label: 'Executive Summary', required: true },
                  { key: 'includeFinancialAnalysis', label: 'Financial Analysis' },
                  { key: 'includeRiskAssessment', label: 'Risk Assessment' },
                  { key: 'includeMarketAnalysis', label: 'Market Analysis' },
                  { key: 'includeRecommendations', label: 'Recommendations', required: true },
                  { key: 'includeAppendices', label: 'Appendices' }
                ].map(({ key, label, required }) => (
                  <label key={key} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={config[key as keyof ReportConfig] as boolean}
                      onChange={(e) => setConfig(prev => ({ ...prev, [key]: e.target.checked }))}
                      disabled={required}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                    {required && <Badge variant="outline" className="text-xs">Required</Badge>}
                  </label>
                ))}
              </div>
            </div>
            
            {/* Format & Template */}
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Export Format</h4>
                <div className="space-y-2">
                  {[
                    { value: 'PDF', label: 'PDF Document' },
                    { value: 'DOCX', label: 'Word Document' },
                    { value: 'HTML', label: 'Web Document' }
                  ].map(({ value, label }) => (
                    <label key={value} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="exportFormat"
                        value={value}
                        checked={config.exportFormat === value}
                        onChange={(e) => setConfig(prev => ({ ...prev, exportFormat: e.target.value as any }))}
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Template Style</h4>
                <div className="space-y-2">
                  {[
                    { value: 'standard', label: 'Standard Template', description: 'Professional format with all sections' },
                    { value: 'detailed', label: 'Detailed Template', description: 'Comprehensive with charts and tables' },
                    { value: 'executive', label: 'Executive Template', description: 'Concise format for leadership' }
                  ].map(({ value, label, description }) => (
                    <label key={value} className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="template"
                        value={value}
                        checked={config.template === value}
                        onChange={(e) => setConfig(prev => ({ ...prev, template: e.target.value as any }))}
                        className="mt-1"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-700">{label}</span>
                        <p className="text-xs text-gray-500">{description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 pt-4 border-t">
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Generate Report
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => onPreviewReport?.(selectedType, config)}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            
            <Button 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Advanced
            </Button>
          </div>
        </Card>
      )}

      {/* Data Completeness */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Completeness</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { category: 'Financial Analysis', completion: 85, color: 'bg-green-500' },
            { category: 'Market Analysis', completion: 70, color: 'bg-yellow-500' },
            { category: 'Risk Assessment', completion: 90, color: 'bg-green-500' },
            { category: 'Management Review', completion: 45, color: 'bg-red-500' }
          ].map(({ category, completion, color }) => (
            <div key={category} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{category}</span>
                <span className="text-xs text-gray-500">{completion}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${color} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${completion}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        
        <p className="text-sm text-gray-600 mt-4">
          Higher completion percentages result in more comprehensive and accurate reports.
        </p>
      </Card>
    </div>
  );
}