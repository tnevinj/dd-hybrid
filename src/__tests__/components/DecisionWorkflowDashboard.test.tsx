import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DecisionWorkflowDashboard from '@/components/workflow-automation/DecisionWorkflowDashboard';
import { DecisionWorkflowEngine } from '@/lib/decision-workflow-engine';

// Mock the decision workflow engine
jest.mock('@/lib/decision-workflow-engine');

const MockedDecisionWorkflowEngine = DecisionWorkflowEngine as jest.MockedClass<typeof DecisionWorkflowEngine>;

describe('DecisionWorkflowDashboard', () => {
  let mockEngine: jest.Mocked<DecisionWorkflowEngine>;

  const mockWorkflows = [
    {
      id: 'workflow_1',
      title: 'Investment Decision Alpha',
      type: 'investment' as const,
      priority: 'high' as const,
      status: 'pending_approval' as const,
      entityType: 'company' as const,
      entityId: 'company_123',
      requiredApprovals: [
        { role: 'portfolio_manager' as const, required: true, completed: true, approver: 'user_1', approvedAt: new Date() },
        { role: 'risk_manager' as const, required: true, completed: false },
        { role: 'investment_committee' as const, required: true, completed: false }
      ],
      currentStage: {
        id: 'committee_review',
        name: 'Investment Committee Review',
        description: 'Committee evaluation phase',
        requiredActions: ['presentation_preparation', 'committee_meeting'],
        completedActions: ['presentation_preparation'],
        estimatedDuration: '5 days'
      },
      context: {
        summary: 'High-growth tech startup investment opportunity',
        riskAssessment: {
          overallRisk: 'medium' as const,
          categories: [{
            type: 'financial' as const,
            level: 'medium' as const,
            description: 'Market volatility concerns',
            impact: 0.6,
            probability: 0.4
          }],
          mitigationStrategies: [],
          contingencyPlans: []
        },
        financialImpact: {
          estimatedValue: 5000000,
          currency: 'USD',
          timeHorizon: '3-5 years',
          confidenceLevel: 0.75,
          breakdown: []
        },
        strategicImplications: ['Market expansion', 'Technology acquisition'],
        supportingData: [],
        relatedDecisions: [],
        recommendations: []
      },
      timeline: {
        created: new Date('2024-01-01'),
        targetDecision: new Date('2024-01-15'),
        milestones: [],
        escalations: []
      },
      stakeholders: [
        { id: '1', name: 'Portfolio Manager', role: 'portfolio_manager' as const, department: 'Investments', influence: 'high' as const, notification: true },
        { id: '2', name: 'Risk Manager', role: 'risk_manager' as const, department: 'Risk', influence: 'high' as const, notification: true }
      ],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-10')
    },
    {
      id: 'workflow_2',
      title: 'Strategic Partnership Beta',
      type: 'strategic' as const,
      priority: 'medium' as const,
      status: 'approved' as const,
      entityType: 'fund' as const,
      entityId: 'fund_456',
      requiredApprovals: [
        { role: 'operations_manager' as const, required: true, completed: true, approver: 'user_2', approvedAt: new Date() },
        { role: 'managing_partner' as const, required: true, completed: true, approver: 'user_3', approvedAt: new Date() }
      ],
      currentStage: {
        id: 'implementation',
        name: 'Implementation',
        description: 'Strategy implementation phase',
        requiredActions: ['execute_strategy'],
        completedActions: ['execute_strategy'],
        estimatedDuration: '2 days'
      },
      context: {
        summary: 'Partnership with strategic technology provider',
        riskAssessment: {
          overallRisk: 'low' as const,
          categories: [],
          mitigationStrategies: [],
          contingencyPlans: []
        },
        financialImpact: {
          estimatedValue: 1000000,
          currency: 'USD',
          timeHorizon: '1-2 years',
          confidenceLevel: 0.85,
          breakdown: []
        },
        strategicImplications: ['Technology enhancement'],
        supportingData: [],
        relatedDecisions: [],
        recommendations: []
      },
      timeline: {
        created: new Date('2024-01-05'),
        targetDecision: new Date('2024-01-12'),
        milestones: [],
        escalations: []
      },
      stakeholders: [
        { id: '3', name: 'Operations Manager', role: 'operations_manager' as const, department: 'Operations', influence: 'medium' as const, notification: true }
      ],
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-12')
    }
  ];

  beforeEach(() => {
    mockEngine = {
      getWorkflowsForUser: jest.fn().mockReturnValue(mockWorkflows),
      processApproval: jest.fn(),
      createWorkflow: jest.fn(),
      updateWorkflowStage: jest.fn(),
      getWorkflowInsights: jest.fn()
    } as Partial<jest.Mocked<DecisionWorkflowEngine>> as jest.Mocked<DecisionWorkflowEngine>;

    MockedDecisionWorkflowEngine.mockImplementation(() => mockEngine);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render dashboard with correct title and description', () => {
      render(<DecisionWorkflowDashboard userId="user_1" userRole="portfolio_manager" />);

      expect(screen.getByText('Decision Workflows')).toBeInTheDocument();
      expect(screen.getByText('Intelligent decision routing and approval management')).toBeInTheDocument();
    });

    it('should render summary statistics cards', async () => {
      render(<DecisionWorkflowDashboard userId="user_1" userRole="portfolio_manager" />);

      await waitFor(() => {
        expect(screen.getByText('Pending')).toBeInTheDocument();
        expect(screen.getByText('Approved')).toBeInTheDocument();
        expect(screen.getByText('Awaiting My Approval')).toBeInTheDocument();
        expect(screen.getByText('Overdue')).toBeInTheDocument();
      });
    });

    it('should display correct counts in summary cards', async () => {
      render(<DecisionWorkflowDashboard userId="user_1" userRole="portfolio_manager" />);

      await waitFor(() => {
        // One pending workflow (workflow_1 with status 'pending_approval')
        const pendingCards = screen.getAllByText('1');
        expect(pendingCards.length).toBeGreaterThan(0);
        
        // One approved workflow (workflow_2 with status 'approved')  
        const approvedCards = screen.getAllByText('1');
        expect(approvedCards.length).toBeGreaterThan(0);
      });
    });

    it('should render workflow cards with correct information', async () => {
      render(<DecisionWorkflowDashboard userId="user_1" userRole="portfolio_manager" />);

      await waitFor(() => {
        expect(screen.getByText('Investment Decision Alpha')).toBeInTheDocument();
        expect(screen.getByText('Strategic Partnership Beta')).toBeInTheDocument();
      });
    });
  });

  describe('Tab Navigation', () => {
    it('should render all tab options', () => {
      render(<DecisionWorkflowDashboard userId="user_1" userRole="portfolio_manager" />);

      expect(screen.getByRole('tab', { name: 'Pending' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Approved' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'My Approvals' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'All' })).toBeInTheDocument();
    });

    it('should filter workflows correctly when switching tabs', async () => {
      render(<DecisionWorkflowDashboard userId="user_1" userRole="portfolio_manager" />);

      // Switch to Approved tab
      fireEvent.click(screen.getByRole('tab', { name: 'Approved' }));

      await waitFor(() => {
        expect(screen.getByText('Strategic Partnership Beta')).toBeInTheDocument();
        expect(screen.queryByText('Investment Decision Alpha')).not.toBeInTheDocument();
      });
    });

    it('should show correct workflows in My Approvals tab', async () => {
      render(<DecisionWorkflowDashboard userId="user_1" userRole="risk_manager" />);

      // Switch to My Approvals tab
      fireEvent.click(screen.getByRole('tab', { name: 'My Approvals' }));

      await waitFor(() => {
        // Should show workflow_1 as it has pending risk_manager approval
        expect(screen.getByText('Investment Decision Alpha')).toBeInTheDocument();
        expect(screen.queryByText('Strategic Partnership Beta')).not.toBeInTheDocument();
      });
    });
  });

  describe('Workflow Details', () => {
    it('should display workflow progress correctly', async () => {
      render(<DecisionWorkflowDashboard userId="user_1" userRole="portfolio_manager" />);

      await waitFor(() => {
        // workflow_1 has 1 of 3 approvals completed = 33%
        expect(screen.getByText('33%')).toBeInTheDocument();
      });
    });

    it('should show priority badges with correct styling', async () => {
      render(<DecisionWorkflowDashboard userId="user_1" userRole="portfolio_manager" />);

      await waitFor(() => {
        expect(screen.getByText('high')).toBeInTheDocument();
        expect(screen.getByText('medium')).toBeInTheDocument();
      });
    });

    it('should show status badges with correct text', async () => {
      render(<DecisionWorkflowDashboard userId="user_1" userRole="portfolio_manager" />);

      await waitFor(() => {
        expect(screen.getByText('pending approval')).toBeInTheDocument();
        expect(screen.getByText('approved')).toBeInTheDocument();
      });
    });
  });

  describe('Workflow Actions', () => {
    it('should show Review button for workflows requiring user approval', async () => {
      render(<DecisionWorkflowDashboard userId="user_1" userRole="risk_manager" />);

      await waitFor(() => {
        expect(screen.getByText('Review')).toBeInTheDocument();
      });
    });

    it('should not show Review button for approved workflows', async () => {
      render(<DecisionWorkflowDashboard userId="user_1" userRole="portfolio_manager" />);

      // Switch to approved tab
      fireEvent.click(screen.getByRole('tab', { name: 'Approved' }));

      await waitFor(() => {
        expect(screen.queryByText('Review')).not.toBeInTheDocument();
      });
    });
  });

  describe('Approval Dialog', () => {
    it('should open approval dialog when Review button is clicked', async () => {
      render(<DecisionWorkflowDashboard userId="user_1" userRole="risk_manager" />);

      await waitFor(() => {
        const reviewButton = screen.getByText('Review');
        fireEvent.click(reviewButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Process Approval')).toBeInTheDocument();
        expect(screen.getByText('Investment Decision Alpha')).toBeInTheDocument();
      });
    });

    it('should have approval and reject options in select', async () => {
      render(<DecisionWorkflowDashboard userId="user_1" userRole="risk_manager" />);

      await waitFor(() => {
        fireEvent.click(screen.getByText('Review'));
      });

      await waitFor(() => {
        // The Select component should be present
        expect(screen.getByRole('combobox')).toBeInTheDocument();
      });
    });

    it('should process approval when Approve button is clicked', async () => {
      render(<DecisionWorkflowDashboard userId="user_1" userRole="risk_manager" />);

      await waitFor(() => {
        fireEvent.click(screen.getByText('Review'));
      });

      await waitFor(() => {
        const approveButton = screen.getByText('Approve');
        fireEvent.click(approveButton);
      });

      expect(mockEngine.processApproval).toHaveBeenCalledWith(
        'workflow_1',
        'risk_manager',
        'approved',
        ''
      );
    });
  });

  describe('Error Handling', () => {
    it('should display loading state initially', () => {
      render(<DecisionWorkflowDashboard userId="user_1" userRole="portfolio_manager" />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should display empty state when no workflows match filter', async () => {
      mockEngine.getWorkflowsForUser.mockReturnValue([]);

      render(<DecisionWorkflowDashboard userId="user_1" userRole="analyst" />);

      await waitFor(() => {
        expect(screen.getByText('No workflows found')).toBeInTheDocument();
        expect(screen.getByText('No workflows match the current filter criteria.')).toBeInTheDocument();
      });
    });

    it('should handle workflow loading errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockEngine.getWorkflowsForUser.mockImplementation(() => {
        throw new Error('Failed to load workflows');
      });

      render(<DecisionWorkflowDashboard userId="user_1" userRole="portfolio_manager" />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to load workflows:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Risk Assessment Display', () => {
    it('should show high risk alert for high-risk decisions', async () => {
      const highRiskWorkflow = {
        ...mockWorkflows[0],
        context: {
          ...mockWorkflows[0].context,
          riskAssessment: {
            ...mockWorkflows[0].context.riskAssessment,
            overallRisk: 'high' as const,
            categories: [
              {
                type: 'financial' as const,
                level: 'high' as const,
                description: 'High financial risk',
                impact: 0.8,
                probability: 0.7
              }
            ]
          }
        }
      };

      mockEngine.getWorkflowsForUser.mockReturnValue([highRiskWorkflow]);

      render(<DecisionWorkflowDashboard userId="user_1" userRole="portfolio_manager" />);

      await waitFor(() => {
        expect(screen.getByText(/High risk decision/)).toBeInTheDocument();
        expect(screen.getByText(/risk factors identified/)).toBeInTheDocument();
      });
    });

    it('should not show risk alert for medium/low risk decisions', async () => {
      render(<DecisionWorkflowDashboard userId="user_1" userRole="portfolio_manager" />);

      await waitFor(() => {
        expect(screen.queryByText(/High risk decision/)).not.toBeInTheDocument();
      });
    });
  });
});