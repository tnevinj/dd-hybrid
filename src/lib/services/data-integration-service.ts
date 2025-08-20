/**
 * Data Integration Service
 * Fetches real project/portfolio/deal data and binds it to content generation templates
 */

import { DataBinding, TransformationRule, ProjectContext } from '@/types/work-product';

export interface DataContext {
  [key: string]: any;
}

export interface DataIntegrationResult {
  data: DataContext;
  metadata: {
    lastUpdated: Date;
    dataQuality: number;
    sources: string[];
    completeness: number;
  };
}

export class DataIntegrationService {
  
  /**
   * Fetch and integrate all data for a project context
   */
  static async integrateProjectData(projectContext: ProjectContext): Promise<DataIntegrationResult> {
    const data: DataContext = {};
    const sources: string[] = [];
    let totalFields = 0;
    let populatedFields = 0;

    try {
      // Fetch primary workspace data (this is the main source that works)
      const projectData = await this.fetchProjectData(projectContext.projectId);
      if (projectData) {
        Object.assign(data, this.mapProjectData(projectData, projectContext));
        sources.push('workspace-api');
        totalFields += 15;
        populatedFields += Object.keys(data).length;
      }

      // Fetch portfolio data if this might be a portfolio asset
      try {
        const portfolioData = await this.fetchPortfolioData(projectContext.projectId);
        if (portfolioData) {
          Object.assign(data, this.mapPortfolioData(portfolioData));
          sources.push('portfolio-database');
          totalFields += 12;
          populatedFields += Object.keys(portfolioData).filter(key => portfolioData[key] !== undefined).length;
        }
      } catch (error) {
        console.log('Portfolio data not available for this project');
      }

      // Fetch deal screening data if this might be a deal opportunity
      try {
        const dealData = await this.fetchDealData(projectContext.projectId);
        if (dealData) {
          Object.assign(data, this.mapDealData(dealData));
          sources.push('deal-screening-database');
          totalFields += 15;
          populatedFields += Object.keys(dealData).filter(key => dealData[key] !== undefined).length;
        }
      } catch (error) {
        console.log('Deal data not available for this project');
      }

      // Extract additional context data from projectContext itself
      if (projectContext) {
        const contextData = this.mapProjectContext(projectContext);
        Object.assign(data, contextData);
        if (Object.keys(contextData).length > 0) {
          sources.push('project-context');
          totalFields += 8;
          populatedFields += Object.keys(contextData).length;
        }
      }

      // Calculate data quality metrics
      const completeness = totalFields > 0 ? populatedFields / totalFields : 0;
      const dataQuality = this.calculateDataQuality(data, sources);

      return {
        data,
        metadata: {
          lastUpdated: new Date(),
          dataQuality,
          sources,
          completeness
        }
      };

    } catch (error) {
      console.error('Error integrating project data:', error);
      
      // Return empty data structure - no fallbacks
      return {
        data: {},
        metadata: {
          lastUpdated: new Date(),
          dataQuality: 0,
          sources: [],
          completeness: 0
        }
      };
    }
  }

  /**
   * Apply data bindings to content with real data
   */
  static async applyDataBindings(
    content: string, 
    dataBindings: DataBinding[], 
    projectContext: ProjectContext
  ): Promise<string> {
    try {
      const integrationResult = await this.integrateProjectData(projectContext);
      let processedContent = content;

      // Replace placeholders with real data
      for (const [key, value] of Object.entries(integrationResult.data)) {
        const placeholder = `{${key}}`;
        const formattedValue = this.formatValue(value, key);
        processedContent = processedContent.replace(new RegExp(placeholder, 'g'), formattedValue);
      }

      return processedContent;
    } catch (error) {
      console.error('Error applying data bindings:', error);
      return content; // Return original content if binding fails
    }
  }

  /**
   * Get base URL for server-side requests
   */
  private static getBaseUrl(): string {
    // In server-side context, we need to construct the full URL
    if (typeof window === 'undefined') {
      // Server-side: use localhost or environment variable
      return process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    }
    // Client-side: use relative URLs
    return '';
  }

