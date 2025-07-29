import { UnifiedAsset, AssetType } from '@/types/portfolio';

export interface PrivateEquityMetrics {
  // Core PE Metrics
  tvpi: number;  // Total Value to Paid-in Capital
  dpi: number;   // Distributions to Paid-in Capital
  rvpi: number;  // Residual Value to Paid-in Capital
  pme: number;   // Public Market Equivalent
  
  // Advanced PE Analytics
  vintageAnalysis: Record<string, VintageMetrics>;
  stageAnalysis: Record<string, StageMetrics>;
  jCurveAnalysis: JCurveDataPoint[];
  
  // Performance Attribution
  managerAttribution: Record<string, ManagerMetrics>;
  sectorPerformance: Record<string, SectorPerformance>;
  
  // Cash Flow Analytics
  cumulativeContributions: number;
  cumulativeDistributions: number;
  netCashFlow: number;
  cashFlowTiming: CashFlowDataPoint[];
  
  // Fund-Level Metrics
  fundMultiple: number;
  grossIRR: number;
  netIRR: number;
  carriedInterest: number;
  managementFees: number;
}

export interface VintageMetrics {
  year: string;
  investmentCount: number;
  totalInvested: number;
  currentValue: number;
  tvpi: number;
  dpi: number;
  irr: number;
  maturity: 'early' | 'mid' | 'mature';
}

export interface StageMetrics {
  stage: 'seed' | 'series_a' | 'series_b' | 'series_c' | 'growth' | 'mature';
  investmentCount: number;
  totalInvested: number;
  currentValue: number;
  avgHoldingPeriod: number;
  successRate: number;
  avgMultiple: number;
}

export interface JCurveDataPoint {
  quarter: number;
  cumulativeContributions: number;
  cumulativeDistributions: number;
  netValue: number;
  multiple: number;
}

export interface ManagerMetrics {
  manager: string;
  fundCount: number;
  totalCommitments: number;
  avgTVPI: number;
  avgDPI: number;
  avgIRR: number;
  trackRecord: number; // years
}

export interface SectorPerformance {
  sector: string;
  investmentCount: number;
  totalInvested: number;
  currentValue: number;
  realizedValue: number;
  tvpi: number;
  irr: number;
  topQuartile: boolean;
}

export interface CashFlowDataPoint {
  date: string;
  contribution: number;
  distribution: number;
  netCashFlow: number;
  cumulativeNet: number;
}

export class PrivateEquityAnalytics {
  private assets: UnifiedAsset[];
  private benchmarkReturn: number = 0.12; // S&P 500 equivalent

  constructor(assets: UnifiedAsset[]) {
    this.assets = assets.filter(asset => asset.assetType === 'traditional');
  }

  // Core PE Metric Calculations
  calculateTVPI(): number {
    const totalInvested = this.assets.reduce((sum, asset) => sum + asset.acquisitionValue, 0);
    const totalValue = this.assets.reduce((sum, asset) => sum + asset.currentValue, 0);
    
    return totalInvested > 0 ? totalValue / totalInvested : 0;
  }

  calculateDPI(): number {
    const totalInvested = this.assets.reduce((sum, asset) => sum + asset.acquisitionValue, 0);
    // Simulate distributions - in real system this would come from actual cash flows
    const totalDistributions = this.assets.reduce((sum, asset) => {
      // Simulate some assets having distributions based on performance
      if (asset.performance.moic > 1.5) {
        return sum + (asset.acquisitionValue * (asset.performance.moic - 1) * 0.3); // 30% distributed
      }
      return sum;
    }, 0);
    
    return totalInvested > 0 ? totalDistributions / totalInvested : 0;
  }

  calculateRVPI(): number {
    const tvpi = this.calculateTVPI();
    const dpi = this.calculateDPI();
    return Math.max(0, tvpi - dpi);
  }

  calculatePME(): number {
    // Public Market Equivalent calculation
    // This is a simplified version - real PME requires detailed cash flow timing
    const portfolioReturn = this.calculateNetIRR();
    const benchmarkReturn = this.benchmarkReturn;
    
    // PME+ methodology approximation
    const pmeRatio = Math.pow(1 + portfolioReturn, this.getAvgHoldingPeriod()) / 
                     Math.pow(1 + benchmarkReturn, this.getAvgHoldingPeriod());
    
    return pmeRatio;
  }

