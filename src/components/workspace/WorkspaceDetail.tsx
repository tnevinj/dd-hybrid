'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InvestmentWorkspace, WorkspaceStatus, AnalysisComponent, WorkspaceActivity } from '@/types/workspace';
import { 
  ArrowLeft, 
  Settings, 
  Users, 
  FileText, 
  Target, 
  Link2, 
  MessageSquare,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus
} from 'lucide-react';
import { useNavigationStoreRefactored } from '@/stores/navigation-store-refactored';
import { WorkProductList, WorkProductCreator } from '@/components/work-product';
import { WorkProduct, WorkProductCreateRequest } from '@/types/work-product';

interface WorkspaceDetailProps {
  workspace: InvestmentWorkspace;
  onBack?: () => void;
  onUpdateWorkspace?: (updates: Partial<InvestmentWorkspace>) => void;
}

const getComponentStatusIcon = (status: string) => {
  switch (status) {
    case 'COMPLETED': return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'IN_PROGRESS': return <Clock className="w-4 h-4 text-blue-500" />;
    case 'UNDER_REVIEW': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    default: return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />;
  }
};

export function WorkspaceDetail({ workspace, onBack, onUpdateWorkspace }: WorkspaceDetailProps) {
  const { navigationMode } = useNavigationStoreRefactored();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAIInsights, setShowAIInsights] = useState(navigationMode !== 'traditional');
  const [workProducts, setWorkProducts] = useState<WorkProduct[]>([]);
  const [workProductsLoading, setWorkProductsLoading] = useState(false);
  const [showWorkProductCreator, setShowWorkProductCreator] = useState(false);

  // Fetch work products for this workspace
  React.useEffect(() => {
    fetchWorkProducts();
  }, [workspace.id]);

  const fetchWorkProducts = async () => {
    try {
      setWorkProductsLoading(true);
      const response = await fetch(`/api/workspaces/${workspace.id}/work-products`);
      if (response.ok) {
        const data = await response.json();
        setWorkProducts(data.workProducts || []);
      }
    } catch (error) {
      console.error('Error fetching work products:', error);
    } finally {
      setWorkProductsLoading(false);
    }
  };

  const handleCreateWorkProduct = async (request: WorkProductCreateRequest) => {
    try {
      const response = await fetch(`/api/workspaces/${workspace.id}/work-products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      
      if (response.ok) {
        const newWorkProduct = await response.json();
        setWorkProducts(prev => [newWorkProduct, ...prev]);
        setShowWorkProductCreator(false);
      }
    } catch (error) {
      console.error('Error creating work product:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'work-products', label: 'Work Products', icon: FileText },
    { id: 'analysis', label: 'Analysis', icon: Target },
    { id: 'evidence', label: 'Evidence', icon: Link2 },
    { id: 'collaboration', label: 'Team', icon: Users },
    { id: 'activity', label: 'Activity', icon: Activity },
  ];

  const renderAIInsights = () => {
    if (!showAIInsights || navigationMode === 'traditional') return null;

    return (
      <Card className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
              🤖 AI Insights
              {navigationMode === 'autonomous' && <Badge className="bg-purple-100 text-purple-700">Autonomous Mode</Badge>}
            </h3>
            
            <div className="space-y-2">
              {navigationMode === 'assisted' && (
                <>
                  <div className="p-3 bg-white rounded border border-blue-200">
                    <p className="text-sm text-gray-700">
                      💡 Similar deal pattern detected: This workspace resembles "TechCorp Acquisition" from last quarter. 
                      Want me to apply the same analysis framework?
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline">Apply Template</Button>
                      <Button size="sm" variant="ghost">View Comparison</Button>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white rounded border border-blue-200">
                    <p className="text-sm text-gray-700">
                      ⚡ I can automate 8 routine analysis tasks based on the uploaded documents.
                      Estimated time saving: 4-6 hours.
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline">Review & Automate</Button>
                      <Button size="sm" variant="ghost">Show Tasks</Button>
                    </div>
                  </div>
                </>
              )}

              {navigationMode === 'autonomous' && (
                <div className="space-y-2">
                  <div className="p-3 bg-white rounded border border-purple-200">
                    <p className="text-sm text-gray-700">
                      🔄 I've automatically completed document categorization and initial risk scoring. 
                      Found 3 items that need your attention.
                    </p>
                    <Button size="sm" variant="outline" className="mt-2">Review Decisions</Button>
                  </div>
                  
                  <div className="p-3 bg-white rounded border border-purple-200">
                    <p className="text-sm text-gray-700">
                      📊 Financial model analysis is 85% complete. Waiting for management interview data 
                      before finalizing revenue projections.
                    </p>
                    <Button size="sm" variant="outline" className="mt-2">View Progress</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAIInsights(false)}
          >
            ×
          </Button>
        </div>
      </Card>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Workspace Info */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{workspace.title}</h3>
            {workspace.description && (
              <p className="text-gray-600 mb-4">{workspace.description}</p>
            )}
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-blue-100 text-blue-700">{workspace.type.replace('_', ' ')}</Badge>
              <Badge className="bg-green-100 text-green-700">{workspace.status}</Badge>
              <Badge variant="outline">{workspace.phase}</Badge>
            </div>
            
            {workspace.dealName && (
              <p className="text-sm text-gray-600">
                <strong>Deal:</strong> {workspace.dealName}
              </p>
            )}
          </div>
          
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
        
        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm text-gray-600">{workspace.overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${workspace.overallProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {workspace.completedComponents} of {workspace.totalComponents} components completed
          </p>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-gray-50 rounded">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium">Team Size</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{workspace.participants.length}</p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium">Evidence Items</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{workspace.evidence.length}</p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium">Comments</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{workspace.comments.length}</p>
          </div>
        </div>
      </Card>
      
      {/* Analysis Components */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Analysis Components</h3>
          <Button size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Component
          </Button>
        </div>
        
        <div className="space-y-3">
          {workspace.analysisComponents.slice(0, 5).map((component) => (
            <div key={component.id} className="flex items-center justify-between p-3 border border-gray-200 rounded">
              <div className="flex items-center gap-3">
                {getComponentStatusIcon(component.status)}
                <div>
                  <p className="font-medium text-gray-900">{component.title}</p>
                  <p className="text-sm text-gray-600">{component.type}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {component.assignedTo && (
                  <span>Assigned to User</span>
                )}
                {component.dueDate && (
                  <span>Due {new Date(component.dueDate).toLocaleDateString()}</span>
                )}
                <span>{component.progress}%</span>
              </div>
            </div>
          ))}
          
          {workspace.analysisComponents.length > 5 && (
            <Button variant="ghost" className="w-full">
              View All {workspace.analysisComponents.length} Components
            </Button>
          )}
        </div>
      </Card>
    </div>
  );

  const renderAnalysis = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Analysis Framework</h3>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Component
        </Button>
      </div>
      
      <div className="grid gap-4">
        {workspace.analysisComponents.map((component) => (
          <Card key={component.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getComponentStatusIcon(component.status)}
                <div>
                  <h4 className="font-semibold text-gray-900">{component.title}</h4>
                  <p className="text-sm text-gray-600">{component.type}</p>
                </div>
              </div>
              
              <Badge variant="outline">{component.status.replace('_', ' ')}</Badge>
            </div>
            
            {component.description && (
              <p className="text-gray-600 mb-4">{component.description}</p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Progress: {component.progress}%</span>
                {component.assignedTo && <span>Assigned to User</span>}
                {component.dueDate && (
                  <span>Due {new Date(component.dueDate).toLocaleDateString()}</span>
                )}
              </div>
              
              <Button variant="outline" size="sm">View Details</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderWorkProducts = () => {
    if (showWorkProductCreator) {
      return (
        <WorkProductCreator
          workspaceId={workspace.id}
          onCreateWorkProduct={handleCreateWorkProduct}
          onCancel={() => setShowWorkProductCreator(false)}
        />
      );
    }

    return (
      <WorkProductList
        workspaceId={workspace.id}
        workProducts={workProducts}
        loading={workProductsLoading}
        onCreateWorkProduct={() => setShowWorkProductCreator(true)}
        onSelectWorkProduct={(workProduct) => {
          // Navigate to work product detail page
          window.location.href = `/workspaces/${workspace.id}/work-products/${workProduct.id}`;
        }}
        onEditWorkProduct={(workProduct) => {
          window.location.href = `/workspaces/${workspace.id}/work-products/${workProduct.id}/edit`;
        }}
        onShareWorkProduct={(workProduct) => {
          // Open share dialog
          console.log('Share work product:', workProduct.id);
        }}
      />
    );
  };

  const renderEvidence = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Evidence Repository</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Link2 className="w-4 h-4 mr-2" />
            Link External
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Upload Evidence
          </Button>
        </div>
      </div>

      {/* Evidence Categories */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <span className="font-medium">Documents</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{workspace.evidence.filter(e => e.type === 'DOCUMENT').length}</p>
          <p className="text-sm text-gray-600">Financial statements, contracts</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-green-500" />
            <span className="font-medium">Interviews</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{workspace.evidence.filter(e => e.type === 'INTERVIEW').length}</p>
          <p className="text-sm text-gray-600">Management, customer calls</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-purple-500" />
            <span className="font-medium">Analysis</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{workspace.evidence.filter(e => e.type === 'MODEL').length}</p>
          <p className="text-sm text-gray-600">Market research, models</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Link2 className="w-5 h-5 text-orange-500" />
            <span className="font-medium">External</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{workspace.evidence.filter(e => e.type === 'EXTERNAL_DATA').length}</p>
          <p className="text-sm text-gray-600">Third-party reports</p>
        </Card>
      </div>

      {/* Evidence List */}
      <Card className="p-6">
        <div className="space-y-4">
          {workspace.evidence.slice(0, 8).map((evidence) => (
            <div key={evidence.id} className="flex items-center justify-between p-4 border border-gray-200 rounded hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{evidence.title}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Badge variant="outline" className="text-xs">{evidence.type}</Badge>
                    <span>•</span>
                    <span>Added {new Date(evidence.attachedAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>by {evidence.attachedBy}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">View</Button>
                <Button variant="ghost" size="sm">
                  <Link2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {workspace.evidence.length > 8 && (
            <Button variant="ghost" className="w-full">
              View All {workspace.evidence.length} Evidence Items
            </Button>
          )}
        </div>
      </Card>

      {/* AI Evidence Insights */}
      {navigationMode !== 'traditional' && (
        <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
            🔍 Evidence Analysis Insights
          </h4>
          <div className="space-y-2">
            <div className="p-3 bg-white rounded border border-purple-200">
              <p className="text-sm text-gray-700">
                📊 Financial statements show consistent 15% YoY growth. Cross-referenced with management interviews - claims verified.
              </p>
            </div>
            <div className="p-3 bg-white rounded border border-purple-200">
              <p className="text-sm text-gray-700">
                ⚠️ Customer interview #3 mentions competitive pressure not reflected in market analysis. Recommend follow-up.
              </p>
            </div>
            <div className="p-3 bg-white rounded border border-purple-200">
              <p className="text-sm text-gray-700">
                ✅ All regulatory compliance documents verified. No red flags detected in legal review.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  const renderCollaboration = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Team Collaboration</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Users className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
          <Button size="sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            New Discussion
          </Button>
        </div>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="font-medium">Team Members</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{workspace.participants.length}</p>
          <p className="text-sm text-gray-600">Active contributors</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-green-500" />
            <span className="font-medium">Discussions</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{workspace.comments.length}</p>
          <p className="text-sm text-gray-600">Open conversations</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-purple-500" />
            <span className="font-medium">Recent Activity</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{workspace.activities.length}</p>
          <p className="text-sm text-gray-600">Last 7 days</p>
        </Card>
      </div>

      {/* Team Members */}
      <Card className="p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Team Members</h4>
        <div className="space-y-3">
          {workspace.participants.map((participant, index) => {
            // Mock display data since participant type only has basic fields
            const mockNames = ['Sarah Chen', 'Mike Johnson', 'Alex Rodriguez', 'Emma Wilson'];
            const mockName = mockNames[index % mockNames.length] || 'Team Member';
            const isOnline = index % 2 === 0; // Alternate online status for demo
            
            return (
              <div key={participant.id} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {mockName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{mockName}</p>
                    <p className="text-sm text-gray-600">{participant.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{participant.role}</Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    {isOnline ? 'Online' : 'Offline'}
                  </div>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recent Discussions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">Recent Discussions</h4>
          <Button size="sm" variant="outline">View All</Button>
        </div>
        
        <div className="space-y-4">
          {workspace.comments.slice(0, 5).map((comment) => (
            <div key={comment.id} className="p-4 border border-gray-200 rounded">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {comment.authorName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{comment.authorName}</p>
                    <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">Comment</Badge>
              </div>
              
              <p className="text-gray-700 mb-3">{comment.content}</p>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">Reply</Button>
                <Button variant="ghost" size="sm">
                  <Link2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* AI Collaboration Insights */}
      {navigationMode !== 'traditional' && (
        <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
            🤝 Collaboration Insights
          </h4>
          <div className="space-y-2">
            <div className="p-3 bg-white rounded border border-green-200">
              <p className="text-sm text-gray-700">
                💡 Sarah's financial analysis complements Mike's market research. Consider scheduling a joint review session.
              </p>
            </div>
            <div className="p-3 bg-white rounded border border-green-200">
              <p className="text-sm text-gray-700">
                ⏰ 3 open discussions need resolution before the investment committee meeting on Friday.
              </p>
            </div>
            <div className="p-3 bg-white rounded border border-green-200">
              <p className="text-sm text-gray-700">
                📈 Team productivity is 23% higher when using structured discussion templates. Want me to suggest formats?
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
      
      <div className="space-y-3">
        {workspace.activities.slice(0, 10).map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-4 border border-gray-200 rounded">
            <Activity className="w-4 h-4 text-gray-400 mt-1" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">{activity.description}</p>
              <p className="text-xs text-gray-500">
                by {activity.userName} • {new Date(activity.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{workspace.title}</h1>
          <p className="text-gray-600">Investment workspace</p>
        </div>
      </div>

      {/* AI Insights */}
      {renderAIInsights()}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'work-products' && renderWorkProducts()}
        {activeTab === 'analysis' && renderAnalysis()}
        {activeTab === 'activity' && renderActivity()}
        {activeTab === 'evidence' && renderEvidence()}
        {activeTab === 'collaboration' && renderCollaboration()}
      </div>
    </div>
  );
}
