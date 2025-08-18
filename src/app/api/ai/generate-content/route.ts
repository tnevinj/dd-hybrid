import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface ContentGenerationRequest {
  sectionType: string;
  sectionTitle: string;
  sectionDescription?: string;
  documentType?: 'ic-memo' | 'due-diligence' | 'screening-report' | 'portfolio-review' | 'risk-assessment';
  projectContext: {
    projectId?: string;
    projectName?: string;
    projectType?: string;
    sector?: string;
    dealValue?: number;
    stage?: string;
    geography?: string;
    riskRating?: string;
    progress?: number;
  };
  availableData: Record<string, any>;
  dataMetadata: {
    sources: string[];
    dataQuality: number;
    completeness: number;
    lastUpdated: Date;
  };
  instruction: 'real-data-only' | 'enhanced' | 'creative';
}

export async function POST(request: NextRequest) {
  try {
    const body: ContentGenerationRequest = await request.json();
    
    console.log('ANTHROPIC_API_KEY exists:', !!process.env.ANTHROPIC_API_KEY);
    console.log('ANTHROPIC_API_KEY length:', process.env.ANTHROPIC_API_KEY?.length || 0);
    
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('Anthropic API key not found in environment variables');
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      );
    }

    // Build a comprehensive data-driven prompt
    const systemPrompt = buildSystemPrompt(body.instruction, body.documentType);
    const userPrompt = buildUserPrompt(body);

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      temperature: 0.1, // Low temperature for factual content
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt
        }
      ]
    });

    const content = message.content[0].type === 'text' ? message.content[0].text : '';
    
    // Validate content quality
    const qualityScore = calculateContentQuality(content, body.availableData);
    
    return NextResponse.json({
      content,
      qualityScore,
      wordCount: content.split(/\s+/).length,
      dataSourcesUsed: body.dataMetadata.sources,
      dataQuality: body.dataMetadata.dataQuality,
      generatedAt: new Date().toISOString(),
      model: "claude-3-5-sonnet-20241022"
    });

  } catch (error) {
    console.error('Error generating AI content:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate content',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function buildSystemPrompt(instruction: string, documentType?: string): string {
  const documentContext = getDocumentContext(documentType);
  
  const basePrompt = `You are an expert investment professional with deep experience in private equity, venture capital, and institutional investing. Your task is to generate professional, accurate, and insightful content for investment documents.

${documentContext}

CRITICAL REQUIREMENTS:
1. **Real Data Only**: Use ONLY the provided real data. Never fabricate, estimate, or hallucinate information.
2. **Document Authenticity**: Write content that matches the standards and expectations for this document type.
3. **Professional Tone**: Write in the appropriate style for the document type and audience.
4. **Data Attribution**: Reference data sources and acknowledge limitations transparently.
5. **Structured Output**: Use proper markdown formatting appropriate for the document type.

CONTENT PRINCIPLES:
- Write for the specific audience (investment committee, partners, analysts)
- Focus on decision-relevant insights and implications
- Balance quantitative analysis with qualitative judgment
- Highlight both opportunities and risks with appropriate emphasis
- Maintain objectivity while supporting clear recommendations
- Use industry-standard terminology and frameworks`;

  switch (instruction) {
    case 'real-data-only':
      return basePrompt + `

STRICT DATA POLICY:
- Only use explicitly provided data points
- Never extrapolate or estimate missing values
- If insufficient data exists for a section, state this clearly
- Quality of analysis should reflect data availability
- Prefer saying "insufficient data" over making assumptions`;

    case 'enhanced':
      return basePrompt + `

ENHANCED ANALYSIS:
- Draw reasonable insights from available data patterns
- Provide context using industry knowledge
- Suggest areas for further investigation
- Balance data-driven insights with analytical judgment`;

    case 'creative':
      return basePrompt + `

CREATIVE ANALYSIS:
- Develop strategic insights from data trends
- Provide forward-looking perspectives
- Suggest value creation opportunities
- Include strategic recommendations based on analysis`;

    default:
      return basePrompt;
  }
}

function buildUserPrompt(request: ContentGenerationRequest): string {
  const { sectionType, sectionTitle, sectionDescription, documentType, projectContext, availableData, dataMetadata } = request;
  
  // Format available data for the prompt
  const dataSummary = Object.keys(availableData).length > 0 
    ? Object.entries(availableData)
        .map(([key, value]) => `- ${key}: ${value}`)
        .join('\n')
    : 'No specific data points available';

  // Build context about the project
  const contextSummary = Object.entries(projectContext)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n');

  const sectionContext = sectionDescription ? `\n\nSECTION PURPOSE: ${sectionDescription}` : '';
  const documentContext = documentType ? ` for a ${documentType.toUpperCase().replace('-', ' ')}` : '';

  return `Generate content for a ${sectionType} section titled "${sectionTitle}"${documentContext}.${sectionContext}

PROJECT CONTEXT:
${contextSummary}

AVAILABLE REAL DATA:
${dataSummary}

DATA METADATA:
- Sources: ${dataMetadata.sources.join(', ')}
- Data Quality: ${Math.round(dataMetadata.dataQuality * 100)}%
- Completeness: ${Math.round(dataMetadata.completeness * 100)}%
- Last Updated: ${dataMetadata.lastUpdated}

SECTION REQUIREMENTS:
Generate a comprehensive ${sectionType} section that:
1. Uses only the provided real data
2. Provides meaningful analysis and insights
3. Maintains professional investment document standards
4. Clearly indicates when data is insufficient
5. Focuses on actionable intelligence for decision-makers

OUTPUT FORMAT:
- Use markdown formatting
- Include relevant headers and subheaders
- Use bullet points for key findings
- Include data validation/confidence indicators where appropriate
- End with a brief summary of key takeaways

If insufficient data exists for this section, provide a transparent explanation of what data would be needed to complete the analysis.`;
}

function calculateContentQuality(content: string, availableData: Record<string, any>): number {
  let qualityScore = 0.5; // Base score
  
  // Check for data references
  const dataReferences = Object.keys(availableData).filter(key => 
    content.toLowerCase().includes(key.toLowerCase().replace('_', ' '))
  );
  
  // Score based on data utilization
  const dataUtilization = dataReferences.length / Math.max(Object.keys(availableData).length, 1);
  qualityScore += dataUtilization * 0.3;
  
  // Check for structure
  const hasHeaders = content.includes('#');
  const hasBulletPoints = content.includes('-') || content.includes('*');
  const hasNumbers = /\d/.test(content);
  
  if (hasHeaders) qualityScore += 0.1;
  if (hasBulletPoints) qualityScore += 0.05;
  if (hasNumbers) qualityScore += 0.05;
  
  // Check length appropriateness (500-2000 words ideal)
  const wordCount = content.split(/\s+/).length;
  if (wordCount >= 500 && wordCount <= 2000) {
    qualityScore += 0.1;
  } else if (wordCount >= 200) {
    qualityScore += 0.05;
  }
  
  // Check for transparency indicators
  const transparencyMarkers = [
    'data not available',
    'insufficient data',
    'based on available',
    'data sources:',
    'last updated'
  ];
  
  const hasTransparency = transparencyMarkers.some(marker => 
    content.toLowerCase().includes(marker)
  );
  
  if (hasTransparency) qualityScore += 0.1;
  
  return Math.min(qualityScore, 1.0);
}

function getDocumentContext(documentType?: string): string {
  switch (documentType) {
    case 'ic-memo':
      return `DOCUMENT TYPE: INVESTMENT COMMITTEE MEMO
This is a formal recommendation document for the Investment Committee to make an investment decision. The content should:
- Present a clear investment recommendation with supporting rationale
- Focus on key investment merits and risk factors
- Include financial projections and return expectations
- Address potential concerns and mitigation strategies
- Be structured for executive decision-making
- Include voting recommendation and next steps

AUDIENCE: Investment Committee members, General Partners, Senior Decision Makers
TONE: Authoritative, analytical, recommendation-focused
LENGTH: Concise but comprehensive (typically 3-8 pages)`;

    case 'due-diligence':
      return `DOCUMENT TYPE: DUE DILIGENCE REPORT
This is a comprehensive analysis document for thorough investment evaluation. The content should:
- Provide exhaustive analysis across all business dimensions
- Include detailed findings from due diligence work streams
- Present both positive and negative findings objectively
- Support investment decision with thorough analysis
- Include verification of key assumptions and claims
- Document evidence and sources extensively

AUDIENCE: Deal team, Investment Committee, External advisors
TONE: Objective, thorough, evidence-based
LENGTH: Comprehensive and detailed (typically 15-50 pages)`;

    case 'screening-report':
      return `DOCUMENT TYPE: INITIAL SCREENING REPORT
This is a preliminary assessment document for investment opportunity evaluation. The content should:
- Provide high-level assessment of investment attractiveness
- Focus on key screening criteria and initial findings
- Present go/no-go recommendation with key reasons
- Highlight areas requiring further investigation
- Be efficient and decision-oriented
- Include next steps if proceeding

AUDIENCE: Deal team, Senior analysts, Investment professionals
TONE: Analytical, preliminary, recommendation-focused
LENGTH: Concise and focused (typically 2-5 pages)`;

    case 'portfolio-review':
      return `DOCUMENT TYPE: PORTFOLIO REVIEW REPORT
This is a performance analysis document for existing investments. The content should:
- Analyze investment performance against expectations
- Review value creation initiatives and progress
- Assess portfolio company management and operations
- Identify risks and opportunities going forward
- Present strategic recommendations for value enhancement
- Include exit planning considerations where relevant

AUDIENCE: Investment team, Portfolio management, Limited Partners
TONE: Performance-focused, strategic, forward-looking
LENGTH: Balanced detail (typically 5-15 pages)`;

    case 'risk-assessment':
      return `DOCUMENT TYPE: RISK ASSESSMENT REPORT
This is a detailed risk analysis document for investment evaluation. The content should:
- Identify and categorize all material risks
- Quantify risks where possible with scenarios
- Present mitigation strategies and controls
- Assess residual risk after mitigation
- Consider correlation with portfolio risks
- Provide risk-adjusted return analysis

AUDIENCE: Risk committee, Investment team, Compliance
TONE: Analytical, cautious, thorough
LENGTH: Detailed and systematic (typically 8-20 pages)`;

    default:
      return `DOCUMENT TYPE: PROFESSIONAL INVESTMENT DOCUMENT
This is a formal investment analysis document. The content should:
- Present professional investment analysis
- Use industry-standard frameworks and terminology
- Support conclusions with appropriate evidence
- Address key stakeholder concerns
- Follow institutional document standards

AUDIENCE: Investment professionals and stakeholders
TONE: Professional, analytical, evidence-based`;
  }
}