  calculateNetIRR(): number {
    // Simplified IRR calculation for portfolio
    const weightedIRR = this.assets.reduce((sum, asset) => {
      return sum + (asset.performance.irr * asset.currentValue);
    }, 0);
    
    const totalValue = this.assets.reduce((sum, asset) => sum + asset.currentValue, 0);
    return totalValue > 0 ? weightedIRR / totalValue : 0;
  }

  getAvgHoldingPeriod(): number {
    const totalHoldingPeriod = this.assets.reduce((sum, asset) => {
      const acquisitionDate = new Date(asset.acquisitionDate);
      const today = new Date();
      const yearsHeld = (today.getTime() - acquisitionDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
      return sum + yearsHeld;
    }, 0);
    
    return this.assets.length > 0 ? totalHoldingPeriod / this.assets.length : 0;
  }

  // Vintage Analysis
  calculateVintageAnalysis(): Record<string, VintageMetrics> {
    const vintageGroups = this.assets.reduce((acc, asset) => {
      const vintage = new Date(asset.acquisitionDate).getFullYear().toString();
      if (!acc[vintage]) {
        acc[vintage] = [];
      }
      acc[vintage].push(asset);
      return acc;
    }, {} as Record<string, UnifiedAsset[]>);

    const vintageMetrics: Record<string, VintageMetrics> = {};
    
    Object.entries(vintageGroups).forEach(([year, assets]) => {
      const totalInvested = assets.reduce((sum, asset) => sum + asset.acquisitionValue, 0);
      const currentValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
      const tvpi = totalInvested > 0 ? currentValue / totalInvested : 0;
      const avgIRR = assets.reduce((sum, asset) => sum + asset.performance.irr, 0) / assets.length;
      
      // Determine maturity based on vintage year
      const currentYear = new Date().getFullYear();
      const vintageYear = parseInt(year);
      const age = currentYear - vintageYear;
      
      let maturity: 'early' | 'mid' | 'mature';
      if (age <= 3) maturity = 'early';
      else if (age <= 7) maturity = 'mid';
      else maturity = 'mature';

      vintageMetrics[year] = {
        year,
        investmentCount: assets.length,
        totalInvested,
        currentValue,
        tvpi,
        dpi: this.calculateDPI(), // Simplified - would calculate per vintage
        irr: avgIRR,
        maturity
      };
    });

    return vintageMetrics;
  }

  // Stage Analysis
  calculateStageAnalysis(): Record<string, StageMetrics> {
    const traditionalAssets = this.assets.filter(asset => 
      asset.assetType === 'traditional' && asset.specificMetrics
    );

    const stageGroups = traditionalAssets.reduce((acc, asset) => {
      const stage = asset.specificMetrics.companyStage;
      if (!acc[stage]) {
        acc[stage] = [];
      }
      acc[stage].push(asset);
      return acc;
    }, {} as Record<string, UnifiedAsset[]>);

    const stageMetrics: Record<string, StageMetrics> = {};
    
    Object.entries(stageGroups).forEach(([stage, assets]) => {
      const totalInvested = assets.reduce((sum, asset) => sum + asset.acquisitionValue, 0);
      const currentValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
      const avgHoldingPeriod = assets.reduce((sum, asset) => {
        const years = (new Date().getTime() - new Date(asset.acquisitionDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
        return sum + years;
      }, 0) / assets.length;
      
      // Calculate success rate (MOIC > 1.0)
      const successfulInvestments = assets.filter(asset => asset.performance.moic > 1.0).length;
      const successRate = assets.length > 0 ? successfulInvestments / assets.length : 0;
      
      const avgMultiple = assets.reduce((sum, asset) => sum + asset.performance.moic, 0) / assets.length;

      stageMetrics[stage] = {
        stage: stage as StageMetrics['stage'],
        investmentCount: assets.length,
        totalInvested,
        currentValue,
        avgHoldingPeriod,
        successRate,
        avgMultiple
      };
    });

    return stageMetrics;
  }

  // J-Curve Analysis
  calculateJCurveAnalysis(): JCurveDataPoint[] {
    // Simulate J-curve progression over quarters
    const quarters = 20; // 5 years of quarterly data
    const jCurveData: JCurveDataPoint[] = [];
    
    let cumulativeContributions = 0;
    let cumulativeDistributions = 0;
    
    for (let quarter = 1; quarter <= quarters; quarter++) {
      // Early quarters: high contributions, low distributions
      const contributionRate = Math.max(0.1, 1 - (quarter / quarters));
      const distributionRate = Math.max(0, (quarter - 8) / quarters); // Start distributing after Q8
      
      const quarterContributions = contributionRate * 100000; // Simplified amounts
      const quarterDistributions = distributionRate * 150000;
      
      cumulativeContributions += quarterContributions;
      cumulativeDistributions += quarterDistributions;
      
      const netValue = cumulativeDistributions - cumulativeContributions;
      const multiple = cumulativeContributions > 0 ? 
        (cumulativeDistributions + (cumulativeContributions * 1.2)) / cumulativeContributions : 0;
      
      jCurveData.push({
        quarter,
        cumulativeContributions,
        cumulativeDistributions,
        netValue,
        multiple
      });
    }
    
    return jCurveData;
  }

  // Sector Performance Analysis
  calculateSectorPerformance(): Record<string, SectorPerformance> {
    const sectorGroups = this.assets.reduce((acc, asset) => {
      const sector = asset.sector || 'Other';
      if (!acc[sector]) {
        acc[sector] = [];
      }
      acc[sector].push(asset);
      return acc;
    }, {} as Record<string, UnifiedAsset[]>);

    const sectorMetrics: Record<string, SectorPerformance> = {};
    
    Object.entries(sectorGroups).forEach(([sector, assets]) => {
      const totalInvested = assets.reduce((sum, asset) => sum + asset.acquisitionValue, 0);
      const currentValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
      const realizedValue = assets.reduce((sum, asset) => {
        // Simulate realized gains for some assets
        return sum + (asset.performance.moic > 2 ? asset.acquisitionValue * 0.5 : 0);
      }, 0);
      
      const tvpi = totalInvested > 0 ? (currentValue + realizedValue) / totalInvested : 0;
      const avgIRR = assets.reduce((sum, asset) => sum + asset.performance.irr, 0) / assets.length;
      
      // Determine if top quartile (simplified - would compare to industry benchmarks)
      const topQuartile = tvpi > 1.5 && avgIRR > 0.15;

      sectorMetrics[sector] = {
        sector,
        investmentCount: assets.length,
        totalInvested,
        currentValue,
        realizedValue,
        tvpi,
        irr: avgIRR,
        topQuartile
      };
    });

    return sectorMetrics;
  }

  // Generate comprehensive PE metrics
  generatePrivateEquityMetrics(): PrivateEquityMetrics {
    const tvpi = this.calculateTVPI();
    const dpi = this.calculateDPI();
    const rvpi = this.calculateRVPI();
    const pme = this.calculatePME();
    
    const totalInvested = this.assets.reduce((sum, asset) => sum + asset.acquisitionValue, 0);
    const totalValue = this.assets.reduce((sum, asset) => sum + asset.currentValue, 0);
    
    return {
      tvpi,
      dpi,
      rvpi,
      pme,
      vintageAnalysis: this.calculateVintageAnalysis(),
      stageAnalysis: this.calculateStageAnalysis(),
      jCurveAnalysis: this.calculateJCurveAnalysis(),
      managerAttribution: {}, // Would be populated with manager-specific data
      sectorPerformance: this.calculateSectorPerformance(),
      cumulativeContributions: totalInvested,
      cumulativeDistributions: dpi * totalInvested,
      netCashFlow: (dpi * totalInvested) - totalInvested,
      cashFlowTiming: [], // Would be populated with actual cash flow dates
      fundMultiple: tvpi,
      grossIRR: this.calculateNetIRR() + 0.02, // Approximate gross IRR
      netIRR: this.calculateNetIRR(),
      carriedInterest: Math.max(0, (totalValue - totalInvested) * 0.2), // 20% carry
      managementFees: totalInvested * 0.02 * this.getAvgHoldingPeriod() // 2% annual
    };
  }
}