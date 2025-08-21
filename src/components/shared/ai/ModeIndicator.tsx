'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Brain, 
  Bot, 
  Settings, 
  Info,
  Sparkles
} from 'lucide-react';
import type { HybridMode } from '@/components/shared/HybridModeSwitcher';

interface ModeIndicatorProps {
  currentMode: HybridMode;
  onModeChange?: (mode: HybridMode) => void;
  showDescription?: boolean;
  showFeatures?: boolean;
  compact?: boolean;
  className?: string;
}

const getModeConfig = (mode: HybridMode) => {
  switch (mode) {
    case 'traditional':
      return {
        icon: User,
        label: "I'll Drive",
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        description: 'Full manual control with traditional workflows',
        features: ['Manual task execution', 'Traditional workflows', 'Complete user control']
      };
    case 'assisted':
      return {
        icon: Brain,
        label: 'Help me Drive',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        description: 'AI-enhanced workflows with intelligent recommendations',
        features: ['AI recommendations', 'Smart automation', 'Enhanced insights']
      };
    case 'autonomous':
      return {
        icon: Bot,
        label: 'You Drive',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        description: 'AI handles operations with approval for key decisions',
        features: ['Autonomous execution', 'Intelligent workflow routing', 'Conversational interface']
      };
    default:
      return {
        icon: User,
        label: "I'll Drive",
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        description: 'Traditional mode',
        features: []
      };
  }
};

const getAICapabilityLevel = (mode: HybridMode): number => {
  switch (mode) {
    case 'traditional': return 1;
    case 'assisted': return 3;
    case 'autonomous': return 5;
    default: return 1;
  }
};

export function ModeIndicator({
  currentMode,
  onModeChange,
  showDescription = true,
  showFeatures = false,
  compact = false,
  className = ''
}: ModeIndicatorProps) {
  const config = getModeConfig(currentMode);
  const IconComponent = config.icon;
  const aiLevel = getAICapabilityLevel(currentMode);

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Badge 
          variant="outline" 
          className={`${config.color} ${config.borderColor} ${config.bgColor}`}
        >
          <IconComponent className="h-3 w-3 mr-1" />
          {config.label}
        </Badge>
        {currentMode !== 'traditional' && (
          <div className="flex items-center space-x-1">
            <Sparkles className="h-3 w-3 text-blue-500" />
            <span className="text-xs text-blue-600">AI Active</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className={`${config.borderColor} border-2 ${className}`}>
      <CardContent className={`p-4 ${config.bgColor}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-white border ${config.borderColor}`}>
              <IconComponent className={`h-5 w-5 ${config.color}`} />
            </div>
            <div>
              <h3 className={`font-semibold ${config.color}`}>
                {config.label}
              </h3>
              <p className="text-sm text-gray-600">Current Mode</p>
            </div>
          </div>
          {onModeChange && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Cycle through modes
                const modes: HybridMode[] = ['traditional', 'assisted', 'autonomous'];
                const currentIndex = modes.indexOf(currentMode);
                const nextIndex = (currentIndex + 1) % modes.length;
                onModeChange(modes[nextIndex]);
              }}
            >
              <Settings className="h-4 w-4 mr-1" />
              Change
            </Button>
          )}
        </div>

        {showDescription && (
          <p className="text-sm text-gray-700 mb-3">
            {config.description}
          </p>
        )}

        {/* AI Capability Level */}
        {currentMode !== 'traditional' && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>AI Assistance Level</span>
              <span>{aiLevel}/5</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  aiLevel >= 4 ? 'bg-green-500' : 
                  aiLevel >= 2 ? 'bg-blue-500' : 'bg-gray-400'
                }`}
                style={{ width: `${(aiLevel / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {showFeatures && config.features.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center space-x-1 text-xs text-gray-600 mb-2">
              <Info className="h-3 w-3" />
              <span>Active Features</span>
            </div>
            <div className="grid gap-1">
              {config.features.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center text-xs text-gray-600">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mr-2 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mode-specific indicators */}
        {currentMode === 'autonomous' && (
          <div className="mt-3 flex items-center space-x-1 text-xs text-green-600">
            <Bot className="h-3 w-3" />
            <span>AI is actively managing workflows</span>
          </div>
        )}
        
        {currentMode === 'assisted' && (
          <div className="mt-3 flex items-center space-x-1 text-xs text-purple-600">
            <Brain className="h-3 w-3" />
            <span>AI recommendations available</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}