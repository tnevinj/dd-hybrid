import { UnifiedAsset, PortfolioAnalytics, AssetType } from '@/types/portfolio';

export interface ProfessionalMetrics {
  // Performance Metrics
  timeWeightedReturn: number;
  sharpeRatio: number;
  sortinoRatio: number;
  informationRatio: number;
  calmarRatio: number;
  maxDrawdown: number;
  volatility: number;
  
  // Risk Metrics
  valueAtRisk95: number;
  valueAtRisk99: number;
  conditionalVaR: number;
  beta: number;
  alpha: number;
  trackingError: number;
  
  // Attribution Analysis
  sectorAttribution: Record<string, { allocation: number; selection: number; interaction: number; total: number }>;
  geographicAttribution: Record<string, { allocation: number; selection: number; interaction: number; total: number }>;
  assetTypeAttribution: Record<AssetType, { allocation: number; selection: number; interaction: number; total: number }>;
  
  // Advanced Analytics
  correlationMatrix: Record<string, Record<string, number>>;
  diversificationRatio: number;
  concentrationRisk: number;
  liquidityScore: number;
}

export class ProfessionalPortfolioAnalytics {
  private assets: UnifiedAsset[];
  private benchmarkReturn: number = 0.12; // 12% annual benchmark
  private riskFreeRate: number = 0.03; // 3% risk-free rate
  
  constructor(assets: UnifiedAsset[]) {
    this.assets = assets;
  }

  // Calculate Time-Weighted Return (TWR)
  calculateTimeWeightedReturn(): number {
    if (!this.assets.length) return 0;
    
    // For mock data, simulate proper TWR calculation
    // In real implementation, this would use cash flow dates
    const totalValue = this.assets.reduce((sum, asset) => sum + asset.currentValue, 0);
    const totalInvested = this.assets.reduce((sum, asset) => sum + asset.acquisitionValue, 0);
    
    // Simulate time-weighted calculation considering different acquisition dates
    const weightedReturns = this.assets.map(asset => {
      const yearsHeld = this.getYearsHeld(asset.acquisitionDate);
      const annualizedReturn = Math.pow(asset.currentValue / asset.acquisitionValue, 1 / yearsHeld) - 1;
      return { return: annualizedReturn, weight: asset.currentValue / totalValue };
    });
    
    return weightedReturns.reduce((sum, item) => sum + (item.return * item.weight), 0);
  }

  // Calculate Sharpe Ratio
  calculateSharpeRatio(portfolioReturn?: number, volatility?: number): number {
    const twr = portfolioReturn || this.calculateTimeWeightedReturn();
    const vol = volatility || this.calculateVolatility();
    
    if (vol === 0) return 0;
    return (twr - this.riskFreeRate) / vol;
  }

  // Calculate Sortino Ratio (downside deviation only)
  calculateSortinoRatio(): number {
    const twr = this.calculateTimeWeightedReturn();
    const downsideDeviation = this.calculateDownsideDeviation();
    
    if (downsideDeviation === 0) return 0;
    return (twr - this.riskFreeRate) / downsideDeviation;
  }

  // Calculate portfolio volatility
  calculateVolatility(): number {
    if (!this.assets.length) return 0;
    
    // Simulate volatility based on asset risk ratings and performance variance
    const returns = this.assets.map(asset => asset.performance.irr);
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    
    return Math.sqrt(variance);
  }

  // Calculate downside deviation
  calculateDownsideDeviation(): number {
    const returns = this.assets.map(asset => asset.performance.irr);
    const target = this.benchmarkReturn;
    
    const downsideReturns = returns.filter(r => r < target);
    if (downsideReturns.length === 0) return 0;
    
    const downsideVariance = downsideReturns.reduce((sum, r) => sum + Math.pow(r - target, 2), 0) / downsideReturns.length;
    return Math.sqrt(downsideVariance);
  }

  // Calculate Value at Risk (VaR)
  calculateVaR(confidenceLevel: number = 0.95): number {
    const portfolioValue = this.assets.reduce((sum, asset) => sum + asset.currentValue, 0);
    const volatility = this.calculateVolatility();
    
    // Using parametric VaR method
    const zScore = confidenceLevel === 0.95 ? 1.645 : 2.326; // 95% or 99%
    return portfolioValue * volatility * zScore;
  }

  // Calculate Maximum Drawdown
  calculateMaxDrawdown(): number {
    // Simulate drawdown based on asset risk profiles
    const riskFactors = this.assets.map(asset => {
      switch (asset.riskRating) {
        case 'low': return 0.05;
        case 'medium': return 0.15;
        case 'high': return 0.25;
        case 'critical': return 0.40;
        default: return 0.15;
      }
    });
    
    const totalValue = this.assets.reduce((sum, asset) => sum + asset.currentValue, 0);
    const weightedDrawdown = this.assets.reduce((sum, asset, index) => {
      return sum + ((asset.currentValue / totalValue) * riskFactors[index]);
    }, 0);
    
    return weightedDrawdown;
  }

