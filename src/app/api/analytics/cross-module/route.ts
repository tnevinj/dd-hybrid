import { NextResponse } from 'next/server';
import {
  getPortfolioMetrics,
  getFundOperationsMetrics,
  getLegalComplianceMetrics,
  getDealPipelineMetrics,
  getMarketIntelligenceMetrics
} from '@/lib/database';

export async function GET() {
  try {
    // Fetch portfolio metrics
    const portfolioMetrics = getPortfolioMetrics();
    
    // Fetch fund operations metrics
    const fundOperationsMetrics = getFundOperationsMetrics();
    
    // Fetch legal compliance metrics
    const legalComplianceMetrics = getLegalComplianceMetrics();
    
    // Fetch deal pipeline metrics
    const dealPipelineMetrics = getDealPipelineMetrics();
    
    // Fetch market intelligence metrics
    const marketIntelligenceMetrics = getMarketIntelligenceMetrics();

    const crossModuleData = {
      portfolioData: {
        avgIRR: portfolioMetrics.avgIRR || 0,
        avgMOIC: portfolioMetrics.avgMOIC || 0,
        avgDPI: portfolioMetrics.avgDPI || 0
      },
      fundOperations: {
        avgProcessingTime: fundOperationsMetrics.avgProcessingTime || 0,
        automationRate: fundOperationsMetrics.automationRate || 0,
        errorRate: fundOperationsMetrics.errorRate || 0
      },
      legalCompliance: {
        complianceIssues: legalComplianceMetrics.complianceIssues || 0,
        overdueReminders: legalComplianceMetrics.overdueReminders || 0,
        complianceScore: legalComplianceMetrics.complianceScore || 0
      },
      dealPipeline: {
        avgDealSize: dealPipelineMetrics.avgDealSize || 0,
        conversionRate: dealPipelineMetrics.conversionRate || 0,
        qualityScore: dealPipelineMetrics.qualityScore || 0
      },
      marketIntelligence: {
        accuracyRate: marketIntelligenceMetrics.accuracyRate || 0,
        dataFreshness: marketIntelligenceMetrics.dataFreshness || 0,
        sourceReliability: marketIntelligenceMetrics.sourceReliability || 0
      }
    };

    return NextResponse.json(crossModuleData);
  } catch (error) {
    console.error('Error fetching cross-module analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cross-module analytics data' },
      { status: 500 }
    );
  }
}
