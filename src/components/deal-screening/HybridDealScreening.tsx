import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigationStore } from '@/stores/navigation-store';
import { UserNavigationMode } from '@/types/navigation';
import {
  List,
  Brain,
  Bot,
  Settings,
  HelpCircle,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';

import DealScreeningTraditional from './DealScreeningTraditional';
import DealScreeningAssisted from './DealScreeningAssisted';
import DealScreeningAutonomous from './DealScreeningAutonomous';
import { 
  ErrorBoundary, 
  HybridModeHeader, 
  HybridModeExplanation,
  type HybridMode 
} from '@/components/shared';
import { ModeNotification } from '@/components/ui/mode-notification';

import { 
  DealOpportunity, 
  AIRecommendation, 
  AutomatedAction, 
  PendingApproval,
  DealScreeningAIState
} from '@/types/deal-screening';


// New Opportunity Dialog
const NewOpportunityDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onCreate: (opportunity: Partial<DealOpportunity>) => void;
}> = ({ open, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    seller: '',
    assetType: 'fund' as const,
    vintage: '',
    sector: '',
    geography: '',
    askPrice: 0,
    navPercentage: 0,
    expectedIRR: 0,
    expectedMultiple: 0,
  });

  const handleSubmit = () => {
    onCreate(formData);
    onClose();
    // Reset form
    setFormData({
      name: '',
      description: '',
      seller: '',
      assetType: 'fund',
      vintage: '',
      sector: '',
      geography: '',
      askPrice: 0,
      navPercentage: 0,
      expectedIRR: 0,
      expectedMultiple: 0,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Create New Deal Opportunity</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="col-span-full">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Opportunity Name *</label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1"
            />
          </div>
          
          <div className="col-span-full">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md resize-none"
              rows={3}
            />
          </div>
          
          <div>
            <label htmlFor="seller" className="block text-sm font-medium text-gray-700">Seller</label>
            <Input
              id="seller"
              value={formData.seller || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, seller: e.target.value }))}
              className="mt-1"
            />
          </div>
          
          <div>
            <label htmlFor="assetType" className="block text-sm font-medium text-gray-700">Asset Type</label>
            <select
              id="assetType"
              value={formData.assetType}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                assetType: e.target.value as 'fund' | 'direct' | 'co-investment' | 'gp-led' | 'other'
              }))}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="fund">Fund</option>
              <option value="direct">Direct</option>
              <option value="co-investment">Co-Investment</option>
              <option value="gp-led">GP-Led</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="vintage" className="block text-sm font-medium text-gray-700">Vintage Year</label>
            <Input
              id="vintage"
              value={formData.vintage}
              onChange={(e) => setFormData(prev => ({ ...prev, vintage: e.target.value }))}
              className="mt-1"
            />
          </div>
          
          <div>
            <label htmlFor="sector" className="block text-sm font-medium text-gray-700">Sector</label>
            <Input
              id="sector"
              value={formData.sector}
              onChange={(e) => setFormData(prev => ({ ...prev, sector: e.target.value }))}
              className="mt-1"
            />
          </div>
          
          <div>
            <label htmlFor="geography" className="block text-sm font-medium text-gray-700">Geography</label>
            <Input
              id="geography"
              value={formData.geography}
              onChange={(e) => setFormData(prev => ({ ...prev, geography: e.target.value }))}
              className="mt-1"
            />
          </div>
          
          <div>
            <label htmlFor="askPrice" className="block text-sm font-medium text-gray-700">Ask Price (USD)</label>
            <Input
              id="askPrice"
              type="number"
              value={formData.askPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, askPrice: Number(e.target.value) }))}
              className="mt-1"
            />
          </div>
          
          <div>
            <label htmlFor="expectedIRR" className="block text-sm font-medium text-gray-700">Expected IRR (%)</label>
            <Input
              id="expectedIRR"
              type="number"
              value={formData.expectedIRR}
              onChange={(e) => setFormData(prev => ({ ...prev, expectedIRR: Number(e.target.value) }))}
              className="mt-1"
            />
          </div>
        </div>
        
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Create</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HybridDealScreening: React.FC = () => {
  const router = useRouter();
  const { currentMode, setMode, setCurrentModule, addRecommendation } = useNavigationStore();
  
  // Set current module for navigation store
  useEffect(() => {
    setCurrentModule('deal-screening');
  }, [setCurrentModule]);

  // AI state
  const [aiState, setAIState] = useState<DealScreeningAIState>({
    recommendations: [],
    processingTasks: [],
    automatedActions: [],
    pendingApprovals: [],
  });

  // Data state
  const [opportunities, setOpportunities] = useState<DealOpportunity[]>([]);

  const [newOpportunityDialogOpen, setNewOpportunityDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch opportunities from API
  const fetchOpportunities = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/deal-screening/opportunities');
      if (response.ok) {
        const data = await response.json();
        setOpportunities(data.opportunities || []);
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load opportunities on component mount
  useEffect(() => {
    fetchOpportunities();
  }, []);

  // Mock metrics
  const metrics = {
    totalOpportunities: opportunities.length,
    activeScreenings: opportunities.filter(o => o.status === 'screening').length,
    completedScreenings: opportunities.filter(o => o.status === 'approved' || o.status === 'rejected').length,
    averageScreeningTime: '12 days',
    conversionRate: '42%',
    aiEfficiencyGains: 4.2,
  };

  // Generate AI recommendations based on mode
  useEffect(() => {
    if (currentMode.mode !== 'traditional') {
      // Mock AI recommendations
      const recommendations: AIRecommendation[] = [
        {
          id: 'global-rec-1',
          type: 'insight',
          priority: 'high',
          title: 'Pattern Recognition Alert',
          description: 'Healthcare deals in your pipeline are showing 23% higher returns than sector average.',
          confidence: 0.91,
          category: 'analysis',
          actions: [
            { label: 'Adjust Screening Criteria', action: 'ADJUST_DEAL_SCREENING_CRITERIA' },
            { label: 'View Analysis', action: 'VIEW_DEAL_SCREENING_ANALYSIS' }
          ]
        },
        {
          id: 'deal-screening-rec-2',
          type: 'automation' as const,
          priority: 'medium' as const,
          title: 'Bulk Processing Available',
          description: '4 new opportunities can be processed automatically using existing templates.',
          actions: [
            {
              id: 'action-3',
              label: 'Process All',
              action: 'PROCESS_DEAL_SCREENING_BULK',
              primary: true,
              estimatedTimeSaving: 30
            },
            {
              id: 'action-4',
              label: 'Review Individual',
              action: 'REVIEW_DEAL_SCREENING_INDIVIDUAL'
            }
          ],
          confidence: 0.85,
          moduleContext: 'deal-screening',
          timestamp: new Date()
        }
      ];
      
      // Add recommendations to global store
      recommendations.forEach(rec => {
        addRecommendation(rec);
      });
    }
  }, [currentMode.mode, addRecommendation]);

  // Handle mode switching
  const handleModeSwitch = (mode: 'traditional' | 'assisted' | 'autonomous') => {
    const newMode: UserNavigationMode = {
      mode: mode,
      aiPermissions: {
        suggestions: true,
        autoComplete: mode !== 'traditional',
        proactiveActions: mode === 'assisted' || mode === 'autonomous',
        autonomousExecution: mode === 'autonomous',
      },
      preferredDensity: currentMode.preferredDensity
    };
    
    setMode(newMode);
  };

  // Handle opportunity actions
  const handleCreateOpportunity = async (opportunityData: Partial<DealOpportunity>) => {
    try {
      const response = await fetch('/api/deal-screening/opportunities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(opportunityData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.opportunity) {
          setOpportunities(prev => [...prev, data.opportunity]);
        }
        setNewOpportunityDialogOpen(false);
        // Optionally refresh the opportunities list from API
        fetchOpportunities();
      } else {
        console.error('Failed to create opportunity');
      }
    } catch (error) {
      console.error('Error creating opportunity:', error);
    }
  };

  const handleViewOpportunity = (id: string) => {
    router.push(`/deal-screening/opportunity/${id}`);
  };

  const handleScreenOpportunity = (id: string) => {
    router.push(`/deal-screening/opportunity/${id}/screen`);
  };

  const handleExecuteAIAction = (actionId: string) => {
    console.log(`Executing AI action: ${actionId}`);
    // Implementation would depend on the specific action
  };

  const handleDismissRecommendation = (id: string) => {
    setAIState(prev => ({
      ...prev,
      recommendations: prev.recommendations.filter(rec => rec.id !== id)
    }));
  };

  const handleApproveAction = (approvalId: string) => {
    console.log(`Approving action: ${approvalId}`);
  };

  const handleRejectAction = (approvalId: string) => {
    console.log(`Rejecting action: ${approvalId}`);
  };

  const handlePauseAI = () => {
    console.log('Pausing AI processing');
  };

  const handleResumeAI = () => {
    console.log('Resuming AI processing');
  };

  return (
    <div className={currentMode.mode === 'autonomous' ? 'w-full h-screen' : 'w-full min-h-screen'}>
      {/* Header with Mode Switcher - Hidden for autonomous mode */}
      {currentMode.mode !== 'autonomous' && (
        <HybridModeHeader
          currentMode={currentMode.mode as HybridMode}
          onModeChange={handleModeSwitch}
          moduleContext="deal-screening"
          title="Deal Screening Platform"
          subtitle={`AI-powered deal opportunity screening and analysis • Choose your experience mode`}
          disabled={isLoading}
          className="sticky top-0 z-50"
        />
      )}
      
      {/* Mode Explanation Banner - Hidden for autonomous mode */}
      {currentMode.mode !== 'autonomous' && (
        <div className="p-4">
          <HybridModeExplanation
            currentMode={currentMode.mode as HybridMode}
            moduleContext="deal-screening"
            statistics={{
              efficiency: currentMode.mode === 'traditional' ? 0 : currentMode.mode === 'assisted' ? 35 : 75,
              automation: currentMode.mode === 'traditional' ? 0 : currentMode.mode === 'assisted' ? 45 : 90,
              accuracy: currentMode.mode === 'traditional' ? 100 : currentMode.mode === 'assisted' ? 118 : 125
            }}
          />
        </div>
      )}

      {/* Mode-specific Content */}
      {currentMode.mode === 'traditional' && (
        <ErrorBoundary
          onError={(error, errorInfo) => console.error('Deal Screening Traditional View Error:', error, errorInfo)}
        >
          <DealScreeningTraditional
            opportunities={opportunities}
            metrics={metrics}
            isLoading={isLoading}
            onCreateOpportunity={() => setNewOpportunityDialogOpen(true)}
            onViewOpportunity={handleViewOpportunity}
            onScreenOpportunity={handleScreenOpportunity}
          />
        </ErrorBoundary>
      )}

      {currentMode.mode === 'assisted' && (
        <ErrorBoundary
          onError={(error, errorInfo) => console.error('Deal Screening Assisted View Error:', error, errorInfo)}
        >
          <DealScreeningAssisted
            opportunities={opportunities}
            aiRecommendations={aiState.recommendations}
            metrics={metrics}
            isLoading={isLoading}
            onCreateOpportunity={() => setNewOpportunityDialogOpen(true)}
            onViewOpportunity={handleViewOpportunity}
            onScreenOpportunity={handleScreenOpportunity}
            onExecuteAIAction={handleExecuteAIAction}
            onDismissRecommendation={handleDismissRecommendation}
          />
        </ErrorBoundary>
      )}

      {currentMode.mode === 'autonomous' && (
        <ErrorBoundary
          onError={(error, errorInfo) => console.error('Deal Screening Autonomous View Error:', error, errorInfo)}
        >
          <DealScreeningAutonomous
            onSwitchMode={handleModeSwitch}
          />
        </ErrorBoundary>
      )}

      {/* Global Dialogs */}
      <NewOpportunityDialog
        open={newOpportunityDialogOpen}
        onClose={() => setNewOpportunityDialogOpen(false)}
        onCreate={handleCreateOpportunity}
      />

      {/* Mode Transition Announcement */}
      {currentMode.mode !== 'traditional' && (
        <ModeNotification
          mode={currentMode.mode as 'assisted' | 'autonomous'}
          title={`${currentMode.mode.charAt(0).toUpperCase() + currentMode.mode.slice(1)} Mode Active`}
          description={
            currentMode.mode === 'assisted' 
              ? 'AI will help with suggestions and automation.'
              : 'AI is handling routine tasks automatically.'
          }
        />
      )}
    </div>
  );
};

export default HybridDealScreening;