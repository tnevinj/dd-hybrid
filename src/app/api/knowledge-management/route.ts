import { NextResponse } from 'next/server';
import {
  KnowledgeManagementResponse,
  KnowledgeArticle,
  PopularArticle,
  ExpertSummary,
  LearningPath,
  KnowledgePattern,
  RecentActivity,
  CategoryMetrics,
  SearchTrend,
  KnowledgeStats,
  LearningProgress,
  KnowledgeRecommendation,
  ModuleDefinition
} from '@/types/knowledge-management';

// Mock data generation
const generateMockKnowledgeArticles = (): KnowledgeArticle[] => {
  const articles: KnowledgeArticle[] = [
    {
      id: 'art-001',
      title: 'Private Equity Due Diligence Framework: A Comprehensive Guide',
      slug: 'pe-due-diligence-framework',
      content: `# Private Equity Due Diligence Framework

## Introduction
Due diligence is the cornerstone of successful private equity investing. This comprehensive framework outlines the systematic approach to evaluating potential investments, covering financial, operational, legal, and strategic considerations.

## Key Components

### Financial Due Diligence
- Historical performance analysis
- Quality of earnings assessment
- Cash flow modeling and projections
- Working capital analysis
- Debt structure evaluation

### Commercial Due Diligence
- Market size and growth assessment
- Competitive positioning analysis
- Customer concentration and retention
- Revenue sustainability evaluation
- Growth strategy validation

### Operational Due Diligence
- Management team assessment
- Operational efficiency review
- Technology infrastructure evaluation
- Supply chain analysis
- Scalability assessment

## Best Practices
1. Start with a hypothesis-driven approach
2. Focus on key value drivers
3. Conduct thorough reference checks
4. Validate management projections
5. Assess downside scenarios

## Conclusion
A disciplined due diligence process significantly improves investment outcomes by identifying risks and opportunities early in the process.`,
      summary: 'Comprehensive framework for conducting thorough due diligence on private equity investments, covering financial, commercial, and operational aspects.',
      category: 'DUE_DILIGENCE',
      subcategory: 'Investment Process',
      articleType: 'PLAYBOOK',
      readingTime: 15,
      difficulty: 'INTERMEDIATE',
      language: 'en',
      tags: ['due-diligence', 'investment-process', 'framework', 'private-equity'],
      keywords: ['due diligence', 'private equity', 'investment', 'framework', 'analysis'],
      importance: 'HIGH',
      confidence: 0.95,
      verificationStatus: 'EXPERT_VERIFIED',
      status: 'PUBLISHED',
      publishedAt: new Date('2024-06-15'),
      lastReviewedAt: new Date('2024-07-01'),
      nextReviewDue: new Date('2024-12-01'),
      viewCount: 2847,
      likeCount: 156,
      downloadCount: 423,
      shareCount: 89,
      visibility: 'INTERNAL',
      accessLevel: 'ALL',
      authorId: 'user-001',
      createdAt: new Date('2024-06-10'),
      updatedAt: new Date('2024-07-01'),
      averageRating: 4.6,
      ratingCount: 32,
    },
    {
      id: 'art-002',
      title: 'ESG Integration in Private Equity: From Compliance to Value Creation',
      slug: 'esg-integration-private-equity',
      content: `# ESG Integration in Private Equity

## Executive Summary
Environmental, Social, and Governance (ESG) factors have evolved from compliance requirements to strategic value drivers in private equity. This article explores practical approaches to ESG integration throughout the investment lifecycle.

## ESG Value Creation Framework

### Pre-Investment Stage
- ESG risk assessment and scoring
- Regulatory compliance evaluation
- Stakeholder mapping and engagement
- ESG improvement opportunity identification

### Post-Investment Stage
- ESG governance structure implementation
- KPI monitoring and reporting
- Operational improvements and initiatives
- Stakeholder communication and transparency

## Case Studies
### Case Study 1: Manufacturing Company Transformation
A portfolio company reduced carbon emissions by 40% and improved employee satisfaction scores by 25% through targeted ESG initiatives, resulting in a 15% valuation premium at exit.

### Case Study 2: Technology Services ESG Program
Implementation of comprehensive diversity and inclusion programs led to improved talent retention and customer satisfaction, contributing to accelerated revenue growth.

## Implementation Roadmap
1. Develop ESG assessment framework
2. Integrate into investment committee processes
3. Build portfolio company capabilities
4. Establish monitoring and reporting systems
5. Create exit preparation processes

## Conclusion
ESG integration creates sustainable competitive advantages and enhances long-term value creation in private equity investments.`,
      summary: 'Strategic guide for integrating ESG considerations into private equity investment processes, featuring case studies and implementation frameworks.',
      category: 'INVESTMENT_STRATEGY',
      subcategory: 'ESG',
      articleType: 'BEST_PRACTICE',
      readingTime: 12,
      difficulty: 'ADVANCED',
      language: 'en',
      tags: ['esg', 'sustainability', 'value-creation', 'portfolio-management'],
      keywords: ['ESG', 'environmental', 'social', 'governance', 'sustainability'],
      importance: 'HIGH',
      confidence: 0.92,
      verificationStatus: 'PEER_REVIEWED',
      status: 'PUBLISHED',
      publishedAt: new Date('2024-07-10'),
      lastReviewedAt: new Date('2024-07-15'),
      viewCount: 1923,
      likeCount: 134,
      downloadCount: 287,
      shareCount: 67,
      visibility: 'INTERNAL',
      accessLevel: 'ALL',
      authorId: 'user-002',
      createdAt: new Date('2024-07-05'),
      updatedAt: new Date('2024-07-15'),
      averageRating: 4.4,
      ratingCount: 28,
    },
    {
      id: 'art-003',
      title: 'Portfolio Company Value Creation: Operational Excellence Playbook',
      slug: 'portfolio-value-creation-operational-excellence',
      content: `# Portfolio Company Value Creation: Operational Excellence

## Overview
This playbook outlines proven strategies for driving operational improvements in portfolio companies, focusing on sustainable value creation through operational excellence initiatives.

## Core Value Creation Levers

### Revenue Enhancement
- Sales process optimization
- Customer segmentation and targeting
- Pricing strategy refinement
- Market expansion opportunities
- Product/service innovation

### Cost Optimization
- Process automation and digitization
- Supplier relationship management
- Organizational restructuring
- Technology infrastructure improvements
- Energy efficiency programs

### Working Capital Management
- Inventory optimization
- Accounts receivable management
- Payment terms negotiation
- Cash conversion cycle improvement

## Implementation Framework

### Phase 1: Assessment (Months 1-3)
- Current state analysis
- Benchmarking against best practices
- Opportunity identification and sizing
- Quick wins implementation

### Phase 2: Transformation (Months 4-18)
- Major initiative rollout
- Change management programs
- Performance monitoring systems
- Continuous improvement culture

### Phase 3: Optimization (Months 19-24)
- Fine-tuning and optimization
- Advanced analytics implementation
- Capability building and knowledge transfer
- Exit preparation

## Success Metrics
- EBITDA margin improvement
- Revenue growth acceleration
- Cash conversion cycle reduction
- Customer satisfaction scores
- Employee engagement metrics

## Key Success Factors
1. Strong leadership commitment
2. Clear communication and change management
3. Robust project management
4. Regular monitoring and course correction
5. Stakeholder alignment and buy-in

## Conclusion
Systematic operational excellence programs can deliver 15-25% EBITDA improvements while building sustainable competitive advantages.`,
      summary: 'Comprehensive playbook for driving operational improvements and value creation in private equity portfolio companies.',
      category: 'PORTFOLIO_MANAGEMENT',
      subcategory: 'Value Creation',
      articleType: 'PLAYBOOK',
      readingTime: 18,
      difficulty: 'INTERMEDIATE',
      language: 'en',
      tags: ['value-creation', 'operational-excellence', 'portfolio-management', 'process-improvement'],
      keywords: ['value creation', 'operational excellence', 'portfolio company', 'EBITDA'],
      importance: 'CRITICAL',
      confidence: 0.96,
      verificationStatus: 'EXPERT_VERIFIED',
      status: 'PUBLISHED',
      publishedAt: new Date('2024-05-20'),
      viewCount: 3456,
      likeCount: 198,
      downloadCount: 567,
      shareCount: 123,
      visibility: 'INTERNAL',
      accessLevel: 'ALL',
      authorId: 'user-003',
      createdAt: new Date('2024-05-15'),
      updatedAt: new Date('2024-06-20'),
      averageRating: 4.8,
      ratingCount: 45,
    },
    {
      id: 'art-004',
      title: 'Market Analysis Methodology for Growth Equity Investments',
      slug: 'market-analysis-growth-equity',
      content: `# Market Analysis Methodology for Growth Equity

## Introduction
Comprehensive market analysis is critical for successful growth equity investments. This methodology provides a structured approach to evaluating market opportunities and competitive dynamics.

## Market Sizing Framework

### Total Addressable Market (TAM)
- Top-down approach using industry reports
- Bottom-up calculation based on customer segments
- Cross-validation with multiple sources
- Geographic expansion considerations

### Serviceable Available Market (SAM)
- Addressable market subset analysis
- Regulatory and competitive constraints
- Technology and capability requirements
- Channel accessibility evaluation

### Serviceable Obtainable Market (SOM)
- Realistic market share projections
- Competitive positioning assessment
- Resource and capability analysis
- Time-to-market considerations

## Competitive Analysis

### Direct Competitors
- Market share analysis
- Competitive positioning maps
- Strengths and weaknesses assessment
- Strategic direction evaluation

### Indirect Competition
- Substitute products and services
- Alternative solutions analysis
- Threat of new entrants
- Supplier and buyer power dynamics

## Growth Drivers Assessment
1. Market growth trends and catalysts
2. Regulatory changes and impacts
3. Technology disruption potential
4. Customer behavior evolution
5. Macroeconomic factors

## Risk Factors Evaluation
- Market saturation risks
- Competitive response threats
- Regulatory compliance challenges
- Technology obsolescence risks
- Customer concentration concerns

## Market Entry Strategy
- Go-to-market approach optimization
- Channel partner identification
- Pricing strategy development
- Customer acquisition cost analysis
- Scaling strategy formulation

## Conclusion
Rigorous market analysis enables better investment decisions and portfolio company value creation strategies.`,
      summary: 'Structured methodology for conducting comprehensive market analysis in growth equity investment scenarios.',
      category: 'MARKET_ANALYSIS',
      subcategory: 'Growth Equity',
      articleType: 'TEMPLATE',
      readingTime: 14,
      difficulty: 'INTERMEDIATE',
      language: 'en',
      tags: ['market-analysis', 'growth-equity', 'competitive-analysis', 'tam-sam-som'],
      keywords: ['market analysis', 'growth equity', 'TAM', 'SAM', 'SOM', 'competitive analysis'],
      importance: 'HIGH',
      confidence: 0.89,
      verificationStatus: 'PEER_REVIEWED',
      status: 'PUBLISHED',
      publishedAt: new Date('2024-06-25'),
      viewCount: 1654,
      likeCount: 87,
      downloadCount: 234,
      shareCount: 45,
      visibility: 'INTERNAL',
      accessLevel: 'ALL',
      authorId: 'user-004',
      createdAt: new Date('2024-06-20'),
      updatedAt: new Date('2024-07-05'),
      averageRating: 4.2,
      ratingCount: 19,
    },
    {
      id: 'art-005',
      title: 'Regulatory Compliance in Financial Services Investments',
      slug: 'regulatory-compliance-financial-services',
      content: `# Regulatory Compliance in Financial Services

## Regulatory Landscape Overview
The financial services sector faces complex and evolving regulatory requirements across multiple jurisdictions. This guide provides a framework for navigating compliance challenges in financial services investments.

## Key Regulatory Areas

### Banking and Lending
- Basel III capital requirements
- Dodd-Frank compliance
- Consumer protection regulations
- Anti-money laundering (AML) requirements

### Insurance
- Solvency II requirements
- Risk-based capital standards
- Consumer protection measures
- Claims handling regulations

### Asset Management
- Investment Company Act compliance
- Fiduciary duty requirements
- Fee transparency regulations
- ESG disclosure mandates

## Compliance Framework

### Risk Assessment
1. Regulatory mapping and inventory
2. Compliance gap analysis
3. Regulatory change monitoring
4. Impact assessment protocols

### Implementation
1. Policy and procedure development
2. Control system implementation
3. Training and awareness programs
4. Monitoring and testing procedures

### Ongoing Management
1. Regular compliance reviews
2. Regulatory reporting requirements
3. Audit and examination preparation
4. Remediation and corrective actions

## Due Diligence Considerations
- Regulatory history and violations
- Pending regulatory actions
- Management compliance culture
- Systems and controls effectiveness
- Third-party compliance risks

## Best Practices
1. Proactive regulatory monitoring
2. Strong compliance culture
3. Regular training and updates
4. Technology-enabled monitoring
5. Expert legal counsel engagement

## Emerging Trends
- Digital asset regulations
- Open banking requirements
- Data privacy and cybersecurity
- Climate risk disclosures
- Artificial intelligence governance

## Conclusion
Robust regulatory compliance programs are essential for successful financial services investments and long-term value preservation.`,
      summary: 'Comprehensive guide to regulatory compliance considerations for private equity investments in financial services companies.',
      category: 'REGULATORY',
      subcategory: 'Financial Services',
      articleType: 'RESEARCH',
      readingTime: 16,
      difficulty: 'ADVANCED',
      language: 'en',
      tags: ['regulatory', 'compliance', 'financial-services', 'risk-management'],
      keywords: ['regulatory compliance', 'financial services', 'Basel III', 'Dodd-Frank'],
      importance: 'HIGH',
      confidence: 0.94,
      verificationStatus: 'EXPERT_VERIFIED',
      status: 'PUBLISHED',
      publishedAt: new Date('2024-04-15'),
      viewCount: 2134,
      likeCount: 123,
      downloadCount: 345,
      shareCount: 78,
      visibility: 'INTERNAL',
      accessLevel: 'ALL',
      authorId: 'user-005',
      createdAt: new Date('2024-04-10'),
      updatedAt: new Date('2024-05-15'),
      averageRating: 4.5,
      ratingCount: 26,
    }
  ];

  return articles;
};