  /**
   * Fetch project data from workspace API
   */
  private static async fetchProjectData(projectId: string): Promise<any> {
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(`${baseUrl}/api/workspaces/${projectId}`);
      if (response.ok) {
        const result = await response.json();
        // Workspace API returns the workspace directly, not wrapped in data
        return result;
      }
    } catch (error) {
      console.error('Error fetching project data:', error);
    }
    return null;
  }

  /**
   * Fetch financial data for project
   * Note: Financial data integration is not yet implemented
   */
  private static async fetchFinancialData(projectId: string): Promise<any> {
    // Financial data endpoint not yet available
    // When implemented, this should call /api/projects/{projectId}/financials
    // and return structured financial metrics, projections, and KPIs
    return null;
  }

  /**
   * Fetch portfolio data
   */
  private static async fetchPortfolioData(projectId: string): Promise<any> {
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(`${baseUrl}/api/portfolio`);
      if (response.ok) {
        const result = await response.json();
        // Portfolio API returns array directly, not wrapped in data
        const portfolios = Array.isArray(result) ? result : result.data || [];
        // Find portfolio asset that matches the project
        const portfolio = portfolios.find((p: any) => 
          p.assets?.some((asset: any) => asset.id === projectId)
        );
        if (portfolio) {
          const asset = portfolio.assets.find((asset: any) => asset.id === projectId);
          return asset;
        }
      }
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    }
    return null;
  }

  /**
   * Fetch deal screening data
   */
  private static async fetchDealData(projectId: string): Promise<any> {
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(`${baseUrl}/api/deal-screening/opportunities`);
      if (response.ok) {
        const result = await response.json();
        const deal = result.opportunities?.find((opp: any) => opp.id === projectId);
        return deal;
      }
    } catch (error) {
      console.error('Error fetching deal data:', error);
    }
    return null;
  }

  /**
   * Fetch team data
   */
  private static async fetchTeamData(projectId: string): Promise<any> {
    // Team data is already included in workspace data from /api/workspaces
    // Dedicated team endpoint not required as team information is embedded
    // in workspace responses with member roles, skills, and availability
    return null;
  }

  /**
   * Map project data to template variables - only real data, no fallbacks
   */
  private static mapProjectData(projectData: any, projectContext: ProjectContext): DataContext {
    const data: DataContext = {};
    
    // Only include data that actually exists
    if (projectData.title || projectData.name) {
      data.PROJECT_NAME = projectData.title || projectData.name;
    }
    if (projectData.sector) {
      data.SECTOR = projectData.sector;
    }
    if (projectData.region) {
      data.GEOGRAPHY = projectData.region;
    }
    if (projectData.phase) {
      data.DEAL_STAGE = projectData.phase;
    }
    if (projectData.overallProgress !== undefined && projectData.overallProgress !== null) {
      data.PROGRESS = `${projectData.overallProgress}%`;
    }
    if (projectData.investmentSize) {
      // Extract numeric value from strings like "$50M-100M"
      const dealValueMatch = projectData.investmentSize.match(/\$(\d+(?:\.\d+)?)[MB]/);
      if (dealValueMatch) {
        const value = parseFloat(dealValueMatch[1]);
        const unit = projectData.investmentSize.includes('M') ? 'M' : 'B';
        data.DEAL_VALUE = `$${value}${unit}`;
      }
    }
    if (projectData.createdAt) {
      data.CREATED_DATE = new Date(projectData.createdAt).toLocaleDateString();
    }
    if (projectData.updatedAt) {
      data.LAST_UPDATED = new Date(projectData.updatedAt).toLocaleDateString();
    }
    
    // Extract real team data
    if (projectData.participants && projectData.participants.length > 0) {
      data.TEAM_SIZE = projectData.participants.length.toString();
      data.TEAM_MEMBERS = projectData.participants.map((p: any) => p.userId || p.role || 'Team Member').join(', ');
      data.TEAM_LEAD = projectData.participants.find((p: any) => p.role === 'LEAD')?.userId || projectData.participants[0]?.userId;
    }
    
    // Extract real financial insights from analysis components
    if (projectData.analysisComponents && projectData.analysisComponents.length > 0) {
      for (const component of projectData.analysisComponents) {
        if (component.findings) {
          // Extract actual financial metrics from findings text
          this.extractFinancialMetricsFromText(component.findings, data);
        }
      }
    }
    
    // Map SQLite workspace data if this is database format
    if (projectData.deal_value !== undefined) {
      data.DEAL_VALUE = this.formatCurrency(projectData.deal_value / 100); // Convert cents to dollars
    }
    if (projectData.risk_rating) {
      data.RISK_RATING = projectData.risk_rating;
    }
    if (projectData.team_members && Array.isArray(projectData.team_members)) {
      data.TEAM_SIZE = projectData.team_members.length.toString();
      data.TEAM_MEMBERS = projectData.team_members.join(', ');
      data.TEAM_LEAD = projectData.team_members[0];
    }
    if (projectData.progress !== undefined && projectData.progress !== null) {
      data.PROGRESS = `${projectData.progress}%`;
    }
    
    return data;
  }

  /**
   * Extract financial metrics from text findings
   */
  private static extractFinancialMetricsFromText(text: string, data: DataContext): void {
    // Extract IRR mentions like "IRR of 25%" or "25% IRR"
    const irrMatch = text.match(/(?:IRR\s+of\s+|IRR:\s*)?(\d+(?:\.\d+)?)%/i);
    if (irrMatch) {
      data.IRR = `${irrMatch[1]}%`;
    }
    
    // Extract MOIC/Multiple mentions like "4.2x multiple" or "MOIC of 3.5x"
    const moicMatch = text.match(/(?:MOIC\s+of\s+|multiple\s+of\s+|ratio\s+of\s+)?(\d+(?:\.\d+)?)x/i);
    if (moicMatch) {
      data.MOIC = `${moicMatch[1]}x`;
    }
    
    // Extract revenue growth like "45% YoY" or "growth (45%)"
    const growthMatch = text.match(/(?:growth|YoY).*?(\d+(?:\.\d+)?)%/i);
    if (growthMatch) {
      data.REVENUE_GROWTH = `${growthMatch[1]}%`;
    }
    
    // Extract LTV/CAC ratio
    const ltvCacMatch = text.match(/LTV\/CAC.*?(\d+(?:\.\d+)?)x/i);
    if (ltvCacMatch) {
      data.LTV_CAC_RATIO = `${ltvCacMatch[1]}x`;
    }
    
    // Extract margins like "gross margins of 75%"
    const marginMatch = text.match(/(?:gross\s+)?margin.*?(\d+(?:\.\d+)?)%/i);
    if (marginMatch) {
      data.GROSS_MARGIN = `${marginMatch[1]}%`;
    }
  }

  /**
   * Map financial data to template variables - only real data
   */
  private static mapFinancialData(financialData: any): DataContext {
    const data: DataContext = {};
    
    // Only include financial data that actually exists
    if (financialData.currentValue !== undefined && financialData.currentValue !== null) {
      data.CURRENT_VALUE = this.formatCurrency(financialData.currentValue);
    }
    if (financialData.irr !== undefined && financialData.irr !== null) {
      data.IRR = `${(financialData.irr * 100).toFixed(1)}%`;
    }
    if (financialData.moic !== undefined && financialData.moic !== null) {
      data.MOIC = `${financialData.moic.toFixed(1)}x`;
    }
    if (financialData.revenue !== undefined && financialData.revenue !== null) {
      data.REVENUE = this.formatCurrency(financialData.revenue);
    }
    if (financialData.ebitda !== undefined && financialData.ebitda !== null) {
      data.EBITDA = this.formatCurrency(financialData.ebitda);
    }
    if (financialData.ebitdaMargin !== undefined && financialData.ebitdaMargin !== null) {
      data.EBITDA_MARGIN = `${(financialData.ebitdaMargin * 100).toFixed(1)}%`;
    }
    if (financialData.expectedIRR !== undefined && financialData.expectedIRR !== null) {
      data.PROJECTED_IRR = `${(financialData.expectedIRR * 100).toFixed(1)}%`;
    }
    if (financialData.targetMultiple !== undefined && financialData.targetMultiple !== null) {
      data.TARGET_MULTIPLE = `${financialData.targetMultiple.toFixed(1)}x`;
    }
    if (financialData.revenueGrowth !== undefined && financialData.revenueGrowth !== null) {
      data.REVENUE_GROWTH = `${(financialData.revenueGrowth * 100).toFixed(1)}%`;
    }
    
    return data;
  }

  /**
   * Format currency values
   */
  private static formatCurrency(value: number): string {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    } else {
      return `$${value.toLocaleString()}`;
    }
  }

  /**
   * Map portfolio data to template variables - only real data
   */
  private static mapPortfolioData(portfolioData: any): DataContext {
    const data: DataContext = {};
    
    // Only include portfolio data that actually exists
    if (portfolioData.assetType) {
      data.ASSET_TYPE = portfolioData.assetType;
    }
    if (portfolioData.acquisitionValue !== undefined && portfolioData.acquisitionValue !== null) {
      data.ACQUISITION_VALUE = this.formatCurrency(portfolioData.acquisitionValue);
    }
    if (portfolioData.currentValue !== undefined && portfolioData.currentValue !== null) {
      data.CURRENT_VALUE = this.formatCurrency(portfolioData.currentValue);
    }
    
    // Real performance metrics
    if (portfolioData.performance) {
      if (portfolioData.performance.totalReturn !== undefined && portfolioData.performance.totalReturn !== null) {
        data.TOTAL_RETURN = `${(portfolioData.performance.totalReturn * 100).toFixed(1)}%`;
      }
      if (portfolioData.performance.irr !== undefined && portfolioData.performance.irr !== null) {
        data.PORTFOLIO_IRR = `${(portfolioData.performance.irr * 100).toFixed(1)}%`;
      }
      if (portfolioData.performance.moic !== undefined && portfolioData.performance.moic !== null) {
        data.MOIC = `${portfolioData.performance.moic.toFixed(1)}x`;
      }
    }
    
    // Real ESG metrics
    if (portfolioData.esgMetrics?.overallScore !== undefined && portfolioData.esgMetrics?.overallScore !== null) {
      data.ESG_SCORE = `${portfolioData.esgMetrics.overallScore}/100`;
    }
    
    // Real location data
    if (portfolioData.location) {
      if (portfolioData.location.country) {
        data.LOCATION_COUNTRY = portfolioData.location.country;
      }
      if (portfolioData.location.city) {
        data.LOCATION_CITY = portfolioData.location.city;
      }
    }
    
    // Real sector and risk data
    if (portfolioData.sector) {
      data.PORTFOLIO_SECTOR = portfolioData.sector;
    }
    if (portfolioData.riskRating) {
      data.PORTFOLIO_RISK = portfolioData.riskRating;
    }
    if (portfolioData.status) {
      data.ASSET_STATUS = portfolioData.status;
    }
    
    return data;
  }

  /**
   * Map deal data to template variables - only real data
   */
  private static mapDealData(dealData: any): DataContext {
    const data: DataContext = {};
    
    // Only include deal data that actually exists
    if (dealData.askPrice !== undefined && dealData.askPrice !== null) {
      data.ASK_PRICE = this.formatCurrency(dealData.askPrice);
    }
    if (dealData.expectedIRR !== undefined && dealData.expectedIRR !== null) {
      data.EXPECTED_IRR = `${(dealData.expectedIRR * 100).toFixed(1)}%`;
    }
    if (dealData.expectedRisk !== undefined && dealData.expectedRisk !== null) {
      data.EXPECTED_RISK = `${(dealData.expectedRisk * 100).toFixed(1)}%`;
    }
    if (dealData.expectedMultiple !== undefined && dealData.expectedMultiple !== null) {
      data.TARGET_MULTIPLE = `${dealData.expectedMultiple.toFixed(1)}x`;
    }
    if (dealData.vintage) {
      data.VINTAGE = dealData.vintage;
    }
    if (dealData.aiConfidence !== undefined && dealData.aiConfidence !== null) {
      data.AI_CONFIDENCE = `${(dealData.aiConfidence * 100).toFixed(0)}%`;
      data.CONFIDENCE_SCORE = `${(dealData.aiConfidence * 100).toFixed(0)}%`;
    }
    
    // Extract real risk scores from the scores array
    if (dealData.scores && dealData.scores.length > 0) {
      for (const score of dealData.scores) {
        if (score.criterionId && score.normalizedScore !== undefined) {
          const criterionName = score.criterionId.toUpperCase().replace('-', '_');
          data[`${criterionName}_SCORE`] = `${(score.normalizedScore * 100).toFixed(0)}%`;
        }
      }
    }
    
    // Real deal metadata
    if (dealData.sector) {
      data.DEAL_SECTOR = dealData.sector;
    }
    if (dealData.geography) {
      data.DEAL_GEOGRAPHY = dealData.geography;
    }
    if (dealData.assetType) {
      data.ASSET_TYPE = dealData.assetType;
    }
    if (dealData.status) {
      data.DEAL_STATUS = dealData.status;
    }
    
    return data;
  }

  /**
   * Map team data to template variables - only real data
   */
  private static mapTeamData(teamData: any): DataContext {
    const data: DataContext = {};
    
    // Only include team data that actually exists
    if (teamData.teamSize !== undefined && teamData.teamSize !== null) {
      data.TEAM_SIZE = teamData.teamSize.toString();
    } else if (teamData.members && Array.isArray(teamData.members) && teamData.members.length > 0) {
      data.TEAM_SIZE = teamData.members.length.toString();
      data.TEAM_MEMBERS = teamData.members.join(', ');
      data.TEAM_LEAD = teamData.members[0];
    }
    
    if (teamData.lead) {
      data.TEAM_LEAD = teamData.lead;
    }
    
    if (teamData.operationalScore !== undefined && teamData.operationalScore !== null) {
      data.OPERATIONAL_SCORE = `${(teamData.operationalScore * 100).toFixed(0)}%`;
    }
    
    return data;
  }

  /**
   * Map project context to template variables - extract available context data
   */
  private static mapProjectContext(projectContext: any): DataContext {
    const data: DataContext = {};
    
    // Map available context fields
    if (projectContext.projectName) {
      data.PROJECT_NAME = projectContext.projectName;
    }
    if (projectContext.sector) {
      data.SECTOR = projectContext.sector;
    }
    if (projectContext.geography) {
      data.GEOGRAPHY = projectContext.geography;
    }
    if (projectContext.stage) {
      data.DEAL_STAGE = projectContext.stage;
    }
    if (projectContext.dealValue !== undefined && projectContext.dealValue !== null) {
      data.DEAL_VALUE = this.formatCurrency(projectContext.dealValue);
    }
    if (projectContext.riskRating) {
      data.RISK_RATING = projectContext.riskRating;
    }
    if (projectContext.progress !== undefined && projectContext.progress !== null) {
      data.PROGRESS = `${projectContext.progress}%`;
    }
    if (projectContext.projectType) {
      data.PROJECT_TYPE = projectContext.projectType;
    }
    
    return data;
  }


  /**
   * Calculate overall data quality score based on real data availability
   */
  private static calculateDataQuality(data: DataContext, sources: string[]): number {
    // Count total fields with actual data
    const totalFields = Object.keys(data).length;
    
    if (totalFields === 0) {
      return 0; // No data available
    }
    
    // Base score from data availability
    let qualityScore = Math.min(totalFields / 20, 0.7); // Up to 70% for data volume
    
    // Bonus for multiple reliable data sources
    qualityScore += Math.min(sources.length * 0.05, 0.15);
    
    // Bonus for key financial metrics
    const keyMetrics = ['IRR', 'MOIC', 'DEAL_VALUE', 'CURRENT_VALUE', 'REVENUE'];
    const availableKeyMetrics = keyMetrics.filter(metric => data[metric]);
    qualityScore += (availableKeyMetrics.length / keyMetrics.length) * 0.15;
    
    return Math.min(qualityScore, 1.0);
  }


  /**
   * Transform data according to transformation rules
   */
  static applyTransformationRules(data: any, rules: TransformationRule[]): any {
    let transformedData = { ...data };

    for (const rule of rules) {
      try {
        switch (rule.type) {
          case 'format':
            transformedData[rule.targetField] = this.applyFormatTransformation(
              transformedData[rule.sourceField], 
              rule.operation, 
              rule.parameters
            );
            break;
          case 'calculate':
            transformedData[rule.targetField] = this.applyCalculationTransformation(
              transformedData, 
              rule.operation, 
              rule.parameters
            );
            break;
          // Add more transformation types as needed
        }
      } catch (error) {
        console.error(`Error applying transformation rule ${rule.id}:`, error);
      }
    }

    return transformedData;
  }

  /**
   * Apply format transformations
   */
  private static applyFormatTransformation(value: any, operation: string, parameters: any): string {
    switch (operation) {
      case 'currency_millions':
        return `$${(value / 1000000).toFixed(parameters.precision || 1)}M`;
      case 'percentage':
        return `${(value * 100).toFixed(parameters.precision || 1)}%`;
      case 'currency_array':
        if (Array.isArray(value)) {
          return value.map(v => `$${(v / 1000000).toFixed(1)}M`).join(', ');
        }
        return this.formatValue(value, 'currency');
      default:
        return String(value);
    }
  }

  /**
   * Apply calculation transformations
   */
  private static applyCalculationTransformation(data: any, operation: string, parameters: any): any {
    switch (operation) {
      case 'ratio':
        const numerator = data[parameters.numerator] || 0;
        const denominator = data[parameters.denominator] || 1;
        return denominator !== 0 ? numerator / denominator : 0;
      case 'sum':
        return parameters.fields.reduce((sum: number, field: string) => sum + (data[field] || 0), 0);
      default:
        return 0;
    }
  }
}