  // Calculate Beta (systematic risk)
  calculateBeta(): number {
    // Simulate beta based on asset types and sectors
    const totalValue = this.assets.reduce((sum, asset) => sum + asset.currentValue, 0);
    
    const weightedBeta = this.assets.reduce((sum, asset) => {
      const weight = asset.currentValue / totalValue;
      let assetBeta = 1.0; // Default market beta
      
      // Adjust beta based on asset type and sector
      if (asset.assetType === 'infrastructure') assetBeta = 0.7; // Lower beta
      else if (asset.assetType === 'real_estate') assetBeta = 0.8;
      else if (asset.sector === 'Technology') assetBeta = 1.3; // Higher beta
      
      return sum + (weight * assetBeta);
    }, 0);
    
    return weightedBeta;
  }

  // Calculate Alpha (excess return over market)
  calculateAlpha(): number {
    const portfolioReturn = this.calculateTimeWeightedReturn();
    const beta = this.calculateBeta();
    const expectedReturn = this.riskFreeRate + beta * (this.benchmarkReturn - this.riskFreeRate);
    
    return portfolioReturn - expectedReturn;
  }

  // Performance Attribution Analysis
  calculateSectorAttribution(): Record<string, { allocation: number; selection: number; interaction: number; total: number }> {
    const portfolioValue = this.assets.reduce((sum, asset) => sum + asset.currentValue, 0);
    const attribution: Record<string, any> = {};
    
    // Group assets by sector
    const sectorGroups = this.assets.reduce((groups, asset) => {
      const sector = asset.sector || 'Other';
      if (!groups[sector]) groups[sector] = [];
      groups[sector].push(asset);
      return groups;
    }, {} as Record<string, UnifiedAsset[]>);
    
    Object.entries(sectorGroups).forEach(([sector, sectorAssets]) => {
      const sectorValue = sectorAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
      const sectorWeight = sectorValue / portfolioValue;
      const sectorReturn = sectorAssets.reduce((sum, asset) => 
        sum + (asset.performance.irr * asset.currentValue / sectorValue), 0);
      
      // Simulated benchmark weights and returns
      const benchmarkWeight = this.getBenchmarkSectorWeight(sector);
      const benchmarkReturn = this.getBenchmarkSectorReturn(sector);
      
      // Attribution calculation
      const allocation = (sectorWeight - benchmarkWeight) * benchmarkReturn;
      const selection = benchmarkWeight * (sectorReturn - benchmarkReturn);
      const interaction = (sectorWeight - benchmarkWeight) * (sectorReturn - benchmarkReturn);
      
      attribution[sector] = {
        allocation,
        selection,
        interaction,
        total: allocation + selection + interaction
      };
    });
    
    return attribution;
  }

  // Calculate Diversification Ratio
  calculateDiversificationRatio(): number {
    const weights = this.assets.map(asset => {
      const totalValue = this.assets.reduce((sum, a) => sum + a.currentValue, 0);
      return asset.currentValue / totalValue;
    });
    
    const individualVols = this.assets.map(asset => this.getAssetVolatility(asset));
    const weightedAvgVol = weights.reduce((sum, weight, i) => sum + weight * individualVols[i], 0);
    const portfolioVol = this.calculateVolatility();
    
    return portfolioVol === 0 ? 1 : weightedAvgVol / portfolioVol;
  }

  // Calculate Concentration Risk (Herfindahl Index)
  calculateConcentrationRisk(): number {
    const totalValue = this.assets.reduce((sum, asset) => sum + asset.currentValue, 0);
    const weights = this.assets.map(asset => asset.currentValue / totalValue);
    
    return weights.reduce((sum, weight) => sum + Math.pow(weight, 2), 0);
  }

  // Generate comprehensive professional metrics
  generateProfessionalMetrics(): ProfessionalMetrics {
    const twr = this.calculateTimeWeightedReturn();
    const volatility = this.calculateVolatility();
    
    return {
      timeWeightedReturn: twr,
      sharpeRatio: this.calculateSharpeRatio(twr, volatility),
      sortinoRatio: this.calculateSortinoRatio(),
      informationRatio: this.calculateInformationRatio(),
      calmarRatio: twr / this.calculateMaxDrawdown(),
      maxDrawdown: this.calculateMaxDrawdown(),
      volatility,
      valueAtRisk95: this.calculateVaR(0.95),
      valueAtRisk99: this.calculateVaR(0.99),
      conditionalVaR: this.calculateVaR(0.95) * 1.3, // Approximation
      beta: this.calculateBeta(),
      alpha: this.calculateAlpha(),
      trackingError: this.calculateTrackingError(),
      sectorAttribution: this.calculateSectorAttribution(),
      geographicAttribution: this.calculateGeographicAttribution(),
      assetTypeAttribution: this.calculateAssetTypeAttribution(),
      correlationMatrix: this.calculateCorrelationMatrix(),
      diversificationRatio: this.calculateDiversificationRatio(),
      concentrationRisk: this.calculateConcentrationRisk(),
      liquidityScore: this.calculateLiquidityScore()
    };
  }