const generatePopularArticles = (articles: KnowledgeArticle[]): PopularArticle[] => {
  return articles.map(article => ({
    id: article.id,
    title: article.title,
    category: article.category,
    viewCount: article.viewCount,
    averageRating: article.averageRating || 0,
    readingTime: article.readingTime,
    publishedAt: article.publishedAt,
    trend: article.viewCount > 2500 ? 'RISING' : article.viewCount > 1500 ? 'STABLE' : 'DECLINING'
  })).sort((a, b) => b.viewCount - a.viewCount);
};

const generateExpertSummaries = (): ExpertSummary[] => {
  return [
    {
      id: 'expert-001',
      userId: 'user-001',
      name: 'Sarah Chen',
      primaryExpertise: 'Due Diligence & Investment Analysis',
      articlesAuthored: 12,
      averageRating: 4.7,
      responseTime: '< 4 hours',
      isAvailable: true,
    },
    {
      id: 'expert-002',
      userId: 'user-002',
      name: 'Michael Rodriguez',
      primaryExpertise: 'ESG & Sustainable Investing',
      articlesAuthored: 8,
      averageRating: 4.5,
      responseTime: '< 8 hours',
      isAvailable: true,
    },
    {
      id: 'expert-003',
      userId: 'user-003',
      name: 'Emily Johnson',
      primaryExpertise: 'Portfolio Management & Value Creation',
      articlesAuthored: 15,
      averageRating: 4.8,
      responseTime: '< 2 hours',
      isAvailable: true,
    },
    {
      id: 'expert-004',
      userId: 'user-004',
      name: 'David Kumar',
      primaryExpertise: 'Market Analysis & Growth Strategy',
      articlesAuthored: 6,
      averageRating: 4.3,
      responseTime: '< 6 hours',
      isAvailable: false,
    },
    {
      id: 'expert-005',
      userId: 'user-005',
      name: 'Jennifer Wong',
      primaryExpertise: 'Regulatory Compliance & Risk Management',
      articlesAuthored: 9,
      averageRating: 4.6,
      responseTime: '< 12 hours',
      isAvailable: true,
    },
    {
      id: 'expert-006',
      userId: 'user-006',
      name: 'Robert Thompson',
      primaryExpertise: 'Technology & Digital Transformation',
      articlesAuthored: 11,
      averageRating: 4.4,
      responseTime: '< 4 hours',
      isAvailable: true,
    }
  ];
};

