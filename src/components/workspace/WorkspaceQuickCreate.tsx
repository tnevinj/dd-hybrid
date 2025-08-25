'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WorkspaceType, WorkspaceQuickCreateOption, WorkspaceCreateRequest } from '@/types/workspace';
import { Plus, Clock, Users, Target, Search, Wand2 } from 'lucide-react';
import { useNavigationStoreRefactored } from '@/stores/navigation-store-refactored';

interface WorkspaceQuickCreateProps {
  onCreateWorkspace: (request: WorkspaceCreateRequest) => void;
  onCancel?: () => void;
}

const quickCreateOptions: WorkspaceQuickCreateOption[] = [
  {
    id: 'screening-standard',
    title: 'Deal Screening',
    description: 'Initial evaluation of investment opportunity with market analysis and financial review',
    type: 'SCREENING',
    templateId: 'screening-standard',
    estimatedDuration: '2-3 days',
    complexity: 'Simple'
  },
  {
    id: 'dd-comprehensive',
    title: 'Due Diligence',
    description: 'Comprehensive due diligence with full financial, legal, and operational analysis',
    type: 'DUE_DILIGENCE',
    templateId: 'dd-comprehensive',
    estimatedDuration: '3-4 weeks',
    complexity: 'Complex'
  },
  {
    id: 'ic-preparation',
    title: 'IC Preparation',
    description: 'Investment committee presentation preparation with recommendation memo',
    type: 'IC_PREPARATION',
    templateId: 'ic-standard',
    estimatedDuration: '1 week',
    complexity: 'Standard'
  },
  {
    id: 'monitoring-quarterly',
    title: 'Portfolio Monitoring',
    description: 'Quarterly portfolio company monitoring and performance tracking',
    type: 'MONITORING',
    templateId: 'monitoring-quarterly',
    estimatedDuration: '3-5 days',
    complexity: 'Simple'
  }
];

export function WorkspaceQuickCreate({ onCreateWorkspace, onCancel }: WorkspaceQuickCreateProps) {
  const { navigationMode } = useNavigationStoreRefactored();
  const [selectedOption, setSelectedOption] = useState<WorkspaceQuickCreateOption | null>(null);
  const [dealName, setDealName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showAIAssistant, setShowAIAssistant] = useState(navigationMode !== 'traditional');

  const handleQuickCreate = (option: WorkspaceQuickCreateOption) => {
    const request: WorkspaceCreateRequest = {
      title: title || `${option.title} - ${dealName || 'New Deal'}`,
      description: description || option.description,
      type: option.type,
      dealName: dealName || undefined,
      templateId: option.templateId,
      tags: [option.complexity.toLowerCase(), option.type.toLowerCase()]
    };
    
    onCreateWorkspace(request);
  };

  const handleCustomCreate = () => {
    if (!selectedOption) return;
    
    const request: WorkspaceCreateRequest = {
      title: title || `${selectedOption.title} - ${dealName || 'New Deal'}`,
      description: description,
      type: selectedOption.type,
      dealName: dealName || undefined,
      templateId: selectedOption.templateId,
      tags: [selectedOption.complexity.toLowerCase(), selectedOption.type.toLowerCase()]
    };
    
    onCreateWorkspace(request);
  };

  const renderAIAssistant = () => {
    if (!showAIAssistant || navigationMode === 'traditional') return null;

    return (
      <Card className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Wand2 className="w-5 h-5 text-blue-600 mt-1" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              🤖 AI Workspace Assistant
              {navigationMode === 'autonomous' && (
                <Badge className="ml-2 bg-blue-100 text-blue-700">Autonomous Mode</Badge>
              )}
            </h3>
            
            {navigationMode === 'assisted' && (
              <div className="space-y-2">
                <div className="p-3 bg-white rounded border border-blue-200">
                  <p className="text-sm text-gray-700">
                    💡 Based on your recent activity, I recommend starting with a <strong>Due Diligence</strong> workspace.
                    You typically handle 3-4 DD projects per quarter.
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => setSelectedOption(quickCreateOptions.find(o => o.type === 'DUE_DILIGENCE') || null)}
                  >
                    Use Recommendation
                  </Button>
                </div>
                
                <div className="p-3 bg-white rounded border border-blue-200">
                  <p className="text-sm text-gray-700">
                    ⚡ I can pre-populate the workspace with your standard templates and team assignments.
                    This saves about 15 minutes of setup time.
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Auto-Configure
                  </Button>
                </div>
              </div>
            )}

            {navigationMode === 'autonomous' && (
              <div className="space-y-2">
                <div className="p-3 bg-white rounded border border-blue-200">
                  <p className="text-sm text-gray-700">
                    🔄 I've automatically selected the Due Diligence template based on your current deal pipeline.
                    The workspace will be configured with your team and standard checklist.
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Review & Confirm
                  </Button>
                </div>
                
                <div className="p-3 bg-white rounded border border-blue-200">
                  <p className="text-sm text-gray-700">
                    📊 I can also set up automated data collection from your existing deal documents.
                    This will populate initial analysis components.
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Enable Automation
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAIAssistant(false)}
          >
            ×
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Create New Workspace</h2>
          <p className="text-gray-600 mt-1">Start with a template or create from scratch</p>
        </div>
        
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>

      {/* AI Assistant */}
      {renderAIAssistant()}

      {/* Quick Deal Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deal Name <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              value={dealName}
              onChange={(e) => setDealName(e.target.value)}
              placeholder="e.g., TechCorp Acquisition"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workspace Title <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Auto-generated based on template"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Additional context or specific requirements"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </Card>

      {/* Quick Create Options */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Template</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {quickCreateOptions.map((option) => (
            <Card 
              key={option.id}
              className={`p-6 cursor-pointer transition-all ${
                selectedOption?.id === option.id 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:shadow-md hover:border-blue-200'
              }`}
              onClick={() => setSelectedOption(option)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    {option.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {option.description}
                  </p>
                </div>
                
                <Badge 
                  className={
                    option.complexity === 'Simple' ? 'bg-green-100 text-green-700' :
                    option.complexity === 'Standard' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }
                >
                  {option.complexity}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{option.estimatedDuration}</span>
                  </div>
                  
                  <Badge variant="outline" className="text-xs">
                    {option.type.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickCreate(option);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Now
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedOption(option);
                  }}
                >
                  Customize
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Custom Creation */}
      {selectedOption && (
        <Card className="p-6 border-blue-200 bg-blue-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Customize "{selectedOption.title}" Workspace
            </h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedOption(null)}
            >
              ×
            </Button>
          </div>
          
          <div className="bg-white p-4 rounded border border-blue-200 mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Template Details</h4>
            <p className="text-sm text-gray-600 mb-2">{selectedOption.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {selectedOption.estimatedDuration}
              </span>
              <Badge className="text-xs">{selectedOption.complexity}</Badge>
              <Badge variant="outline" className="text-xs">
                {selectedOption.type.replace('_', ' ')}
              </Badge>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={handleCustomCreate} className="flex-1">
              Create Workspace
            </Button>
            <Button variant="outline" onClick={() => setSelectedOption(null)}>
              Back to Templates
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}