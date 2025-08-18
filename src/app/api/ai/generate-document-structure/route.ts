import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface DocumentStructureRequest {
  documentType: 'ic-memo' | 'due-diligence' | 'screening-report' | 'portfolio-review' | 'risk-assessment';
  projectContext: {
    projectName?: string;
    projectType?: string;
    sector?: string;
    dealValue?: number;
    stage?: string;
    geography?: string;
    riskRating?: string;
  };
  availableData: Record<string, any>;
  dataMetadata: {
    sources: string[];
    dataQuality: number;
    completeness: number;
  };
}

interface DocumentSection {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'important' | 'optional';
  estimatedLength: 'short' | 'medium' | 'long';
  dataRequirements: string[];
  content?: string;
}

interface DocumentStructure {
  title: string;
  description: string;
  sections: DocumentSection[];
  executiveSummaryRequired: boolean;
  appendicesRecommended: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: DocumentStructureRequest = await request.json();
    
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('Anthropic API key not found in environment variables');
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      );
    }

    const systemPrompt = buildDocumentStructurePrompt();
    const userPrompt = buildStructureRequest(body);

    console.log('Generating document structure for:', body.documentType);

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 3000,
      temperature: 0.1,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt
        }
      ]
    });

    const response = message.content[0].type === 'text' ? message.content[0].text : '';
    
    // Parse the structured response
    let documentStructure: DocumentStructure;
    try {
      documentStructure = JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse AI response as JSON:', error);
      console.error('Raw response:', response);
      throw new Error('Invalid JSON response from AI');
    }

    // Validate the structure
    if (!documentStructure.sections || !Array.isArray(documentStructure.sections)) {
      throw new Error('Invalid document structure format');
    }

    return NextResponse.json({
      structure: documentStructure,
      generatedAt: new Date().toISOString(),
      model: "claude-3-5-sonnet-20241022",
      documentType: body.documentType
    });

  } catch (error) {
    console.error('Error generating document structure:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate document structure',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function buildDocumentStructurePrompt(): string {
  return `You are an expert investment professional with deep experience in private equity, venture capital, and institutional investing. Your task is to design the optimal structure for professional investment documents.

CRITICAL REQUIREMENTS:
1. Generate authentic, industry-standard document structures
2. Adapt sections based on available data and document type
3. Ensure sections flow logically for decision-making
4. Consider regulatory and governance requirements
5. Return response as valid JSON only

DOCUMENT TYPES EXPERTISE:
- **IC Memo**: Investment Committee presentation for deal approval
- **Due Diligence**: Comprehensive analysis for investment decisions  
- **Screening Report**: Initial assessment of investment opportunities
- **Portfolio Review**: Performance analysis of existing investments
- **Risk Assessment**: Detailed risk analysis and mitigation strategies

JSON RESPONSE FORMAT:
{
  "title": "Document title appropriate for the type and context",
  "description": "Brief description of the document's purpose",
  "sections": [
    {
      "id": "unique-section-id",
      "title": "Section Title",
      "description": "What this section covers and why it's important",
      "priority": "critical|important|optional",
      "estimatedLength": "short|medium|long",
      "dataRequirements": ["list", "of", "data", "needed"],
      "content": null
    }
  ],
  "executiveSummaryRequired": true|false,
  "appendicesRecommended": ["Supporting Materials", "Financial Models", "Legal Documents"]
}

SECTION GUIDELINES:
- **Critical sections**: Must-have for document validity
- **Important sections**: Significantly enhance document quality
- **Optional sections**: Nice-to-have based on available data
- **Data requirements**: Specific data needed for meaningful content

Focus on creating authentic, professional structures that investment committees and stakeholders expect to see.`;
}

function buildStructureRequest(request: DocumentStructureRequest): string {
  const { documentType, projectContext, availableData, dataMetadata } = request;
  
  const contextSummary = Object.entries(projectContext)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n');

  const dataSummary = Object.keys(availableData).length > 0 
    ? Object.keys(availableData).join(', ')
    : 'Limited data available';

  return `Generate an optimal document structure for a ${documentType.toUpperCase().replace('-', ' ')}.

PROJECT CONTEXT:
${contextSummary}

AVAILABLE DATA FIELDS:
${dataSummary}

DATA QUALITY:
- Sources: ${dataMetadata.sources.join(', ')}
- Quality: ${Math.round(dataMetadata.dataQuality * 100)}%
- Completeness: ${Math.round(dataMetadata.completeness * 100)}%

REQUIREMENTS:
1. Create an authentic ${documentType} structure that follows industry standards
2. Adapt sections based on the specific project context and available data
3. Ensure logical flow for decision-makers and stakeholders
4. Include appropriate sections for this document type and project stage
5. Consider data availability when determining section priority

For example:
- **IC Memo** should focus on investment recommendation, returns, risks, and approval rationale
- **Due Diligence** should be comprehensive analysis across all business dimensions
- **Screening Report** should be initial assessment with go/no-go recommendation
- **Portfolio Review** should focus on performance analysis and value creation
- **Risk Assessment** should detail risk identification, quantification, and mitigation

Generate the optimal structure as valid JSON following the specified format. Consider that this is for ${projectContext.projectName || 'the project'} in the ${projectContext.sector || 'target'} sector.`;
}