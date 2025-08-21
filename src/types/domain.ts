// Unified domain type system
// This file provides a single entry point for all domain types

// Re-export shared domain types
export * from './shared-domain';
export * from './investment-domain';

// Re-export navigation types (already consolidated)
export * from './navigation';

// Import and re-export with namespaces for better organization
import * as SharedDomain from './shared-domain';
import * as InvestmentDomain from './investment-domain';
import * as NavigationDomain from './navigation';

export { SharedDomain, InvestmentDomain, NavigationDomain };

// Convenience type unions for common use cases
export type AnyEntity = 
  | SharedDomain.BaseEntity 
  | InvestmentDomain.Investment.DealOpportunity 
  | InvestmentDomain.Investment.PortfolioCompany 
  | InvestmentDomain.Investment.Fund;

export type AnyStatus = SharedDomain.Status | 'screening' | 'due-diligence' | 'structuring' | 'closed' | 'declined';
export type AnyPriority = SharedDomain.Priority;
export type AnyRiskLevel = SharedDomain.RiskLevel;

// Common search and filter types that work across all domains
export type DomainSearchFilter = SharedDomain.SearchFilter & {
  domain?: 'deal-screening' | 'due-diligence' | 'portfolio' | 'fund-operations' | 'investment-committee';
};

export type DomainSearchQuery = Omit<SharedDomain.SearchQuery, 'filters'> & {
  filters?: DomainSearchFilter[];
  domains?: string[];
};

// Unified API response types
export type DomainApiResponse<T> = SharedDomain.ApiResponse<T>;
export type DomainPaginatedResponse<T> = SharedDomain.PaginatedResponse<T>;

// Type guards for runtime type checking
export const isDealOpportunity = (entity: AnyEntity): entity is InvestmentDomain.Investment.DealOpportunity => {
  return 'askPrice' in entity && 'screeningStatus' in entity;
};

export const isPortfolioCompany = (entity: AnyEntity): entity is InvestmentDomain.Investment.PortfolioCompany => {
  return 'investmentDate' in entity && 'ownershipPercentage' in entity;
};

export const isFund = (entity: AnyEntity): entity is InvestmentDomain.Investment.Fund => {
  return 'fundNumber' in entity && 'vintage' in entity;
};

export const isDueDiligenceProject = (entity: AnyEntity): entity is InvestmentDomain.Investment.DueDiligenceProject => {
  return 'phase' in entity && 'workstreams' in entity;
};

// Validation helpers
export const isValidPriority = (value: string): value is SharedDomain.Priority => {
  return ['low', 'medium', 'high', 'critical'].includes(value);
};

export const isValidStatus = (value: string): value is SharedDomain.Status => {
  return ['active', 'completed', 'draft', 'review', 'cancelled'].includes(value);
};

export const isValidRiskLevel = (value: string): value is SharedDomain.RiskLevel => {
  return ['low', 'medium', 'high', 'critical'].includes(value);
};

// Default values for common types
export const DEFAULT_PRIORITY: SharedDomain.Priority = 'medium';
export const DEFAULT_STATUS: SharedDomain.Status = 'draft';
export const DEFAULT_RISK_LEVEL: SharedDomain.RiskLevel = 'medium';

// Common transformation utilities
export const formatCurrency = (amount: number, currency: SharedDomain.Currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    notation: amount >= 1000000 ? 'compact' : 'standard',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Risk calculation utilities
export const calculateRiskScore = (probability: 'low' | 'medium' | 'high', impact: 'low' | 'medium' | 'high'): number => {
  const probMap = { low: 1, medium: 2, high: 3 };
  const impactMap = { low: 1, medium: 2, high: 3 };
  return probMap[probability] * impactMap[impact];
};

export const getRiskLevel = (score: number): SharedDomain.RiskLevel => {
  if (score >= 7) return 'critical';
  if (score >= 5) return 'high';
  if (score >= 3) return 'medium';
  return 'low';
};

// Performance calculation utilities
export const calculateMOIC = (currentValue: number, investedCapital: number): number => {
  if (investedCapital === 0) return 0;
  return currentValue / investedCapital;
};

export const calculateIRR = (cashFlows: number[], dates: Date[]): number => {
  // Simplified IRR calculation - in production, use a financial library
  if (cashFlows.length !== dates.length || cashFlows.length < 2) return 0;
  
  // This is a placeholder - implement proper IRR calculation
  const totalInvested = -cashFlows.filter(cf => cf < 0).reduce((sum, cf) => sum + cf, 0);
  const totalReturned = cashFlows.filter(cf => cf > 0).reduce((sum, cf) => sum + cf, 0);
  
  if (totalInvested === 0) return 0;
  
  const multiple = totalReturned / totalInvested;
  const years = (dates[dates.length - 1].getTime() - dates[0].getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  
  if (years === 0) return 0;
  
  return Math.pow(multiple, 1 / years) - 1;
};

// Entity creation helpers
export const createBaseEntity = (name: string, description?: string): SharedDomain.BaseEntity => ({
  id: `entity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  name,
  description,
  createdAt: new Date(),
  updatedAt: new Date()
});

export const createTimestampedEntity = (userId?: string): SharedDomain.TimestampedEntity => ({
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: userId,
  updatedBy: userId
});

// Common validation schemas (for use with validation libraries)
export const CommonSchemas = {
  priority: ['low', 'medium', 'high', 'critical'] as const,
  status: ['active', 'completed', 'draft', 'review', 'cancelled'] as const,
  riskLevel: ['low', 'medium', 'high', 'critical'] as const,
  currency: ['USD', 'EUR', 'GBP', 'JPY'] as const,
  geography: ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East & Africa', 'Global'] as const,
  sector: [
    'Technology', 'Healthcare', 'Financial Services', 'Energy', 'Consumer', 
    'Industrial', 'Real Estate', 'Telecommunications', 'Media & Entertainment', 
    'Education', 'Government', 'Other'
  ] as const
};