import { WorkspaceService, TemplateService, WorkProductService } from '../src/lib/services/database';
import { DocumentSection, TemplateSection } from '../src/types/work-product';

// Seed workspaces with realistic PE/VC data
const seedWorkspaces = () => {
  console.log('Seeding workspaces...');
  
  const workspaces = [
    {
      name: 'TechCorp Due Diligence',
      type: 'deal' as const,
      status: 'active' as const,
      sector: 'Technology',
      deal_value: 5000000000, // $50M in cents
      stage: 'due-diligence',
      geography: 'North America',
      risk_rating: 'medium' as const,
      priority: 'high' as const,
      progress: 75,
      team_members: ['Sarah Chen', 'Mike Rodriguez', 'Alex Johnson', 'Lisa Park'],
      metadata: {
        target_close: '2024-Q1',
        deal_type: 'growth_equity',
        lead_partner: 'Sarah Chen',
        target_irr: 25,
        hold_period: 5,
        competitive_process: true,
        management_rollover: 30
      }
    },
    {
      name: 'HealthTech Acquisition',
      type: 'deal' as const,
      status: 'active' as const,
      sector: 'Healthcare',
      deal_value: 7500000000, // $75M in cents
      stage: 'investment-committee',
      geography: 'North America',
      risk_rating: 'high' as const,
      priority: 'high' as const,
      progress: 90,
      team_members: ['David Kim', 'Emma Watson', 'Carlos Silva'],
      metadata: {
        target_close: '2024-Q2',
        deal_type: 'buyout',
        regulatory_approval_required: true,
        synergies_identified: 15000000, // $15M
        management_retention: 85
      }
    },
    {
      name: 'RetailCo Portfolio Review',
      type: 'portfolio' as const,
      status: 'active' as const,
      sector: 'Retail',
      deal_value: 12000000000, // $120M in cents
      stage: 'portfolio-monitoring',
      geography: 'Global',
      risk_rating: 'medium' as const,
      priority: 'medium' as const,
      progress: 60,
      team_members: ['Jennifer Adams', 'Robert Taylor', 'Michelle Chang'],
      metadata: {
        investment_date: '2021-06-15',
        current_multiple: 2.1,
        distributions_to_date: 5000000000, // $50M
        next_milestone: 'exit_preparation'
      }
    },
    {
      name: 'FinTech Market Analysis',
      type: 'analysis' as const,
      status: 'active' as const,
      sector: 'Financial Services',
      stage: 'market-research',
      geography: 'North America',
      risk_rating: 'low' as const,
      priority: 'medium' as const,
      progress: 40,
      team_members: ['Thomas Anderson', 'Maria Gonzalez'],
      metadata: {
        market_size: 45000000000, // $450M market
        growth_rate: 12.5,
        key_trends: ['AI_adoption', 'regulatory_changes', 'consolidation'],
        target_segments: ['payments', 'lending', 'wealth_management']
      }
    },
    {
      name: 'Manufacturing Platform DD',
      type: 'deal' as const,
      status: 'draft' as const,
      sector: 'Manufacturing',
      deal_value: 15000000000, // $150M in cents
      stage: 'sourcing',
      geography: 'North America',
      risk_rating: 'medium' as const,
      priority: 'medium' as const,
      progress: 15,
      team_members: ['William Chen', 'Amanda Foster'],
      metadata: {
        deal_source: 'intermediary',
        competitive_dynamics: 'auction',
        management_presentation: '2024-02-15',
        key_risks: ['cyclical_exposure', 'regulatory_compliance', 'technology_disruption']
      }
    }
  ];

  workspaces.forEach(workspace => {
    try {
      const created = WorkspaceService.create(workspace);
      console.log(`✓ Created workspace: ${created.name}`);
    } catch (error) {
      console.error(`✗ Failed to create workspace ${workspace.name}:`, error);
    }
  });
};

