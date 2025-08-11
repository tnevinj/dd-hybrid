import { NextRequest, NextResponse } from 'next/server';
import { WorkProduct, WorkProductUpdateRequest } from '@/types/work-product';

// Mock work product data - extend with the detailed work product
const mockWorkProducts: Record<string, WorkProduct> = {
  'wp-1': {
    id: 'wp-1',
    workspaceId: '1',
    title: 'TechCorp Due Diligence Report',
  type: 'DD_REPORT',
  status: 'IN_REVIEW',
  templateId: 'dd_report-standard',
  sections: [
    {
      id: 'exec-summary',
      title: 'Executive Summary',
      order: 1,
      content: `# Executive Summary

TechCorp represents a compelling investment opportunity in the enterprise SaaS market. The company has demonstrated strong growth with 45% year-over-year revenue growth and maintains healthy unit economics with an LTV/CAC ratio of 4.2x.

## Key Investment Highlights

1. **Market Leadership**: Leading position in the mid-market CRM segment with 15% market share
2. **Strong Financials**: $15M ARR with 95% revenue retention and expanding gross margins (82%)
3. **Proven Management**: Experienced leadership team with successful track record of building and scaling SaaS businesses
4. **Scalable Platform**: Modern, cloud-native architecture supporting rapid customer acquisition

## Investment Thesis

Our investment thesis centers on TechCorp's ability to capture significant market share in the underserved mid-market segment while maintaining strong unit economics and operational efficiency.`,
      type: 'text',
      required: true
    },
    {
      id: 'investment-thesis',
      title: 'Investment Thesis',
      order: 2,
      content: `# Investment Thesis

## Market Opportunity

The mid-market CRM segment represents a $2.8B TAM growing at 12% annually. TechCorp is well-positioned to capture this opportunity through:

### 1. Product-Market Fit
- Net Promoter Score of 72
- 95% customer retention rate
- Average ACV growth of 25% year-over-year

### 2. Competitive Advantages
- Superior user experience and ease of implementation
- Industry-specific features for manufacturing and services
- Strong integration ecosystem with 100+ third-party applications

### 3. Growth Strategy
- Geographic expansion into European markets
- Vertical-specific solutions for healthcare and financial services
- Strategic partnerships with consulting firms and system integrators`,
      type: 'text',
      required: true
    },
    {
      id: 'financial-analysis',
      title: 'Financial Analysis',
      order: 3,
      content: `# Financial Analysis

## Revenue Metrics
- Annual Recurring Revenue: $15.2M (+45% YoY)
- Monthly Recurring Revenue: $1.27M
- Average Revenue Per User: $2,400/year
- Revenue Retention: 95%

## Unit Economics
- Customer Acquisition Cost: $1,200
- Lifetime Value: $5,040
- LTV/CAC Ratio: 4.2x
- Payback Period: 14 months

## Profitability
- Gross Margin: 82%
- EBITDA Margin: -8% (approaching breakeven)
- Operating Margin: -12%
- Cash Burn Rate: $800K/month`,
      type: 'financial_block',
      required: true,
      template: 'financial-metrics-table'
    },
    {
      id: 'market-analysis',
      title: 'Market Analysis',
      order: 4,
      content: `# Market Analysis

## Total Addressable Market
- TAM: $12.8B (global CRM software market)
- SAM: $2.8B (mid-market CRM segment)
- SOM: $420M (serviceable obtainable market)

## Competitive Landscape
The CRM market is dominated by large players like Salesforce and HubSpot, but the mid-market segment remains fragmented with opportunities for specialized solutions.

### Key Competitors
1. **Salesforce** - Market leader but complex for mid-market
2. **HubSpot** - Strong in inbound marketing, growing CRM presence
3. **Zoho** - Cost-effective alternative with broad feature set
4. **Freshworks** - Emerging player with good mid-market traction

## Market Trends
- Increasing demand for industry-specific solutions
- Growing importance of mobile-first design
- Integration with AI and automation tools becoming standard`,
      type: 'text',
      required: true
    },
    {
      id: 'risk-assessment',
      title: 'Risk Assessment',
      order: 5,
      content: `# Risk Assessment

## Key Risks Identified

### High-Priority Risks
1. **Competitive Pressure** (Probability: Medium, Impact: High)
   - Risk of large competitors (Salesforce, HubSpot) targeting mid-market
   - Mitigation: Focus on vertical specialization and superior user experience

2. **Customer Concentration** (Probability: Low, Impact: Medium)
   - Top 10 customers represent 35% of revenue
   - Mitigation: Diversification strategy and expansion within existing accounts

### Medium-Priority Risks
1. **Technology Obsolescence** (Probability: Low, Impact: Medium)
   - Risk of platform becoming outdated
   - Mitigation: Continuous R&D investment and modern architecture

2. **Key Personnel Departure** (Probability: Medium, Impact: Medium)
   - Dependency on founder-CEO and core technical team
   - Mitigation: Succession planning and retention programs`,
      type: 'text',
      required: true
    },
    {
      id: 'recommendations',
      title: 'Recommendations',
      order: 6,
      content: `# Investment Recommendations

## Primary Recommendation: PROCEED TO INVESTMENT

Based on our comprehensive analysis, we recommend proceeding with the investment in TechCorp for the following reasons:

### Strong Investment Case
1. **Market Position**: Leading position in growing mid-market segment
2. **Financial Performance**: Strong growth with improving unit economics
3. **Management Team**: Experienced leadership with proven track record
4. **Technology Platform**: Modern, scalable architecture

### Proposed Terms
- Investment Amount: $50M Series B
- Valuation: $200M pre-money
- Board Seats: 2 of 7 seats
- Liquidation Preference: 1x non-participating preferred

### Key Conditions
1. Completion of legal due diligence
2. Reference calls with top 10 customers
3. Technical architecture review by our CTO
4. Management retention agreements

## Next Steps
1. Issue term sheet within 5 business days
2. Begin legal due diligence process
3. Schedule management presentations to IC
4. Plan post-investment value creation initiatives`,
      type: 'text',
      required: true
    }
  ],
  metadata: {
    dealName: 'TechCorp Acquisition',
    sector: 'Technology',
    investmentSize: '$50M',
    confidentialityLevel: 'Highly Confidential',
    documentClassification: 'Internal Use Only'
  },
  createdBy: 'user-1',
  lastEditedBy: 'user-2',
  assignedReviewers: ['user-3', 'user-4'],
  currentReviewer: 'user-3',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-21'),
  lastEditedAt: new Date('2024-01-21'),
  reviewDueDate: new Date('2024-01-25'),
  version: '1.2',
  versionHistory: [
    {
      id: 'v1',
      version: '1.0',
      createdBy: 'user-1',
      createdAt: new Date('2024-01-15'),
      changeLog: 'Initial document creation',
      snapshot: []
    },
    {
      id: 'v2',
      version: '1.1',
      createdBy: 'user-2',
      createdAt: new Date('2024-01-18'),
      changeLog: 'Added financial analysis section and updated market analysis',
      snapshot: []
    },
    {
      id: 'v3',
      version: '1.2',
      createdBy: 'user-2',
      createdAt: new Date('2024-01-21'),
      changeLog: 'Updated recommendations based on latest financial data',
      snapshot: []
    }
  ],
  wordCount: 2847,
  readingTime: 12,
  collaboratorCount: 3,
  commentCount: 8,
  editCount: 24
  },
  'wp-6': {
    id: 'wp-6',
    workspaceId: '6',
    title: 'SaaS Pipeline Screening Report',
    type: 'SCREENING_REPORT',
    status: 'IN_REVIEW',
    templateId: 'screening_report-standard',
    sections: [
      {
        id: 'exec-summary',
        title: 'Executive Summary',
        order: 1,
        content: `# Executive Summary

Our SaaS Startup Pipeline screening has identified 12 high-potential opportunities in the Series A space, with a combined addressable market of $850M and average revenue growth of 145% YoY.

## Key Screening Highlights

1. **Strong Pipeline Quality**: 75% of opportunities meet our core investment criteria
2. **Sector Focus**: Technology SaaS companies with B2B focus and scalable platforms
3. **Geographic Distribution**: Primarily North America (85%) with selective European opportunities
4. **Average Deal Size**: $25M Series A rounds with 15-18 month runway

Our screening process has filtered 120 initial opportunities down to 12 qualified prospects ready for deep due diligence evaluation.`,
        type: 'text',
        required: true
      },
      {
        id: 'screening-criteria',
        title: 'Screening Criteria & Methodology',
        order: 2,
        content: `# Screening Criteria & Methodology

## Primary Screening Filters

### Financial Criteria
- **Revenue Range**: $2M - $15M ARR
- **Growth Rate**: Minimum 100% YoY growth
- **Unit Economics**: LTV/CAC ratio >3x
- **Gross Margin**: >70% for software, >60% for services

### Market & Product Criteria
- **TAM Size**: Minimum $1B addressable market
- **Product-Market Fit**: Evidence of organic growth and customer retention >90%
- **Competitive Position**: Differentiated offering with defensible moats
- **Technology Stack**: Scalable architecture and modern tech foundation

### Team & Leadership
- **Management Experience**: Previous startup or scaling experience preferred
- **Technical Leadership**: Strong CTO/engineering leadership
- **Market Knowledge**: Deep domain expertise in target vertical
- **Growth Mindset**: Demonstrated ability to execute rapid scaling plans`,
        type: 'text',
        required: true
      },
      {
        id: 'pipeline-analysis',
        title: 'Pipeline Analysis & Results',
        order: 3,
        content: `# Pipeline Analysis & Results

## Screening Results Summary

**Total Opportunities Evaluated**: 120
**Passed Initial Screen**: 35 (29.2%)
**Advanced to Deep Screen**: 18 (15.0%)
**Qualified for Due Diligence**: 12 (10.0%)

## Top Qualified Opportunities

### Tier 1 - High Priority (Score 85-95)
1. **CloudAnalytics Pro** - $8M ARR, 180% growth, Marketing Analytics
2. **SecureAPI Hub** - $12M ARR, 145% growth, Developer Security Tools
3. **WorkflowAI** - $6M ARR, 220% growth, AI-Powered Business Automation

### Tier 2 - Strong Candidates (Score 75-84)
4. **DataVault Solutions** - $5M ARR, 165% growth, Enterprise Data Management
5. **ConnectCRM Plus** - $9M ARR, 125% growth, Vertical CRM for Healthcare
6. **DevOps Central** - $7M ARR, 190% growth, CI/CD Platform

### Tier 3 - Qualified Pipeline (Score 65-74)
7. **SupplyChain Insights** - $4M ARR, 155% growth, Supply Chain Analytics
8. **CustomerSuccess Hub** - $6M ARR, 135% growth, CS Platform
9. **FinanceFlow** - $8M ARR, 110% growth, SMB Financial Management

## Geographic Distribution
- **North America**: 10 opportunities (83%)
- **Europe**: 2 opportunities (17%)
- **Primary Markets**: San Francisco, Austin, Toronto, London`,
        type: 'text',
        required: true
      }
    ],
    tags: ['screening', 'saas', 'series-a', 'pipeline'],
    visibility: 'WORKSPACE',
    collaborators: [
      { id: 'alex-thompson', name: 'Alex Thompson', role: 'lead', permissions: ['read', 'write', 'comment'] },
      { id: 'rachel-martinez', name: 'Rachel Martinez', role: 'analyst', permissions: ['read', 'write', 'comment'] },
      { id: 'kevin-liu', name: 'Kevin Liu', role: 'contributor', permissions: ['read', 'comment'] },
      { id: 'sarah-park', name: 'Sarah Park', role: 'reviewer', permissions: ['read', 'comment'] }
    ],
    version: '1.2',
    versionHistory: [
      {
        id: 'v1',
        version: '1.0',
        createdBy: 'alex-thompson',
        createdAt: new Date('2024-01-20'),
        changeLog: 'Initial screening report creation',
        snapshot: []
      },
      {
        id: 'v2',
        version: '1.1',
        createdBy: 'rachel-martinez', 
        createdAt: new Date('2024-01-23'),
        changeLog: 'Added pipeline analysis and tier rankings',
        snapshot: []
      }
    ],
    wordCount: 1245,
    readingTime: 6,
    collaboratorCount: 4,
    commentCount: 12,
    editCount: 18
  },
  'wp-3': {
    id: 'wp-3',
    workspaceId: '3',
    title: 'RetailCo Deal Screening Report',
    type: 'SCREENING_REPORT',
    status: 'DRAFT',
    templateId: 'screening_report-standard',
    sections: [
      {
        id: 'exec-summary',
        title: 'Executive Summary',
        order: 1,
        content: `# Executive Summary\n\nRetailCo represents a solid growth opportunity in the European retail market, with strong fundamentals but moderate growth potential. The company shows steady performance with 25% year-over-year revenue growth.\n\n## Key Screening Results\n\n1. **Market Position**: Established player in specialty retail with regional dominance\n2. **Financial Health**: €35M revenue with improving margins and cash flow\n3. **Growth Potential**: Moderate expansion opportunities through digital transformation\n4. **Management Team**: Experienced leadership with strong operational background`,
        type: 'text',
        required: true
      }
    ],
    metadata: {
      dealName: 'RetailCo Growth Investment',
      sector: 'Retail',
      investmentSize: '€35M',
      confidentialityLevel: 'Confidential',
      documentClassification: 'Internal Use Only'
    },
    createdBy: 'tom-anderson',
    lastEditedBy: 'maria-rodriguez',
    assignedReviewers: ['james-lee'],
    currentReviewer: 'james-lee',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-22'),
    lastEditedAt: new Date('2024-01-22'),
    reviewDueDate: new Date('2024-01-28'),
    version: '1.1',
    versionHistory: [
      {
        id: 'v1',
        version: '1.0',
        createdBy: 'tom-anderson',
        createdAt: new Date('2024-01-18'),
        changeLog: 'Initial screening report creation',
        snapshot: []
      }
    ],
    wordCount: 456,
    readingTime: 3,
    collaboratorCount: 3,
    commentCount: 5,
    editCount: 8
  },
  'wp-4': {
    id: 'wp-4',
    workspaceId: '4',
    title: 'Manufacturing Portfolio Review Report',
    type: 'PORTFOLIO_REPORT',
    status: 'DRAFT',
    templateId: 'portfolio_report-standard',
    sections: [
      {
        id: 'exec-summary',
        title: 'Executive Summary',
        order: 1,
        content: `# Executive Summary\n\nOur manufacturing portfolio shows stable performance with opportunities for operational improvements and ESG enhancements. Portfolio value of $80M across 3 manufacturing assets.\n\n## Portfolio Highlights\n\n1. **Stable Returns**: Consistent cash flow generation across all assets\n2. **Operational Excellence**: Strong management teams with deep industry expertise\n3. **ESG Opportunities**: Significant potential for sustainability improvements\n4. **Market Position**: Well-positioned in defensive industrial sectors`,
        type: 'text',
        required: true
      }
    ],
    metadata: {
      dealName: 'Manufacturing Portfolio Review',
      sector: 'Manufacturing',
      investmentSize: '$80M',
      confidentialityLevel: 'Internal',
      documentClassification: 'Portfolio Review'
    },
    createdBy: 'kevin-zhang',
    lastEditedBy: 'sophie-miller',
    assignedReviewers: ['kevin-zhang'],
    currentReviewer: 'kevin-zhang',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
    lastEditedAt: new Date('2024-01-15'),
    reviewDueDate: new Date('2024-02-01'),
    version: '1.0',
    versionHistory: [
      {
        id: 'v1',
        version: '1.0',
        createdBy: 'kevin-zhang',
        createdAt: new Date('2024-01-10'),
        changeLog: 'Initial portfolio review creation',
        snapshot: []
      }
    ],
    wordCount: 324,
    readingTime: 2,
    collaboratorCount: 2,
    commentCount: 2,
    editCount: 3
  },
  'wp-techcorp': {
    id: 'wp-techcorp',
    workspaceId: '1',
    title: 'TechCorp Series B Screening Report',
    type: 'SCREENING_REPORT',
    status: 'IN_PROGRESS',
    templateId: 'screening_report-standard',
    sections: [
      {
        id: 'exec-summary',
        title: 'Executive Summary',
        order: 1,
        content: `# Executive Summary\n\nTechCorp Series B represents a high-potential investment opportunity in the enterprise AI software market. The company demonstrates exceptional growth metrics with 180% YoY revenue growth and strong market position.\n\n## Key Screening Highlights\n\n1. **Market Leadership**: AI-powered enterprise software with defensible moats\n2. **Financial Strength**: $50M Series B, strong unit economics, LTV/CAC of 5.2x\n3. **Growth Trajectory**: Rapid customer acquisition and expanding market presence\n4. **Technical Excellence**: Proprietary AI algorithms with patent protection\n\n**Recommendation**: PROCEED - High confidence investment opportunity with strong fundamentals and growth potential.`,
        type: 'text',
        required: true
      }
    ],
    metadata: {
      dealName: 'TechCorp Series B Investment',
      sector: 'Technology',
      investmentSize: '$50M',
      confidentialityLevel: 'Highly Confidential',
      documentClassification: 'Deal Screening'
    },
    createdBy: 'alex-thompson',
    lastEditedBy: 'rachel-martinez',
    assignedReviewers: ['kevin-liu'],
    currentReviewer: 'kevin-liu',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-24'),
    lastEditedAt: new Date('2024-01-24'),
    reviewDueDate: new Date('2024-01-30'),
    version: '1.3',
    versionHistory: [
      {
        id: 'v1',
        version: '1.0',
        createdBy: 'alex-thompson',
        createdAt: new Date('2024-01-20'),
        changeLog: 'Initial TechCorp screening report',
        snapshot: []
      }
    ],
    wordCount: 678,
    readingTime: 4,
    collaboratorCount: 3,
    commentCount: 15,
    editCount: 22
  },
  'wp-healthtech': {
    id: 'wp-healthtech',
    workspaceId: '2',
    title: 'HealthTech Solutions Screening Report',
    type: 'SCREENING_REPORT',
    status: 'APPROVED',
    templateId: 'screening_report-standard',
    sections: [
      {
        id: 'exec-summary',
        title: 'Executive Summary',
        order: 1,
        content: `# Executive Summary\n\nHealthTech Solutions presents a compelling investment in emerging market digital health infrastructure. Strong patient outcomes and sustainable business model with significant social impact.\n\n## Key Screening Results\n\n1. **Market Impact**: Digital health platform serving 500K+ patients across Africa\n2. **Financial Performance**: $25M revenue with 95% patient retention rates\n3. **Scalability**: Technology platform ready for rapid geographic expansion\n4. **ESG Alignment**: Strong social impact with measurable health outcomes\n\n**Recommendation**: APPROVED - Excellent strategic fit with high impact potential and solid financial returns.`,
        type: 'text',
        required: true
      }
    ],
    metadata: {
      dealName: 'HealthTech Solutions Investment',
      sector: 'Healthcare',
      investmentSize: '$25M',
      confidentialityLevel: 'Confidential',
      documentClassification: 'Deal Screening'
    },
    createdBy: 'sarah-park',
    lastEditedBy: 'michael-chen',
    assignedReviewers: ['sarah-park'],
    currentReviewer: 'sarah-park',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-22'),
    lastEditedAt: new Date('2024-01-22'),
    reviewDueDate: new Date('2024-01-26'),
    version: '2.0',
    versionHistory: [
      {
        id: 'v1',
        version: '1.0',
        createdBy: 'sarah-park',
        createdAt: new Date('2024-01-16'),
        changeLog: 'Initial HealthTech screening report',
        snapshot: []
      }
    ],
    wordCount: 542,
    readingTime: 3,
    collaboratorCount: 2,
    commentCount: 8,
    editCount: 14
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; workProductId: string } }
) {
  try {
    const workspaceId = params.id;
    const workProductId = params.workProductId;
    
    // In real implementation, fetch from database
    const workProduct = mockWorkProducts[workProductId];
    
    if (!workProduct || workProduct.workspaceId !== workspaceId) {
      return NextResponse.json(
        { error: 'Work product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(workProduct);
    
  } catch (error) {
    console.error('Error fetching work product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch work product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; workProductId: string } }
) {
  try {
    const workspaceId = params.id;
    const workProductId = params.workProductId;
    const updates: WorkProductUpdateRequest = await request.json();
    
    // In real implementation, update in database
    const workProduct = mockWorkProducts[workProductId];
    
    if (!workProduct || workProduct.workspaceId !== workspaceId) {
      return NextResponse.json(
        { error: 'Work product not found' },
        { status: 404 }
      );
    }
    
    // Mock update
    const updatedWorkProduct = {
      ...workProduct,
      ...updates,
      updatedAt: new Date(),
      lastEditedAt: new Date(),
      lastEditedBy: 'current-user',
      editCount: workProduct.editCount + 1,
      version: updates.sections ? '1.3' : workProduct.version
    };
    
    // Update word count if sections changed
    if (updates.sections) {
      updatedWorkProduct.wordCount = updates.sections.reduce(
        (count, section) => count + (section.content?.length || 0), 
        0
      );
      updatedWorkProduct.readingTime = Math.ceil(updatedWorkProduct.wordCount / 250);
      
      // Add to version history
      updatedWorkProduct.versionHistory = [
        ...mockWorkProduct.versionHistory,
        {
          id: `v${Date.now()}`,
          version: '1.3',
          createdBy: 'current-user',
          createdAt: new Date(),
          changeLog: 'Document content updated',
          snapshot: mockWorkProduct.sections
        }
      ];
    }
    
    return NextResponse.json(updatedWorkProduct);
    
  } catch (error) {
    console.error('Error updating work product:', error);
    return NextResponse.json(
      { error: 'Failed to update work product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; workProductId: string } }
) {
  try {
    const workspaceId = params.id;
    const workProductId = params.workProductId;
    
    // In real implementation, soft delete or hard delete
    if (workProductId !== 'wp-1' || workspaceId !== '1') {
      return NextResponse.json(
        { error: 'Work product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting work product:', error);
    return NextResponse.json(
      { error: 'Failed to delete work product' },
      { status: 500 }
    );
  }
}