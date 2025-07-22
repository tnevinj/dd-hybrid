import { NextRequest, NextResponse } from 'next/server';
import { WorkProduct, WorkProductUpdateRequest } from '@/types/work-product';

// Mock work product data - extend with the detailed work product
const mockWorkProduct: WorkProduct = {
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
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; workProductId: string } }
) {
  try {
    const workspaceId = params.id;
    const workProductId = params.workProductId;
    
    // In real implementation, fetch from database
    if (workProductId !== 'wp-1' || workspaceId !== '1') {
      return NextResponse.json(
        { error: 'Work product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(mockWorkProduct);
    
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
    if (workProductId !== 'wp-1' || workspaceId !== '1') {
      return NextResponse.json(
        { error: 'Work product not found' },
        { status: 404 }
      );
    }
    
    // Mock update
    const updatedWorkProduct = {
      ...mockWorkProduct,
      ...updates,
      updatedAt: new Date(),
      lastEditedAt: new Date(),
      lastEditedBy: 'current-user',
      editCount: mockWorkProduct.editCount + 1,
      version: updates.sections ? '1.3' : mockWorkProduct.version
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