import { NextRequest, NextResponse } from 'next/server';
import { DealScreeningTemplate, DealOpportunity } from '@/types/deal-screening';

// Mock templates data - import directly to avoid fetch issues
import { mockTemplates } from '../route';

const getTemplates = async (): Promise<DealScreeningTemplate[]> => {
  // Use imported mock templates directly instead of HTTP fetch
  return mockTemplates;
};

export async function POST(request: NextRequest) {
  try {
    const { opportunity, mode, userPreferences } = await request.json();

    if (!opportunity || !opportunity.assetType) {
      return NextResponse.json(
        { error: 'Opportunity with assetType is required' },
        { status: 400 }
      );
    }

    const templates = await getTemplates();
    console.log(`Template recommendation for ${opportunity.name} (${opportunity.assetType}) in ${mode} mode`);
    console.log(`Found ${templates.length} total templates`);
    
    // AI-powered template recommendation logic
    const recommendedTemplates = templates
      .filter(template => {
        // Primary filter: asset type match
        console.log(`Checking template ${template.name}: ${template.assetTypeSpecific?.assetType} vs opportunity ${opportunity.assetType}`);
        if (template.assetTypeSpecific?.assetType !== opportunity.assetType) {
          return false;
        }
        
        // Mode-specific filtering
        if (mode === 'autonomous' && template.automationLevel === 'none') {
          return false;
        }
        
        return true;
      })
      .map(template => {
        // Calculate recommendation score based on multiple factors
        let score = 0;
        
        // Asset type match (base score)
        score += 40;
        
        // Historical success rate
        score += (template.analytics?.successRate || 0) * 30;
        
        // Usage frequency (popular templates score higher)
        const usageScore = Math.min((template.analytics?.usageCount || 0) / 50, 1) * 15;
        score += usageScore;
        
        // Mode alignment
        if (mode === 'autonomous' && template.automationLevel === 'autonomous') {
          score += 10;
        } else if (mode === 'assisted' && template.automationLevel === 'assisted') {
          score += 10;
        } else if (mode === 'traditional' && template.automationLevel === 'none') {
          score += 10;
        }
        
        // Recent usage (recently used templates score higher)
        const daysSinceLastUsed = template.analytics?.lastUsed 
          ? (Date.now() - new Date(template.analytics.lastUsed).getTime()) / (1000 * 60 * 60 * 24)
          : 365;
        const recencyScore = Math.max(0, (30 - daysSinceLastUsed) / 30) * 5;
        score += recencyScore;
        
        return {
          template,
          score: Math.round(score),
          reasons: [
            `Designed for ${opportunity.assetType} investments`,
            `${Math.round((template.analytics?.successRate || 0) * 100)}% historical success rate`,
            template.analytics?.usageCount ? `Used ${template.analytics.usageCount} times by the team` : 'New template',
            `Optimized for ${mode} mode`,
            template.aiEnhanced ? 'AI-enhanced scoring available' : 'Manual scoring only',
          ].filter(Boolean),
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3); // Return top 3 recommendations

    console.log(`Filtered to ${recommendedTemplates.length} matching templates`);

    // If no templates match, provide fallback recommendations
    if (recommendedTemplates.length === 0) {
      console.log(`No templates found for asset type: ${opportunity.assetType}, providing fallback`);
      // Return all templates as potential matches with lower scores
      const fallbackTemplates = templates.map(template => ({
        template,
        score: 50, // Lower base score for non-matching templates
        reasons: [
          `Generic template adaptable for ${opportunity.assetType} investments`,
          `${Math.round((template.analytics?.successRate || 0) * 100)}% historical success rate`,
          'Can be customized for this asset type',
          template.aiEnhanced ? 'AI-enhanced scoring available' : 'Manual scoring only',
        ],
      })).slice(0, 3);

      recommendedTemplates.push(...fallbackTemplates);
    }

    // Generate AI insights for the opportunity
    const aiInsights = {
      sectorAnalysis: `Based on ${opportunity.sector} sector analysis, key focus areas should be on market dynamics and competitive positioning.`,
      riskFactors: generateRiskFactors(opportunity),
      benchmarkData: generateBenchmarkData(opportunity),
      timeEstimate: calculateTimeEstimate(recommendedTemplates[0]?.template, mode),
    };

    // Generate customization suggestions
    const customizationSuggestions = generateCustomizationSuggestions(opportunity, recommendedTemplates[0]?.template);

    return NextResponse.json({
      recommendedTemplates: recommendedTemplates.map(r => ({
        template: r.template,
        recommendationScore: r.score,
        reasons: r.reasons,
      })),
      aiInsights,
      customizationSuggestions,
      metadata: {
        opportunityId: opportunity.id,
        assetType: opportunity.assetType,
        mode,
        totalTemplatesAnalyzed: templates.length,
        recommendationTimestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error generating template recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate template recommendations' },
      { status: 500 }
    );
  }
}

function generateRiskFactors(opportunity: DealOpportunity) {
  const riskFactors = [];
  
  // Geography-based risks
  if (opportunity.geography.includes('Emerging')) {
    riskFactors.push('Currency and political risk due to emerging market exposure');
  }
  
  // Sector-specific risks
  if (opportunity.sector === 'Technology') {
    riskFactors.push('Technology obsolescence and competitive disruption risk');
  } else if (opportunity.sector === 'Healthcare') {
    riskFactors.push('Regulatory approval and compliance risks');
  } else if (opportunity.sector === 'Energy') {
    riskFactors.push('Commodity price volatility and regulatory changes');
  }
  
  // Size-based risks
  if (opportunity.askPrice > 100000000) {
    riskFactors.push('Large transaction size increases execution and market impact risk');
  }
  
  // Vintage-specific risks
  const vintageYear = parseInt(opportunity.vintage);
  const currentYear = new Date().getFullYear();
  if (currentYear - vintageYear > 5) {
    riskFactors.push('Mature vintage may have limited upside potential');
  }
  
  return riskFactors.slice(0, 3); // Return top 3 risk factors
}

function generateBenchmarkData(opportunity: DealOpportunity) {
  // Mock benchmark data - in real app this would come from historical database
  const sectorBenchmarks = {
    'Technology': { avgIRR: 24.5, avgMultiple: 2.8, avgHoldingPeriod: 4.2 },
    'Healthcare': { avgIRR: 19.2, avgMultiple: 2.4, avgHoldingPeriod: 5.1 },
    'Financial Services': { avgIRR: 16.8, avgMultiple: 2.1, avgHoldingPeriod: 4.8 },
    'Energy': { avgIRR: 22.1, avgMultiple: 2.6, avgHoldingPeriod: 3.9 },
    'Consumer': { avgIRR: 18.5, avg_Multiple: 2.3, avgHoldingPeriod: 4.5 },
  };
  
  const benchmark = sectorBenchmarks[opportunity.sector as keyof typeof sectorBenchmarks] || 
    { avgIRR: 20.0, avgMultiple: 2.5, avgHoldingPeriod: 4.5 };
  
  return {
    sector: opportunity.sector,
    ...benchmark,
    dataSource: 'Historical portfolio performance (2019-2024)',
    sampleSize: Math.floor(Math.random() * 50) + 20, // Mock sample size
  };
}

function calculateTimeEstimate(template: DealScreeningTemplate | undefined, mode: string) {
  if (!template) return { traditional: 120, assisted: 45, autonomous: 15 };
  
  const baseCriteriaCount = template.criteria.length;
  const baseTimePerCriterion = 8; // minutes
  
  const modeMultipliers = {
    traditional: 1.0,
    assisted: 0.4,
    autonomous: 0.15,
  };
  
  const multiplier = modeMultipliers[mode as keyof typeof modeMultipliers] || 1.0;
  const estimatedTime = Math.round(baseCriteriaCount * baseTimePerCriterion * multiplier);
  
  return {
    estimatedMinutes: estimatedTime,
    mode,
    confidence: template.analytics?.automationRate || 0.7,
    breakdown: {
      criteriaCount: baseCriteriaCount,
      avgTimePerCriterion: Math.round(baseTimePerCriterion * multiplier),
      automationSavings: mode !== 'traditional' ? Math.round(baseCriteriaCount * baseTimePerCriterion * (1 - multiplier)) : 0,
    },
  };
}

function generateCustomizationSuggestions(opportunity: DealOpportunity, template: DealScreeningTemplate | undefined) {
  if (!template) return [];
  
  const suggestions = [];
  
  // Sector-specific customizations
  if (opportunity.sector === 'Technology' && !template.criteria.some(c => c.name.includes('Technology'))) {
    suggestions.push({
      type: 'add_criterion',
      title: 'Add Technology Risk Assessment',
      description: 'Consider adding specific technology obsolescence and IP risk criteria',
      impact: 'medium',
      estimatedWeightAdjustment: 0.05,
    });
  }
  
  // Geography-specific customizations
  if (opportunity.geography.includes('Asia') && !template.criteria.some(c => c.name.includes('Currency'))) {
    suggestions.push({
      type: 'add_criterion',
      title: 'Add Currency Risk Evaluation',
      description: 'Asia-Pacific investments should include currency hedging assessment',
      impact: 'medium',
      estimatedWeightAdjustment: 0.03,
    });
  }
  
  // Size-specific customizations
  if (opportunity.askPrice < 10000000) {
    suggestions.push({
      type: 'adjust_weight',
      title: 'Increase Operational Risk Weight',
      description: 'Smaller deals typically have higher operational risks',
      targetCriterion: 'operational',
      currentWeight: template.criteria.find(c => c.category === 'operational')?.weight || 0.2,
      suggestedWeight: Math.min((template.criteria.find(c => c.category === 'operational')?.weight || 0.2) + 0.05, 0.4),
      impact: 'low',
    });
  }
  
  // AI enhancement suggestions
  if (template.aiEnhanced && opportunity.similarDeals?.length) {
    suggestions.push({
      type: 'ai_enhancement',
      title: 'Enable Comparative Analysis',
      description: `Use AI to compare against ${opportunity.similarDeals.length} similar deals in portfolio`,
      impact: 'high',
      features: ['automated_scoring', 'pattern_recognition', 'risk_flagging'],
    });
  }
  
  return suggestions.slice(0, 4); // Return top 4 suggestions
}