// Seed templates with comprehensive PE/VC templates
const seedTemplates = () => {
  console.log('Seeding templates...');
  
  const templates = [
    {
      name: 'Investment Committee Memo',
      description: 'Comprehensive investment recommendation for committee approval',
      category: 'investment',
      work_product_type: 'IC_MEMO' as const,
      industry_focus: ['technology', 'healthcare', 'financial-services'],
      sections: [
        {
          id: 'exec-summary',
          title: 'Executive Summary',
          description: 'High-level investment recommendation and key highlights',
          order: 1,
          required: true,
          type: 'text' as const,
          generationStrategy: 'ai-generated' as const,
          estimatedLength: 300,
          aiPrompt: 'Generate an executive summary for this investment opportunity, highlighting the key investment thesis, financial metrics, and recommendation.',
          dataBindings: [
            { source: 'deal-metrics', field: 'deal_value', required: true },
            { source: 'deal-metrics', field: 'target_irr', required: false },
            { source: 'deal-metrics', field: 'sector', required: true }
          ],
          validationRules: [
            { type: 'min_length', value: 200 },
            { type: 'max_length', value: 500 },
            { type: 'required_keywords', value: ['recommendation', 'investment', 'return'] }
          ]
        },
        {
          id: 'investment-thesis',
          title: 'Investment Thesis',
          description: 'Strategic rationale and value creation plan',
          order: 2,
          required: true,
          type: 'text' as const,
          generationStrategy: 'hybrid' as const,
          estimatedLength: 500,
          aiPrompt: 'Develop a compelling investment thesis covering market opportunity, competitive advantages, and value creation strategies.',
          dataBindings: [
            { source: 'market-data', field: 'market_size', required: false },
            { source: 'competitive-analysis', field: 'competitive_position', required: false }
          ]
        },
        {
          id: 'financial-analysis',
          title: 'Financial Analysis & Projections',
          description: 'Financial metrics, projections, and valuation analysis',
          order: 3,
          required: true,
          type: 'financial_block' as const,
          generationStrategy: 'data-driven' as const,
          estimatedLength: 400,
          dataBindings: [
            { source: 'financial-model', field: 'revenue_projections', required: true },
            { source: 'financial-model', field: 'ebitda_projections', required: true },
            { source: 'financial-model', field: 'valuation_metrics', required: true }
          ]
        },
        {
          id: 'risk-assessment',
          title: 'Risk Assessment & Mitigation',
          description: 'Key risks and mitigation strategies',
          order: 4,
          required: true,
          type: 'text' as const,
          generationStrategy: 'ai-generated' as const,
          estimatedLength: 350,
          aiPrompt: 'Analyze key investment risks and provide detailed mitigation strategies for each identified risk.'
        },
        {
          id: 'deal-terms',
          title: 'Deal Structure & Terms',
          description: 'Investment structure, governance, and key terms',
          order: 5,
          required: true,
          type: 'text' as const,
          generationStrategy: 'hybrid' as const,
          estimatedLength: 250,
          dataBindings: [
            { source: 'deal-terms', field: 'investment_amount', required: true },
            { source: 'deal-terms', field: 'ownership_percentage', required: true },
            { source: 'deal-terms', field: 'board_composition', required: false }
          ]
        },
        {
          id: 'recommendation',
          title: 'Recommendation',
          description: 'Final investment recommendation and next steps',
          order: 6,
          required: true,
          type: 'text' as const,
          generationStrategy: 'ai-generated' as const,
          estimatedLength: 150,
          aiPrompt: 'Provide a clear investment recommendation with specific next steps and timeline.'
        }
      ] as TemplateSection[],
      dynamic_fields: [
        {
          id: 'deal-value',
          name: 'Deal Value',
          type: 'number',
          required: true,
          description: 'Total investment amount',
          placeholder: 'Enter deal value in millions'
        },
        {
          id: 'target-irr',
          name: 'Target IRR',
          type: 'number',
          required: false,
          description: 'Target internal rate of return',
          placeholder: 'Enter target IRR %'
        },
        {
          id: 'hold-period',
          name: 'Hold Period',
          type: 'select',
          required: false,
          description: 'Expected hold period',
          options: ['3-4 years', '4-5 years', '5-7 years', '7+ years']
        }
      ],
      ai_prompts: {
        'exec-summary': 'Generate an executive summary that captures the essence of this investment opportunity in a compelling but objective manner.',
        'investment-thesis': 'Develop a thorough investment thesis that would convince sophisticated institutional investors.',
        'risk-assessment': 'Conduct a comprehensive risk analysis considering market, operational, financial, and regulatory risks.'
      }
    },
    {
      name: 'Due Diligence Report',
      description: 'Comprehensive due diligence analysis and findings',
      category: 'analysis',
      work_product_type: 'DD_REPORT' as const,
      industry_focus: ['technology', 'healthcare', 'manufacturing', 'financial-services'],
      sections: [
        {
          id: 'executive-summary',
          title: 'Executive Summary',
          description: 'Overview of key findings and conclusions',
          order: 1,
          required: true,
          type: 'text' as const,
          generationStrategy: 'ai-generated' as const,
          estimatedLength: 400
        },
        {
          id: 'company-overview',
          title: 'Company Overview',
          description: 'Business model, products, and market position',
          order: 2,
          required: true,
          type: 'text' as const,
          generationStrategy: 'hybrid' as const,
          estimatedLength: 600
        },
        {
          id: 'market-analysis',
          title: 'Market Analysis',
          description: 'Market size, growth, competitive landscape',
          order: 3,
          required: true,
          type: 'text' as const,
          generationStrategy: 'data-driven' as const,
          estimatedLength: 500
        },
        {
          id: 'financial-analysis',
          title: 'Financial Analysis',
          description: 'Historical performance and projections',
          order: 4,
          required: true,
          type: 'financial_block' as const,
          generationStrategy: 'data-driven' as const,
          estimatedLength: 700
        },
        {
          id: 'management-assessment',
          title: 'Management Assessment',
          description: 'Management team evaluation and capabilities',
          order: 5,
          required: true,
          type: 'text' as const,
          generationStrategy: 'ai-generated' as const,
          estimatedLength: 300
        },
        {
          id: 'operational-review',
          title: 'Operational Review',
          description: 'Operations, technology, and scalability assessment',
          order: 6,
          required: true,
          type: 'text' as const,
          generationStrategy: 'hybrid' as const,
          estimatedLength: 500
        },
        {
          id: 'risk-analysis',
          title: 'Risk Analysis',
          description: 'Comprehensive risk assessment',
          order: 7,
          required: true,
          type: 'text' as const,
          generationStrategy: 'ai-generated' as const,
          estimatedLength: 400
        },
        {
          id: 'valuation',
          title: 'Valuation Analysis',
          description: 'Valuation methodologies and conclusions',
          order: 8,
          required: true,
          type: 'financial_block' as const,
          generationStrategy: 'data-driven' as const,
          estimatedLength: 350
        },
        {
          id: 'conclusions',
          title: 'Conclusions & Recommendations',
          description: 'Summary of findings and recommendations',
          order: 9,
          required: true,
          type: 'text' as const,
          generationStrategy: 'ai-generated' as const,
          estimatedLength: 250
        }
      ] as TemplateSection[]
    },
    {
      name: 'Investment Summary',
      description: 'Executive-level investment opportunity summary',
      category: 'investment',
      work_product_type: 'INVESTMENT_SUMMARY' as const,
      industry_focus: ['general'],
      sections: [
        {
          id: 'opportunity-overview',
          title: 'Investment Opportunity',
          description: 'High-level opportunity description',
          order: 1,
          required: true,
          type: 'text' as const,
          generationStrategy: 'ai-generated' as const,
          estimatedLength: 200
        },
        {
          id: 'key-metrics',
          title: 'Key Metrics',
          description: 'Essential financial and operational metrics',
          order: 2,
          required: true,
          type: 'financial_block' as const,
          generationStrategy: 'data-driven' as const,
          estimatedLength: 150
        },
        {
          id: 'investment-highlights',
          title: 'Investment Highlights',
          description: 'Key strengths and value drivers',
          order: 3,
          required: true,
          type: 'text' as const,
          generationStrategy: 'ai-generated' as const,
          estimatedLength: 300
        },
        {
          id: 'next-steps',
          title: 'Next Steps',
          description: 'Recommended actions and timeline',
          order: 4,
          required: true,
          type: 'text' as const,
          generationStrategy: 'ai-generated' as const,
          estimatedLength: 100
        }
      ] as TemplateSection[]
    }
  ];

  templates.forEach(template => {
    try {
      const created = TemplateService.create(template);
      console.log(`✓ Created template: ${created.name}`);
    } catch (error) {
      console.error(`✗ Failed to create template ${template.name}:`, error);
    }
  });
};

