export type AssetType = 'traditional' | 'real_estate' | 'infrastructure';

export type AssetStatus = 'active' | 'exited' | 'under_review' | 'disposed';

export type RiskRating = 'low' | 'medium' | 'high' | 'critical';

export interface Location {
  country: string;
  region: string;
  city?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface ESGMetrics {
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  overallScore: number;
  carbonFootprint?: number;
  jobsCreated?: number;
  communityImpact?: number;
  diversityScore?: number;
  sustainabilityCertifications: string[];
}

export interface PerformanceMetrics {
  irr: number;
  moic: number;
  tvpi?: number;
  dpi?: number;
  rvpi?: number;
  currentYield?: number;
  totalReturn: number;
  benchmarkComparison?: number;
  riskAdjustedReturn?: number;
}

export interface BaseAsset {
  id: string;
  name: string;
  assetType: AssetType;
  description?: string;
  acquisitionDate: string;
  acquisitionValue: number;
  currentValue: number;
  location: Location;
  performance: PerformanceMetrics;
  esgMetrics: ESGMetrics;
  status: AssetStatus;
  riskRating: RiskRating;
  sector?: string;
  tags: string[];
  lastUpdated?: string;
  nextReviewDate?: string;
}

// Traditional Investment Specific
export interface TraditionalMetrics {
  companyStage: 'seed' | 'series_a' | 'series_b' | 'series_c' | 'growth' | 'mature';
  fundingRounds: number;
  employeeCount: number;
  revenue: number;
  ebitda: number;
  debtToEquity: number;
  marketCap?: number;
  enterprise_value?: number;
  boardSeats: number;
  ownershipPercentage: number;
}

export interface TraditionalAsset extends BaseAsset {
  assetType: 'traditional';
  specificMetrics: TraditionalMetrics;
  companyInfo: {
    foundedYear: number;
    businessModel: string;
    keyProducts: string[];
    competitiveAdvantages: string[];
  };
}

// Real Estate Specific
export interface RealEstateMetrics {
  propertyType: 'office' | 'retail' | 'industrial' | 'residential' | 'mixed_use';
  totalSqFt: number;
  occupancyRate: number;
  avgLeaseLength: number;
  capRate: number;
  noiYield: number;
  loanToValue?: number;
  debtServiceCoverageRatio?: number;
  vacancyRate: number;
  avgRentPsf: number;
}

export interface RealEstateAsset extends BaseAsset {
  assetType: 'real_estate';
  specificMetrics: RealEstateMetrics;
  propertyDetails: {
    yearBuilt: number;
    lastRenovation?: number;
    parkingSpaces?: number;
    amenities: string[];
    zoning: string;
    propertyTaxes: number;
  };
  leaseInfo: {
    majorTenants: Array<{
      name: string;
      sqFt: number;
      leaseExpiry: string;
      rentPsf: number;
    }>;
  };
}

// Infrastructure Specific
export interface InfrastructureMetrics {
  assetCategory: 'energy' | 'transport' | 'water' | 'telecom' | 'social';
  capacityUtilization: number;
  operationalEfficiency: number;
  maintenanceScore: number;
  regulatoryCompliance: number;
  contractedRevenue: number;
  availabilityRate: number;
  throughputCapacity?: number;
  averageLifespan: number;
}

export interface InfrastructureAsset extends BaseAsset {
  assetType: 'infrastructure';
  specificMetrics: InfrastructureMetrics;
  operationalData: {
    commissionDate: string;
    designLife: number;
    currentAge: number;
    nextMajorMaintenance?: string;
    operatingLicense?: {
      licenseNumber: string;
      expiryDate: string;
      renewalRequired: boolean;
    };
  };
  contractualInfo: {
    contractType: 'availability' | 'usage' | 'hybrid';
    contractorName: string;
    contractExpiry: string;
    renewalOptions: number;
  };
}

export type UnifiedAsset = TraditionalAsset | RealEstateAsset | InfrastructureAsset;

export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  assetTypes: AssetType[];
  assets: UnifiedAsset[];
  totalValue: number;
  totalInvested: number;
  totalRealized: number;
  unrealizedValue: number;
  performanceMetrics: PerformanceMetrics;
  allocationTargets?: {
    [key in AssetType]?: number;
  };
  riskProfile: RiskRating;
  managerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardTab {
  id: string;
  label: string;
  component: string;
  icon?: string;
  order: number;
  requiredAssetTypes?: AssetType[];
  permissions?: string[];
}

export interface MetricsModule {
  id: string;
  name: string;
  component: string;
  assetTypes: AssetType[];
  order: number;
  size?: 'small' | 'medium' | 'large';
}

export interface AnalyticsFeature {
  id: string;
  name: string;
  description: string;
  component: string;
  requiredData: string[];
  supportedAssetTypes: AssetType[];
}

export interface PortfolioConfig {
  assetType?: AssetType;
  dashboardTabs: DashboardTab[];
  metricsModules: MetricsModule[];
  analyticsFeatures: AnalyticsFeature[];
  defaultFilters?: Record<string, any>;
  customizations?: Record<string, any>;
}

export interface PortfolioState {
  portfolios: Portfolio[];
  currentPortfolio?: Portfolio;
  selectedAssets: string[];
  filters: {
    assetType?: AssetType[];
    status?: AssetStatus[];  
    riskRating?: RiskRating[];
    sector?: string[];
    location?: string[];
    search?: string;
  };
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  loading: boolean;
  error?: string;
}

export interface PortfolioAction {
  type: 'SET_PORTFOLIOS' | 'SET_CURRENT_PORTFOLIO' | 'UPDATE_ASSET' | 'ADD_ASSET' | 
        'REMOVE_ASSET' | 'SET_FILTERS' | 'SET_SELECTED_ASSETS' | 'SET_LOADING' | 
        'SET_ERROR' | 'CLEAR_ERROR' | 'SET_SORT';
  payload?: any;
}

export interface AssetFormData {
  name: string;
  assetType: AssetType;
  description?: string;
  acquisitionDate: string;
  acquisitionValue: number;
  currentValue: number;
  location: Location;
  sector?: string;
  tags: string[];
  specificMetrics: TraditionalMetrics | RealEstateMetrics | InfrastructureMetrics;
}

export interface PortfolioAnalytics {
  totalPortfolioValue: number;
  totalInvested: number;
  totalRealized: number;
  unrealizedGains: number;
  weightedIRR: number;
  weightedMOIC: number;
  assetAllocation: Record<AssetType, number>;
  sectorAllocation: Record<string, number>;
  geographicAllocation: Record<string, number>;
  riskDistribution: Record<RiskRating, number>;
  performanceTrend: Array<{
    date: string;
    value: number;
    irr: number;
  }>;
  esgScore: number;
  benchmarkComparison: {
    portfolio: number;
    benchmark: number;
    outperformance: number;
  };
}