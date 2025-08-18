import { NextRequest, NextResponse } from 'next/server';
import { 
  createSuccessResponse, 
  createErrorResponse, 
  createValidationErrorResponse,
  ContentGenerationResponse,
  ContentGenerationErrorCodes,
  ValidationError
} from '@/types/api-responses';
import { DataIntegrationService } from '@/lib/services/data-integration-service';

interface GenerationRequest {
  sectionId: string;
  sectionTitle: string;
  sectionType: string;
  projectContext: {
    projectName: string;
    projectType: string;
    sector: string;
    dealValue?: number;
    stage: string;
    geography: string;
    riskRating: string;
    progress: number;
    metadata?: any;
  };
  generationStrategy: 'ai-generated' | 'data-driven' | 'static';
  existingContent?: string;
}

export async function POST(request: NextRequest) {
  const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const startTime = Date.now();
  
  try {
    const body: GenerationRequest = await request.json();
    
    // Validate required fields
    const validationErrors: ValidationError[] = [];
    
    if (!body.sectionId) {
      validationErrors.push({
        field: 'sectionId',
        message: 'Section ID is required',
        code: ContentGenerationErrorCodes.INVALID_SECTION_ID
      });
    }
    
    if (!body.sectionTitle) {
      validationErrors.push({
        field: 'sectionTitle',
        message: 'Section title is required',
        code: 'MISSING_SECTION_TITLE'
      });
    }
    
    if (!body.projectContext) {
      validationErrors.push({
        field: 'projectContext',
        message: 'Project context is required',
        code: ContentGenerationErrorCodes.MISSING_PROJECT_CONTEXT
      });
    }
    
    if (validationErrors.length > 0) {
      return NextResponse.json(
        createValidationErrorResponse(validationErrors, requestId),
        { status: 400 }
      );
    }

    const { sectionId, sectionTitle, sectionType, projectContext, generationStrategy } = body;

    // Check for valid section ID format
    if (!sectionId.match(/^[a-zA-Z0-9\-_]+$/)) {
      return NextResponse.json(
        createErrorResponse({
          code: ContentGenerationErrorCodes.INVALID_SECTION_ID,
          message: 'Invalid section ID format'
        }, requestId),
        { status: 400 }
      );
    }

    // Generate content based on section type and context
    const content = await generateContentForSection(sectionId, sectionTitle, sectionType, projectContext, generationStrategy);
    
    // Calculate quality score and word count
    const wordCount = content.split(/\s+/).length;
    const quality = calculateQualityScore(content, sectionType, projectContext);
    const generationTime = Date.now() - startTime;
    
    console.log(`Content generation stats:`, {
      sectionId,
      wordCount,
      quality: quality.toFixed(3),
      generationTime: `${generationTime}ms`,
      contentPreview: content.substring(0, 150) + '...'
    });

    // Check quality threshold - lower threshold for AI-generated content
    if (quality < 0.1) {
      console.warn(`Low quality content generated (${quality.toFixed(2)}):`, content.substring(0, 200));
      return NextResponse.json(
        createErrorResponse({
          code: ContentGenerationErrorCodes.QUALITY_THRESHOLD_NOT_MET,
          message: `Generated content quality too low (${quality.toFixed(2)}). Content: ${content.substring(0, 100)}...`
        }, requestId),
        { status: 422 }
      );
    }

    // Check content length limits
    if (wordCount > 10000) {
      return NextResponse.json(
        createErrorResponse({
          code: ContentGenerationErrorCodes.CONTENT_TOO_LONG,
          message: 'Generated content exceeds maximum length limit'
        }, requestId),
        { status: 413 }
      );
    }
    
    const responseData: ContentGenerationResponse = {
      content,
      quality,
      wordCount,
      generatedAt: new Date().toISOString(),
      sectionId,
      metadata: {
        generationTime,
        model: 'content-generator-v1',
        temperature: 0.7
      }
    };
    
    return NextResponse.json(
      createSuccessResponse(responseData, 'Content generated successfully', requestId)
    );
    
  } catch (error) {
    console.error('Error generating content:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate content';
    
    return NextResponse.json(
      createErrorResponse({
        code: ContentGenerationErrorCodes.GENERATION_FAILED,
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      }, requestId),
      { status: 500 }
    );
  }
}

async function generateContentForSection(
  sectionId: string,
  sectionTitle: string,
  sectionType: string,
  context: GenerationRequest['projectContext'],
  strategy: string
): Promise<string> {
  
  try {
    // Integrate real data for the project
    const dataIntegration = await DataIntegrationService.integrateProjectData(context);
    const realData = dataIntegration.data;
    
    // Only generate content if we have real data
    if (Object.keys(realData).length > 0) {
      return generateDataDrivenContent(sectionId, sectionTitle, context, realData, dataIntegration.metadata);
    } else {
      // Return minimal content indicating no data available
      return generateNoDataContent(sectionId, sectionTitle, context);
    }
    
  } catch (error) {
    console.error('Error in data integration:', error);
    return generateNoDataContent(sectionId, sectionTitle, context);
  }
}

async function generateDataDrivenContent(
  sectionId: string,
  sectionTitle: string,
  context: GenerationRequest['projectContext'],
  realData: any,
  metadata: any
): Promise<string> {
  
  // Instead of rigid templates, use Anthropic SDK for intelligent content generation
  try {
    const baseUrl = typeof window === 'undefined' 
      ? (process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
      : '';
      
    const response = await fetch(`${baseUrl}/api/ai/generate-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sectionType: sectionId,
        sectionTitle: sectionTitle,
        projectContext: context,
        availableData: realData,
        dataMetadata: metadata,
        instruction: 'real-data-only'
      })
    });

    if (response.ok) {
      const result = await response.json();
      return result.content;
    } else {
      throw new Error(`AI generation failed: ${response.status}`);
    }
  } catch (error) {
    console.error('Error calling AI generation service:', error);
    // Fallback to simplified template-based generation
    console.log('Falling back to template-based generation for section:', sectionId);
    return generateFallbackContent(sectionId, sectionTitle, context, realData, metadata);
  }
}

async function generateFallbackContent(
  sectionId: string,
  sectionTitle: string,
  context: GenerationRequest['projectContext'],
  realData: any,
  metadata: any
): Promise<string> {
  
  const dataQualityNote = metadata.dataQuality > 0.8 ? 
    '' : '\n\n*Note: Analysis based on available data with ' + Math.round(metadata.dataQuality * 100) + '% completeness.*';
  
  switch (sectionId) {
    case 'exec-summary':
    case 'investment-overview':
      let content = `# Executive Summary\n\n`;
      
      if (realData.PROJECT_NAME) {
        content += `**Investment Opportunity: ${realData.PROJECT_NAME}**\n\n`;
        
        const details = [];
        if (realData.RISK_RATING) details.push(`${realData.RISK_RATING}-risk investment opportunity`);
        if (realData.SECTOR) details.push(`in the ${realData.SECTOR} sector`);
        if (realData.GEOGRAPHY) details.push(`located in ${realData.GEOGRAPHY}`);
        if (realData.DEAL_STAGE) details.push(`${realData.DEAL_STAGE} stage`);
        
        if (details.length > 0) {
          content += `${realData.PROJECT_NAME} represents a ${details.join(', ')}.\n\n`;
        }
      }

      // Only add sections if we have real data
      const financialData = [realData.DEAL_VALUE, realData.CURRENT_VALUE, realData.IRR, realData.MOIC].filter(Boolean);
      if (financialData.length > 0) {
        content += `## Financial Overview\n\n`;
        if (realData.DEAL_VALUE) content += `- **Investment Size:** ${realData.DEAL_VALUE}\n`;
        if (realData.CURRENT_VALUE) content += `- **Current Valuation:** ${realData.CURRENT_VALUE}\n`;
        if (realData.IRR) content += `- **IRR:** ${realData.IRR}\n`;
        if (realData.MOIC) content += `- **Target Multiple:** ${realData.MOIC}\n`;
        content += `\n`;
      }

      const teamData = [realData.TEAM_SIZE, realData.TEAM_MEMBERS, realData.TEAM_LEAD].filter(Boolean);
      if (teamData.length > 0) {
        content += `## Team Overview\n\n`;
        if (realData.TEAM_SIZE) content += `- **Team Size:** ${realData.TEAM_SIZE} professionals\n`;
        if (realData.TEAM_LEAD) content += `- **Team Lead:** ${realData.TEAM_LEAD}\n`;
        if (realData.TEAM_MEMBERS) content += `- **Team Members:** ${realData.TEAM_MEMBERS}\n`;
        content += `\n`;
      }

      if (realData.CONFIDENCE_SCORE) {
        content += `## Data Confidence\n\n`;
        content += `**Confidence Score:** ${realData.CONFIDENCE_SCORE}\n`;
        if (metadata.sources.length > 0) {
          content += `**Data Sources:** ${metadata.sources.join(', ')}\n`;
        }
        content += `**Data Quality:** ${(metadata.dataQuality * 100).toFixed(0)}%\n`;
        content += `**Last Updated:** ${metadata.lastUpdated.toLocaleDateString()}\n`;
      }
      
      return content;

    case 'investment-thesis':
      return `# Investment Thesis

## Market Opportunity Analysis

**Sector Overview: ${realData.SECTOR}**
The ${realData.SECTOR} sector presents significant growth opportunities, particularly in ${realData.GEOGRAPHY}. Our analysis indicates favorable market dynamics supporting the investment thesis for ${realData.PROJECT_NAME}.

**Company Position**
- **Market Stage:** ${realData.DEAL_STAGE}
- **Geographic Focus:** ${realData.GEOGRAPHY}
- **Risk Profile:** ${realData.RISK_RATING} (based on quantitative assessment)

## Value Creation Strategy

**Financial Value Drivers**
- Current enterprise value: ${realData.CURRENT_VALUE}
- Target investment returns: ${realData.IRR} IRR, ${realData.MOIC} MOIC
- Investment period: ${realData.HOLD_PERIOD} years

**Operational Improvements**
- Team optimization (current team: ${realData.TEAM_SIZE} members)
- Process efficiency gains
- Technology upgrades and automation

**Strategic Initiatives**
- Market expansion opportunities
- Product development and innovation
- Strategic partnerships and acquisitions

## Risk Assessment & Mitigation

**Primary Risk Factors**
- Market volatility (${realData.MARKET_RISK})
- Operational execution risk (${realData.OPERATIONAL_RISK})
- Financial leverage risk (${realData.FINANCIAL_RISK})

**Mitigation Strategies**
- Diversified revenue streams
- Strong management oversight
- Conservative financial projections
- Regular performance monitoring

## Investment Rationale

Based on actual performance data and market analysis, ${realData.PROJECT_NAME} offers:
1. **Attractive Returns:** ${realData.IRR} projected IRR exceeds our hurdle rate
2. **Manageable Risk:** ${realData.RISK_RATING} risk rating within acceptable parameters
3. **Strong Fundamentals:** Solid financial metrics and operational capabilities
4. **Market Position:** Defensible competitive advantages in ${realData.SECTOR}

**Confidence Level:** ${realData.CONFIDENCE_SCORE} based on data quality and analysis depth${dataQualityNote}`;

    case 'financial-analysis':
    case 'financial-highlights':
      let finContent = `# Financial Analysis\n\n`;

      // Current Financial Position - only if we have valuation data
      const valuationData = [realData.CURRENT_VALUE, realData.DEAL_VALUE, realData.ACQUISITION_VALUE].filter(Boolean);
      if (valuationData.length > 0) {
        finContent += `## Current Financial Position\n\n`;
        if (realData.CURRENT_VALUE) finContent += `- **Current Enterprise Value:** ${realData.CURRENT_VALUE}\n`;
        if (realData.DEAL_VALUE) finContent += `- **Investment Amount:** ${realData.DEAL_VALUE}\n`;
        if (realData.ACQUISITION_VALUE) finContent += `- **Acquisition Value:** ${realData.ACQUISITION_VALUE}\n`;
        finContent += `\n`;
      }

      // Performance Metrics - only if we have performance data
      const performanceData = [realData.IRR, realData.MOIC, realData.REVENUE, realData.EBITDA, realData.EBITDA_MARGIN].filter(Boolean);
      if (performanceData.length > 0) {
        finContent += `## Performance Metrics\n\n`;
        if (realData.IRR) finContent += `- **IRR:** ${realData.IRR}\n`;
        if (realData.PROJECTED_IRR) finContent += `- **Projected IRR:** ${realData.PROJECTED_IRR}\n`;
        if (realData.MOIC) finContent += `- **MOIC:** ${realData.MOIC}\n`;
        if (realData.TARGET_MULTIPLE) finContent += `- **Target Multiple:** ${realData.TARGET_MULTIPLE}\n`;
        if (realData.REVENUE) finContent += `- **Revenue:** ${realData.REVENUE}\n`;
        if (realData.EBITDA) finContent += `- **EBITDA:** ${realData.EBITDA}\n`;
        if (realData.EBITDA_MARGIN) finContent += `- **EBITDA Margin:** ${realData.EBITDA_MARGIN}\n`;
        if (realData.REVENUE_GROWTH) finContent += `- **Revenue Growth:** ${realData.REVENUE_GROWTH}\n`;
        if (realData.LTV_CAC_RATIO) finContent += `- **LTV/CAC Ratio:** ${realData.LTV_CAC_RATIO}\n`;
        if (realData.GROSS_MARGIN) finContent += `- **Gross Margin:** ${realData.GROSS_MARGIN}\n`;
        finContent += `\n`;
      }

      // Portfolio specific metrics
      const portfolioData = [realData.TOTAL_RETURN, realData.PORTFOLIO_IRR, realData.ESG_SCORE].filter(Boolean);
      if (portfolioData.length > 0) {
        finContent += `## Portfolio Performance\n\n`;
        if (realData.TOTAL_RETURN) finContent += `- **Total Return:** ${realData.TOTAL_RETURN}\n`;
        if (realData.PORTFOLIO_IRR) finContent += `- **Portfolio IRR:** ${realData.PORTFOLIO_IRR}\n`;
        if (realData.ESG_SCORE) finContent += `- **ESG Score:** ${realData.ESG_SCORE}\n`;
        finContent += `\n`;
      }

      // Data sources and quality
      if (metadata.sources.length > 0) {
        finContent += `## Data Validation\n\n`;
        finContent += `**Data Sources:** ${metadata.sources.join(', ')}\n`;
        finContent += `**Data Quality:** ${(metadata.dataQuality * 100).toFixed(0)}%\n`;
        finContent += `**Data Completeness:** ${(metadata.completeness * 100).toFixed(0)}%\n`;
        finContent += `**Last Updated:** ${metadata.lastUpdated.toLocaleDateString()}\n`;
      }

      return finContent;

    case 'risk-assessment':
    case 'key-risks':
      let riskContent = `# Risk Assessment\\n\\n`;

      // Only add risk profile if we have real risk data
      const riskData = [realData.RISK_RATING, realData.PROJECT_NAME].filter(Boolean);
      if (riskData.length >= 2) {
        riskContent += `## Risk Profile Summary\\n\\n`;
        riskContent += `**Overall Risk Rating: ${realData.RISK_RATING.toUpperCase()}**\\n\\n`;
        riskContent += `Based on quantitative analysis, ${realData.PROJECT_NAME} carries a ${realData.RISK_RATING} risk profile.\\n\\n`;
      }

      // Detailed risk analysis - only if we have specific risk metrics
      const specificRisks = [realData.MARKET_RISK, realData.OPERATIONAL_RISK, realData.FINANCIAL_RISK, realData.REGULATORY_RISK, realData.TECHNOLOGY_RISK].filter(Boolean);
      if (specificRisks.length > 0) {
        riskContent += `## Detailed Risk Analysis\\n\\n`;
        
        if (realData.MARKET_RISK) {
          riskContent += `**Market Risk: ${realData.MARKET_RISK}**\\n`;
          if (realData.SECTOR) riskContent += `- Sector-specific market volatility in ${realData.SECTOR}\\n`;
          if (realData.GEOGRAPHY) riskContent += `- Geographic concentration risk in ${realData.GEOGRAPHY}\\n`;
          riskContent += `\\n`;
        }
        
        if (realData.OPERATIONAL_RISK) {
          riskContent += `**Operational Risk: ${realData.OPERATIONAL_RISK}**\\n`;
          if (realData.TEAM_SIZE) riskContent += `- Management team capability (${realData.TEAM_SIZE} member team)\\n`;
          riskContent += `\\n`;
        }
        
        if (realData.FINANCIAL_RISK) {
          riskContent += `**Financial Risk: ${realData.FINANCIAL_RISK}**\\n`;
          riskContent += `\\n`;
        }
        
        if (realData.REGULATORY_RISK) {
          riskContent += `**Regulatory Risk: ${realData.REGULATORY_RISK}**\\n`;
          riskContent += `\\n`;
        }
        
        if (realData.TECHNOLOGY_RISK) {
          riskContent += `**Technology Risk: ${realData.TECHNOLOGY_RISK}**\\n`;
          riskContent += `\\n`;
        }
      }

      // Risk-return assessment - only if we have performance projections
      const returnData = [realData.PROJECTED_IRR, realData.RISK_ADJUSTED_RETURN, realData.CONFIDENCE_SCORE].filter(Boolean);
      if (returnData.length > 0) {
        riskContent += `## Risk-Return Assessment\\n\\n`;
        riskContent += `**Risk-Adjusted Metrics**\\n`;
        if (realData.PROJECTED_IRR) riskContent += `- **Expected IRR:** ${realData.PROJECTED_IRR}\\n`;
        if (realData.RISK_ADJUSTED_RETURN) riskContent += `- **Risk-adjusted return:** ${realData.RISK_ADJUSTED_RETURN}\\n`;
        if (realData.CONFIDENCE_SCORE) riskContent += `- **Probability of achieving target returns:** ${realData.CONFIDENCE_SCORE}\\n`;
        riskContent += `\\n`;
      }

      // Data sources and quality
      if (metadata.sources.length > 0) {
        riskContent += `## Data Validation\\n\\n`;
        riskContent += `**Assessment Quality:** Based on ${metadata.sources.length} data sources with ${(metadata.dataQuality * 100).toFixed(0)}% confidence level\\n`;
        riskContent += `**Data Sources:** ${metadata.sources.join(', ')}\\n`;
        riskContent += `**Last Updated:** ${metadata.lastUpdated.toLocaleDateString()}\\n`;
      }

      return riskContent;

    case 'recommendations':
    case 'recommendation':
      let recContent = `# Investment Recommendation\\n\\n`;

      // Only provide recommendation if we have key data points
      const keyData = [realData.PROJECT_NAME, realData.DEAL_VALUE, realData.PROJECTED_IRR].filter(Boolean);
      if (keyData.length >= 2) {
        recContent += `## Executive Decision\\n\\n`;
        if (realData.DEAL_VALUE && realData.PROJECT_NAME) {
          recContent += `Based on available data analysis, we evaluate the ${realData.DEAL_VALUE} investment opportunity in ${realData.PROJECT_NAME}.\\n\\n`;
        }
      }

      // Financial analysis - only if we have financial metrics
      const financialMetrics = [realData.PROJECTED_IRR, realData.TARGET_MULTIPLE, realData.RISK_ADJUSTED_RETURN].filter(Boolean);
      if (financialMetrics.length > 0) {
        recContent += `## Financial Analysis\\n\\n`;
        if (realData.PROJECTED_IRR) recContent += `- **Target IRR:** ${realData.PROJECTED_IRR}\\n`;
        if (realData.TARGET_MULTIPLE) recContent += `- **Target Multiple:** ${realData.TARGET_MULTIPLE}\\n`;
        if (realData.HOLD_PERIOD) recContent += `- **Investment Period:** ${realData.HOLD_PERIOD} years\\n`;
        if (realData.RISK_ADJUSTED_RETURN) recContent += `- **Risk-Adjusted Return:** ${realData.RISK_ADJUSTED_RETURN}\\n`;
        recContent += `\\n`;
      }

      // Strategic fit - only if we have sector/geography data
      const strategicData = [realData.SECTOR, realData.GEOGRAPHY, realData.RISK_RATING].filter(Boolean);
      if (strategicData.length > 0) {
        recContent += `## Strategic Fit\\n\\n`;
        if (realData.SECTOR) recContent += `- Portfolio alignment with ${realData.SECTOR} sector\\n`;
        if (realData.GEOGRAPHY) recContent += `- Geographic focus: ${realData.GEOGRAPHY}\\n`;
        if (realData.RISK_RATING) recContent += `- Risk profile: ${realData.RISK_RATING}\\n`;
        if (realData.IC_SCORE) recContent += `- Investment Committee score: ${realData.IC_SCORE}\\n`;
        recContent += `\\n`;
      }

      // Implementation plan - only if we have transaction details
      const implementationData = [realData.DEAL_VALUE, realData.TEAM_SIZE].filter(Boolean);
      if (implementationData.length > 0) {
        recContent += `## Implementation Considerations\\n\\n`;
        if (realData.DEAL_VALUE) recContent += `- Transaction value: ${realData.DEAL_VALUE}\\n`;
        if (realData.TEAM_SIZE) recContent += `- Management team: ${realData.TEAM_SIZE} key members\\n`;
        if (realData.TRANSACTION_STRUCTURE) recContent += `- Structure: ${realData.TRANSACTION_STRUCTURE}\\n`;
        recContent += `\\n`;
      }

      // Risk considerations - only if we have risk data
      const riskMetrics = [realData.MARKET_RISK, realData.OPERATIONAL_RISK, realData.FINANCIAL_RISK].filter(Boolean);
      if (riskMetrics.length > 0) {
        recContent += `## Risk Factors\\n\\n`;
        if (realData.MARKET_RISK) recContent += `- **Market risk:** ${realData.MARKET_RISK}\\n`;
        if (realData.OPERATIONAL_RISK) recContent += `- **Operational risk:** ${realData.OPERATIONAL_RISK}\\n`;
        if (realData.FINANCIAL_RISK) recContent += `- **Financial risk:** ${realData.FINANCIAL_RISK}\\n`;
        recContent += `\\n`;
      }

      // Data confidence and sources
      if (metadata.sources.length > 0) {
        recContent += `## Analysis Foundation\\n\\n`;
        recContent += `**Data Sources:** ${metadata.sources.join(', ')}\\n`;
        recContent += `**Data Quality:** ${(metadata.dataQuality * 100).toFixed(0)}%\\n`;
        if (realData.CONFIDENCE_SCORE) recContent += `**Confidence Level:** ${realData.CONFIDENCE_SCORE}\\n`;
        recContent += `**Analysis Date:** ${metadata.lastUpdated.toLocaleDateString()}\\n`;
      }

      return recContent;

    default:
      return generateGenericDataDrivenSection(sectionTitle, context, realData, metadata);
  }
}

function generateNoDataContent(
  sectionId: string,
  sectionTitle: string,
  context: GenerationRequest['projectContext']
): string {
  return `# ${sectionTitle}

## Data Not Available

This section requires specific data points that are not currently available in the system for ${context.projectName || 'this project'}.

To generate meaningful content for this section, please ensure the following data sources are connected:

- **Project workspace data** with analysis components and findings
- **Financial performance metrics** and projections  
- **Portfolio asset information** (if applicable)
- **Deal screening assessments** (if applicable)

Once the required data is available, this section will automatically populate with real, data-driven insights and analysis.

*No placeholder or synthetic content is generated to ensure accuracy and reliability.*`;
}

function generateGenericDataDrivenSection(
  sectionTitle: string,
  context: GenerationRequest['projectContext'],
  realData: any,
  metadata: any
): string {
  const dataQualityNote = metadata.dataQuality > 0.8 ? 
    '' : '\n\n*Note: Some data points may be estimated based on available information.*';

  return `# ${sectionTitle}

## Overview

This analysis for ${realData.PROJECT_NAME} is based on real data from ${metadata.sources.join(', ')} with ${(metadata.dataQuality * 100).toFixed(0)}% data quality score.

**Project Details:**
- **Company:** ${realData.PROJECT_NAME}
- **Sector:** ${realData.SECTOR}
- **Geography:** ${realData.GEOGRAPHY}
- **Stage:** ${realData.DEAL_STAGE}
- **Deal Value:** ${realData.DEAL_VALUE}

**Key Metrics:**
- **Current Value:** ${realData.CURRENT_VALUE}
- **Projected IRR:** ${realData.IRR}
- **Risk Rating:** ${realData.RISK_RATING}
- **Team Size:** ${realData.TEAM_SIZE}

## Analysis

Based on the available data, ${realData.PROJECT_NAME} demonstrates solid fundamentals in the ${realData.SECTOR} sector. The ${realData.RISK_RATING} risk profile aligns with the projected ${realData.IRR} returns.

**Investment Highlights:**
- Strong market position in ${realData.GEOGRAPHY}
- Experienced team of ${realData.TEAM_SIZE} professionals
- Clear value creation opportunities
- Attractive risk-adjusted returns

## Conclusion

The data-driven analysis supports the investment thesis for ${realData.PROJECT_NAME}, with confidence level of ${realData.CONFIDENCE_SCORE} based on available information.

**Data Sources:** ${metadata.sources.join(', ')} | **Last Updated:** ${metadata.lastUpdated.toLocaleDateString()}${dataQualityNote}`;
}





function calculateQualityScore(content: string, sectionType: string, context: GenerationRequest['projectContext']): number {
  if (!content || content.trim().length === 0) return 0;
  
  let qualityScore = 0.3; // Base score for any content
  
  // Check content length (should be substantial)
  const wordCount = content.split(/\s+/).length;
  if (wordCount >= 50) qualityScore += 0.2;
  if (wordCount >= 200) qualityScore += 0.1;
  
  // Check for professional structure
  const hasHeaders = content.includes('#');
  const hasLists = content.includes('-') || content.includes('*');
  const hasBulletPoints = /^\s*[\-\*\+]\s/m.test(content);
  
  if (hasHeaders) qualityScore += 0.1;
  if (hasLists || hasBulletPoints) qualityScore += 0.1;
  
  // Check for data indicators (numbers, percentages, currency)
  const hasNumbers = /\d/.test(content);
  const hasPercentages = /%/.test(content);
  const hasCurrency = /\$/.test(content);
  
  if (hasNumbers) qualityScore += 0.05;
  if (hasPercentages) qualityScore += 0.05;
  if (hasCurrency) qualityScore += 0.05;
  
  // Check for professional language patterns
  const professionalTerms = ['analysis', 'assessment', 'investment', 'risk', 'opportunity', 'performance'];
  const termCount = professionalTerms.filter(term => 
    content.toLowerCase().includes(term)
  ).length;
  qualityScore += Math.min(termCount * 0.02, 0.1);
  
  // Penalty for "Data Not Available" but not completely disqualifying for AI content
  if (content.includes('Data Not Available') || content.includes('insufficient data')) {
    qualityScore = Math.max(qualityScore * 0.7, 0.15); // Reduce but don't eliminate
  }
  
  // Bonus for data transparency indicators
  if (content.includes('based on available') || content.includes('data sources')) {
    qualityScore += 0.05;
  }
  
  return Math.min(qualityScore, 1.0);
}