const generateLearningPaths = (): LearningPath[] => {
  const modules1: ModuleDefinition[] = [
    {
      id: 'mod-001',
      title: 'Private Equity Fundamentals',
      description: 'Introduction to private equity structure, strategy, and lifecycle',
      articleIds: ['art-001', 'art-003'],
      estimatedHours: 4,
      order: 1,
      isRequired: true,
    },
    {
      id: 'mod-002',
      title: 'Due Diligence Deep Dive',
      description: 'Comprehensive due diligence methodologies and frameworks',
      articleIds: ['art-001'],
      estimatedHours: 6,
      order: 2,
      isRequired: true,
    },
    {
      id: 'mod-003',
      title: 'Value Creation Strategies',
      description: 'Operational excellence and value creation in portfolio companies',
      articleIds: ['art-003'],
      estimatedHours: 5,
      order: 3,
      isRequired: true,
    }
  ];

  const modules2: ModuleDefinition[] = [
    {
      id: 'mod-004',
      title: 'ESG Fundamentals',
      description: 'Introduction to ESG principles and frameworks',
      articleIds: ['art-002'],
      estimatedHours: 3,
      order: 1,
      isRequired: true,
    },
    {
      id: 'mod-005',
      title: 'ESG Integration',
      description: 'Practical ESG integration throughout investment lifecycle',
      articleIds: ['art-002'],
      estimatedHours: 4,
      order: 2,
      isRequired: true,
    }
  ];

  return [
    {
      id: 'path-001',
      title: 'Private Equity Analyst Certification',
      description: 'Comprehensive training program for new private equity analysts covering due diligence, valuation, and portfolio management fundamentals.',
      pathType: 'CERTIFICATION',
      targetRole: 'ANALYST',
      difficulty: 'INTERMEDIATE',
      modules: modules1,
      prerequisites: ['Basic finance knowledge', 'Accounting fundamentals'],
      estimatedHours: 15,
      completionRate: 0.78,
      averageRating: 4.6,
      enrollmentCount: 45,
      status: 'ACTIVE',
      tags: ['certification', 'analyst', 'fundamentals'],
      category: 'INVESTMENT_STRATEGY',
      createdBy: 'user-001',
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-06-15'),
    },
    {
      id: 'path-002',
      title: 'ESG Integration Masterclass',
      description: 'Advanced program focusing on ESG integration strategies, impact measurement, and sustainable value creation in private equity.',
      pathType: 'SKILL_DEVELOPMENT',
      difficulty: 'ADVANCED',
      modules: modules2,
      estimatedHours: 7,
      completionRate: 0.65,
      averageRating: 4.4,
      enrollmentCount: 23,
      status: 'ACTIVE',
      tags: ['esg', 'sustainability', 'advanced'],
      category: 'INVESTMENT_STRATEGY',
      createdBy: 'user-002',
      createdAt: new Date('2024-04-15'),
      updatedAt: new Date('2024-07-01'),
    },
    {
      id: 'path-003',
      title: 'New Hire Onboarding',
      description: 'Comprehensive onboarding program for new team members covering firm culture, investment philosophy, and operational procedures.',
      pathType: 'ONBOARDING',
      difficulty: 'BEGINNER',
      modules: modules1.slice(0, 1),
      estimatedHours: 12,
      completionRate: 0.92,
      averageRating: 4.2,
      enrollmentCount: 67,
      status: 'ACTIVE',
      tags: ['onboarding', 'culture', 'basics'],
      createdBy: 'user-006',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-05-20'),
    }
  ];
};

