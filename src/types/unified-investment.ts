export type InvestmentType = 'internal' | 'external' | 'co_investment' | 'fund';
export type InvestmentStatus = 'screening' | 'due_diligence' | 'structuring' | 'active' | 'divested' | 'rejected';
export type RiskRating = 'low' | 'medium' | 'high' | 'critical';

export interface Location {
  country?: string;
  region?: string;
  city?: string;
}

export interface ESGMetrics {
  environmentalScore?: number;
  socialScore?: number;
  governanceScore?: number;
  overallScore?: number;
  jobsCreated?: number;
  carbonFootprint?: number;
  sustainabilityCertifications?: string[];
}

export interface BaseInvestment {
  id: string;
  name: string;
  investmentType: InvestmentType;
  assetType: string;
  description?: string;
  status: InvestmentStatus;
  riskRating?: RiskRating;
  sector?: string;
  geography?: string;
  created: string;
  lastUpdated: string;
}

export interface InternalInvestment extends BaseInvestment {
  investmentType: 'internal';
  currentValue?: number;
  acquisitionValue?: number;
  acquisitionDate?: string;
  location?: Location;
  esgMetrics?: ESGMetrics;
  specificMetrics?: any;
  tags?: string[];
  portfolioId?: string;
}

export interface ExternalInvestment extends BaseInvestment {
  investmentType: 'external';
  targetValue?: number;
  expectedReturn?: number;
  expectedRisk?: number;
  expectedMultiple?: number;
  expectedIrr?: number;
  expectedHoldingPeriod?: number;
  seller?: string;
  vintage?: string;
  navPercentage?: number;
  dueDiligenceProjectId?: string;
  submissionId?: string;
  aiConfidence?: number;
  similarInvestments?: any[];
  aiRecommendations?: any[];
  workspaceId?: string;
}

export interface CoInvestment extends BaseInvestment {
  investmentType: 'co_investment';
  // Co-investment specific fields
  leadInvestor?: string;
  syndicateSize?: number;
  minimumCommitment?: number;
  targetValue?: number;
  expectedReturn?: number;
}

export interface FundInvestment extends BaseInvestment {
  investmentType: 'fund';
  // Fund specific fields
  fundManager?: string;
  fundSize?: number;
  vintageYear?: number;
  targetValue?: number;
  expectedReturn?: number;
}

export type UnifiedInvestment = InternalInvestment | ExternalInvestment | CoInvestment | FundInvestment;