  // Helper methods
  private getYearsHeld(acquisitionDate: string): number {
    const acquired = new Date(acquisitionDate);
    const now = new Date();
    return (now.getTime() - acquired.getTime()) / (1000 * 60 * 60 * 24 * 365);
  }

  private getBenchmarkSectorWeight(sector: string): number {
    // Simulated benchmark sector weights
    const benchmarkWeights: Record<string, number> = {
      'Technology': 0.30,
      'Real Estate': 0.20,
      'Energy': 0.15,
      'Financial': 0.15,
      'Healthcare': 0.10,
      'Other': 0.10
    };
    return benchmarkWeights[sector] || 0.05;
  }

  private getBenchmarkSectorReturn(sector: string): number {
    // Simulated benchmark sector returns
    const benchmarkReturns: Record<string, number> = {
      'Technology': 0.15,
      'Real Estate': 0.08,
      'Energy': 0.10,
      'Financial': 0.12,
      'Healthcare': 0.11,
      'Other': 0.09
    };
    return benchmarkReturns[sector] || 0.08;
  }

  private getAssetVolatility(asset: UnifiedAsset): number {
    // Simulate asset-specific volatility
    const baseVol = 0.15;
    const riskMultiplier = {
      'low': 0.7,
      'medium': 1.0,
      'high': 1.5,
      'critical': 2.0
    }[asset.riskRating] || 1.0;
    
    return baseVol * riskMultiplier;
  }

  private calculateInformationRatio(): number {
    const excessReturn = this.calculateTimeWeightedReturn() - this.benchmarkReturn;
    const trackingError = this.calculateTrackingError();
    return trackingError === 0 ? 0 : excessReturn / trackingError;
  }

  private calculateTrackingError(): number {
    // Simulate tracking error based on portfolio composition
    return 0.03; // 3% tracking error
  }

  private calculateGeographicAttribution(): Record<string, { allocation: number; selection: number; interaction: number; total: number }> {
    // Similar to sector attribution but by geography
    return this.calculateAttributionByCategory('location.country');
  }

  private calculateAssetTypeAttribution(): Record<AssetType, { allocation: number; selection: number; interaction: number; total: number }> {
    // Similar to sector attribution but by asset type
    return this.calculateAttributionByCategory('assetType') as any;
  }

  private calculateAttributionByCategory(category: string): Record<string, { allocation: number; selection: number; interaction: number; total: number }> {
    // Generic attribution calculation
    const attribution: Record<string, any> = {};
    const portfolioValue = this.assets.reduce((sum, asset) => sum + asset.currentValue, 0);
    
    // Group by category
    const groups = this.assets.reduce((acc, asset) => {
      const key = category.includes('.') ? 
        category.split('.').reduce((obj, prop) => obj[prop], asset as any) : 
        (asset as any)[category];
      
      if (!acc[key]) acc[key] = [];
      acc[key].push(asset);
      return acc;
    }, {} as Record<string, UnifiedAsset[]>);
    
    Object.entries(groups).forEach(([key, assets]) => {
      const categoryValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
      const categoryWeight = categoryValue / portfolioValue;
      const categoryReturn = assets.reduce((sum, asset) => 
        sum + (asset.performance.irr * asset.currentValue / categoryValue), 0);
      
      // Simplified attribution (would need benchmark data in real implementation)
      attribution[key] = {
        allocation: categoryWeight * 0.01, // Simplified
        selection: categoryReturn * 0.005, // Simplified
        interaction: 0.001, // Simplified
        total: categoryWeight * 0.01 + categoryReturn * 0.005 + 0.001
      };
    });
    
    return attribution;
  }

  private calculateCorrelationMatrix(): Record<string, Record<string, number>> {
    // Simulate correlation matrix between assets
    const matrix: Record<string, Record<string, number>> = {};
    
    this.assets.forEach((asset1, i) => {
      matrix[asset1.id] = {};
      this.assets.forEach((asset2, j) => {
        if (i === j) {
          matrix[asset1.id][asset2.id] = 1.0;
        } else {
          // Simulate correlation based on asset types and sectors
          let correlation = 0.3; // Base correlation
          if (asset1.assetType === asset2.assetType) correlation += 0.2;
          if (asset1.sector === asset2.sector) correlation += 0.3;
          if (asset1.location.country === asset2.location.country) correlation += 0.1;
          
          matrix[asset1.id][asset2.id] = Math.min(correlation, 0.9);
        }
      });
    });
    
    return matrix;
  }

  private calculateLiquidityScore(): number {
    // Calculate portfolio liquidity based on asset types
    const totalValue = this.assets.reduce((sum, asset) => sum + asset.currentValue, 0);
    
    const liquidityScores = {
      'traditional': 0.8, // High liquidity
      'real_estate': 0.3, // Low liquidity
      'infrastructure': 0.2 // Very low liquidity
    };
    
    const weightedLiquidity = this.assets.reduce((sum, asset) => {
      const weight = asset.currentValue / totalValue;
      const score = liquidityScores[asset.assetType] || 0.5;
      return sum + (weight * score);
    }, 0);
    
    return weightedLiquidity;
  }
}