import { NextRequest, NextResponse } from 'next/server';
import { 
  WorkProduct,
  ContentOptimizationOptions
} from '@/types/work-product';
import { contentTransformationPipeline } from '@/lib/services/content-transformation-pipeline';

// POST /api/content-transformation/optimize
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      workProduct,
      optimizationOptions = {},
      targetAudience = 'executives',
      optimizationLevel = 'standard'
    } = body;

    // Validate required fields
    if (!workProduct || !workProduct.sections) {
      return NextResponse.json(
        { 
          error: 'Missing required field: workProduct with sections is required',
          success: false 
        },
        { status: 400 }
      );
    }

    console.log(`Starting content optimization for work product: ${workProduct.title}`);

    // Build optimization options
    const options: ContentOptimizationOptions = {
      audience: targetAudience,
      tone: optimizationOptions.tone || 'professional',
      length: optimizationOptions.length || 'standard',
      industry: optimizationOptions.industry || workProduct.metadata?.projectContext?.sector,
      includeCharts: optimizationOptions.includeCharts !== false,
      includeFinancials: optimizationOptions.includeFinancials !== false,
      complianceLevel: optimizationOptions.complianceLevel || 'standard',
      ...optimizationOptions
    };

    // Execute content optimization
    const optimizationResult = await contentTransformationPipeline.optimizeContent(
      workProduct,
      options
    );

    // Calculate optimization metrics
    const metrics = {
      wordCountChange: optimizationResult.optimizedWorkProduct.wordCount - workProduct.wordCount,
      wordCountChangePercent: Math.round(
        ((optimizationResult.optimizedWorkProduct.wordCount - workProduct.wordCount) / workProduct.wordCount) * 100
      ),
      readingTimeChange: optimizationResult.optimizedWorkProduct.readingTime - (workProduct.readingTime || 0),
      sectionsOptimized: optimizationResult.optimizationResult.optimizationsApplied.length,
      qualityImprovement: optimizationResult.optimizationResult.readabilityScore,
      optimizationTime: Date.now()
    };

    // Prepare response
    const response = {
      optimizedWorkProduct: optimizationResult.optimizedWorkProduct,
      optimizationMetrics: {
        ...optimizationResult.optimizationResult,
        ...metrics
      },
      suggestions: optimizationResult.suggestions,
      summary: {
        totalOptimizations: optimizationResult.optimizationResult.optimizationsApplied.length,
        qualityScore: optimizationResult.optimizationResult.readabilityScore,
        completenessScore: optimizationResult.optimizationResult.completenessScore,
        professionalismScore: optimizationResult.optimizationResult.professionalismScore,
        recommendedNextSteps: this.generateNextStepRecommendations(
          optimizationResult.optimizationResult,
          optimizationResult.suggestions
        )
      }
    };

    console.log(`Content optimization completed. Applied ${metrics.sectionsOptimized} optimizations.`);

    return NextResponse.json({
      data: response,
      success: true,
      message: `Successfully optimized ${workProduct.title}. Applied ${metrics.sectionsOptimized} optimizations.`
    });

  } catch (error) {
    console.error('Content optimization API error:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Content optimization failed',
        success: false,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// GET /api/content-transformation/optimize - Get optimization options
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const industry = searchParams.get('industry');
    const audience = searchParams.get('audience') || 'executives';

    const optimizationOptions = {
      audiences: [
        { value: 'executives', label: 'Executives', description: 'C-level and senior leadership' },
        { value: 'analysts', label: 'Analysts', description: 'Investment analysts and associates' },
        { value: 'legal', label: 'Legal', description: 'Legal and compliance teams' },
        { value: 'technical', label: 'Technical', description: 'Technical and operational teams' }
      ],
      tones: [
        { value: 'formal', label: 'Formal', description: 'Highly professional and structured' },
        { value: 'professional', label: 'Professional', description: 'Business-appropriate and polished' },
        { value: 'conversational', label: 'Conversational', description: 'Approachable and engaging' }
      ],
      lengths: [
        { value: 'concise', label: 'Concise', description: 'Brief and to-the-point' },
        { value: 'standard', label: 'Standard', description: 'Balanced detail and brevity' },
        { value: 'detailed', label: 'Detailed', description: 'Comprehensive and thorough' }
      ],
      complianceLevels: [
        { value: 'standard', label: 'Standard', description: 'Basic compliance requirements' },
        { value: 'enhanced', label: 'Enhanced', description: 'Stricter compliance standards' },
        { value: 'regulatory', label: 'Regulatory', description: 'Full regulatory compliance' }
      ],
      industrySpecificOptions: this.getIndustryOptions(industry)
    };

    const optimizationCapabilities = {
      readabilityAnalysis: {
        description: 'Analyze and improve document readability',
        metrics: ['Flesch-Kincaid score', 'Sentence complexity', 'Vocabulary level']
      },
      professionalismEnhancement: {
        description: 'Enhance professional tone and language',
        features: ['Formal language conversion', 'Industry terminology', 'Professional formatting']
      },
      contentStructuring: {
        description: 'Optimize document structure and flow',
        features: ['Logical section ordering', 'Transition improvements', 'Executive summary optimization']
      },
      complianceValidation: {
        description: 'Ensure regulatory and internal compliance',
        features: ['Terminology validation', 'Disclosure requirements', 'Risk language compliance']
      },
      dataVisualization: {
        description: 'Optimize charts and financial data presentation',
        features: ['Chart recommendations', 'Table formatting', 'Financial data highlights']
      }
    };

    return NextResponse.json({
      data: {
        options: optimizationOptions,
        capabilities: optimizationCapabilities,
        estimatedOptimizationTime: {
          basic: '30 seconds - 1 minute',
          standard: '1-3 minutes',
          comprehensive: '3-5 minutes'
        }
      },
      success: true
    });

  } catch (error) {
    console.error('Optimization options API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to retrieve optimization options',
        success: false 
      },
      { status: 500 }
    );
  }
}

