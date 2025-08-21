import { DecisionWorkflowEngine } from '@/lib/decision-workflow-engine';
import { DataSyncService } from '@/lib/data-sync-service';
import { IntelligentInsight, DataQualityIndicator } from '@/types/shared-intelligence';

describe('Workflow Integration Tests', () => {
  let workflowEngine: DecisionWorkflowEngine;
  let dataSyncService: DataSyncService;

  beforeEach(() => {
    workflowEngine = new DecisionWorkflowEngine();
    dataSyncService = new DataSyncService();
  });

  afterEach(() => {
    // Clean up any subscriptions or connections
    dataSyncService.cleanup();
  });

  describe('Cross-module Workflow Integration', () => {
    it('should create investment workflow with portfolio data synchronization', async () => {
      const mockInsight: IntelligentInsight = {
        id: 'insight_1',
        type: 'prediction',
        title: 'Investment Risk Assessment',
        description: 'Automated risk analysis suggests medium risk level',
        confidence: 0.85,
        dataPoints: ['market_volatility', 'financial_metrics'],
        recommendations: ['Proceed with enhanced due diligence'],
        createdAt: new Date(),
        entityId: 'company_123',
        entityType: 'company'
      };

      const mockQualityIndicator: DataQualityIndicator = {
        score: 0.92,
        completeness: 0.95,
        accuracy: 0.90,
        freshness: 0.88,
        consistency: 0.94,
        lastUpdated: new Date(),
        issues: []
      };

      // Simulate data sync for portfolio entity
      await dataSyncService.syncEntityData('company', 'company_123', {
        insights: [mockInsight],
        qualityIndicator: mockQualityIndicator,
        lastUpdated: new Date()
      });

      // Create workflow using synced data
      const workflow = workflowEngine.createWorkflow({
        title: 'Tech Startup Alpha Investment',
        type: 'investment',
        priority: 'high',
        entityType: 'company',
        entityId: 'company_123',
        context: {
          summary: 'High-growth SaaS startup with strong metrics',
          riskAssessment: {
            overallRisk: 'medium',
            categories: [{
              type: 'financial',
              level: 'medium',
              description: 'Market volatility concerns',
              impact: 0.6,
              probability: 0.4
            }],
            mitigationStrategies: [{
              id: 'mit_1',
              riskCategory: 'financial',
              strategy: 'Diversified investment approach',
              implementation: 'Phased investment over 12 months',
              owner: 'portfolio_manager',
              timeline: '6 months',
              effectiveness: 0.8
            }],
            contingencyPlans: ['Exit strategy via strategic acquisition']
          },
          financialImpact: {
            estimatedValue: 10000000,
            currency: 'USD',
            timeHorizon: '3-5 years',
            confidenceLevel: 0.75,
            breakdown: [{
              category: 'Initial Investment',
              amount: 5000000,
              description: 'Series A investment'
            }, {
              category: 'Follow-on Reserve',
              amount: 5000000,
              description: 'Reserved for future rounds'
            }]
          },
          strategicImplications: ['Market expansion', 'Technology acquisition', 'Portfolio diversification'],
          supportingData: [{
            id: 'doc_1',
            type: 'analysis',
            title: 'Market Analysis Report',
            source: 'Portfolio Management',
            relevanceScore: 0.95,
            lastUpdated: new Date()
          }],
          relatedDecisions: [],
          recommendations: [mockInsight]
        },
        targetDecision: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      });

      expect(workflow).toBeDefined();
      expect(workflow.entityId).toBe('company_123');
      expect(workflow.context.recommendations).toHaveLength(1);
      expect(workflow.context.recommendations[0].confidence).toBe(0.85);
      expect(workflow.requiredApprovals).toHaveLength(4);
      expect(workflow.stakeholders.length).toBeGreaterThan(0);
    });

    it('should handle strategic workflow with cross-module dependencies', async () => {
      // Sync data from multiple modules
      await dataSyncService.syncEntityData('fund', 'fund_456', {
        insights: [{
          id: 'insight_strategic',
          type: 'trend_analysis',
          title: 'Market Position Analysis',
          description: 'Strategic repositioning recommended',
          confidence: 0.78,
          dataPoints: ['market_data', 'competitive_analysis'],
          recommendations: ['Expand into adjacent markets'],
          createdAt: new Date(),
          entityId: 'fund_456',
          entityType: 'fund'
        }],
        qualityIndicator: {
          score: 0.88,
          completeness: 0.90,
          accuracy: 0.85,
          freshness: 0.90,
          consistency: 0.88,
          lastUpdated: new Date(),
          issues: ['Missing recent market data']
        },
        lastUpdated: new Date()
      });

      const strategicWorkflow = workflowEngine.createWorkflow({
        title: 'Fund Strategic Repositioning',
        type: 'strategic',
        priority: 'critical',
        entityType: 'fund',
        entityId: 'fund_456',
        context: {
          summary: 'Strategic repositioning to capture emerging market opportunities',
          riskAssessment: {
            overallRisk: 'high',
            categories: [{
              type: 'strategic',
              level: 'high',
              description: 'Market timing and execution risks',
              impact: 0.8,
              probability: 0.5
            }, {
              type: 'operational',
              level: 'medium',
              description: 'Resource allocation and capacity constraints',
              impact: 0.6,
              probability: 0.6
            }],
            mitigationStrategies: [{
              id: 'strat_mit_1',
              riskCategory: 'strategic',
              strategy: 'Phased market entry',
              implementation: 'Pilot program with key partners',
              owner: 'managing_partner',
              timeline: '3 months',
              effectiveness: 0.7
            }],
            contingencyPlans: ['Maintain current market position', 'Strategic partnership alternative']
          },
          financialImpact: {
            estimatedValue: 50000000,
            currency: 'USD',
            timeHorizon: '2-3 years',
            confidenceLevel: 0.65,
            breakdown: [{
              category: 'Market Expansion',
              amount: 30000000,
              description: 'New market development costs'
            }, {
              category: 'Technology Investment',
              amount: 20000000,
              description: 'Platform and infrastructure upgrades'
            }]
          },
          strategicImplications: [
            'Market leadership positioning',
            'Competitive advantage creation',
            'Portfolio value enhancement',
            'LP value proposition strengthening'
          ],
          supportingData: [{
            id: 'market_analysis_2024',
            type: 'analysis',
            title: 'Market Opportunity Assessment 2024',
            source: 'Market Intelligence',
            relevanceScore: 0.98,
            lastUpdated: new Date()
          }],
          relatedDecisions: [],
          recommendations: []
        },
        targetDecision: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      expect(strategicWorkflow.priority).toBe('critical');
      expect(strategicWorkflow.context.riskAssessment.overallRisk).toBe('high');
      expect(strategicWorkflow.context.riskAssessment.categories).toHaveLength(2);
      expect(strategicWorkflow.context.financialImpact.estimatedValue).toBe(50000000);
      expect(strategicWorkflow.timeline.targetDecision).toBeDefined();
    });

    it('should process multi-stage approval workflow', async () => {
      const workflow = workflowEngine.createWorkflow({
        title: 'Large Scale Investment Decision',
        type: 'investment',
        priority: 'urgent',
        entityType: 'company',
        entityId: 'company_789',
        context: {
          summary: 'Major strategic investment requiring full committee approval',
          riskAssessment: {
            overallRisk: 'high',
            categories: [{
              type: 'financial',
              level: 'high',
              description: 'Significant capital commitment',
              impact: 0.9,
              probability: 0.3
            }],
            mitigationStrategies: [],
            contingencyPlans: []
          },
          financialImpact: {
            estimatedValue: 25000000,
            currency: 'USD',
            timeHorizon: '5 years',
            confidenceLevel: 0.70,
            breakdown: []
          },
          strategicImplications: [],
          supportingData: [],
          relatedDecisions: [],
          recommendations: []
        },
        targetDecision: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
      });

      // Simulate approval process
      expect(workflow.status).toBe('draft');

      // First approval - Portfolio Manager
      workflowEngine.processApproval(workflow.id, 'portfolio_manager', 'approved', 'Strong investment thesis');
      let updatedWorkflow = workflowEngine['workflows'].get(workflow.id)!;
      expect(updatedWorkflow.status).toBe('draft'); // Still pending other approvals

      // Second approval - Risk Manager
      workflowEngine.processApproval(workflow.id, 'risk_manager', 'approved', 'Risk profile acceptable with mitigation');
      updatedWorkflow = workflowEngine['workflows'].get(workflow.id)!;
      expect(updatedWorkflow.status).toBe('draft'); // Still pending committee

      // Third approval - Investment Committee
      workflowEngine.processApproval(workflow.id, 'investment_committee', 'approved', 'Committee recommendation: Proceed');
      updatedWorkflow = workflowEngine['workflows'].get(workflow.id)!;
      expect(updatedWorkflow.status).toBe('draft'); // Still pending final approval

      // Final approval - Managing Partner
      workflowEngine.processApproval(workflow.id, 'managing_partner', 'approved', 'Final approval granted');
      updatedWorkflow = workflowEngine['workflows'].get(workflow.id)!;
      expect(updatedWorkflow.status).toBe('approved'); // All approvals complete

      // Verify all approvals are marked as completed
      const completedApprovals = updatedWorkflow.requiredApprovals.filter(a => a.completed);
      expect(completedApprovals).toHaveLength(4);
    });

    it('should handle workflow rejection at any stage', () => {
      const workflow = workflowEngine.createWorkflow({
        title: 'Investment Decision with Rejection',
        type: 'investment',
        priority: 'medium',
        entityType: 'company',
        entityId: 'company_reject_test',
        context: {
          summary: 'Investment that will be rejected',
          riskAssessment: {
            overallRisk: 'high',
            categories: [],
            mitigationStrategies: [],
            contingencyPlans: []
          },
          financialImpact: {
            estimatedValue: 2000000,
            currency: 'USD',
            timeHorizon: '3 years',
            confidenceLevel: 0.60,
            breakdown: []
          },
          strategicImplications: [],
          supportingData: [],
          relatedDecisions: [],
          recommendations: []
        },
        targetDecision: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      });

      // First approval passes
      workflowEngine.processApproval(workflow.id, 'portfolio_manager', 'approved', 'Initial approval granted');

      // Risk manager rejects
      workflowEngine.processApproval(workflow.id, 'risk_manager', 'rejected', 'Risk profile unacceptable');

      const updatedWorkflow = workflowEngine['workflows'].get(workflow.id)!;
      expect(updatedWorkflow.status).toBe('rejected');

      // Verify that subsequent approvals don't change rejected status
      workflowEngine.processApproval(workflow.id, 'investment_committee', 'approved', 'Committee would have approved');
      const finalWorkflow = workflowEngine['workflows'].get(workflow.id)!;
      expect(finalWorkflow.status).toBe('rejected'); // Should remain rejected
    });

    it('should generate comprehensive workflow insights', () => {
      const workflow = workflowEngine.createWorkflow({
        title: 'Complex Investment for Insights',
        type: 'investment',
        priority: 'critical',
        entityType: 'company',
        entityId: 'company_insights',
        context: {
          summary: 'Complex deal requiring comprehensive analysis',
          riskAssessment: {
            overallRisk: 'high',
            categories: [
              {
                type: 'financial',
                level: 'high',
                description: 'Market volatility and capital requirements',
                impact: 0.8,
                probability: 0.6
              },
              {
                type: 'operational',
                level: 'medium',
                description: 'Execution complexity',
                impact: 0.6,
                probability: 0.5
              }
            ],
            mitigationStrategies: [],
            contingencyPlans: []
          },
          financialImpact: {
            estimatedValue: 15000000,
            currency: 'USD',
            timeHorizon: '4 years',
            confidenceLevel: 0.65,
            breakdown: []
          },
          strategicImplications: ['Market disruption potential', 'Technology leadership'],
          supportingData: [],
          relatedDecisions: [],
          recommendations: []
        },
        targetDecision: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // Short timeline
      });

      const insights = workflowEngine.getWorkflowInsights(workflow.id);

      expect(insights).toBeDefined();
      expect(insights.bottlenecks).toBeInstanceOf(Array);
      expect(insights.bottlenecks.length).toBeGreaterThan(0);
      expect(insights.predictions).toBeDefined();
      expect(insights.predictions.estimatedCompletion).toBeInstanceOf(Date);
      expect(insights.predictions.confidence).toBeGreaterThan(0);
      expect(insights.recommendations).toContain('Consider expedited review process');
      expect(insights.recommendations).toContain('Engage additional risk review');
      expect(insights.riskFactors).toBeInstanceOf(Array);
      expect(typeof insights.efficiency).toBe('number');
    });
  });

  describe('Data Quality Integration', () => {
    it('should factor data quality into workflow recommendations', async () => {
      const lowQualityIndicator: DataQualityIndicator = {
        score: 0.45, // Low quality score
        completeness: 0.60,
        accuracy: 0.40,
        freshness: 0.30,
        consistency: 0.50,
        lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days old
        issues: ['Missing financial statements', 'Outdated market data', 'Inconsistent metrics']
      };

      await dataSyncService.syncEntityData('company', 'company_low_quality', {
        insights: [],
        qualityIndicator: lowQualityIndicator,
        lastUpdated: new Date()
      });

      const workflow = workflowEngine.createWorkflow({
        title: 'Investment with Poor Data Quality',
        type: 'investment',
        priority: 'medium',
        entityType: 'company',
        entityId: 'company_low_quality',
        context: {
          summary: 'Investment decision with limited data quality',
          riskAssessment: {
            overallRisk: 'high',
            categories: [{
              type: 'operational',
              level: 'high',
              description: 'Data quality concerns affect decision confidence',
              impact: 0.7,
              probability: 0.8
            }],
            mitigationStrategies: [],
            contingencyPlans: []
          },
          financialImpact: {
            estimatedValue: 3000000,
            currency: 'USD',
            timeHorizon: '2 years',
            confidenceLevel: 0.45, // Low confidence due to data quality
            breakdown: []
          },
          strategicImplications: [],
          supportingData: [],
          relatedDecisions: [],
          recommendations: []
        },
        targetDecision: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      });

      const insights = workflowEngine.getWorkflowInsights(workflow.id);

      expect(workflow.context.financialImpact.confidenceLevel).toBeLessThan(0.5);
      expect(insights.recommendations).toContain('Engage additional risk review');
      expect(workflow.context.riskAssessment.categories.some(c => c.type === 'operational')).toBe(true);
    });
  });
});