'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock,
  Play,
  Pause,
  RotateCcw,
  Info
} from 'lucide-react';

interface ChatAction {
  id: string;
  type: 'execute' | 'view' | 'analyze' | 'generate' | 'update';
  label: string;
  description?: string;
  data?: any;
  estimatedTime?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  prerequisites?: string[];
  impacts?: string[];
}

interface ActionConfirmationProps {
  action: ChatAction;
  onConfirm: (action: ChatAction) => void;
  onCancel: () => void;
  isExecuting?: boolean;
  className?: string;
}

export function ActionConfirmation({ 
  action, 
  onConfirm, 
  onCancel, 
  isExecuting = false,
  className = '' 
}: ActionConfirmationProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getRiskColor = (level?: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'execute': return Play;
      case 'analyze': return Info;
      case 'generate': return CheckCircle;
      case 'update': return RotateCcw;
      default: return CheckCircle;
    }
  };

  const ActionIcon = getActionIcon(action.type);

  return (
    <Card className={`border-l-4 border-l-blue-500 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <ActionIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-base font-medium text-gray-900">
                Confirm Action
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {action.label}
              </p>
            </div>
          </div>
          
          {action.riskLevel && (
            <Badge className={`${getRiskColor(action.riskLevel)} border`}>
              {action.riskLevel} risk
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Action Description */}
        {action.description && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{action.description}</p>
          </div>
        )}

        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-4">
          {action.estimatedTime && (
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-xs text-gray-500">Estimated Time</div>
                <div className="text-sm font-medium">{action.estimatedTime}</div>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {action.type}
            </Badge>
          </div>
        </div>

        {/* Details Toggle */}
        {(action.prerequisites || action.impacts) && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>

            {showDetails && (
              <div className="mt-3 space-y-3">
                {/* Prerequisites */}
                {action.prerequisites && action.prerequisites.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1" />
                      Prerequisites
                    </h4>
                    <ul className="space-y-1">
                      {action.prerequisites.map((prereq, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 mt-2 flex-shrink-0" />
                          {prereq}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Expected Impacts */}
                {action.impacts && action.impacts.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <Info className="w-4 h-4 text-blue-500 mr-1" />
                      Expected Impact
                    </h4>
                    <ul className="space-y-1">
                      {action.impacts.map((impact, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 mt-2 flex-shrink-0" />
                          {impact}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Risk Warning */}
        {action.riskLevel === 'high' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-900">High Risk Action</h4>
                <p className="text-sm text-red-700 mt-1">
                  This action may have significant impacts. Please review carefully before proceeding.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-2">
          <Button
            onClick={() => onConfirm(action)}
            disabled={isExecuting}
            className="flex-1"
          >
            {isExecuting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Executing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm & Execute
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isExecuting}
            className="flex-1"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>

        {/* Execution Status */}
        {isExecuting && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-blue-700">
                Executing action... This may take a moment.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}