// Create sample work products
const seedWorkProducts = () => {
  console.log('Seeding work products...');
  
  const workspaces = WorkspaceService.getAll();
  const templates = TemplateService.getAll();
  
  if (workspaces.length === 0 || templates.length === 0) {
    console.log('No workspaces or templates found, skipping work product seeding');
    return;
  }

  const techCorpWorkspace = workspaces.find(w => w.name.includes('TechCorp'));
  const icMemoTemplate = templates.find(t => t.name.includes('Investment Committee'));
  
  if (techCorpWorkspace && icMemoTemplate) {
    const sampleSections: DocumentSection[] = [
      {
        id: 'exec-summary',
        title: 'Executive Summary',
        order: 1,
        content: `# Executive Summary

TechCorp represents a compelling $50M growth equity investment opportunity in the rapidly expanding B2B SaaS market. The company has demonstrated strong fundamentals with $15M ARR, 35% YoY growth, and industry-leading gross margins of 85%.

**Key Investment Highlights:**
- Market-leading position in workflow automation with 40% market share
- Exceptional unit economics: LTV/CAC of 4.2x, 98% net revenue retention
- Experienced management team with successful prior exits
- Clear expansion opportunities in adjacent markets worth $2B+

**Investment Recommendation:** Proceed with $50M investment at $150M pre-money valuation targeting 25% IRR over 5-year hold period.`,
        type: 'text',
        required: true,
        generationStrategy: 'ai-generated'
      },
      {
        id: 'investment-thesis',
        title: 'Investment Thesis',
        order: 2,
        content: `# Investment Thesis

## Market Opportunity
The workflow automation market represents a $12B TAM growing at 15% CAGR, driven by digital transformation initiatives and remote work adoption. TechCorp is positioned to capture significant share through its differentiated platform approach.

## Competitive Advantages
- **Technology Leadership:** Proprietary AI engine with 3 years of R&D investment
- **Customer Stickiness:** Average implementation takes 6 months, creating switching costs
- **Network Effects:** Platform becomes more valuable as customer base grows
- **Strategic Partnerships:** Exclusive integrations with major enterprise software providers

## Value Creation Plan
Our investment thesis centers on accelerating growth through:
1. **Market Expansion:** Geographic expansion into European markets
2. **Product Innovation:** AI-powered analytics and predictive capabilities  
3. **Strategic M&A:** Bolt-on acquisitions in adjacent workflow verticals
4. **Operational Leverage:** Scaling customer success and sales efficiency`,
        type: 'text',
        required: true,
        generationStrategy: 'ai-generated'
      }
    ];

    try {
      const workProduct = WorkProductService.create({
        workspace_id: techCorpWorkspace.id,
        title: 'TechCorp Investment Committee Memo',
        type: 'IC_MEMO',
        status: 'DRAFT',
        template_id: icMemoTemplate.id,
        sections: sampleSections,
        metadata: {
          projectContext: WorkspaceService.toProjectContext(techCorpWorkspace),
          generatedAt: new Date().toISOString(),
          generationMode: 'assisted'
        },
        created_by: 'sarah.chen@firm.com'
      });
      console.log(`✓ Created work product: ${workProduct.title}`);
    } catch (error) {
      console.error('✗ Failed to create sample work product:', error);
    }
  }
};

// Main seed function
const seedDatabase = () => {
  console.log('🌱 Starting database seeding...');
  
  try {
    seedWorkspaces();
    seedTemplates();
    seedWorkProducts();
    
    console.log('✅ Database seeding completed successfully!');
    
    // Print stats
    const workspaceStats = WorkspaceService.getStats();
    const templateStats = TemplateService.getStats();
    const workProductStats = WorkProductService.getStats();
    
    console.log('\n📊 Database Statistics:');
    console.log(`- Workspaces: ${workspaceStats.total} (${workspaceStats.active} active)`);
    console.log(`- Templates: ${templateStats.total}`);
    console.log(`- Work Products: ${workProductStats.total} (${workProductStats.draft} drafts)`);
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };