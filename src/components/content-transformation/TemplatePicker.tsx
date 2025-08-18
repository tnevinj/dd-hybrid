'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  SmartTemplate,
  ProjectContext,
  WorkProductType 
} from '@/types/work-product';
import { 
  SMART_TEMPLATES,
  getTemplatesByCategory,
  getTemplatesByIndustry,
  getTemplatesByStage
} from '@/lib/templates/smart-templates';
import {
  FileText,
  TrendingUp,
  Shield,
  Calculator,
  Briefcase,
  Building,
  Star,
  Clock,
  Users,
  CheckCircle,
  Search,
  Filter,
  Sparkles
} from 'lucide-react';

interface TemplatePickerProps {
  projectContext: ProjectContext;
  onTemplateSelect: (template: SmartTemplate) => void;
  onCancel: () => void;
  className?: string;
}

interface TemplateFilter {
  category?: string;
  industry?: string;
  stage?: string;
  search?: string;
}

export function TemplatePicker({
  projectContext,
  onTemplateSelect,
  onCancel,
  className = ''
}: TemplatePickerProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<SmartTemplate | null>(null);
  const [filteredTemplates, setFilteredTemplates] = useState<SmartTemplate[]>(SMART_TEMPLATES);
  const [filters, setFilters] = useState<TemplateFilter>({});
  const [showFilters, setShowFilters] = useState(false);

  // Auto-filter templates based on project context
  useEffect(() => {
    let templates = [...SMART_TEMPLATES];

    // Apply context-based filters
    if (projectContext.sector) {
      const industryTemplates = getTemplatesByIndustry(projectContext.sector);
      if (industryTemplates.length > 0) {
        templates = industryTemplates;
      }
    }

    if (projectContext.stage) {
      const stageTemplates = getTemplatesByStage(projectContext.stage);
      if (stageTemplates.length > 0) {
        templates = templates.filter(t => stageTemplates.includes(t));
      }
    }

    // Apply manual filters
    if (filters.category) {
      templates = templates.filter(t => t.category === filters.category);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      templates = templates.filter(t => 
        t.name.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    setFilteredTemplates(templates);

    // Auto-select best template for context
    if (templates.length > 0 && !selectedTemplate) {
      // Prioritize templates that match both sector and stage
      const perfectMatch = templates.find(t => 
        t.industryFocus.includes(projectContext.sector || '') &&
        t.dealStages.includes(projectContext.stage || '')
      );
      
      if (perfectMatch) {
        setSelectedTemplate(perfectMatch);
      } else {
        // Fall back to highest success rate template
        const bestTemplate = templates.reduce((best, current) => 
          current.successRate > best.successRate ? current : best
        );
        setSelectedTemplate(bestTemplate);
      }
    }
  }, [projectContext, filters, selectedTemplate]);

  const handleFilterChange = (key: keyof TemplateFilter, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === prev[key] ? undefined : value
    }));
  };

  const getTemplateIcon = (workProductType: WorkProductType) => {
    switch (workProductType) {
      case 'DD_REPORT': return Shield;
      case 'IC_MEMO': return Briefcase;
      case 'MARKET_ANALYSIS': return TrendingUp;
      case 'FINANCIAL_MODEL': return Calculator;
      case 'INVESTMENT_SUMMARY': return Building;
      default: return FileText;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'due-diligence': return 'bg-red-50 text-red-700 border-red-200';
      case 'investment-memo': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'financial-analysis': return 'bg-green-50 text-green-700 border-green-200';
      case 'risk-assessment': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 0.9) return 'text-green-600';
    if (rate >= 0.8) return 'text-blue-600';
    if (rate >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRecommendationScore = (template: SmartTemplate): number => {
    let score = 0;
    
    // Industry match
    if (template.industryFocus.includes(projectContext.sector || '')) score += 40;
    if (template.industryFocus.includes('All')) score += 20;
    
    // Stage match
    if (template.dealStages.includes(projectContext.stage || '')) score += 30;
    
    // Success rate
    score += template.successRate * 20;
    
    // Quality score
    score += template.averageQualityScore * 10;

    return Math.min(score, 100);
  };

  const sortedTemplates = filteredTemplates.sort((a, b) => {
    const scoreA = getRecommendationScore(a);
    const scoreB = getRecommendationScore(b);
    return scoreB - scoreA;
  });

  return (
    <div className={`max-w-6xl mx-auto p-6 ${className}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Choose Document Template</h1>
        <p className="text-gray-600">
          Select a smart template optimized for {projectContext.projectName} ({projectContext.sector})
        </p>
      </div>

      {/* Project Context Card */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900">{projectContext.projectName}</h3>
              <div className="flex items-center space-x-4 text-sm text-blue-700 mt-1">
                <span>{projectContext.sector}</span>
                {projectContext.dealValue && (
                  <>
                    <span>•</span>
                    <span>${(projectContext.dealValue / 1000000).toFixed(1)}M</span>
                  </>
                )}
                {projectContext.stage && (
                  <>
                    <span>•</span>
                    <span>{projectContext.stage.replace('-', ' ')}</span>
                  </>
                )}
                {projectContext.geography && (
                  <>
                    <span>•</span>
                    <span>{projectContext.geography}</span>
                  </>
                )}
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Matched Templates
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search templates..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-gray-100' : ''}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <Card className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                <div className="space-y-2">
                  {Array.from(new Set(SMART_TEMPLATES.map(t => t.category))).map(category => (
                    <button
                      key={category}
                      onClick={() => handleFilterChange('category', category)}
                      className={`text-left px-3 py-2 rounded-md text-sm w-full transition-colors ${
                        filters.category === category
                          ? 'bg-blue-100 text-blue-900'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {category.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Industry Focus</label>
                <div className="space-y-2">
                  {Array.from(new Set(SMART_TEMPLATES.flatMap(t => t.industryFocus))).map(industry => (
                    <button
                      key={industry}
                      onClick={() => handleFilterChange('industry', industry)}
                      className={`text-left px-3 py-2 rounded-md text-sm w-full transition-colors ${
                        filters.industry === industry
                          ? 'bg-blue-100 text-blue-900'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {industry}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Deal Stage</label>
                <div className="space-y-2">
                  {Array.from(new Set(SMART_TEMPLATES.flatMap(t => t.dealStages))).map(stage => (
                    <button
                      key={stage}
                      onClick={() => handleFilterChange('stage', stage)}
                      className={`text-left px-3 py-2 rounded-md text-sm w-full transition-colors ${
                        filters.stage === stage
                          ? 'bg-blue-100 text-blue-900'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {stage.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {sortedTemplates.map((template) => {
          const IconComponent = getTemplateIcon(template.workProductType);
          const recommendationScore = getRecommendationScore(template);
          const isSelected = selectedTemplate?.id === template.id;
          const isRecommended = recommendationScore >= 80;

          return (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all relative ${
                isSelected 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:shadow-md border-gray-200'
              }`}
              onClick={() => setSelectedTemplate(template)}
            >
              {isRecommended && (
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full p-2">
                  <Star className="w-4 h-4" />
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <IconComponent className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <Badge className={`text-xs ${getCategoryColor(template.category)}`}>
                        {template.category.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {template.sections.length}
                    </div>
                    <div className="text-xs text-gray-500">Sections</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-semibold ${getSuccessRateColor(template.successRate)}`}>
                      {Math.round(template.successRate * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">Success Rate</div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    Avg. {Math.ceil(template.sections.reduce((sum, s) => sum + (s.estimatedLength || 0), 0) / 200)} min to complete
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Users className="w-3 h-3 mr-1" />
                    Used {template.usageCount} times
                  </div>
                  {isRecommended && (
                    <div className="flex items-center text-xs text-yellow-600 font-medium">
                      <Star className="w-3 h-3 mr-1" />
                      {recommendationScore}% match for your project
                    </div>
                  )}
                </div>

                {/* Template tags */}
                <div className="flex flex-wrap gap-1">
                  {template.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {template.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{template.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search terms.
            </p>
            <Button
              variant="outline"
              onClick={() => setFilters({})}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Selected Template Details */}
      {selectedTemplate && (
        <Card className="mb-6 bg-gray-50">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Template Preview</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Sections ({selectedTemplate.sections.length})</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedTemplate.sections.map((section, index) => (
                    <div key={section.id} className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-500">{index + 1}.</span>
                      <span className="text-gray-900">{section.title}</span>
                      {section.required && (
                        <Badge variant="outline" className="text-xs">Required</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Data Integration</h4>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    • Real-time data from {selectedTemplate.dataIntegrationPoints.length} sources
                  </div>
                  <div className="text-sm text-gray-600">
                    • Automated content generation with {selectedTemplate.sections.filter(s => s.generationStrategy === 'data-driven').length} data-driven sections
                  </div>
                  <div className="text-sm text-gray-600">
                    • {selectedTemplate.contentValidationRules.length} quality validation rules
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() => selectedTemplate && onTemplateSelect(selectedTemplate)}
          disabled={!selectedTemplate}
          className="min-w-32"
        >
          {selectedTemplate ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Use This Template
            </>
          ) : (
            'Select a Template'
          )}
        </Button>
      </div>
    </div>
  );
}

export default TemplatePicker;