const generateKnowledgePatterns = (): KnowledgePattern[] => {
  return [
    {
      id: 'pattern-001',
      name: 'Due Diligence Content Correlation',
      description: 'Strong correlation between detailed due diligence articles and high engagement rates',
      patternType: 'CONTENT_PATTERN',
      pattern: {
        rule: 'Articles with "due diligence" in title or tags show 40% higher engagement',
        metrics: {
          avgViews: 2847,
          avgRating: 4.6,
          avgShares: 89
        }
      },
      confidence: 0.87,
      strength: 'STRONG',
      articleIds: ['art-001'],
      categories: ['DUE_DILIGENCE', 'INVESTMENT_STRATEGY'],
      timeframe: 'Last 6 months',
      detectedAt: new Date('2024-07-15'),
      detectedBy: 'SYSTEM',
      algorithm: 'Content Analysis ML',
      isValidated: true,
      validatedBy: 'user-001',
      validatedAt: new Date('2024-07-16'),
      insights: [
        {
          id: 'insight-001',
          insight: 'Practical frameworks and checklists drive higher user engagement',
          confidence: 0.85,
          impact: 'HIGH',
          evidence: ['Higher download rates', 'More comments and questions', 'Increased bookmarking'],
          actionable: true
        }
      ],
      recommendations: [
        {
          id: 'rec-001',
          recommendation: 'Create more template-based and framework articles',
          priority: 'HIGH',
          effort: 'MEDIUM',
          expectedValue: 'Increased user engagement and knowledge retention'
        }
      ],
      businessValue: 'Higher engagement leads to better knowledge retention and decision quality',
      createdAt: new Date('2024-07-15'),
      updatedAt: new Date('2024-07-16'),
    },
    {
      id: 'pattern-002',
      name: 'ESG Content Growth Trend',
      description: 'Increasing interest and engagement with ESG-related content over time',
      patternType: 'TREND_PATTERN',
      pattern: {
        rule: 'ESG content views increased 65% over last quarter',
        metrics: {
          quarterlyGrowth: 0.65,
          searchQueries: 234,
          newArticles: 3
        }
      },
      confidence: 0.78,
      strength: 'STRONG',
      articleIds: ['art-002'],
      categories: ['INVESTMENT_STRATEGY'],
      timeframe: 'Last quarter',
      detectedAt: new Date('2024-07-18'),
      detectedBy: 'SYSTEM',
      algorithm: 'Trend Analysis',
      isValidated: false,
      insights: [
        {
          id: 'insight-002',
          insight: 'Growing regulatory focus is driving increased ESG content consumption',
          confidence: 0.75,
          impact: 'MEDIUM',
          evidence: ['Regulatory deadline correlation', 'Search term analysis'],
          actionable: true
        }
      ],
      recommendations: [
        {
          id: 'rec-002',
          recommendation: 'Expand ESG content library with sector-specific guidance',
          priority: 'MEDIUM',
          effort: 'HIGH',
          expectedValue: 'Meet growing demand and establish thought leadership'
        }
      ],
      createdAt: new Date('2024-07-18'),
      updatedAt: new Date('2024-07-18'),
    }
  ];
};

