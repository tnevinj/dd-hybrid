import { DecisionWorkflowEngine, DecisionType, Priority } from '@/lib/decision-workflow-engine';
import { EntityType } from '@/types/shared-intelligence';

describe('DecisionWorkflowEngine', () => {
  let engine: DecisionWorkflowEngine;

  beforeEach(() => {
    engine = new DecisionWorkflowEngine();
  });

  describe('createWorkflow', () => {
    const mockWorkflowParams = {
      title: 'Test Investment Decision',
      type: 'investment' as DecisionType,
      priority: 'high' as Priority,
      entityType: 'company' as EntityType,
      entityId: 'company_123',
      context: {
        summary: 'Investment opportunity in tech startup',
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
          estimatedValue: 1000000,
          currency: 'USD',
          timeHorizon: '2 years',
          confidenceLevel: 0.75,
          breakdown: [{
            category: 'Initial Investment',
            amount: 1000000,
            description: 'Primary investment amount'
          }]
        },
        strategicImplications: ['Market expansion', 'Technology acquisition'],
        supportingData: [],
        relatedDecisions: [],
        recommendations: []
      },
      targetDecision: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    };

    it('should create a new workflow with correct properties', () => {
      const workflow = engine.createWorkflow(mockWorkflowParams);

      expect(workflow.id).toBeDefined();
      expect(workflow.title).toBe('Test Investment Decision');
      expect(workflow.type).toBe('investment');
      expect(workflow.priority).toBe('high');
      expect(workflow.status).toBe('draft');
      expect(workflow.requiredApprovals).toHaveLength(4); // Investment workflow has 4 approval levels
      expect(workflow.stakeholders.length).toBeGreaterThan(0);
    });

    it('should initialize workflow with correct approval levels for investment type', () => {
      const workflow = engine.createWorkflow(mockWorkflowParams);

      const approvalRoles = workflow.requiredApprovals.map(a => a.role);
      expect(approvalRoles).toContain('portfolio_manager');
      expect(approvalRoles).toContain('risk_manager');
      expect(approvalRoles).toContain('investment_committee');
      expect(approvalRoles).toContain('managing_partner');

      workflow.requiredApprovals.forEach(approval => {
        expect(approval.completed).toBe(false);
      });
    });

    it('should initialize workflow with correct stages', () => {
      const workflow = engine.createWorkflow(mockWorkflowParams);

      expect(workflow.currentStage).toBeDefined();
      expect(workflow.currentStage.id).toBe('initial_review');
      expect(workflow.currentStage.name).toBe('Initial Review');
    });

    it('should throw error for unknown workflow type', () => {
      const invalidParams = {
        ...mockWorkflowParams,
        type: 'unknown_type' as DecisionType
      };

      expect(() => engine.createWorkflow(invalidParams)).toThrow('No template found for decision type: unknown_type');
    });
  });

  describe('processApproval', () => {
    let workflow: ReturnType<DecisionWorkflowEngine['createWorkflow']>;

    beforeEach(() => {
      const mockParams = {
        title: 'Test Workflow',
        type: 'strategic' as DecisionType,
        priority: 'medium' as Priority,
        entityType: 'fund' as EntityType,
        entityId: 'fund_456',
        context: {
          summary: 'Strategic decision test',
          riskAssessment: {
            overallRisk: 'low' as const,
            categories: [],
            mitigationStrategies: [],
            contingencyPlans: []
          },
          financialImpact: {
            estimatedValue: 500000,
            currency: 'USD',
            timeHorizon: '1 year',
            confidenceLevel: 0.8,
            breakdown: []
          },
          strategicImplications: [],
          supportingData: [],
          relatedDecisions: [],
          recommendations: []
        },
        targetDecision: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      };

      workflow = engine.createWorkflow(mockParams);
    });

    it('should process approval correctly', () => {
      engine.processApproval(workflow.id, 'operations_manager', 'approved', 'Looks good to me');

      const approvals = engine['workflows'].get(workflow.id)?.requiredApprovals;
      const opsApproval = approvals?.find(a => a.role === 'operations_manager');

      expect(opsApproval?.completed).toBe(true);
      expect(opsApproval?.comments).toBe('Looks good to me');
      expect(opsApproval?.approvedAt).toBeDefined();
    });

    it('should set workflow status to rejected when approval is rejected', () => {
      engine.processApproval(workflow.id, 'operations_manager', 'rejected', 'Not ready yet');

      const updatedWorkflow = engine['workflows'].get(workflow.id);
      expect(updatedWorkflow?.status).toBe('rejected');
    });

    it('should set workflow status to approved when all approvals are completed', () => {
      engine.processApproval(workflow.id, 'operations_manager', 'approved');
      engine.processApproval(workflow.id, 'managing_partner', 'approved');

      const updatedWorkflow = engine['workflows'].get(workflow.id);
      expect(updatedWorkflow?.status).toBe('approved');
    });

    it('should throw error for non-existent workflow', () => {
      expect(() => {
        engine.processApproval('non_existent_id', 'operations_manager', 'approved');
      }).toThrow('Workflow not found');
    });

    it('should throw error for invalid approval level', () => {
      expect(() => {
        engine.processApproval(workflow.id, 'analyst', 'approved');
      }).toThrow('Approval level not found');
    });
  });

  describe('getWorkflowsForUser', () => {
    beforeEach(() => {
      // Create test workflows
      const params1 = {
        title: 'Investment Decision 1',
        type: 'investment' as DecisionType,
        priority: 'high' as Priority,
        entityType: 'company' as EntityType,
        entityId: 'company_1',
        context: {
          summary: 'Test summary 1',
          riskAssessment: {
            overallRisk: 'medium' as const,
            categories: [],
            mitigationStrategies: [],
            contingencyPlans: []
          },
          financialImpact: {
            estimatedValue: 1000000,
            currency: 'USD',
            timeHorizon: '2 years',
            confidenceLevel: 0.75,
            breakdown: []
          },
          strategicImplications: [],
          supportingData: [],
          relatedDecisions: [],
          recommendations: []
        },
        targetDecision: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      };

      const params2 = {
        ...params1,
        title: 'Strategic Decision 1',
        type: 'strategic' as DecisionType,
        entityId: 'fund_1'
      };

      engine.createWorkflow(params1);
      engine.createWorkflow(params2);
    });

    it('should return workflows for portfolio manager role', () => {
      const workflows = engine.getWorkflowsForUser('user_1', 'portfolio_manager');
      
      expect(workflows.length).toBeGreaterThan(0);
      const investmentWorkflows = workflows.filter(w => w.type === 'investment');
      expect(investmentWorkflows.length).toBe(1);
    });

    it('should return workflows that require approval from specific role', () => {
      const workflows = engine.getWorkflowsForUser('user_2', 'risk_manager');
      
      const workflowsRequiringRiskApproval = workflows.filter(w => 
        w.requiredApprovals.some(a => a.role === 'risk_manager' && !a.completed)
      );
      expect(workflowsRequiringRiskApproval.length).toBe(1);
    });

    it('should return empty array for roles with no associated workflows', () => {
      const workflows = engine.getWorkflowsForUser('user_3', 'analyst');
      expect(workflows).toEqual([]);
    });
  });

  describe('updateWorkflowStage', () => {
    let workflow: ReturnType<DecisionWorkflowEngine['createWorkflow']>;

    beforeEach(() => {
      const mockParams = {
        title: 'Stage Test Workflow',
        type: 'investment' as DecisionType,
        priority: 'medium' as Priority,
        entityType: 'company' as EntityType,
        entityId: 'company_stage_test',
        context: {
          summary: 'Stage progression test',
          riskAssessment: {
            overallRisk: 'low' as const,
            categories: [],
            mitigationStrategies: [],
            contingencyPlans: []
          },
          financialImpact: {
            estimatedValue: 750000,
            currency: 'USD',
            timeHorizon: '18 months',
            confidenceLevel: 0.85,
            breakdown: []
          },
          strategicImplications: [],
          supportingData: [],
          relatedDecisions: [],
          recommendations: []
        },
        targetDecision: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
      };

      workflow = engine.createWorkflow(mockParams);
    });

    it('should update current stage properties', () => {
      const updatedActions = ['action1', 'action2'];
      
      engine.updateWorkflowStage(workflow.id, 'initial_review', {
        completedActions: updatedActions
      });

      const updatedWorkflow = engine['workflows'].get(workflow.id);
      expect(updatedWorkflow?.currentStage.completedActions).toEqual(updatedActions);
      expect(updatedWorkflow?.updatedAt).toBeDefined();
    });

    it('should progress to next stage when current stage is completed', () => {
      engine.updateWorkflowStage(workflow.id, 'initial_review', {
        completedAt: new Date(),
        completedActions: ['due_diligence', 'risk_assessment']
      });

      const updatedWorkflow = engine['workflows'].get(workflow.id);
      expect(updatedWorkflow?.currentStage.id).toBe('detailed_analysis');
    });

    it('should set status to pending_approval when all stages completed', () => {
      // Complete initial review
      engine.updateWorkflowStage(workflow.id, 'initial_review', {
        completedAt: new Date()
      });
      
      // Complete detailed analysis
      engine.updateWorkflowStage(workflow.id, 'detailed_analysis', {
        completedAt: new Date()
      });
      
      // Complete committee review
      engine.updateWorkflowStage(workflow.id, 'committee_review', {
        completedAt: new Date()
      });

      const updatedWorkflow = engine['workflows'].get(workflow.id);
      expect(updatedWorkflow?.status).toBe('pending_approval');
    });

    it('should throw error for non-existent workflow', () => {
      expect(() => {
        engine.updateWorkflowStage('non_existent', 'some_stage', {});
      }).toThrow('Workflow not found');
    });
  });

  describe('getWorkflowInsights', () => {
    let workflow: ReturnType<DecisionWorkflowEngine['createWorkflow']>;

    beforeEach(() => {
      const mockParams = {
        title: 'Insights Test Workflow',
        type: 'investment' as DecisionType,
        priority: 'high' as Priority,
        entityType: 'company' as EntityType,
        entityId: 'company_insights_test',
        context: {
          summary: 'Workflow for testing insights',
          riskAssessment: {
            overallRisk: 'high' as const,
            categories: [{
              type: 'financial' as const,
              level: 'high' as const,
              description: 'High financial risk',
              impact: 0.8,
              probability: 0.6
            }],
            mitigationStrategies: [],
            contingencyPlans: []
          },
          financialImpact: {
            estimatedValue: 2000000,
            currency: 'USD',
            timeHorizon: '3 years',
            confidenceLevel: 0.65,
            breakdown: []
          },
          strategicImplications: [],
          supportingData: [],
          relatedDecisions: [],
          recommendations: []
        },
        targetDecision: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      };

      workflow = engine.createWorkflow(mockParams);
    });

    it('should generate workflow insights', () => {
      const insights = engine.getWorkflowInsights(workflow.id);

      expect(insights).toBeDefined();
      expect(insights.bottlenecks).toBeInstanceOf(Array);
      expect(insights.predictions).toBeDefined();
      expect(insights.recommendations).toBeInstanceOf(Array);
      expect(insights.riskFactors).toBeInstanceOf(Array);
      expect(typeof insights.efficiency).toBe('number');
    });

    it('should identify bottlenecks for pending approvals', () => {
      const insights = engine.getWorkflowInsights(workflow.id);

      expect(insights.bottlenecks.length).toBeGreaterThan(0);
      expect(insights.bottlenecks.some(b => b.includes('Pending approval'))).toBe(true);
    });

    it('should generate recommendations for high-priority workflows', () => {
      const insights = engine.getWorkflowInsights(workflow.id);

      expect(insights.recommendations).toContain('Consider expedited review process');
    });

    it('should generate recommendations for high-risk workflows', () => {
      const insights = engine.getWorkflowInsights(workflow.id);

      expect(insights.recommendations).toContain('Engage additional risk review');
    });

    it('should throw error for non-existent workflow', () => {
      expect(() => {
        engine.getWorkflowInsights('non_existent_workflow');
      }).toThrow('Workflow not found');
    });
  });
});