import { NextRequest, NextResponse } from 'next/server';
import { AIScreeningService } from '@/lib/services/ai-screening-service';
import { DealOpportunity, DealScreeningTemplate } from '@/types/deal-screening';

// Mock data - in production this would come from database
const opportunities: DealOpportunity[] = [
  {
    id: '1',
    name: 'TechCorp Series B',
    description: 'AI-powered enterprise software company with strong growth metrics and market position.',
    seller: 'TechCorp Ventures',
    assetType: 'direct',
    vintage: '2023',
    sector: 'Technology',
    geography: 'North America',
    askPrice: 50000000,
    navPercentage: 0.85,
    expectedReturn: 0.25,
    expectedRisk: 0.15,
    expectedMultiple: 2.8,
    expectedIRR: 25.5,
    expectedHoldingPeriod: 4,
    scores: [],
    status: 'screening',
    aiConfidence: 0.87,
    similarDeals: ['deal-2', 'deal-5'],
    aiRecommendations: [],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    additionalData: {},
  },
  {
    id: '2',
    name: 'HealthTech Solutions',
    description: 'Digital health platform serving emerging markets with strong patient outcomes.',
    seller: 'HealthVentures LP',
    assetType: 'fund',
    vintage: '2024',
    sector: 'Healthcare',
    geography: 'Africa',
    askPrice: 25000000,
    navPercentage: 0.78,
    expectedReturn: 0.18,
    expectedRisk: 0.12,
    expectedMultiple: 2.2,
    expectedIRR: 18.2,
    expectedHoldingPeriod: 5,
    scores: [],
    status: 'approved',
    aiConfidence: 0.92,
    aiRecommendations: [],
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-14T16:45:00Z',
    additionalData: {},
  }
];

// Import templates from the templates route
import { mockTemplates } from '../../templates/route';

// GET /api/deal-screening/opportunities/[id]/ai-suggestions
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get('templateId');
    
    // Find the opportunity
    const opportunity = opportunities.find(opp => opp.id === id);
    
    if (!opportunity) {
      return NextResponse.json(
        { error: 'Opportunity not found', success: false },
        { status: 404 }
      );
    }

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required', success: false },
        { status: 400 }
      );
    }

    // Find the template
    const template = mockTemplates.find(t => t.id === templateId);
    
    if (!template) {
      return NextResponse.json(
        { error: 'Template not found', success: false },
        { status: 404 }
      );
    }

    console.log(`Generating AI suggestions for ${opportunity.name} using template ${template.name}`);
    
    // Generate intelligent AI suggestions
    const suggestions = AIScreeningService.generateBatchSuggestions(opportunity, template);
    
    // Calculate overall statistics
    const avgConfidence = Object.values(suggestions).reduce((sum, s) => sum + s.confidence, 0) / Object.keys(suggestions).length;
    const avgScore = Object.values(suggestions).reduce((sum, s) => sum + s.score, 0) / Object.keys(suggestions).length;
    
    // Identify high and low confidence suggestions
    const highConfidenceSuggestions = Object.entries(suggestions).filter(([_, s]) => s.confidence >= 0.85);
    const lowConfidenceSuggestions = Object.entries(suggestions).filter(([_, s]) => s.confidence < 0.70);
    
    // Generate summary insights
    const summaryInsights = {
      overallConfidence: avgConfidence,
      averageScore: avgScore,
      totalCriteria: Object.keys(suggestions).length,
      highConfidenceCount: highConfidenceSuggestions.length,
      lowConfidenceCount: lowConfidenceSuggestions.length,
      processingTime: Math.random() * 5 + 3, // 3-8 seconds simulation
      dataQuality: opportunity.expectedIRR && opportunity.expectedMultiple && opportunity.expectedRisk ? 'high' : 'medium',
      recommendationLevel: avgScore > 7.5 ? 'strong_recommend' : avgScore > 6.0 ? 'recommend' : 'neutral'
    };

    return NextResponse.json({
      data: {
        opportunityId: id,
        templateId,
        suggestions,
        summaryInsights,
        opportunity: {
          name: opportunity.name,
          sector: opportunity.sector,
          assetType: opportunity.assetType,
          geography: opportunity.geography,
          askPrice: opportunity.askPrice
        },
        generatedAt: new Date().toISOString()
      },
      success: true,
    });

  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI suggestions', success: false },
      { status: 500 }
    );
  }
}

// POST /api/deal-screening/opportunities/[id]/ai-suggestions
// Accept user feedback on AI suggestions to improve future recommendations
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { feedback, templateId, userScores, acceptedSuggestions } = body;

    // Find the opportunity
    const opportunity = opportunities.find(opp => opp.id === id);
    
    if (!opportunity) {
      return NextResponse.json(
        { error: 'Opportunity not found', success: false },
        { status: 404 }
      );
    }

    // Log feedback for future ML model training
    console.log(`AI Suggestion Feedback for ${opportunity.name}:`, {
      templateId,
      acceptedSuggestions: acceptedSuggestions || [],
      userFeedback: feedback,
      userScores: userScores || {},
      timestamp: new Date().toISOString()
    });

    // In production, this would:
    // 1. Store feedback in database for model training
    // 2. Update user preference profiles
    // 3. Adjust suggestion algorithms based on patterns
    // 4. Generate personalized recommendations

    // Calculate feedback statistics
    const acceptanceRate = acceptedSuggestions ? 
      acceptedSuggestions.length / Object.keys(userScores || {}).length : 0;
    
    return NextResponse.json({
      data: {
        feedbackRecorded: true,
        acceptanceRate,
        improvementSuggestions: [
          'AI suggestions will be refined based on your preferences',
          'Similar deal patterns will be weighted more heavily',
          'Confidence scoring adjusted for your sector expertise'
        ],
        nextRecommendationId: `rec-${Date.now()}`
      },
      success: true,
    });

  } catch (error) {
    console.error('Error recording AI suggestion feedback:', error);
    return NextResponse.json(
      { error: 'Failed to record feedback', success: false },
      { status: 500 }
    );
  }
}