const generateRecentActivity = (): RecentActivity[] => {
  return [
    {
      id: 'activity-001',
      type: 'ARTICLE_PUBLISHED',
      description: 'Published new article on ESG integration strategies',
      userName: 'Michael Rodriguez',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      articleId: 'art-002',
      articleTitle: 'ESG Integration in Private Equity'
    },
    {
      id: 'activity-002',
      type: 'PATTERN_DETECTED',
      description: 'AI detected new content engagement pattern in due diligence articles',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
    },
    {
      id: 'activity-003',
      type: 'COMMENT_ADDED',
      description: 'Added expert commentary on portfolio management best practices',
      userName: 'Emily Johnson',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      articleId: 'art-003',
      articleTitle: 'Portfolio Company Value Creation'
    },
    {
      id: 'activity-004',
      type: 'PATH_COMPLETED',
      description: 'Completed Private Equity Analyst Certification program',
      userName: 'Alex Chen',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000)
    },
    {
      id: 'activity-005',
      type: 'ARTICLE_PUBLISHED',
      description: 'Updated market analysis methodology template',
      userName: 'David Kumar',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      articleId: 'art-004',
      articleTitle: 'Market Analysis Methodology'
    }
  ];
};

const generateCategoryMetrics = (): CategoryMetrics[] => {
  return [
    {
      category: 'DUE_DILIGENCE',
      articleCount: 8,
      viewCount: 15234,
      averageRating: 4.5,
      expertCount: 3,
      trending: true
    },
    {
      category: 'INVESTMENT_STRATEGY',
      articleCount: 12,
      viewCount: 23456,
      averageRating: 4.3,
      expertCount: 5,
      trending: true
    },
    {
      category: 'PORTFOLIO_MANAGEMENT',
      articleCount: 6,
      viewCount: 18765,
      averageRating: 4.7,
      expertCount: 2,
      trending: false
    },
    {
      category: 'MARKET_ANALYSIS',
      articleCount: 4,
      viewCount: 8934,
      averageRating: 4.1,
      expertCount: 2,
      trending: false
    },
    {
      category: 'REGULATORY',
      articleCount: 5,
      viewCount: 12345,
      averageRating: 4.4,
      expertCount: 1,
      trending: false
    },
    {
      category: 'OPERATIONAL',
      articleCount: 7,
      viewCount: 14567,
      averageRating: 4.2,
      expertCount: 3,
      trending: false
    }
  ];
};