// Helper function to generate next step recommendations
function generateNextStepRecommendations(optimizationResult: any, suggestions: any[]): string[] {
  const recommendations = [];

  if (optimizationResult.readabilityScore < 0.8) {
    recommendations.push('Consider further readability improvements');
  }

  if (optimizationResult.completenessScore < 0.9) {
    recommendations.push('Review content completeness and add missing sections');
  }

  if (suggestions.length > 0) {
    const highPrioritySuggestions = suggestions.filter(s => s.priority === 'high').length;
    if (highPrioritySuggestions > 0) {
      recommendations.push(`Address ${highPrioritySuggestions} high-priority content suggestions`);
    }
  }

  if (optimizationResult.professionalismScore > 0.9) {
    recommendations.push('Content is ready for final review and distribution');
  }

  if (recommendations.length === 0) {
    recommendations.push('Content optimization complete - ready for export and sharing');
  }

  return recommendations;
}

// Helper function to get industry-specific optimization options
function getIndustryOptions(industry: string | null): any {
  const industryOptionsMap: Record<string, any> = {
    technology: {
      terminology: ['Digital transformation', 'Scalability', 'Platform strategy', 'Technology stack'],
      keyMetrics: ['ARR', 'Churn rate', 'LTV/CAC', 'NPS score'],
      complianceAreas: ['Data privacy', 'Security standards', 'IP protection']
    },
    healthcare: {
      terminology: ['Patient outcomes', 'Clinical efficacy', 'Regulatory pathway', 'Quality metrics'],
      keyMetrics: ['Patient satisfaction', 'Clinical outcomes', 'Regulatory milestones'],
      complianceAreas: ['FDA regulations', 'HIPAA compliance', 'Clinical trial standards']
    },
    'financial-services': {
      terminology: ['Risk management', 'Regulatory capital', 'Compliance framework', 'Fiduciary duty'],
      keyMetrics: ['ROE', 'Risk-adjusted returns', 'Capital adequacy', 'Compliance ratio'],
      complianceAreas: ['Financial regulations', 'Risk management', 'Anti-money laundering']
    }
  };

  return industryOptionsMap[industry || 'general'] || {
    terminology: ['Industry-standard', 'Best practices', 'Market position'],
    keyMetrics: ['Performance indicators', 'Growth metrics', 'Efficiency ratios'],
    complianceAreas: ['Industry standards', 'Regulatory requirements', 'Quality assurance']
  };
}