const generateSearchTrends = (): SearchTrend[] => {
  return [
    {
      query: 'due diligence checklist',
      searchCount: 156,
      successRate: 0.78,
      trend: 'UP',
      relatedCategories: ['DUE_DILIGENCE', 'INVESTMENT_STRATEGY']
    },
    {
      query: 'ESG integration framework',
      searchCount: 89,
      successRate: 0.85,
      trend: 'UP',
      relatedCategories: ['INVESTMENT_STRATEGY']
    },
    {
      query: 'portfolio value creation',
      searchCount: 134,
      successRate: 0.72,
      trend: 'STABLE',
      relatedCategories: ['PORTFOLIO_MANAGEMENT']
    },
    {
      query: 'market sizing methodology',
      searchCount: 67,
      successRate: 0.69,
      trend: 'DOWN',
      relatedCategories: ['MARKET_ANALYSIS']
    },
    {
      query: 'regulatory compliance guide',
      searchCount: 45,
      successRate: 0.82,
      trend: 'UP',
      relatedCategories: ['REGULATORY']
    }
  ];
};

const generateLearningProgress = (paths: LearningPath[]): LearningProgress[] => {
  return paths.map(path => ({
    pathId: path.id,
    pathTitle: path.title,
    enrolledUsers: path.enrollmentCount,
    completedUsers: Math.floor(path.enrollmentCount * (path.completionRate || 0.7)),
    averageCompletionTime: (path.estimatedHours || 10) * 1.2,
    averageRating: path.averageRating || 4.0,
    dropoutRate: (1 - (path.completionRate || 0.7)) * 100
  }));
};

export async function GET() {
  try {
    const articles = generateMockKnowledgeArticles();
    const popularArticles = generatePopularArticles(articles);
    const experts = generateExpertSummaries();
    const learningPaths = generateLearningPaths();
    const patterns = generateKnowledgePatterns();
    const recentActivity = generateRecentActivity();
    const categoryMetrics = generateCategoryMetrics();
    const searchTrends = generateSearchTrends();
    const learningProgress = generateLearningProgress(learningPaths);

    const stats: KnowledgeStats = {
      totalArticles: articles.length + 15, // Including unpublished articles
      publishedArticles: articles.filter(a => a.status === 'PUBLISHED').length,
      expertProfiles: experts.length,
      learningPaths: learningPaths.length,
      activeEnrollments: learningProgress.reduce((sum, p) => sum + p.enrolledUsers, 0),
      totalViews: articles.reduce((sum, a) => sum + a.viewCount, 0),
      searchQueries: searchTrends.reduce((sum, t) => sum + t.searchCount, 0),
      patterns: patterns.length,
    };

    const response: KnowledgeManagementResponse = {
      stats,
      articles,
      popularArticles,
      recentActivity,
      categoryMetrics,
      searchTrends,
      experts,
      learningPaths,
      learningProgress,
      patterns,
      recommendations: [], // Would be populated with personalized recommendations
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in knowledge management API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch knowledge management data' },
      { status: 500 }
    );
  }
}